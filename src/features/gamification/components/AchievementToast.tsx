"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BadgeDefinition } from "../constants";

interface AchievementToastProps {
  badge: BadgeDefinition;
  onClose: () => void;
}

export function AchievementToast({ badge, onClose }: AchievementToastProps) {
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          className="pointer-events-auto flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-md text-white min-w-[280px]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl shrink-0" aria-hidden="true">
            {badge.icon}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Trophy className="h-3 w-3" aria-hidden="true" />
              {t("toasts.badgeUnlocked")}
            </div>
            <h4 className="text-sm font-bold text-white">{t(`badges.${badge.id}.name`)}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(`badges.${badge.id}.description`)}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t("toasts.pointsAwarded", { points: badge.pointsAwarded })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
