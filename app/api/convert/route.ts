import { NextRequest, NextResponse } from "next/server";
import { convertDocumentToPdf } from "@/lib/conversion/convertServer";

// Maximum upload size: 25MB
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".odt",
  ".ods",
  ".odp",
  ".txt",
  ".csv",
  ".text",
  ".md",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No document file provided for conversion." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 25MB limit." },
        { status: 400 }
      );
    }

    const filename = file.name || "document.docx";
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file type "${ext}". Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, TXT, CSV.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfBytes = await convertDocumentToPdf(buffer, filename);

    // Return the generated PDF binary with appropriate headers
    return new NextResponse(new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" }), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          filename.replace(/\.[^/.]+$/, "") + ".pdf"
        )}"`,
        "Content-Length": pdfBytes.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Conversion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

