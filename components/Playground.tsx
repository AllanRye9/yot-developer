'use client'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Trash2, Copy, Check, Code, Terminal, ChevronDown, Bot, Send, Sparkles } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'

const runCode = (code: string): Array<{ type: string; content: string }> => {
  const outputs: Array<{ type: string; content: string }> = []
  const mockConsole = {
    log: (...args: unknown[]) => outputs.push({ type: 'log', content: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }),
    error: (...args: unknown[]) => outputs.push({ type: 'error', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }),
    warn: (...args: unknown[]) => outputs.push({ type: 'warn', content: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }),
    table: (data: unknown) => outputs.push({ type: 'table', content: JSON.stringify(data, null, 2) }),
    info: (...args: unknown[]) => outputs.push({ type: 'info', content: args.map(a => String(a)).join(' ') }),
    time: (label: string) => outputs.push({ type: 'log', content: `timer "${label}" started` }),
    timeEnd: (label: string) => outputs.push({ type: 'log', content: `timer "${label}": ~1.23ms` }),
    group: (label: string) => outputs.push({ type: 'group', content: `▶ ${label}` }),
    groupEnd: () => outputs.push({ type: 'log', content: '◀ end group' }),
    assert: (cond: boolean, ...args: unknown[]) => { if (!cond) outputs.push({ type: 'error', content: 'Assertion failed: ' + args.join(' ') }) },
    clear: () => outputs.push({ type: 'clear', content: '[Console cleared]' }),
  }
  try {
    const fn = new Function('console', code)
    fn(mockConsole)
  } catch (e) {
    outputs.push({ type: 'error', content: (e as Error).message })
  }
  return outputs
}

const snippets = [
  { label: 'Hello World', code: `console.log("Hello, World!");\nconsole.log("YOT Developer Platform");` },
  { label: 'Array Methods', code: `const nums = [1,2,3,4,5];\nconsole.log("Evens:", nums.filter(n => n%2===0));\nconsole.log("Doubled:", nums.map(n => n*2));` },
  { label: 'Async/Await', code: `async function main() {\n  console.log("Starting...");\n  await new Promise(r => setTimeout(r, 100));\n  console.log("Done!");\n}\nmain();` },
]

// ─── MCP AI code generation ───────────────────────────────────────────────────

