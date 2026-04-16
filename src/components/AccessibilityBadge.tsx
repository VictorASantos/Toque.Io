import React from 'react';
import { checkAccessibility } from '../utils/colorUtils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AccessibilityBadgeProps {
  baseColor: string;
  textColor: string;
  intensity: number;
}

export const AccessibilityBadge: React.FC<AccessibilityBadgeProps> = ({ baseColor, textColor, intensity }) => {
  const { contrastRatio, level, shadowContrastAlert } = checkAccessibility(baseColor, textColor, intensity);

  const getLevelColor = () => {
    if (level === 'AAA') return 'bg-green-500';
    if (level === 'AA') return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-lg ${getLevelColor()}`}>
        {level === 'Alert' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
        {level === 'Alert' ? 'Baixo Contraste' : `WCAG ${level}`}
        <span className="opacity-70 ml-1">({contrastRatio}:1)</span>
      </div>

      {shadowContrastAlert && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg animate-pulse">
          <AlertCircle size={14} />
          Alerta: Sombra Fraca
        </div>
      )}
    </div>
  );
};
