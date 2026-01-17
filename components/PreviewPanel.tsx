import React from 'react';
import { LayoutRenderer } from './LayoutRenderer';
import { ExportToolbar } from './ExportToolbar';
import { 
  useDesignData,
  useMarkdownContent,
  usePreviewMode
} from '../store';

export const PreviewPanel: React.FC = () => {
  const designData = useDesignData();
  const markdownContent = useMarkdownContent();
  const previewMode = usePreviewMode();

  return (
    <main className="flex-1 bg-slate-200 flex flex-col min-w-[350px] relative transition-all">
      
      {/* Replaced old Toolbar with new dedicated Component */}
      <ExportToolbar />

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto relative bg-slate-200/50 flex flex-col">
         <LayoutRenderer data={designData} content={markdownContent} previewMode={previewMode} />
      </div>
    </main>
  );
};
