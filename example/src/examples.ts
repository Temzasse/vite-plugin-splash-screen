import type {
  LoaderType,
  SplashScreenOptions,
} from 'vite-plugin-splash-screen';

export type ExampleGroup = 'loaders' | 'behavior';

export type SplashExample = {
  /** Page is served at `examples/<id>.html` */
  id: string;
  group: ExampleGroup;
  title: string;
  description: string;
  /** Simulated app initialization time before `hideSplashScreen()` is called */
  appInitMs: number;
  options: SplashScreenOptions;
  /** Built-in loader to preview on the landing page */
  previewLoader?: LoaderType;
};

export const groups: {
  id: ExampleGroup;
  title: string;
  description: string;
}[] = [
  {
    id: 'loaders',
    title: 'Loading indicators',
    description:
      'Nine built-in loaders, or bring your own. All of them follow the loaderBg color and calm down for users who prefer reduced motion.',
  },
  {
    id: 'behavior',
    title: 'Logos and timing',
    description:
      'Animated HTML logos and the options that control when and how the splash screen leaves.',
  },
];

const LOADER_APP_INIT_MS = 2500;

function loaderExample(
  loaderType: LoaderType,
  title: string,
  description: string,
  options: Partial<SplashScreenOptions> = {}
): SplashExample {
  return {
    id: loaderType,
    group: 'loaders',
    title,
    description,
    appInitMs: LOADER_APP_INIT_MS,
    options: { logoSrc: 'vite.svg', loaderType, ...options },
    previewLoader: loaderType,
  };
}

/**
 * Shared by `vite.config.ts` (one splash screen config per page) and the
 * pages themselves.
 */
export const examples: SplashExample[] = [
  loaderExample('line', 'Line', 'Indeterminate progress line. The default.'),
  loaderExample('dots', 'Dots', 'Dots sliding from left to right.'),
  loaderExample(
    'shimmer',
    'Shimmer',
    'Your own text with a highlight sweeping across it.',
    { loaderText: 'Loading your workspace' }
  ),
  loaderExample('blocks', 'Blocks', 'Squares lighting up in a sweep.'),
  loaderExample('spinner', 'Spinner', 'The classic rotating ring.'),
  loaderExample('pulse', 'Pulse', 'Expanding, fading circles.'),
  loaderExample('bars', 'Bars', 'Equalizer-style wave.'),
  loaderExample('bounce', 'Bounce', 'Three bouncing dots.'),
  loaderExample('orbit', 'Orbit', 'A dot circling its track.'),
  {
    id: 'custom-loader',
    group: 'loaders',
    title: 'Custom loader',
    description:
      'Any HTML file of your own with loaderSrc, colored with --vpss-bg-loader.',
    appInitMs: LOADER_APP_INIT_MS,
    options: { logoSrc: 'vite.svg', loaderSrc: 'src/custom-loader.html' },
  },
  {
    ...loaderExample('none', 'No loader', 'Just the logo.'),
    previewLoader: undefined,
  },
  {
    id: 'html-logo',
    group: 'behavior',
    title: 'Animated HTML logo',
    description:
      'Letters drop in one by one, and when the app is ready the logo zooms out. waitForAnimations lets the exit animation finish before the splash screen fades.',
    appInitMs: 2000,
    options: {
      logoSrc: 'src/splash-logo.html',
      loaderType: 'dots',
      waitForAnimations: true,
      fadeDurationMs: 400,
    },
  },
  {
    id: 'min-duration',
    group: 'behavior',
    title: 'Minimum duration',
    description:
      'The app is ready almost immediately, but minDurationMs keeps the splash screen up for 2 seconds to avoid a flash.',
    appInitMs: 100,
    options: { logoSrc: 'vite.svg', minDurationMs: 2000 },
  },
  {
    id: 'slow-fade',
    group: 'behavior',
    title: 'Slow fade',
    description: 'A longer, softer exit with fadeDurationMs.',
    appInitMs: 1500,
    options: { logoSrc: 'vite.svg', loaderType: 'pulse', fadeDurationMs: 1200 },
  },
];

/** Path of the example page relative to the site root, without base */
export function examplePath(example: SplashExample) {
  return `examples/${example.id}.html`;
}

/** Format plugin options like they would appear in vite.config.ts */
export function formatOptions(options: SplashScreenOptions) {
  const lines = Object.entries(options).map(
    ([key, value]) =>
      `  ${key}: ${typeof value === 'string' ? `'${value}'` : String(value)},`
  );
  return `splashScreen({\n${lines.join('\n')}\n})`;
}
