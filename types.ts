// Defines the structure of our styled document system

export interface DocumentDesign {
  id: string;
  themeName: string; // e.g. "Modern Dark", "Classic Serif"
  
  // Layout Structure
  layoutType: 'card' | 'flat' | 'multi-card'; // 'card' = floating paper, 'flat' = seamless, 'multi-card' = grid/bento
  
  // Container Styles
  pageBackground: string; // Tailwind class e.g. "bg-slate-100"
  containerBackground: string; // Tailwind class e.g. "bg-white"
  containerShadow: string; // Tailwind class e.g. "shadow-xl"
  containerMaxWidth: string; // Tailwind class e.g. "max-w-3xl"
  containerPadding: string; // Tailwind class e.g. "p-8 md:p-12"
  containerBorderRadius: string; // Tailwind class e.g. "rounded-xl"

  // Typography
  fontFamily: string; // Tailwind class e.g. "font-serif"
  baseFontSize: string; // Tailwind class e.g. "text-lg"
  lineHeight: string; // Tailwind class e.g. "leading-relaxed"
  textColor: string; // Tailwind class e.g. "text-slate-800"

  // Elements
  titleSize: string; // Tailwind class for H1 size e.g. "text-4xl md:text-6xl"
  heading1: string; // Tailwind classes for H1 (Color, Weight, Alignment, Spacing) - NO SIZE
  heading2: string; // Tailwind classes for H2
  paragraph: string; // Tailwind classes for p
  blockquote: string; // Tailwind classes for blockquote
  highlightColor: string; // Hex code for dynamic inline styles if needed
  
  // Decorative
  dividerStyle: string; // Tailwind class for HR
}

export const INITIAL_DESIGN: DocumentDesign = {
  id: 'default',
  themeName: 'Clean Paper',
  layoutType: 'card',
  pageBackground: 'bg-slate-100',
  containerBackground: 'bg-white',
  containerShadow: 'shadow-lg',
  containerMaxWidth: 'max-w-4xl',
  containerPadding: 'p-8 md:p-16',
  containerBorderRadius: 'rounded-none',
  
  fontFamily: 'font-sans',
  baseFontSize: 'text-base',
  lineHeight: 'leading-7',
  textColor: 'text-slate-700',

  titleSize: 'text-4xl md:text-5xl',
  heading1: 'font-bold text-slate-900 mb-8 tracking-tight',
  heading2: 'text-2xl font-semibold text-slate-800 mt-10 mb-4 border-l-4 border-indigo-500 pl-4',
  paragraph: 'mb-6',
  blockquote: 'italic text-slate-600 border-l-4 border-slate-300 pl-4 py-2 my-8 bg-slate-50',
  highlightColor: '#6366f1',
  
  dividerStyle: 'my-12 border-slate-200'
};

// UI Types
export type Language = 'zh' | 'en';
export type LayoutMode = 'auto' | 'card' | 'flat' | 'multi-card';
export type ServiceProvider = 'gemini' | 'openai';
