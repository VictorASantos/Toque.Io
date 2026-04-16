/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Slider } from './components/Slider';
import { ColorPicker } from './components/ColorPicker';
import { DirectionControl } from './components/DirectionControl';
import { calculateShadows, calculateBackground, getContrastColor } from './utils/colorUtils';
import { Copy, Check, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle, logout, User } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AccessibilityBadge } from './components/AccessibilityBadge';
import { CodeExporter } from './components/CodeExporter';
import { MockupPreview } from './components/MockupPreview';

type Direction = 'tl' | 'tr' | 'bl' | 'br';
type Shape = 'flat' | 'concave' | 'convex' | 'pressed';

export default function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [color, setColor] = useState('#8f2d2d');
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(40);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(0.25);
  const [blur, setBlur] = useState(40);
  const [direction, setDirection] = useState<Direction>('tl');
  const [shape, setShape] = useState<Shape>('flat');

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Derived Styles
  const textColor = useMemo(() => getContrastColor(color), [color]);
  
  const boxShadow = useMemo(() => 
    calculateShadows(color, intensity, distance, blur, direction, shape),
    [color, intensity, distance, blur, direction, shape]
  );

  const background = useMemo(() => 
    calculateBackground(color, intensity, shape, direction),
    [color, intensity, shape, direction]
  );

  // Panel Styles (Inherits neumorphic style)
  const panelShadow = useMemo(() => 
    calculateShadows(color, intensity, 10, 20, 'tl', 'flat'),
    [color, intensity]
  );

  return (
    <div 
      className="min-h-screen font-sans p-10 flex flex-col transition-colors duration-500"
      style={{ backgroundColor: color, color: textColor }}
    >
      {/* Header */}
      <header className="mb-10 text-center relative">
        <div className="absolute top-0 right-0">
          {authLoading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[12px] font-bold leading-none">{user.displayName}</div>
                <button 
                  onClick={logout}
                  className="text-[10px] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto mt-1"
                >
                  Sair <LogOut size={10} />
                </button>
              </div>
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-[12px] font-bold"
            >
              <LogIn size={14} /> Entrar com Google
            </button>
          )}
        </div>

        <h1 className="text-[32px] font-bold tracking-tight">
          Toque.Io
        </h1>
        <p className="text-[14px] opacity-60 mt-2 font-medium tracking-wide">
          A evolução tátil da interface digital.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] flex-grow items-stretch">
        
        {/* Left Block: Visualization */}
        <div 
          className="relative flex flex-col items-center justify-center transition-all duration-500 min-h-[500px] lg:min-h-0 gap-10"
        >
          <AccessibilityBadge baseColor={color} textColor={textColor} intensity={intensity} />
          
          <div className="relative flex items-center justify-center w-full">
            <DirectionControl current={direction} onChange={setDirection} activeColor={textColor} />
            
            <motion.div
              layout
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                background: background,
                boxShadow: boxShadow,
              }}
              className="transition-all duration-300 ease-out z-10"
            />
          </div>

          <MockupPreview 
            background={background} 
            boxShadow={boxShadow} 
            radius={radius} 
            color={color} 
            textColor={textColor} 
          />
        </div>

        {/* Right Block: Control Panel */}
        <div 
          className="p-[30px] rounded-[32px] flex flex-col gap-5 transition-all duration-500 h-full"
          style={{
            backgroundColor: color,
            boxShadow: panelShadow,
            color: textColor
          }}
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <ColorPicker color={color} onChange={setColor} textColor={textColor} />
            </div>
            
            <Slider label="Tamanho" min={10} max={350} value={size} onChange={setSize} textColor={textColor} />
            <Slider label="Raio" min={0} max={144} value={radius} onChange={setRadius} textColor={textColor} />
            <Slider label="Distância" min={5} max={50} value={distance} onChange={setDistance} textColor={textColor} />
            <Slider label="Intensidade" min={0.01} max={0.6} step={0.01} value={intensity} onChange={setIntensity} unit="" textColor={textColor} />
            <Slider label="Desfoque" min={0} max={100} value={blur} onChange={setBlur} textColor={textColor} />
          </div>

          {/* Shape Selector */}
          <div className="control-group">
            <div className="text-[12px] font-semibold uppercase tracking-[0.5px] mb-2 opacity-60">Forma</div>
            <div className="grid grid-cols-4 gap-[10px]">
              {(['flat', 'concave', 'convex', 'pressed'] as Shape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`
                    py-[10px] px-[5px] rounded-[8px] text-[10px] font-bold uppercase transition-all
                    ${shape === s 
                      ? 'shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.2)]' 
                      : 'shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.2)]'}
                  `}
                  style={{
                    backgroundColor: color,
                    color: textColor,
                    opacity: shape === s ? 1 : 0.6
                  }}
                >
                  {s === 'flat' ? 'Plano' : s === 'concave' ? 'Côncavo' : s === 'convex' ? 'Convexo' : 'Pressed'}
                </button>
              ))}
            </div>
          </div>

          {/* Export Code */}
          <CodeExporter 
            color={color}
            radius={radius}
            background={background}
            boxShadow={boxShadow}
            size={size}
            distance={distance}
            blur={blur}
            intensity={intensity}
          />
        </div>
      </main>
    </div>
  );
}
