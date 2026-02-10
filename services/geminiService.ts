import { GoogleGenAI, Type } from "@google/genai";

export class GeminiMusicService {
  private ai: GoogleGenAI;

  constructor() {
    // Guideline: MUST use new GoogleGenAI({ apiKey: process.env.API_KEY })
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getMusicRecommendations(prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the user's mood or description: "${prompt}", suggest 3 existing popular songs. Return only a JSON array of objects with "title" and "artist".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING }
              },
              required: ["title", "artist"]
            }
          }
        }
      });
      
      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini suggestion failed:", error);
      return [];
    }
  }
}