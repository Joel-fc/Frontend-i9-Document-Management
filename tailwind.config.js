/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#003d5b',
        'brand-orange': '#ec6726',
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

