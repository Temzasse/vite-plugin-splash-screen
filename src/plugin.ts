import fs from 'fs';
import path from 'path';

import type { PluginOption, ResolvedConfig } from 'vite';

import dotsHtml from './loaders/dots.html?raw';
import lineHtml from './loaders/line.html?raw';

import dotsCss from './loaders/dots.css?raw';
import lineCss from './loaders/line.css?raw';
import baseStyles from './styles.css?raw';

type LoaderType = 'line' | 'dots' | 'none';

// CSS/HTML assets are inlined into the bundle as strings at build time
const loaders: Record<LoaderType, { css: string; html: string }> = {
  line: { css: lineCss, html: lineHtml },
  dots: { css: dotsCss, html: dotsHtml },
  none: { css: '', html: '' },
};

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
      'The `logoSrc` option is required for vite-plugin-splash-screen!'
    );
  }

  const {
    logoSrc,
    minDurationMs,
    loaderType = 'line',
    loaderBg = '#0072f5',
    splashBg = '#ffffff',
  } = options;

  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-splash-screen',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },
    transformIndexHtml(html: string) {
      const loaderStyles = loaders[loaderType].css;

      const logoHtml = fs.readFileSync(
        path.resolve(config.publicDir, logoSrc),
        'utf8'
      );

      const splash = splashTemplate({
        logoHtml,
        loaderType,
        minDurationMs,
      });

      const b = baseStyles.replace('/*BG_SPLASH*/', splashBg);
      const l = loaderStyles.replace('/*BG_LOADER*/', loaderBg);

      const styles = `<style id="vpss-style">${b}${l}</style>`;

      return (
        html
          // Add styles to end of head
          .replace('</head>', `${styles}</head>`)
          // Add splash screen to end of body
          .replace('</body>', `${splash}</body>`)
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
  const loaderHtml = loaders[loaderType].html;

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

            // Optionally wait for minDurationMs before starting animation
            if (
              this.minDurationMs !== undefined &&
              this.renderedAt !== undefined
            ) {
              const elapsedTime = new Date().getTime() - this.renderedAt;
              const remainingTime = Math.max(this.minDurationMs - elapsedTime, 0);
              await new Promise((resolve) => setTimeout(resolve, remainingTime));
            }

            const animation = element.animate(
              [{ opacity: 1 }, { opacity: 0 }],
              { duration: 200, easing: "ease-out", fill: "forwards" }
            );

            animation.onfinish = () => {
              this.remove();
            };
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
