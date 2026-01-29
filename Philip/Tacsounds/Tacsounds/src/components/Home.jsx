import React, { useEffect, useState } from "react";
import useAudioController from "./useAudioController";
import AudioPlayerShell from "./AudioPlayerShell";
import NavBar from "./NavBar";
import FeaturedCarousel from "./FeaturedCarousel";
import Library from "./Library";
import "./home.css";

export default function Home() {
  const controller = useAudioController();
  const [siteMain, setSiteMain] = useState("carousel");
  const [libraryNav, setLibraryNav] = useState({
    query: "",
    focusTrackId: null,
    key: 0,
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  const handleNavigate = (key) => setSiteMain(key);
  const handlePlayerNavigate = (next) => {
    setSiteMain("library");
    setLibraryNav((prev) => ({
      query: next?.query ?? "",
      focusTrackId: next?.focusTrackId ?? null,
      key: prev.key + 1,
    }));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("theme-dark");
    else root.classList.remove("theme-dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="site">
      <header className="siteHeader">
        <NavBar
          active={siteMain}
          onNavigate={handleNavigate}
          onLogoClick={() => setSiteMain("carousel")}
          theme={theme}
          onToggleTheme={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
        />
      </header>

      <main className="siteMain">
        <div className="siteMain__content">
          {siteMain === "carousel" ? (
            <FeaturedCarousel controller={controller} />
          ) : (
            <Library
              key={libraryNav.key}
              controller={controller}
              initialQuery={libraryNav.query}
              focusTrackId={libraryNav.focusTrackId}
            />
          )}
        </div>
      </main>

      <footer className="siteFooter">
        <AudioPlayerShell
          controller={controller}
          onNavigateToLibrary={handlePlayerNavigate}
        />
      </footer>
    </div>
  );
}
