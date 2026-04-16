import React from 'react';
import { motion } from 'motion/react';

type Direction = 'tl' | 'tr' | 'bl' | 'br';

interface DirectionControlProps {
  current: Direction;
  onChange: (dir: Direction) => void;
  activeColor?: string;
}

export const DirectionControl: React.FC<DirectionControlProps> = ({ current, onChange, activeColor = '#3b82f6' }) => {
  const corners: { id: Direction; className: string; rotate: string }[] = [
    { id: 'tl', className: 'top-0 left-0', rotate: 'rotate-135' },
    { id: 'tr', className: 'top-0 right-0', rotate: '-rotate-135' },
    { id: 'bl', className: 'bottom-0 left-0', rotate: 'rotate-45' },
    { id: 'br', className: 'bottom-0 right-0', rotate: '-rotate-45' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {corners.map((corner) => (
        <button
          key={corner.id}
          onClick={() => onChange(corner.id)}
          className={`absolute ${corner.className} w-20 h-20 flex items-center justify-center pointer-events-auto group transition-all`}
        >
          <div 
            className={`w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[35px] rounded-t-full transition-all ${corner.rotate}`}
            style={{ 
              borderTopColor: current === corner.id ? activeColor : 'rgba(128,128,128,0.2)',
              filter: current === corner.id ? `drop-shadow(0 0 12px ${activeColor}66)` : 'none'
            }}
          />
        </button>
      ))}
    </div>
  );
};
