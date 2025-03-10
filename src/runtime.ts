// @ts-ignore
const vpss = (window.__VPSS__ || {}) as {
  hidden?: boolean;
  getElement?: () => HTMLElement | null;
  getStyles?: () => HTMLStyleElement | null;
  hide?: () => Promise<void>;
};

export async function hideSplashScreen() {
  // Splash screen already hidden, bail out
  if (vpss.hidden) return;

  const element = vpss.getElement?.();
  const styles = vpss.getStyles?.();

  if (!element || !styles) {
    console.error(
      "Splash screen not found. Did you forget to add the `vite-plugin-splash-screen` plugin?"
    );
    return;
  }

  await vpss.hide?.();
}
