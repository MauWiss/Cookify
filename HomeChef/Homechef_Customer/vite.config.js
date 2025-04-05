import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "screenshot1.png",
        "screenshot2.png",
      ],
      manifest: {
        short_name: "HomeChef",
        name: "HomeChef Recipes App",
        start_url: ".",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "screenshot1.png",
            type: "image/png",
            sizes: "600x800",
            form_factor: "wide",
          },
          {
            src: "screenshot2.png",
            type: "image/png",
            sizes: "600x800",
          },
        ],
      },
    }),
  ],
});
