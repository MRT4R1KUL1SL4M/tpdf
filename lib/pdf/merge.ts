import { PDFDocument } from "@cantoo/pdf-lib";

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Please provide at least one PDF file to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

