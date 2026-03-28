'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Lock, UserPlus, User, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import {
  loginAdmin,
  registerAdmin,
  setAdminSession,
  getAdminSession,
  logoutAdmin,
} from '@/lib/admin-auth'

interface AdminAuthProps {
  children: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [session, setSession] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<'login' | 'register'>('login')

  // Login form state
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginShowPass, setLoginShowPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register form state
  const [regUser, setRegUser] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regShowPass, setRegShowPass] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
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
      setRegSuccess('Account created! You can now log in.')
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

  if (session) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-[#64748b]">
            <ShieldCheck size={14} className="text-[#6366f1]" />
            <span>Logged in as <span className="text-[#e2e8f0] font-medium">{session}</span></span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:text-white hover:bg-[#1e1e2e] transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <Lock size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="text-xs text-[#64748b]">YOT Developer Platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0a0a0f] rounded-lg p-1 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t ? 'bg-[#6366f1] text-white' : 'text-[#64748b] hover:text-white'
              }`}
            >
              {t === 'login' ? <User size={14} /> : <UserPlus size={14} />}
              {t === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">Username</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={loginShowPass ? 'text' : 'password'}
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
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
                className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>
              <p className="text-xs text-center text-[#64748b]">
                First login: use the credentials shown in the username/password placeholders.
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">Username</label>
                <input
                  type="text"
                  value={regUser}
                  onChange={e => setRegUser(e.target.value)}
                  placeholder="new_admin"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={regShowPass ? 'text' : 'password'}
                    value={regPass}
                    onChange={e => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
                  >
                    {regShowPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#64748b] mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#6366f1] transition-colors"
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
                className="w-full bg-[#6366f1] hover:bg-[#5558e8] disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {regLoading ? 'Creating…' : 'Create Account'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
