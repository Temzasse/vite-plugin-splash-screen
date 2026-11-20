import type { HtmlTagDescriptor } from 'vite';

import dotsHtml from './loaders/dots.html?raw';
import lineHtml from './loaders/line.html?raw';
import type { LoaderType, ResolvedOptions } from './options';
import splashScript from './splash-script.js?raw';

import dotsCss from './loaders/dots.css?raw';
import lineCss from './loaders/line.css?raw';
import baseStyles from './styles.css?raw';

// CSS/HTML assets are inlined into the bundle as strings at build time
const loaders: Record<LoaderType, { css: string; html: string }> = {
  line: { css: lineCss, html: lineHtml },
  dots: { css: dotsCss, html: dotsHtml },
  none: { css: '', html: '' },
};

export function renderStyles(options: ResolvedOptions) {
  const base = baseStyles.replace('/*BG_SPLASH*/', options.splashBg);
  const loader = loaders[options.loaderType].css.replace(
    '/*BG_LOADER*/',
    options.loaderBg
  );
  return base + loader;
}

export function renderScript(options: ResolvedOptions) {
  const runtimeOptions = JSON.stringify({
    minDurationMs: options.minDurationMs,
    fadeDurationMs: options.fadeDurationMs,
    waitForAnimations: options.waitForAnimations,
  }).replace(/</g, '\\u003c');

  return splashScript.replace('(__VPSS_OPTIONS__)', `(${runtimeOptions})`);
}

export function renderTags(
  options: ResolvedOptions,
  logoHtml: string,
  nonce?: string
): HtmlTagDescriptor[] {
  const nonceAttrs = nonce ? { nonce } : {};
  const loaderHtml = loaders[options.loaderType].html;

  return [
    {
      tag: 'style',
      attrs: { id: 'vpss-style', ...nonceAttrs },
      children: renderStyles(options),
      injectTo: 'head',
    },
    {
      tag: 'div',
      attrs: {
        id: 'vpss',
        role: 'status',
        'aria-live': 'polite',
        'aria-label': options.ariaLabel,
        'data-vpss-state': 'visible',
      },
      // Logo is hidden from screen readers so eg. an SVG <title> isn't read.
      // Loader markup already has `aria-hidden="true"`.
      children: `<div class="vpss-logo" aria-hidden="true">${logoHtml}</div>${loaderHtml}`,
      injectTo: 'body-prepend',
    },
    {
      tag: 'script',
      attrs: { ...nonceAttrs },
      children: renderScript(options),
      injectTo: 'body-prepend',
    },
  ];
}
