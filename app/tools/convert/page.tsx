"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { FileType, FileText, Check } from "lucide-react";

export default function ConvertToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");

  const supportedExtensions = [
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".odt",
    ".ods",
    ".odp",
    ".txt",
    ".csv",
    ".md",
  ];

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    const ext = selected.name.slice(selected.name.lastIndexOf(".")).toLowerCase();

    if (!supportedExtensions.includes(ext)) {
      setError(
        `Unsupported file type "${ext}". Supported formats: DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, TXT, CSV.`
      );
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsConverting(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Document conversion failed on server.");
      }

      const blob = await response.blob();
      const outputName = `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;

      setResultBlob(blob);
      setResultFileName(outputName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to convert document.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, resultFileName);
  };

  const handleReset = () => {
    setFile(null);
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Convert to PDF"
        description="Convert Word documents, spreadsheets, presentations, and plain text files into standard PDF format."
      />

      {resultBlob && file ? (
        <SuccessState
          title="Document successfully converted"
          description={`Converted "${file.name}" to standard PDF.`}
          fileName={resultFileName}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isConverting ? (
        <ProcessingState
          message="Converting document to PDF..."
          submessage="Parsing document structures, formatting layout, and rendering vector pages."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.txt,.csv,.md"
            multiple={false}
            label="Select document to convert"
            sublabel="Upload DOCX, XLSX, TXT, CSV, ODT, or PPT to convert to PDF"
            supportedFormatsText="Office documents and text files up to 25MB"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E9E3DA] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#292722] truncate max-w-sm sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-[#81786E]">
                  Size: {formatBytes(file.size)} • Ready for PDF conversion
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Change document
            </Button>
          </div>

          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#81786E]">
              Conversion Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#81786E]">
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E9E3DA]">
                <strong className="text-[#292722] block mb-1">Target Format</strong>
                Standard Adobe PDF Specification (v1.7)
              </div>
              <div className="p-3 bg-[#F7F4EE] rounded-lg border border-[#E9E3DA]">
                <strong className="text-[#292722] block mb-1">Data Retention</strong>
                Processed purely in-memory. Zero permanent file retention.
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="md" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleConvert}
            >
              <FileType className="w-4 h-4 mr-2" />
              Convert to PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

