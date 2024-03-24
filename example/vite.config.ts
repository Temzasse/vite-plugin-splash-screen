import { defineConfig } from "vite";
import { splashScreen } from "vite-plugin-splash-screen";
import { colorScheme } from "vite-plugin-color-scheme";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    colorScheme({
      defaultScheme: "dark",
      variables: {
        light: { "--vpss-background-color": "#ffffff" },
        dark: { "--vpss-background-color": "#242424" },
      },
    }),
    splashScreen({
      logoSrc: "vite.svg",
      loaderType: "line",
      minDurationMs: 2000, // show splash screen for at least 2 seconds
    }),
  ],
});
