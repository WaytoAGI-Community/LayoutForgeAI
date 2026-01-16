import React from 'react';
import { LayoutRenderer } from './LayoutRenderer';
import { ExportToolbar } from './ExportToolbar';
import { DocumentDesign, Language } from '../types';

interface PreviewPanelProps {
  designData: DocumentDesign;
  markdownContent: string;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  lang: Language;
  t: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  designData,
  markdownContent,
  previewMode,
  setPreviewMode,
  t
}) => {
  return (
    <main className="flex-1 bg-slate-200 flex flex-col min-w-[350px] relative transition-all">
      
      {/* Replaced old Toolbar with new dedicated Component */}
      <ExportToolbar 
        designData={designData}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        t={t}
      />

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto relative bg-slate-200/50 flex flex-col">
         <LayoutRenderer data={designData} content={markdownContent} previewMode={previewMode} />
      </div>
    </main>
  );
};