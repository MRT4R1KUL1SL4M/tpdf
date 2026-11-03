/**
 * PDF Thumbnail renderer using pdfjs-dist
 */

export interface PageThumbnail {
  pageNumber: number; // 1-indexed
  dataUrl: string;
  width: number;
  height: number;
  rotation: number;
}

export async function renderPdfThumbnails(
  file: File,
  scale: number = 0.35,
  maxPages: number = 200
): Promise<PageThumbnail[]> {
  if (typeof window === "undefined") {
    return [];
  }

  // Dynamically import pdfjs-dist on client side
  const pdfjsLib = await import("pdfjs-dist");

  // Point worker to local public file copied during setup
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = Math.min(pdfDoc.numPages, maxPages);
  const thumbnails: PageThumbnail[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render with white background
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      } as unknown as Parameters<typeof page.render>[0]).promise;

      thumbnails.push({
        pageNumber: i,
        dataUrl: canvas.toDataURL("image/jpeg", 0.8),
        width: viewport.width,
        height: viewport.height,
        rotation: 0,
      });
    }
  }

  return thumbnails;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import("@cantoo/pdf-lib");
  const buffer = await file.arrayBuffer();
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return doc.getPageCount();
}