function generateCode(prompt: string, currentCode: string): { code: string; explanation: string } {
  const p = prompt.toLowerCase()

  if (p.includes('fibonacci') || p.includes('fib')) {
    return {
      code: `// Fibonacci sequence\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Print first 10 Fibonacci numbers\nfor (let i = 0; i < 10; i++) {\n  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);\n}`,
      explanation: 'Generated a recursive Fibonacci function and printed the first 10 numbers.',
    }
  }
  if (p.includes('factorial')) {
    return {
      code: `// Factorial function\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log("5! =", factorial(5));\nconsole.log("10! =", factorial(10));`,
      explanation: 'Generated a recursive factorial function.',
    }
  }
  if (p.includes('sort') || p.includes('bubble sort') || p.includes('quick sort')) {
    return {
      code: `// Bubble Sort\nfunction bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length - 1; i++) {\n    for (let j = 0; j < a.length - i - 1; j++) {\n      if (a[j] > a[j + 1]) [a[j], a[j+1]] = [a[j+1], a[j]];\n    }\n  }\n  return a;\n}\n\nconst unsorted = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Before:", unsorted);\nconsole.log("After: ", bubbleSort(unsorted));`,
      explanation: 'Generated a bubble sort algorithm with an example.',
    }
  }
  if (p.includes('fetch') || p.includes('api') || p.includes('http')) {
    return {
      code: `// Fetch API example\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Fetch failed:", error.message);\n    throw error;\n  }\n}\n\n// Example usage\nconsole.log("fetchData() is ready to use.");\nconsole.log("Call: fetchData('https://api.example.com/data')");`,
      explanation: 'Generated a fetch utility with error handling.',
    }
  }
  if (p.includes('class') || p.includes('oop')) {
    return {
      code: `// OOP Example: Animal class\nclass Animal {\n  constructor(name, sound) {\n    this.name = name;\n    this.sound = sound;\n  }\n  speak() {\n    return \`\${this.name} says \${this.sound}!\`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name) {\n    super(name, 'Woof');\n  }\n  fetch(item) {\n    return \`\${this.name} fetches the \${item}!\`;\n  }\n}\n\nconst dog = new Dog('Rex');\nconsole.log(dog.speak());\nconsole.log(dog.fetch('ball'));`,
      explanation: 'Generated an OOP example with a base Animal class and a Dog subclass.',
    }
  }
  if (p.includes('promise') || p.includes('async')) {
    return {
      code: `// Promise and async/await example\nfunction delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\nasync function runSequence() {\n  console.log("Step 1: Starting...");\n  await delay(100);\n  console.log("Step 2: After 100ms delay");\n  \n  const results = await Promise.all([\n    Promise.resolve("Result A"),\n    Promise.resolve("Result B"),\n    Promise.resolve("Result C"),\n  ]);\n  console.log("Step 3: Parallel results:", results);\n  console.log("Done!");\n}\n\nrunSequence();`,
      explanation: 'Generated an async/await example showing sequential and parallel Promise execution.',
    }
  }
  if (p.includes('array') || p.includes('map') || p.includes('filter') || p.includes('reduce')) {
    return {
      code: `// Array methods chaining\nconst products = [\n  { name: "Laptop", price: 999, inStock: true },\n  { name: "Phone", price: 699, inStock: false },\n  { name: "Tablet", price: 499, inStock: true },\n  { name: "Watch", price: 299, inStock: true },\n];\n\n// Get total value of in-stock items over $400\nconst total = products\n  .filter(p => p.inStock && p.price > 400)\n  .map(p => p.price)\n  .reduce((sum, price) => sum + price, 0);\n\nconsole.log("In-stock products over $400:");\nproducts.filter(p => p.inStock && p.price > 400)\n  .forEach(p => console.log(\` - \${p.name}: $\${p.price}\`));\nconsole.log("Total value: $" + total);`,
      explanation: 'Generated an array chaining example using filter, map, and reduce.',
    }
  }
  if (p.includes('debounce') || p.includes('throttle')) {
    return {
      code: `// Debounce utility\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Throttle utility\nfunction throttle(fn, limit) {\n  let lastRun = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastRun >= limit) {\n      lastRun = now;\n      return fn.apply(this, args);\n    }\n  };\n}\n\nconsole.log("debounce and throttle utilities are ready!");\nconsole.log("debounce: delays execution until after 'delay' ms of inactivity");\nconsole.log("throttle: limits execution to once per 'limit' ms");`,
      explanation: 'Generated debounce and throttle utility functions.',
    }
  }

  // Modification requests
  if (p.includes('add comment') || p.includes('add comments')) {
    const commented = currentCode
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('function ')) return `// Function definition\n${line}`
        if (line.trim().startsWith('const ') || line.trim().startsWith('let ')) return `// Variable declaration\n${line}`
        return line
      })
      .join('\n')
    return { code: commented, explanation: 'Added comments to your code.' }
  }
  if (p.includes('console.log') && (p.includes('add') || p.includes('insert'))) {
    const withLog = currentCode + '\n\nconsole.log("Debug checkpoint reached");'
    return { code: withLog, explanation: 'Added a console.log statement.' }
  }
  if (p.includes('clear') || p.includes('empty') || p.includes('reset')) {
    return {
      code: `// Ready to write code\nconsole.log("Playground cleared and ready!");`,
      explanation: 'Cleared the code.',
    }
  }

  // Default: wrap existing code with a helpful example
  return {
    code: `// AI-generated example\nconst data = [1, 2, 3, 4, 5];\nconst result = data\n  .filter(n => n % 2 === 0)\n  .map(n => n * n);\nconsole.log("Even numbers squared:", result);\nconsole.log("Try asking me to: generate fibonacci, create a class, write a sort algorithm, or use fetch");`,
    explanation: 'Here\'s a quick example. Try asking me to generate Fibonacci, create a class, write a sort algorithm, add async/await, or use fetch.',
  }
}

interface McpMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  codeApplied?: boolean
}

