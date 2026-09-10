"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse rounded-3xl border border-border bg-muted/70 p-12 text-center shadow-xl">
          <div className="mb-4 h-12 w-12 rounded-full bg-muted mx-auto" />
          <div className="mx-auto mt-4 h-6 w-60 rounded bg-muted" />
          <div className="mx-auto mt-3 h-4 w-72 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md p-8 text-center rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This section is restricted to authorized municipal officials. Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
