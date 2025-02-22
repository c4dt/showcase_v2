// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

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
  vite: {
    plugins: [tailwindcss()]
  },
  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },
  css: ["~/assets/css/tailwind.css"]
});
