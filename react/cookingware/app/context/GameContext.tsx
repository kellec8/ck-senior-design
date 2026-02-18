'use client'
import { createContext, useContext, useState } from 'react';

type GameState = {
  score: number;
  setScore: (s: number) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [score, setScore] = useState(0);
  const [volume, setVolume] = useState(0);

  return (
    <GameContext.Provider value={{
      score, setScore,
      volume, setVolume
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