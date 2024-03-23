import { useEffect } from "react";
import { hideSplashScreen } from "vite-plugin-splash-screen/runtime";

export default function App() {
  useEffect(() => {
    setTimeout(() => {
      hideSplashScreen();
    }, 4000);
  }, []);

  return (
    <div>
      <h1>Hello!</h1>
    </div>
  );
}
