'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { setAdminSession, getAdminSession, logoutAdmin } from '@/lib/admin-auth'

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [session, setSession] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  // Login form state
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginShowPass, setLoginShowPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    setSession(getAdminSession())
    setReady(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser.trim(), password: loginPass }),
      })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.ok) {
        setAdminSession(loginUser.trim())
        setSession(loginUser.trim())
      } else {
        setLoginError(data.error ?? 'Invalid username or password')
      }
    } catch {
      setLoginError('Network error — please try again')
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    logoutAdmin()
    setSession(null)
  }

  if (!ready) return null

  // ── Authenticated: show the admin dashboard (children) ──────────────────
  if (session) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <ShieldCheck size={14} className="text-[#6366f1]" />
            <span>
              Signed in as{' '}
              <span className="text-[var(--foreground)] font-semibold">{session}</span>
              <span className="ml-2 text-[10px] bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 rounded px-1.5 py-0.5 uppercase tracking-widest font-semibold">
                superadmin
              </span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--foreground-muted)] hover:text-white hover:bg-[#1e1e2e] border border-[var(--color-border)] transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
        {children}
      </div>
    )
  }

  // ── Unauthenticated: show login form ────────────────────────────────────
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl shadow-black/40"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366f1]/40">
            <Lock size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Admin Sign In</h1>
            <p className="text-xs text-[var(--foreground-muted)]">YOT Developer Platform</p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              placeholder="admin username"
              required
              autoFocus
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={loginShowPass ? 'text' : 'password'}
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 pr-10 text-sm text-[var(--foreground)] placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
              />
              <button
                type="button"
                onClick={() => setLoginShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-white transition-colors"
              >
                {loginShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          {loginError && (
            <p className="text-xs text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  )
}
