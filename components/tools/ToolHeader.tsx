import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ToolHeaderProps {
  toolName: string;
  description: string;
  category?: string;
}

export default function ToolHeader({ toolName, description }: ToolHeaderProps) {
  return (
    <div className="mb-8 space-y-3">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E]">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <Link href="/tools" className="hover:text-[#292722] transition-colors">
          Tools
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">{toolName}</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#292722]">
          {toolName}
        </h1>
        <p className="text-sm sm:text-base text-[#81786E] max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

