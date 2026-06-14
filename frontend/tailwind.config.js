/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sarkari: {
          red: '#C21E1E',
          blue: '#0F2C59',
          lightBlue: '#E7F6F2',
          orange: '#FF6B6B',
          green: '#1E5128',
          bg: '#FAFAFA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
