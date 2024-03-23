export async function hideSplashScreen() {
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
  splashScreen.addEventListener("animationend", () => {
    splashScreen.remove();
    splashScreenStyles.remove();
  });

  // Start animation
  splashScreen.classList.add(`${id}-hidden`);
}
