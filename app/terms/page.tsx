import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#81786E] mb-8">
        <Link href="/" className="hover:text-[#292722] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D6C5B2]" />
        <span className="text-[#292722] font-medium">Terms of Service</span>
      </nav>

      <header className="space-y-4 mb-14">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#B78360]">
          Legal Agreement
        </span>
        <h1 className="font-serif-brand text-4xl sm:text-5xl text-[#292722]">
          Terms of Service
        </h1>
        <p className="text-base sm:text-lg text-[#81786E] max-w-2xl leading-relaxed">
          These legal terms govern your access to and use of the TPDF platform and its document processing capabilities.
        </p>
      </header>

      <div className="space-y-8 border-t border-[#E9E3DA] pt-10 text-sm sm:text-base leading-relaxed text-[#292722]">
        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            1. Authorized Document Access
          </h2>
          <p className="text-[#81786E]">
            By utilizing TPDF, you affirm that you possess the lawful right, authorization, and ownership to upload, merge, compress, modify, convert, or protect any documents submitted to the platform. You agree not to upload materials that violate applicable copyright, intellectual property regulations, or third party confidentiality agreements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            2. Password Security and Unlocking Standards
          </h2>
          <p className="text-[#81786E]">
            The Unlock PDF utility is engineered strictly to decrypt documents upon submission of the legitimate authorized password. TPDF does not provide password bypass, brute force cracking, or unauthorized credential interception mechanisms. Any attempt to use the platform to bypass security controls on unauthorized files is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            3. Intellectual Property
          </h2>
          <p className="text-[#81786E]">
            All rights, title, brand marks, and software interface designs associated with TPDF remain the exclusive property of TPDF. You retain full, uncompromised ownership and copyright over any document files processed through the application. TPDF claims zero ownership or licensing rights over your user content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif-brand text-2xl text-[#292722]">
            4. Warranty Disclaimer
          </h2>
          <p className="text-[#81786E]">
            The platform and its document utilities are provided on an as is and as available basis without warranties of any kind, whether express or implied. Users are encouraged to maintain independent backups of critical document assets prior to conducting batch operations.
          </p>
        </section>
      </div>
    </div>
  );
}
