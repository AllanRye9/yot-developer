'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, CheckCircle, XCircle, Clock, Terminal, Gauge, Database, Globe,
  Network, Layout, Eye, Activity, HardDrive, MapPin, FlaskConical,
  BookOpen, ChevronDown, ChevronUp,
} from 'lucide-react'

interface TestResult {
  status: 'idle' | 'running' | 'pass' | 'fail'
  output: string[]
  duration?: number
}

interface LearnContent {
  what: string
  why: string
  how: string
  devtoolsTip: string
}

interface Test {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  learn: LearnContent
  run: () => Promise<string[]>
}

const tests: Test[] = [
  {
    id: 'console',
    name: 'Console Test',
    description: 'Runs console.log, warn, error, table, group',
    icon: Terminal,
    color: '#6366f1',
    learn: {
      what: 'The Console API lets you print messages, warnings, errors, tables, and grouped logs directly to the browser\'s DevTools Console panel.',
      why: 'It\'s the most common debugging tool — instantly shows variable values, errors, and execution flow without stopping your app.',
      how: 'Use console.log() for general info, console.warn() for potential issues, console.error() for actual errors, console.table() for tabular data, and console.group() to collapse related logs.',
      devtoolsTip: 'Open DevTools (F12) → Console tab. Filter by level (Verbose/Info/Warnings/Errors). Use the Console drawer while on any panel.',
    },
    run: async () => {
      const out: string[] = []
      console.log('[YOT Test] console.log works')
      out.push('✓ console.log("Hello from YOT!")')
      console.warn('[YOT Test] console.warn works')
      out.push('✓ console.warn("Warning test")')
      console.error('[YOT Test] console.error works')
      out.push('✓ console.error("Error test")')
      console.table([{ name: 'Alice', score: 95 }, { name: 'Bob', score: 87 }])
      out.push('✓ console.table([...]) - check DevTools Console tab')
      console.group('[YOT Test] Group')
      console.log('grouped item 1')
      console.groupEnd()
      out.push('✓ console.group / groupEnd - see DevTools Console')
      out.push('→ Open DevTools > Console to see all output')
      return out
    },
  },
  {
    id: 'performance',
    name: 'Performance Test',
    description: 'Uses performance.mark(), measure(), getEntriesByName()',
    icon: Gauge,
    color: '#06b6d4',
    learn: {
      what: 'The Performance API (User Timing API) lets you create precise timestamps (marks) and measure time between them (measures) in microseconds.',
      why: 'Essential for profiling real code — identifies bottlenecks by measuring exactly how long specific operations take in the actual browser environment.',
      how: 'Call performance.mark("start") before your code, performance.mark("end") after, then performance.measure("label", "start", "end") to record the duration. Retrieve with getEntriesByName().',
      devtoolsTip: 'Open DevTools → Performance tab → Record → Run your test → Stop. Your named marks appear as orange diamonds in the timeline.',
    },
    run: async () => {
      const out: string[] = []
      performance.clearMarks()
      performance.clearMeasures()
      performance.mark('yot-start')
      let n = 0
      for (let i = 0; i < 500000; i++) n += i
      performance.mark('yot-end')
      performance.measure('yot-loop', 'yot-start', 'yot-end')
      const entries = performance.getEntriesByName('yot-loop', 'measure')
      const dur = entries[0]?.duration.toFixed(2) ?? '?'
      out.push(`✓ performance.mark('yot-start/end') created`)
      out.push(`✓ performance.measure('yot-loop') = ${dur}ms`)
      out.push(`✓ Loop result: ${n.toLocaleString()} (500k iterations)`)
      const navEntries = performance.getEntriesByType('navigation')
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming
        out.push(`✓ Navigation timing: domInteractive=${nav.domInteractive.toFixed(0)}ms`)
        out.push(`✓ Page load: ${nav.loadEventEnd.toFixed(0)}ms`)
      }
      out.push('→ Open DevTools > Performance to see marks')
      return out
    },
  },
  {
    id: 'storage',
    name: 'Storage Test',
    description: 'Tests localStorage, sessionStorage, cookies',
    icon: Database,
    color: '#10b981',
    learn: {
      what: 'The Web Storage API provides localStorage (persists until cleared) and sessionStorage (cleared when tab closes) for storing key-value string data up to ~5MB each.',
      why: 'Client-side storage enables offline-capable apps, user preferences, shopping carts, and caching without a server round-trip.',
      how: 'Use setItem(key, value) to write, getItem(key) to read, removeItem(key) to delete. Always store JSON.stringify() for objects and parse on retrieval.',
      devtoolsTip: 'Open DevTools → Application tab → Storage section. You can read, edit, and delete entries directly from the panel.',
    },
    run: async () => {
      const out: string[] = []
      // localStorage
      localStorage.setItem('yot-test', 'hello-yot')
      const lsVal = localStorage.getItem('yot-test')
      localStorage.removeItem('yot-test')
      out.push(`✓ localStorage: set/get/remove → "${lsVal}"`)
      // sessionStorage
      sessionStorage.setItem('yot-test', 'session-value')
      const ssVal = sessionStorage.getItem('yot-test')
      sessionStorage.removeItem('yot-test')
      out.push(`✓ sessionStorage: set/get/remove → "${ssVal}"`)
      // cookies
      document.cookie = 'yot-test=cookie-value; path=/'
      const hasCookie = document.cookie.includes('yot-test')
      out.push(`✓ Cookies: set → found=${hasCookie}`)
      out.push(`✓ localStorage length: ${localStorage.length} items stored`)
      out.push('→ Open DevTools > Application > Storage to inspect')
      return out
    },
  },
  {
    id: 'navigator',
    name: 'Navigator Test',
    description: 'Shows userAgent, language, onLine, hardwareConcurrency',
    icon: Globe,
    color: '#8b5cf6',
    learn: {
      what: 'The Navigator API exposes information about the browser and device: user agent string, preferred languages, online status, CPU core count, geolocation, clipboard, and more.',
      why: 'Used to detect browser capabilities, adapt UI for different devices/languages, implement offline detection, and access hardware features like geolocation or camera.',
      how: 'Access via the global navigator object: navigator.userAgent, navigator.language, navigator.onLine, navigator.hardwareConcurrency. Always feature-detect before using experimental properties.',
      devtoolsTip: 'Use DevTools Console: type navigator and press Enter to explore all available properties. DevTools → Network → Throttle to test offline behavior.',
    },
    run: async () => {
      const out: string[] = []
      out.push(`✓ userAgent: ${navigator.userAgent.slice(0, 60)}…`)
      out.push(`✓ language: ${navigator.language}`)
      out.push(`✓ languages: [${(navigator.languages ?? [navigator.language]).slice(0, 3).join(', ')}]`)
      out.push(`✓ onLine: ${navigator.onLine}`)
      out.push(`✓ hardwareConcurrency: ${navigator.hardwareConcurrency} CPU cores`)
      out.push(`✓ cookieEnabled: ${navigator.cookieEnabled}`)
      if ('connection' in navigator) {
        const conn = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection
        if (conn) out.push(`✓ connection.effectiveType: ${conn.effectiveType ?? 'unknown'}`)
      }
      out.push(`✓ platform: ${navigator.platform}`)
      return out
    },
  },
  {
    id: 'network',
    name: 'Network Test',
    description: 'Fetches a URL and shows status, headers, timing',
    icon: Network,
    color: '#f59e0b',
    learn: {
      what: 'The Fetch API provides a modern, Promise-based interface for making HTTP requests. It replaces XMLHttpRequest with a cleaner API that integrates with async/await.',
      why: 'Every web app communicates with servers — Fetch is the standard way to GET data, POST forms, upload files, and receive streaming responses in modern browsers.',
      how: 'Use fetch(url, options) which returns a Promise<Response>. Always check response.ok before parsing. Use AbortController for cancellation and response.json() / response.text() to read the body.',
      devtoolsTip: 'Open DevTools → Network tab. Filter by "Fetch/XHR". Click any request to see headers, payload, response, and timing waterfall.',
    },
    run: async () => {
      const out: string[] = []
      const url = 'https://httpbin.org/get'
      out.push(`→ Fetching ${url} …`)
      try {
        const t0 = performance.now()
        const signal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(8000) : undefined
        const res = await fetch(url, signal ? { signal } : {})
        const t1 = performance.now()
        const body = await res.json()
        out.push(`✓ Status: ${res.status} ${res.statusText}`)
        out.push(`✓ Content-Type: ${res.headers.get('content-type') ?? 'unknown'}`)
        out.push(`✓ Timing: ${(t1 - t0).toFixed(0)}ms`)
        out.push(`✓ Response origin: ${body.origin ?? 'unknown'}`)
        out.push('→ Open DevTools > Network to see request details')
      } catch (err) {
        out.push(`⚠ Fetch failed (network/CORS): ${(err as Error).message}`)
        out.push('→ Open DevTools > Network to see blocked requests')
      }
      return out
    },
  },
  {
    id: 'dom',
    name: 'DOM Test',
    description: 'Creates elements, queries, mutates, removes them',
    icon: Layout,
    color: '#ec4899',
    learn: {
      what: 'The DOM (Document Object Model) API represents the HTML document as a tree of objects. You can create, query, modify, and delete elements programmatically with JavaScript.',
      why: 'The DOM is the foundation of all interactivity on the web — every button click, form validation, and dynamic content update uses the DOM API.',
      how: 'Create elements with document.createElement(), find them with querySelector() / getElementById(), modify with textContent / innerHTML / style / setAttribute(), and remove with element.remove().',
      devtoolsTip: 'Open DevTools → Elements tab. Right-click any element → "Break on" to pause execution on DOM changes. Use the live DOM tree to inspect and edit HTML/CSS in real time.',
    },
    run: async () => {
      const out: string[] = []
      // Create
      const div = document.createElement('div')
      div.id = 'yot-dom-test'
      div.className = 'yot-test-class'
      div.setAttribute('data-yot', 'true')
      document.body.appendChild(div)
      out.push(`✓ createElement('div') + appendChild`)
      // Query
      const found = document.querySelector('#yot-dom-test') as HTMLElement | null
      out.push(`✓ querySelector('#yot-dom-test') found: ${found !== null}`)
      out.push(`✓ getAttribute('data-yot'): ${found?.getAttribute('data-yot')}`)
      // Modify
      if (found) {
        found.textContent = 'Hello DOM'
        out.push(`✓ textContent = 'Hello DOM'`)
        found.style.display = 'none'
        out.push(`✓ style.display = 'none'`)
      }
      // Query all
      const all = document.querySelectorAll('[data-yot]')
      out.push(`✓ querySelectorAll('[data-yot]'): ${all.length} element(s)`)
      // Remove
      found?.remove()
      out.push(`✓ element.remove() — cleaned up`)
      out.push('→ Open DevTools > Elements to inspect live DOM changes')
      return out
    },
  },
  {
    id: 'intersection',
    name: 'IntersectionObserver Test',
    description: 'Creates observer and detects element visibility',
    icon: Eye,
    color: '#14b8a6',
    learn: {
      what: 'IntersectionObserver asynchronously watches whether an element enters or leaves the browser\'s viewport (or a specified container element).',
      why: 'The most efficient way to implement lazy loading images, infinite scroll, "animate on scroll" effects, and ad visibility tracking — far better than listening to scroll events.',
      how: 'Create an observer with a callback and options (threshold: 0-1 for what % of the element must be visible). Call observer.observe(element) to start watching. Always call observer.disconnect() when done.',
      devtoolsTip: 'Open DevTools → Performance tab → Record while scrolling. IntersectionObserver callbacks appear as tasks in the timeline. No dedicated panel — it\'s a background API.',
    },
    run: async () => {
      const out: string[] = []
      return new Promise<string[]>(resolve => {
        const el = document.createElement('div')
        el.style.cssText = 'position:fixed;top:50%;left:50%;width:1px;height:1px;opacity:0'
        document.body.appendChild(el)
        let triggered = false
        const observer = new IntersectionObserver(entries => {
          if (!triggered) {
            triggered = true
            out.push(`✓ IntersectionObserver created`)
            out.push(`✓ Entry isIntersecting: ${entries[0].isIntersecting}`)
            out.push(`✓ intersectionRatio: ${entries[0].intersectionRatio.toFixed(2)}`)
            out.push(`✓ boundingClientRect: ${JSON.stringify({
              top: Math.round(entries[0].boundingClientRect.top),
              left: Math.round(entries[0].boundingClientRect.left),
            })}`)
            observer.disconnect()
            el.remove()
            out.push('→ Check DevTools > Performance for layout info')
            resolve(out)
          }
        }, { threshold: 0 })
        observer.observe(el)
        setTimeout(() => {
          if (!triggered) {
            triggered = true
            observer.disconnect()
            el.remove()
            out.push('✓ IntersectionObserver created (no intersection events yet)')
            resolve(out)
          }
        }, 2000)
      })
    },
  },
  {
    id: 'perfobserver',
    name: 'PerformanceObserver Test',
    description: 'Observes real performance entries',
    icon: Activity,
    color: '#f97316',
    learn: {
      what: 'PerformanceObserver subscribes to performance timeline events in real time — resource loads, paint events, long tasks, layout shifts, and custom measures.',
      why: 'Enables monitoring of Core Web Vitals (LCP, FID, CLS) and other real-user performance metrics programmatically without polling the performance buffer.',
      how: 'Create a PerformanceObserver with a callback, then call observe({ entryTypes: [...] }) with the entry types you want: "paint", "resource", "measure", "longtask", "layout-shift".',
      devtoolsTip: 'Open DevTools → Performance tab → Timings section shows paint events. In the Console, PerformanceObserver entries stream in real time as the page loads.',
    },
    run: async () => {
      const out: string[] = []
      return new Promise<string[]>(resolve => {
        const observed: string[] = []
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            observed.push(`${entry.entryType}: ${entry.name.slice(0, 40)} (${entry.duration.toFixed(1)}ms)`)
          }
        })
        try {
          observer.observe({ entryTypes: ['measure', 'resource'] })
          out.push('✓ PerformanceObserver created for [measure, resource]')
          performance.mark('po-start')
          let x = 0
          for (let i = 0; i < 100000; i++) x += i
          performance.mark('po-end')
          performance.measure('po-test', 'po-start', 'po-end')
          out.push(`✓ Triggered performance.measure (result: ${x.toLocaleString()})`)
          setTimeout(() => {
            observer.disconnect()
            if (observed.length > 0) {
              out.push(`✓ Observed ${observed.length} entries:`)
              observed.slice(0, 5).forEach(e => out.push(`  · ${e}`))
            } else {
              out.push('✓ Observer active (entries may not be visible here)')
            }
            const resources = performance.getEntriesByType('resource')
            out.push(`✓ Total resource entries: ${resources.length}`)
            out.push('→ Open DevTools > Performance to view recorded entries')
            resolve(out)
          }, 500)
        } catch (e) {
          observer.disconnect()
          out.push(`⚠ Error: ${(e as Error).message}`)
          resolve(out)
        }
      })
    },
  },
  {
    id: 'memory',
    name: 'Memory Test',
    description: 'Shows performance.memory (Chrome only)',
    icon: HardDrive,
    color: '#64748b',
    learn: {
      what: 'The performance.memory API (Chrome-only, non-standard) exposes JavaScript heap usage: how much memory is currently used, total allocated, and the maximum limit.',
      why: 'Detecting memory leaks early prevents apps from becoming slow or crashing. Heap growth over time (measure repeatedly) is a sign of a memory leak.',
      how: 'Read performance.memory.usedJSHeapSize before and after an operation. A consistently growing value means something is holding references — common causes are uncleaned event listeners or growing arrays.',
      devtoolsTip: 'Open DevTools → Memory tab. Take heap snapshots before/after a suspected leak. Use "Allocation instrumentation on timeline" to find what\'s growing.',
    },
    run: async () => {
      const out: string[] = []
      const perf = performance as Performance & {
        memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
      }
      if (perf.memory) {
        const mb = (b: number) => (b / 1048576).toFixed(2)
        out.push(`✓ usedJSHeapSize:  ${mb(perf.memory.usedJSHeapSize)} MB`)
        out.push(`✓ totalJSHeapSize: ${mb(perf.memory.totalJSHeapSize)} MB`)
        out.push(`✓ jsHeapSizeLimit: ${mb(perf.memory.jsHeapSizeLimit)} MB`)
        const pct = ((perf.memory.usedJSHeapSize / perf.memory.totalJSHeapSize) * 100).toFixed(1)
        out.push(`✓ Heap used: ${pct}%`)
        out.push('→ Open DevTools > Memory for full heap snapshot')
      } else {
        out.push('⚠ performance.memory not available in this browser')
        out.push('  (Available in Chrome/Chromium with --enable-precise-memory-info)')
        out.push(`✓ Heap entries count: ${performance.getEntries().length}`)
      }
      return out
    },
  },
  {
    id: 'geolocation',
    name: 'Geolocation Test',
    description: 'Requests location with user permission',
    icon: MapPin,
    color: '#ef4444',
    learn: {
      what: 'The Geolocation API allows web pages to request the user\'s physical location (latitude, longitude, altitude, and accuracy) with explicit user permission.',
      why: 'Powers location-aware features: nearby search, maps, weather apps, delivery tracking, and location-based content personalization.',
      how: 'Call navigator.geolocation.getCurrentPosition(success, error, options) for a one-time read, or watchPosition() for continuous updates. Always handle the error callback — users often deny permission.',
      devtoolsTip: 'Open DevTools → More tools → Sensors → Location. Override coordinates to test different locations without physically moving. Also set "Location unavailable" to test the error path.',
    },
    run: async () => {
      const out: string[] = []
      if (!('geolocation' in navigator)) {
        out.push('⚠ Geolocation API not available')
        return out
      }
      out.push('→ Requesting geolocation permission…')
      return new Promise<string[]>(resolve => {
        navigator.geolocation.getCurrentPosition(
          pos => {
            out.push(`✓ Permission granted!`)
            out.push(`✓ Latitude:  ${pos.coords.latitude.toFixed(4)}`)
            out.push(`✓ Longitude: ${pos.coords.longitude.toFixed(4)}`)
            out.push(`✓ Accuracy:  ${pos.coords.accuracy.toFixed(0)}m`)
            if (pos.coords.altitude !== null)
              out.push(`✓ Altitude:  ${pos.coords.altitude.toFixed(0)}m`)
            out.push('→ Check DevTools > Sensors to override location')
            resolve(out)
          },
          err => {
            out.push(`⚠ Geolocation error: ${err.message}`)
            out.push('  (User denied or not available)')
            out.push('→ Open DevTools > Sensors > Location to mock coordinates')
            resolve(out)
          },
          { timeout: 10000, maximumAge: 60000 }
        )
      })
    },
  },
]

