'use client'
import { createContext, useContext, useState } from 'react';

type GameState = {
  score: number;
  setScore: (s: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  lives: number;
  setLives: (l: number) => void;
  difficulty: number;
  setDifficulty: (d: number) => void;
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [score, setScore] = useState(0);
  const [volume, setVolume] = useState(100);
  const [lives, setLives] = useState(3);
  const [difficulty, setDifficulty] = useState(1);

  return (
    <GameContext.Provider value={{
      score, setScore,
      volume, setVolume,
      lives, setLives,
      difficulty, setDifficulty
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}