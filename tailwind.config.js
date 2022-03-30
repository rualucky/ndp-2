module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  mode: 'jit',
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 2s ease-in-out',
      },
      keyframes: (theme) => ({
        fadeOut: {
          '0%': { backgroundColor: theme('colors.green.100'), display: 'none' },
          '100%': { backgroundColor: theme('colors.transparent'), display: 'block'}
        },
      }),
    },
  },
  plugins: [
    require("tw-elements/dist/plugin")
  ],
}

