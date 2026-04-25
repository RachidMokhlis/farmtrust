/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        farm: {
          green: '#1a4a1a',
          light: '#90ee90',
          gold: '#f0c040',
          dark: '#0f1f0f',
        }
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
