/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins']
      },
      colors: {
        'custom-primary': '#3B82F6',
        'custom-secondary': '#1E293B',
        'custom-background': '#020818',
        'custom-background-dark': '#01050E',
        'custom-white': '#fafafe',
        'custom-gray': '#9ca3af'
      }
    }
  },
  plugins: []
}
