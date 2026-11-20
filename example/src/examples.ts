import type { SplashScreenOptions } from 'vite-plugin-splash-screen';

export type SplashExample = {
  /** Page is served at `/examples/<id>.html` */
  id: string;
  title: string;
  description: string;
  /** Simulated app initialization time before `hideSplashScreen()` is called */
  appInitMs: number;
  options: SplashScreenOptions;
};

/**
 * Shared by `vite.config.ts` (one splash screen config per page) and the
 * landing page (which lists the examples).
 */
export const examples: SplashExample[] = [
  {
    id: 'line',
    title: 'Line loader',
    description:
      'SVG logo from publicDir with the default line loader, shown for at least 2 seconds.',
    appInitMs: 500,
    options: {
      logoSrc: 'vite.svg',
      loaderType: 'line',
      minDurationMs: 2000,
    },
  },
  {
    id: 'dots',
    title: 'Dots loader',
    description: 'Same logo with the dots loader and a slower 600 ms fade-out.',
    appInitMs: 1500,
    options: {
      logoSrc: 'vite.svg',
      loaderType: 'dots',
      fadeDurationMs: 600,
    },
  },
  {
    id: 'none',
    title: 'No loader',
    description: 'Just the logo, no loading indicator.',
    appInitMs: 1500,
    options: {
      logoSrc: 'vite.svg',
      loaderType: 'none',
    },
  },
  {
    id: 'html-logo',
    title: 'Animated HTML logo',
    description:
      'HTML logo from the project root with an intro and exit animation. The app is ready after 300 ms, but waitForAnimations lets the animations finish.',
    appInitMs: 300,
    options: {
      logoSrc: 'src/splash-logo.html',
      loaderType: 'dots',
      waitForAnimations: true,
      fadeDurationMs: 400,
    },
  },
];

export function examplePath(example: SplashExample) {
  return `/examples/${example.id}.html`;
}
