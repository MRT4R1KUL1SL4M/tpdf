"use client";

import React from "react";
import { FileText, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export interface PreviewFileItem {
  id: string;
  file: File;
  pageCount?: number;
  previewUrl?: string;
}

interface FilePreviewProps {
  files: PreviewFileItem[];
  onRemove: (id: string) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  showReorder?: boolean;
}

export default function FilePreview({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  showReorder = false,
}: FilePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex items-center justify-between text-xs text-[#81786E] px-1">
        <span>Uploaded ({files.length})</span>
        {showReorder && files.length > 1 && (
          <span className="text-[11px]">Use arrows to reorder pages or files</span>
        )}
      </div>

      <div className="space-y-2">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 bg-white border border-[#E9E3DA] p-3 rounded-lg hover:border-[#D6C5B2] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-[#EAE3D8] text-[#685447] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#292722] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#81786E]">
                  <span>{formatBytes(item.file.size)}</span>
                  {item.pageCount !== undefined && (
                    <>
                      <span>•</span>
                      <span>{item.pageCount} {item.pageCount === 1 ? "page" : "pages"}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {showReorder && (
                <>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveUp && onMoveUp(index)}
                    className="p-1.5 text-[#81786E] hover:text-[#292722] hover:bg-[#EAE3D8] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === files.length - 1}
                    onClick={() => onMoveDown && onMoveDown(index)}
                    className="p-1.5 text-[#81786E] hover:text-[#292722] hover:bg-[#EAE3D8] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-[#81786E] hover:text-[#9E2A2B] hover:bg-[#FFF5F5] rounded transition-colors"
                title="Remove file"
                aria-label="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

