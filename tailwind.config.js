/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'f-primary': '#5538EE',
        'f-secondary': '#6B4EFF',
        'f-flat': '#E7E7FF',
        'f-gray': '#E5E5E5',
      },
    },
  },
  plugins: [],
};
