import type { HtmlTagDescriptor } from 'vite';

import barsHtml from './loaders/bars.html?raw';
import blocksHtml from './loaders/blocks.html?raw';
import bounceHtml from './loaders/bounce.html?raw';
import dotsHtml from './loaders/dots.html?raw';
import lineHtml from './loaders/line.html?raw';
import orbitHtml from './loaders/orbit.html?raw';
import pulseHtml from './loaders/pulse.html?raw';
import shimmerHtml from './loaders/shimmer.html?raw';
import spinnerHtml from './loaders/spinner.html?raw';
import type { LoaderType, ResolvedOptions } from './options';
import splashScript from './splash-script.js?raw';

import barsCss from './loaders/bars.css?raw';
import blocksCss from './loaders/blocks.css?raw';
import bounceCss from './loaders/bounce.css?raw';
import dotsCss from './loaders/dots.css?raw';
import lineCss from './loaders/line.css?raw';
import orbitCss from './loaders/orbit.css?raw';
import pulseCss from './loaders/pulse.css?raw';
import shimmerCss from './loaders/shimmer.css?raw';
import spinnerCss from './loaders/spinner.css?raw';
import baseStyles from './styles.css?raw';

// CSS/HTML assets are inlined into the bundle as strings at build time.
// Only the selected loader ends up in the page.
const loaders: Record<LoaderType, { css: string; html: string }> = {
  line: { css: lineCss, html: lineHtml },
  dots: { css: dotsCss, html: dotsHtml },
  shimmer: { css: shimmerCss, html: shimmerHtml },
  blocks: { css: blocksCss, html: blocksHtml },
  spinner: { css: spinnerCss, html: spinnerHtml },
  pulse: { css: pulseCss, html: pulseHtml },
  bars: { css: barsCss, html: barsHtml },
  bounce: { css: bounceCss, html: bounceHtml },
  orbit: { css: orbitCss, html: orbitHtml },
  none: { css: '', html: '' },
};

type RenderInput = {
  logoHtml: string;
  nonce?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderStyles(options: ResolvedOptions) {
  const base = baseStyles.replaceAll('/*BG_SPLASH*/', options.splashBg);
  const loaderCss = loaders[options.loaderType].css;
  return (base + loaderCss).replaceAll('/*BG_LOADER*/', options.loaderBg);
}

export function renderLoader(options: ResolvedOptions) {
  return loaders[options.loaderType].html.replace(
    '__VPSS_LOADER_TEXT__',
    escapeHtml(options.loaderText)
  );
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
  { logoHtml, nonce }: RenderInput
): HtmlTagDescriptor[] {
  const nonceAttrs = nonce ? { nonce } : {};

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
      // Logo and loaders are hidden from screen readers (eg. so an SVG <title>
      // isn't read); the splash element's aria-label is announced instead.
      children: `<div class="vpss-logo" aria-hidden="true">${logoHtml}</div>${renderLoader(options)}`,
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
