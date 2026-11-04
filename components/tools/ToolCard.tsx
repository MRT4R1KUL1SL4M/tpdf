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
  ArrowUpRight,
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
      className="group flex flex-col justify-between bg-white border border-[#E9E3DA] p-6 rounded-xl transition-all duration-300 hover:border-[#B78360]/60 hover:-translate-y-1 hover:shadow-xs cursor-pointer"
    >
      <div className="space-y-4">
        <div className="w-11 h-11 rounded-lg bg-[#EAE3D8]/80 text-[#685447] flex items-center justify-center transition-all duration-300 group-hover:bg-[#B78360] group-hover:text-white group-hover:scale-105">
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

      <div className="pt-6 mt-4 border-t border-[#E9E3DA]/60 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-[#685447] group-hover:text-[#292722] transition-colors">
          Open Tool
        </span>
        <div className="w-8 h-8 rounded-full border border-[#E9E3DA] bg-[#F7F4EE] flex items-center justify-center text-[#685447] transition-all duration-300 group-hover:bg-[#B78360] group-hover:border-[#B78360] group-hover:text-white group-hover:scale-105 group-hover:shadow-xs">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
