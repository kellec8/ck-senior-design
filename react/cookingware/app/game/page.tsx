'use client'

import { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";
import SoupGame from "../games/SoupGame";
import FridgeGame from "../games/FridgeGame";
import EndScreen from "../components/EndScreen";
import { useRouter } from "next/navigation";

export default function Game() {
  const router = useRouter();

  const { lives, setLives, volume } = useGame();

  const [gameState, setGameState] = useState("playing"); 
  // "playing" | "won" | "lost" | "gameover"

  const [currentGame, setCurrentGame] = useState(0);

  const games = [
    FridgeGame,
    SoupGame,
  ];

  const lossAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
        lossAudio.current = new Audio("/loss.m4a");
        lossAudio.current.volume = volume / 100;
        lossAudio.current.preload = "auto";
    }, [])

  useEffect(() => {
      winAudio.current = new Audio("/win.m4a");
      winAudio.current.volume = volume / 100;
      winAudio.current.preload = "auto";
  }, [])

  const GameComponent = games[currentGame];

  function handleWin() {
    setGameState("won");
    winAudio.current.play();

    setTimeout(() => {
      nextGame();
    }, 1000);
  }

  function handleLose() {
    setGameState("lost");
    lossAudio.current.play()

    setLives(l => l - 1);

    setTimeout(() => {
      if (lives - 1 <= 0) {
        setGameState("gameover");
        setTimeout(() => {
          setLives(3);
          router.push('/')
        }, 3000)
      } else {
        nextGame();
      }
    }, 1000);
  }

  function nextGame() {
    const nextIndex = Math.floor(Math.random() * games.length);
    setCurrentGame(nextIndex);
    setGameState("playing");
  }

  if (gameState === "playing") {
    return <GameComponent onWin={handleWin} onLose={handleLose} volume={volume} lives={lives}/>;
  }

  if (gameState === "won") {
    return <EndScreen text="YOU WON" lives={lives} />;
  }

  if (gameState === "lost") {
    return <EndScreen text="YOU LOST" lives={lives} />;
  }

  if (gameState === "gameover") {
    return <EndScreen text="GAME OVER" lives={0} />;
  }
}