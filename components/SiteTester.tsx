'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Info,
  Globe, Loader2, ClipboardCopy, ChevronDown, ChevronUp,
  Lock, Bug, Activity,
} from 'lucide-react'
import type { SiteTestResult, TestItem } from '@/app/api/site-test/route'

// ─── Types ──────────────────────────────────────────────────────────────────

type Category = 'security' | 'vulnerability' | 'general'
type ActiveTab = 'all' | Category

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusIcon(status: TestItem['status'], size = 16) {
  const props = { size, strokeWidth: 2 }
  if (status === 'pass') return <CheckCircle {...props} className="text-emerald-400 shrink-0" />
  if (status === 'fail') return <XCircle {...props} className="text-red-400 shrink-0" />
  if (status === 'warn') return <AlertTriangle {...props} className="text-amber-400 shrink-0" />
  return <Info {...props} className="text-sky-400 shrink-0" />
}

function statusBadge(status: TestItem['status']) {
  const map: Record<TestItem['status'], string> = {
    pass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    fail: 'bg-red-500/15 text-red-400 border-red-500/30',
    warn: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  }
  return (
    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${map[status]}`}>
      {status}
    </span>
  )
}

function categoryIcon(cat: Category, size = 14) {
  if (cat === 'security') return <Lock size={size} className="text-[#6366f1]" />
  if (cat === 'vulnerability') return <Bug size={size} className="text-amber-400" />
  return <Activity size={size} className="text-sky-400" />
}

function scoreSummary(tests: TestItem[]) {
  const pass = tests.filter(t => t.status === 'pass').length
  const fail = tests.filter(t => t.status === 'fail').length
  const warn = tests.filter(t => t.status === 'warn').length
  const total = tests.length
  const score = total > 0 ? Math.round(((pass + warn * 0.5) / total) * 100) : 0
  return { pass, fail, warn, total, score }
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

// ─── Console Logging ────────────────────────────────────────────────────────

function logResultsToConsole(result: SiteTestResult) {
  const { url, finalUrl, statusCode, responseTimeMs, tests } = result

  console.group('%c[YOT Site Tester] Results for ' + url, 'color:#6366f1;font-weight:bold;font-size:13px')
  console.log('%cFinal URL:%c ' + finalUrl, 'color:#94a3b8;font-weight:bold', 'color:#e2e8f0')
  console.log('%cStatus Code:%c ' + statusCode, 'color:#94a3b8;font-weight:bold', 'color:#e2e8f0')
  console.log('%cResponse Time:%c ' + responseTimeMs + 'ms', 'color:#94a3b8;font-weight:bold', 'color:#e2e8f0')

  const { pass, fail, warn, score } = scoreSummary(tests)
  console.log(
    '%cScore:%c %d/100  ✅ Pass: %d  ❌ Fail: %d  ⚠️ Warn: %d',
    'color:#94a3b8;font-weight:bold',
    score >= 80 ? 'color:#34d399;font-weight:bold' : score >= 50 ? 'color:#fbbf24;font-weight:bold' : 'color:#f87171;font-weight:bold',
    score, pass, fail, warn,
  )

  const categories: Category[] = ['security', 'vulnerability', 'general']
  categories.forEach(cat => {
    const catTests = tests.filter(t => t.category === cat)
    if (catTests.length === 0) return
    console.group(`%c${cat.toUpperCase()} (${catTests.length} checks)`, 'color:#8b5cf6;font-weight:bold')
    catTests.forEach(t => {
      const emoji = t.status === 'pass' ? '✅' : t.status === 'fail' ? '❌' : t.status === 'warn' ? '⚠️' : 'ℹ️'
      const color = t.status === 'pass' ? '#34d399' : t.status === 'fail' ? '#f87171' : t.status === 'warn' ? '#fbbf24' : '#38bdf8'
      console.log(`%c${emoji} ${t.name}%c  ${t.status.toUpperCase()}`, `color:${color};font-weight:bold`, 'color:#64748b')
      console.log('  %c' + t.detail, 'color:#94a3b8')
      if (t.tip) console.log('  %c💡 Tip: ' + t.tip, 'color:#818cf8')
    })
    console.groupEnd()
  })

  // Table view
  console.table(
    tests.map(t => ({
      Category: t.category,
      Check: t.name,
      Status: t.status.toUpperCase(),
      Detail: t.detail.slice(0, 80) + (t.detail.length > 80 ? '…' : ''),
    }))
  )

  console.groupEnd()
}

function buildLogText(result: SiteTestResult): string {
  const { url, finalUrl, statusCode, responseTimeMs, tests } = result
  const { pass, fail, warn, score } = scoreSummary(tests)
  const lines: string[] = [
    `[YOT Site Tester] Results for ${url}`,
    `Final URL:     ${finalUrl}`,
    `Status Code:   ${statusCode}`,
    `Response Time: ${responseTimeMs}ms`,
    `Score:         ${score}/100  ✅ ${pass}  ❌ ${fail}  ⚠️ ${warn}`,
    '',
  ]
  const categories: Category[] = ['security', 'vulnerability', 'general']
  categories.forEach(cat => {
    const catTests = tests.filter(t => t.category === cat)
    if (catTests.length === 0) return
    lines.push(`── ${cat.toUpperCase()} ──`)
    catTests.forEach(t => {
      const emoji = t.status === 'pass' ? '✅' : t.status === 'fail' ? '❌' : t.status === 'warn' ? '⚠️' : 'ℹ️'
      lines.push(`  ${emoji} ${t.name} [${t.status.toUpperCase()}]`)
      lines.push(`     ${t.detail}`)
      if (t.tip) lines.push(`     💡 ${t.tip}`)
    })
    lines.push('')
  })
  return lines.join('\n')
}

// ─── TestCard ────────────────────────────────────────────────────────────────

function TestCard({ test }: { test: TestItem }) {
  const [expanded, setExpanded] = useState(false)
  const hasTip = !!test.tip

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden"
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1a1a27] transition-colors"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {statusIcon(test.status)}
        <span className="flex-1 text-sm font-medium text-white">{test.name}</span>
        <div className="flex items-center gap-2">
          {categoryIcon(test.category)}
          {statusBadge(test.status)}
          {hasTip ? (
            expanded ? <ChevronUp size={14} className="text-[#64748b]" /> : <ChevronDown size={14} className="text-[#64748b]" />
          ) : null}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-[#1e1e2e] space-y-2">
              <p className="text-xs text-[#94a3b8] leading-relaxed">{test.detail}</p>
              {test.tip && (
                <div className="flex items-start gap-2 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg p-2.5">
                  <span className="text-base leading-none">💡</span>
                  <p className="text-xs text-[#a5b4fc] leading-relaxed">{test.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function SiteTester() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SiteTestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('all')
  const [copied, setCopied] = useState(false)
  const [copyFallbackText, setCopyFallbackText] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const runTests = async () => {
    const trimmed = url.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    setActiveTab('all')

    // Log start to console
    console.group('%c[YOT Site Tester] Starting tests for: ' + trimmed, 'color:#6366f1;font-weight:bold')
    console.log('%cRunning security, vulnerability, and general checks…', 'color:#94a3b8')
    console.groupEnd()

    try {
      const res = await fetch('/api/site-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })
      const data: SiteTestResult = await res.json()

      if (data.error && !data.tests?.length) {
        setError(data.error)
        console.error('[YOT Site Tester] Error:', data.error)
      } else {
        setResult(data)
        logResultsToConsole(data)
        if (data.error) setError(data.error) // partial result with error
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      console.error('[YOT Site Tester] Fetch error:', msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') runTests()
  }

  const copyLogs = async () => {
    if (!result) return
    const text = buildLogText(result)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — show log text in a modal for manual copying
      setCopyFallbackText(text)
    }
  }

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Globe size={13} /> },
    { id: 'security', label: 'Security', icon: <Lock size={13} /> },
    { id: 'vulnerability', label: 'Vulnerability', icon: <Bug size={13} /> },
    { id: 'general', label: 'General', icon: <Activity size={13} /> },
  ]

  const visibleTests = result
    ? activeTab === 'all'
      ? result.tests
      : result.tests.filter(t => t.category === activeTab)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <Shield size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Site Tester</h1>
        </div>
        <p className="text-sm text-[#64748b] ml-11">
          Test any public URL for security headers, vulnerabilities, and general best practices.
          Results are logged to your browser&apos;s DevTools console.
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
        <label htmlFor="site-url" className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
          Target URL
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              id="site-url"
              ref={inputRef}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-[#3d3d52] focus:outline-none focus:border-[#6366f1] transition-colors"
              disabled={loading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runTests}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5254cc] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-[#6366f1]/25"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Testing…
              </>
            ) : (
              <>
                <Shield size={14} />
                Run Tests
              </>
            )}
          </motion.button>
        </div>
        <p className="text-[11px] text-[#3d3d52]">
          Enter any public URL. Tests run server-side and results are also printed to the browser DevTools console.
        </p>
      </div>

      {/* Loading indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 flex flex-col items-center gap-3"
          >
            <Loader2 size={28} className="animate-spin text-[#6366f1]" />
            <p className="text-sm text-[#94a3b8] font-medium">Running security, vulnerability &amp; general tests…</p>
            <p className="text-xs text-[#3d3d52]">This may take up to 15 seconds depending on the target site.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
          >
            <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Test Error</p>
              <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Summary card */}
            {(() => {
              const { pass, fail, warn, total, score } = scoreSummary(result.tests)
              return (
                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-1">Site Score</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</span>
                        <span className="text-sm text-[#64748b]">/ 100</span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {result.finalUrl !== result.url && (
                          <span>Redirected to <span className="text-[#94a3b8]">{result.finalUrl}</span> · </span>
                        )}
                        HTTP {result.statusCode} · {result.responseTimeMs}ms
                      </p>
                    </div>
                    <div className="flex gap-4">
                      {[
                        { label: 'Pass', count: pass, color: 'text-emerald-400' },
                        { label: 'Fail', count: fail, color: 'text-red-400' },
                        { label: 'Warn', count: warn, color: 'text-amber-400' },
                        { label: 'Total', count: total, color: 'text-[#94a3b8]' },
                      ].map(({ label, count, color }) => (
                        <div key={label} className="text-center">
                          <p className={`text-xl font-bold ${color}`}>{count}</p>
                          <p className="text-[10px] text-[#64748b] uppercase">{label}</p>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={copyLogs}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-[#94a3b8] hover:text-white text-xs font-medium rounded-lg transition-colors border border-[#2a2a3e]"
                      title="Copy logs to clipboard"
                    >
                      <ClipboardCopy size={13} />
                      {copied ? 'Copied!' : 'Copy Logs'}
                    </motion.button>
                  </div>
                </div>
              )
            })()}

            {/* Tabs */}
            <div className="flex gap-1 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-1">
              {tabs.map(tab => {
                const count = tab.id === 'all'
                  ? result.tests.length
                  : result.tests.filter(t => t.category === tab.id).length
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#6366f1] text-white'
                        : 'text-[#64748b] hover:text-white hover:bg-[#1e1e2e]'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className={`text-[10px] px-1 rounded ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#1e1e2e]'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Test cards */}
            <div className="space-y-2">
              {visibleTests.length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">No tests in this category.</p>
              ) : (
                visibleTests.map(test => <TestCard key={test.id} test={test} />)
              )}
            </div>

            {/* Console hint */}
            <div className="flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg px-3 py-2.5">
              <Info size={13} className="text-[#818cf8] shrink-0" />
              <p className="text-xs text-[#818cf8]">
                Full results with tips are also printed to your browser DevTools console (F12 → Console).
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clipboard fallback modal */}
      <AnimatePresence>
        {copyFallbackText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setCopyFallbackText(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 w-full max-w-2xl max-h-[70vh] flex flex-col gap-3 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Copy Logs</p>
                <button
                  onClick={() => setCopyFallbackText(null)}
                  className="text-xs text-[#64748b] hover:text-white transition-colors"
                >
                  ✕ Close
                </button>
              </div>
              <p className="text-xs text-[#64748b]">Select all text below and copy it manually (Ctrl+A, Ctrl+C).</p>
              <textarea
                readOnly
                value={copyFallbackText}
                className="flex-1 min-h-[40vh] bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-[#94a3b8] font-mono resize-none focus:outline-none focus:border-[#6366f1]"
                onFocus={e => e.target.select()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
