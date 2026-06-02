import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#173D2B",
        leaf: "#2F7548",
        mint: "#E2F2DF",
        cream: "#F8F6EE",
        sand: "#EAE4D7",
        earth: "#8C6042",
      },
      boxShadow: {
        card: "0 10px 30px rgba(25, 61, 43, 0.08)",
        float: "0 12px 25px rgba(23, 61, 43, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
