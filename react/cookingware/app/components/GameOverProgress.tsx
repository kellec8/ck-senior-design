export default function GameOverProgress({ timeLimit, timeSpent }) {
  const remaining = Math.max(0, timeLimit - timeSpent);

  return (
    <progress
      style={{
        position: "fixed",
        bottom: 0,
        zIndex: 2,
        width: "100vw",
        height: "2.5vh"
      }}
      value={remaining}
      max={timeLimit}
    />
  );
}