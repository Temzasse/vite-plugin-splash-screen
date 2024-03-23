import fs from "fs";
import path from "path";
import type { PluginOption, ResolvedConfig } from "vite";

const pluginPath = "node_modules/vite-plugin-splash-screen/src";

type PluginOptions = {
  logoSrc: string;
};

export function splashScreen(options: PluginOptions) {
  if (!options.logoSrc) {
    throw new Error(
      "The `logoSrc` option is required for vite-plugin-splash-screen."
    );
  }

  let config: ResolvedConfig;

  return {
    name: "vite-plugin-splash-screen",
    configResolved(resolvedConfig: any) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const styles = fs.readFileSync(
        path.resolve(pluginPath, "styles.css"),
        "utf8"
      );

      const logo = fs.readFileSync(
        path.resolve(config.publicDir, options.logoSrc),
        "utf8"
      );

      const splash = template(logo).replace(/\n/g, "");

      return (
        html
          // Add styles to end of head
          .replace("</head>", `<style id="vpss-style">${styles}</style></head>`)
          // Add splash screen to end of body
          .replace("</body>", `${splash}</body>`)
      );
    },
  } satisfies PluginOption;
}

const template = (logo: string) => `
<div id="vpss">
  <div class="vpss-logo">${logo}</div>
  <div class="vpss-loader">
    <div class="vpss-line"></div>
    <div class="vpss-subline vpss-inc"></div>
    <div class="vpss-subline vpss-dec"></div>
  </div>
</div>`;
