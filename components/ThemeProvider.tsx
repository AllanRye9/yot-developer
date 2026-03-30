'use client'
import { useEffect, useState } from 'react'
import { getThemeById, getThemeCSSVars, defaultTheme } from '@/lib/themes'

const STORAGE_KEY = 'yot-theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY) ?? defaultTheme.id
    const theme = getThemeById(savedId)
    const vars = getThemeCSSVars(theme)
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
    // Apply bg/fg to both html and body for full-page coverage
    document.documentElement.style.background = theme.bg
    document.body.style.background = theme.bg
    document.body.style.color = theme.foreground
    setMounted(true)

    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const t = getThemeById(e.newValue)
        const v = getThemeCSSVars(t)
        Object.entries(v).forEach(([k, val]) => root.style.setProperty(k, val))
        document.documentElement.style.background = t.bg
        document.body.style.background = t.bg
        document.body.style.color = t.foreground
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  if (!mounted) return <>{children}</>
  return <>{children}</>
}
