// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-03-09",
  devtools: { enabled: true },
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
  runtimeConfig: {
    public: {
      playwrightTest: process.env.PLAYWRIGHT_TEST === "1" || false
    }
  },

  css: ["~/assets/css/tailwind.css"]
});
