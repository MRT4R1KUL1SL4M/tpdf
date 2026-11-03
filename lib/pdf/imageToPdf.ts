import { PDFDocument } from "@cantoo/pdf-lib";

export type PageSizeOption = "a4" | "letter" | "fit";
export type OrientationOption = "portrait" | "landscape" | "auto";

export interface ImageToPdfOptions {
  pageSize: PageSizeOption;
  orientation: OrientationOption;
  margin: number; // in points, e.g. 20
}

const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612.0, height: 792.0 },
};

async function convertImageToStandardBytes(file: File): Promise<{
  bytes: Uint8Array;
  type: "jpg" | "png";
  naturalWidth: number;
  naturalHeight: number;
}> {
  // If file is already standard JPG or PNG, check if we can embed directly or convert
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to create canvas context"));
        return;
      }

      // Draw with white background in case of transparent PNG/WebP
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Export as high quality JPEG
      canvas.toBlob(
        async (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("Failed to process image"));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve({
            bytes: new Uint8Array(buf),
            type: "jpg",
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });
        },
        "image/jpeg",
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

export async function convertImagesToPdf(
  files: File[],
  options: ImageToPdfOptions = { pageSize: "a4", orientation: "portrait", margin: 20 }
): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Please provide at least one image.");
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const { bytes, naturalWidth, naturalHeight } = await convertImageToStandardBytes(file);
    const embeddedImage = await pdfDoc.embedJpg(bytes);

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "fit") {
      pageWidth = naturalWidth;
      pageHeight = naturalHeight;
    } else {
      const base = PAGE_SIZES[options.pageSize];
      let isLandscape = options.orientation === "landscape";
      if (options.orientation === "auto") {
        isLandscape = naturalWidth > naturalHeight;
      }

      pageWidth = isLandscape ? Math.max(base.width, base.height) : Math.min(base.width, base.height);
      pageHeight = isLandscape ? Math.min(base.width, base.height) : Math.max(base.width, base.height);
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    if (options.pageSize === "fit") {
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    } else {
      const margin = options.margin;
      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      // Calculate scale to maintain aspect ratio
      const scaleX = availableWidth / naturalWidth;
      const scaleY = availableHeight / naturalHeight;
      const scale = Math.min(scaleX, scaleY);

      const drawWidth = naturalWidth * scale;
      const drawHeight = naturalHeight * scale;

      // Center the image
      const x = margin + (availableWidth - drawWidth) / 2;
      const y = margin + (availableHeight - drawHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  return await pdfDoc.save();
}

