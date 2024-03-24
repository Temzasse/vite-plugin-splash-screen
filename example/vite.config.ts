import { defineConfig } from "vite";
import { splashScreen } from "vite-plugin-splash-screen";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splashScreen({
      logoSrc: "vite.svg",
      loaderType: "line",
      minDurationMs: 2000, // show splash screen for at least 2 seconds
    }),
  ],
});
