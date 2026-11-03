"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { compressPdfFile, CompressionLevel, CompressionResult } from "@/lib/pdf/compress";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { FileArchive, Check, Sparkles, FileText, Info } from "lucide-react";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("recommended");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }
    setFile(selected);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      const compressionRes = await compressPdfFile(file, compressionLevel);
      setResult(compressionRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const blob = new Blob([result.pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    const baseName = file.name.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${baseName}-compressed.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const options = [
    {
      level: "low" as CompressionLevel,
      title: "Low Compression",
      badge: "High Quality",
      description: "Compresses document objects and metadata without downscaling any embedded imagery.",
      estimated: "5% - 20% reduction",
    },
    {
      level: "recommended" as CompressionLevel,
      title: "Recommended Compression",
      badge: "Balanced",
      description: "Optimizes image raster densities and compacts stream tables while maintaining sharp reading clarity.",
      estimated: "30% - 60% reduction",
    },
    {
      level: "high" as CompressionLevel,
      title: "High Compression",
      badge: "Smallest Size",
      description: "Applies aggressive compression algorithms to minimize file footprint for email and web sharing.",
      estimated: "50% - 80% reduction",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Compress PDF"
        description="Reduce PDF document size efficiently. Choose between high fidelity, balanced, or maximum reduction."
      />

      {result && file ? (
        <SuccessState
          title="Document compressed successfully"
          description={`Original: ${formatBytes(result.originalSize)} → Compressed: ${formatBytes(
            result.compressedSize
          )} (${result.savingsPercentage}% reduction)`}
          fileName={`${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`}
          fileSizeBytes={result.compressedSize}
          originalSizeBytes={result.originalSize}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Compressing document..."
          submessage="Re-encoding streams, consolidating cross-reference tables, and optimizing raster data."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
            label="Select PDF to compress"
            sublabel="Upload a document to reduce its file size without loss of readability"
            supportedFormatsText="PDF documents up to 50MB"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary */}
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
                  Original size: <strong>{formatBytes(file.size)}</strong>
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Change file
            </Button>
          </div>

          {/* Compression Level Options */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#81786E]">
              Select Compression Level
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {options.map((opt) => {
                const isSelected = compressionLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setCompressionLevel(opt.level)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-[#B78360] shadow-xs ring-1 ring-[#B78360]"
                        : "bg-white border-[#E9E3DA] hover:border-[#D6C5B2]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAE3D8] text-[#685447]">
                          {opt.badge}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-[#B78360] bg-[#B78360] text-white"
                              : "border-[#D6C5B2]"
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-[#292722]">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-[#81786E] leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#E9E3DA]/60 text-[11px] font-medium text-[#685447]">
                      {opt.estimated}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clear note on limitations */}
          <div className="flex items-start gap-3 p-4 bg-[#F7F4EE] border border-[#E9E3DA] rounded-lg text-xs text-[#81786E]">
            <Info className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
            <p>
              Documents already optimized or consisting purely of vector text may exhibit lower reduction percentages, as their internal object streams are already compact.
            </p>
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
              onClick={handleCompress}
            >
              <FileArchive className="w-4 h-4 mr-2" />
              Compress PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

