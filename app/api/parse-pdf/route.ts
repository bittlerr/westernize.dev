import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { claude } from "@/lib/claude";
import { validatePdf } from "@/lib/pdf";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const isPaid = session.user.isLifetime || session.user.credits > 1;
  const validation = await validatePdf(buffer, isPaid);

  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const uploaded = await claude.beta.files.upload({
    file: new File([buffer], file.name, { type: "application/pdf" }),
  });

  return Response.json({
    fileId: uploaded.id,
    pageCount: validation.pageCount,
  });
}
