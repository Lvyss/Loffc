/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "#120e08",
        "bg-elevated": "#1a1409",
        "bg-card": "#211a0e",
        "gold": "#c89b3c",
        "gold-soft": "#e0be6d",
        "gold-dim": "#8a6b28",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};