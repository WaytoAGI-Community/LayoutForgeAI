import { Type, Schema } from "@google/genai";
import { DocumentDesign, AIConfig } from "../types";
import { generateContent } from "./aiEngine";

// --- Configuration ---
const CHUNK_SIZE = 1000; 

// --- System Instructions (Shared) ---

const DESIGN_SYSTEM_INSTRUCTION = `
You are an expert Visual Designer.
Your task is to analyze the "Style Request" and "Content Sample" to generate a JSON "Design System" (CSS classes).

Rules:
1. Return strictly a JSON object matching the 'DocumentDesign' schema.
2. Use valid Tailwind CSS v3 utility classes.
3. **Visual Style**:
   - **WeChat/Social**: Decorative H2s (pills, borders), relaxed leading.
   - **Tech**: Dark/Gradient themes, mono fonts.
   - **Classic**: Serif fonts, paper textures.
4. **H2 Styling**: Be creative (gradients, capsules, borders) as this is the main visual anchor.
`;

const CONTENT_SYSTEM_INSTRUCTION = `
You are a Senior Content Editor.
Your task is to ENHANCE the input text segment to match a specific style (e.g., WeChat Official Account, Tech Blog).

Rules:
1. **Output strictly Markdown**. No JSON. No wrapping text like "Here is the rewritten text".
2. **Formatting**:
   - Auto-generate **H2 (##)** titles if the text lacks structure.
   - Add **relevant Emojis** to headers (e.g., "## 🚀 Title").
   - Use **bolding** for key phrases.
   - Ensure paragraphs are readable (short & punchy).
3. **Context Awareness**:
   - This is part of a larger document.
   - If 'Previous Context' is provided, ensure flow continuity.
   - Do NOT add a document main H1 title unless it is the very first segment.
`;

// --- Schemas ---

const baseDesignProperties = {
  id: { type: Type.STRING },
  themeName: { type: Type.STRING },
  layoutType: { type: Type.STRING, enum: ["card", "flat", "multi-card"] },
  pageBackground: { type: Type.STRING },
  containerBackground: { type: Type.STRING },
  containerShadow: { type: Type.STRING },
  containerMaxWidth: { type: Type.STRING },
  containerPadding: { type: Type.STRING },
  containerBorderRadius: { type: Type.STRING },
  fontFamily: { type: Type.STRING },
  baseFontSize: { type: Type.STRING },
  lineHeight: { type: Type.STRING },
  textColor: { type: Type.STRING },
  titleSize: { type: Type.STRING },
  heading1: { type: Type.STRING },
  heading2: { type: Type.STRING },
  paragraph: { type: Type.STRING },
  blockquote: { type: Type.STRING },
  highlightColor: { type: Type.STRING },
  dividerStyle: { type: Type.STRING }
};

const designSchema: Schema = {
  type: Type.OBJECT,
  properties: baseDesignProperties,
  required: [
      'themeName', 'layoutType', 
      'pageBackground', 'containerBackground', 'containerShadow', 'containerPadding',
      'heading1', 'heading2', 'paragraph', 'blockquote',
      'textColor', 'fontFamily', 'baseFontSize', 'highlightColor'
  ]
};

const multiDesignSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: baseDesignProperties,
    required: [
      'themeName', 'layoutType', 
      'pageBackground', 'containerBackground', 'heading2', 'textColor'
    ]
  }
};

// --- Helper: Text Splitter ---
function splitTextIntoChunks(text: string, maxChars: number): string[] {
  const paragraphs = text.split('\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length) > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    currentChunk += para + '\n';
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk);
  }
  return chunks;
}

// --- Public Service Methods ---

