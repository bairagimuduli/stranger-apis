/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'upside-down-red': '#ff073a',
        'upside-down-red-dark': '#ff0040',
        'crt-green': '#00ff41',
        'crt-green-dark': '#00cc33',
        'hawkins-black': '#0a0a0a',
        'hawkins-dark': '#1a1a1a',
      },
      fontFamily: {
        'retro': ['VT323', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'neon-red': '0 0 10px #ff073a, 0 0 20px #ff073a, 0 0 30px #ff073a',
        'neon-green': '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.98 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}

