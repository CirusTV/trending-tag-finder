import React, { useState } from 'react';

function App() {
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassOpacity, setGlassOpacity] = useState(0.28);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(0.2);
  const [glassColor, setGlassColor] = useState('#141432');

  const [neoShadow, setNeoShadow] = useState(6);
  const [neoInset, setNeoInset] = useState(false);
  const [neoColor, setNeoColor] = useState('#e0e0e0');

  const [copied, setCopied] = useState(false);

  const generateCss = () => {
    const hexOpacity = Math.round(glassOpacity * 255).toString(16).padStart(2, '0');
    const glassCss = `
.glass-card {
  background: ${glassColor}${hexOpacity};
  backdrop-filter: blur(${glassBlur}px);
  -webkit-backdrop-filter: blur(${glassBlur}px);
  border: 1px solid rgba(0, 240, 255, ${glassBorderOpacity});
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 0 24px rgba(0,240,255,0.08);
  transition: all 0.4s ease;
}
.glass-card:hover {
  box-shadow: 0 16px 48px rgba(0,240,255,0.25), inset 0 0 32px rgba(0,240,255,0.12);
}
    `;

    const neoCss = `
.neo-card {
  background: ${neoColor};
  border-radius: 16px;
  box-shadow: ${neoInset ? 'inset ' : ''}${neoShadow}px ${neoShadow}px ${neoShadow*2}px #bebebe,
              ${neoInset ? 'inset ' : ''}-${neoShadow}px -${neoShadow}px ${neoShadow*2}px #ffffff;
  transition: all 0.3s ease;
}
    `;

    const fullCss = glassCss.trim() + '\n\n' + neoCss.trim();

    navigator.clipboard.writeText(fullCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="generator-container p-6 max-w-5xl mx-auto text-white bg-black/25 backdrop-blur-2xl rounded-3xl border border-cyan-500/25 shadow-2xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center tracking-tight drop-shadow-lg text-shadow-cyan">
        Glass & Neo Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Glassmorphism */}
        <div className="space-y-6 bg-black/20 backdrop-blur-lg p-6 rounded-2xl border border-cyan-500/20">
          <h2 className="text-2xl font-semibold text-cyan-400 drop-shadow-md">Glassmorphism</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2 font-medium text-shadow-white">Blur: {glassBlur}px</label>
              <input 
                type="range" 
                min="0" max="40" 
                value={glassBlur} 
                onChange={e => setGlassBlur(+e.target.value)}
                className="w-full h-2 accent-cyan-500 bg-cyan-900/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium text-shadow-white">Opacity: {glassOpacity.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" max="0.5" step="0.01" 
                value={glassOpacity} 
                onChange={e => setGlassOpacity(+e.target.value)}
                className="w-full h-2 accent-cyan-500 bg-cyan-900/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium text-shadow-white">Border opacity: {glassBorderOpacity.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" max="0.5" step="0.01" 
                value={glassBorderOpacity} 
                onChange={e => setGlassBorderOpacity(+e.target.value)}
                className="w-full h-2 accent-cyan-500 bg-cyan-900/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-shadow-white">BG Color:</label>
              <input 
                type="color" 
                value={glassColor} 
                onChange={e => setGlassColor(e.target.value)}
                className="w-12 h-10 rounded border border-cyan-500/40 cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div 
            className="preview-box w-full aspect-[4/3] rounded-2xl border border-cyan-500/30 shadow-xl mx-auto"
            style={{
              background: `${glassColor}${Math.round(glassOpacity * 255).toString(16).padStart(2, '0')}`,
              backdropFilter: `blur(${glassBlur}px)`,
              WebkitBackdropFilter: `blur(${glassBlur}px)`,
            }}
          >
            <span className="text-white text-shadow-black">Glass Preview</span>
          </div>
        </div>

        {/* Neomorphism */}
        <div className="space-y-6 bg-black/20 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/20">
          <h2 className="text-2xl font-semibold text-pink-400 drop-shadow-md">Neomorphism</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-2 font-medium text-shadow-white">Shadow size: {neoShadow}px</label>
              <input 
                type="range" 
                min="1" max="20" 
                value={neoShadow} 
                onChange={e => setNeoShadow(+e.target.value)}
                className="w-full h-2 accent-pink-500 bg-pink-900/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={neoInset} 
                onChange={e => setNeoInset(e.target.checked)}
                className="accent-pink-500 w-5 h-5 cursor-pointer"
              />
              <label className="text-sm font-medium text-shadow-white">Inset / embossed</label>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-shadow-white">Base color:</label>
              <input 
                type="color" 
                value={neoColor} 
                onChange={e => setNeoColor(e.target.value)}
                className="w-12 h-10 rounded border border-pink-500/40 cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div 
            className="preview-box w-full aspect-[4/3] rounded-2xl shadow-2xl mx-auto"
            style={{ background: neoColor, boxShadow: `${neoInset ? 'inset ' : ''}${neoShadow}px ${neoShadow}px ${neoShadow*2}px #bebebe, ${neoInset ? 'inset ' : ''}-${neoShadow}px -${neoShadow}px ${neoShadow*2}px #ffffff` }}
          >
            <span className="text-black text-shadow-white">Neo Preview</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button 
          onClick={generateCss}
          className="watch-btn px-10 py-4 text-xl font-bold shadow-lg hover:shadow-2xl transition-all"
        >
          Generate & Copy CSS
        </button>

        {copied && (
          <div className="text-green-400 font-medium animate-pulse text-lg">
            Copied to clipboard! ✓
          </div>
        )}
      </div>

      {generatedCss && (
        <div className="mt-8">
          <h3 className="text-xl mb-4 text-cyan-300 text-center">Generated CSS – copy & paste</h3>
          <pre className="p-6 bg-black/40 rounded-2xl overflow-x-auto text-sm font-mono border border-cyan-500/30 whitespace-pre-wrap">
            {generatedCss}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
