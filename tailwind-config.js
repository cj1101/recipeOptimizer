// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEECFE',
          100: '#D7D3FD',
          200: '#B0A8FA',
          300: '#897CF8',
          400: '#6251F5',
          500: '#4F46E5',
          600: '#2921BC',
          700: '#1E1886',
          800: '#141051',
          900: '#0A081B',
          dark: '#2921BC',
        },
        accent: {
          DEFAULT: '#06B6D4',
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#06B6D4',
          600: '#0097A7',
          700: '#00838F',
          800: '#006064',
          900: '#004D40',
          dark: '#0097A7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'grunge-texture': "url('/public/textures/grunge-texture.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
