"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import {
  convertImagesToPdf,
  PageSizeOption,
  OrientationOption,
} from "@/lib/pdf/imageToPdf";
import { downloadBlob, formatBytes } from "@/lib/utils";
import {
  Image as ImageIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("a4");
  const [orientation, setOrientation] = useState<OrientationOption>("auto");
  const [margin, setMargin] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("images-document.pdf");

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    const valid = newFiles.filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f.name)
    );

    if (valid.length === 0) {
      setError("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    const newItems: ImageItem[] = valid.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index - 1];
      clone[index - 1] = temp;
      return clone;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[index + 1];
      clone[index + 1] = temp;
      return clone;
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    try {
      setIsProcessing(true);
      setError(null);

      const files = images.map((i) => i.file);
      const bytes = await convertImagesToPdf(files, {
        pageSize,
        orientation,
        margin,
      });

      const baseName = images[0].file.name.replace(/\.[^/.]+$/, "");
      const outputName = `${baseName}-converted.pdf`;

      setResultBytes(bytes);
      setResultFileName(outputName);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to convert images.");
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
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setResultBytes(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Image to PDF"
        description="Convert JPG, PNG, and WebP images into formatted, high-resolution PDF documents."
      />

      {resultBytes ? (
        <SuccessState
          title="PDF created from images"
          description={`Compiled ${images.length} images into a structured PDF.`}
          fileName={resultFileName}
          fileSizeBytes={resultBytes.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Generating PDF..."
          submessage="Embedding image assets and formatting page layout."
        />
      ) : images.length === 0 ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFilesSelected}
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple={true}
            label="Select images to convert"
            sublabel="Upload one or multiple JPG, PNG, or WebP photos"
            supportedFormatsText="Images up to 25MB each"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Settings Bar */}
          <div className="bg-white border border-[#E9E3DA] p-5 rounded-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Page size */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#81786E] mb-1.5">
                  Page Size
                </label>
                <div className="flex gap-2">
                  {(["a4", "letter", "fit"] as PageSizeOption[]).map((ps) => (
                    <button
                      key={ps}
                      type="button"
                      onClick={() => setPageSize(ps)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md uppercase transition-colors ${
                        pageSize === ps
                          ? "bg-[#292722] text-[#F7F4EE]"
                          : "bg-[#F7F4EE] text-[#81786E] hover:text-[#292722]"
                      }`}
                    >
                      {ps === "fit" ? "Fit Image" : ps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#81786E] mb-1.5">
                  Orientation
                </label>
                <div className="flex gap-2">
                  {(["auto", "portrait", "landscape"] as OrientationOption[]).map((ori) => (
                    <button
                      key={ori}
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setOrientation(ori)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        orientation === ori
                          ? "bg-[#292722] text-[#F7F4EE]"
                          : "bg-[#F7F4EE] text-[#81786E] hover:text-[#292722]"
                      }`}
                    >
                      {ori}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#81786E] mb-1.5">
                  Margins
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "None", val: 0 },
                    { label: "Small", val: 20 },
                    { label: "Normal", val: 40 },
                  ].map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setMargin(m.val)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        margin === m.val
                          ? "bg-[#292722] text-[#F7F4EE]"
                          : "bg-[#F7F4EE] text-[#81786E] hover:text-[#292722]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#81786E] px-1">
              <span>Selected Images ({images.length})</span>
              <span className="text-[11px]">Reorder with arrow controls</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-[#E9E3DA] rounded-lg p-2 flex flex-col justify-between hover:border-[#B78360] transition-colors"
                >
                  <div className="w-full aspect-square bg-[#F7F4EE] rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-medium text-[#292722] truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[10px] text-[#81786E]">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>

                  {/* Reorder and Delete Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E9E3DA]/60 mt-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        className="p-1 text-[#81786E] hover:text-[#292722] disabled:opacity-20"
                        title="Move left"
                      >
                        <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMoveDown(index)}
                        className="p-1 text-[#81786E] hover:text-[#292722] disabled:opacity-20"
                        title="Move right"
                      >
                        <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1 text-[#81786E] hover:text-[#9E2A2B]"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add more files + Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E9E3DA]">
            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292722] hover:text-[#B78360] cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add more images</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
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

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                Clear all
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConvert}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Generate PDF ({images.length} pages)
              </Button>
            </div>
          </div>

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

