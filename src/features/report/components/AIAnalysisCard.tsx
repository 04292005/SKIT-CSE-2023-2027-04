"use client";

import type { VisionAnalysis } from "@/ai/agents/vision";
import { useTranslation } from "react-i18next";
import { Play, Square, Pause } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { formatDepartmentName } from "@/lib/utils";

interface Props {
  analysis: VisionAnalysis | null;
  loading?: boolean;
}

export function AIAnalysisCard({
  analysis,
  loading = false,
}: Props) {
  const { t, i18n } = useTranslation();
  const { speak, stop, pause, resume, isPlaying, isPaused, isSupported } = useSpeechSynthesis(i18n.language);
  const [translatedSummary, setTranslatedSummary] = useState<string>("");
  const [translating, setTranslating] = useState<boolean>(false);

  useEffect(() => {
    if (!analysis?.summary) {
      setTranslatedSummary("");
      return;
    }

    const currentLang = i18n.language.slice(0, 2);
    if (currentLang === "en") {
      setTranslatedSummary(analysis.summary);
      return;
    }

    let isMounted = true;
    const fetchTranslation = async () => {
      setTranslating(true);
      try {
        const res = await fetch("/api/ai/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: analysis.summary,
            targetLang: currentLang,
          }),
        });
        if (!res.ok) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[Translation] API returned non-OK status:", res.status);
          }
          if (isMounted) {
            setTranslatedSummary(analysis.summary);
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setTranslatedSummary(data.translatedText || analysis.summary);
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Translation] Request failed, falling back to original summary:", err);
        }
        if (isMounted) {
          setTranslatedSummary(analysis.summary);
        }
      } finally {
        if (isMounted) {
          setTranslating(false);
        }
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [analysis?.summary, i18n.language]);

  const handleSpeak = () => {
    if (!analysis) return;
    const catText = t("categories." + analysis.category) || analysis.category;
    const sevText = t("severity." + analysis.severity) || analysis.severity;
    const deptText = formatDepartmentName(t("departments." + analysis.department) || analysis.department);
    const sumText = translating ? t("reportDetail.aiAnalysis.translating") : (translatedSummary || analysis.summary);

    const textToRead = `${t("reportDetail.aiAnalysis.title")}. ${t("reportForm.categoryLabel")}: ${catText}. ${t("reportDetail.aiAnalysis.severity")}: ${sevText}. ${t("reportDetail.aiAnalysis.department")}: ${deptText}. ${t("reportDetail.aiAnalysis.summary")}: ${sumText}`;
    speak(textToRead);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">
          {t("reportDetail.aiAnalysis.title")}
        </h3>
        
        {isSupported && analysis && !loading && (
          <div className="flex items-center gap-1 shrink-0">
            {isPlaying && !isPaused ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                onClick={pause}
                aria-label="Pause narration"
              >
                <Pause className="h-3.5 w-3.5 text-foreground" />
              </Button>
            ) : isPaused ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                onClick={resume}
                aria-label="Resume narration"
              >
                <Play className="h-3.5 w-3.5 text-foreground" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                onClick={handleSpeak}
                aria-label={t("reportDetail.speech.read")}
              >
                <Play className="h-3.5 w-3.5 text-foreground" />
              </Button>
            )}
            
            {(isPlaying || isPaused) && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                onClick={stop}
                aria-label={t("reportDetail.speech.stop")}
              >
                <Square className="h-3.5 w-3.5 text-destructive" />
              </Button>
            )}
          </div>
        )}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse" aria-live="polite">
          🤖 {t("reportForm.buttons.analyzing")}
        </p>
      )}

      {!loading && !analysis && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("reportForm.description")}
        </p>
      )}

      {!loading && analysis && (
        <div className="space-y-3 text-xs">
          <div>
            <strong className="text-foreground">{t("reportForm.categoryLabel")}:</strong> <span className="text-muted-foreground">{t("categories." + analysis.category) || analysis.category}</span>
          </div>

          <div>
            <strong className="text-foreground">{t("reportDetail.aiAnalysis.severity")}:</strong> <span className="text-muted-foreground">{t("severity." + analysis.severity) || analysis.severity}</span>
          </div>

          <div>
            <strong className="text-foreground">{t("liveMap.popup.confidence")}:</strong> <span className="text-muted-foreground">{analysis.confidence}%</span>
          </div>

          <div>
            <strong className="text-foreground">{t("liveMap.popup.priority")}:</strong> <span className="text-muted-foreground">{analysis.priorityScore}</span>
          </div>

          <div>
            <strong className="text-foreground">{t("reportDetail.aiAnalysis.department")}:</strong> <span className="text-muted-foreground">{formatDepartmentName(t("departments." + analysis.department) || analysis.department)}</span>
          </div>

          <div className="border-t border-border/40 pt-2">
            <strong className="text-foreground">{t("reportDetail.aiAnalysis.summary")}:</strong>
            <p className="mt-1 text-muted-foreground leading-relaxed text-xs">
              {translating ? (
                <span className="italic text-muted-foreground/60">{t("reportDetail.aiAnalysis.translating")}</span>
              ) : (
                translatedSummary || analysis.summary
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}