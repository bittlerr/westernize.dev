import { renderToBuffer } from "@react-pdf/renderer";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { CvDocument } from "@/lib/cv-pdf";
import type { CvParsed } from "@/types";

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

  const acceptedByIndex = new Map<number, string>();

  for (const b of acceptedBullets) {
    acceptedByIndex.set(b.index, b.text);
  }

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

  const buffer = await renderToBuffer(<CvDocument cvParsed={cvParsed} experienceEntries={experienceEntries} />);

  await logAudit(session.user.id, "cv.exported.pdf", { optimizationId });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cv_westernized.pdf"`,
    },
  });
}
