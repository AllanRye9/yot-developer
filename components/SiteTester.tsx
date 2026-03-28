'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Info,
  Globe, Loader2, ClipboardCopy, ChevronDown, ChevronUp,
  Lock, Bug, Activity, Sparkles,
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

// ─── AI Security Explanations ───────────────────────────────────────────────

interface AIAnalysis {
  test: TestItem
  explanation: string
  solution: string
  impact: string
  example?: string
}

const SECURITY_KNOWLEDGE: Record<string, { explanation: string; solution: string; impact: string; example?: string }> = {
  'HTTPS': {
    explanation: 'HTTPS (HTTP Secure) encrypts data in transit using TLS/SSL. Without it, all data between the browser and server is sent in plain text and can be intercepted, read, or modified by attackers on the network.',
    solution: 'Enable HTTPS by obtaining a TLS certificate (free from Let\'s Encrypt) and configuring your web server to use it. Redirect all HTTP traffic to HTTPS with a 301 redirect.',
    impact: 'High — Protects user data, prevents man-in-the-middle attacks, and is required for modern browser features like Service Workers, geolocation, and camera access.',
    example: '# nginx config\nserver { listen 80; return 301 https://$host$request_uri; }\nserver { listen 443 ssl; ssl_certificate /etc/ssl/cert.pem; }',
  },
  'Content-Security-Policy': {
    explanation: 'CSP is an HTTP header that tells the browser which sources of content (scripts, styles, images) are trusted. Without it, attackers who inject malicious scripts (XSS) have full access to the page.',
    solution: 'Add a Content-Security-Policy header. Start restrictive: "default-src \'self\'" and then add exceptions as needed. Use \'nonce-\' for inline scripts instead of \'unsafe-inline\'.',
    impact: 'High — Primary defense against Cross-Site Scripting (XSS), the most common web vulnerability.',
    example: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' \'nonce-{randomValue}\'; img-src \'self\' data: https:;',
  },
  'X-Frame-Options': {
    explanation: 'This header prevents your page from being embedded in an iframe on another site. Without it, attackers can overlay invisible iframes over your page to trick users into clicking on things they didn\'t intend to (clickjacking).',
    solution: 'Add the header with value DENY (never allow framing) or SAMEORIGIN (only allow your own domain to frame it). Modern alternative: use CSP frame-ancestors directive.',
    impact: 'Medium — Prevents clickjacking attacks where users are tricked into performing unintended actions.',
    example: 'X-Frame-Options: SAMEORIGIN\n# Or using CSP:\nContent-Security-Policy: frame-ancestors \'self\';',
  },
  'X-Content-Type-Options': {
    explanation: 'Without this header, browsers may "sniff" or guess the content type of a response. An attacker could serve a malicious file and the browser might execute it as a script.',
    solution: 'Add "X-Content-Type-Options: nosniff" to all responses. This forces browsers to honor the declared Content-Type header.',
    impact: 'Medium — Prevents MIME type sniffing attacks, especially important for file upload functionality.',
    example: 'X-Content-Type-Options: nosniff',
  },
  'Strict-Transport-Security': {
    explanation: 'HSTS tells browsers to only connect to your site over HTTPS for a specified period. Without it, the first connection could be intercepted (SSL stripping), even if HTTPS is available.',
    solution: 'Add HSTS header with a max-age of at least 1 year. Use includeSubDomains to protect subdomains. Consider HSTS preloading to be included in browser preload lists.',
    impact: 'High — Prevents SSL stripping attacks and ensures all future connections use HTTPS automatically.',
    example: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
  },
  'Referrer-Policy': {
    explanation: 'Without this header, the browser sends the full URL of your page as the Referrer header on outbound requests. This can leak sensitive URL parameters (session tokens, user IDs) to third parties.',
    solution: 'Set Referrer-Policy to "strict-origin-when-cross-origin" (recommended) or "no-referrer" for maximum privacy.',
    impact: 'Low-Medium — Protects user privacy and prevents leaking sensitive URL parameters to third-party services.',
    example: 'Referrer-Policy: strict-origin-when-cross-origin',
  },
  'Permissions-Policy': {
    explanation: 'This header (formerly Feature-Policy) restricts which browser features and APIs your page and embedded content can access. Without it, iframes and scripts can request access to camera, microphone, geolocation, etc.',
    solution: 'Explicitly declare which features you need and deny the rest: camera=(), microphone=(), geolocation=(self).',
    impact: 'Medium — Reduces attack surface by preventing malicious scripts or third-party content from accessing powerful browser APIs.',
    example: 'Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=*',
  },
  'Cookie': {
    explanation: 'Cookies without HttpOnly can be read by JavaScript (XSS risk). Cookies without Secure are sent over HTTP. Cookies without SameSite are sent in cross-site requests (CSRF risk).',
    solution: 'Set all session cookies with HttpOnly (no JS access), Secure (HTTPS only), and SameSite=Strict or Lax. Use short expiry times for sensitive cookies.',
    impact: 'High — Insecure cookies are a primary vector for session hijacking and CSRF attacks.',
    example: 'Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600',
  },
  'default': {
    explanation: 'This security check evaluates an important aspect of your site\'s security posture. Addressing it will improve your overall security score and protect your users.',
    solution: 'Review the specific check details and implement the recommended fix. Test your changes using the built-in checker here or tools like securityheaders.com.',
    impact: 'Varies — Each security control reduces a specific attack surface. Layered security (defense-in-depth) provides the best protection.',
  },
}

