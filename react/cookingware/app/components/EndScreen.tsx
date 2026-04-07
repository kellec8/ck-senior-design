import GameOverProgress from "./GameOverProgress";
import Hearts from "./Hearts";

type EndScreenProps = {
  text: string;
  lives: number;
}

export default function EndScreen({ text, lives }: EndScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black flex-col">
      <h1 style={{ color: "white", fontSize: "10rem" }}>{text}</h1>
      <Hearts lives={lives} />
    </div>
  );
}