module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 100,
      propList: ['*']
    },
    tailwindcss: {
      purge: {
        layers: ['utilities'],
        content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
      },
      darkMode: false, // or 'media' or 'class'
      theme: {
        extend: {}
      },
      variants: {},
      plugins: []
    }
  }
}
