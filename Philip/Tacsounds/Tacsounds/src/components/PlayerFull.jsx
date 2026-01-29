import PlayerStandard from "./PlayerStandard";

export default function PlayerFull(props) {
  // Reuse PlayerStandard markup; it handles the full variant class.
  return <PlayerStandard {...props} variant="full" />;
}
