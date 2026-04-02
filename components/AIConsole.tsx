'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

const AI_THINKING_DELAY_MS = 650
const COLOR_SUCCESS = '#27c93f'
const COLOR_CODE = '#34d399'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal, Sparkles, Play, Trash2, Copy, Check,
  ChevronRight, Bot, Lightbulb, Zap, Info, X,
  BookOpen, Code2, Send,
} from 'lucide-react'
import {
  getTaskRecommendation,
  outputTypeConfig,
  starterTasks,
  explainOutput,
  type MethodRecommendation,
} from '@/lib/ai-console-data'
import { copyToClipboard } from '@/lib/clipboard'
import { trackFeatureUsage } from '@/lib/analytics'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConsoleEntry {
  id: string
  type: keyof typeof outputTypeConfig
  content: string
  explanation: string
  showExplanation: boolean
  timestamp: number
}

// ─── Code runner (sandboxed) ─────────────────────────────────────────────────

function runCode(code: string): Array<{ type: string; content: string }> {
  const outputs: Array<{ type: string; content: string }> = []
  const mockConsole = {
    log:      (...a: unknown[]) => outputs.push({ type: 'log',   content: a.map(v => (v !== null && typeof v === 'object') ? JSON.stringify(v, null, 2) : String(v)).join(' ') }),
    error:    (...a: unknown[]) => outputs.push({ type: 'error', content: a.map(v => (v !== null && typeof v === 'object') ? JSON.stringify(v) : String(v)).join(' ') }),
    warn:     (...a: unknown[]) => outputs.push({ type: 'warn',  content: a.map(v => (v !== null && typeof v === 'object') ? JSON.stringify(v) : String(v)).join(' ') }),
    info:     (...a: unknown[]) => outputs.push({ type: 'info',  content: a.map(v => String(v)).join(' ') }),
    table:    (d: unknown)      => outputs.push({ type: 'table', content: JSON.stringify(d, null, 2) }),
    group:    (l: string)       => outputs.push({ type: 'group', content: `▶ ${l}` }),
    groupEnd: ()                => outputs.push({ type: 'log',   content: '◀ end group' }),
    time:     (l: string)       => outputs.push({ type: 'log',   content: `timer "${l}" started` }),
    timeEnd:  (l: string)       => outputs.push({ type: 'log',   content: `timer "${l}": ~1.23ms` }),
    assert:   (c: boolean, ...a: unknown[]) => { if (!c) outputs.push({ type: 'error', content: 'Assertion failed: ' + a.join(' ') }) },
    clear:    ()                => outputs.push({ type: 'clear', content: '[Console cleared]' }),
  }
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code)
    fn(mockConsole)
  } catch (e) {
    outputs.push({ type: 'error', content: (e as Error).message })
  }
  return outputs
}

// ─── Method card ─────────────────────────────────────────────────────────────

