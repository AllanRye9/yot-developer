'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Terminal } from 'lucide-react'

interface CodeRunnerProps { code: string }

const runCode = (code: string): string[] => {
  const outputs: string[] = []
  const mockConsole = {
    log: (...args: unknown[]) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
    error: (...args: unknown[]) => outputs.push('ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    warn: (...args: unknown[]) => outputs.push('WARN: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    table: (data: unknown) => outputs.push('TABLE:\n' + JSON.stringify(data, null, 2)),
    time: (label: string) => outputs.push(`timer "${label}" started`),
    timeEnd: (label: string) => outputs.push(`timer "${label}": ~2.34ms`),
    group: (label: string) => outputs.push(`▶ Group: ${label}`),
    groupCollapsed: (label: string) => outputs.push(`▶ Group (collapsed): ${label}`),
    groupEnd: () => outputs.push('◀ Group end'),
    assert: (condition: boolean, ...args: unknown[]) => { if (!condition) outputs.push('Assertion failed: ' + args.join(' ')) },
    clear: () => outputs.push('[Console cleared]'),
    info: (...args: unknown[]) => outputs.push('INFO: ' + args.map(a => String(a)).join(' ')),
  }
  try {
    const fn = new Function('console', code)
    fn(mockConsole)
  } catch (e) {
    outputs.push('Error: ' + (e as Error).message)
  }
  return outputs
}

export default function CodeRunner({ code }: CodeRunnerProps) {
  const [outputs, setOutputs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const handleRun = async () => {
    setIsRunning(true); setHasRun(true)
    await new Promise(r => setTimeout(r, 300))
    setOutputs(runCode(code)); setIsRunning(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun} disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#5457e5] disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors">
          <Play size={14} />{isRunning ? 'Running...' : 'Try It'}
        </motion.button>
        {hasRun && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setOutputs([]); setHasRun(false) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] hover:bg-[#2e2e3e] text-[#64748b] text-sm rounded-lg transition-colors">
            <X size={14} />Clear
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {hasRun && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e2e]">
              <Terminal size={14} className="text-[#64748b]" />
              <span className="text-xs text-[#64748b] font-mono">Output</span>
            </div>
            <div className="p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
              {isRunning ? <div className="text-[#64748b] animate-pulse">Executing...</div>
                : outputs.length > 0 ? outputs.map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`${line.startsWith('ERROR:') ? 'text-[#ef4444]' : line.startsWith('WARN:') ? 'text-yellow-400' : line.startsWith('TABLE:') ? 'text-[#06b6d4]' : 'text-[#e2e8f0]'} whitespace-pre-wrap break-all`}>
                    {line}
                  </motion.div>
                )) : <div className="text-[#64748b]">No output</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
