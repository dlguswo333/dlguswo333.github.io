/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    // https://tailwindcss.com/docs/screens
    screens: {
      'sm': '320px',
      'md': '840px',
      'lg': '1200px',
    },
  },
  plugins: [],
}
