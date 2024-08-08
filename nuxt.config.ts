// https://nuxt.com/docs/api/configuration/nuxt-config

export default ({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  serverMiddleware: [
    {
      path: '/api/login', handler: '~/server/api/login.js'
    }
  ],
});
