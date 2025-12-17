/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad7a5',
          300: '#f6ba6d',
          400: '#f19333',
          500: '#ee7711',
          600: '#df5d09',
          700: '#b9450a',
          800: '#93380f',
          900: '#772f10',
        },
        storybook: {
          cream: '#FDF8F3',
          brown: '#8B4513',
          gold: '#DAA520',
          navy: '#1e3a5f',
        }
      },
      fontFamily: {
        storybook: ['Merriweather', 'Georgia', 'serif'],
        display: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'page-turn': 'pageTurn 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
      },
      boxShadow: {
        'book': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        'page': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
