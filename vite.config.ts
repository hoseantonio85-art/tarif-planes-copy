import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  base: mode === "development" ? "/" : "/tarif-planes-copy/",
  resolve: {
    alias: [
      {
        find: "@sber-orm/ui-kit/index.css",
        replacement: path.resolve(__dirname, "./vendor/ui-kit-0.283.0/dist/index.css"),
      },
      {
        find: "@sber-orm/ui-kit",
        replacement: path.resolve(__dirname, "./vendor/ui-kit-0.283.0/dist/index.js"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
}));
