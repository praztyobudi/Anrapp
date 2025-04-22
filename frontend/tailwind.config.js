/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // untuk App Router
    './pages/**/*.{js,ts,jsx,tsx}', // kalau masih pakai Pages Router
    './components/**/*.{js,ts,jsx,tsx}', // untuk komponen
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
