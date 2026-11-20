const base = import.meta.env.BASE_URL;

export function Header({ back = false }: { back?: boolean }) {
  return (
    <header className="topbar">
      <a className="brand" href={base}>
        <img src={`${base}vite.svg`} alt="" width={24} height={24} />
        <span>vite-plugin-splash-screen</span>
      </a>
      <nav className="topbar-links">
        {back && <a href={base}>All examples</a>}
        <a href="https://github.com/Temzasse/vite-plugin-splash-screen">
          GitHub
        </a>
        <a href="https://www.npmjs.com/package/vite-plugin-splash-screen">
          npm
        </a>
      </nav>
    </header>
  );
}
