"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface LoginButtonProps {
	onLogin: () => Promise<unknown> | void
	disabled?: boolean
}

export function LoginButton({ onLogin, disabled }: LoginButtonProps) {
	const { t } = useTranslation();
	return (
		<Button size="sm" type="button" onClick={onLogin} disabled={disabled}>
			{t("navbar.login")}
		</Button>
	)
}
