"use client";

import { useTranslation } from "react-i18next";
import type { TrackingStatus } from "../types";
import { getStatusColor } from "../services/tracking.service";

import { getTimelineStatusKey } from "../utils";

interface StatusBadgeProps {
  status: TrackingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold whitespace-normal break-words text-center shrink-0 ${getStatusColor(status)}`}>
      {t(`tracking.status.${getTimelineStatusKey(status)}`)}
    </span>
  );
}
