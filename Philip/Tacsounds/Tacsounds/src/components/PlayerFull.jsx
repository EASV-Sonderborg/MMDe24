import PlayerStandard from "./PlayerStandard";

export default function PlayerFull(props){
  // Genbrug markup fra standard – din CSS (audioPlayer--full) skalerer layoutet
  return (
    <div className="audioPlayer audioPlayer--full">
      <PlayerStandard {...props} />
    </div>
  );
}
