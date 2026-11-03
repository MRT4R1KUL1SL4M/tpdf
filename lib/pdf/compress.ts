import { PDFDocument } from "@cantoo/pdf-lib";

export type CompressionLevel = "low" | "recommended" | "high";

export interface CompressionResult {
  pdfBytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}

export async function compressPdfFile(
  file: File,
  level: CompressionLevel = "recommended"
): Promise<CompressionResult> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();

  // Mode 1: Low Compression
  // Clean orphan objects, rebuild xref table, enable object stream compression
  if (level === "low") {
    const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const cleanDoc = await PDFDocument.create();
    const copiedPages = await cleanDoc.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => cleanDoc.addPage(page));

    // Save with object streams enabled
    const pdfBytes = await cleanDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const compressedSize = pdfBytes.byteLength;
    const savingsPercentage = Math.max(
      0,
      Math.round(((originalSize - compressedSize) / originalSize) * 100)
    );

    return {
      pdfBytes,
      originalSize,
      compressedSize,
      savingsPercentage,
    };
  }

  // Mode 2: Recommended & High Compression
  // In the browser, we inspect the document. If it has high-resolution raster images or heavy vector content,
  // we optimize it by copying clean page structures or rendering optimized compressed representations.
  if (typeof window !== "undefined" && (level === "recommended" || level === "high")) {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Recommended: scale 1.5, quality 0.75
      // High: scale 1.0, quality 0.55
      const scale = level === "high" ? 1.0 : 1.4;
      const jpegQuality = level === "high" ? 0.55 : 0.75;

      const newDoc = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport,
            canvas,
          } as unknown as Parameters<typeof page.render>[0]).promise;

          const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
          const base64Data = dataUrl.split(",")[1];
          const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

          const embeddedImage = await newDoc.embedJpg(imageBytes);
          const originalViewport = page.getViewport({ scale: 1.0 });

          const newPage = newDoc.addPage([originalViewport.width, originalViewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: originalViewport.width,
            height: originalViewport.height,
          });
        }
      }

      const optimizedBytes = await newDoc.save({ useObjectStreams: true });

      // If optimized is actually smaller, return it. Otherwise return the clean object stream version.
      if (optimizedBytes.byteLength < originalSize) {
        return {
          pdfBytes: optimizedBytes,
          originalSize,
          compressedSize: optimizedBytes.byteLength,
          savingsPercentage: Math.round(((originalSize - optimizedBytes.byteLength) / originalSize) * 100),
        };
      }
    } catch {
      // Fallback to object stream cleanup if canvas rendering fails
    }
  }

  // Default clean object stream compression
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const cleanDoc = await PDFDocument.create();
  const copiedPages = await cleanDoc.copyPages(sourcePdf, sourcePdf.getPageIndices());
  copiedPages.forEach((page) => cleanDoc.addPage(page));

  const pdfBytes = await cleanDoc.save({
    useObjectStreams: true,
  });

  const compressedSize = pdfBytes.byteLength;
  const savingsPercentage = Math.max(
    0,
    Math.round(((originalSize - compressedSize) / originalSize) * 100)
  );

  return {
    pdfBytes,
    originalSize,
    compressedSize,
    savingsPercentage,
  };
}

