// /**
//  * Gemini configuration.
//  * Static configuration only.
//  */

// export const GEMINI_CONFIG = {
//   model:
//     process.env.GEMINI_MODEL ??
//     "gemini-2.5-flash",

//   generationConfig: {
//     temperature: 0.2,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 1024,
//   },
// } as const;

// export type GeminiConfig = typeof GEMINI_CONFIG;

export const GEMINI_CONFIG = {
  model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",

  generationConfig: {
    maxOutputTokens: 1024,
  },
} as const;

export type GeminiConfig = typeof GEMINI_CONFIG;