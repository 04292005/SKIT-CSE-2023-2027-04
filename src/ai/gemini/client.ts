/**
 * Gemini Client
 *
 * This file is responsible ONLY for:
 * - validating the API key
 * - creating a reusable Gemini client
 * - exposing the configured model
 */

import { GoogleGenAI } from "@google/genai";
import { GEMINI_CONFIG } from "./config";

let client: GoogleGenAI | null = null;

/**
 * Returns a singleton Gemini client.
 */
export function getGeminiClient(): GoogleGenAI {
  if (client) {
    return client;
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_API_KEY. Please add GOOGLE_API_KEY to your .env.local file."
    );
  }

  client = new GoogleGenAI({
    apiKey,
  });

  return client;
}

/**
 * Returns the configured Gemini model name.
 */
export function getModelName(): string {
  return GEMINI_CONFIG.model;
}

/**
 * Returns the default generation configuration.
 */
export function getGenerationConfig() {
  return GEMINI_CONFIG.generationConfig;
}