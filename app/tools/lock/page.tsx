"use client";

import React, { useState } from "react";
import ToolHeader from "@/components/tools/ToolHeader";
import UploadArea from "@/components/tools/UploadArea";
import ProcessingState from "@/components/tools/ProcessingState";
import SuccessState from "@/components/tools/SuccessState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { lockPdfFile } from "@/lib/pdf/lock";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Lock, FileText, Eye, EyeOff, ShieldAlert } from "lucide-react";

export default function LockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultFileName, setResultFileName] = useState("");

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

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (!password) {
      setError("Please provide a password to encrypt this document.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter carefully.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const encryptedBytes = await lockPdfFile(file, { userPassword: password });
      const baseName = file.name.replace(/\.pdf$/i, "");

      setResultBytes(encryptedBytes);
      setResultFileName(`${baseName}-protected.pdf`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to encrypt document.");
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
    setConfirmPassword("");
    setResultBytes(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ToolHeader
        toolName="Lock PDF"
        description="Encrypt your document with military-grade AES-256 standard encryption. Requires a password to view or modify."
      />

      {resultBytes && file ? (
        <SuccessState
          title="Document protected successfully"
          description={`Password encryption has been applied to "${resultFileName}".`}
          fileName={resultFileName}
          fileSizeBytes={resultBytes.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
        />
      ) : isProcessing ? (
        <ProcessingState
          message="Encrypting document..."
          submessage="Applying AES-256 encryption keys and sealing object streams."
        />
      ) : !file ? (
        <div className="space-y-4">
          <UploadArea
            onFilesSelected={handleFileSelected}
            accept=".pdf,application/pdf"
            multiple={false}
            label="Select PDF to lock"
            sublabel="Upload a document to protect it with password encryption"
            supportedFormatsText="PDF up to 50MB"
          />
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#F5C2C2] rounded-md text-xs text-[#9E2A2B]">
              {error}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleLock} className="space-y-6">
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
                </p>
              </div>
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
              Change file
            </Button>
          </div>

          {/* Password fields */}
          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#292722]">
              Set Encryption Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-7 text-[#81786E] hover:text-[#292722]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-[#F7F4EE] rounded-lg border border-[#E9E3DA] text-xs text-[#81786E]">
              <ShieldAlert className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
              <p>
                Please record this password securely. Encrypted documents cannot be recovered without the correct password.
              </p>
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
            <Button type="submit" variant="primary" size="md">
              <Lock className="w-4 h-4 mr-2" />
              Lock PDF
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

