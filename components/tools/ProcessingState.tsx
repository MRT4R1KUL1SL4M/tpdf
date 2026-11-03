import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingStateProps {
  message?: string;
  submessage?: string;
}

export default function ProcessingState({
  message = "Processing document...",
  submessage = "This usually takes just a few seconds.",
}: ProcessingStateProps) {
  return (
    <div className="w-full py-16 px-6 bg-white border border-[#E9E3DA] rounded-xl flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#EAE3D8] text-[#B78360] flex items-center justify-center mb-4">
        <Loader2 className="w-6 h-6 animate-spin stroke-[2]" />
      </div>
      <h3 className="text-base font-medium text-[#292722] mb-1">{message}</h3>
      <p className="text-xs text-[#81786E] max-w-xs">{submessage}</p>
    </div>
  );
}