export const generateDesignVariations = async (
  config: AIConfig,
  stylePrompt: string,
  preferredLayout: 'auto' | 'card' | 'flat' | 'multi-card' = 'auto'
): Promise<DocumentDesign[]> => {
  const prompt = `
    Create 2 DISTINCT design variations based on this request: "${stylePrompt}".
    One should be closer to the literal request, the other should be a creative interpretation.
    Layout Preference: ${preferredLayout}.
    Ensure both have different 'themeName', colors, and 'heading2' styles.
  `;

  try {
    console.log("generateContent called with prompt:", prompt);
    
    const responseText = await generateContent(config, {
      prompt,
      systemInstruction: DESIGN_SYSTEM_INSTRUCTION,
      jsonMode: true,
      jsonSchema: multiDesignSchema
    });

    let designs: DocumentDesign[] = [];
    try {
        const parsed = JSON.parse(responseText);
        if (Array.isArray(parsed)) {
            designs = parsed;
        } else if (parsed.items && Array.isArray(parsed.items)) {
            designs = parsed.items;
        } else if (parsed.designs && Array.isArray(parsed.designs)) {
            designs = parsed.designs;
        } else {
             designs = [parsed];
        }
    } catch (e) {
        throw new Error("Failed to parse design JSON response");
    }
    
    return designs.map((d, i) => ({
      ...d,
      id: `gen-${Date.now()}-${i}`
    }));
  } catch (e) {
    console.error("Design Variation Error", e);
    throw e;
  }
};

export const generateLayoutFromPrompt = async (
  config: AIConfig,
  stylePrompt: string, 
  fullContent: string,
  preferredLayout: 'auto' | 'card' | 'flat' | 'multi-card' = 'auto',
  onProgress?: (type: 'design' | 'content', data: any) => void,
  existingDesign?: DocumentDesign
): Promise<{ design: DocumentDesign; content: string }> => {
  
  let design: DocumentDesign;

  // 1. Determine Design Strategy
  if (existingDesign && existingDesign.id !== 'default') {
      design = existingDesign;
      if (onProgress) onProgress('design', design);
  } else {
      // Generate new design
      const sampleContent = fullContent.slice(0, 800);
      const designPrompt = `
        STYLE REQUEST: ${stylePrompt}
        LAYOUT PREFERENCE: ${preferredLayout}
        CONTENT SAMPLE: ${sampleContent}
      `;
      
      try {
        const designRespText = await generateContent(config, {
            prompt: designPrompt,
            systemInstruction: DESIGN_SYSTEM_INSTRUCTION,
            jsonMode: true,
            jsonSchema: designSchema
        });

        design = JSON.parse(designRespText) as DocumentDesign;
        design.id = `gen-single-${Date.now()}`;
        
        if (onProgress) onProgress('design', design);

      } catch (e) {
        console.error("Design Generation Error", e);
        throw new Error("Design generation failed.");
      }
  }

  // 2. Batch Process Content
  const chunks = splitTextIntoChunks(fullContent, CHUNK_SIZE);
  let finalContent = "";
  let previousContext = "";

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isFirstChunk = i === 0;

    const rewritePrompt = `
      STYLE REQUEST: ${stylePrompt}
      PREVIOUS CONTEXT (End of last segment): "${previousContext.slice(-300)}"
      IS START OF DOCUMENT: ${isFirstChunk}
      
      TEXT SEGMENT TO REWRITE:
      ${chunk}
    `;

    try {
      // Content generation uses simple Markdown text, no JSON schema
      const enhancedSegment = await generateContent(config, {
          prompt: rewritePrompt,
          systemInstruction: CONTENT_SYSTEM_INSTRUCTION,
          jsonMode: false
      });
      
      const contentText = enhancedSegment || chunk;
      
      finalContent += contentText + "\n\n";
      previousContext = contentText;

      if (onProgress) onProgress('content', finalContent);

    } catch (e) {
      console.error(`Chunk ${i} processing error`, e);
      finalContent += chunk + "\n\n"; // Fallback
      if (onProgress) onProgress('content', finalContent);
    }
  }

  return { design, content: finalContent };
};
