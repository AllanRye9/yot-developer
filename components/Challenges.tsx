'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Lock, CheckCircle, Play, Lightbulb, Eye, Zap, Target, Award, Download, X } from 'lucide-react'
import { challenges, badges, type Challenge, type DifficultyLevel } from '@/lib/challenges-data'
import { trackFeatureUsage } from '@/lib/analytics'

const STORAGE_KEY = 'yot-challenge-progress'

interface Progress {
  completed: string[]
  xp: number
}

const loadProgress = (): Progress => {
  if (typeof window === 'undefined') return { completed: [], xp: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { completed: [], xp: 0 }
  } catch {
    return { completed: [], xp: 0 }
  }
}

const saveProgress = (p: Progress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

const runCode = (code: string): string[] => {
  const outputs: string[] = []
  const mockConsole = {
    log: (...args: unknown[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
    error: (...args: unknown[]) => outputs.push('ERROR: ' + args.map(a => String(a)).join(' ')),
    warn: (...args: unknown[]) => outputs.push('WARN: ' + args.map(a => String(a)).join(' ')),
    table: (data: unknown) => outputs.push('TABLE:\n' + JSON.stringify(data, null, 2)),
    time: (label: string) => outputs.push(`timer "${label}" started`),
    timeEnd: (label: string) => outputs.push(`timer "${label}": ~2.34ms`),
    group: (label: string) => outputs.push(`▶ ${label}`),
    groupEnd: () => outputs.push('◀ end group'),
    groupCollapsed: (label: string) => outputs.push(`▶ (collapsed) ${label}`),
    assert: (cond: boolean, ...args: unknown[]) => { if (!cond) outputs.push('Assertion failed: ' + args.join(' ')) },
    count: (label = 'default') => outputs.push(`${label}: 1`),
    countReset: (label = 'default') => outputs.push(`${label} reset`),
    trace: (...args: unknown[]) => outputs.push('Trace: ' + args.join(' ') + '\n  at outer\n  at middle\n  at inner'),
    clear: () => outputs.push('[Console cleared]'),
    info: (...args: unknown[]) => outputs.push('INFO: ' + args.map(a => String(a)).join(' ')),
  }
  const mockPerformance = {
    mark: (name: string) => outputs.push(`performance.mark("${name}")`),
    measure: (name: string, start: string, end: string) => outputs.push(`performance.measure("${name}", "${start}", "${end}")`),
    getEntriesByName: (name: string) => [{ name, duration: 1.23 }],
  }
  try {
    const fn = new Function('console', 'performance', code)
    fn(mockConsole, mockPerformance)
  } catch (e) {
    outputs.push('Error: ' + (e as Error).message)
  }
  return outputs
}

const difficultyColors: Record<DifficultyLevel, string> = {
  Beginner: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
  Intermediate: 'text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/30',
  Advanced: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30',
}

const LEVEL_XP = 500

function ChallengeCard({ challenge, isCompleted, isLocked, onSelect }: {
  challenge: Challenge; isCompleted: boolean; isLocked: boolean; onSelect: () => void
}) {
  return (
    <motion.div
      whileHover={!isLocked ? { y: -2, scale: 1.01 } : {}}
      onClick={!isLocked ? onSelect : undefined}
      className={`relative bg-[var(--color-card)] border rounded-xl p-5 cursor-pointer transition-colors ${
        isLocked ? 'opacity-50 cursor-not-allowed border-[var(--color-border)]' :
        isCompleted ? 'border-[#10b981]/40 hover:border-[#10b981]/70' :
        'border-[var(--color-border)] hover:border-[#6366f1]/50'
      }`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={18} className="text-[#10b981]" />
        </div>
      )}
      {isLocked && (
        <div className="absolute top-3 right-3">
          <Lock size={16} className="text-[var(--foreground-muted)]" />
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isCompleted ? 'bg-[#10b981]/20' : 'bg-[#6366f1]/10'
        }`}>
          {isCompleted ? <Star size={16} className="text-[#10b981]" /> : <Target size={16} className="text-[#6366f1]" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug">{challenge.title}</h3>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-2">{challenge.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#f59e0b]">
          <Zap size={10} />{challenge.xpReward} XP
        </span>
        <span className="text-xs text-[var(--foreground-muted)] capitalize">{challenge.category}</span>
      </div>
    </motion.div>
  )
}

// ─── Certificate Modal ────────────────────────────────────────────────────────

function CertificateModal({ challenge, onClose }: { challenge: Challenge; onClose: () => void }) {
  const certRef = useRef<HTMLDivElement>(null)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  const handlePrint = () => {
    if (!certRef.current) return
    const safeTitle = escapeHtml(challenge.title)
    const content = certRef.current.innerHTML
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Certificate &#8211; ${safeTitle}</title>
    <style>
      body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #1a1a2e; }
    </style></head><body>${content}</body></html>`)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl"
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>

        {/* Certificate */}
        <div ref={certRef}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0d0d1a 0%, #12122a 50%, #0d0d1a 100%)',
              border: '3px solid #6366f1',
              borderRadius: 16,
              padding: '48px 56px',
              textAlign: 'center',
              boxShadow: '0 0 60px rgba(99,102,241,0.3), inset 0 0 60px rgba(99,102,241,0.05)',
              fontFamily: "'Georgia', serif",
            }}
          >
            {/* Top decoration */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
              ))}
            </div>

            {/* Badge icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
                <span style={{ fontSize: 32 }}>🏆</span>
              </div>
            </div>

            <p style={{ color: '#a5b4fc', fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>
              Certificate of Achievement
            </p>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 20 }}>This certifies that</p>
            <p style={{ color: '#e2e8f0', fontSize: 28, fontWeight: 'bold', margin: '8px 0 20px', letterSpacing: '0.05em' }}>
              YOT Developer
            </p>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>
              has successfully completed the challenge
            </p>
            <p style={{ color: '#6366f1', fontSize: 22, fontWeight: 'bold', margin: '12px 0', padding: '8px 24px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'inline-block', border: '1px solid rgba(99,102,241,0.3)' }}>
              {challenge.title}
            </p>
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 8, marginBottom: 24 }}>
              Difficulty: <span style={{ color: challenge.difficulty === 'Advanced' ? '#f59e0b' : challenge.difficulty === 'Intermediate' ? '#6366f1' : '#10b981', fontWeight: 'bold' }}>{challenge.difficulty}</span>
              &nbsp;·&nbsp; XP Earned: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>+{challenge.xpReward}</span>
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #6366f1, transparent)', margin: '20px 0' }} />

            <p style={{ color: '#475569', fontSize: 12, marginTop: 16 }}>
              Issued on {today} · YOT Developer Platform
            </p>

            {/* Bottom stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#f59e0b', fontSize: 18 }}>★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5457e5] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={14} /> Print / Save Certificate
          </motion.button>
          <button onClick={onClose} className="px-5 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--foreground-muted)] rounded-lg text-sm hover:text-white transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}


function ChallengeModal({ challenge, isCompleted, onClose, onComplete }: {
  challenge: Challenge; isCompleted: boolean; onClose: () => void; onComplete: () => void
}) {
  const [code, setCode] = useState(challenge.startingCode)
  const [outputs, setOutputs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [passed, setPassed] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const checkSolution = useCallback((userCode: string): boolean => {
    return challenge.expectedKeywords.every(kw => userCode.includes(kw))
  }, [challenge.expectedKeywords])

  const handleRun = async () => {
    setIsRunning(true); setAttempted(true)
    trackFeatureUsage('Challenges')
    await new Promise(r => setTimeout(r, 300))
    const result = runCode(code)
    setOutputs(result)
    const success = checkSolution(code)
    setPassed(success)
    if (success && !isCompleted) onComplete()
    setIsRunning(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-4xl bg-[var(--color-bg)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border)] bg-[var(--color-card)]">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
          <h2 className="text-sm sm:text-lg font-bold text-[var(--foreground)] flex-1 min-w-0 truncate">{challenge.title}</h2>
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <span className="flex items-center gap-1 text-sm text-[#f59e0b]"><Zap size={12} />{challenge.xpReward} XP</span>
            <button onClick={onClose} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xl leading-none w-7 h-7 flex items-center justify-center">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Description */}
            <p className="text-[#94a3b8] text-sm leading-relaxed">{challenge.description}</p>

            {/* Hint / Solution toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] hover:brightness-125 text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs rounded-lg transition-colors"
              >
                <Lightbulb size={12} />{showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {(attempted || isCompleted) && (
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] hover:brightness-125 text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs rounded-lg transition-colors"
                >
                  <Eye size={12} />{showSolution ? 'Hide Solution' : 'View Solution'}
                </button>
              )}
            </div>
            <AnimatePresence>
              {showHint && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg px-4 py-3 text-sm text-[#fbbf24]">
                  💡 {challenge.hint}
                </motion.div>
              )}
              {showSolution && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg px-4 py-3 font-mono text-sm text-[#6ee7b7] whitespace-pre-wrap">
                  {challenge.solution}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <span className="text-xs text-[var(--foreground-muted)] font-mono">editor.js</span>
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  onKeyDown={e => {
                    if (e.key === 'Tab') {
                      e.preventDefault()
                      const s = e.currentTarget.selectionStart
                      setCode(code.substring(0, s) + '  ' + code.substring(e.currentTarget.selectionEnd))
                      requestAnimationFrame(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s + 2 })
                    }
                  }}
                  className="flex-1 resize-none p-4 bg-[var(--color-bg)] text-[var(--foreground)] font-mono text-sm leading-relaxed focus:outline-none min-h-[200px]"
                />
              </div>
              <div className="flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <span className="text-xs text-[var(--foreground-muted)] font-mono">Output</span>
                  {attempted && (
                    <span className={`ml-auto text-xs font-medium ${passed ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {passed ? '✓ Passed!' : '✗ Not quite…'}
                    </span>
                  )}
                </div>
                <div className="flex-1 p-4 font-mono text-sm space-y-1 overflow-y-auto min-h-[200px]">
                  {isRunning
                    ? <div className="text-[#6366f1] animate-pulse">Executing…</div>
                    : outputs.length > 0
                      ? outputs.map((line, i) => (
                        <div key={i} className={`whitespace-pre-wrap break-all ${
                          line.startsWith('ERROR:') ? 'text-[#ef4444]' :
                          line.startsWith('WARN:') ? 'text-yellow-400' :
                          line.startsWith('TABLE:') ? 'text-[#06b6d4]' :
                          line.startsWith('Trace:') ? 'text-[#8b5cf6]' : 'text-[var(--foreground)]'
                        }`}>{line}</div>
                      ))
                      : <div className="text-[var(--foreground-muted)]">Run your code to see output</div>
                  }
                </div>
              </div>
            </div>

            {/* Run button */}
            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleRun} disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5457e5] disabled:opacity-50 text-[var(--foreground)] rounded-lg font-medium transition-colors text-sm"
              >
                <Play size={14} />{isRunning ? 'Running…' : 'Run & Check'}
              </motion.button>
              {(isCompleted || passed) && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] rounded-lg text-sm font-medium">
                  <CheckCircle size={14} />Challenge Complete!
                </motion.div>
              )}
              {(isCompleted || passed) && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCertificate(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] hover:bg-[#f59e0b]/20 rounded-lg text-sm font-medium transition-colors"
                >
                  <Award size={14} />Get Certificate
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Certificate overlay */}
      <AnimatePresence>
        {showCertificate && (
          <CertificateModal challenge={challenge} onClose={() => setShowCertificate(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Challenges({ username: _username, displayName: _displayName }: { username?: string; displayName?: string }) {
  // username and displayName are reserved for future personalised greeting / progress-tracking features
  const [progress, setProgress] = useState<Progress>({ completed: [], xp: 0 })
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [filter, setFilter] = useState<DifficultyLevel | 'All'>('All')
  const [justEarned, setJustEarned] = useState<string | null>(null)

  useEffect(() => { setProgress(loadProgress()) }, [])

  const handleComplete = useCallback((challenge: Challenge) => {
    setProgress(prev => {
      if (prev.completed.includes(challenge.id)) return prev
      trackFeatureUsage('Challenge Completed')
      const next: Progress = {
        completed: [...prev.completed, challenge.id],
        xp: prev.xp + challenge.xpReward,
      }
      saveProgress(next)
      return next
    })
  }, [])

  const filtered = filter === 'All' ? challenges : challenges.filter(c => c.difficulty === filter)
  const level = Math.max(1, Math.floor(progress.xp / LEVEL_XP) + 1)
  const xpToNext = LEVEL_XP - (progress.xp % LEVEL_XP)

  const byCategory = progress.completed.reduce<Record<string, number>>((acc, id) => {
    const ch = challenges.find(c => c.id === id)
    if (ch) acc[ch.category] = (acc[ch.category] ?? 0) + 1
    return acc
  }, {})
  const hasAdvanced = progress.completed.some(id => challenges.find(c => c.id === id)?.difficulty === 'Advanced')
  const earnedBadges = badges.filter(b => b.condition(progress.completed.length, byCategory, progress.xp, hasAdvanced))

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Level', value: level, icon: '🏅', color: '#6366f1' },
          { label: 'Total XP', value: `${progress.xp} XP`, icon: '⚡', color: '#f59e0b' },
          { label: 'Completed', value: `${progress.completed.length}/${challenges.length}`, icon: '✅', color: '#10b981' },
          { label: 'Badges', value: `${earnedBadges.length}/${badges.length}`, icon: '🏆', color: '#8b5cf6' },
        ].map(({ label, value, icon, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xl font-bold text-[var(--foreground)]" style={{ color }}>{value}</div>
            <div className="text-xs text-[var(--foreground-muted)]">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--foreground-muted)]">Level {level} Progress</span>
          <span className="text-[var(--foreground-muted)]">{xpToNext} XP to Level {level + 1}</span>
        </div>
        <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((LEVEL_XP - xpToNext) / LEVEL_XP) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
          />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Trophy size={16} className="text-[#f59e0b]" />Badges</h3>
        <div className="flex flex-wrap gap-3">
          {badges.map(badge => {
            const earned = earnedBadges.some(b => b.id === badge.id)
            return (
              <motion.div key={badge.id} whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  earned ? 'bg-[#6366f1]/10 border-[#6366f1]/40 text-[var(--foreground)]' : 'bg-[#1e1e2e]/50 border-[var(--color-border)] text-[var(--foreground-muted)] opacity-50'
                }`}>
                <span className={earned ? '' : 'grayscale'}>{badge.icon}</span>
                <div>
                  <div className="font-medium text-xs">{badge.name}</div>
                  <div className="text-xs opacity-70">{badge.description}</div>
                </div>
                {earned && <CheckCircle size={12} className="text-[#10b981] ml-1" />}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Filter + Challenges grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-[var(--foreground-muted)]">Filter:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-[#6366f1] text-[var(--foreground)]' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge, idx) => (
            <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
              <ChallengeCard
                challenge={challenge}
                isCompleted={progress.completed.includes(challenge.id)}
                isLocked={false}
                onSelect={() => setSelectedChallenge(challenge)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {justEarned && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[var(--foreground)] px-5 py-3 rounded-2xl shadow-2xl shadow-[#6366f1]/40 text-sm font-semibold flex items-center gap-2 z-50 animate-pulse-glow"
          >
            <Trophy size={18} />{justEarned}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal
            challenge={selectedChallenge}
            isCompleted={progress.completed.includes(selectedChallenge.id)}
            onClose={() => setSelectedChallenge(null)}
            onComplete={() => {
              if (progress.completed.includes(selectedChallenge.id)) return
              const newCompleted = [...progress.completed, selectedChallenge.id]
              const newXp = progress.xp + selectedChallenge.xpReward
              const newByCategory = newCompleted.reduce<Record<string, number>>((acc, id) => {
                const ch = challenges.find(c => c.id === id)
                if (ch) acc[ch.category] = (acc[ch.category] ?? 0) + 1
                return acc
              }, {})
              const newHasAdvanced = newCompleted.some(id => challenges.find(c => c.id === id)?.difficulty === 'Advanced')
              const prevEarned = new Set(earnedBadges.map(b => b.id))
              const newEarned = badges.filter(b => b.condition(newCompleted.length, newByCategory, newXp, newHasAdvanced) && !prevEarned.has(b.id))
              handleComplete(selectedChallenge)
              if (newEarned.length > 0) {
                setJustEarned(`🏆 Badge unlocked: ${newEarned[0].name}!`)
              } else {
                setJustEarned(`+${selectedChallenge.xpReward} XP – ${selectedChallenge.title} complete!`)
              }
              setTimeout(() => setJustEarned(null), 3000)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
