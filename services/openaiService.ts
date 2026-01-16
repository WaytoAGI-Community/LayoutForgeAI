import OpenAI from "openai";
import { DocumentDesign } from "../types";

// --- Configuration ---
const CHUNK_SIZE = 1000;

export interface OpenAIConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
}

// --- System Instructions ---

const DESIGN_SYSTEM_INSTRUCTION = `
You are an expert Visual Designer.
Your task is to analyze the "Style Request" and "Content Sample" to generate a JSON "Design System" (CSS classes).

Rules:
1. Return strictly a JSON object matching the 'DocumentDesign' schema provided below.
2. Use valid Tailwind CSS v3 utility classes.
3. **Visual Style**:
   - **WeChat/Social**: Decorative H2s (pills, borders), relaxed leading.
   - **Tech**: Dark/Gradient themes, mono fonts.
   - **Classic**: Serif fonts, paper textures.
4. **H2 Styling**: Be creative (gradients, capsules, borders) as this is the main visual anchor.

Schema:
{
  "id": "string",
  "themeName": "string",
  "layoutType": "card" | "flat" | "multi-card",
  "pageBackground": "string (tailwind class)",
  "containerBackground": "string (tailwind class)",
  "containerShadow": "string (tailwind class)",
  "containerMaxWidth": "string (tailwind class)",
  "containerPadding": "string (tailwind class)",
  "containerBorderRadius": "string (tailwind class)",
  "fontFamily": "string (tailwind class)",
  "baseFontSize": "string (tailwind class)",
  "lineHeight": "string (tailwind class)",
  "textColor": "string (tailwind class)",
  "titleSize": "string (tailwind class)",
  "heading1": "string (tailwind class)",
  "heading2": "string (tailwind class)",
  "paragraph": "string (tailwind class)",
  "blockquote": "string (tailwind class)",
  "highlightColor": "string (hex)",
  "dividerStyle": "string (tailwind class)"
}
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

// --- Main Service ---

export const generateLayoutWithOpenAI = async (
  config: OpenAIConfig,
  stylePrompt: string, 
  fullContent: string,
  preferredLayout: 'auto' | 'card' | 'flat' | 'multi-card' = 'auto',
  onProgress?: (type: 'design' | 'content', data: any) => void,
  existingDesign?: DocumentDesign
): Promise<{ design: DocumentDesign; content: string }> => {
  
  if (!config.apiKey) throw new Error("OpenAI API Key is missing.");

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl || "https://api.openai.com/v1",
    dangerouslyAllowBrowser: true // Client-side only demo
  });

  let design: DocumentDesign;

  // 1. Determine Design Strategy
  if (existingDesign && existingDesign.id !== 'default') {
      design = existingDesign;
      if (onProgress) onProgress('design', design);
  } else {
      // 1. Generate Design (using first chunk as sample)
      const sampleContent = fullContent.slice(0, 800);
      const designPrompt = `
        STYLE REQUEST: ${stylePrompt}
        LAYOUT PREFERENCE: ${preferredLayout}
        CONTENT SAMPLE: ${sampleContent}
      `;
      
      try {
        const completion = await client.chat.completions.create({
          messages: [
            { role: "system", content: DESIGN_SYSTEM_INSTRUCTION },
            { role: "user", content: designPrompt }
          ],
          model: config.model,
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("Empty response from OpenAI");
        
        design = JSON.parse(content) as DocumentDesign;
        design.id = `openai-${Date.now()}`;
        
        // Notify UI about design ready
        if (onProgress) onProgress('design', design);

      } catch (e) {
        console.error("OpenAI Design Generation Error", e);
        throw new Error("Design generation failed with OpenAI.");
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
      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: CONTENT_SYSTEM_INSTRUCTION },
          { role: "user", content: rewritePrompt }
        ],
        model: config.model,
      });

      const enhancedSegment = completion.choices[0].message.content || chunk;
      
      // Accumulate
      finalContent += enhancedSegment + "\n\n";
      previousContext = enhancedSegment;

      // Notify UI about partial content update
      if (onProgress) onProgress('content', finalContent);

    } catch (e) {
      console.error(`Chunk ${i} processing error`, e);
      finalContent += chunk + "\n\n"; // Fallback
      if (onProgress) onProgress('content', finalContent);
    }
  }

  return { design, content: finalContent };
};