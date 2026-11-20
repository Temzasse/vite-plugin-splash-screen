export type LoaderType =
  | 'line'
  | 'dots'
  | 'shimmer'
  | 'blocks'
  | 'spinner'
  | 'pulse'
  | 'bars'
  | 'bounce'
  | 'orbit'
  | 'none';

export type SplashScreenOptions = {
  /**
   * Path to the logo file (`.svg` or `.html`). It is inlined into the page
   * as-is. Resolved relative to `publicDir` first, then the project root.
   * Absolute paths are supported too.
   */
  logoSrc: string;
  /** Splash screen background color. @default '#ffffff' */
  splashBg?: string;
  /** Loading indicator color. @default '#0072f5' */
  loaderBg?: string;
  /** Built-in loading indicator. @default 'line' */
  loaderType?: LoaderType;
  /** Text animated by the `'shimmer'` loader. @default 'Loading' */
  loaderText?: string;
  /** Minimum time the splash screen stays visible. @default 0 */
  minDurationMs?: number;
  /** Duration of the fade-out animation. @default 200 */
  fadeDurationMs?: number;
  /**
   * Wait for finite CSS animations inside the splash screen (eg. a one-shot
   * logo animation) to finish before fading out. Infinite animations are
   * ignored and the wait is capped at 5 seconds. @default false
   */
  waitForAnimations?: boolean;
  /**
   * Accessible label announced by screen readers.
   * @default `loaderText` with the shimmer loader, otherwise 'Loading'
   */
  ariaLabel?: string;
};

export type ResolvedOptions = Required<SplashScreenOptions>;

const LOADER_TYPES: LoaderType[] = [
  'line',
  'dots',
  'shimmer',
  'blocks',
  'spinner',
  'pulse',
  'bars',
  'bounce',
  'orbit',
  'none',
];

// Characters that could break out of the `var(--x, <color>)` CSS context
const UNSAFE_CSS_VALUE = /[;{}<>"'\\]|\/\*|\*\//;

function fail(message: string): never {
  throw new Error(`[vite-plugin-splash-screen] ${message}`);
}

function validateDuration(name: string, value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    fail(`\`${name}\` must be a non-negative number, got ${String(value)}.`);
  }
}

function validateColor(name: string, value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    fail(`\`${name}\` must be a non-empty string.`);
  }
  if (UNSAFE_CSS_VALUE.test(value)) {
    fail(
      `\`${name}\` is not a valid CSS color value: ${JSON.stringify(value)}`
    );
  }
}

export function resolveOptions(options: SplashScreenOptions): ResolvedOptions {
  if (!options || typeof options.logoSrc !== 'string' || !options.logoSrc) {
    fail('The `logoSrc` option is required!');
  }

  const loaderType = options.loaderType ?? 'line';

  if (options.loaderText !== undefined) {
    if (loaderType !== 'shimmer') {
      fail('`loaderText` is only used with `loaderType: "shimmer"`.');
    }
    if (typeof options.loaderText !== 'string' || !options.loaderText.trim()) {
      fail('`loaderText` must be a non-empty string.');
    }
  }

  const loaderText = options.loaderText ?? 'Loading';

  const resolved: ResolvedOptions = {
    logoSrc: options.logoSrc,
    splashBg: options.splashBg ?? '#ffffff',
    loaderBg: options.loaderBg ?? '#0072f5',
    loaderType,
    loaderText,
    minDurationMs: options.minDurationMs ?? 0,
    fadeDurationMs: options.fadeDurationMs ?? 200,
    waitForAnimations: options.waitForAnimations ?? false,
    ariaLabel:
      options.ariaLabel ?? (loaderType === 'shimmer' ? loaderText : 'Loading'),
  };

  if (!LOADER_TYPES.includes(resolved.loaderType)) {
    fail(
      `\`loaderType\` must be one of ${LOADER_TYPES.map((t) => `"${t}"`).join(', ')}, got ${JSON.stringify(resolved.loaderType)}.`
    );
  }

  validateColor('splashBg', resolved.splashBg);
  validateColor('loaderBg', resolved.loaderBg);
  validateDuration('minDurationMs', resolved.minDurationMs);
  validateDuration('fadeDurationMs', resolved.fadeDurationMs);

  if (typeof resolved.waitForAnimations !== 'boolean') {
    fail('`waitForAnimations` must be a boolean.');
  }
  if (typeof resolved.ariaLabel !== 'string') {
    fail('`ariaLabel` must be a string.');
  }

  return resolved;
}
