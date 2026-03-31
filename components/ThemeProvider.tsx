'use client'
import { useEffect } from 'react'
import { getThemeById, getThemeCSSVars, defaultTheme } from '@/lib/themes'

const STORAGE_KEY = 'yot-theme'

function applyThemeVars(id: string) {
  const theme = getThemeById(id)
  const vars = getThemeCSSVars(theme)
  const root = document.documentElement
  Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
  root.style.background = theme.bg
  document.body.style.background = theme.bg
  document.body.style.color = theme.foreground
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reapply saved theme on mount (reinforces the blocking script)
    const savedId = localStorage.getItem(STORAGE_KEY) ?? defaultTheme.id
    applyThemeVars(savedId)

    // Sync theme changes made in other browser tabs
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        applyThemeVars(e.newValue)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return <>{children}</>
}
