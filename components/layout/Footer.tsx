import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#E9E3DA] bg-[#F7F4EE] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-[#E9E3DA]">
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-serif-brand text-2xl tracking-tight text-[#292722]">
                TPDF
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B78360]" />
            </Link>
            <p className="font-serif-brand text-lg text-[#292722] italic">
              &ldquo;{BRAND.tagline}&rdquo;
            </p>
            <p className="text-xs text-[#81786E] leading-relaxed">
              {BRAND.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#81786E]">
                Platform
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="/tools" className="text-[#292722] hover:text-[#B78360] transition-colors">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link href="/tools/merge" className="text-[#81786E] hover:text-[#292722] transition-colors">
                    Merge PDF
                  </Link>
                </li>
                <li>
                  <Link href="/tools/compress" className="text-[#81786E] hover:text-[#292722] transition-colors">
                    Compress PDF
                  </Link>
                </li>
                <li>
                  <Link href="/tools/organize" className="text-[#81786E] hover:text-[#292722] transition-colors">
                    Organize PDF
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/MRT4R1KUL1SL4M/tpdf/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B78360] font-medium hover:text-[#A06F4D] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Android App (.apk)</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#81786E]">
                Company
              </span>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-[#292722] hover:text-[#B78360] transition-colors">
                    About TPDF
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#81786E] hover:text-[#292722] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-[#81786E] hover:text-[#292722] transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#81786E]">
                Security
              </span>
              <p className="text-xs text-[#81786E] leading-relaxed">
                Client-side processing & isolated memory conversion. No permanent file retention.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#81786E]">
          <p>© {currentYear} TPDF. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#292722] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#292722] transition-colors">
              Terms
            </Link>
            <Link href="/about" className="hover:text-[#292722] transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

