import fs from 'node:fs';
import path from 'node:path';

import type { Plugin, ResolvedConfig } from 'vite';

import { renderTags } from './html';
import { resolveOptions, type SplashScreenOptions } from './options';

export type { LoaderType, SplashScreenOptions } from './options';

/** @deprecated Use `SplashScreenOptions` instead. */
export type PluginOptions = SplashScreenOptions;

/** A user-provided file that is inlined into the page */
type InlinedFile = {
  label: string;
  option: 'logoSrc' | 'loaderSrc';
  src: string;
  path: string;
};

export function splashScreen(options: SplashScreenOptions): Plugin {
  const resolved = resolveOptions(options);

  let config: ResolvedConfig;
  let logo: InlinedFile;
  let customLoader: InlinedFile | undefined;

  return {
    name: 'vite-plugin-splash-screen',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      logo = resolveFile('Logo', 'logoSrc', resolved.logoSrc, config);

      if (resolved.loaderSrc) {
        customLoader = resolveFile(
          'Loader',
          'loaderSrc',
          resolved.loaderSrc,
          config
        );
      }
    },
    configureServer(server) {
      // Full reload when an inlined file changes, since it is part of the HTML
      const watched = [logo, customLoader]
        .filter((file) => file !== undefined)
        .map((file) => file.path);

      server.watcher.add(watched);

      const onChange = (file: string) => {
        if (watched.includes(path.resolve(file))) {
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('change', onChange);
      server.watcher.on('add', onChange);
    },
    transformIndexHtml() {
      return renderTags(resolved, {
        logoHtml: readFile(logo),
        customLoaderHtml: customLoader ? readFile(customLoader) : undefined,
        nonce: config.html?.cspNonce,
      });
    },
  };
}

/**
 * Candidates in order of precedence:
 * - Absolute path: as-is, then relative to `publicDir` (eg. `/logo.svg`)
 * - Relative path: relative to `publicDir`, then to the project root
 */
function resolveFile(
  label: string,
  option: InlinedFile['option'],
  src: string,
  config: ResolvedConfig
): InlinedFile {
  const publicDir = config.publicDir || undefined;
  const candidates: string[] = [];

  if (path.isAbsolute(src)) {
    candidates.push(src);
    if (publicDir) candidates.push(path.join(publicDir, src));
  } else {
    if (publicDir) candidates.push(path.resolve(publicDir, src));
    candidates.push(path.resolve(config.root, src));
  }

  const found = candidates.find((candidate) => isFile(candidate));

  if (!found) {
    throw new Error(
      `[vite-plugin-splash-screen] ${label} file not found for \`${option}: ${JSON.stringify(src)}\`. Tried:\n${candidates.map((c) => `  - ${c}`).join('\n')}`
    );
  }

  return { label, option, src, path: path.resolve(found) };
}

function readFile(file: InlinedFile) {
  try {
    return fs.readFileSync(file.path, 'utf8');
  } catch (error) {
    throw new Error(
      `[vite-plugin-splash-screen] Could not read ${file.label.toLowerCase()} file ${file.path} (\`${file.option}: ${JSON.stringify(file.src)}\`).`,
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
