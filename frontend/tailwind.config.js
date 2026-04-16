/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg-primary)",
        foreground: "var(--color-text-primary)",
        primary: "var(--color-lavender)",
        secondary: "var(--color-sky)",
        accent: "var(--color-sage)"
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
