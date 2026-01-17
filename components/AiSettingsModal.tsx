import React from 'react';
import { Bot, X } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { 
  useShowAiSettings, useSetShowAiSettings,
  useProvider, useSetProvider,
  useGeminiKey, useSetGeminiKey,
  useOpenaiConfig, useSetOpenaiConfig,
  useLang
} from '../store';

export const AiSettingsModal: React.FC = () => {
  const isOpen = useShowAiSettings();
  const setShowAiSettings = useSetShowAiSettings();
  const provider = useProvider();
  const setProvider = useSetProvider();
  const geminiKey = useGeminiKey();
  const setGeminiKey = useSetGeminiKey();
  const openaiConfig = useOpenaiConfig();
  const setOpenaiConfig = useSetOpenaiConfig();
  const lang = useLang();

  const t = TRANSLATIONS[lang];

  const onClose = () => setShowAiSettings(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <Bot className="w-5 h-5 text-indigo-600" />
             {t.aiSettings}
           </h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
             <X className="w-5 h-5" />
           </button>
         </div>
         
         <div className="p-6 space-y-6">
            
            {/* Provider Selector */}
            <div className="space-y-3">
               <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                  <input 
                    type="radio" 
                    name="provider" 
                    checked={provider === 'gemini'} 
                    onChange={() => setProvider('gemini')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{t.providerGemini}</span>
                  </div>
               </label>
               
               <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                  <input 
                    type="radio" 
                    name="provider" 
                    checked={provider === 'openai'} 
                    onChange={() => setProvider('openai')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{t.providerOpenAI}</span>
                  </div>
               </label>
            </div>

            {/* Gemini Config Fields */}
            {provider === 'gemini' && (
               <div className="space-y-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                 <div className="space-y-1">
                   <label className="text-xs font-semibold text-slate-500 uppercase">{t.apiKey} (Optional)</label>
                   <input 
                     type="password" 
                     value={geminiKey}
                     onChange={(e) => setGeminiKey(e.target.value)}
                     placeholder="Use default system key..."
                     className="w-full p-0,1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                   <p className="text-[10px] text-slate-400">If you have your own Google Gemini API Key, enter it here. Otherwise, the system default key will be used.</p>
                 </div>
               </div>
            )}

            {/* OpenAI Config Fields */}
            {provider === 'openai' && (
              <div className="space-y-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">{t.baseUrl}</label>
                  <input 
                    type="text" 
                    value={openaiConfig.baseUrl}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, baseUrl: e.target.value}))}
                    placeholder="https://api.openai.com/v1"
                    className="w-full p-0.1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">{t.apiKey} <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    value={openaiConfig.apiKey}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, apiKey: e.target.value}))}
                    placeholder="sk-..."
                    className="w-full p-0.1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">{t.modelName}</label>
                  <input 
                    type="text" 
                    value={openaiConfig.model}
                    onChange={(e) => setOpenaiConfig(prev => ({...prev, model: e.target.value}))}
                    placeholder="gpt-4-turbo-preview"
                    className="w-full p-0.1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}
         </div>

         <div className="p-4 bg-slate-50 flex justify-end">
           <button 
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
           >
             {t.save}
           </button>
         </div>
      </div>
    </div>
  );
};
