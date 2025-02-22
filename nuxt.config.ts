// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["vuetify-nuxt-module", "@pinia/nuxt"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      baseURL: "http://localhost:4004/api/v1",
    },
  },
  devServer: {
    port: 4000,
  },
  app: {
    head: {
      title: "Beauty salon system",
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIIWju1ABYrb5DTkZ8mbDcaAekrgKnjmf0CA&s' }
      ],
    }
  }
});

