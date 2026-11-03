"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ArrowRight } from "lucide-react";
import { BRAND, TOOLS } from "@/lib/constants";
import ToolCard from "@/components/tools/ToolCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = TOOLS.filter((tool) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E9E3DA] bg-white text-[11px] font-semibold tracking-wider text-[#81786E] uppercase mb-6">
          <span>{BRAND.eyebrow}</span>
        </div>

        <h1 className="font-serif-brand text-4xl sm:text-6xl md:text-7xl font-normal text-[#292722] tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto">
          &ldquo;{BRAND.tagline}&rdquo;
        </h1>

        <p className="text-base sm:text-lg text-[#81786E] max-w-xl mx-auto leading-relaxed mb-10">
          {BRAND.description}
        </p>

        {/* Subtle Search Field */}
        <div className="max-w-md mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#81786E] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. merge, compress, split, lock)..."
              className="w-full bg-white border border-[#E9E3DA] rounded-lg pl-11 pr-4 py-3 text-sm text-[#292722] placeholder:text-[#81786E] shadow-2xs focus:border-[#B78360] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs text-[#81786E] hover:text-[#292722] px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-32">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#E9E3DA] gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#292722]">
              Explore tools
            </h2>
            <p className="text-xs text-[#81786E] mt-0.5">
              Eight essential utilities, engineered with precision and care.
            </p>
          </div>
          {searchQuery && (
            <span className="text-xs text-[#81786E]">
              Showing {filteredTools.length} of {TOOLS.length} tools
            </span>
          )}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-[#E9E3DA] rounded-xl p-8">
            <p className="text-sm font-medium text-[#292722] mb-1">
              No matching tools found
            </p>
            <p className="text-xs text-[#81786E] mb-4">
              Try searching with another keyword or explore all eight tools.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#B78360] font-semibold hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </section>

      {/* Privacy Section */}
      <section className="bg-[#EAE3D8]/50 border-y border-[#E9E3DA] py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E9E3DA] text-[#685447] flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h2 className="font-serif-brand text-2xl sm:text-3xl text-[#292722]">
            {BRAND.privacyHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#81786E] leading-relaxed max-w-xl mx-auto">
            {BRAND.privacyDescription}
          </p>
          <div className="pt-2">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#685447] hover:text-[#292722] transition-colors"
            >
              <span>Read our privacy commitments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
