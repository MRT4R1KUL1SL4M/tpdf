import { PDFDocument, degrees } from "@cantoo/pdf-lib";

export interface PageOrganizeItem {
  id: string;
  originalIndex: number; // 0-indexed in original document
  displayPageNumber: number; // current position
  rotation: number; // 0, 90, 180, 270
  dataUrl: string;
}

export async function saveOrganizedPdf(
  file: File,
  pages: PageOrganizeItem[]
): Promise<Uint8Array> {
  if (pages.length === 0) {
    throw new Error("Cannot generate a PDF with zero pages. Please keep at least one page.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const item of pages) {
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [item.originalIndex]);
    const currentAngle = copiedPage.getRotation().angle;
    const finalAngle = (currentAngle + item.rotation) % 360;
    copiedPage.setRotation(degrees(finalAngle));
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save({ useObjectStreams: true });
}

