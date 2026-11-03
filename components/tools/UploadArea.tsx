"use client";

import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  supportedFormatsText?: string;
}

export default function UploadArea({
  onFilesSelected,
  accept = ".pdf,application/pdf",
  multiple = false,
  maxSizeMB = 50,
  label = "Select or drop documents here",
  sublabel = "Drag and drop your files into this area, or browse from your device",
  supportedFormatsText = "PDF files up to 50MB",
}: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateFiles = (fileList: FileList | null): File[] => {
    if (!fileList || fileList.length === 0) return [];
    setError(null);

    const validFiles: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxBytes) {
        setError(`File "${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`);
        continue;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // reset input so the same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-xl transition-all duration-200 cursor-pointer text-center",
          "border-2 border-dashed bg-white",
          isDragOver
            ? "border-[#B78360] bg-[#EAE3D8]/30 shadow-xs"
            : "border-[#E9E3DA] hover:border-[#D6C5B2] hover:bg-[#F7F4EE]/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload file"
        />

        <div className="w-12 h-12 rounded-full bg-[#EAE3D8] flex items-center justify-center text-[#685447] mb-4">
          <UploadCloud className="w-6 h-6 stroke-[1.75]" />
        </div>

        <p className="text-base font-medium text-[#292722] mb-1">
          {label}
        </p>
        <p className="text-xs text-[#81786E] max-w-sm mb-5 leading-relaxed">
          {sublabel}
        </p>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse files
        </Button>

        <p className="mt-4 text-[11px] text-[#81786E]/80">
          {supportedFormatsText}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
          {error}
        </div>
      )}
    </div>
  );
}

