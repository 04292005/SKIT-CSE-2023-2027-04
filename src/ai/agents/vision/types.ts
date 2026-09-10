// vision agent types.
export interface VisionInput {
  mediaBase64: string;
  mimeType: string;
}

export interface VisionAnalysis {
  category: string;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  priorityScore: number;
  department: string;
  summary: string;
}