import { PDFDocument } from "@cantoo/pdf-lib";

export interface LockPdfOptions {
  userPassword: string;
  ownerPassword?: string;
}

export async function lockPdfFile(
  file: File,
  options: LockPdfOptions
): Promise<Uint8Array> {
  if (!options.userPassword || options.userPassword.trim().length === 0) {
    throw new Error("Password cannot be empty.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Encrypt using AES-256
  pdfDoc.encrypt({
    userPassword: options.userPassword,
    ownerPassword: options.ownerPassword || options.userPassword,
  });

  return await pdfDoc.save();
}

