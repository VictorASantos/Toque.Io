import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Music, LayoutDashboard, Smartphone } from 'lucide-react';
import { logEvent } from '../firebase';

interface MockupPreviewProps {
  background: string;
  boxShadow: string;
  radius: number;
  color: string;
  textColor: string;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({ background, boxShadow, radius, color, textColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMockup, setActiveMockup] = useState<'card' | 'music' | 'dash'>('card');

  const neumorphicStyle = {
    background,
    boxShadow,
    borderRadius: radius,
  };

  const handleOpen = () => {
    setIsOpen(true);
    logEvent('morfik_interaction', {
      item_id: 'mockup_modal_open',
      item_category: 'ui_mockup'
    });
  };

  const handleMockupChange = (id: 'card' | 'music' | 'dash') => {
    setActiveMockup(id);
    logEvent('morfik_interaction', {
      item_id: `mockup_view_${id}`,
      item_category: 'ui_mockup'
    });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-[14px] font-bold shadow-xl active:scale-95"
        style={{ color: textColor }}
      >
        <Smartphone size={18} /> Ver no Contexto
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
              style={{ backgroundColor: color, color: textColor }}
            >
              {/* Sidebar */}
              <div className="w-full md:w-64 p-8 border-b md:border-b-0 md:border-r border-black/5 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Mockups</h3>
                  <button onClick={() => setIsOpen(false)} className="md:hidden p-2 hover:bg-black/5 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'card', label: 'Cartão de Crédito', icon: CreditCard },
                    { id: 'music', label: 'Music Player', icon: Music },
                    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleMockupChange(m.id as any)}
                      className={`flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${
                        activeMockup === m.id ? 'bg-black/5 shadow-inner' : 'hover:bg-black/5'
                      }`}
                    >
                      <m.icon size={20} className="opacity-60" />
                      <span className="font-semibold text-sm">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex-grow p-12 flex items-center justify-center bg-black/5 overflow-auto">
                <div className="w-full max-w-md">
                  {activeMockup === 'card' && (
                    <div style={neumorphicStyle} className="aspect-[1.6/1] w-full p-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-10 bg-amber-400/20 rounded-lg border border-amber-400/30" />
                        <div className="text-2xl font-bold italic opacity-40 italic">VISA</div>
                      </div>
                      <div>
                        <div className="text-xl font-mono tracking-[0.2em] mb-4 opacity-80">4532 •••• •••• 9012</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-[10px] uppercase opacity-40 mb-1">Card Holder</div>
                            <div className="font-bold text-sm uppercase tracking-widest">SEU NOME AQUI</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase opacity-40 mb-1">Expires</div>
                            <div className="font-bold text-sm">12/28</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeMockup === 'music' && (
                    <div style={neumorphicStyle} className="aspect-square w-full p-8 flex flex-col gap-6">
                      <div className="aspect-square w-full rounded-2xl bg-black/10 flex items-center justify-center">
                        <Music size={64} className="opacity-20" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-bold text-lg">Soft Beats</h4>
                        <p className="text-sm opacity-60">Toque.Io Originals</p>
                      </div>
                      <div className="flex items-center justify-between px-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/5"><X size={16} className="rotate-45" /></div>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-white/10"><Music size={24} /></div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/5"><X size={16} /></div>
                      </div>
                    </div>
                  )}

                  {activeMockup === 'dash' && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div style={neumorphicStyle} className="p-6 flex flex-col gap-2">
                        <div className="text-[10px] uppercase opacity-40">Vendas</div>
                        <div className="text-2xl font-bold">R$ 12.4k</div>
                        <div className="text-[10px] text-green-500 font-bold">+12%</div>
                      </div>
                      <div style={neumorphicStyle} className="p-6 flex flex-col gap-2">
                        <div className="text-[10px] uppercase opacity-40">Usuários</div>
                        <div className="text-2xl font-bold">1,240</div>
                        <div className="text-[10px] text-blue-500 font-bold">+5%</div>
                      </div>
                      <div style={neumorphicStyle} className="col-span-2 p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="text-[10px] uppercase opacity-40">Atividade</div>
                          <div className="w-8 h-4 rounded-full bg-black/10" />
                        </div>
                        <div className="flex items-end gap-2 h-24">
                          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-grow bg-black/10 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-3 hover:bg-black/5 rounded-full transition-colors hidden md:block"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
