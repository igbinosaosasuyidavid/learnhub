/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    extend:{
      colors: {
     
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        "primary":"#85d1a0",
        "secondary":"#6255a4",
    },
    },
    
  plugins: [],
  }
}
