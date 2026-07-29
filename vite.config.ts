import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { type ConfigEnv, defineConfig, loadEnv } from "vite";
import { checker } from "vite-plugin-checker";
import circleDependency from "vite-plugin-circular-dependency";
import externalize from "vite-plugin-externalize-dependencies";
import vitePluginSingleSpa from "vite-plugin-single-spa";

const microfrontendDependencies = [/^@n-orm\/.+-mf-app/];
const externalDependencies = [
  ...microfrontendDependencies,
  "react",
  "react-dom",
  "react-router-dom",
  "single-spa",
  "@sber-orm/ui-kit",
  "@sber-orm/components",
];

export default function vite({ mode }: ConfigEnv) {
  const environment = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    base: environment.BASE_PREFIX_URL ?? "./",
    define: {
      "process.env": environment,
    },
    plugins: [
      react({ include: /\.(ts|js)x?$/ }),
      checker({ typescript: true }),
      vitePluginSingleSpa({
        type: "mife",
        spaEntryPoints: "src/tariff-mf-app.tsx",
        serverPort: 4411,
      }),
      externalize({
        externals:
          mode === "test" ? microfrontendDependencies : externalDependencies,
      }),
      circleDependency(),
    ],
    css: { devSourcemap: true },
    envPrefix: "VITE_",
    resolve: {
      alias: [
        { find: "@", replacement: fileURLToPath(new URL("src", import.meta.url)) },
        { find: "process", replacement: "process/browser" },
      ],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    preview: { cors: true },
    build: {
      cssCodeSplit: true,
      assetsDir: "assets",
      manifest: true,
      minify: false,
      rollupOptions: {
        input: "src/tariff-mf-app.tsx",
        external: externalDependencies,
        output: {
          chunkFileNames: "chunks/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
          entryFileNames: "[name].js",
          format: "system",
          globals: {
            react: "react",
            reactDom: "react-dom",
            singleSpa: "single-spa",
          },
        },
        preserveEntrySignatures: "strict",
      },
    },
    test: {
      environment: "happy-dom",
      coverage: {
        enabled: true,
        provider: "istanbul",
        extension: [".ts"],
        exclude: ["**/index.ts", "**/types.ts"],
      },
      server: {
        deps: {
          inline: ["@sber-orm/ui-kit", "@sber-orm/components"],
        },
      },
    },
  });
}