function MethodCard({ method, onInsert }: { method: MethodRecommendation; onInsert: (code: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(method.example)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:opacity-80"
      >
        <span
          className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', color: 'var(--color-accent)' }}
        >
          {method.category}
        </span>
        <span className="flex-1 font-mono text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>
          {method.name}
        </span>
        <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={12} style={{ color: 'var(--foreground-muted)' }} />
        </motion.span>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {/* Signature */}
              <div
                className="mt-2 font-mono text-[11px] px-2 py-1.5 rounded-lg"
                style={{ background: 'var(--color-card)', color: 'var(--color-accent)' }}
              >
                {method.signature}
              </div>
              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                {method.description}
              </p>
              {/* Example */}
              <div className="relative">
                <div
                  className="font-mono text-[11px] px-2 py-2 rounded-lg pr-14 leading-relaxed"
                  style={{ background: 'var(--color-card)', color: COLOR_CODE }}
                >
                  {method.example}
                </div>
                <div className="absolute right-1 top-1 flex gap-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="w-6 h-6 rounded flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-border)' }}
                    title="Copy example"
                  >
                    {copied ? <Check size={10} style={{ color: COLOR_CODE }} /> : <Copy size={10} style={{ color: 'var(--foreground-muted)' }} />}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onInsert(method.example)}
                    className="w-6 h-6 rounded flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-accent)' }}
                    title="Insert into editor"
                  >
                    <Play size={10} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Console entry row ────────────────────────────────────────────────────────

function ConsoleEntryRow({ entry, onToggleExplanation }: { entry: ConsoleEntry; onToggleExplanation: (id: string) => void }) {
  const cfg = outputTypeConfig[entry.type] ?? outputTypeConfig.log

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group rounded-lg overflow-hidden"
      style={{ background: cfg.bgVar, border: `1px solid color-mix(in srgb, ${cfg.colorVar} 20%, transparent)` }}
    >
      <div className="flex items-start gap-2 px-3 py-2">
        {/* Type badge */}
        <span
          className="shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-widest w-10 text-center py-0.5 rounded"
          style={{ color: cfg.colorVar, background: `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)` }}
        >
          {cfg.label}
        </span>

        {/* Content */}
        <pre
          className="flex-1 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all min-w-0"
          style={{ color: cfg.colorVar }}
        >
          {entry.content}
        </pre>

        {/* Explain toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleExplanation(entry.id)}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
          title="Explain this output"
        >
          <Info size={11} style={{ color: 'var(--color-accent)' }} />
        </motion.button>
      </div>

      {/* AI explanation panel */}
      <AnimatePresence>
        {entry.showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t"
            style={{ borderColor: `color-mix(in srgb, ${cfg.colorVar} 15%, transparent)` }}
          >
            <div className="flex items-start gap-2 px-3 py-2.5" style={{ background: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' }}>
              <div
                className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5"
                style={{ background: 'var(--color-accent)' }}
              >
                <Bot size={11} className="text-white" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                {entry.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AIConsole() {
  // Editor / console state
  const [code, setCode] = useState(`// Welcome to the AI Console 🚀
// Type your task in the input below, or write code directly and press Run.
const greeting = "Hello, AI Console!";
console.log(greeting);
console.log("Type a task description below to get AI-powered method recommendations.");`)
  const [entries, setEntries] = useState<ConsoleEntry[]>([])
  const [hasRun, setHasRun] = useState(false)

  // AI task panel state
  const [taskInput, setTaskInput] = useState('')
  const [activeTask, setActiveTask] = useState<ReturnType<typeof getTaskRecommendation> | null>(null)
  const [taskLoading, setTaskLoading] = useState(false)
  const [streamingExplanation, setStreamingExplanation] = useState('')
  const [streamingDone, setStreamingDone] = useState(true)
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // UI state
  const [copied, setCopied] = useState(false)
  const [rightPanel, setRightPanel] = useState<'recommendations' | 'explain'>('recommendations')

  const outputEndRef = useRef<HTMLDivElement>(null)
  const taskInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  // Streaming text helper
  const streamText = useCallback((text: string, onDone?: () => void) => {
    if (streamRef.current) clearInterval(streamRef.current)
    setStreamingExplanation('')
    setStreamingDone(false)
    let i = 0
    streamRef.current = setInterval(() => {
      if (i <= text.length) {
        setStreamingExplanation(text.slice(0, i))
        i++
      } else {
        clearInterval(streamRef.current!)
        setStreamingDone(true)
        onDone?.()
      }
    }, 12)
  }, [])

  // Run code
  const handleRun = useCallback(() => {
    const outputs = runCode(code)
    const newEntries: ConsoleEntry[] = outputs.map(o => ({
      id: `${Date.now()}-${Math.random()}`,
      type: (o.type as keyof typeof outputTypeConfig) in outputTypeConfig ? (o.type as keyof typeof outputTypeConfig) : 'log',
      content: o.content,
      explanation: explainOutput(o.type, o.content),
      showExplanation: false,
      timestamp: Date.now(),
    }))
    setEntries(prev => [...prev, ...newEntries])
    setHasRun(true)
    setRightPanel('explain')
    trackFeatureUsage('AIConsole:run')
  }, [code])

  // Clear console
  const handleClear = useCallback(() => {
    setEntries([])
    setHasRun(false)
  }, [])

  // Copy code
  const handleCopy = useCallback(async () => {
    await copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [code])

  // Toggle per-entry explanation
  const toggleExplanation = useCallback((id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, showExplanation: !e.showExplanation } : e))
  }, [])

  // Submit task to AI
  const handleTaskSubmit = useCallback((task?: string) => {
    const text = task ?? taskInput
    if (!text.trim()) return
    setTaskLoading(true)
    setActiveTask(null)
    setStreamingExplanation('')
    setStreamingDone(false)
    setRightPanel('recommendations')
    trackFeatureUsage(`AIConsole:task:${text.slice(0, 40)}`)

    // Simulate a brief "thinking" delay then stream the explanation
    setTimeout(() => {
      const rec = getTaskRecommendation(text)
      setActiveTask(rec)
      setTaskLoading(false)
      streamText(rec.explanation)
    }, AI_THINKING_DELAY_MS)

    if (!task) setTaskInput('')
  }, [taskInput, streamText])

  // Insert method example into editor
  const insertExample = useCallback((exampleCode: string) => {
    setCode(prev => `${prev}\n\n// Inserted example:\n${exampleCode}`)
  }, [])

  // Load starter code from recommendation
  const loadStarterCode = useCallback(() => {
    if (!activeTask) return
    setCode(activeTask.starterCode)
    setEntries([])
    setHasRun(false)
    trackFeatureUsage('AIConsole:loadStarter')
  }, [activeTask])

  // Keyboard: Ctrl/Cmd+Enter runs code
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
  }, [handleRun])

  return (
    <div className="space-y-4">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))', boxShadow: 'var(--color-accent) 0 0 20px 0' }}
          >
            <Terminal size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>AI Console</h1>
            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
              Describe a task · Get method recommendations · Run & explain code
            </p>
          </div>
        </div>

        {/* Status chips */}
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', color: 'var(--color-accent)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            AI Active
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}>
            {entries.length} output{entries.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ─── Task input bar ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border p-4 space-y-3"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>What do you want to do?</span>
          <span className="text-xs ml-auto" style={{ color: 'var(--foreground-muted)' }}>AI will recommend the right methods</span>
        </div>

        <div className="flex gap-2">
          <input
            ref={taskInputRef}
            type="text"
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTaskSubmit()}
            placeholder="e.g. filter an array, merge objects, run async operations…"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all border"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTaskSubmit()}
            disabled={!taskInput.trim() || taskLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
          >
            {taskLoading
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Sparkles size={14} /></motion.div>
              : <Send size={14} />
            }
            <span className="hidden sm:inline">Ask AI</span>
          </motion.button>
        </div>

        {/* Quick task chips */}
        <div className="flex flex-wrap gap-1.5">
          {starterTasks.map((task, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTaskSubmit(task)}
              className="text-xs px-2.5 py-1 rounded-full border transition-all"
              style={{ borderColor: 'var(--color-border)', color: 'var(--foreground-muted)', background: 'var(--color-bg)' }}
            >
              {task}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ─── Main two-panel area ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Code editor + console output */}
        <div className="flex flex-col gap-3">

          {/* Code editor */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            {/* Editor toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full" style={{ background: COLOR_SUCCESS }} />
              </div>
              <span className="text-xs font-medium ml-1" style={{ color: 'var(--foreground-muted)' }}>
                <Code2 size={11} className="inline mr-1 -mt-0.5" />
                console.js
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: 'var(--foreground-muted)' }}>⌘+Enter to run</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                  style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}
                >
                  {copied ? <Check size={11} style={{ color: COLOR_SUCCESS }} /> : <Copy size={11} />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
                  style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}
                  title="Clear output"
                >
                  <Trash2 size={11} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRun}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}
                >
                  <Play size={11} />
                  Run
                </motion.button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              rows={14}
              className="w-full p-4 font-mono text-xs leading-relaxed resize-none focus:outline-none"
              style={{ background: 'var(--color-card)', color: 'var(--foreground)', caretColor: 'var(--color-accent)' }}
            />
          </div>

          {/* Console output */}
          <div
            className="rounded-xl border overflow-hidden flex flex-col"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', minHeight: 180 }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
              <Terminal size={13} style={{ color: 'var(--foreground-muted)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--foreground-muted)' }}>Console Output</span>
              {entries.length > 0 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-md transition-colors"
                  style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}
                >
                  <X size={10} /> Clear
                </motion.button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-64">
              <AnimatePresence initial={false}>
                {!hasRun && entries.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-24 gap-2"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-border)' }}>
                      <Terminal size={16} style={{ color: 'var(--foreground-muted)' }} />
                    </div>
                    <p className="text-xs text-center" style={{ color: 'var(--foreground-muted)' }}>
                      Press <kbd className="px-1 py-0.5 rounded text-[10px] border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>Run</kbd> to execute your code
                    </p>
                  </motion.div>
                )}
                {entries.map(entry => (
                  <ConsoleEntryRow key={entry.id} entry={entry} onToggleExplanation={toggleExplanation} />
                ))}
              </AnimatePresence>
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>

        {/* RIGHT: AI panel (recommendations or explain) */}
        <div className="flex flex-col gap-3">

          {/* Panel tabs */}
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            {(['recommendations', 'explain'] as const).map(panel => (
              <button
                key={panel}
                onClick={() => setRightPanel(panel)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all"
                style={
                  rightPanel === panel
                    ? { background: 'var(--color-accent)', color: '#fff' }
                    : { color: 'var(--foreground-muted)' }
                }
              >
                {panel === 'recommendations' ? <><Lightbulb size={12} /> Recommendations</> : <><BookOpen size={12} /> Output Guide</>}
              </button>
            ))}
          </div>

          {/* Recommendations panel */}
          <AnimatePresence mode="wait">
            {rightPanel === 'recommendations' && (
              <motion.div
                key="rec"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 rounded-xl border overflow-hidden flex flex-col"
                style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>AI Recommendations</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Loading state */}
                  {taskLoading && (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                          className="h-12 rounded-xl"
                          style={{ background: 'var(--color-bg)' }}
                        />
                      ))}
                    </div>
                  )}

                  {/* AI explanation streaming */}
                  {!taskLoading && activeTask && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 p-3 rounded-xl border"
                      style={{ background: 'color-mix(in srgb, var(--color-accent) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)' }}
                    >
                      <div className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center mt-0.5" style={{ background: 'var(--color-accent)' }}>
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                          {streamingExplanation}
                          {!streamingDone && (
                            <span className="inline-block w-0.5 h-3 ml-0.5 align-middle animate-pulse" style={{ background: 'var(--color-accent)' }} />
                          )}
                        </p>
                        {streamingDone && activeTask && (
                          <motion.button
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={loadStarterCode}
                            className="mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                            style={{ background: 'var(--color-accent)', color: '#fff' }}
                          >
                            <Zap size={11} />
                            Load starter code
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Empty state */}
                  {!taskLoading && !activeTask && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
                      >
                        <Sparkles size={22} style={{ color: 'var(--color-accent)' }} />
                      </motion.div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Ask AI what you want to do</p>
                        <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                          Describe your goal and get recommended methods, explanations, and ready-to-run code.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Method cards */}
                  {!taskLoading && activeTask && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: 'var(--foreground-muted)' }}>
                        <Zap size={11} /> Recommended Methods
                      </p>
                      {activeTask.methods.map((method, i) => (
                        <MethodCard key={i} method={method} onInsert={insertExample} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Output guide panel */}
            {rightPanel === 'explain' && (
              <motion.div
                key="explain"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 rounded-xl border overflow-hidden flex flex-col"
                style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
                      <BookOpen size={13} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Output Guide</span>
                    <span className="text-xs ml-1" style={{ color: 'var(--foreground-muted)' }}>
                      — hover an output row and click <Info size={10} className="inline -mt-0.5" /> to explain it
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' }}
                      >
                        <Terminal size={22} style={{ color: 'var(--color-accent)' }} />
                      </motion.div>
                      <p className="text-xs text-center" style={{ color: 'var(--foreground-muted)' }}>
                        Run your code to see AI-powered explanations for each output line.
                      </p>
                    </div>
                  ) : (
                    entries.map((entry, i) => {
                      const cfg = outputTypeConfig[entry.type] ?? outputTypeConfig.log
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-xl border p-3 space-y-2"
                          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                              style={{ color: cfg.colorVar, background: `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)` }}
                            >
                              {cfg.label}
                            </span>
                            <code className="text-xs font-mono truncate flex-1" style={{ color: 'var(--foreground-muted)' }}>
                              {entry.content.length > 60 ? entry.content.slice(0, 60) + '…' : entry.content}
                            </code>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                            {entry.explanation}
                          </p>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Tips bar ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border p-3"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          {[
            { icon: Zap,      tip: 'Describe a task → AI recommends the exact methods you need' },
            { icon: Info,     tip: 'Hover any output line and click the ⓘ icon for an AI explanation' },
            { icon: Play,     tip: 'Click a method card → expand it → insert the example directly into the editor' },
            { icon: Sparkles, tip: 'Hit "Load starter code" after asking a task to jump straight to working code' },
          ].map(({ icon: Icon, tip }, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground-muted)' }}>
              <Icon size={11} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
