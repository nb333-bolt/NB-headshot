
import { GoogleGenAI } from "@google/genai";

export async function transformToHeadshot(
  base64Image: string,
  color: string
): Promise<string> {
  // Use the system-provided API key directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const pureBase64 = base64Image.split(',')[1];
  const mimeType = base64Image.split(';')[0].split(':')[1];

  const prompt = `
    Task: Corporate Headshot Transformation
    Target Attire: Well-fitted professional blazer/coat in ${color}.
    
    Strict Requirements:
    1. FACIAL INTEGRITY: Keep the person's identity, facial features, expressions, and proportions EXACTLY the same as the source image. Do not distort the face.
    2. LIGHTING: Apply soft, cinematic studio lighting (key, fill, and rim light).
    3. ATTIRE: Replace the existing clothes with a high-end, modern blazer in ${color} that looks naturally fitted to their shoulders and torso.
    4. BACKGROUND: A clean, neutral, premium studio background with soft bokeh/blur.
    5. RETOUCHING: Apply subtle, professional skin-frequency separation and eye clarity enhancements.
    6. FINAL OUTPUT: A polished, LinkedIn-ready corporate headshot.
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

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No response from AI model.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image. Please try a different photo.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "An error occurred during image transformation.");
  }
}
