/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arch: {
          black: '#050505',
          dark: '#0a0a0c',
          card: '#131315',
          border: '#222225',
          purple: '#9333ea',    // Vivid Purple like mockups
          purpleDark: '#7e22ce',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
