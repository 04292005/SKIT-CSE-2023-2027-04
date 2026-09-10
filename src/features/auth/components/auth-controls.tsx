"use client"

import { LoginButton } from "./login-button"
import { UserAvatar } from "./user-avatar"
import { useAuth } from "../hooks/use-auth"

interface AuthControlsProps {
  className?: string
}

export function AuthControls({ className }: AuthControlsProps) {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  return (
    <div className={className}>
      {loading ? (
        <div className="h-10 w-32 rounded-full bg-muted/50" />
      ) : user ? (
        <UserAvatar user={user} onLogout={logout} />
      ) : (
        <LoginButton onLogin={loginWithGoogle} disabled={loading} />
      )}
    </div>
  )
}
