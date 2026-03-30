'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, CheckCircle, Star, Activity, BarChart2, Target } from 'lucide-react'
import { challenges, badges } from '@/lib/challenges-data'

const STORAGE_KEY = 'yot-challenge-progress'
const LEVEL_XP = 500

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

export default function Dashboard() {
  const [progress, setProgress] = useState<Progress>({ completed: [], xp: 0 })

  useEffect(() => { setProgress(loadProgress()) }, [])

  const level = Math.max(1, Math.floor(progress.xp / LEVEL_XP) + 1)
  const xpInLevel = progress.xp % LEVEL_XP
  const xpToNext = LEVEL_XP - xpInLevel

  const byCategory = progress.completed.reduce<Record<string, number>>((acc, id) => {
    const ch = challenges.find(c => c.id === id)
    if (ch) acc[ch.category] = (acc[ch.category] ?? 0) + 1
    return acc
  }, {})

  const byDifficulty = progress.completed.reduce<Record<string, number>>((acc, id) => {
    const ch = challenges.find(c => c.id === id)
    if (ch) acc[ch.difficulty] = (acc[ch.difficulty] ?? 0) + 1
    return acc
  }, {})

  const hasAdvanced = progress.completed.some(id => challenges.find(c => c.id === id)?.difficulty === 'Advanced')
  const earnedBadges = badges.filter(b => b.condition(progress.completed.length, byCategory, progress.xp, hasAdvanced))

  const completedChallenges = progress.completed.map(id => challenges.find(c => c.id === id)).filter(Boolean)

  const categories = [...new Set(challenges.map(c => c.category))]
  const categoryProgress = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    completed: byCategory[cat] ?? 0,
    total: challenges.filter(c => c.category === cat).length,
  }))

  const recommended = challenges
    .filter(c => !progress.completed.includes(c.id))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-2xl font-bold text-[var(--foreground)] shadow-lg shadow-[#6366f1]/30">
          {level}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Level {level} Developer</h2>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-sm text-[#f59e0b]"><Zap size={13} />{progress.xp} XP total</span>
            <span className="flex items-center gap-1 text-sm text-[#10b981]"><CheckCircle size={13} />{progress.completed.length} challenges done</span>
            <span className="flex items-center gap-1 text-sm text-[#8b5cf6]"><Trophy size={13} />{earnedBadges.length} badges</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-[var(--foreground-muted)] mb-1">
              <span>Progress to Level {level + 1}</span>
              <span>{xpInLevel} / {LEVEL_XP} XP</span>
            </div>
            <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden w-full sm:w-64">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / LEVEL_XP) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
              />
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">{xpToNext} XP until next level</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-5 flex items-center gap-2"><BarChart2 size={16} className="text-[#6366f1]" />Category Progress</h3>
          <div className="space-y-4">
            {categoryProgress.map(({ name, completed, total }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--foreground)] font-medium capitalize">{name}</span>
                  <span className="text-[var(--foreground-muted)]">{completed}/{total}</span>
                </div>
                <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-5 flex items-center gap-2"><Star size={16} className="text-[#f59e0b]" />By Difficulty</h3>
          <div className="space-y-3">
            {[
              { label: 'Beginner', color: '#10b981', total: challenges.filter(c => c.difficulty === 'Beginner').length },
              { label: 'Intermediate', color: '#6366f1', total: challenges.filter(c => c.difficulty === 'Intermediate').length },
              { label: 'Advanced', color: '#f59e0b', total: challenges.filter(c => c.difficulty === 'Advanced').length },
            ].map(({ label, color, total }) => {
              const done = byDifficulty[label] ?? 0
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-[var(--foreground)]">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-[#1e1e2e] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(done / total) * 100}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)] w-8 text-right">{done}/{total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Trophy size={16} className="text-[#f59e0b]" />Badges ({earnedBadges.length}/{badges.length})</h3>
        <div className="flex flex-wrap gap-3">
          {badges.map(badge => {
            const earned = earnedBadges.some(b => b.id === badge.id)
            return (
              <div key={badge.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                earned ? 'bg-[#6366f1]/10 border-[#6366f1]/40 text-[var(--foreground)]' : 'bg-[#1e1e2e]/40 border-[var(--color-border)] text-[var(--foreground-muted)] opacity-50'
              }`}>
                <span className={earned ? '' : 'grayscale'}>{badge.icon}</span>
                <div>
                  <div className="font-medium text-xs">{badge.name}</div>
                  <div className="text-xs opacity-60">{badge.description}</div>
                </div>
                {earned && <CheckCircle size={11} className="text-[#10b981]" />}
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent completions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Activity size={16} className="text-[#06b6d4]" />Completed Challenges</h3>
          {completedChallenges.length === 0
            ? <p className="text-[var(--foreground-muted)] text-sm">No challenges completed yet. Head to the Challenges page to get started!</p>
            : (
              <div className="space-y-2">
                {completedChallenges.slice().reverse().slice(0, 6).map((ch) => ch && (
                  <div key={ch.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)]/50 last:border-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#10b981]" />
                      <span className="text-sm text-[var(--foreground)]">{ch.title}</span>
                    </div>
                    <span className="text-xs text-[#f59e0b] flex items-center gap-0.5"><Zap size={10} />{ch.xpReward}</span>
                  </div>
                ))}
              </div>
            )}
        </motion.div>

        {/* Recommended */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Target size={16} className="text-[#8b5cf6]" />Recommended Next</h3>
          {recommended.length === 0
            ? <p className="text-[#10b981] text-sm font-medium">🎉 You&apos;ve completed all challenges!</p>
            : (
              <div className="space-y-3">
                {recommended.map(ch => (
                  <div key={ch.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{ch.title}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">{ch.difficulty} · {ch.category}</p>
                    </div>
                    <span className="text-xs text-[#f59e0b] flex items-center gap-0.5 flex-shrink-0"><Zap size={10} />{ch.xpReward} XP</span>
                  </div>
                ))}
              </div>
            )}
        </motion.div>
      </div>
    </div>
  )
}
