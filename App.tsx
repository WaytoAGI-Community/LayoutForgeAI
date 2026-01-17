import React, { useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_MARKDOWN } from './constants';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { AiSettingsModal } from './components/AiSettingsModal';
import { ToastProvider } from './components/ToastSystem';
import { 
  useSetMarkdownContent
} from './store';

const AppContent: React.FC = () => {
  const setMarkdownContent = useSetMarkdownContent();

  useEffect(() => {
    setMarkdownContent(DEFAULT_MARKDOWN);
  }, [setMarkdownContent]);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      
      {/* Column 1: Editor & Config */}
      <EditorPanel />

      {/* Column 2: Preview & Export */}
      <PreviewPanel />
      
       {/* Modal */}
      <AiSettingsModal />

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
