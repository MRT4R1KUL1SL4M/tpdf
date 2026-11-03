"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TOOLS } from "@/lib/constants";
import ToolCard from "@/components/tools/ToolCard";

export default function ToolsIndexPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Utilities" },
    { id: "edit", label: "Page & Document" },
    { id: "optimize", label: "Optimization" },
    { id: "convert", label: "Conversion" },
    { id: "security", label: "Security" },
  ];

  const filteredTools =
    activeCategory === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-6">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">All Tools</span>
      </nav>

      <div className="mb-10 space-y-3">
        <h1 className="font-serif-brand text-3xl sm:text-4xl text-[#292722]">
          All Tools
        </h1>
        <p className="text-sm sm:text-base text-[#81786E] max-w-xl">
          Complete suite of document utilities designed with privacy and editorial restraint.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-4 border-b border-[#E9E3DA] pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#292722] text-[#F7F4EE]"
                  : "bg-white border border-[#E9E3DA] text-[#81786E] hover:text-[#292722] hover:bg-[#F7F4EE]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

