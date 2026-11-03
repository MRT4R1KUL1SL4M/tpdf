"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Tools", href: "/tools" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F7F4EE]/90 backdrop-blur-xs border-b border-[#E9E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2 focus-visible:outline-none"
        >
          <span className="font-serif-brand text-2xl tracking-tight text-[#292722] group-hover:text-[#B78360] transition-colors">
            TPDF
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78360]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#B78360]",
                    isActive ? "text-[#292722] font-semibold" : "text-[#81786E]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#292722] text-[#F7F4EE] px-4 py-2 rounded-md hover:bg-[#685447] transition-colors"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#292722] hover:bg-[#EAE3D8] rounded-md transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E9E3DA] bg-[#F7F4EE] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#292722] hover:text-[#B78360]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#E9E3DA]">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center w-full gap-2 text-xs font-semibold uppercase tracking-wider bg-[#292722] text-[#F7F4EE] px-4 py-2.5 rounded-md hover:bg-[#685447]"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

