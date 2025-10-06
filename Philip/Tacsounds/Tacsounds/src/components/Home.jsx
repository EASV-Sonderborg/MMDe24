import React, { useState } from "react";
import useAudioController from "./useAudioController";
import AudioPlayerShell from "./AudioPlayerShell";
import NavBar from "./NavBar";
import FeaturedCarousel from "./FeaturedCarousel";
import Library from "./Library";
import "./home.css";

export default function Home() {
  const controller = useAudioController();
  const [siteMain, setSiteMain] = useState("carousel");

  const handleNavigate = (key) => setSiteMain(key);

  return (
    <div className="site">
      <header className="siteHeader">
        <NavBar
          active={siteMain}
          onNavigate={handleNavigate}
          onLogoClick={() => setSiteMain("carousel")}
        />
      </header>

      <main className="siteMain">
        <div className="siteMain__content">
          {siteMain === "carousel" ? (
            <FeaturedCarousel controller={controller} />
          ) : (
            <Library controller={controller} />
          )}
        </div>
      </main>

      <footer className="siteFooter">
        <AudioPlayerShell controller={controller} />
      </footer>
    </div>
  );
}
