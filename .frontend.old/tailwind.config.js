/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // untuk App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // kalau masih pakai Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // untuk komponen
  ],
  theme: {
    extend: {
      colors: {
        anr: {
          DEFAULT: "#19633E",
          100: "#124F31",
          200: "#288C5A",
        },
      },
      animation: {
        "fade-in": "fadeIn 1.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
