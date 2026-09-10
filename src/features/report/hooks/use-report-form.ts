"use client";

import { useCallback, useState } from "react";

import type {
  Category,
  ReportLocation,
  ReportPayload,
} from "../types";

import type { VisionAnalysis } from "@/ai/agents/vision";

export function useReportForm(initial?: Partial<ReportPayload>) {
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );

  const [category, setCategory] = useState<Category>(
    (initial?.category as Category) ?? "Other"
  );

  const [media, setMedia] = useState<File | null>(
    initial?.media ?? null
  );

  const [location, setLocation] = useState<ReportLocation | null>(
    initial?.location ?? null
  );

  const [submitting, setSubmitting] = useState(false);

  // AI Analysis
  const [analysis, setAnalysis] = useState<VisionAnalysis | null>(null);

  const [analyzing, setAnalyzing] = useState(false);

  const reset = useCallback(() => {
    setDescription("");
    setCategory("Other");
    setMedia(null);
    setLocation(null);
    setSubmitting(false);
    setAnalysis(null);
    setAnalyzing(false);
  }, []);

  const setMediaFile = useCallback((file: File | null) => {
    setMedia(file);
    setAnalysis(null);
  }, []);

  const submit = useCallback(
    async (
      onSubmit: (payload: ReportPayload) => Promise<unknown>
    ) => {
      setSubmitting(true);

      try {
        const payload: ReportPayload = {
          description,
          category,

          media,

          mediaType: media
            ? media.type.startsWith("video")
              ? "video"
              : "image"
            : null,

          mimeType: media?.type ?? null,

          location,

          aiAnalysis: analysis,
        };

        await onSubmit(payload);
      } finally {
        setSubmitting(false);
      }
    },
    [description, category, media, location, analysis]
  );

  return {
    description,
    setDescription,

    category,
    setCategory,

    media,
    setMediaFile,

    location,
    setLocation,

    submitting,

    submit,
    reset,

    analysis,
    setAnalysis,

    analyzing,
    setAnalyzing,
  };
}