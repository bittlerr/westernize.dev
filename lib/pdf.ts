import { PDFParse } from "pdf-parse";

const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

const FREE_MAX_PAGES = 5;
const PAID_MAX_PAGES = 7;
const FREE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const PAID_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function validatePdf(
  buffer: Buffer,
  isPaid: boolean,
): Promise<{ valid: true; pageCount: number } | { valid: false; error: string }> {
  if (!buffer.subarray(0, 4).equals(PDF_MAGIC)) {
    return { valid: false, error: "File is not a valid PDF" };
  }

  const maxSize = isPaid ? PAID_MAX_SIZE : FREE_MAX_SIZE;

  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File exceeds ${isPaid ? "10MB" : "5MB"} limit`,
    };
  }

  const pdf = new PDFParse({ data: new Uint8Array(buffer) });
  const info = await pdf.getInfo();

  await pdf.destroy();

  const maxPages = isPaid ? PAID_MAX_PAGES : FREE_MAX_PAGES;

  if (info.total > maxPages) {
    return {
      valid: false,
      error: `PDF exceeds ${maxPages} page limit`,
    };
  }

  return { valid: true, pageCount: info.total };
}
