/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {

        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        "primary": "#85d1a0",
        "secondary": "#6255a4",
      },
      screens: {
        "xs": "300px",
        'sm': '540px',

        // => @media (min-width: 992px) { ... }
      },
    },

    plugins: [],
  }
}
