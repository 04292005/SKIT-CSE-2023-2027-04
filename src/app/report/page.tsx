"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ReportForm } from "@/features/report/components/ReportForm";

export default function ReportPage() {
  return (
    <AuthGuard>
      <main className="w-full bg-gradient-to-b from-white via-slate-50/70 to-emerald-50/20">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 md:py-20 lg:py-24 lg:px-8">
          <ReportForm />
        </div>
      </main>
    </AuthGuard>
  );
}
