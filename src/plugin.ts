import fs from 'node:fs';
import path from 'node:path';

import type { Plugin, ResolvedConfig } from 'vite';

import { renderTags } from './html';
import { resolveOptions, type SplashScreenOptions } from './options';

export type { LoaderType, SplashScreenOptions } from './options';

/** @deprecated Use `SplashScreenOptions` instead. */
export type PluginOptions = SplashScreenOptions;

export function splashScreen(options: SplashScreenOptions): Plugin {
  const resolved = resolveOptions(options);

  let config: ResolvedConfig;
  let logoPath: string;

  return {
    name: 'vite-plugin-splash-screen',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      logoPath = resolveLogoPath(resolved.logoSrc, config);
    },
    configureServer(server) {
      // Full reload when the logo changes, since it is inlined into index.html
      server.watcher.add(logoPath);

      const onLogoChange = (file: string) => {
        if (path.resolve(file) === logoPath) {
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('change', onLogoChange);
      server.watcher.on('add', onLogoChange);
    },
    transformIndexHtml() {
      const logoHtml = readLogo(logoPath, resolved.logoSrc);
      return renderTags(resolved, logoHtml, config.html?.cspNonce);
    },
  };
}

/**
 * Candidates in order of precedence:
 * - Absolute path: as-is, then relative to `publicDir` (eg. `/logo.svg`)
 * - Relative path: relative to `publicDir`, then to the project root
 */
function resolveLogoPath(logoSrc: string, config: ResolvedConfig) {
  const publicDir = config.publicDir || undefined;
  const candidates: string[] = [];

  if (path.isAbsolute(logoSrc)) {
    candidates.push(logoSrc);
    if (publicDir) candidates.push(path.join(publicDir, logoSrc));
  } else {
    if (publicDir) candidates.push(path.resolve(publicDir, logoSrc));
    candidates.push(path.resolve(config.root, logoSrc));
  }

  const found = candidates.find((candidate) => isFile(candidate));

  if (!found) {
    throw new Error(
      `[vite-plugin-splash-screen] Logo file not found for \`logoSrc: ${JSON.stringify(logoSrc)}\`. Tried:\n${candidates.map((c) => `  - ${c}`).join('\n')}`
    );
  }

  return path.resolve(found);
}

function readLogo(logoPath: string, logoSrc: string) {
  try {
    return fs.readFileSync(logoPath, 'utf8');
  } catch (error) {
    throw new Error(
      `[vite-plugin-splash-screen] Could not read logo file ${logoPath} (\`logoSrc: ${JSON.stringify(logoSrc)}\`).`,
      { cause: error }
    );
  }
}

function isFile(filePath: string) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
