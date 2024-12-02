// @ts-ignore
const options = (window.__VPSS__ || {}) as {
  renderedAt?: number;
  minDurationMs?: number;
  hidden?: boolean;
};

export async function hideSplashScreen() {
  // Splash screen already hidden, bail out
  if (options.hidden) return;

  const id = "vpss";
  const splashScreen = document.getElementById(id);
  const splashScreenStyles = document.getElementById(`${id}-style`);

  if (!splashScreen || !splashScreenStyles) {
    console.error(
      "Splash screen not found. Did you forget to add the `vite-plugin-splash-screen` plugin?"
    );
    return;
  }

  // Add listener to remove splash screen after animation
  splashScreen.addEventListener("animationend", (event) => {
    if (event.animationName === "vpss-hide") {
      splashScreen.remove();
      splashScreenStyles.remove();
    }
  });

  // Set hidden flag to prevent multiple calls
  options.hidden = true;

  if (
    options["minDurationMs"] !== undefined &&
    options["renderedAt"] !== undefined
  ) {
    const elapsedTime = new Date().getTime() - options.renderedAt;
    const remainingTime = Math.max(options.minDurationMs - elapsedTime, 0);

    // Wait for minDurationMs before starting animation
    await new Promise((resolve) => setTimeout(resolve, remainingTime));
  }

  // Start animation
  splashScreen.classList.add(`${id}-hidden`);
}
