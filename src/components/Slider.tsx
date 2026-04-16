import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  textColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = 'px',
  textColor = '#000000'
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div 
        className="flex justify-between items-center text-[12px] font-semibold uppercase tracking-[0.5px]"
        style={{ color: textColor }}
      >
        <span className="opacity-60">{label}</span>
        <span className="bg-white/10 px-2 py-[2px] rounded-[10px] font-mono">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-[18px] flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-[6px] bg-black/10 rounded-[3px] appearance-none outline-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-black/10 [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            accentColor: textColor
          }}
        />
      </div>
    </div>
  );
};
