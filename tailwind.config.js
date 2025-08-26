/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-custom': '#111418',
        'card-custom': '#1b2127',
        'input-custom': '#1d2125',
        'custom': '#1b2127',
        'custom-muted': '#9cabba',
        'primary': '#3d98f4',
        'secondary': '#283039',
        'border-custom': '#3b4754',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'noto': ['Noto Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)',
      }
    },
  },
  plugins: [],
} 