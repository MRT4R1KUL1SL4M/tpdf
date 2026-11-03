"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { unlockPdfFile, isPdfEncrypted } from "@/lib/pdf/unlock";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Unlock, FileText, Eye, EyeOff, KeyRound } from "lucide-react";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFileName, setResultFileName] = useState("");
  const [isDetectedEncrypted, setIsDetectedEncrypted] = useState<boolean | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selected);
    setError(null);

    const encrypted = await isPdfEncrypted(selected);
    setIsDetectedEncrypted(encrypted);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (!password) {
      setError("Please enter the document's password.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const unlockedBytes = await unlockPdfFile(file, password);
      const baseName = file.name.replace(/\.pdf$/i, "");

      setResultBytes(unlockedBytes);
      setResultFileName(`${baseName}-unlocked.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to unlock document.");
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
    setPassword("");
    setResultBytes(null);
    setError(null);
    setIsDetectedEncrypted(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Unlock PDF"
        description="Remove password protection from encrypted documents by providing the authorized password. Produces an unrestricted PDF copy."
      />

      {resultBytes && file ? (
        <SuccessState
          title="Password removed successfully"
          description={`"${resultFileName}" is now unencrypted and ready for use.`}
          fileName={resultFileName}
          fileSizeBytes={resultBytes.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Verifying credentials and decrypting..."
          submessage="Decrypting document streams and writing an unrestricted PDF."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
            label="Select protected PDF"
            sublabel="Upload a password-protected PDF file to remove its restriction"
            supportedFormatsText="Encrypted PDF up to 50MB"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleUnlock} className="space-y-6">
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
                  Size: {formatBytes(file.size)}
                  {isDetectedEncrypted !== null && (
                    <span className="ml-2 font-medium text-[#B78360]">
                      ({isDetectedEncrypted ? "Password protected" : "Standard document"})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Change file
            </Button>
          </div>

          {/* Password Entry */}
          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#B78360]" />
              <h3 className="text-sm font-semibold text-[#292722]">
                Enter Document Password
              </h3>
            </div>

            <div className="max-w-md relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter document password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-7 text-[#81786E] hover:text-[#292722]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-[#81786E] leading-relaxed">
              TPDF operates strictly with your authorization. We do not attempt unauthorized password bypass or cracking.
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
            <Button type="submit" variant="primary" size="md">
              <Unlock className="w-4 h-4 mr-2" />
              Unlock Document
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

