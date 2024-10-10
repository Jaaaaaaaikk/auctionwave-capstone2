// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: [ "~/assets/tailwind.css", 'leaflet/dist/leaflet.css', '~/assets/custom.css', ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});