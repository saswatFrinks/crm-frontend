/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f-primary': "#6B4EFF",
        'f-secondary': '#C6C4FF',
        'f-flat': '#E7E7FF'
      }
    },
  },
  plugins: [],
}

