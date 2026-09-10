"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, LogOut, LayoutDashboard, FileText, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import type { User } from "firebase/auth"

interface UserAvatarProps {
  user: User
  onLogout: () => Promise<void> | void
}

export function UserAvatar({ user, onLogout }: UserAvatarProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const displayName = user.displayName || user.email || "Hero"
  const photoURL = user.photoURL

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {photoURL ? (
          <Image
            src={photoURL}
            alt={displayName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden sm:inline">{displayName}</span>
        <ChevronDown className="size-4" />
      </button>

      <div
        className={cn(
          "absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover shadow-xl transition",
          open ? "block" : "hidden"
        )}
        role="menu"
      >
        <div className="space-y-1 p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="size-4" />
            {t("navbar.dashboard")}
          </Link>
          <Link
            href="/report"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <MapPin className="size-4" />
            {t("navbar.report")}
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <FileText className="size-4" />
            {t("navbar.myReports")}
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
            onClick={async () => {
              setOpen(false)
              await onLogout()
            }}
          >
            <LogOut className="size-4" />
            {t("navbar.logout")}
          </button>
        </div>
      </div>
    </div>
  )
}
