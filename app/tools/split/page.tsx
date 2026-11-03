"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { renderPdfThumbnails, PageThumbnail } from "@/lib/pdf/thumbnails";
import {
  extractSelectedPages,
  splitAllPagesToZip,
  parsePageRanges,
} from "@/lib/pdf/split";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Scissors, Archive, CheckSquare, Square, FileText } from "lucide-react";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState<string>("");
  const [splitMode, setSplitMode] = useState<"extract" | "all">("extract");
  const [isRenderingThumbs, setIsRenderingThumbs] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsRenderingThumbs(true);

    try {
      const thumbs = await renderPdfThumbnails(selectedFile);
      setThumbnails(thumbs);
      // Select all by default or first page
      if (thumbs.length > 0) {
        setSelectedPages([1]);
        setRangeInput("1");
      }
    } catch {
      setError("Failed to load PDF preview. The document might be password-protected.");
    } finally {
      setIsRenderingThumbs(false);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    let updated: number[];
    if (selectedPages.includes(pageNum)) {
      updated = selectedPages.filter((p) => p !== pageNum);
    } else {
      updated = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    setSelectedPages(updated);
    setRangeInput(updated.join(", "));
  };

  const handleRangeChange = (val: string) => {
    setRangeInput(val);
    if (!file || thumbnails.length === 0) return;
    const parsed = parsePageRanges(val, thumbnails.length);
    setSelectedPages(parsed);
  };

  const selectAll = () => {
    const all = thumbnails.map((t) => t.pageNumber);
    setSelectedPages(all);
    setRangeInput(`1-${thumbnails.length}`);
  };

  const clearSelection = () => {
    setSelectedPages([]);
    setRangeInput("");
  };

  const handleProcess = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      const baseName = file.name.replace(/\.pdf$/i, "");

      if (splitMode === "extract") {
        if (selectedPages.length === 0) {
          setError("Please select at least one page to extract.");
          setIsProcessing(false);
          return;
        }

        const bytes = await extractSelectedPages(file, selectedPages);
        const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
        setResultBlob(blob);
        setResultFileName(`${baseName}-extracted.pdf`);
      } else {
        // Split all or selected into separate PDFs in a zip
        const zipBlob = await splitAllPagesToZip(
          file,
          selectedPages.length > 0 ? selectedPages : undefined
        );
        setResultBlob(zipBlob);
        setResultFileName(`${baseName}-split-pages.zip`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to split document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, resultFileName);
  };

  const handleReset = () => {
    setFile(null);
    setThumbnails([]);
    setSelectedPages([]);
    setRangeInput("");
    setResultBlob(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Split PDF"
        description="Extract specific pages, custom ranges, or separate an entire document into individual pages."
      />

      {resultBlob ? (
        <SuccessState
          title="Document split successfully"
          description={
            splitMode === "extract"
              ? `Extracted ${selectedPages.length} pages into a new document.`
              : `Created individual documents packaged into a ZIP archive.`
          }
          fileName={resultFileName}
          fileSizeBytes={resultBlob.size}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Splitting document..."
          submessage="Extracting page objects and building clean files."
        />
      ) : isRenderingThumbs ? (
        <ProcessingState
          message="Rendering page previews..."
          submessage="Generating visual thumbnails for page selection."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
            label="Select PDF to split"
            sublabel="Upload a multi-page PDF document to extract or separate pages"
            supportedFormatsText="PDF up to 50MB"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary bar */}
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
                  {formatBytes(file.size)} • {thumbnails.length} pages detected
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Change document
            </Button>
          </div>

          {/* Controls & Options */}
          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3DA]">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#81786E]">
                  Split Strategy
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setSplitMode("extract")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      splitMode === "extract"
                        ? "bg-[#292722] text-[#F7F4EE]"
                        : "bg-[#F7F4EE] text-[#81786E] hover:text-[#292722]"
                    }`}
                  >
                    Extract selected pages into one PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode("all")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      splitMode === "all"
                        ? "bg-[#292722] text-[#F7F4EE]"
                        : "bg-[#F7F4EE] text-[#81786E] hover:text-[#292722]"
                    }`}
                  >
                    Split into separate PDF files (ZIP)
                  </button>
                </div>
              </div>

              {/* Range input */}
              <div className="sm:w-64">
                <Input
                  label="Custom Page Range"
                  value={rangeInput}
                  onChange={(e) => handleRangeChange(e.target.value)}
                  placeholder="e.g. 1, 3-5, 8"
                />
              </div>
            </div>

            {/* Quick selectors */}
            <div className="flex items-center justify-between text-xs text-[#81786E]">
              <span>
                Selected: <strong className="text-[#292722]">{selectedPages.length}</strong> of {thumbnails.length} pages
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selectAll}
                  className="hover:text-[#292722] inline-flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select all
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="hover:text-[#292722] inline-flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[440px] overflow-y-auto p-2 border border-[#E9E3DA] rounded-lg bg-[#F7F4EE]/40">
              {thumbnails.map((t) => {
                const isSelected = selectedPages.includes(t.pageNumber);
                return (
                  <div
                    key={t.pageNumber}
                    onClick={() => togglePageSelection(t.pageNumber)}
                    className={`group relative flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-white border-[#B78360] shadow-xs ring-1 ring-[#B78360]"
                        : "bg-white/60 border-[#E9E3DA] hover:border-[#D6C5B2] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full aspect-[1/1.4] bg-white rounded flex items-center justify-center overflow-hidden border border-[#E9E3DA]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.dataUrl}
                        alt={`Page ${t.pageNumber}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-[#292722]">
                      Page {t.pageNumber}
                    </span>
                    <div
                      className={`absolute top-3 right-3 w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        isSelected
                          ? "bg-[#B78360] text-white"
                          : "border border-[#D6C5B2] bg-white text-transparent group-hover:text-[#D6C5B2]"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                );
              })}
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
              onClick={handleProcess}
              disabled={selectedPages.length === 0}
            >
              {splitMode === "extract" ? (
                <>
                  <Scissors className="w-4 h-4 mr-2" />
                  Extract {selectedPages.length} {selectedPages.length === 1 ? "page" : "pages"}
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Split into ZIP
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

