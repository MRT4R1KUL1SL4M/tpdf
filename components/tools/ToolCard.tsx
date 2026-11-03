import React from "react";
import Link from "next/link";
import {
  Files,
  Scissors,
  FileArchive,
  FileType,
  Image as ImageIcon,
  Layers,
  Lock,
  Unlock,
  ArrowRight,
} from "lucide-react";
import { ToolItem } from "@/lib/constants";

interface ToolCardProps {
  tool: ToolItem;
}

const ICON_MAP = {
  Files,
  Scissors,
  FileArchive,
  FileType,
  Image: ImageIcon,
  Layers,
  Lock,
  Unlock,
};

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = ICON_MAP[tool.iconName] || Files;

  return (
    <Link
      href={tool.href}
      className="group flex flex-col justify-between bg-white border border-[#E9E3DA] p-6 rounded-xl transition-all duration-200 hover:border-[#B78360]/50 hover:-translate-y-0.5 hover:shadow-xs"
    >
      <div className="space-y-4">
        <div className="w-11 h-11 rounded-lg bg-[#EAE3D8]/80 text-[#685447] flex items-center justify-center transition-colors group-hover:bg-[#B78360] group-hover:text-white">
          <IconComponent className="w-5 h-5 stroke-[1.8]" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-[#292722] group-hover:text-[#B78360] transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="pt-6 flex items-center text-xs font-medium text-[#B78360] group-hover:text-[#A06F4D]">
        <span>Open tool</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

