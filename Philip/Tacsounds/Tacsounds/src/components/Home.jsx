import useAudioController from "../components/useAudioController";
import AudioPlayerShell from "../components/AudioPlayerShell";
import FeaturedCarousel from "../components/FeaturedCarousel";

export default function Home(){
  const ctrl = useAudioController(); // én fælles controller for hele siden

  const handlePlayIndex = (i) => {
    // skift og start afspilning
    ctrl.setIndex(i);
    if (!ctrl.isPlaying) ctrl.togglePlay();
  };

  return (
    <>
      {/* Hero / Featured */}
      <FeaturedCarousel
        tracks={ctrl.tracks}
        index={ctrl.index}
        setIndex={ctrl.setIndex}
        onPlayIndex={handlePlayIndex}
      />

      {/* Din øvrige sideindhold her ... */}

      {/* Player i bunden — bruger samme controller */}
      <AudioPlayerShell controller={ctrl} />
    </>
  );
}
