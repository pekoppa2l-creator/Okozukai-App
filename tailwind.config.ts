import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slateInk: "#0f172a",
        mist: "#eef2ff",
        signal: "#f97316",
        mint: "#14b8a6",
      },
      boxShadow: {
        card: "0 18px 40px -24px rgba(15, 23, 42, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
