"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { renderPdfThumbnails } from "@/lib/pdf/thumbnails";
import { saveOrganizedPdf, PageOrganizeItem } from "@/lib/pdf/organize";
import { downloadBlob, formatBytes } from "@/lib/utils";
import {
  RotateCw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  FileText,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageOrganizeItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selected);
    setError(null);
    setIsRendering(true);

    try {
      const thumbs = await renderPdfThumbnails(selected);
      const initialPages: PageOrganizeItem[] = thumbs.map((t, idx) => ({
        id: `page-${idx}-${Date.now()}`,
        originalIndex: idx,
        displayPageNumber: idx + 1,
        rotation: 0,
        dataUrl: t.dataUrl,
      }));
      setPages(initialPages);
    } catch {
      setError("Failed to load PDF pages. The file might be encrypted or corrupted.");
    } finally {
      setIsRendering(false);
    }
  };

  const handleRotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleDeletePage = (id: string) => {
    setPages((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    setPages((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index - 1];
      clone[index - 1] = temp;
      return clone.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
  };

  const handleMoveRight = (index: number) => {
    if (index === pages.length - 1) return;
    setPages((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index + 1];
      clone[index + 1] = temp;
      return clone.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
  };

  const toggleSelectPage = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(pages.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setPages((prev) => {
      const remaining = prev.filter((p) => !selectedIds.includes(p.id));
      return remaining.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
    setSelectedIds([]);
  };

  const rotateSelected = () => {
    if (selectedIds.length === 0) return;
    setPages((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleSave = async () => {
    if (!file) return;
    if (pages.length === 0) {
      setError("Please keep at least one page in your document.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const bytes = await saveOrganizedPdf(file, pages);
      const baseName = file.name.replace(/\.pdf$/i, "");
      setResultBytes(bytes);
      setResultFileName(`${baseName}-organized.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to organize PDF.");
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
    setFile(null);
    setPages([]);
    setSelectedIds([]);
    setResultBytes(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Organize PDF"
        description="Reorder, rotate, or delete individual pages visually to structure your document perfectly."
      />

      {resultBytes && file ? (
        <SuccessState
          title="Document organized successfully"
          description={`Saved ${pages.length} pages in the new sequence.`}
          fileName={resultFileName}
          fileSizeBytes={resultBytes.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Reorganizing document..."
          submessage="Applying page rotations and rebuilding the page tree structure."
        />
      ) : isRendering ? (
        <ProcessingState
          message="Rendering page thumbnails..."
          submessage="Generating visual page tiles for organization."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
            label="Select PDF to organize"
            sublabel="Upload a PDF document to reorder, rotate, or delete pages"
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
          {/* File summary & Batch actions bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E9E3DA] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#292722] truncate max-w-xs sm:max-w-sm">
                  {file.name}
                </p>
                <p className="text-xs text-[#81786E]">
                  {formatBytes(file.size)} • {pages.length} active pages
                </p>
              </div>
            </div>

            {/* Batch page controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#81786E] pr-2 border-r border-[#E9E3DA]">
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

              {selectedIds.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={rotateSelected}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-[#F7F4EE] border border-[#E9E3DA] text-[#292722] hover:bg-[#EAE3D8]"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Rotate ({selectedIds.length})
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelected}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-[#FFF5F5] border border-[#F5C2C2] text-[#9E2A2B] hover:bg-[#FDE8E8]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete ({selectedIds.length})
                  </button>
                </>
              )}

              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                Change file
              </Button>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 border border-[#E9E3DA] rounded-xl bg-white">
            {pages.map((p, index) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`group relative flex flex-col justify-between p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? "border-[#B78360] bg-[#F7F4EE]/60 ring-1 ring-[#B78360]"
                      : "border-[#E9E3DA] bg-white hover:border-[#D6C5B2]"
                  }`}
                >
                  {/* Page header tag */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[11px] font-semibold text-[#292722]">
                      Page {p.displayPageNumber}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectPage(p.id)}
                      className="accent-[#B78360] cursor-pointer"
                    />
                  </div>

                  {/* Thumbnail with rotation */}
                  <div
                    onClick={() => toggleSelectPage(p.id)}
                    className="w-full aspect-[1/1.4] bg-[#F7F4EE] rounded overflow-hidden flex items-center justify-center cursor-pointer border border-[#E9E3DA]/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.displayPageNumber}`}
                      style={{
                        transform: `rotate(${p.rotation}deg)`,
                        transition: "transform 0.2s ease-in-out",
                      }}
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* Action buttons below thumbnail */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E9E3DA]/60 mt-2">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className="p-1 text-[#81786E] hover:text-[#292722] disabled:opacity-20"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === pages.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className="p-1 text-[#81786E] hover:text-[#292722] disabled:opacity-20"
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleRotatePage(p.id)}
                        className="p-1 text-[#81786E] hover:text-[#292722]"
                        title="Rotate 90 degrees"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePage(p.id)}
                        className="p-1 text-[#81786E] hover:text-[#9E2A2B]"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
              onClick={handleSave}
              disabled={pages.length === 0}
            >
              <Layers className="w-4 h-4 mr-2" />
              Save Organized PDF ({pages.length} pages)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

