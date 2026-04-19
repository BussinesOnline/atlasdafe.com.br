/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#111111',
          600: '#1a1a1a',
          500: '#222222',
        },
        gold: {
          100: '#FFF8E7',
          200: '#F5E6C8',
          300: '#E8D5A3',
          400: '#D4B96A',
          500: '#C9A84C',
          600: '#B8943F',
          700: '#8B6F2E',
        },
      },
    },
  },
  plugins: [],
}
