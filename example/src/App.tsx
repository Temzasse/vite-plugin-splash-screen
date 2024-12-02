import { useEffect } from "react";
import { hideSplashScreen } from "vite-plugin-splash-screen/runtime";

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      hideSplashScreen();

      // Try to hide splash again to test if it's idempotent
      setTimeout(() => {
        hideSplashScreen();
      }, 500);
    }, 500);
  }, []);

  return (
    <div>
      <h1>Hello!</h1>
    </div>
  );
}
