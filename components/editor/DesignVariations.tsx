import React from 'react';
import { Check, Split, LayoutTemplate } from 'lucide-react';
import { DocumentDesign } from '../../types';

interface DesignVariationsProps {
  options: DocumentDesign[];
  selectedId: string;
  onSelect: (design: DocumentDesign) => void;
  t: any;
}

export const DesignVariations: React.FC<DesignVariationsProps> = ({
  options,
  selectedId,
  onSelect,
  t
}) => {
  if (options.length === 0) return null;

  return (
    <div className="space-y-3 animate-fadeIn">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        <Split className="w-3.5 h-3.5" /> {t.styleVariations}
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((design, idx) => {
          const isSelected = selectedId === design.id || design.themeName === options.find(o => o.id === selectedId)?.themeName;
          const isMulti = design.layoutType === 'multi-card';
          const isFlat = design.layoutType === 'flat';
          const isCard = design.layoutType === 'card';
          
          // Safety fallbacks for potentially missing AI-generated properties
          const pageBg = design.pageBackground || 'bg-slate-50';
          const containerBg = design.containerBackground || 'bg-white';
          const highlight = design.highlightColor || '#6366f1';
          const fontFamily = design.fontFamily || 'font-sans';
          const textColor = design.textColor || 'text-slate-800';

          return (
            <div 
              key={idx}
              onClick={() => onSelect(design)}
              className={`
                cursor-pointer group relative rounded-xl overflow-hidden transition-all duration-300 ease-out
                ${isSelected 
                  ? 'ring-2 ring-indigo-600 ring-offset-2 shadow-lg scale-[1.02] z-10' 
                  : 'ring-1 ring-slate-200 hover:ring-indigo-300 hover:shadow-md hover:scale-[1.01] hover:z-10'
                }
              `}
            >
              {/* 
                  High-Fidelity "PPT Slide" Preview 
                  Strategy: Render a large container (w-[400%]) and scale it down (scale-[0.25]).
                  This preserves the exact proportions of fonts, paddings, and shadows.
              */}
              <div className="aspect-[16/10] w-full relative bg-slate-50 overflow-hidden select-none">
                 <div className="absolute top-0 left-0 w-[455%] h-[455%] origin-top-left transform scale-[0.22]">
                    <div className={`w-full h-full ${pageBg} ${fontFamily} ${textColor} flex flex-col p-12`}>
                        
                        {/* --- Layout Simulation --- */}
                        
                        {/* 1. Multi-Card Grid Preview */}
                        {isMulti && (
                          <div className="grid grid-cols-2 gap-8 h-full content-start">
                             {[1, 2].map(i => (
                               <div key={i} className={`${containerBg} ${design.containerShadow} ${design.containerBorderRadius} ${design.containerPadding} h-fit`}>
                                  <h2 className={`${design.heading2} mb-4 text-3xl`}>Module {i}</h2>
                                  <div className={`${design.paragraph} text-2xl opacity-80 line-clamp-4`}>
                                    Grid content showing the dashboard structure.
                                  </div>
                               </div>
                             ))}
                          </div>
                        )}

                        {/* 2. Flat Layout Preview */}
                        {isFlat && (
                           <div className={`w-full h-full ${containerBg} ${design.containerPadding} border-x border-black/5`}>
                              <div className={`${design.heading1} ${design.titleSize} mb-8`}>Doc Title</div>
                              <h2 className={`${design.heading2} mb-6 text-4xl`}>Section Header</h2>
                              <p className={`${design.paragraph} text-3xl leading-relaxed mb-6`}>
                                This is a seamless layout preview suitable for web pages.
                              </p>
                              <hr className={`${design.dividerStyle} my-8`} />
                              <p className={`${design.paragraph} text-3xl leading-relaxed`}>
                                Continuous reading flow visualization.
                              </p>
                           </div>
                        )}

                        {/* 3. Card Layout Preview (PPT Style) */}
                        {isCard && (
                          <div className="flex-1 flex flex-col items-center justify-center">
                             <div className={`${containerBg} ${design.containerShadow} ${design.containerBorderRadius} ${design.containerPadding} w-full max-w-4xl mx-auto min-h-[500px] flex flex-col`}>
                                <div className={`${design.heading1} ${design.titleSize} mb-8`}>
                                  {design.themeName}
                                </div>
                                
                                {/* Visual Anchor: H2 Style Showcase */}
                                <div className="mb-6">
                                  <h2 className={`${design.heading2} text-4xl`}>
                                    Smart Layout
                                  </h2>
                                </div>

                                <div className={`${design.paragraph} text-3xl leading-relaxed flex-1`}>
                                  <p className="mb-6">
                                    The quick brown fox jumps over the lazy dog. This previews your <span style={{color: highlight, fontWeight: 'bold'}}>typography</span> choices.
                                  </p>
                                  <div className={`p-4 border-l-8 text-2xl italic opacity-80 bg-black/5`} style={{borderColor: highlight}}>
                                     "Design is intelligence made visible."
                                  </div>
                                </div>
                             </div>
                          </div>
                        )}
                        
                    </div>
                 </div>
                 
                 {/* Layout Badge Overlay */}
                 <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium shadow-sm">
                    <LayoutTemplate className="w-2.5 h-2.5" />
                    {design.layoutType}
                 </div>
              </div>

              {/* Footer Info */}
              <div className="bg-white px-3 py-2 border-t border-slate-100 flex justify-between items-center">
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]" title={design.themeName}>
                      {design.themeName}
                   </span>
                   <div className="flex gap-1 mt-0.5">
                      {/* Color Swatches */}
                      <div className="w-2 h-2 rounded-full ring-1 ring-slate-200" style={{background: highlight}}></div>
                      <div className={`w-2 h-2 rounded-full ring-1 ring-slate-200 ${pageBg}`}></div>
                      <div className={`w-2 h-2 rounded-full ring-1 ring-slate-200 ${containerBg}`}></div>
                   </div>
                </div>
                {isSelected && (
                    <div className="bg-indigo-600 text-white p-1 rounded-full shadow-sm animate-in zoom-in">
                      <Check className="w-3 h-3" />
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
