"use client"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current = (resolvedTheme || theme) as "light" | "dark" | undefined
  const isDark = current === "dark"

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={handleToggle}>
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
}
