import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeExporterProps {
  color: string;
  radius: number;
  background: string;
  boxShadow: string;
  size: number;
  distance: number;
  blur: number;
  intensity: number;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({ 
  color, radius, background, boxShadow, size, distance, blur, intensity 
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'rn' | 'json'>('css');
  const [copied, setCopied] = useState(false);

  const getCssCode = () => {
    return `:root {
  --base-color: ${color};
  --radius: ${radius}px;
  --bg: ${background};
  --shadow: ${boxShadow};
}

.neumorphic-card {
  width: ${size}px;
  height: ${size}px;
  border-radius: var(--radius);
  background: var(--bg);
  box-shadow: var(--shadow);
}`;
  };

  const getTailwindCode = () => {
    // Note: Tailwind doesn't have a direct way to generate complex dynamic neumorphic shadows via classes without arbitrary values
    return `<div className="w-[${size}px] h-[${size}px] rounded-[${radius}px] bg-[${color}] shadow-[${boxShadow}]">
  {/* Para gradientes côncavos/convexos, use inline style ou classes customizadas */}
</div>`;
  };

  const getReactNativeCode = () => {
    // Simplified RN shadow representation
    return `const styles = StyleSheet.create({
  card: {
    width: ${size},
    height: ${size},
    borderRadius: ${radius},
    backgroundColor: '${color}',
    // Neumorfismo em RN geralmente requer bibliotecas como react-native-shadow-2
    // ou múltiplos elementos sobrepostos para sombras claras/escuras.
    shadowColor: "#000",
    shadowOffset: { width: ${distance}, height: ${distance} },
    shadowOpacity: ${intensity},
    shadowRadius: ${blur},
    elevation: ${distance},
  }
});`;
  };

  const getJsonCode = () => {
    const tokens = {
      name: "Toque.Io Design Tokens",
      tokens: {
        colors: {
          base: { value: color, type: "color" },
          background: { value: background, type: "color" }
        },
        sizing: {
          card: { value: size, type: "dimension" }
        },
        spacing: {
          distance: { value: distance, type: "dimension" }
        },
        effects: {
          neumorphicShadow: {
            value: boxShadow,
            type: "shadow"
          }
        },
        borders: {
          radius: { value: radius, type: "dimension" }
        },
        parameters: {
          intensity: { value: intensity, type: "number" },
          blur: { value: blur, type: "dimension" }
        }
      }
    };
    return JSON.stringify(tokens, null, 2);
  };

  const copyToClipboard = () => {
    const code = 
      activeTab === 'css' ? getCssCode() : 
      activeTab === 'tailwind' ? getTailwindCode() : 
      activeTab === 'rn' ? getReactNativeCode() : 
      getJsonCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-auto flex flex-col gap-3">
      <div className="flex gap-2 p-1 bg-black/20 rounded-xl w-fit overflow-x-auto max-w-full">
        {(['css', 'tailwind', 'rn', 'json'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-white/10 shadow-sm' : 'opacity-50 hover:opacity-100'
            }`}
          >
            {tab === 'css' ? 'CSS' : tab === 'tailwind' ? 'Tailwind' : tab === 'rn' ? 'React Native' : 'JSON'}
          </button>
        ))}
      </div>

      <div className="bg-[#1e1e1e] text-[#9cdcfe] p-[15px] rounded-[12px] font-mono text-[11px] leading-[1.4] border border-[#333] relative group min-h-[120px]">
        <div className="text-[10px] text-[#888] mb-[5px] uppercase flex justify-between items-center">
          <span>{activeTab === 'json' ? 'Design Tokens (JSON)' : `Código ${activeTab.toUpperCase()}`}</span>
          <button 
            onClick={copyToClipboard}
            className="p-1 hover:bg-white/10 rounded transition-colors flex items-center gap-1"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-[#888]" />}
            <span className={copied ? 'text-green-400' : 'text-[#888]'}>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
        <pre className="whitespace-pre-wrap break-all overflow-auto max-h-[200px]">
          {activeTab === 'css' && getCssCode()}
          {activeTab === 'tailwind' && getTailwindCode()}
          {activeTab === 'rn' && getReactNativeCode()}
          {activeTab === 'json' && getJsonCode()}
        </pre>
      </div>
    </div>
  );
};
