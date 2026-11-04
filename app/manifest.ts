import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TPDF — Every page has its place",
    short_name: "TPDF",
    description: "A thoughtful space for your everyday document needs.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#B78360",
    orientation: "portrait",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icons/tpdf-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/tpdf-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/tpdf-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/tpdf-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/ScreenShot/S1.png",
        sizes: "720x333",
        type: "image/png",
        form_factor: "wide",
        label: "TPDF Document Hub",
      },
      {
        src: "/ScreenShot/S2.png",
        sizes: "938x477",
        type: "image/png",
        form_factor: "wide",
        label: "Explore PDF Utilities",
      },
      {
        src: "/ScreenShot/S3.png",
        sizes: "939x494",
        type: "image/png",
        form_factor: "wide",
        label: "Secure Document Operations",
      },
    ],
  };
}
