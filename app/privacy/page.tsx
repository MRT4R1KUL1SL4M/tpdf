import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Check } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <header className="space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Retention</span>
        </div>
        <h1 className="font-serif-brand text-4xl sm:text-5xl text-[#292722]">
          {BRAND.privacyHeading}
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          {BRAND.privacyDescription}
        </p>
      </header>

      {/* Content */}
      <div className="space-y-10 border-t border-[#E9E3DA] pt-10 text-sm sm:text-base leading-relaxed text-[#292722]">
        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            1. Client-Side Processing Priority
          </h2>
          <p className="text-[#81786E]">
            Whenever technically viable (such as in merging, splitting, reordering, locking, and unlocking), document computations occur directly in your web browser. Under this model, your confidential files never leave your device and are never transmitted to our backend servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            2. Server-Side Temporary File Lifecycle
          </h2>
          <p className="text-[#81786E]">
            When you invoke document format conversion (e.g., DOCX or XLSX conversion to PDF), files are securely handled in ephemeral execution memory. If temporary disk buffers are utilized by isolated worker processes, they are removed via automated cleanup routines immediately after the operation concludes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            3. Password Secrecy
          </h2>
          <p className="text-[#81786E]">
            Passwords provided for document encryption or decryption are processed strictly in execution context. We do not store, log, track, or share your document passwords in any persistent database or analytics mechanism.
          </p>
        </section>

        <section className="bg-white border border-[#E9E3DA] p-6 rounded-xl space-y-3">
          <h3 className="font-semibold text-base text-[#292722]">
            Our Privacy Guarantees
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-[#81786E]">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B78360] shrink-0" />
              <span>Zero permanent document storage.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B78360] shrink-0" />
              <span>No user tracking cookies or third-party ad networks.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B78360] shrink-0" />
              <span>Client-first local document operations wherever technically possible.</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B78360] shrink-0" />
              <span>Immediate cleanup of temporary conversion buffers.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

