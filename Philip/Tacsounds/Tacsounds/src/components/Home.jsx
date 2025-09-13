// src/pages/Home.jsx (eller hvor din Home ligger)
import React, { useState } from "react";
import useAudioController from "../components/useAudioController";
import AudioPlayerShell from "../components/AudioPlayerShell";
import FeaturedCarousel from "../components/FeaturedCarousel";
import NavBar from "./NavBar"; // ret stien hvis din NavBar ligger et andet sted

export default function Home() {
  const ctrl = useAudioController();

  // carouselens visuelle index (styrer IKKE afspilning i sig selv)
  const [viewIndex, setViewIndex] = useState(0);

  // Klik på overlay (play/pause) på det centrerede kort:
  // - hvis det er samme track som spiller: toggle play/pause
  // - ellers: skift til det track og start
  const handlePlayToggleAtIndex = (i) => {
    if (ctrl.index === i) {
      ctrl.togglePlay();
    } else {
      ctrl.setIndex(i);
      if (!ctrl.isPlaying) ctrl.togglePlay();
    }
  };

  return (
    <div className="pageGrid">
      <NavBar className="siteHeader" />

      <main className="siteMain">
        <FeaturedCarousel
          tracks={ctrl.tracks}
          viewIndex={viewIndex}
          setViewIndex={setViewIndex}
          playingIndex={ctrl.index}
          isPlaying={ctrl.isPlaying}
          onPlayToggleAtIndex={handlePlayToggleAtIndex}
        />
      </main>

      <footer className="siteFooter">
        <AudioPlayerShell controller={ctrl} />
      </footer>
    </div>
  );
}
