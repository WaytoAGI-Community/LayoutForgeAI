import React, { useState } from 'react';
import { Monitor, Smartphone, Settings, Check, Loader2, FileCode } from 'lucide-react';
import { toPng } from 'html-to-image';
import { DocumentDesign } from '../types';

interface ExportToolbarProps {
  designData: DocumentDesign;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  t: any;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  designData,
  previewMode,
  setPreviewMode,
  t
}) => {
  const [copiedType, setCopiedType] = useState<'config' | 'html' | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopyLayout = () => {
    const jsonString = JSON.stringify(designData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopiedType('config');
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const handleCopyWeChat = async () => {
    const contentRoot = document.getElementById('layout-preview-content');
    if (!contentRoot) return;

    setIsExporting(true);

    try {
      // 1. Identify Target Nodes: All .layout-card elements
      const cardElements = Array.from(contentRoot.querySelectorAll('.layout-card')) as HTMLElement[];
      
      if (cardElements.length === 0) {
        throw new Error("No layout content found to export.");
      }

      const imgHtmlParts: string[] = [];
      const borderColor = designData.highlightColor || 'rgb(121, 115, 247)';
      // Use transparent or white depending on design, but usually white for the inner wrapper looks best in WeChat
      const cardBg = '#ffffff'; 

      // 2. Process each card individually
      for (const card of cardElements) {
        // Capture specific styling (shadows, borders, bg) as an image
        // We capture with a higher pixel ratio for clarity
        const dataUrl = await toPng(card, {
          cacheBust: true,
          pixelRatio: 2.5, 
          quality: 1.0,
          style: {
             transform: 'none',
             margin: '0', 
             // We strip the shadow from the capture itself so it fits cleanly in the wechat wrapper
             boxShadow: 'none', 
          }
        });

        // 3. Construct the WeChat Layout Wrapper
        // Based on the provided "Sample 2" from wechat.txt
        const cardHtml = `
          <section style="max-width: 100%; box-sizing: border-box; margin-bottom: 20px;">
            <section style="margin-top: 10px; margin-bottom: 10px; box-sizing: border-box; max-width: 100%;">
              <section style="text-align: left; justify-content: flex-start; display: flex; flex-flow: row; margin: 10px 0px; box-sizing: border-box;">
                
                <!-- Main Bordered Container -->
                <section style="display: inline-block; width: 100%; vertical-align: bottom; align-self: flex-end; flex: 100 100 0%; border-style: solid; border-width: 1px; border-color: ${borderColor}; border-radius: 12px; overflow: hidden; padding: 12px 0px; height: auto; margin: 0px; box-sizing: border-box; background-color: ${cardBg};">
                  <section style="justify-content: flex-start; display: flex; flex-flow: row; box-sizing: border-box; align-items: center;">
                    
                    <!-- Left Decorative Bar (75px Height) -->
                    <section style="display: inline-block; vertical-align: middle; width: auto; flex: 0 0 0%; height: auto; align-self: center; box-sizing: border-box;">
                      <section style="text-align: center; box-sizing: border-box;">
                        <section style="display: inline-block; width: 6px; height: 75px; vertical-align: top; overflow: hidden; border-style: solid; border-width: 0px; background-color: ${borderColor}; box-sizing: border-box;"></section>
                      </section>
                    </section>
                    
                    <!-- Content Area (The Image) -->
                    <section style="display: inline-block; vertical-align: middle; width: auto; align-self: center; flex: 100 100 0%; height: auto; padding: 0px 8px; box-sizing: border-box;">
                       <img src="${dataUrl}" style="width: 100%; height: auto; display: block; border-radius: 4px;" />
                    </section>

                    <!-- Right Decorative Bar (75px Height) -->
                    <section style="display: inline-block; vertical-align: middle; width: auto; flex: 0 0 0%; height: auto; align-self: center; box-sizing: border-box;">
                      <section style="text-align: center; box-sizing: border-box;">
                        <section style="display: inline-block; width: 6px; height: 75px; vertical-align: top; overflow: hidden; border-style: solid; border-width: 0px; background-color: ${borderColor}; box-sizing: border-box;"></section>
                      </section>
                    </section>

                  </section>
                </section>

              </section>
            </section>
          </section>
        `;
        
        imgHtmlParts.push(cardHtml);
      }

      // 4. Construct Final HTML Wrapper
      const fullHtml = `
        <div class="layout-forge-export" style="max-width: 677px; margin: 0 auto; box-sizing: border-box; overflow: hidden; font-family: -apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
            ${imgHtmlParts.join('')}
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999; opacity: 0.5;">
               Generated by LayoutForge AI
            </div>
        </div>
      `;

      // 5. Write to Clipboard
      const htmlBlob = new Blob([fullHtml], { type: 'text/html' });
      const textBlob = new Blob([contentRoot.innerText || "LayoutForge AI Content"], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);

      setCopiedType('html');
      setTimeout(() => setCopiedType(null), 2500);

    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to render layout images. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-14 border-b border-slate-200/50 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.livePreview}</span>
      </div>
      
      <div className="flex items-center gap-2">
         {/* Device Toggle */}
         <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            title={t.desktop}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            title={t.mobile}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Copy Config Button */}
        <button 
          onClick={handleCopyLayout}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition shadow-sm"
          title={t.copyConfig}
        >
          {copiedType === 'config' ? <Check className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copiedType === 'config' ? t.copied : 'Config'}</span>
        </button>

        {/* Copy HTML Button */}
        <button 
          onClick={handleCopyWeChat}
          disabled={isExporting}
          className={`flex items-center gap-2 px-3 py-2 text-white text-xs font-medium rounded-lg transition shadow-sm overflow-hidden relative ${isExporting ? 'bg-slate-700 cursor-wait' : 'bg-slate-900 hover:bg-slate-800'}`}
          title="Export as Image Layout for WeChat"
        >
          
          <div className="relative flex items-center gap-2 z-10">
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 
              copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                  {isExporting ? 'Rendering...' : (copiedType === 'html' ? t.copied : t.copyHtml)}
              </span>
          </div>
        </button>
      </div>
    </div>
  );
};