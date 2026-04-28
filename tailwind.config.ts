import type { Config } from "tailwindcss"; 

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        title: "var(--title)",
        "text-muted": "var(--text-muted)",
        "bg-main": "var(--bg-main)",
        "bg-subtle": "var(--bg-subtle)",
        "border-light": "var(--border-light)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        success: "var(--success)"
      },
    },
  },
  plugins: [],
} satisfies Config;