import React, { useState } from 'react';
import { DocumentDesign, INITIAL_DESIGN, Language, ServiceProvider, AIConfig, OpenAIConfig } from './types';
import { generateLayoutFromPrompt } from './services/layoutService';
import { TRANSLATIONS, DEFAULT_MARKDOWN } from './constants';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { AiSettingsModal } from './components/AiSettingsModal';
import { ToastProvider, useToast } from './components/ToastSystem';

const AppContent: React.FC = () => {
  // --- State ---
  const [designData, setDesignData] = useState<DocumentDesign>(INITIAL_DESIGN);
  const [markdownContent, setMarkdownContent] = useState(DEFAULT_MARKDOWN);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'config'>('write');
  const [lang, setLang] = useState<Language>('zh');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Configuration State
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [provider, setProvider] = useState<ServiceProvider>('gemini');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiConfig, setOpenaiConfig] = useState<OpenAIConfig>({
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo-preview'
  });

  // Construct global config object on the fly
  const aiConfig: AIConfig = {
      provider,
      openai: openaiConfig,
      gemini: { apiKey: geminiKey || process.env.API_KEY } 
  };

  const { addToast } = useToast();
  const t = TRANSLATIONS[lang];

  // --- Handlers ---

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

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      
      {/* Column 1: Editor & Config */}
      <EditorPanel 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        markdownContent={markdownContent}
        setMarkdownContent={setMarkdownContent}
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        handleGenerate={handleGenerate}
        error={error}
        lang={lang}
        toggleLanguage={toggleLanguage}
        designData={designData}
        setDesignData={setDesignData}
        provider={provider}
        setShowAiSettings={setShowAiSettings}
        aiConfig={aiConfig} // Pass full config down
        t={t}
      />

      {/* Column 2: Preview & Export */}
      <PreviewPanel 
        designData={designData}
        markdownContent={markdownContent}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        lang={lang}
        t={t}
        aiConfig={aiConfig} // Pass full config down
      />
      
       {/* Modal */}
      <AiSettingsModal 
        isOpen={showAiSettings}
        onClose={() => setShowAiSettings(false)}
        provider={provider}
        setProvider={setProvider}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        openaiConfig={openaiConfig}
        setOpenaiConfig={setOpenaiConfig}
        t={t}
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
