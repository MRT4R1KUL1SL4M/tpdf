# TPDF

> *"Every page has its place."*  
> A thoughtful space for your everyday document needs.

TPDF is a minimal, editorial, and privacy-oriented PDF utility platform engineered for reliable document management without ads, paywalls, or privacy trade-offs.

---

## ✦ Core Utilities

TPDF delivers eight essential document operations:

1. **Merge PDF** — Combine multiple PDF files into one ordered document with drag-and-drop reordering.
2. **Split PDF** — Extract specific pages, custom ranges, or separate an entire document into individual files (bundled as ZIP).
3. **Compress PDF** — Real object-stream cleanup and raster optimization with Low, Recommended, and High compression presets.
4. **Convert to PDF** — Convert Word (`.docx`), Excel spreadsheets (`.xlsx`, `.csv`), and plain text into standardized vector PDFs.
5. **Image to PDF** — Turn JPG, PNG, and WebP images into formatted PDF documents with customizable page sizes (A4, Letter, Fit to Image) and margins.
6. **Organize PDF** — Visual page tiles for interactive reordering, 90° rotations, batch selections, and page deletion.
7. **Lock PDF** — Secure sensitive documents using standard AES-256 password encryption.
8. **Unlock PDF** — Remove password restrictions with authorized document credentials.

---

## ✦ Design & Aesthetics

- **Editorial Atmosphere:** Warm neutral palette inspired by fine physical stationery.
- **Palette Tokens:** Warm Ivory (`#F7F4EE`), Crisp Card White (`#FFFFFF`), Terracotta Accent (`#B78360`), Deep Umber (`#292722`), and Muted Slate (`#81786E`).
- **Typography:** `Instrument Serif` for editorial titles paired with `DM Sans` for precise, legible interface controls.
- **Zero Distractions:** No intrusive banners, dark patterns, or aggressive gradients.

---

## ✦ Privacy & Security

- **Client-First Execution:** Operations like merging, splitting, reordering, encrypting, and decrypting process directly inside your browser whenever possible.
- **No Permanent File Storage:** When server conversion is required (e.g. DOCX/XLSX), files are handled strictly in volatile execution memory and purged immediately after completion.
- **Zero Tracking:** No tracking cookies, ad pixels, or third-party behavioral scripts.

---

## ✦ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & PostCSS
- **PDF Core:** `@cantoo/pdf-lib` (with native AES-256 crypto handler)
- **Rendering:** `pdfjs-dist` (Client-side thumbnail generation)
- **Office Parsing:** `mammoth` (DOCX), `xlsx` (Spreadsheets)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Compression & Packaging:** `jszip`

---

## ✦ Getting Started

### Prerequisites

- Node.js `18.x` or `20.x`+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tpdf.git

# Navigate to project directory
cd tpdf

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm start
```

---

## ✦ License

Distributed under the MIT License. See `LICENSE` for details.