function McpPanel({ code, onCodeChange }: { code: string; onCodeChange: (code: string) => void }) {
  const [messages, setMessages] = useState<McpMessage[]>([{
    id: '0',
    role: 'assistant',
    content: 'Hi! I\'m your AI coding assistant. Ask me to generate code, modify your current code, or create specific algorithms. I can directly update the editor when you ask!',
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingCode, setPendingCode] = useState<{ code: string; msgId: string } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg: McpMessage = { id: Date.now().toString(), role: 'user', content: input }
    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 500))

    const { code: newCode, explanation } = generateCode(input, code)
    const assistantMsg: McpMessage = {
      id: assistantId,
      role: 'assistant',
      content: explanation,
      codeApplied: false,
    }
    setMessages(prev => [...prev, assistantMsg])
    setPendingCode({ code: newCode, msgId: assistantId })
    setIsLoading(false)

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const applyCode = (msgId: string, newCode: string) => {
    onCodeChange(newCode)
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, codeApplied: true } : m))
    setPendingCode(null)
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-lg flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>AI Code Assistant (MCP)</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />
          <span className="text-[10px]" style={{ color: 'var(--foreground-muted)' }}>Ready</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-md flex-shrink-0 flex items-center justify-center mt-0.5">
                <Bot size={11} className="text-white" />
              </div>
            )}
            <div className="max-w-[85%] space-y-1.5">
              <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--color-accent)] text-[var(--foreground)] rounded-tr-sm'
                  : 'bg-[var(--color-border)] rounded-tl-sm'
              }`} style={msg.role === 'assistant' ? { color: 'var(--foreground)' } : {}}>
                {msg.content}
              </div>
              {msg.role === 'assistant' && pendingCode?.msgId === msg.id && !msg.codeApplied && (
                <button
                  onClick={() => applyCode(msg.id, pendingCode.code)}
                  className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-lg transition-colors font-medium"
                >
                  <Code size={10} />Apply to Editor
                </button>
              )}
              {msg.codeApplied && (
                <span className="text-[10px] text-[#10b981] flex items-center gap-1">
                  <Check size={10} />Applied to editor
                </span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-md flex items-center justify-center">
              <Bot size={11} className="text-white" />
            </div>
            <div className="bg-[var(--color-border)] rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:0ms]" />
              <div className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:150ms]" />
              <div className="w-1 h-1 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to write or modify code..."
            className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ color: 'var(--foreground)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 rounded-lg flex items-center justify-center transition-opacity"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Playground() {
  const [code, setCode] = useState(snippets[0].code)
  const [outputs, setOutputs] = useState<Array<{ type: string; content: string }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor')
  const [showSnippets, setShowSnippets] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const handleRun = useCallback(async () => {
    setIsRunning(true); setActiveTab('output')
    await new Promise(r => setTimeout(r, 200))
    setOutputs(runCode(code)); setIsRunning(false)
  }, [code])

  const handleCopy = () => {
    copyToClipboard(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => { /* copy failed — leave button in default state */ })
  }

  const outputColors: Record<string, string> = {
    log: 'text-[var(--foreground)]',
    error: 'text-[#ef4444]',
    warn: 'text-yellow-400',
    info: 'text-[#06b6d4]',
    table: 'text-[#06b6d4]',
    group: 'text-[#8b5cf6]',
    clear: 'italic',
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun} disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 text-[var(--foreground)] rounded-lg font-medium transition-opacity">
          <Play size={16} />{isRunning ? 'Running...' : 'Run Code'}
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowSnippets(!showSnippets)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm"
            style={{ color: 'var(--foreground)' }}>
            <Code size={14} />Snippets<ChevronDown size={14} className={showSnippets ? 'rotate-180' : ''} />
          </motion.button>
          <AnimatePresence>{showSnippets && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="absolute top-full mt-1 left-0 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden z-10 min-w-[160px]">
              {snippets.map((s, i) => (
                <button key={i} onClick={() => { setCode(s.code); setShowSnippets(false); setOutputs([]) }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-border)]"
                  style={{ color: 'var(--foreground-muted)' }}>{s.label}</button>
              ))}
            </motion.div>
          )}</AnimatePresence>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm"
          style={{ color: 'var(--foreground)' }}>
          {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setOutputs([]); setCode('') }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg text-sm"
          style={{ color: 'var(--foreground-muted)' }}>
          <Trash2 size={14} />Clear
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowAI(!showAI)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-colors ${
            showAI
              ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-[var(--foreground)]'
              : 'bg-[var(--color-card)] border-[var(--color-border)]'
          }`}
          style={!showAI ? { color: 'var(--foreground)' } : {}}>
          <Sparkles size={14} />{showAI ? 'Hide AI' : 'AI Assistant'}
        </motion.button>
        <div className="flex bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-1 ml-auto lg:hidden">
          {(['editor', 'output'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${activeTab === tab ? 'bg-[var(--color-accent)] text-[var(--foreground)]' : ''}`}
              style={activeTab !== tab ? { color: 'var(--foreground-muted)' } : {}}>{tab}</button>
          ))}
        </div>
      </div>

      <div className={`flex-1 grid gap-4 min-h-0 ${showAI ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Code Editor */}
        <div className={`flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden ${activeTab === 'output' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-[#10b981]" /></div>
            <span className="text-xs font-mono ml-2" style={{ color: 'var(--foreground-muted)' }}>playground.js</span>
          </div>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
            onKeyDown={(e) => { if (e.key === 'Tab') { e.preventDefault(); const s = e.currentTarget.selectionStart; setCode(code.substring(0,s)+'  '+code.substring(e.currentTarget.selectionEnd)); requestAnimationFrame(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s+2 }) } }}
            className="flex-1 resize-none p-4 bg-[var(--color-bg)] font-mono text-sm leading-relaxed focus:outline-none"
            style={{ color: 'var(--foreground)' }}
            placeholder="// Write your JavaScript here..." />
        </div>

        {/* Console Output */}
        <div className={`flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
            <Terminal size={14} style={{ color: 'var(--foreground-muted)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>Console Output</span>
            {outputs.length > 0 && <span className="ml-auto text-xs" style={{ color: 'var(--foreground-muted)' }}>{outputs.length} lines</span>}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1">
            {isRunning ? <div className="text-[var(--color-accent)] animate-pulse">Executing...</div>
            : outputs.length > 0 ? outputs.map((out, i) => (
              <div key={i} className={`${outputColors[out.type] || ''} whitespace-pre-wrap break-all`}
                style={!outputColors[out.type] ? { color: 'var(--foreground)' } : {}}>
                <span className="mr-2" style={{ color: 'var(--foreground-muted)' }}>{i+1}</span>{out.content}
              </div>
            )) : <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: 'var(--foreground-muted)' }}><Terminal size={32} className="opacity-20" /><p>Run your code to see output</p></div>}
          </div>
        </div>

        {/* AI Panel */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col min-h-[400px]"
            >
              <McpPanel code={code} onCodeChange={setCode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
