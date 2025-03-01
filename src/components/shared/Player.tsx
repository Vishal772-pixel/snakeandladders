import React from 'react';

interface PlayerProps {
  id: string;
  color: string;
  coords: { x: number; y: number };
  size?: number;
}

export const Player: React.FC<PlayerProps> = ({ id, color, coords, size = 20 }) => {
  return (
    <div
      id={id}
      className="absolute transition-all duration-500 ease-in-out z-20"
      style={{
        transform: `translate(${coords.x + size / 4}px, ${coords.y + size / 4}px)`,
      }}
    >
      <div
        className={`rounded-full border-2 border-white shadow-md`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
        }}
      ></div>
    </div>
  );
};