import React from "react";
import { Check, Download, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

interface SuccessStateProps {
  title?: string;
  description?: string;
  fileName: string;
  fileSizeBytes?: number;
  originalSizeBytes?: number;
  onDownload: () => void;
  onReset: () => void;
}

export default function SuccessState({
  title = "Ready for download",
  description = "Your document has been processed successfully.",
  fileName,
  fileSizeBytes,
  originalSizeBytes,
  onDownload,
  onReset,
}: SuccessStateProps) {
  const savings =
    originalSizeBytes && fileSizeBytes && originalSizeBytes > fileSizeBytes
      ? Math.round(((originalSizeBytes - fileSizeBytes) / originalSizeBytes) * 100)
      : null;

  return (
    <div className="w-full bg-white border border-[#E9E3DA] rounded-xl p-6 sm:p-8 space-y-6 text-center">
      {/* Icon */}
      <div className="mx-auto w-12 h-12 rounded-full bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
        <Check className="w-6 h-6 stroke-[2.2]" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-[#292722]">{title}</h3>
        <p className="text-xs text-[#81786E] max-w-sm mx-auto">{description}</p>
      </div>

      {/* File card info */}
      <div className="max-w-md mx-auto p-4 bg-[#F7F4EE] border border-[#E9E3DA] rounded-lg flex items-center justify-between text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded bg-white border border-[#E9E3DA] flex items-center justify-center text-[#B78360] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#292722] truncate">{fileName}</p>
            {fileSizeBytes !== undefined && (
              <p className="text-xs text-[#81786E]">
                {formatBytes(fileSizeBytes)}
                {savings !== null && (
                  <span className="ml-2 font-medium text-[#B78360]">
                    ({savings}% smaller)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onDownload}
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Again
        </Button>
      </div>
    </div>
  );
}

