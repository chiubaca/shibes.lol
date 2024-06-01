import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  vite: {
    ssr: {
      external: ["node:async_hooks"]
    }
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  experimental: {
    actions: true
  }
});