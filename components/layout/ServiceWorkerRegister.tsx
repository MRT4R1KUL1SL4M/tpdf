"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function ServiceWorkerRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      });
    }

    // 2. Listen for BeforeInstallPromptEvent for Android / Desktop install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user has previously dismissed install prompt
      const dismissed = localStorage.getItem("tpdf_install_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("tpdf_install_dismissed", "true");
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-white border border-[#E9E3DA] p-4 rounded-xl shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#EAE3D8] text-[#685447] flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 stroke-[1.8]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#292722]">
            Install TPDF App
          </p>
          <p className="text-[11px] text-[#81786E] truncate">
            Fast, offline-ready document toolkit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="bg-[#B78360] hover:bg-[#A06F4D] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-[#81786E] hover:text-[#292722] rounded transition-colors"
          aria-label="Dismiss install banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

