/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        roast: {
          50: '#faf5ee',
          100: '#f2e8da',
          200: '#e4d0b4',
          300: '#d1b089',
          400: '#bc8d5e',
          500: '#a67142',
          600: '#8a5a34',
          700: '#6e452b',
          800: '#503221',
          900: '#35221a',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.04), 0 6px 20px -6px rgba(15,23,42,.10)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'drawer-in': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out',
        'drawer-in': 'drawer-in .25s cubic-bezier(.22,1,.36,1)',
        'sheet-in': 'sheet-in .25s cubic-bezier(.22,1,.36,1)',
      },
    },
  },
  plugins: [],
};
