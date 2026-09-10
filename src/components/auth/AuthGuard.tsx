"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { t } = useTranslation();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">

        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md p-10 text-center rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">

            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          </div>

          <h2 className="mt-6 text-xl font-bold text-slate-900">

            Verifying Secure Session

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            Preparing your secure civic workspace...

          </p>

        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex min-h-[85vh] flex-1 items-center justify-center overflow-hidden px-4 py-16 md:py-20 lg:py-24 sm:px-6 lg:px-8">
        {/* Soft dynamic background gradient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <motion.div
            className="absolute -top-32 left-1/2 h-96 w-[50rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Auth Panel Card container */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl ] p-8 sm:p-12 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Header Brand */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 border border-emerald-500/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("auth.badge")}</span>
              </motion.div>

              {/* Glowing Icon */}
              <div className="relative mt-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-50 to-emerald-50 border border-slate-200 shadow-lg">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 opacity-0 transition-opacity hover:opacity-100" />
                <ShieldCheck className="h-9 w-9 text-indigo-600" />
              </div>

              {/* Title & Description */}
              <h1 className="mt-8 text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t("auth.title")}
              </h1>
              <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base leading-relaxed">
                {t("auth.description")}
              </p>
            </div>

            {/* CTA Controls */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-slate-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-slate-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70">
              
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-900" />
                    <span>{t("auth.signingIn")}</span>
                  </>
                ) : (
                  <>
                    {/* Google SVG Icon */}
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 0, 0)">
                        <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.77 21.56,11.41 21.35,11.1z" fill="#4285F4" />
                        <path d="M12,20.82c2.43,0 4.47,-0.8 5.96,-2.19l-3.3,-2.58c-0.9,0.6 -2.07,0.97 -3.27,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.94v2.66C4.43,18.84 8.01,20.82 12,20.82z" fill="#34A853" />
                        <path d="M6.96,13.33c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7c0,-0.59 0.1,-1.16 0.28,-1.7V7.27H2.94C2.3,8.54 1.94,10 1.94,11.63c0,1.63 0.36,3.09 1,4.36L6.96,13.33z" fill="#FBBC05" />
                        <path d="M12,6.48c1.33,0 2.52,0.46 3.46,1.35l2.6,-2.6C16.49,3.75 14.45,2.94 12,2.94C8.01,2.94 4.43,4.92 2.94,7.88l4.02,3.12C7.67,8.06 9.66,6.48 12,6.48z" fill="#EA4335" />
                      </g>
                    </svg>
                    <span>{t("auth.signInButton")}</span>
                  </>
                )}
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-8 py-4 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200 hover:shadow-md"
              >
                <span>{t("auth.backToHome")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("auth.indicators.secure")}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("auth.indicators.tracking")}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("auth.indicators.ai")}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return <>{children}</>;
}
