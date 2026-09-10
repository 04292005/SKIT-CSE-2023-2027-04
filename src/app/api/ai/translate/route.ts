import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, getModelName } from "@/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing text to translate." }, { status: 400 });
    }
    if (!targetLang) {
      return NextResponse.json({ error: "Missing targetLang." }, { status: 400 });
    }

    const ai = getGeminiClient();

    // Map of language code to full language name for Gemini context clarity
    const langMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      gu: "Gujarati",
      mr: "Marathi",
      bn: "Bengali",
      ta: "Tamil",
      te: "Telugu",
      kn: "Kannada",
    };

    const targetLangName = langMap[targetLang] || targetLang;

    const prompt = `You are a professional multilingual translator. Translate the following text into the target language.
Target language: ${targetLangName} (${targetLang})
Text: "${text}"

Provide ONLY the translated text. Do not add any quotes, markdown formatting, introductory text, explanations, or filler.`;

    const response = await ai.models.generateContent({
      model: getModelName(),
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const translatedText = response.text?.trim() || text;

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed." }, { status: 500 });
  }
}
