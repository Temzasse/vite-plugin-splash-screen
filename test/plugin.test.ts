import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { JSDOM } from 'jsdom';
import { build, type Rolldown } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';

import { splashScreen, type SplashScreenOptions } from '../src/plugin';

const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg"><title>Logo</title></svg>';

const INDEX_HTML = `<!doctype html>
<html>
  <head><title>Test</title></head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const roots: string[] = [];

function createFixture(files: Record<string, string> = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vpss-'));
  roots.push(root);
  const all = {
    'index.html': INDEX_HTML,
    'public/logo.svg': LOGO_SVG,
    ...files,
  };
  for (const [file, content] of Object.entries(all)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  }
  return root;
}

async function buildHtml(
  options: Partial<SplashScreenOptions> = {},
  {
    root = createFixture(),
    cspNonce,
  }: { root?: string; cspNonce?: string } = {}
) {
  const result = await build({
    root,
    configFile: false,
    logLevel: 'silent',
    html: cspNonce ? { cspNonce } : undefined,
    plugins: [splashScreen({ logoSrc: 'logo.svg', ...options })],
    build: { write: false },
  });

  const outputs = (
    Array.isArray(result) ? result : [result]
  ) as Rolldown.RolldownOutput[];
  const asset = outputs
    .flatMap((o) => o.output)
    .find((o) => o.fileName === 'index.html') as Rolldown.OutputAsset;

  const html = String(asset.source);
  return { html, document: new JSDOM(html).window.document };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('injected tags', () => {
  it('prepends the splash and its script to body and styles to head', async () => {
    const { document } = await buildHtml();
    const [first, second] = Array.from(document.body.children) as Element[];

    expect(first.id).toBe('vpss');
    expect(second.tagName).toBe('SCRIPT');
    expect(second.textContent).toContain('window.__VPSS__');
    expect(document.head.querySelector('style#vpss-style')).not.toBeNull();
  });

  it('adds accessibility and state attributes', async () => {
    const { document } = await buildHtml({ ariaLabel: 'Starting "app"' });
    const splash = document.getElementById('vpss')!;

    expect(splash.getAttribute('role')).toBe('status');
    expect(splash.getAttribute('aria-live')).toBe('polite');
    expect(splash.getAttribute('aria-label')).toBe('Starting "app"');
    expect(splash.getAttribute('data-vpss-state')).toBe('visible');
    expect(
      splash.querySelector('.vpss-logo')!.getAttribute('aria-hidden')
    ).toBe('true');
    expect(splash.querySelector('.vpss-logo title')!.textContent).toBe('Logo');
    expect(
      splash.querySelector('.vpss-loader')!.getAttribute('aria-hidden')
    ).toBe('true');
  });

  it('defaults ariaLabel to "Loading"', async () => {
    const { document } = await buildHtml();
    expect(document.getElementById('vpss')!.getAttribute('aria-label')).toBe(
      'Loading'
    );
  });

  it('passes runtime options to the inline script', async () => {
    const { html } = await buildHtml({
      minDurationMs: 1000,
      fadeDurationMs: 500,
      waitForAnimations: true,
    });
    expect(html).toContain(
      '{"minDurationMs":1000,"fadeDurationMs":500,"waitForAnimations":true}'
    );
  });
});

describe('CSP nonce', () => {
  it('adds the nonce exactly once to the injected style and script', async () => {
    const { document, html } = await buildHtml({}, { cspNonce: 'abc123' });

    expect(document.getElementById('vpss-style')!.getAttribute('nonce')).toBe(
      'abc123'
    );
    expect(
      document.querySelector('#vpss + script')!.getAttribute('nonce')
    ).toBe('abc123');
    expect(html).not.toMatch(/nonce="abc123"\s+nonce=/);
  });

  it('omits the nonce when cspNonce is not set', async () => {
    const { html } = await buildHtml();
    expect(html).not.toContain('nonce=');
  });
});

describe('colors', () => {
  it('substitutes default colors', async () => {
    const { document } = await buildHtml();
    const css = document.getElementById('vpss-style')!.textContent!;
    expect(css).toContain('var(--vpss-bg-splash, #ffffff)');
    expect(css).toContain('var(--vpss-bg-loader, #0072f5)');
  });

  it('substitutes custom colors', async () => {
    const { document } = await buildHtml({
      splashBg: 'rgb(0, 0, 0)',
      loaderBg: 'hsl(10 50% 50%)',
    });
    const css = document.getElementById('vpss-style')!.textContent!;
    expect(css).toContain('var(--vpss-bg-splash, rgb(0, 0, 0))');
    expect(css).toContain('var(--vpss-bg-loader, hsl(10 50% 50%))');
  });

  it.each([
    'red; } body { display: none',
    'red</style><script>alert(1)</script>',
    'red /* comment',
  ])('rejects unsafe color %j', (color) => {
    expect(() =>
      splashScreen({ logoSrc: 'logo.svg', splashBg: color })
    ).toThrow(/`splashBg` is not a valid CSS color/);
  });
});

describe('loader types', () => {
  // [loaderType, element selector, element count, keyframes it defines]
  const LOADERS = [
    ['line', '.vpss-line', 1, 'vpss-increase'],
    ['dots', '.vpss-dot', 4, 'vpss-dot1'],
    ['shimmer', '.vpss-shimmer-text', 1, 'vpss-shimmer'],
    ['blocks', '.vpss-block', 8, 'vpss-block'],
    ['spinner', '.vpss-spinner-ring', 1, 'vpss-spin'],
    ['pulse', '.vpss-pulse-circle', 2, 'vpss-pulse-grow'],
    ['bars', '.vpss-bar', 5, 'vpss-bar'],
    ['bounce', '.vpss-bounce-dot', 3, 'vpss-bounce'],
    ['orbit', '.vpss-orbit-dot', 1, 'vpss-orbit'],
  ] as const;

  const keyframesOf = (name: string) => `@keyframes ${name} {`;

  it('renders the line loader by default', async () => {
    const { document } = await buildHtml();
    expect(document.querySelectorAll('#vpss .vpss-line')).toHaveLength(1);
  });

  it.each(LOADERS)(
    'renders the %s loader with only its own CSS',
    async (loaderType, selector, count, keyframes) => {
      const { document } = await buildHtml({ loaderType, loaderBg: '#123456' });
      const loader = document.querySelector('#vpss .vpss-loader')!;
      const css = document.getElementById('vpss-style')!.textContent!;

      expect(loader.getAttribute('aria-hidden')).toBe('true');
      expect(loader.querySelectorAll(selector)).toHaveLength(count);
      expect(css).toContain(keyframesOf(keyframes));
      expect(css).not.toContain('/*BG_LOADER*/');
      expect(css).toContain('var(--vpss-bg-loader, #123456)');

      for (const [other, , , otherKeyframes] of LOADERS) {
        if (other !== loaderType) {
          expect(css).not.toContain(keyframesOf(otherKeyframes));
        }
      }
    }
  );

  it('renders no loader with "none"', async () => {
    const { document } = await buildHtml({ loaderType: 'none' });
    const css = document.getElementById('vpss-style')!.textContent!;

    expect(document.querySelector('#vpss .vpss-loader')).toBeNull();
    for (const [, , , keyframes] of LOADERS) {
      expect(css).not.toContain(keyframesOf(keyframes));
    }
  });

  it('renders and escapes the shimmer text and uses it as the label', async () => {
    const { document } = await buildHtml({
      loaderType: 'shimmer',
      loaderText: 'Loading <b>"app"</b>',
    });
    const text = document.querySelector('#vpss .vpss-shimmer-text')!;

    expect(text.textContent).toBe('Loading <b>"app"</b>');
    expect(text.querySelector('b')).toBeNull();
    expect(document.getElementById('vpss')!.getAttribute('aria-label')).toBe(
      'Loading <b>"app"</b>'
    );
  });

  it('defaults the shimmer text to "Loading"', async () => {
    const { document } = await buildHtml({ loaderType: 'shimmer' });
    expect(
      document.querySelector('#vpss .vpss-shimmer-text')!.textContent
    ).toBe('Loading');
  });

  it('prefers an explicit ariaLabel over the shimmer text', async () => {
    const { document } = await buildHtml({
      loaderType: 'shimmer',
      loaderText: 'Warming up',
      ariaLabel: 'Loading app',
    });
    expect(document.getElementById('vpss')!.getAttribute('aria-label')).toBe(
      'Loading app'
    );
  });

  it('rejects loaderText without the shimmer loader', () => {
    expect(() =>
      splashScreen({ logoSrc: 'logo.svg', loaderText: 'Hi' })
    ).toThrow(/`loaderText` is only used with `loaderType: "shimmer"`/);
  });

  it('rejects unknown loader types', () => {
    expect(() =>
      splashScreen({ logoSrc: 'logo.svg', loaderType: 'triangle' as never })
    ).toThrow(/`loaderType` must be one of/);
  });
});

describe('custom loader', () => {
  it('inlines the loaderSrc file instead of a built-in loader', async () => {
    const root = createFixture({
      'src/my-loader.html':
        '<div id="my-loader"><style>#my-loader{color:var(--vpss-bg-loader)}</style>…</div>',
    });
    const { document } = await buildHtml(
      { loaderSrc: 'src/my-loader.html' },
      { root }
    );
    const loader = document.querySelector('#vpss .vpss-custom-loader')!;
    const css = document.getElementById('vpss-style')!.textContent!;

    expect(loader.getAttribute('aria-hidden')).toBe('true');
    expect(loader.querySelector('#my-loader')).not.toBeNull();
    expect(document.querySelectorAll('#vpss .vpss-loader')).toHaveLength(1);
    expect(css).not.toContain('vpss-increase');
  });

  it('resolves loaderSrc relative to publicDir', async () => {
    const root = createFixture({ 'public/loader.svg': '<svg id="ld"></svg>' });
    const { document } = await buildHtml({ loaderSrc: 'loader.svg' }, { root });
    expect(
      document.querySelector('#vpss .vpss-custom-loader #ld')
    ).not.toBeNull();
  });

  it('rejects loaderSrc combined with loaderType', () => {
    expect(() =>
      splashScreen({
        logoSrc: 'logo.svg',
        loaderSrc: 'x.html',
        loaderType: 'dots',
      })
    ).toThrow(/either `loaderSrc`.*or `loaderType`/);
  });

  it('throws a helpful error when the loader file is missing', async () => {
    await expect(
      buildHtml({ loaderSrc: 'missing-loader.html' })
    ).rejects.toThrow(
      /Loader file not found for `loaderSrc: "missing-loader.html"`/
    );
  });
});

describe('logo', () => {
  it('inlines an HTML logo relative to the project root', async () => {
    const root = createFixture({
      'src/logo.html':
        '<div id="my-logo"><style>#my-logo{color:red}</style>Hi</div>',
    });
    const { document } = await buildHtml(
      { logoSrc: 'src/logo.html' },
      { root }
    );
    const logo = document.querySelector('#vpss .vpss-logo #my-logo')!;
    expect(logo.querySelector('style')!.textContent).toBe(
      '#my-logo{color:red}'
    );
    expect(logo.textContent).toContain('Hi');
  });

  it('supports an absolute path', async () => {
    const root = createFixture({
      'assets/brand.svg': '<svg id="brand"></svg>',
    });
    const { document } = await buildHtml(
      { logoSrc: path.join(root, 'assets/brand.svg') },
      { root }
    );
    expect(document.querySelector('#vpss #brand')).not.toBeNull();
  });

  it('treats a leading slash as relative to publicDir', async () => {
    const { document } = await buildHtml({ logoSrc: '/logo.svg' });
    expect(document.querySelector('#vpss .vpss-logo svg')).not.toBeNull();
  });

  it('throws a helpful error when the logo is missing', async () => {
    const root = createFixture();
    await expect(
      buildHtml({ logoSrc: 'missing.svg' }, { root })
    ).rejects.toThrow(
      new RegExp(
        `logoSrc: "missing.svg".*Tried:[\\s\\S]*${escapeRegExp(path.join(root, 'public', 'missing.svg'))}`,
        's'
      )
    );
  });

  it('requires logoSrc', () => {
    expect(() => splashScreen({} as SplashScreenOptions)).toThrow(
      /`logoSrc` option is required/
    );
  });
});

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
