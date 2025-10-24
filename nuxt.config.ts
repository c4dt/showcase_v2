// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-03-09",
  devtools: { enabled: true },
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/showcase_v2/" : ""
  },
  modules: ["@nuxt/eslint", "@vesp/nuxt-fontawesome", "@nuxt/image", "@nuxt/test-utils/module"],
  eslint: {},
  fontawesome: {
    icons: {
      solid: ["home", "newspaper", "envelope", "caret-down", "code", "times"],
      regular: ["newspaper", "file"],
      brands: ["github"]
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },

  css: ["~/assets/css/tailwind.css"]
});
