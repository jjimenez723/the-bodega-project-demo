import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#1D1D1F",
        leaf: "#0071E3",
        mint: "#E8F3FF",
        cream: "#F5F5F7",
        sand: "#D2D2D7",
        earth: "#A2845E",
      },
      boxShadow: {
        card: "0 18px 44px rgba(0, 0, 0, 0.08)",
        float: "0 18px 34px rgba(0, 113, 227, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
