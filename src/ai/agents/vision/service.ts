// vision agent service.
import { getGeminiClient, getGenerationConfig, getModelName } from "@/ai/gemini";
import { VISION_SYSTEM_PROMPT } from "./prompt";
import type { VisionAnalysis, VisionInput } from "./types";

export async function analyzeMedia(
  input: VisionInput
): Promise<VisionAnalysis> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: getModelName(),

    config: {
      ...getGenerationConfig(),
      responseMimeType: "application/json",
    },

    contents: [
      {
        role: "user",
        parts: [
          {
            text: VISION_SYSTEM_PROMPT,
          },
          {
            inlineData: {
              mimeType: input.mimeType,
              data: input.mediaBase64,
            },
          },
        ],
      },
    ],
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text) as VisionAnalysis;
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}