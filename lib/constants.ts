export interface ToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  iconName: "Files" | "Scissors" | "FileArchive" | "FileType" | "Image" | "Layers" | "Lock" | "Unlock";
  category: "edit" | "convert" | "security" | "optimize";
}

export const TOOLS: ToolItem[] = [
  {
    id: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one ordered document.",
    href: "/tools/merge",
    iconName: "Files",
    category: "edit",
  },
  {
    id: "split",
    name: "Split PDF",
    description: "Extract specific pages or page ranges from a PDF.",
    href: "/tools/split",
    iconName: "Scissors",
    category: "edit",
  },
  {
    id: "compress",
    name: "Compress PDF",
    description: "Reduce PDF file size while preserving essential document quality.",
    href: "/tools/compress",
    iconName: "FileArchive",
    category: "optimize",
  },
  {
    id: "convert",
    name: "Convert to PDF",
    description: "Convert Word documents, spreadsheets, presentations, and text into PDF.",
    href: "/tools/convert",
    iconName: "FileType",
    category: "convert",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Turn photos and image files into formatted PDF documents.",
    href: "/tools/image-to-pdf",
    iconName: "Image",
    category: "convert",
  },
  {
    id: "organize",
    name: "Organize PDF",
    description: "Reorder, rotate, or delete individual pages visually.",
    href: "/tools/organize",
    iconName: "Layers",
    category: "edit",
  },
  {
    id: "lock",
    name: "Lock PDF",
    description: "Protect sensitive documents with standard password encryption.",
    href: "/tools/lock",
    iconName: "Lock",
    category: "security",
  },
  {
    id: "unlock",
    name: "Unlock PDF",
    description: "Remove password protection from documents using the correct password.",
    href: "/tools/unlock",
    iconName: "Unlock",
    category: "security",
  },
];

export const BRAND = {
  name: "TPDF",
  tagline: "Every page has its place.",
  description: "A thoughtful space for your everyday document needs.",
  eyebrow: "YOUR EVERYDAY PDF TOOLKIT",
  privacyHeading: "Your files stay yours.",
  privacyDescription:
    "Your documents deserve privacy. Files are processed securely and temporary files are removed according to the application's retention policy.",
};

