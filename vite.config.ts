import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
    },
    plugins: [
      TanStackRouterVite(),
      tsConfigPaths(),
      tailwindcss(),
      viteReact(),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
