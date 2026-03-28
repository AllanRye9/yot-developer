'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Code2, Play, Cpu, Trophy, User, Search,
  Palette, FlaskConical, Shield,
} from 'lucide-react'
import { themes, getThemeById, getThemeCSSVars, defaultTheme } from '@/lib/themes'

const STORAGE_KEY = 'yot-theme'

export default function Navigation() {
  const pathname = usePathname()
  const [themeOpen, setThemeOpen] = useState(false)
  const [activeThemeId, setActiveThemeId] = useState(defaultTheme.id)
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setActiveThemeId(saved)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const applyTheme = (id: string) => {
    const theme = getThemeById(id)
    const vars = getThemeCSSVars(theme)
    const root = document.documentElement
    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value))
    localStorage.setItem(STORAGE_KEY, id)
    setActiveThemeId(id)
    setThemeOpen(false)
  }

  const links = [
    { href: '/', label: 'Explorer', icon: Code2 },
    { href: '/playground', label: 'Playground', icon: Play },
    { href: '/challenges', label: 'Challenges', icon: Trophy },
    { href: '/inspector', label: 'Inspector', icon: Search },
    { href: '/dashboard', label: 'Dashboard', icon: User },
    { href: '/devtools-test', label: 'DevTools Test', icon: FlaskConical },
    { href: '/site-tester', label: 'Site Tester', icon: Shield },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
              <Cpu size={15} className="text-white" />
            </div>
            <span className="font-bold text-base text-white hidden sm:inline">
              <span className="text-[#6366f1]">YOT</span> Developer
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  pathname === href
                    ? 'bg-[#6366f1] text-white'
                    : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </motion.div>
            </Link>
          ))}

          {/* Theme picker */}
          <div ref={paletteRef} className="relative ml-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setThemeOpen(o => !o)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:text-white hover:bg-[#1e1e2e] transition-colors"
              title="Change theme"
              aria-label="Change color theme"
              aria-expanded={themeOpen}
            >
              <Palette size={14} />
              <span className="hidden sm:inline">Theme</span>
            </motion.button>

            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3 shadow-xl shadow-black/50 min-w-[160px] z-50"
                >
                  <p className="text-xs text-[#64748b] font-medium mb-2 px-1">Color Theme</p>
                  <div className="space-y-1">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => applyTheme(theme.id)}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                          activeThemeId === theme.id
                            ? 'bg-[#1e1e2e] text-white'
                            : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 border-2"
                          style={{
                            background: theme.swatchColor,
                            borderColor: activeThemeId === theme.id ? theme.swatchColor : 'transparent',
                            boxShadow: activeThemeId === theme.id ? `0 0 6px ${theme.swatchColor}80` : 'none',
                          }}
                        />
                        {theme.name}
                        {activeThemeId === theme.id && (
                          <span className="ml-auto text-[10px] text-[#64748b]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}
