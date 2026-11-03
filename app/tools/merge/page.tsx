"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import FilePreview, { PreviewFileItem } from "@/components/tools/FilePreview";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { mergePdfFiles } from "@/lib/pdf/merge";
import { getPdfPageCount } from "@/lib/pdf/thumbnails";
import { downloadBlob } from "@/lib/utils";
import { Files, Plus } from "lucide-react";

export default function MergePdfPage() {
  const [files, setFiles] = useState<PreviewFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("merged-document.pdf");

  const handleFilesSelected = async (newFiles: File[]) => {
    setError(null);
    const pdfFiles = newFiles.filter((f) => f.name.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      setError("Please select valid PDF documents.");
      return;
    }

    const items: PreviewFileItem[] = [];
    for (const f of pdfFiles) {
      let pageCount = undefined;
      try {
        pageCount = await getPdfPageCount(f);
      } catch {
        // Page count not available or encrypted
      }
      items.push({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        file: f,
        pageCount,
      });
    }

    setFiles((prev) => [...prev, ...items]);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index - 1];
      clone[index - 1] = temp;
      return clone;
    });
  };

  const handleMoveDown = (index: number) => {
    setFiles((prev) => {
      if (index === prev.length - 1) return prev;
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index + 1];
      clone[index + 1] = temp;
      return clone;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least two PDF files to merge.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const rawFiles = files.map((item) => item.file);
      const mergedBytes = await mergePdfFiles(rawFiles);

      const firstBase = files[0].file.name.replace(/\.pdf$/i, "");
      const outputName = `${firstBase}-merged.pdf`;

      setResultBytes(mergedBytes);
      setResultFileName(outputName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to merge PDF files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes) return;
    const blob = new Blob([resultBytes as unknown as BlobPart], { type: "application/pdf" });
    downloadBlob(blob, resultFileName);
  };

  const handleReset = () => {
    setFiles([]);
    setResultBytes(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Merge PDF"
        description="Combine multiple PDF files into a single, organized document. Arrange files in any order before merging."
      />

      {resultBytes ? (
        <SuccessState
          title="PDFs successfully merged"
          description={`Combined ${files.length} documents into one file.`}
          fileName={resultFileName}
          fileSizeBytes={resultBytes.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Merging documents..."
          submessage="Stitching pages and rebuilding document tables."
        />
      ) : (
        <div className="space-y-6">
          {files.length === 0 ? (
            <UploadArea
              onFilesSelected={handleFilesSelected}
              accept=".pdf,application/pdf"
              multiple={true}
              label="Select PDF files to merge"
              sublabel="Choose two or more PDF files from your device to combine"
              supportedFormatsText="PDF files up to 50MB each"
            />
          ) : (
            <div className="space-y-6">
              <FilePreview
                files={files}
                onRemove={handleRemove}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                showReorder={true}
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E9E3DA]">
                {/* Add more files button */}
                <div>
                  <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292722] hover:text-[#B78360] cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add more PDFs</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple={true}
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFilesSelected(Array.from(e.target.files));
                        }
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full sm:w-auto"
                  >
                    Clear all
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleMerge}
                    disabled={files.length < 2}
                    className="w-full sm:w-auto"
                  >
                    <Files className="w-4 h-4 mr-2" />
                    Merge {files.length} PDFs
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

