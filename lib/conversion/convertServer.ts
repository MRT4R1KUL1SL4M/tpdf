import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";

const execFileAsync = promisify(execFile);

// Candidate LibreOffice paths across Windows and Unix
const LIBREOFFICE_PATHS = [
  process.env.LIBREOFFICE_PATH,
  "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
  "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
  "/usr/bin/soffice",
  "/usr/local/bin/soffice",
  "/Applications/LibreOffice.app/Contents/MacOS/soffice",
  "soffice",
].filter(Boolean) as string[];

async function findLibreOffice(): Promise<string | null> {
  for (const candidate of LIBREOFFICE_PATHS) {
    try {
      if (path.isAbsolute(candidate)) {
        await fs.access(candidate);
        return candidate;
      } else {
        // Test if in PATH
        await execFileAsync(candidate, ["--version"]);
        return candidate;
      }
    } catch {
      // Continue searching
    }
  }
  return null;
}

/**
 * Pure TypeScript conversion for Plain Text
 */
async function convertTxtToPdf(content: string, filename: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 10;
  const lineHeight = 14;
  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Document header
  currentPage.drawText(filename, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: rgb(0.16, 0.15, 0.13),
  });
  currentY -= 24;

  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    // Word wrap
    const words = rawLine.split(" ");
    let lineBuffer = "";

    for (let w = 0; w < words.length; w++) {
      const testLine = lineBuffer ? `${lineBuffer} ${words[w]}` : words[w];
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > printableWidth && lineBuffer) {
        if (currentY - lineHeight < margin) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        currentPage.drawText(lineBuffer, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= lineHeight;
        lineBuffer = words[w];
      } else {
        lineBuffer = testLine;
      }
    }

    if (lineBuffer) {
      if (currentY - lineHeight < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
      currentPage.drawText(lineBuffer, {
        x: margin,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= lineHeight;
    }
  }

  return await pdfDoc.save();
}

/**
 * Pure TypeScript conversion for DOCX using Mammoth
 */
async function convertDocxToPdf(buffer: Buffer, filename: string): Promise<Uint8Array> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;
  return await convertTxtToPdf(text, filename);
}

/**
 * Pure TypeScript conversion for XLSX / XLS / CSV
 */
async function convertSpreadsheetToPdf(buffer: Buffer, filename: string): Promise<Uint8Array> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 841.89; // Landscape A4 for spreadsheets
  const pageHeight = 595.28;
  const margin = 40;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length === 0) continue;

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    // Sheet Title
    currentPage.drawText(`${filename} — ${sheetName}`, {
      x: margin,
      y: currentY,
      size: 13,
      font: boldFont,
      color: rgb(0.16, 0.15, 0.13),
    });
    currentY -= 25;

    // Compute column widths based on max content
    const colCount = Math.max(...data.map((row) => row.length));
    const maxCols = Math.min(colCount, 8); // Display first 8 columns to fit landscape
    const colWidth = (pageWidth - margin * 2) / maxCols;

    for (let r = 0; r < data.length; r++) {
      if (currentY - 18 < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }

      const row = data[r] || [];
      const isHeader = r === 0;

      for (let c = 0; c < maxCols; c++) {
        const cellValue = String(row[c] !== undefined && row[c] !== null ? row[c] : "");
        const truncated = cellValue.length > 24 ? cellValue.substring(0, 22) + "…" : cellValue;

        currentPage.drawText(truncated, {
          x: margin + c * colWidth,
          y: currentY,
          size: 9,
          font: isHeader ? boldFont : font,
          color: isHeader ? rgb(0.16, 0.15, 0.13) : rgb(0.25, 0.25, 0.25),
        });
      }

      currentY -= 16;
    }
  }

  return await pdfDoc.save();
}

/**
 * Universal conversion function
 */
export async function convertDocumentToPdf(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<Uint8Array> {
  const ext = path.extname(originalFilename).toLowerCase();

  // 1. Try LibreOffice headless first if available
  const libreOfficePath = await findLibreOffice();
  if (libreOfficePath) {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "tpdf-conv-"));
    const inputFilePath = path.join(tempDir, originalFilename);
    const expectedPdfName = path.basename(originalFilename, ext) + ".pdf";
    const outputPdfPath = path.join(tempDir, expectedPdfName);

    try {
      await fs.writeFile(inputFilePath, fileBuffer);
      await execFileAsync(libreOfficePath, [
        "--headless",
        "--convert-to",
        "pdf",
        "--outdir",
        tempDir,
        inputFilePath,
      ]);

      const pdfBytes = await fs.readFile(outputPdfPath);
      return new Uint8Array(pdfBytes);
    } catch {
      // If LibreOffice conversion failed, fall back to pure JS engines below
    } finally {
      // Safe temporary file cleanup
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignored
      }
    }
  }

  // 2. Built-in high fidelity handlers when LibreOffice is not installed
  if (ext === ".txt" || ext === ".text" || ext === ".md") {
    return await convertTxtToPdf(fileBuffer.toString("utf-8"), originalFilename);
  }

  if (ext === ".docx" || ext === ".doc") {
    return await convertDocxToPdf(fileBuffer, originalFilename);
  }

  if (ext === ".xlsx" || ext === ".xls" || ext === ".csv" || ext === ".ods") {
    return await convertSpreadsheetToPdf(fileBuffer, originalFilename);
  }

  throw new Error(
    `Unsupported document format: ${ext}. For presentations (.ppt, .pptx) or full layout fidelity, please ensure LibreOffice is installed or convert DOCX, XLSX, CSV, and TXT files.`
  );
}

