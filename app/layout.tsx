import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: ["400"],
});

export const viewport: Viewport = {
  themeColor: "#B78360",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "TPDF — Every page has its place.",
  description: "A thoughtful space for your everyday document needs.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/tpdf-favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/tpdf-icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/tpdf-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TPDF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F4EE] text-[#292722] selection:bg-[#EAE3D8]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
