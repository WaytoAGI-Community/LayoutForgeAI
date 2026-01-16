export const DEFAULT_MARKDOWN = `# 🪄 LayoutForge AI 使用指南

**LayoutForge** 是一个智能排版生成器。你只负责提供内容，AI 负责让它变得专业、美观。

## 🚀 核心功能

### 1. 智能风格设计
不仅仅是更换字体。在左下角输入提示词（如“**黑客帝国风格，绿色代码雨背景**”），AI 会实时生成：
*   🎨 配色方案 (Backgrounds, Text colors)
*   🔤 字体排印 (Font families, Sizes)
*   ✨ 装饰元素 (Shadows, Borders, Rounded corners)

### 2. 内容自动润色
点击生成时，AI 不仅设计样式，还会**重写并优化**你的 Markdown 内容：
*   自动添加 Emoji 表情 🚀
*   优化段落结构，使其更易读
*   智能提炼 H2 标题

### 3. 多种布局模式
*   **单页卡片 (Card)**：适合论文、博客文章。
*   **沉浸平铺 (Flat)**：适合落地页、官网介绍。
*   **多卡片网格 (Multi-Card)**：超酷的仪表盘风格！AI 会自动根据标题将内容拆分成独立的网格卡片。

---

## 🛠️ 操作步骤

1.  **编辑内容**：在这个编辑器中输入你的原始 Markdown。
2.  **设置风格**：在左侧面板下方输入“排版风格提示词”或选择“快速风格”预设。
3.  **选择布局**：点击 Auto、单页、平铺或网格。
4.  **生成**：点击底部的 **“✨ 生成排版”** 按钮。
5.  **导出**：满意后，点击右上角的 **“HTML”** 按钮复制完整代码。

👉 *现在，试着点击左侧的【科技风】预设，然后点击生成按钮，看看这个文档会变成什么样！*`;

export const TRANSLATIONS = {
  zh: {
    appTitle: "LayoutForge AI",
    contentSource: "内容源",
    write: "编辑",
    preview: "预览",
    config: "设置",
    livePreview: "排版渲染预览",
    desktop: "桌面端",
    mobile: "移动端",
    copyConfig: "复制配置",
    copyHtml: "复制网页",
    copied: "已复制!",
    stylePrompt: "排版风格提示词",
    stylePlaceholder: "例如：极简主义风格，大留白，衬线字体，像一份高级报纸...",
    presets: "快速风格",
    generate: "生成排版 + 全文优化",
    generating: "设计 & 撰写中...",
    theme: "当前设计",
    presetSaas: "科技风：深色背景，代码感",
    presetBlog: "阅读风：暖色纸张，衬线字体",
    presetWeChat: "公众号风：装饰性标题，分段优化",
    presetDocs: "商务风：干净白底，强调结构",
    error: "生成失败，请重试。",
    language: "语言",
    proTip: "提示：长文本将自动分批处理，请耐心等待内容逐段刷新。",
    sourceLabel: "内容与配置",
    layoutMode: "布局结构",
    modeAuto: "自动",
    modeCard: "单页卡片",
    modeFlat: "沉浸平铺",
    modeMulti: "多卡片网格",
    multiCardTip: "内容将根据 H1/H2 标题被拆分为独立的卡片。",
    autoDesc: "由AI决定",
    cardDesc: "经典文档",
    flatDesc: "现代网页",
    multiDesc: "仪表盘风格",
    aiSettings: "推理服务设置",
    providerGemini: "Google Gemini (默认)",
    providerOpenAI: "OpenAI Compatible",
    apiKey: "API Key",
    baseUrl: "Base URL (可选)",
    modelName: "模型名称",
    save: "保存配置"
  },
  en: {
    appTitle: "LayoutForge AI",
    contentSource: "Content Source",
    write: "Write",
    preview: "Preview",
    config: "Settings",
    livePreview: "Styled Preview",
    desktop: "Desktop",
    mobile: "Mobile",
    copyConfig: "Copy Config",
    copyHtml: "Copy HTML",
    copied: "Copied!",
    stylePrompt: "Design Prompt",
    stylePlaceholder: "e.g., Minimalist, high whitespace, serif fonts, like a premium newspaper...",
    presets: "Quick Styles",
    generate: "Generate Style + Enhance",
    generating: "Designing & Writing...",
    theme: "Current Design",
    presetSaas: "Tech: Dark mode, Sans-serif",
    presetBlog: "Reader: Warm paper, Serif",
    presetWeChat: "WeChat: Decorative Headers, Batched",
    presetDocs: "Business: Clean white, Strong headers",
    error: "Failed to generate design. Please try again.",
    language: "Language",
    proTip: "Tip: Long text is processed in batches. Watch it update live!",
    sourceLabel: "Content & Config",
    layoutMode: "Layout Structure",
    modeAuto: "Auto",
    modeCard: "Single Card",
    modeFlat: "Seamless",
    modeMulti: "Multi-Card",
    multiCardTip: "Content splits into cards via H1/H2 headers.",
    autoDesc: "AI Decision",
    cardDesc: "Paper Style",
    flatDesc: "Web Style",
    multiDesc: "Dashboard",
    aiSettings: "Inference Settings",
    providerGemini: "Google Gemini (Default)",
    providerOpenAI: "OpenAI Compatible",
    apiKey: "API Key",
    baseUrl: "Base URL (Optional)",
    modelName: "Model Name",
    save: "Save Config"
  }
};
