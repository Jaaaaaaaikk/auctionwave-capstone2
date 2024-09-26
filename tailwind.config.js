/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./assets/**/*.{css,js,ts}",
    "./error.vue",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-darkbrown':'#23120B',
        'custom-white':'#F1F1F1',
        'custom-yellow':'#FDB827',
        'custom-blue':'#21209C',
        'custom-fuschia':'#ADACFF',
        'custom-bluegreen':'#005262',
        'custom-bluegreen2':'#002931',
        'custom-gray':'#565656',
        'custom-green':'#bde5ac',
        'custom-green2':'#00191d',
        'custom-blue2':'#e6eeef',
      },
      fontSize: {
       
        'custom-size': '1.4rem', // Custom size, e.g., 40px
      },
      height: {
        '128': '32rem', // Custom height value (e.g., h-128)
        '144': '36rem', // Another custom height value
        '162': '40rem',
        'screen-90': '90vh', // Example of height using viewport units
      },
      fontFamily: {
        sans: ['Exo', 'Helvetica', 'Arial', 'sans-serif'], // Add "Exo" to the sans font stack
      },
      
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
            '0 35px 35px rgba(0, 0, 0, 0.25)',
            '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      },


    },
  },
  plugins: [require("flowbite/plugin")],
};
