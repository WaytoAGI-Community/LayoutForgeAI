import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  PenLine, 
  Eye, 
  Settings, 
  Bot, 
  Globe, 
  Layout as LayoutIcon, 
  Square, 
  Maximize, 
  Grid, 
  RefreshCw, 
  Check,
  Palette
} from 'lucide-react';
import { DocumentDesign, LayoutMode, Language, ServiceProvider } from '../types';

interface EditorPanelProps {
  activeTab: 'write' | 'preview' | 'config';
  setActiveTab: (tab: 'write' | 'preview' | 'config') => void;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
  error: string | null;
  lang: Language;
  toggleLanguage: () => void;
  designData: DocumentDesign;
  provider: ServiceProvider;
  setShowAiSettings: (show: boolean) => void;
  t: any;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  activeTab,
  setActiveTab,
  markdownContent,
  setMarkdownContent,
  prompt,
  setPrompt,
  layoutMode,
  setLayoutMode,
  isGenerating,
  handleGenerate,
  error,
  lang,
  toggleLanguage,
  designData,
  provider,
  setShowAiSettings,
  t
}) => {
  return (
    <section className="flex-1 flex flex-col min-w-[350px] border-r border-slate-200 bg-white relative shadow-lg z-20">
      
      {/* Header */}
      <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
          <LayoutIcon className="w-5 h-5" />
          <span>{t.appTitle}</span>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'write' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PenLine className="w-3.5 h-3.5" /> {t.write}
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Eye className="w-3.5 h-3.5" /> {t.preview}
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'config' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Settings className="w-3.5 h-3.5" /> {t.config}
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50/30">
        
        {/* View: Write */}
        {activeTab === 'write' && (
          <textarea
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            className="w-full h-full p-6 resize-none outline-none text-sm leading-relaxed text-slate-700 font-mono bg-transparent"
            placeholder="# Enter your content here..."
          />
        )}

        {/* View: Preview (Raw Markdown) */}
        {activeTab === 'preview' && (
          <div className="w-full h-full p-6 overflow-y-auto prose prose-sm prose-slate max-w-none">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        )}

        {/* View: Config (Generator Settings) */}
        {activeTab === 'config' && (
          <div className="w-full h-full p-6 overflow-y-auto">
            <div className="max-w-xl mx-auto space-y-8">
              
              {/* Language & Service Settings */}
              <div className="flex justify-end gap-2">
                 <button 
                  onClick={() => setShowAiSettings(true)}
                  className={`flex items-center gap-2 text-xs font-medium transition px-3 py-1.5 rounded-full border ${provider === 'openai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                 >
                   <Bot className="w-3 h-3" />
                   {provider === 'gemini' ? 'Gemini' : 'OpenAI'}
                 </button>

                 <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-full"
                 >
                   <Globe className="w-3 h-3" />
                   {lang === 'zh' ? 'English' : '中文'}
                 </button>
              </div>

              {/* Prompt Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t.stylePrompt}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.stylePlaceholder}
                  className="w-full p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32 bg-white shadow-sm"
                />
              </div>

               {/* Layout Mode Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <LayoutIcon className="w-4 h-4 text-slate-500" />
                  {t.layoutMode}
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                   
                   {/* Auto Option */}
                   <LayoutOption 
                      mode="auto" 
                      currentMode={layoutMode}
                      setMode={setLayoutMode}
                      label={t.modeAuto} 
                      description={t.autoDesc} 
                      icon={Sparkles}
                      preview={
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-amber-200 rounded-lg opacity-50 blur-sm"></div>
                          <Sparkles className="w-6 h-6 text-indigo-500 relative z-10" />
                        </div>
                      }
                   />

                   {/* Card Option (Single Paper) */}
                   <LayoutOption 
                      mode="card" 
                      currentMode={layoutMode}
                      setMode={setLayoutMode}
                      label={t.modeCard} 
                      description={t.cardDesc} 
                      icon={Square}
                      preview={
                        <div className="w-16 h-12 bg-slate-200 rounded flex items-center justify-center px-2">
                           <div className="w-1/2 h-10 bg-white shadow-sm rounded-[2px] border border-slate-300"></div>
                        </div>
                      }
                   />

                   {/* Flat Option (Seamless) */}
                   <LayoutOption 
                      mode="flat" 
                      currentMode={layoutMode}
                      setMode={setLayoutMode}
                      label={t.modeFlat} 
                      description={t.flatDesc} 
                      icon={Maximize}
                      preview={
                        <div className="w-16 h-12 bg-white border border-slate-200 rounded flex flex-col gap-1.5 p-1.5 overflow-hidden">
                           <div className="w-1/2 h-1.5 bg-slate-200 rounded-full"></div>
                           <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                           <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                           <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
                        </div>
                      }
                   />

                   {/* Multi-Card Option (Grid) */}
                   <LayoutOption 
                      mode="multi-card" 
                      currentMode={layoutMode}
                      setMode={setLayoutMode}
                      label={t.modeMulti} 
                      description={t.multiDesc} 
                      icon={Grid}
                      preview={
                        <div className="w-16 h-12 bg-slate-100 rounded flex gap-1 p-1">
                           <div className="w-1/2 h-full bg-white shadow-sm border border-slate-200 rounded-[2px]"></div>
                           <div className="w-1/2 h-full bg-white shadow-sm border border-slate-200 rounded-[2px] flex flex-col gap-1 p-0.5">
                              <div className="w-full h-1 bg-slate-100 rounded-sm"></div>
                              <div className="w-full h-full bg-slate-50 rounded-sm"></div>
                           </div>
                        </div>
                      }
                   />

                </div>
                
                {layoutMode === 'multi-card' && (
                    <div className="flex items-start gap-2 text-xs text-indigo-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100 animate-fadeIn">
                        <Grid className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{t.multiCardTip}</p>
                    </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                  }`}
              >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGenerating ? t.generating : t.generate}
              </button>
               {error && <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded border border-red-100">{error}</p>}

              {/* Presets */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.presets}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => setPrompt("WeChat Official Account style (公众号风格). Flat layout, max-w-xl. Headings (H2) should be very decorative: use colored pills (rounded-full bg-blue-50), left borders, or bottom borders. Font size slightly larger (text-[17px]) for good readability. Comfortable line height. Auto-extract key points into headers.")} className="text-left text-xs p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 rounded-lg border text-emerald-800 transition shadow-sm group ring-1 ring-green-100">
                      <span className="font-semibold block group-hover:text-emerald-900">{t.presetWeChat.split('：')[0]}</span>
                      <span className="opacity-70">{t.presetWeChat.split('：')[1]}</span>
                  </button>
                  <button onClick={() => setPrompt("Technology/SaaS style. Dark mode, monospace fonts for code, neon accents.")} className="text-left text-xs p-3 bg-white hover:bg-indigo-50 hover:border-indigo-200 rounded-lg border border-slate-200 text-slate-600 transition shadow-sm group">
                      <span className="font-semibold text-slate-800 block group-hover:text-indigo-700">{t.presetSaas.split('：')[0]}</span>
                      <span className="opacity-70">{t.presetSaas.split('：')[1]}</span>
                  </button>
                  <button onClick={() => setPrompt("Classic literature style. Warm beige background, high readability serif fonts, elegant margins.")} className="text-left text-xs p-3 bg-white hover:bg-indigo-50 hover:border-indigo-200 rounded-lg border border-slate-200 text-slate-600 transition shadow-sm group">
                      <span className="font-semibold text-slate-800 block group-hover:text-indigo-700">{t.presetBlog.split('：')[0]}</span>
                      <span className="opacity-70">{t.presetBlog.split('：')[1]}</span>
                  </button>
                </div>
              </div>

              {/* Theme Info */}
              <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl text-xs flex items-start gap-3 border border-indigo-100">
                <Palette className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{t.theme}: <span className="capitalize">{designData.themeName}</span></p>
                  <p className="opacity-80">{t.proTip}</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Sub-component for Layout Options
const LayoutOption = ({ 
  mode, 
  currentMode,
  setMode,
  label, 
  description, 
  icon: Icon,
  preview 
}: { 
  mode: LayoutMode, 
  currentMode: LayoutMode,
  setMode: (m: LayoutMode) => void,
  label: string, 
  description: string, 
  icon: any,
  preview: React.ReactNode 
}) => {
  const isSelected = currentMode === mode;
  return (
    <button
      onClick={() => setMode(mode)}
      className={`group relative flex flex-col items-center text-left border rounded-xl overflow-hidden transition-all duration-200 h-full
        ${isSelected 
          ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50/50' 
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
        }`}
    >
      {/* Visual Preview Area */}
      <div className={`w-full h-20 flex items-center justify-center border-b ${isSelected ? 'bg-indigo-100/50 border-indigo-200' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-100'}`}>
        {preview}
      </div>
      
      {/* Text Label Area */}
      <div className="p-3 w-full">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</span>
        </div>
        <p className={`text-[10px] leading-tight ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{description}</p>
      </div>
      
      {isSelected && (
         <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5">
           <Check className="w-2.5 h-2.5" />
         </div>
      )}
    </button>
  );
};
