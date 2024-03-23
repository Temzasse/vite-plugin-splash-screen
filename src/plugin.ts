import fs from "fs";
import path from "path";
import template from "lodash.template";
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
      const stylesCss = fs.readFileSync(
        path.resolve(pluginPath, "styles.css"),
        "utf8"
      );

      const templateHtml = fs.readFileSync(
        path.resolve(pluginPath, "template.html"),
        "utf8"
      );

      // resolve logo svg relative to the public directory

      const logo = fs.readFileSync(
        path.resolve(config.publicDir, options.logoSrc),
        "utf8"
      );

      const splash = template(templateHtml)({ logo });

      return (
        html
          // Add styles to end of head
          .replace("</head>", `<style>${stylesCss}</style></head>`)
          // Add splash screen to end of body
          .replace("</body>", `${splash}</body>`)
      );
    },
  } satisfies PluginOption;
}
