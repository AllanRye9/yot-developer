'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Code2, Play, Cpu, Trophy, User, Search,
  Palette, FlaskConical, Shield, FileCode2,
  Menu, X, ChevronRight,
} from 'lucide-react'
import { themes, getThemeById, getThemeCSSVars, defaultTheme } from '@/lib/themes'

const STORAGE_KEY = 'yot-theme'

export default function Navigation() {
  const pathname = usePathname()
  const [themeOpen, setThemeOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeThemeId, setActiveThemeId] = useState(defaultTheme.id)
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setActiveThemeId(saved)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

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
    { href: '/devtools-test', label: 'DevTools', icon: FlaskConical },
    { href: '/code-analyzer', label: 'Analyzer', icon: FileCode2 },
    { href: '/site-tester', label: 'Security', icon: Shield },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
                <Cpu size={15} className="text-white" />
              </div>
              <span className="font-bold text-base text-white">
                <span className="text-[#6366f1]">YOT</span>
                <span className="hidden sm:inline"> Developer</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap ${
                    pathname === href
                      ? 'bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30'
                      : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden lg:inline">{label}</span>
                </motion.div>
              </Link>
            ))}

            {/* Theme picker */}
            <div ref={paletteRef} className="relative ml-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setThemeOpen(o => !o)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:text-white hover:bg-[#1e1e2e] transition-colors duration-150"
                title="Change theme"
                aria-label="Change color theme"
                aria-expanded={themeOpen}
              >
                <Palette size={14} />
                <span className="hidden lg:inline">Theme</span>
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

          {/* Mobile: hamburger button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e1e2e] transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen
                ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={18} /></motion.span>
                : <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={18} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0d0d14] border-l border-[#1e1e2e] flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-[#1e1e2e] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center">
                    <Cpu size={13} className="text-white" />
                  </div>
                  <span className="font-bold text-sm text-white"><span className="text-[#6366f1]">YOT</span> Developer</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e1e2e] transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link href={href}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === href
                          ? 'bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30'
                          : 'text-[#94a3b8] hover:text-white hover:bg-[#1e1e2e]'
                      }`}>
                        <Icon size={17} />
                        <span>{label}</span>
                        {pathname === href && <ChevronRight size={14} className="ml-auto" />}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Theme section in drawer */}
              <div className="shrink-0 border-t border-[#1e1e2e] px-4 py-4">
                <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Palette size={12} /> Color Theme
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => applyTheme(theme.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                        activeThemeId === theme.id
                          ? 'bg-[#1e1e2e] text-white ring-1 ring-[#6366f1]/40'
                          : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border"
                        style={{
                          background: theme.swatchColor,
                          borderColor: activeThemeId === theme.id ? theme.swatchColor : 'transparent',
                        }}
                      />
                      <span className="truncate">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
