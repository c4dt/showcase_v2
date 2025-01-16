// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@vesp/nuxt-fontawesome"],
  eslint: {},
  fontawesome: {
    icons: {
      solid: ["home", "newspaper", "tags", "envelope", "caret-down", "code"],
      regular: ["newspaper", "file"],
      brands: ["github"]
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  css: ["~/assets/css/main.css"]
});
