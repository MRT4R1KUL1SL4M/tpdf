import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">Terms of Service</span>
      </nav>

      {/* Header */}
      <header className="space-y-4 mb-14">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          Terms & Conditions
        </span>
        <h1 className="font-serif-brand text-4xl sm:text-5xl text-[#292722]">
          Terms of Service
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          Clear and honest terms governing your use of the TPDF application.
        </p>
      </header>

      {/* Content */}
      <div className="space-y-8 border-t border-[#E9E3DA] pt-10 text-sm sm:text-base leading-relaxed text-[#292722]">
        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            1. Authorized Use
          </h2>
          <p className="text-[#81786E]">
            You agree to use TPDF solely for lawful purposes and in accordance with applicable intellectual property and privacy laws. You confirm that you have the right to process, convert, or protect any documents uploaded to the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            2. Password Protection and Authorization
          </h2>
          <p className="text-[#81786E]">
            The Unlock PDF utility requires the authorized password for the target document. You must not use TPDF to attempt unauthorized access to documents for which you lack authorization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            3. Disclaimer and Warranty
          </h2>
          <p className="text-[#81786E]">
            TPDF provides all utilities &ldquo;as is&rdquo; without warranties of any kind. While we rigorously test document parsing and format fidelity, users are encouraged to maintain independent backups of critical documents.
          </p>
        </section>
      </div>
    </div>
  );
}

