import { PDFDocument } from "@cantoo/pdf-lib";

export async function unlockPdfFile(
  file: File,
  password: string
): Promise<Uint8Array> {
  if (!password) {
    throw new Error("Please enter the document password.");
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    // Load with provided password
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password });

    // Saving without calling .encrypt() removes encryption
    const unlockedBytes = await pdfDoc.save();
    return unlockedBytes;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("password") || message.toLowerCase().includes("decrypt")) {
      throw new Error("Incorrect password. Please verify and try again.");
    }
    throw new Error("Unable to decrypt document. Please confirm the password is correct.");
  }
}

export async function isPdfEncrypted(file: File): Promise<boolean> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    await PDFDocument.load(arrayBuffer);
    return false;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    return msg.toLowerCase().includes("password") || msg.toLowerCase().includes("encrypt");
  }
}

