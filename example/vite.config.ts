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
        light: {
          "--vpss-bg-splash": "#ffffff",
          "--vpss-bg-loader": "#b18500",
        },
        dark: {
          "--vpss-bg-splash": "#242424",
          "--vpss-bg-loader": "#ffcb29",
        },
      },
    }),
    splashScreen({
      minDurationMs: 2000, // show splash screen for at least 2 seconds
      logoSrc: "vite.svg",
      loaderType: "line",
      /**
       * If you don't need dynamic colors and don't want to use CSS variables
       * to configure the splash screen, you can provide fixed colors instead:
       */
      // loaderBg: "#ffcb29",
      // splashBg: "#242424",
    }),
  ],
});
