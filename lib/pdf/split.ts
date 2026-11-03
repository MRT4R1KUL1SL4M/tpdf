import { PDFDocument } from "@cantoo/pdf-lib";
import JSZip from "jszip";

export function parsePageRanges(rangeString: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeString.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(maxPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Extract selected pages into a single new PDF
 */
export async function extractSelectedPages(
  file: File,
  selectedPages1Indexed: number[]
): Promise<Uint8Array> {
  if (selectedPages1Indexed.length === 0) {
    throw new Error("No pages selected for extraction.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  // 1-indexed to 0-indexed
  const indicesToCopy = selectedPages1Indexed
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < sourcePdf.getPageCount());

  const copiedPages = await newPdf.copyPages(sourcePdf, indicesToCopy);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Split a PDF into separate individual single-page PDFs and bundle into a ZIP
 */
export async function splitAllPagesToZip(
  file: File,
  pageNumbers1Indexed?: number[]
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  const pagesToSplit = pageNumbers1Indexed && pageNumbers1Indexed.length > 0
    ? pageNumbers1Indexed
    : Array.from({ length: totalPages }, (_, i) => i + 1);

  const zip = new JSZip();
  const baseName = file.name.replace(/\.pdf$/i, "");

  for (const pageNum of pagesToSplit) {
    const singleDoc = await PDFDocument.create();
    const [copied] = await singleDoc.copyPages(sourcePdf, [pageNum - 1]);
    singleDoc.addPage(copied);
    const pdfBytes = await singleDoc.save();
    zip.file(`${baseName}-page-${pageNum}.pdf`, pdfBytes);
  }

  return await zip.generateAsync({ type: "blob" });
}

