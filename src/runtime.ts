/** Global set up by the inline script that the plugin injects into index.html */
type SplashScreenGlobal = {
  hidden: boolean;
  getElement: () => HTMLElement | null;
  getStyles: () => HTMLElement | null;
  hide: () => Promise<void>;
};

type WindowWithSplashScreen = Window & { __VPSS__?: SplashScreenGlobal };

/**
 * Hide the splash screen. Resolves once the splash screen has been removed
 * from the DOM. Calling it multiple times is safe.
 */
export async function hideSplashScreen(): Promise<void> {
  // No-op outside the browser (SSR, tests)
  if (typeof window === 'undefined') return;

  // Read lazily so the global can be set up after this module was imported
  const vpss = (window as WindowWithSplashScreen).__VPSS__;

  if (!vpss) {
    console.error(
      'Splash screen not found. Did you forget to add the `vite-plugin-splash-screen` plugin?'
    );
    return;
  }

  await vpss.hide();
}
