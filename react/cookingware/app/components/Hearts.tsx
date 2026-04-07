import { CSSProperties } from "react";

type HeartsProps = {
  lives: number;
}

export default function Hearts({ lives }: HeartsProps) {
  const heartStyle = (offset: number): CSSProperties => ({
    position: "fixed",
    zIndex: 2,
    height: "10vh",
    width: "10vh",
    bottom: "2.5vh",
    right: `${offset}vh`,
    imageRendering: "pixelated"
  });

  return (
    <>
      <img src={lives > 0 ? "/full_heart.png" : "/empty_heart.png"} style={heartStyle(0)} />
      <img src={lives > 1 ? "/full_heart.png" : "/empty_heart.png"} style={heartStyle(10)} />
      <img src={lives > 2 ? "/full_heart.png" : "/empty_heart.png"} style={heartStyle(20)} />
    </>
  );
}