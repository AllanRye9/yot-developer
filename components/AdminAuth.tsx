'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Lock, UserPlus, User, Eye, EyeOff, ShieldCheck, ShieldAlert } from 'lucide-react'
import {
  loginAdmin,
  registerAdmin,
  setAdminSession,
  getAdminSession,
  logoutAdmin,
  hasAdmin,
} from '@/lib/admin-auth'

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [session, setSession] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  // 'login' is shown when an admin account exists; 'register' when it doesn't
  const [tab, setTab] = useState<'login' | 'register'>('login')

  // Login form state
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginShowPass, setLoginShowPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register form state (first-time setup only)
  const [regUser, setRegUser] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regShowPass, setRegShowPass] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    const exists = hasAdmin()
    setAdminExists(exists)
    // If no admin registered yet, land on the Register tab
    setTab(exists ? 'login' : 'register')
    setSession(getAdminSession())
    setReady(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    await new Promise(r => setTimeout(r, 300))
    if (loginAdmin(loginUser.trim(), loginPass)) {
      setAdminSession(loginUser.trim())
      setSession(loginUser.trim())
    } else {
      setLoginError('Invalid username or password')
    }
    setLoginLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    setRegSuccess('')
    if (regPass !== regConfirm) {
      setRegError('Passwords do not match')
      return
    }
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const result = registerAdmin(regUser.trim(), regPass)
    if (result.success) {
      setRegSuccess('Admin account created! Please sign in.')
      setAdminExists(true)
      setRegUser('')
      setRegPass('')
      setRegConfirm('')
      setTimeout(() => setTab('login'), 1500)
    } else {
      setRegError(result.error ?? 'Registration failed')
    }
    setRegLoading(false)
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

  // ── Unauthenticated: show login / first-time-setup form ─────────────────
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
            {adminExists ? <Lock size={22} className="text-white" /> : <ShieldAlert size={22} className="text-white" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              {adminExists ? 'Admin Sign In' : 'Admin Setup'}
            </h1>
            <p className="text-xs text-[var(--foreground-muted)]">YOT Developer Platform</p>
          </div>
        </div>

        {/* Tabs – only show both tabs before an admin exists */}
        {!adminExists && (
          <div className="flex gap-1 bg-[var(--color-bg)] rounded-lg p-1 mb-6">
            {(['register', 'login'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t
                    ? 'bg-[#6366f1] text-white'
                    : 'text-[var(--foreground-muted)] hover:text-white'
                }`}
              >
                {t === 'login' ? <User size={14} /> : <UserPlus size={14} />}
                {t === 'login' ? 'Login' : 'First-time Setup'}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Login form ── */}
          {(tab === 'login' || adminExists) && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: adminExists ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
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
          )}

          {/* ── First-time Register form (shown only when no admin exists) ── */}
          {tab === 'register' && !adminExists && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <p
                role="status"
                aria-live="polite"
                className="text-xs text-[var(--foreground-muted)] bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg px-3 py-2"
              >
                No admin account exists yet. The first person to register will become the sole
                superadmin.
              </p>
              <div>
                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={regUser}
                  onChange={e => setRegUser(e.target.value)}
                  placeholder="Choose a username"
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
                    type={regShowPass ? 'text' : 'password'}
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 pr-10 text-sm text-[var(--foreground)] placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] hover:text-white transition-colors"
                  >
                    {regShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>
              {regError && (
                <p className="text-xs text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2">
                  {regError}
                </p>
              )}
              {regSuccess && (
                <p className="text-xs text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-3 py-2">
                  {regSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {regLoading ? 'Creating account…' : 'Create Admin Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
