import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  Footer,
  Header,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit";
import { auth } from "@/lib/auth";
import type { CvParsed } from "@/types";

// ── Design tokens ──
const FONT = "Calibri";
const COLOR = {
  dark: "1e293b",
  text: "334155",
  muted: "64748b",
  accent: "2563eb",
  accentLight: "dbeafe",
  divider: "cbd5e1",
};
const SIZE = { name: 32, heading: 20, normal: 19, small: 17, tiny: 15 };

// ── Helpers ──

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    shading: { type: ShadingType.CLEAR, fill: COLOR.accentLight, color: "auto" },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: COLOR.accent, space: 6 },
    },
    children: [
      new TextRun({
        text: `  ${text.toUpperCase()}`,
        font: FONT,
        size: SIZE.heading,
        bold: true,
        color: COLOR.accent,
        characterSpacing: 40,
      }),
    ],
  });
}

interface AcceptedBullet {
  index: number;
  text: string;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { optimizationId, acceptedBullets, cvParsed } = (await request.json()) as {
    optimizationId: string;
    acceptedBullets: AcceptedBullet[];
    cvParsed: CvParsed;
  };

  // Build lookup: flat bullet index → accepted rewritten text
  const acceptedByIndex = new Map<number, string>();
  for (const b of acceptedBullets) {
    acceptedByIndex.set(b.index, b.text);
  }

  // Map bullets to experience entries (accepted → rewritten, others → original)
  const experienceEntries: { exp: CvParsed["experience"][number]; bullets: string[] }[] = [];
  let flatIdx = 0;
  for (const exp of cvParsed.experience) {
    const bullets: string[] = [];
    for (const originalBullet of exp.bullets) {
      bullets.push(acceptedByIndex.get(flatIdx) ?? originalBullet);
      flatIdx++;
    }
    experienceEntries.push({ exp, bullets });
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE.normal, color: COLOR.text },
          paragraph: { spacing: { line: 260 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
            },
          },
        },
        headers: { default: new Header({ children: [] }) },
        footers: { default: new Footer({ children: [] }) },
        children: [
          // ── Name ──
          new Paragraph({
            spacing: { before: 60, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: cvParsed.name.toUpperCase(),
                font: FONT,
                size: SIZE.name,
                bold: true,
                color: COLOR.dark,
                characterSpacing: 80,
              }),
            ],
          }),
          // ── Email ──
          new Paragraph({
            spacing: { before: 0, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: cvParsed.email,
                font: FONT,
                size: SIZE.small,
                color: COLOR.accent,
              }),
            ],
          }),
          // ── Accent divider ──
          new Paragraph({
            spacing: { before: 0, after: 0 },
            alignment: AlignmentType.CENTER,
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR.accent, space: 0 },
            },
            children: [],
          }),

          // ── Summary ──
          sectionHeading("Professional Summary"),
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: cvParsed.summary,
                font: FONT,
                size: SIZE.normal,
                color: COLOR.muted,
                italics: true,
              }),
            ],
          }),

          // ── Skills ──
          sectionHeading("Skills"),
          new Paragraph({
            spacing: { after: 40 },
            children: cvParsed.skills.flatMap((skill, i) => [
              ...(i > 0
                ? [
                    new TextRun({
                      text: "  ·  ",
                      font: FONT,
                      size: SIZE.small,
                      color: COLOR.divider,
                    }),
                  ]
                : []),
              new TextRun({
                text: skill,
                font: FONT,
                size: SIZE.normal,
                color: COLOR.dark,
                bold: true,
              }),
            ]),
          }),

          // ── Experience ──
          sectionHeading("Experience"),
          ...experienceEntries.flatMap(({ exp, bullets }, expIdx) => [
            // Divider between entries (not before first)
            ...(expIdx > 0
              ? [
                  new Paragraph({
                    spacing: { before: 80, after: 80 },
                    border: {
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR.divider, space: 0 },
                    },
                    children: [],
                  }),
                ]
              : []),
            // Title + Company
            new Paragraph({
              spacing: { before: 40, after: 0 },
              children: [
                new TextRun({
                  text: exp.title,
                  font: FONT,
                  size: SIZE.normal,
                  bold: true,
                  color: COLOR.dark,
                }),
                new TextRun({
                  text: `  ·  ${exp.company}`,
                  font: FONT,
                  size: SIZE.normal,
                  color: COLOR.accent,
                }),
              ],
            }),
            // Dates on own line
            new Paragraph({
              spacing: { before: 0, after: 40 },
              children: [
                new TextRun({
                  text: exp.dates,
                  font: FONT,
                  size: SIZE.tiny,
                  color: COLOR.muted,
                  italics: true,
                }),
              ],
            }),
            // Bullets
            ...bullets.map(
              (bullet) =>
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  indent: { left: convertInchesToTwip(0.2), hanging: convertInchesToTwip(0.2) },
                  children: [
                    new TextRun({
                      text: "▪  ",
                      font: FONT,
                      size: SIZE.normal,
                      color: COLOR.accent,
                    }),
                    new TextRun({
                      text: bullet,
                      font: FONT,
                      size: SIZE.normal,
                      color: COLOR.text,
                    }),
                  ],
                }),
            ),
          ]),

          // ── Education ──
          sectionHeading("Education"),
          ...cvParsed.education.map(
            (edu) =>
              new Paragraph({
                spacing: { before: 40, after: 0 },
                children: [
                  new TextRun({
                    text: edu.degree,
                    font: FONT,
                    size: SIZE.normal,
                    bold: true,
                    color: COLOR.dark,
                  }),
                  new TextRun({
                    text: `  —  ${edu.school}`,
                    font: FONT,
                    size: SIZE.normal,
                    color: COLOR.muted,
                  }),
                  new TextRun({
                    text: `  ·  ${edu.year}`,
                    font: FONT,
                    size: SIZE.tiny,
                    color: COLOR.muted,
                    italics: true,
                  }),
                ],
              }),
          ),
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