function StatusIcon({ status }: { status: TestResult['status'] }) {
  if (status === 'pass') return <CheckCircle size={16} className="text-[#10b981]" />
  if (status === 'fail') return <XCircle size={16} className="text-[#ef4444]" />
  if (status === 'running') return <div className="w-4 h-4 rounded-full border-2 border-[#6366f1] border-t-transparent animate-spin" />
  return <div className="w-4 h-4 rounded-full border-2 border-[var(--color-border)]" />
}

function LearnPanel({ learn, color }: { learn: LearnContent; color: string }) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden border" style={{ borderColor: `${color}30` }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: `${color}20` }}>
        {[
          { label: 'What', content: learn.what },
          { label: 'Why', content: learn.why },
          { label: 'How', content: learn.how },
          { label: '🛠 DevTools', content: learn.devtoolsTip },
        ].map(({ label, content }) => (
          <div key={label} className="p-3" style={{ background: `${color}08` }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color }}>
              {label}
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DevToolsTester() {
  const [results, setResults] = useState<Record<string, TestResult>>(
    Object.fromEntries(tests.map(t => [t.id, { status: 'idle', output: [] }]))
  )
  const [learnOpen, setLearnOpen] = useState<Record<string, boolean>>({})

  const toggleLearn = useCallback((id: string) => {
    setLearnOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const runTest = useCallback(async (test: Test) => {
    setResults(prev => ({ ...prev, [test.id]: { status: 'running', output: [] } }))
    const t0 = performance.now()
    try {
      const output = await test.run()
      const duration = performance.now() - t0
      setResults(prev => ({ ...prev, [test.id]: { status: 'pass', output, duration } }))
    } catch (err) {
      const duration = performance.now() - t0
      setResults(prev => ({
        ...prev,
        [test.id]: { status: 'fail', output: [`Error: ${(err as Error).message}`], duration },
      }))
    }
  }, [])

  const runAll = useCallback(async () => {
    for (const test of tests) {
      await runTest(test)
    }
  }, [runTest])

  const passCount = Object.values(results).filter(r => r.status === 'pass').length
  const failCount = Object.values(results).filter(r => r.status === 'fail').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <FlaskConical size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">DevTools Tester</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Run real Web API tests — learn what each API does, why it exists, and how to use it</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {(passCount > 0 || failCount > 0) && (
            <div className="flex gap-3 text-sm">
              <span className="text-[#10b981] flex items-center gap-1"><CheckCircle size={14} /> {passCount}</span>
              <span className="text-[#ef4444] flex items-center gap-1"><XCircle size={14} /> {failCount}</span>
            </div>
          )}
          <button
            onClick={runAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#5558e8] text-[var(--foreground)] text-sm font-medium rounded-lg transition-colors"
          >
            <Play size={14} />
            Run All
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-4 text-sm text-[#a5b4fc]">
        💡 Open your browser DevTools (<kbd className="bg-[#1e1e2e] px-1 rounded">F12</kbd>) before running tests to see full output in Console, Network, Performance tabs.
        Click <strong>Learn</strong> on any card to understand What, Why, How, and DevTools tips for each API.
      </div>

      {/* Tests grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tests.map((test, i) => {
          const result = results[test.id]
          const Icon = test.icon
          const isLearnOpen = !!learnOpen[test.id]
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${test.color}20`, border: `1px solid ${test.color}30` }}
                  >
                    <Icon size={18} style={{ color: test.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{test.name}</h3>
                      <StatusIcon status={result.status} />
                    </div>
                    <p className="text-xs text-[var(--foreground-muted)]">{test.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {result.duration !== undefined && (
                    <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
                      <Clock size={10} />
                      {result.duration.toFixed(0)}ms
                    </span>
                  )}
                  <button
                    onClick={() => toggleLearn(test.id)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:brightness-110"
                    title="Learn about this API"
                  >
                    <BookOpen size={12} />
                    <span className="hidden sm:inline">Learn</span>
                    {isLearnOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>
                  <button
                    onClick={() => runTest(test)}
                    disabled={result.status === 'running'}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    style={{
                      background: `${test.color}20`,
                      color: test.color,
                      border: `1px solid ${test.color}30`,
                    }}
                  >
                    <Play size={10} />
                    Run
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isLearnOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <LearnPanel learn={test.learn} color={test.color} />
                  </motion.div>
                )}
              </AnimatePresence>

              {result.output.length > 0 && (
                <div className="mt-3 bg-[var(--color-bg)] rounded-lg p-3 font-mono text-xs space-y-1 max-h-48 overflow-y-auto border border-[var(--color-border)]">
                  {result.output.map((line, j) => (
                    <div
                      key={j}
                      className={
                        line.startsWith('✓') ? 'text-[#10b981]' :
                        line.startsWith('⚠') ? 'text-[#f59e0b]' :
                        line.startsWith('→') ? 'text-[var(--foreground-muted)]' :
                        line.startsWith('Error') ? 'text-[#ef4444]' :
                        'text-[var(--foreground)]'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
