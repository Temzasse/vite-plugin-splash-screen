import fs from "fs";
import path from "path";
import type { PluginOption, ResolvedConfig } from "vite";

const pluginPath = "node_modules/vite-plugin-splash-screen/src";

type PluginOptions = {
  logoSrc: string;
  loader?: "line" | "dots" | "none";
};

export function splashScreen(options: PluginOptions) {
  if (!options.logoSrc) {
    throw new Error(
      "The `logoSrc` option is required for vite-plugin-splash-screen."
    );
  }

  const { logoSrc, loader = "line" } = options;

  let config: ResolvedConfig;

  return {
    name: "vite-plugin-splash-screen",
    configResolved(resolvedConfig: any) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const baseStyles = fs.readFileSync(
        path.resolve(pluginPath, "styles.css"),
        "utf8"
      );

      let loaderStyles = "";

      if (loader === "line") {
        loaderStyles = fs.readFileSync(
          path.resolve(pluginPath, "loader-line.css"),
          "utf8"
        );
      } else if (loader === "dots") {
        loaderStyles = fs.readFileSync(
          path.resolve(pluginPath, "loader-dots.css"),
          "utf8"
        );
      }

      const logo = fs.readFileSync(
        path.resolve(config.publicDir, logoSrc),
        "utf8"
      );

      const splash = template({
        logoHtml: logo,
        loader,
      });

      return (
        html
          // Add styles to end of head
          .replace(
            "</head>",
            `<style id="vpss-style">${baseStyles}${loaderStyles}</style></head>`
          )
          // Add splash screen to end of body
          .replace("</body>", `${splash}</body>`)
      );
    },
  } satisfies PluginOption;
}

const template = ({
  logoHtml,
  loader,
}: {
  logoHtml: string;
  loader: NonNullable<PluginOptions["loader"]>;
}) => {
  /**
   * TODO: add more loader options.
   * Inspiration: https://cssloaders.github.io/
   */
  let loaderHtml = "";

  if (loader === "line") {
    loaderHtml = `
      <div class="vpss-loader">
        <div class="vpss-line"></div>
        <div class="vpss-subline vpss-inc"></div>
        <div class="vpss-subline vpss-dec"></div>
      </div>
    `;
  } else if (loader === "dots") {
    loaderHtml = `
      <div class="vpss-loader">
        <div class="vpss-dot"></div>
        <div class="vpss-dot"></div>
        <div class="vpss-dot"></div>
        <div class="vpss-dot"></div>
      </div>
    `;
  }

  return `
    <div id="vpss">
      <div class="vpss-logo">${logoHtml}</div>
      ${loaderHtml}
    </div>
  `;
};
