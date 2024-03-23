import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-ignore
import { splashScreen } from "../src/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splashScreen({ logoSrc: "vite.svg" })],
});
