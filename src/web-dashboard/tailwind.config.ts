import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
};
export default config;
