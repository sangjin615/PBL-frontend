import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
});
