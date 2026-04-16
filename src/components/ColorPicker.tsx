import React, { useState, useEffect, useRef } from 'react';
import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from '../utils/colorUtils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  textColor?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, textColor = '#000000' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const svCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState(0);
  const [hexInput, setHexInput] = useState(color);
  const [rgb, setRgb] = useState(hexToRgb(color));
  const hueSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(color);
    const currentRgb = hexToRgb(color);
    setRgb(currentRgb);
    const { h } = rgbToHsv(currentRgb.r, currentRgb.g, currentRgb.b);
    setHue(h);
  }, [color]);

  const drawSVCanvas = () => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Base color from hue
    ctx.fillStyle = `hsl(${hue * 360}, 100%, 50%)`;
    ctx.fillRect(0, 0, width, height);

    // White to transparent (Saturation)
    const gradWhite = ctx.createLinearGradient(0, 0, width, 0);
    gradWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradWhite;
    ctx.fillRect(0, 0, width, height);

    // Transparent to black (Value/Brightness)
    const gradBlack = ctx.createLinearGradient(0, 0, 0, height);
    gradBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradBlack;
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    if (isOpen) {
      drawSVCanvas();
    }
  }, [isOpen, hue]);

  const handleSVChange = (x: number, y: number) => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    onChange(hex);
  };

  const onSVMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const move = (event: MouseEvent | TouchEvent) => {
      if (!svCanvasRef.current) return;
      const rect = svCanvasRef.current.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      handleSVChange(x, y);
    };

    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', stop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', stop);
    move(e.nativeEvent as any);
  };

  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    const { s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const newRgb = hsvToRgb(newHue, s, v);
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const onHueMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const move = (event: MouseEvent | TouchEvent) => {
      if (!hueSliderRef.current) return;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      handleHueChange(x / rect.width);
    };

    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', stop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', stop);
    move(e.nativeEvent as any);
  };

  const handleRgbInput = (channel: 'r' | 'g' | 'b', value: string) => {
    const num = parseInt(value) || 0;
    const clamped = Math.max(0, Math.min(255, num));
    const newRgb = { ...rgb, [channel]: clamped };
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const { s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return (
    <div className="relative">
      <div 
        className="text-[12px] font-semibold uppercase tracking-[0.5px] mb-2 opacity-60"
        style={{ color: textColor }}
      >
        Cor Base
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[44px] h-[44px] rounded-[12px] border-[3px] border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)] transition-transform active:scale-95"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col">
          <input
            type="text"
            value={hexInput}
            onChange={(e) => {
              setHexInput(e.target.value);
              if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                onChange(e.target.value);
              }
            }}
            className="bg-white/10 border border-white/20 rounded-[10px] px-3 py-1 text-[14px] font-mono outline-none focus:ring-2 focus:ring-white/10 w-[100px] text-center"
            style={{ color: textColor }}
          />
          <div className="text-[10px] opacity-40 font-mono mt-1 text-center" style={{ color: textColor }}>
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl z-30 border border-black/5 w-72 flex flex-col gap-4">
            
            {/* SV Canvas */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-crosshair">
              <canvas
                ref={svCanvasRef}
                width={256}
                height={192}
                className="w-full h-full"
                onMouseDown={onSVMouseDown}
                onTouchStart={onSVMouseDown}
              />
              {/* SV Marker */}
              <div 
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_0_1px_black] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                  left: `${s * 100}%`, 
                  top: `${(1 - v) * 100}%` 
                }}
              />
            </div>

            {/* Hue Slider & Preview */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: color }} />
              <div 
                ref={hueSliderRef}
                onMouseDown={onHueMouseDown}
                onTouchStart={onHueMouseDown}
                className="relative flex-grow h-4 rounded-full cursor-pointer overflow-hidden"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ff00ff 17%, #0000ff 33%, #00ffff 50%, #00ff00 67%, #ffff00 83%, #ff0000 100%)'
                }}
              >
                <div 
                  className="absolute top-0 w-1 h-full bg-white shadow-sm pointer-events-none"
                  style={{ left: `${hue * 100}%` }}
                />
              </div>
            </div>

            {/* RGB Inputs */}
            <div className="grid grid-cols-3 gap-2">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <div key={channel} className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase opacity-40 text-black text-center">{channel}</label>
                  <input
                    type="number"
                    value={rgb[channel]}
                    onChange={(e) => handleRgbInput(channel, e.target.value)}
                    className="bg-black/5 border border-black/10 rounded-md px-2 py-1 text-[12px] font-mono text-black text-center outline-none focus:ring-1 focus:ring-black/20"
                  />
                </div>
              ))}
            </div>

            <div className="text-[9px] text-center opacity-30 uppercase tracking-[0.2em] font-bold text-black">
              Seletor HSV Avançado
            </div>
          </div>
        </>
      )}
    </div>
  );
};
