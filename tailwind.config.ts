import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F4EE",
        surface: "#FFFFFF",
        "secondary-bg": "#EAE3D8",
        "soft-beige": "#D6C5B2",
        accent: {
          DEFAULT: "#B78360",
          hover: "#A06F4D",
          secondary: "#685447",
        },
        primary: {
          text: "#292722",
        },
        secondary: {
          text: "#81786E",
        },
        border: {
          subtle: "#E9E3DA",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

