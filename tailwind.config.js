module.exports = {
  content: [
    "./views/**/*.{html,js}",
    "./assets/js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'nav-blue' : "#111827",
        'table-gray': '#D9D9D9'
      },
      screens: {
        'mobile' : "320px"
      },
      spacing: {
        '120': '30rem',
      },

    },
  },
  plugins: [],
}
