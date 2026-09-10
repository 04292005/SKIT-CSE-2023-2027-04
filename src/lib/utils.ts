import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDepartmentName(value: string | undefined | null): string {
  if (!value) return "";
  return value.replace(/^departments\./, "");
}
