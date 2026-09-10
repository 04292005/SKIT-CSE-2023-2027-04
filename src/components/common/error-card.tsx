"use client";

import { AlertCircle } from "lucide-react";

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ title = "Something went wrong", message, onRetry }: ErrorCardProps) {
  return (
    <div className="mx-auto my-6 w-full max-w-2xl rounded-3xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{message}</p>
          {onRetry && (
            <div className="mt-4 flex justify-center sm:justify-start">
              <button
                onClick={onRetry}
                className="rounded-full bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
