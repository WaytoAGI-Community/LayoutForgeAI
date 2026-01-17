import React from 'react';
import { 
  PenLine, 
  Eye, 
  Settings, 
  Layout as LayoutIcon
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { generateLayoutFromPrompt } from '../services/layoutService';
import { useToast } from './ToastSystem';
import { WriteTab } from './editor/WriteTab';
import { PreviewTab } from './editor/PreviewTab';
import { ConfigTab } from './editor/ConfigTab';
import { 
  useActiveTab, useSetActiveTab,
  useMarkdownContent, useSetMarkdownContent,
  usePrompt, useSetPrompt,
  useIsGenerating, useSetIsGenerating,
  useError, useSetError,
  useLang, useSetLang,
  useDesignData, useSetDesignData,
  useProvider, useSetProvider,
  useGeminiKey, useSetGeminiKey,
  useOpenaiConfig, useSetOpenaiConfig,
  useShowAiSettings, useSetShowAiSettings
} from '../store';

export const EditorPanel: React.FC = () => {
  const activeTab = useActiveTab();
  const setActiveTab = useSetActiveTab();
  const markdownContent = useMarkdownContent();
  const setMarkdownContent = useSetMarkdownContent();
  const prompt = usePrompt();
  const setPrompt = useSetPrompt();
  const isGenerating = useIsGenerating();
  const setIsGenerating = useSetIsGenerating();
  const error = useError();
  const setError = useSetError();
  const lang = useLang();
  const setLang = useSetLang();
  const designData = useDesignData();
  const setDesignData = useSetDesignData();
  const provider = useProvider();
  const setProvider = useSetProvider();
  const geminiKey = useGeminiKey();
  const setGeminiKey = useSetGeminiKey();
  const openaiConfig = useOpenaiConfig();
  const setOpenaiConfig = useSetOpenaiConfig();
  const showAiSettings = useShowAiSettings();
  const setShowAiSettings = useSetShowAiSettings();

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const aiConfig = {
    provider,
    openai: openaiConfig,
    gemini: { apiKey: geminiKey || process.env.API_KEY }
  };

  const { addToast } = useToast();
  const t = TRANSLATIONS[lang];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    const progressCallback = (type: 'design' | 'content', data: any) => {
      if (type === 'design') {
        setDesignData(data);
      } else if (type === 'content') {
        setMarkdownContent(data);
      }
    };

    const designToUse = designData.id !== 'default' ? designData : undefined;

    try {
      await generateLayoutFromPrompt(
        aiConfig,
        prompt,
        markdownContent,
        'auto',
        progressCallback,
        designToUse
      );
      addToast(t.generate + " " + t.copied, 'success');
    } catch (err: any) {
      const msg = err.message || t.error;
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

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
            handleGenerate={handleGenerate}
            toggleLanguage={toggleLanguage}
            t={t}
          />
        )}
      </div>
    </section>
  );
};
