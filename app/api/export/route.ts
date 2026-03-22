import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit";
import { auth } from "@/lib/auth";
import type { CvParsed } from "@/types";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { optimizationId, acceptedBullets, cvParsed } = (await request.json()) as {
    optimizationId: string;
    acceptedBullets: string[];
    cvParsed: CvParsed;
  };

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: cvParsed.name,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun({ text: cvParsed.email, color: "666666", size: 20 })],
          }),
          new Paragraph({ text: "" }),

          // Summary
          new Paragraph({
            text: "Professional Summary",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: cvParsed.summary }),
          new Paragraph({ text: "" }),

          // Skills
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: cvParsed.skills.join(" • ") }),
          new Paragraph({ text: "" }),

          // Experience with rewritten bullets
          new Paragraph({
            text: "Experience",
            heading: HeadingLevel.HEADING_2,
          }),
          ...cvParsed.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true }),
                new TextRun({ text: ` at ${exp.company}` }),
                new TextRun({ text: ` | ${exp.dates}`, color: "666666" }),
              ],
            }),
            ...acceptedBullets
              .filter((_, i) => {
                // Map bullets back to experience entries
                let count = 0;
                for (const e of cvParsed.experience) {
                  const prevCount = count;
                  count += e.bullets.length;
                  if (i >= prevCount && i < count) return e === exp;
                }
                return false;
              })
              .map(
                (bullet) =>
                  new Paragraph({
                    text: `• ${bullet}`,
                  }),
              ),
            new Paragraph({ text: "" }),
          ]),

          // Education
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
          }),
          ...cvParsed.education.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun({ text: ` — ${edu.school}` }),
                new TextRun({ text: ` (${edu.year})`, color: "666666" }),
              ],
            }),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  await logAudit(session.user.id, "cv.exported", { optimizationId });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="cv_westernized.docx"`,
    },
  });
}
