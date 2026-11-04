import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">Privacy Policy</span>
      </nav>

      <header className="space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          <ShieldCheck className="w-4 h-4" />
          <span>Security and Data Retention Standards</span>
        </div>
        <h1 className="font-serif-brand text-4xl sm:text-5xl text-[#292722]">
          {BRAND.privacyHeading}
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          {BRAND.privacyDescription}
        </p>
      </header>

      <div className="space-y-10 border-t border-[#E9E3DA] pt-10 text-sm sm:text-base leading-relaxed text-[#292722]">
        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            1. Client Side Processing Guarantee
          </h2>
          <p className="text-[#81786E]">
            Core document procedures including merging, page extraction, visual reorganizing, rotation, password locking, and authorized unlocking execute strictly inside your local web browser session. Your documents are not transmitted across external networks or stored on remote hardware during these operations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            2. Ephemeral Server Lifecycle
          </h2>
          <p className="text-[#81786E]">
            When file format conversion is requested for complex document types such as Word documents or spreadsheets, the target file is transmitted via encrypted transport layer security directly to an isolated compute environment. Processing is conducted exclusively in volatile memory. Any temporary storage allocations required by execution workers are permanently deleted immediately upon file generation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            3. Cryptographic Key Handling
          </h2>
          <p className="text-[#81786E]">
            Passwords entered for document encryption or decryption are utilized strictly within volatile memory to compute AES 256 bit cryptographic keys. Passwords are never logged, recorded, transmitted to analytics services, or stored in persistent databases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            4. Absence of Tracking Technologies
          </h2>
          <p className="text-[#81786E]">
            TPDF does not deploy advertising trackers, behavioral profiling pixels, third party data brokers, or marketing cookies. We respect user privacy by default and collect zero personally identifiable information during document workflows.
          </p>
        </section>

        <section className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-4">
          <h3 className="font-semibold text-base text-[#292722]">
            Summary of Commitments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#81786E]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
              <span>Zero permanent document storage on servers.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
              <span>No user tracking cookies or third party advertising.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
              <span>Client first execution architecture for all supported tools.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#B78360] shrink-0 mt-0.5" />
              <span>Immediate deletion of temporary processing buffers.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
