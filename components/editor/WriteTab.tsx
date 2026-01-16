import React from 'react';

interface WriteTabProps {
  content: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const WriteTab: React.FC<WriteTabProps> = ({ content, onChange, placeholder }) => {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-full p-6 resize-none outline-none text-sm leading-relaxed text-slate-700 font-mono bg-transparent"
      placeholder={placeholder || "# Enter your content here..."}
    />
  );
};