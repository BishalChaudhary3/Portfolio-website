// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './app/**/*.{js,jsx,mdx}',
    './src/**/*.{js,jsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D8196',
          dark: '#4A4A4A',
          light: '#CBCBCB',
          500: '#6D8196',
          400: '#8FA0B1',
          300: '#CBCBCB',
        },
        secondary: {
          DEFAULT: '#CBCBCB',
          dark: '#A8A8A8',
          light: '#FFFFE3',
        },
        accent: {
          DEFAULT: '#6D8196',
          dark: '#4A4A4A',
          light: '#FFFFE3',
        },
        dark: {
          DEFAULT: '#4A4A4A',
          900: '#333333',
          800: '#4A4A4A',
          700: '#5E5E5E',
        },
        gold: {
          DEFAULT: '#6D8196',
          dark: '#4A4A4A',
          light: '#CBCBCB',
          500: '#6D8196',
          400: '#8FA0B1',
          300: '#CBCBCB',
        },
        light: {
          DEFAULT: '#FFFFE3',
          100: '#FFFFE3',
          200: '#F7F7DE',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
