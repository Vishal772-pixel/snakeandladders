import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  onRoll: (value: number) => void;
  size?: number;
  disabled?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, size = 40, disabled = false }) => {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const diceIcons = [
    <Dice1 size={size} />,
    <Dice2 size={size} />,
    <Dice3 size={size} />,
    <Dice4 size={size} />,
    <Dice5 size={size} />,
    <Dice6 size={size} />
  ];

  const rollDice = () => {
    if (rolling || disabled) return;
    
    setRolling(true);
    
    // Animate dice rolling
    let rollCount = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setValue(randomValue);
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setRolling(false);
        onRoll(randomValue);
      }
    }, 100);
  };

  return (
    <button 
      onClick={rollDice} 
      disabled={rolling || disabled}
      className={`bg-white rounded-lg p-2 shadow-md transition-transform ${rolling ? 'animate-bounce' : 'hover:scale-110'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {diceIcons[value - 1]}
    </button>
  );
};

export default Dice;