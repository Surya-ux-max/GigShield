/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#dc2626',
        'primary-dark': '#b91c1c',
        'primary-light': '#ef4444',
        'primary-soft': '#fef2f2',
        carely: {
          red: '#dc2626',
          'red-dark': '#b91c1c',
          'red-light': '#ef4444',
          'red-soft': '#fef2f2',
          'red-muted': '#fee2e2',
        },
      },
      animation: {
        blob: 'blob 7s infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
