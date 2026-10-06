/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bmw: {
          dark: '#050505',
          panel: '#0B0C0E',
          card: '#101114',
          border: '#1F2228',
          blue: '#1675D1',
          lightBlue: '#3B97FF',
          accent: '#0066B1',
          silver: '#A4A4A4',
          muted: '#626875',
          red: '#E7222E', // BMW M Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Syncopate', 'Inter', 'sans-serif']
      },
      letterSpacing: {
        'ultra-wide': '0.3em',
        'mega-wide': '0.45em'
      }
    },
  },
  plugins: [],
}
