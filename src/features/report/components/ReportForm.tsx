"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, FileCheck2, Loader2, MapPin, Mic, MicOff, ScanSearch, UploadCloud } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { VisionAnalysis } from "@/ai/agents/vision";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { REPORT_CATEGORIES } from "../constants";
import { MediaUploader } from "./MediaUploader";
import { AIAnalysisCard } from "./AIAnalysisCard";

import { useReportForm } from "../hooks/use-report-form";
import { submitReport } from "../services/report.service";
import { analyzeMedia } from "../services/ai.service";
import { useCurrentLocation, reverseGeocode } from "@/features/location";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export function ReportForm() {
  const { t, i18n } = useTranslation();
  const {
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
  } = useReportForm();

  const {
    latitude,
    longitude,
    accuracy,
    loading: locationLoading,
    error: locationError,
  } = useCurrentLocation();

  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  // Speech to Text hook integration
  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    lang: i18n.language,
    onResult: (text) => {
      setDescription((prev) => (prev ? prev + " " + text : text));
    },
  });

  useEffect(() => {
    if (
      locationLoading ||
      locationError ||
      latitude == null ||
      longitude == null
    ) {
      return;
    }

    const currentLatitude = latitude;
    const currentLongitude = longitude;

    async function fetchAddress() {
      try {
        const address = await reverseGeocode(currentLatitude, currentLongitude);

        setLocation({
          latitude: currentLatitude,
          longitude: currentLongitude,
          accuracy: accuracy ?? 0,
          address: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
        });
        setGeocodeError(null);
      } catch (error) {
        console.error(error);
        setGeocodeError(t("reportForm.locationDetail.errorGeocode") || "Unable to resolve address.");

        setLocation({
          latitude: currentLatitude,
          longitude: currentLongitude,
          accuracy: accuracy ?? 0,
          address: `${currentLatitude.toFixed(6)}, ${currentLongitude.toFixed(6)}`,
          city: "",
          state: "",
          country: "",
        });
      }
    }

    fetchAddress();
  }, [accuracy, latitude, longitude, locationError, locationLoading, setLocation, t]);

  const onSubmit = useCallback(async () => {
    await submit(async (payload) => {
      const id = await submitReport(payload);
      alert(t("reportForm.toasts.submitSuccess", { id }) || `Report submitted successfully!\nReport ID: ${id}`);
      reset();
    });
  }, [reset, submit, t]);

  const onAnalyze = useCallback(async () => {
    if (!media) return;

    try {
      setAnalyzing(true);
      const result = await analyzeMedia(media);
      setAnalysis(result as VisionAnalysis);
    } catch (error) {
      console.error(error);
      alert(t("reportForm.toasts.analyzeFailed") || "AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }, [media, setAnalysis, setAnalyzing, t]);

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
      {/* Left Section */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            {t("reportForm.eyebrow", "Civic reporting")}
          </p>
          <h1 className="mt-3 text-5xl lg:text-6xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("reportForm.title")}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {t("reportForm.description")}
          </p>
        </div>

        {/* Connected Stepper */}
        <div className="relative my-8">
          <div className="absolute left-6 right-6 top-5 h-0.5 -translate-y-1/2 bg-slate-100" aria-hidden="true" />
          <ol className="relative flex justify-between gap-4" aria-label="Report submission steps">
            {[
              { label: t("reportForm.steps.evidence", "Add evidence"), icon: UploadCloud, current: !analysis && !analyzing },
              { label: t("reportForm.steps.aiReview", "AI review"), icon: ScanSearch, current: analyzing || (!!analysis && !submitting) },
              { label: t("reportForm.steps.submit", "Submit"), icon: FileCheck2, current: submitting },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex flex-col items-center text-center relative z-10 flex-1">
                  <span className={cn(
                    "flex size-10 items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm",
                    step.current
                      ? "border-emerald-600 bg-emerald-600 text-white ring-4 ring-emerald-50"
                      : "border-slate-200 bg-white text-slate-400"
                  )}>
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className={cn(
                    "mt-2 text-[11px] font-semibold tracking-tight transition-colors duration-300 uppercase tracking-widest",
                    step.current ? "text-emerald-700 font-bold" : "text-slate-400"
                  )}>
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Form Panel Container */}
        <div className="space-y-6">
          {/* Section 1: Upload */}
          <section aria-labelledby="upload-section-title" className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
            <h2 id="upload-section-title" className="mb-3 text-base font-semibold text-slate-900">
              {t("reportForm.uploadTitle")}
            </h2>

            <MediaUploader
              media={media}
              onChange={setMediaFile}
            />

            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {t("reportForm.uploadTip")}
            </p>
          </section>

          {/* Section 2: Description */}
          <section aria-labelledby="description-section-title" className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <label id="description-section-title" htmlFor="report-description" className="block text-sm font-semibold text-slate-800">
                {t("reportForm.descLabel")}
              </label>

              {/* Microphone Button */}
              {isSupported && (
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isListening && "animate-pulse"
                  )}
                  aria-label={isListening ? t("reportForm.speech.stop") : t("reportForm.speech.start")}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t("reportForm.speech.stop")}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      <span>{t("reportForm.speech.start")}</span>
                    </>
                  )}
                </Button>
              )}
            </div>

            <textarea
              id="report-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("reportForm.descPlaceholder")}
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all duration-200 min-h-36 resize-y"
            />
          </section>

          {/* Section 3: Category Chips + Location Status */}
          <section aria-labelledby="meta-section-title" className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-sm flex flex-col gap-6 md:flex-row">
            <h2 id="meta-section-title" className="sr-only">Category and Location details</h2>
            <div className="flex-1">
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                {t("reportForm.categoryLabel")}
              </label>

              <div className="flex flex-wrap gap-2">
                {REPORT_CATEGORIES.map((item) => {
                  const isSelected = category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item as any)}
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-xs font-semibold border transition-all duration-300 hover:-translate-y-0.5",
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                      )}
                    >
                      {t("categories." + item) || item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full md:w-72 border-t border-slate-100 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <label className="mb-3 block text-sm font-semibold text-slate-800">{t("reportDetail.location")}</label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{t("reportForm.locationStatus")}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5" aria-live="polite">
                      {locationLoading
                        ? t("reportForm.locationDetail.waiting")
                        : locationError
                          ? t("reportForm.locationDetail.denied")
                          : location && location.address
                            ? t("reportForm.locationDetail.detected")
                            : t("reportForm.locationDetail.requesting")}
                    </p>
                  </div>
                  <div>
                    {locationLoading ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <Loader2 className="animate-spin size-3" aria-hidden="true" />
                        {t("common.loading").replace("...", "")}
                      </span>
                    ) : locationError ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        {t("common.error")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                        <CheckCircle className="size-3" aria-hidden="true" />
                        {t("reportForm.locationDetail.detected")}
                      </span>
                    )}
                  </div>
                </div>

                {locationLoading ? (
                  <p className="text-xs text-muted-foreground">
                    {t("reportForm.locationDetail.waiting")}
                  </p>
                ) : locationError ? (
                  <p className="text-xs text-destructive">{locationError}</p>
                ) : location ? (
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-slate-700 leading-tight">{location.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-100 pt-2.5">
                      <div>
                        <p className="uppercase tracking-wider text-muted-foreground/80">{t("reportForm.locationCard.latitude")}</p>
                        <p className="mt-0.5 font-semibold text-slate-800">{location.latitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wider text-muted-foreground/80">{t("reportForm.locationCard.longitude")}</p>
                        <p className="mt-0.5 font-semibold text-slate-800">{location.longitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wider text-muted-foreground/80">{t("reportForm.locationCard.city")}</p>
                        <p className="mt-0.5 font-semibold text-slate-800 truncate">{location.city || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wider text-muted-foreground/80">{t("reportForm.locationCard.region")}</p>
                        <p className="mt-0.5 font-semibold text-slate-800 truncate">{location.state || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground border-t border-slate-100 pt-2">
                      {t("reportForm.locationCard.accuracy", { accuracy: accuracy?.toFixed(0) || "N/A" })}
                    </div>
                    {geocodeError ? (
                      <p className="text-[10px] text-destructive mt-1">{geocodeError}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap pt-2">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!media || analyzing || !!analysis}
            className="cursor-pointer rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {analyzing
              ? t("reportForm.buttons.analyzing")
              : analysis
                ? t("reportForm.buttons.complete")
                : t("reportForm.buttons.analyze")}
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !analysis}
            className="cursor-pointer bg-emerald-600 px-6 py-3 font-semibold text-white duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {submitting ? t("reportForm.buttons.submitting") : t("reportForm.buttons.submit")}
          </button>

          <button
            type="button"
            onClick={reset}
            className="cursor-pointer px-6 py-3 font-semibold text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            {t("reportForm.buttons.reset")}
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-5" aria-label="AI Verification Info">
        <AIAnalysisCard
          analysis={analysis}
          loading={analyzing}
        />

        <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl p-5 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {t("reportForm.locationStatus")}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("reportForm.locationStatusDetail", "Browser location details are included with the report when permission is granted. Geographic context is displayed with OpenStreetMap and Leaflet.")}
          </p>
        </div>
      </aside>
    </div>
  );
}
