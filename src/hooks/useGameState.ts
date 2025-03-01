import { useState } from 'react';

interface GameState {
  score: number;
  wins: number;
  losses: number;
  ties: number;
}

export const useGameState = (initialScore = 0) => {
  const [gameState, setGameState] = useState<GameState>({
    score: initialScore,
    wins: 0,
    losses: 0,
    ties: 0,
  });

  const handleWin = (game: string, points: number, callback?: () => void) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      wins: prev.wins + 1,
    }));
    if (callback) callback();
  };

  const handleLose = (game: string, points: number, callback?: () => void) => {
    setGameState((prev) => ({
      ...prev,
      score: Math.max(0, prev.score - points),
      losses: prev.losses + 1,
    }));
    if (callback) callback();
  };

  const handleTie = (game: string, callback?: () => void) => {
    setGameState((prev) => ({
      ...prev,
      ties: prev.ties + 1,
    }));
    if (callback) callback();
  };

  const resetGameState = () => {
    setGameState({
      score: initialScore,
      wins: 0,
      losses: 0,
      ties: 0,
    });
  };

  return {
    gameState,
    handleWin,
    handleLose,
    handleTie,
    resetGameState,
  };
};