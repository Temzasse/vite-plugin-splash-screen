import fs from "fs";
import path from "path";
import type { PluginOption, ResolvedConfig } from "vite";

type LoaderType = "line" | "dots" | "none";

type PluginOptions = {
  logoSrc: string;
  splashBg?: string;
  loaderBg?: string;
  loaderType?: LoaderType;
  minDurationMs?: number;
};

export function splashScreen(options: PluginOptions) {
  if (!options.logoSrc) {
    throw new Error(
      "The `logoSrc` option is required for vite-plugin-splash-screen!"
    );
  }

  const {
    logoSrc,
    minDurationMs,
    loaderType = "line",
    loaderBg = "#0072f5",
    splashBg = "#ffffff",
  } = options;

  let config: ResolvedConfig;

  return {
    name: "vite-plugin-splash-screen",
    configResolved(resolvedConfig: any) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const baseStyles = readPluginFile("styles.css");

      let loaderStyles = "";

      if (loaderType === "line") {
        loaderStyles = readPluginFile("loaders/line.css");
      } else if (loaderType === "dots") {
        loaderStyles = readPluginFile("loaders/dots.css");
      }

      const logoHtml = fs.readFileSync(
        path.resolve(config.publicDir, logoSrc),
        "utf8"
      );

      const splash = splashTemplate({
        logoHtml,
        loaderType,
        minDurationMs,
      });

      const b = baseStyles.replace("/*BG_SPLASH*/", splashBg);
      const l = loaderStyles.replace("/*BG_LOADER*/", loaderBg);

      const styles = `<style id="vpss-style">${b}${l}</style>`;

      return (
        html
          // Add styles to end of head
          .replace("</head>", `${styles}</head>`)
          // Add splash screen to end of body
          .replace("</body>", `${splash}</body>`)
      );
    },
  } satisfies PluginOption;
}

function splashTemplate({
  logoHtml,
  loaderType,
  minDurationMs,
}: {
  logoHtml: string;
  loaderType: LoaderType;
  minDurationMs?: number;
}) {
  /**
   * TODO: add more loader options.
   * Inspiration: https://cssloaders.github.io/
   */
  let loaderHtml = "";

  if (loaderType === "line") {
    loaderHtml = readPluginFile("loaders/line.html");
  } else if (loaderType === "dots") {
    loaderHtml = readPluginFile("loaders/dots.html");
  }

  return /*html*/ `
    <div id="vpss">
      <div class="vpss-logo">${logoHtml}</div>
      ${loaderHtml}
    </div>
    <script>
      (function () {
        const id = "vpss";
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(url.search)
        const param = urlParams.get(id);
        
        // Setup global options
        window.__VPSS__ = {
          id: id,
          hidden: param === "false",
          renderedAt: new Date().getTime(),
          minDurationMs: ${minDurationMs || 0},
          getElement: function() {
            return document.getElementById(id);
          },
          getStyles: function() {
            return document.getElementById(id + "-style");
          },
          show: function () {
            const element = this.getElement();
            if (!element) return;

            element.style.visibility = "visible";
          },
          hide: async function () {
            const element = this.getElement();
            if (!element) return;

            // Set hidden flag to prevent multiple calls
            this.hidden = true;

            element.addEventListener("animationend", (event) => {
              if (event.animationName === id + "-hide") {
                this.remove();
              }
            });

            // Optionally wait for minDurationMs before starting animation
            if (
              this.minDurationMs !== undefined &&
              this.renderedAt !== undefined
            ) {
              const elapsedTime = new Date().getTime() - this.renderedAt;
              const remainingTime = Math.max(this.minDurationMs - elapsedTime, 0);
              await new Promise((resolve) => setTimeout(resolve, remainingTime));
            }

            // Start animation
            element.classList.add(id + '-hidden');
          },
          remove: function () {
            const element = this.getElement();
            const styles = this.getStyles();

            if (element && styles) {
              element.remove();
              styles.remove();
            }
          }
        };

        if (window.__VPSS__.hidden) {
          window.__VPSS__.remove();
        } else {
          window.__VPSS__.show();
        }
        
        // Remove query param from URL
        if (param) {
          urlParams.delete(id);
          url.search = urlParams.toString();
          window.history.replaceState({}, "", url);
        }
      })();
    </script>
  `;
}

// TODO: is there an easier way to resolve static files relative to the plugin?
const pluginPath = "node_modules/vite-plugin-splash-screen/src";

function readPluginFile(filePath: string) {
  return fs.readFileSync(path.resolve(pluginPath, filePath), "utf8");
}
