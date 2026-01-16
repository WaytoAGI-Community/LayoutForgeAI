import React from 'react';
import ReactMarkdown from 'react-markdown';

interface PreviewTabProps {
  content: string;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({ content }) => {
  return (
    <div className="w-full h-full p-6 overflow-y-auto prose prose-sm prose-slate max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};