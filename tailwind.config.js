import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: '#f2e5bc',
          100: '#ebdbb2',
          200: '#d5c4a1',
          300: '#bdae93',
          400: '#a89984',
          500: '#d79921',
          600: '#b57614',
          700: '#a65e0a',
          800: '#7c2f10',
          900: '#5a1f0f',
        },
        surface: {
          900: '#1d2021',
          800: '#282828',
          700: '#32302f',
          600: '#3c3836',
          500: '#504945',
        },
      },
      boxShadow: {
        card: '0 16px 50px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
}
