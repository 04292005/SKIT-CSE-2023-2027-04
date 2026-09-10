"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Shield, UserMinus, UserPlus, Search } from "lucide-react";

import { subscribeToAllUsers, setUserRole } from "@/features/admin/services/admin.service";
import type { UserProfile } from "@/features/auth/types";
import { cn } from "@/lib/utils";

// Extends with role since admin.service returns role field dynamically
type AdminUserProfile = UserProfile & { role?: string };

function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel,
  confirmVariant = "primary",
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  confirmVariant?: "primary" | "danger";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm p-6 space-y-4 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors",
              confirmVariant === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{
    user: AdminUserProfile;
    newRole: "admin" | "citizen";
  } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAllUsers(
      (data) => {
        setUsers(data as AdminUserProfile[]);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleRoleChange = async (user: AdminUserProfile, newRole: "admin" | "citizen") => {
    setUpdating(user.uid);
    try {
      await setUserRole(user.uid, newRole);
      setFeedback(
        `${user.displayName || "User"} ${newRole === "admin" ? "promoted to Admin" : "changed to Citizen"}.`
      );
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to update role. Please try again.");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setUpdating(null);
      setConfirm(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.displayName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      (u.role || "citizen").toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-xl animate-in slide-in-from-bottom-4">
          {feedback}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          open
          title={
            confirm.newRole === "admin"
              ? `Promote ${confirm.user.displayName || "User"} to Admin?`
              : `Demote ${confirm.user.displayName || "User"} to Citizen?`
          }
          description={
            confirm.newRole === "admin"
              ? "This user will gain full access to the Municipal Admin Panel and all administrative actions."
              : "This user will lose Admin Panel access and be reverted to a standard citizen account."
          }
          confirmLabel={confirm.newRole === "admin" ? "Promote to Admin" : "Demote to Citizen"}
          confirmVariant={confirm.newRole === "admin" ? "primary" : "danger"}
          onConfirm={() => handleRoleChange(confirm.user, confirm.newRole)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-16 rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-3xl border border-border overflow-hidden shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/60 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-center">Hero Points</th>
                  <th className="px-4 py-3 text-center">Badges</th>
                  <th className="px-4 py-3 text-center">Reports</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-card">
                {filtered.map((user) => {
                  const isAdmin = user.role === "admin";
                  return (
                    <tr key={user.uid} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL}
                              alt={user.displayName || "User"}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {user.displayName || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                            isAdmin
                              ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                              : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700"
                          )}
                        >
                          {isAdmin ? <Shield className="h-2.5 w-2.5" /> : null}
                          {isAdmin ? "Admin" : "Citizen"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-semibold text-foreground">
                        {user.heroPoints ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {user.badges?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {(user as any).reportsSubmitted ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isAdmin ? (
                          <button
                            disabled={updating === user.uid}
                            onClick={() => setConfirm({ user, newRole: "citizen" })}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 disabled:opacity-40 transition-colors"
                          >
                            <UserMinus className="h-3 w-3" /> Demote
                          </button>
                        ) : (
                          <button
                            disabled={updating === user.uid}
                            onClick={() => setConfirm({ user, newRole: "admin" })}
                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-500/20 disabled:opacity-40 transition-colors"
                          >
                            <UserPlus className="h-3 w-3" /> Promote
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((user) => {
              const isAdmin = user.role === "admin";
              return (
                <div key={user.uid} className="p-4 space-y-3 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {(user.displayName || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-foreground truncate">
                        {user.displayName || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold shrink-0",
                        isAdmin
                          ? "bg-indigo-500/10 text-indigo-600"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400"
                      )}
                    >
                      {isAdmin ? "Admin" : "Citizen"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{user.heroPoints ?? 0} pts</span>
                    <span>{user.badges?.length ?? 0} badges</span>
                    <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
                  </div>
                  {isAdmin ? (
                    <button
                      disabled={updating === user.uid}
                      onClick={() => setConfirm({ user, newRole: "citizen" })}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 disabled:opacity-40"
                    >
                      <UserMinus className="h-3 w-3" /> Demote to Citizen
                    </button>
                  ) : (
                    <button
                      disabled={updating === user.uid}
                      onClick={() => setConfirm({ user, newRole: "admin" })}
                      className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-500/20 disabled:opacity-40"
                    >
                      <UserPlus className="h-3 w-3" /> Promote to Admin
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 lg:py-24 text-center">
              <p className="font-semibold text-foreground">No users found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
