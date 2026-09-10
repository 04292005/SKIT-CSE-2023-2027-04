import { fileToBase64 } from "../utils/base64";

export async function analyzeMedia(file: File) {
  const mediaBase64 = await fileToBase64(file);

  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mediaBase64,
      mimeType: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error("AI analysis failed.");
  }

  return response.json();
}