import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

const config: ReturnType<typeof defineConfig> = defineConfig({
  site: "https://msrnote.com/",
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  server: {
    headers: {
      // SQLite ファイルを OPFS に保存するためのヘッダー
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  vite: {
    optimizeDeps: {
      // Astro で SQLite を使用するための設定
      exclude: ["@sqlite.org/sqlite-wasm"],
    },
  },
});

export default config;