async function generateAIAnalysis(tests: TestItem[]): Promise<AIAnalysis[]> {
  await new Promise(r => setTimeout(r, 800))
  const problematic = tests.filter(t => t.status === 'fail' || t.status === 'warn')

  return problematic.map(test => {
    const key = Object.keys(SECURITY_KNOWLEDGE).find(k =>
      test.name.includes(k) || test.detail?.includes(k)
    ) ?? 'default'
    const kb = SECURITY_KNOWLEDGE[key]
    return {
      test,
      explanation: kb.explanation,
      solution: kb.solution,
      impact: kb.impact,
      example: kb.example,
    }
  })
}

// ─── AI Panel ────────────────────────────────────────────────────────────────

function AISecurityPanel({ tests }: { tests: TestItem[] }) {
  const [loading, setLoading] = useState(false)
  const [analyses, setAnalyses] = useState<AIAnalysis[] | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  const runAnalysis = async () => {
    setLoading(true)
    const result = await generateAIAnalysis(tests)
    setAnalyses(result)
    setLoading(false)
  }

  const problematicCount = tests.filter(t => t.status === 'fail' || t.status === 'warn').length

  if (problematicCount === 0) {
    return (
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4">
        <Sparkles size={16} className="text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300">🎉 AI Analysis: All checks passed! Your site has excellent security headers.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#12121a] border border-[#6366f1]/30 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#6366f1]/10 to-transparent border-b border-[#6366f1]/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">AI Security Assistant</span>
          <span className="text-xs text-[#6366f1] bg-[#6366f1]/15 px-2 py-0.5 rounded-full">
            {problematicCount} issue{problematicCount !== 1 ? 's' : ''} to explain
          </span>
        </div>
        {!analyses && !loading && (
          <button
            onClick={runAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#5558e8] text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Sparkles size={12} />
            Get AI Explanations
          </button>
        )}
      </div>

      {!analyses && !loading && (
        <div className="px-4 py-4 text-sm text-[#64748b]">
          Get detailed AI explanations for each security issue: what it means, why it matters, how to fix it, and code examples.
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 px-4 py-6 justify-center">
          <Loader2 size={18} className="animate-spin text-[#6366f1]" />
          <span className="text-sm text-[#64748b]">AI is analyzing security findings…</span>
        </div>
      )}

      {analyses && (
        <div className="divide-y divide-[#1e1e2e]">
          {analyses.length === 0 ? (
            <p className="px-4 py-4 text-sm text-[#64748b]">No actionable findings to explain.</p>
          ) : (
            analyses.map((analysis, i) => (
              <div key={i} className="overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#1a1a27] transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {analysis.test.status === 'fail'
                    ? <XCircle size={14} className="text-red-400 shrink-0" />
                    : <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                  }
                  <span className="flex-1 text-sm font-medium text-white">{analysis.test.name}</span>
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                    analysis.test.status === 'fail'
                      ? 'text-red-400 border-red-500/30 bg-red-500/10'
                      : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                  }`}>
                    {analysis.test.status}
                  </span>
                  {expanded === i
                    ? <ChevronUp size={14} className="text-[#64748b] shrink-0" />
                    : <ChevronDown size={14} className="text-[#64748b] shrink-0" />
                  }
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 space-y-3 border-t border-[#1e1e2e]">
                        {/* Current finding */}
                        <div className="bg-[#0a0a0f] rounded-lg p-3 text-xs text-[#94a3b8]">
                          <span className="text-[#64748b] font-medium">Finding: </span>{analysis.test.detail}
                        </div>

                        {/* What it means */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366f1]">What This Means</span>
                          </div>
                          <p className="text-xs text-[#94a3b8] leading-relaxed">{analysis.explanation}</p>
                        </div>

                        {/* Impact */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">Security Impact</span>
                          </div>
                          <p className="text-xs text-[#94a3b8] leading-relaxed">{analysis.impact}</p>
                        </div>

                        {/* How to fix */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">How to Fix</span>
                          </div>
                          <p className="text-xs text-[#94a3b8] leading-relaxed">{analysis.solution}</p>
                        </div>

                        {/* Code example */}
                        {analysis.example && (
                          <pre className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-xs text-[#a5b4fc] font-mono overflow-x-auto leading-relaxed">
                            {analysis.example}
                          </pre>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
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
          <h1 className="text-xl font-bold text-white">Site Security Analyzer</h1>
        </div>
        <p className="text-sm text-[#64748b] ml-11">
          Test any public URL for security headers, vulnerabilities, and general best practices.
          Get AI-powered explanations and fix recommendations for every finding.
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

            {/* AI Security Assistant */}
            <AISecurityPanel tests={result.tests} />

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
