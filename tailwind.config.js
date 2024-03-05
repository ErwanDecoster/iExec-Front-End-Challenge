/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'transparent': 'transparent',
      'black': '#1D1D24',
      'primary': '#FCD15A',
      'primary-disable': '#DAC17C',
      'super-red': '#C7302B',
      'green': '#27AE60',
      'white': '#fff',
    },
    backgroundImage: {
      'background': "url('/background.webp')",
      'background-blur': "url('/background-blur.webp')",
    }
    
  },
  plugins: [],
}

