/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f5',
          100: '#d9ece7',
          200: '#b5d9d0',
          300: '#88c0b3',
          400: '#5fa396',
          500: '#45897c',
          600: '#356e64',
          700: '#2d5a53',
          800: '#274a44',
          900: '#233e39',
        },
        field: {
          light: '#6ec6b5',
          DEFAULT: '#45897c',
          dark: '#2d5a53',
        },
        sun: {
          light: '#ffd1a3',
          DEFAULT: '#e8874a',
          dark: '#c66a2e',
        },
        sky: {
          light: '#c4b5d9',
          DEFAULT: '#7c5a9c',
          dark: '#5e4278',
        },
        donner: {
          light: '#e6f5f0',
          DEFAULT: '#2a9d8f',
          dark: '#1e7a6e',
        },
        echanger: {
          light: '#fef0e4',
          DEFAULT: '#e07b3c',
          dark: '#c0612a',
        },
        vendre: {
          light: '#fce8ec',
          DEFAULT: '#d45670',
          dark: '#b34058',
        },
        preter: {
          light: '#eee8f5',
          DEFAULT: '#7b5ea7',
          dark: '#5c4480',
        },
        cherche: {
          light: '#e4ecf5',
          DEFAULT: '#4a7ab5',
          dark: '#355a8a',
        },
        cream: {
          50: '#fafcfb',
          100: '#f3f7f5',
          200: '#e8f0ed',
        },
        stone: {
          50: '#f9f8f7',
          100: '#f1efec',
          200: '#e3dfd9',
          300: '#cfc8be',
          400: '#b5ab9c',
          500: '#9a8e7c',
          600: '#7d7264',
          700: '#665c50',
          800: '#544c42',
          900: '#464039',
        },
      },
      fontSize: {
        'base': ['16px', '1.6'],
        'lg': ['18px', '1.6'],
        'xl': ['20px', '1.5'],
        '2xl': ['24px', '1.4'],
        '3xl': ['30px', '1.3'],
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
    },
  },
  plugins: [],
};
