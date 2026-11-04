import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, ShieldCheck, Layers, Cpu } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">About</span>
      </nav>

      <header className="space-y-4 mb-16">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          Corporate Overview
        </span>
        <h1 className="font-serif-brand text-4xl sm:text-5xl md:text-6xl text-[#292722] leading-tight">
          &ldquo;{BRAND.tagline}&rdquo;
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          {BRAND.description}
        </p>
      </header>

      <div className="space-y-12 text-[#292722] text-sm sm:text-base leading-relaxed border-t border-[#E9E3DA] pt-12">
        <section className="space-y-4">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            Mission and Standards
          </h2>
          <p className="text-[#81786E]">
            Modern digital workspaces require reliable, secure, and respectful document utilities. Many traditional web tools compromise user confidentiality through intrusive advertising networks, permanent file retention, and dark conversion patterns.
          </p>
          <p className="text-[#81786E]">
            TPDF provides an independent, focused document engineering environment. We treat every document with institutional dignity, pairing meticulous typography with client-side computation to ensure that your files remain strictly under your control.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
              <Cpu className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-base text-[#292722]">
              Local Execution
            </h3>
            <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
              Document restructuring, merging, splitting, and cryptographic operations run locally inside your web browser memory.
            </p>
          </div>

          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-base text-[#292722]">
              Zero Data Retention
            </h3>
            <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
              When server-level conversion is requested, documents are processed exclusively in volatile memory and purged immediately after completion.
            </p>
          </div>

          <div className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center">
              <Layers className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-semibold text-base text-[#292722]">
              Focused Toolkit
            </h3>
            <p className="text-xs sm:text-sm text-[#81786E] leading-relaxed">
              We specialize in eight foundational document utilities, engineered with precision, reliability, and typographic elegance.
            </p>
          </div>
        </section>

        <section className="bg-[#EAE3D8]/40 border border-[#E9E3DA] p-8 rounded-xl space-y-4">
          <h3 className="font-serif-brand text-2xl text-[#292722]">
            Ready to organize your documents?
          </h3>
          <p className="text-xs sm:text-sm text-[#81786E] max-w-xl">
            Explore the complete suite of eight utilities designed for seamless document workflows.
          </p>
          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#292722] text-[#F7F4EE] px-5 py-2.5 rounded-md hover:bg-[#685447] transition-colors"
            >
              <span>Explore All Tools</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
