/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulse: {
          dark: '#0B0E14',
          surface: '#161B22',
          red: '#FF3B3B',
          glow: '#FF3B3B4D',
          border: '#30363D',
          textPrimary: '#F0F6FC',
          textSecondary: '#8B949E'
        }
      }
    },
  },
  plugins: [],
}

