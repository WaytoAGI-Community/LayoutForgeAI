import React from 'react';
import { 
  PenLine, 
  Eye, 
  Settings, 
  Layout as LayoutIcon
} from 'lucide-react';
import { DocumentDesign, Language, ServiceProvider } from '../types';
import { WriteTab } from './editor/WriteTab';
import { PreviewTab } from './editor/PreviewTab';
import { ConfigTab } from './editor/ConfigTab';

interface EditorPanelProps {
  activeTab: 'write' | 'preview' | 'config';
  setActiveTab: (tab: 'write' | 'preview' | 'config') => void;
  markdownContent: string;
  setMarkdownContent: (content: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
  error: string | null;
  lang: Language;
  toggleLanguage: () => void;
  designData: DocumentDesign;
  setDesignData: (design: DocumentDesign) => void;
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
  isGenerating,
  handleGenerate,
  error,
  lang,
  toggleLanguage,
  designData,
  setDesignData,
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
          <WriteTab 
            content={markdownContent} 
            onChange={setMarkdownContent} 
          />
        )}

        {/* View: Preview (Raw Markdown) */}
        {activeTab === 'preview' && (
          <PreviewTab content={markdownContent} />
        )}

        {/* View: Config (Generator Settings) */}
        {activeTab === 'config' && (
          <ConfigTab 
            prompt={prompt}
            setPrompt={setPrompt}
            designData={designData}
            setDesignData={setDesignData}
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            error={error}
            lang={lang}
            toggleLanguage={toggleLanguage}
            provider={provider}
            setShowAiSettings={setShowAiSettings}
            t={t}
          />
        )}
      </div>
    </section>
  );
};