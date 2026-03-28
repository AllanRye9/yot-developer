'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Trash2, Copy, Check, Code, Terminal, ChevronDown } from 'lucide-react'

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

export default function Playground() {
  const [code, setCode] = useState(snippets[0].code)
  const [outputs, setOutputs] = useState<Array<{ type: string; content: string }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor')
  const [showSnippets, setShowSnippets] = useState(false)

  const handleRun = useCallback(async () => {
    setIsRunning(true); setActiveTab('output')
    await new Promise(r => setTimeout(r, 200))
    setOutputs(runCode(code)); setIsRunning(false)
  }, [code])

  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const outputColors: Record<string, string> = { log: 'text-[#e2e8f0]', error: 'text-[#ef4444]', warn: 'text-yellow-400', info: 'text-[#06b6d4]', table: 'text-[#06b6d4]', group: 'text-[#8b5cf6]', clear: 'text-[#64748b] italic' }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun} disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5457e5] disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
          <Play size={16} />{isRunning ? 'Running...' : 'Run Code'}
        </motion.button>
        <div className="relative">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowSnippets(!showSnippets)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] text-[#e2e8f0] rounded-lg text-sm">
            <Code size={14} />Snippets<ChevronDown size={14} className={showSnippets ? 'rotate-180' : ''} />
          </motion.button>
          <AnimatePresence>{showSnippets && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="absolute top-full mt-1 left-0 bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden z-10 min-w-[160px]">
              {snippets.map((s, i) => (
                <button key={i} onClick={() => { setCode(s.code); setShowSnippets(false); setOutputs([]) }}
                  className="w-full text-left px-4 py-2 text-sm text-[#64748b] hover:text-white hover:bg-[#1e1e2e]">{s.label}</button>
              ))}
            </motion.div>
          )}</AnimatePresence>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] text-[#e2e8f0] rounded-lg text-sm">
          {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}{copied ? 'Copied!' : 'Copy'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setOutputs([]); setCode('') }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#12121a] border border-[#1e1e2e] text-[#64748b] rounded-lg text-sm">
          <Trash2 size={14} />Clear
        </motion.button>
        <div className="flex bg-[#12121a] border border-[#1e1e2e] rounded-lg p-1 ml-auto lg:hidden">
          {(['editor', 'output'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${activeTab === tab ? 'bg-[#6366f1] text-white' : 'text-[#64748b]'}`}>{tab}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className={`flex flex-col bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden ${activeTab === 'output' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-[#10b981]" /></div>
            <span className="text-xs text-[#64748b] font-mono ml-2">playground.js</span>
          </div>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
            onKeyDown={(e) => { if (e.key === 'Tab') { e.preventDefault(); const s = e.currentTarget.selectionStart; setCode(code.substring(0,s)+'  '+code.substring(e.currentTarget.selectionEnd)); requestAnimationFrame(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = s+2 }) } }}
            className="flex-1 resize-none p-4 bg-[#0a0a0f] text-[#e2e8f0] font-mono text-sm leading-relaxed focus:outline-none"
            placeholder="// Write your JavaScript here..." />
        </div>
        <div className={`flex flex-col bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
            <Terminal size={14} className="text-[#64748b]" /><span className="text-xs text-[#64748b] font-mono">Console Output</span>
            {outputs.length > 0 && <span className="ml-auto text-xs text-[#64748b]">{outputs.length} lines</span>}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1">
            {isRunning ? <div className="text-[#6366f1] animate-pulse">Executing...</div>
            : outputs.length > 0 ? outputs.map((out, i) => (
              <div key={i} className={`${outputColors[out.type] || 'text-[#e2e8f0]'} whitespace-pre-wrap break-all`}>
                <span className="text-[#64748b] mr-2">{i+1}</span>{out.content}
              </div>
            )) : <div className="text-[#64748b] flex flex-col items-center justify-center h-32 gap-2"><Terminal size={32} className="opacity-20" /><p>Run your code to see output</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
