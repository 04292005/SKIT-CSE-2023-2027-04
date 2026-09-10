"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, FileImage, FolderOpen, Trash2 } from "lucide-react";
import { toDataUrl } from "../utils/media";

interface MediaUploaderProps {
  media?: File | null;
  onChange: (file: File | null) => void;
}

export function MediaUploader({
  media,
  onChange,
}: MediaUploaderProps) {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    async (file?: File | null) => {
      if (!file) {
        setPreviewUrl(null);
        onChange(null);
        return;
      }

      const url = await toDataUrl(file);

      setPreviewUrl(url);
      onChange(file);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const file = e.dataTransfer.files?.[0];

      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      handleFile(file);
    },
    [handleFile]
  );

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex min-h-52 w-full items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-slate-50/40 to-slate-100/20 p-6 transition-all duration-300 hover:border-emerald-500 hover:from-emerald-50/25 hover:to-emerald-100/10 cursor-pointer"
      >
        <div className="text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
            <FileImage className="size-5" aria-hidden="true" />
          </span>
          <p className="mb-2 text-sm text-muted-foreground font-medium">
            {t("common.dragDrop")}
          </p>

          <p className="mb-4 text-xs text-muted-foreground/60">
            JPG · PNG · WEBP · MP4 · MOV · WEBM
          </p>

          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              onClick={() => inputRef.current?.click()}
            >
              <FolderOpen className="size-4" aria-hidden="true" />
              {t("common.chooseFile")}
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden="true" />
              {t("common.camera")}
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={onSelectFile}
          />
        </div>
      </div>

      {previewUrl && (
        <div className="mt-4 p-4 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="mb-2 text-sm text-muted-foreground font-semibold">
            {t("common.preview")}
          </p>

          {media?.type.startsWith("video") ? (
            <video
              src={previewUrl}
              controls
              className="max-h-64 w-full rounded-2xl bg-slate-950 object-contain"
            />
          ) : (
            <img
              src={previewUrl}
              alt={t("common.preview")}
              className="max-h-64 w-full rounded-2xl bg-slate-50 object-contain"
            />
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
              onClick={() => handleFile(null)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t("common.remove")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}