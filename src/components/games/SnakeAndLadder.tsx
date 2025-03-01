import React, { useState, useEffect } from "react";
import { Grid } from "./Grid";
import { Player } from "../shared/Player";
import Dice from "../shared/dice";
import { useGameState } from "../../hooks/useGameState";
import Alert from "../shared/Allerts";
import { RefreshCw, Users, Trophy, Volume2 } from 'lucide-react';

// Define player colors
const PLAYER_COLORS = ["red", "yellow", "blue", "green"];

// Define player names
const PLAYER_NAMES = ["Red", "Yellow", "Blue", "Green"];

interface PlayerState {
  position: number;
  color: string;
  name: string;
}

export function SnakeAndLadder() {
  const [alert, setAlert] = useState<{ type: string; content: string } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(0);
  const [cellSize, setCellSize] = useState(59);
  const [cellSizeY, setCellSizeY] = useState(49);
  const [playerCount, setPlayerCount] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [players, setPlayers] = useState<PlayerState[]>([]);

  const { gameState, handleWin, resetGameState } = useGameState(1000);

  // Initialize players based on player count
  useEffect(() => {
    const newPlayers = Array(playerCount).fill(null).map((_, index) => ({
      position: 1,
      color: PLAYER_COLORS[index],
      name: PLAYER_NAMES[index]
    }));
    setPlayers(newPlayers);
  }, [playerCount]);

  useEffect(() => {
    const updateCellSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const dynamicCellSize = Math.min(screenWidth / 10, 60);
      const dynamicCellSizeY = Math.min(screenHeight / 12, 50);
      setCellSize(dynamicCellSize);
      setCellSizeY(dynamicCellSizeY);
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, []);

  // Snake and ladder positions
  const snakesAndLadders: Record<number, number> = {
    1: 38,
    4: 14,
    8: 30,
    21: 42,
    28: 76,
    32: 10,
    36: 6,
    48: 26,
    50: 67,
    62: 18,
    71: 92,
    80: 99,
    88: 24,
    95: 56,
    97: 78,
  };

  const gridSize = 10;

  const getPositionCoordinates = (position: number) => {
    const row = Math.floor((100 - position) / gridSize);
    const col =
      row % 2 === 0
        ? (100 - position) % gridSize
        : gridSize - 1 - ((100 - position) % gridSize);

    return {
      x: col * cellSize,
      y: row * cellSizeY,
    };
  };

  const movePlayer = (playerIndex: number, num: number) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      let newPos = updatedPlayers[playerIndex].position + num;
      
      // Check if player exceeds 100
      if (newPos > 100) {
        newPos = updatedPlayers[playerIndex].position;
        setAlert({
          type: "warning",
          content: `${updatedPlayers[playerIndex].name} needs exact roll to reach 100!`,
        });
      } else {
        // Check for snake or ladder
        const oldPos = newPos;
        newPos = snakesAndLadders[newPos] || newPos;
        
        if (oldPos !== newPos) {
          if (oldPos < newPos) {
            setAlert({
              type: "success",
              content: `${updatedPlayers[playerIndex].name} climbed a ladder from ${oldPos} to ${newPos}!`,
            });
          } else {
            setAlert({
              type: "error",
              content: `${updatedPlayers[playerIndex].name} was bitten by a snake and fell from ${oldPos} to ${newPos}!`,
            });
          }
        }
      }
      
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        position: newPos
      };
      
      // Check for win
      if (newPos === 100) {
        handleWin("snakeandladder", 100, () => {
          setAlert({
            type: "info",
            content: `${updatedPlayers[playerIndex].name} wins the game!`,
          });
          setGameOver(true);
        });
      }
      
      return updatedPlayers;
    });
  };

  const rollDice = (num: number) => {
    if (gameOver) return;
    
    setDiceValue(num);
    movePlayer(currentPlayer, num);
    
    // Move to next player
    setCurrentPlayer((currentPlayer + 1) % playerCount);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentPlayer(0);
    setDiceValue(0);
    setPlayers(players.map(player => ({ ...player, position: 1 })));
    resetGameState();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentPlayer(0);
    setDiceValue(0);
    setPlayers(players.map(player => ({ ...player, position: 1 })));
    resetGameState();
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          content={alert.content}
          onClose={() => setAlert(null)}
        />
      )}
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-900 p-4">
        {!gameStarted ? (
          <div className="bg-amber-100 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">Snake and Ladders</h1>
            
            <div className="mb-6">
              <label className="block text-amber-900 font-bold mb-2">Select Number of Players:</label>
              <div className="flex justify-between">
                {[2, 3, 4].map(count => (
                  <button
                    key={count}
                    onClick={() => setPlayerCount(count)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                      playerCount === count 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                    }`}
                  >
                    <Users className="mr-2" size={18} />
                    {count} Players
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-amber-900 mb-2">Players:</h2>
              <div className="grid grid-cols-2 gap-2">
                {players.map((player, index) => (
                  <div key={index} className="flex items-center p-2 bg-amber-50 rounded-lg">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: player.color }}
                    ></div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <div className="bg-amber-800 rounded-t-lg p-3 flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-amber-100">Snake and Ladders</h1>
              <div className="flex gap-2">
                <button 
                  onClick={resetGame}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg"
                  title="Reset Game"
                >
                  <RefreshCw size={20} />
                </button>
                <button 
                  className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg"
                  title="Sound"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="bg-amber-100 p-3 rounded-b-lg shadow-lg">
              <div className="cont grid grid-cols-10 gap-[1px] w-full" style={{ height: `${cellSizeY * 10}px` }}>
                <Grid cellColors={['bg-amber-200', 'bg-amber-300']} />
                
                {/* Game board image with snakes and ladders */}
                <div className="absolute z-10 w-full h-full top-0 left-0 right-0 bottom-0 pointer-events-none">
                  {/* Ladders */}
                  <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    {/* Ladder from 1 to 38 */}
                    <line x1="50" y1="950" x2="350" y2="650" stroke="#8B4513" strokeWidth="8" />
                    <line x1="70" y1="950" x2="370" y2="650" stroke="#8B4513" strokeWidth="8" />
                    
                    {/* Ladder from 4 to 14 */}
                    <line x1="350" y1="950" x2="450" y2="850" stroke="#8B4513" strokeWidth="8" />
                    <line x1="370" y1="950" x2="470" y2="850" stroke="#8B4513" strokeWidth="8" />
                    
                    {/* More ladders can be added similarly */}
                  </svg>
                  
                  {/* Snakes */}
                  <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    {/* Snake from 32 to 10 */}
                    <path d="M250,700 C300,750 200,800 250,850 C300,900 200,950 250,950" 
                          fill="none" stroke="#FF0000" strokeWidth="8" />
                    
                    {/* Snake from 36 to 6 */}
                    <path d="M650,700 C700,750 600,800 650,850 C700,900 600,950 650,950" 
                          fill="none" stroke="#9400D3" strokeWidth="8" />
                    
                    {/* More snakes can be added similarly */}
                  </svg>
                </div>
                
                {/* Players */}
                {players.map((player, index) => (
                  <Player 
                    key={index}
                    id={`p${index + 1}`}
                    color={player.color}
                    coords={getPositionCoordinates(player.position)}
                    size={cellSize / 2}
                  />
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {players.map((player, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center p-2 rounded-lg ${
                        currentPlayer === index && !gameOver ? 'bg-amber-200 ring-2 ring-amber-600' : 'bg-amber-50'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-1" 
                        style={{ backgroundColor: player.color }}
                      ></div>
                      <span className="text-xs font-medium">{player.position}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  {gameOver ? (
                    <div className="flex items-center bg-amber-200 p-2 rounded-lg">
                      <Trophy className="text-amber-600 mr-2" size={24} />
                      <span className="font-bold">{players.find(p => p.position === 100)?.name} Won!</span>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="w-8 h-8 rounded-full" 
                        style={{ backgroundColor: players[currentPlayer]?.color }}
                        title={`${players[currentPlayer]?.name}'s Turn`}
                      ></div>
                      <Dice 
                        onRoll={rollDice} 
                        size={40} 
                        disabled={gameOver}
                      />
                      {diceValue > 0 && (
                        <span className="text-2xl font-bold">{diceValue}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}