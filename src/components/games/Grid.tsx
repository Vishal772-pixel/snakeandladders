import React from 'react';

interface GridProps {
  cellColors: string[];
}

export const Grid: React.FC<GridProps> = ({ cellColors = ['bg-amber-200', 'bg-amber-300'] }) => {
  return (
    <>
      {[...Array(100)].map((_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const position =
          row % 2 === 0 ? 100 - (row * 10 + col) : 100 - (row * 10 + (9 - col));
        const colorIndex = (row + col) % 2;

        return (
          <div
            key={position}
            className={`box w-full h-full border border-amber-800 relative rounded-md ${cellColors[colorIndex]}`}
            id={`${position}`}
          >
            <p className="text-center text-sm md:text-lg font-bold text-amber-900">
              {position}
            </p>
          </div>
        );
      })}
    </>
  );
};