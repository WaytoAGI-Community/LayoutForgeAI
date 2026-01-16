import { GoogleGenAI, Schema } from "@google/genai";
import OpenAI from "openai";
import { AIConfig } from "../types";

// --- Universal Interfaces ---

export interface CompletionRequest {
  prompt: string;
  systemInstruction?: string;
  jsonSchema?: Schema | any; // Supports Gemini Schema or OpenAI JSON schema
  jsonMode?: boolean; // Force JSON output
}

// --- Engine ---

/**
 * Validates the configuration before making requests
 */
function validateConfig(config: AIConfig) {
  if (config.provider === 'openai') {
    if (!config.openai?.apiKey) throw new Error("OpenAI API Key is missing in settings.");
  } else if (config.provider === 'gemini') {
    if (!process.env.API_KEY && !config.gemini?.apiKey) {
      throw new Error("Gemini API Key is missing (process.env.API_KEY).");
    }
  }
}

/**
 * Unified generation method for text or JSON
 */
export const generateContent = async (
  config: AIConfig,
  request: CompletionRequest
): Promise<string> => {
  validateConfig(config);

  // --- Gemini Implementation ---
  if (config.provider === 'gemini') {
    const apiKey = config.gemini?.apiKey || process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    
    const geminiConfig: any = {
      systemInstruction: request.systemInstruction,
    };

    if (request.jsonMode) {
      geminiConfig.responseMimeType = "application/json";
      if (request.jsonSchema) {
        geminiConfig.responseSchema = request.jsonSchema;
      }
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: request.prompt,
        config: geminiConfig
      });
      return response.text || "";
    } catch (e: any) {
      console.error("Gemini Error:", e);
      throw new Error(`Gemini Error: ${e.message}`);
    }
  }

  // --- OpenAI Implementation ---
  if (config.provider === 'openai' && config.openai) {
    const client = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseUrl || "https://api.openai.com/v1",
      dangerouslyAllowBrowser: true 
    });

    const messages: any[] = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });

    try {
      const completion = await client.chat.completions.create({
        messages,
        model: config.openai.model,
        response_format: request.jsonMode ? { type: "json_object" } : undefined,
      });

      return completion.choices[0].message.content || "";
    } catch (e: any) {
      console.error("OpenAI Error:", e);
      throw new Error(`OpenAI Error: ${e.message}`);
    }
  }

  throw new Error("Invalid Provider Configuration");
};

/**
 * Unified streaming method
 */
export async function* generateStream(
  config: AIConfig,
  request: CompletionRequest
): AsyncGenerator<string> {
  validateConfig(config);

  // --- Gemini Stream ---
  if (config.provider === 'gemini') {
    const apiKey = config.gemini?.apiKey || process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    const streamResp = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: request.prompt,
      config: {
        systemInstruction: request.systemInstruction,
      }
    });

    for await (const chunk of streamResp) {
      if (chunk.text) yield chunk.text;
    }
    return;
  }

  // --- OpenAI Stream ---
  if (config.provider === 'openai' && config.openai) {
    const client = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseUrl || "https://api.openai.com/v1",
      dangerouslyAllowBrowser: true,
    });

    const messages: any[] = [];
    if (request.systemInstruction) {
      messages.push({ role: "system", content: request.systemInstruction });
    }
    messages.push({ role: "user", content: request.prompt });

    const stream = await client.chat.completions.create({
      model: config.openai.model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
    return;
  }
}
