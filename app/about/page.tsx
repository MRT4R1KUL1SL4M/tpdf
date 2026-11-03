import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">About</span>
      </nav>

      {/* Editorial Header */}
      <header className="space-y-4 mb-16">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          Our Craft & Philosophy
        </span>
        <h1 className="font-serif-brand text-4xl sm:text-5xl md:text-6xl text-[#292722] leading-tight">
          &ldquo;{BRAND.tagline}&rdquo;
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          {BRAND.description}
        </p>
      </header>

      {/* Narrative Section */}
      <div className="space-y-12 text-[#292722] text-sm sm:text-base leading-relaxed border-t border-[#E9E3DA] pt-12">
        <section className="space-y-4">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            Why TPDF Exists
          </h2>
          <p className="text-[#81786E]">
            Modern document tools are too frequently cluttered with intrusive advertisements, deceptive download buttons, and dark patterns that harvest your sensitive data.
          </p>
          <p className="text-[#81786E]">
            TPDF was created as a quiet, respectful alternative. We believe that everyday utilities should feel like well-crafted physical stationery — durable, honest, and free of unnecessary friction.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-base text-[#292722]">
              Private by Architecture
            </h3>
            <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
              We process operations client-side whenever technically possible. When server-side processing is necessary, documents reside solely in volatile memory and are cleaned immediately.
            </p>
          </div>

          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-base text-[#292722]">
              Eight Essential Tools
            </h3>
            <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
              We do not chase feature bloat. We focus exclusively on the eight operations people perform every single day: merge, split, compress, convert, image conversion, organize, lock, and unlock.
            </p>
          </div>
        </section>

        <section className="bg-[#EAE3D8]/40 border border-[#E9E3DA] p-8 rounded-xl space-y-4">
          <h3 className="font-serif-brand text-2xl text-[#292722]">
            Ready to organize your documents?
          </h3>
          <p className="text-xs sm:text-sm text-[#81786E] max-w-xl">
            Explore the complete toolkit and experience document management designed with dignity.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#292722] text-[#F7F4EE] px-5 py-2.5 rounded-md hover:bg-[#685447] transition-colors"
            >
              <span>Explore tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

