
import { GoogleGenAI } from "@google/genai";

export async function transformToHeadshot(
  base64Image: string,
  color: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract pure base64 data by removing the data:image/xxx;base64, prefix
  const pureBase64 = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  const prompt = `
    Transform this casual photo into a polished, high-end corporate headshot.
    Strict Requirements:
    1. KEEP the person's identity, facial features, and proportions EXACTLY the same. Do not change their face.
    2. IMPROVE lighting to soft, professional studio lighting.
    3. REPLACE the current outfit with a well-fitted, professional blazer or coat in ${color}.
    4. BACKGROUND: Change the background to a clean, neutral, soft-focus studio background (light grey or cream).
    5. QUALITY: Apply subtle, natural retouching (skin smoothing, eye sharpening) for a premium business profile look.
    6. Ensure the final image is elegant, confident, and business-appropriate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: pureBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Failed to generate headshot image.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "An error occurred during image transformation.");
  }
}
