const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: [
    "./views/**/*.{html,js}",
    "./views/*.ejs",
    "./assets/js/*.js"
  ],
  theme: {
    screens: {
      'larger': {'max':'1530px'},
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'nav-blue' : "#111827",
        'table-gray': '#D9D9D9'
      },
      spacing: {
        '120': '30rem',
      },

    },
  },
  plugins: [],
}
