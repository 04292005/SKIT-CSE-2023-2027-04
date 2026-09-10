"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AdminGuard } from "@/features/auth/guards/admin-guard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LayoutDashboard, FileText, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const links = [
    { href: "/admin", label: t("admin.menu.dashboard", { defaultValue: "Dashboard" }), icon: LayoutDashboard, exact: true },
    { href: "/admin/reports", label: t("admin.menu.reports", { defaultValue: "Reports" }), icon: FileText, exact: false },
    { href: "/admin/users", label: t("admin.menu.users", { defaultValue: "Users" }), icon: Users, exact: false },
    { href: "/admin/analytics", label: t("admin.menu.analytics", { defaultValue: "Analytics" }), icon: BarChart3, exact: false },
  ];

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Sub Nav / Admin Header */}
            <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {t("admin.title", { defaultValue: "Municipal Authority Panel" })}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("admin.subtitle", { defaultValue: "Manage reports, assign departments, and track resolution metrics." })}
                </p>
              </div>

              {/* Sub tabs navigation */}
              <nav className="flex flex-wrap gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/40 p-1 self-start sm:self-auto shadow-inner">
                {links.map((link) => {
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all",
                        isActive
                          ? "bg-white dark:bg-slate-900 text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <motion.div
              key={pathname}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}
