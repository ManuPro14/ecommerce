/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'heroImage': "url('/public/img/bg-header.jpg')",
        'contactImage': "url('/public/img/bg-contacto.jpg')",
    },
  },
  plugins: [],
}
}