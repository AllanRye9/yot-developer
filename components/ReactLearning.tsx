'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Play, Monitor, Smartphone, ChevronDown, ChevronRight, Terminal, Code2 } from 'lucide-react'
import { reactDOMPlatform, reactNativePlatform, type ReactExample } from '@/lib/react-learning-data'
import { copyToClipboard } from '@/lib/clipboard'

// ─── Code Block ───────────────────────────────────────────────────────────────

function ReactCodeBlock({ code, language = 'jsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyToClipboard(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const highlight = (src: string) =>
    src
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#64748b">$1</span>')
      .replace(/\b(import|export|from|default|return|const|let|var|function|async|await|class|extends|new|if|else|for|while|try|catch|finally|throw|null|undefined|true|false|void|typeof|instanceof)\b/g, '<span style="color:#c792ea">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#c3e88d">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color:#82aaff">$1</span>')

  return (
    <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>{language}</span>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} style={{ color: 'var(--foreground-muted)' }}>
          {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
        </motion.button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed max-h-96 overflow-y-auto" style={{ background: 'var(--color-bg)', color: 'var(--foreground)' }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  )
}

// ─── Live Preview (React DOM) ─────────────────────────────────────────────────

function LivePreview({ html }: { html: string }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <Monitor size={13} style={{ color: 'var(--foreground-muted)' }} />
        <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>Preview</span>
        <div className="flex gap-1 ml-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
        </div>
      </div>
      <div
        className="bg-white min-h-[80px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// ─── Phone Mockup (React Native) ──────────────────────────────────────────────

function PhoneMockup({ html }: { html: string }) {
  return (
    <div className="flex justify-center py-2">
      <div className="relative" style={{ width: 220, height: 420 }}>
        {/* Phone frame */}
        <div className="absolute inset-0 rounded-[32px] border-4 border-slate-700 bg-black shadow-2xl overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-black">
            <span className="text-white text-[10px] font-medium">9:41</span>
            <div className="flex gap-1">
              <span className="text-white text-[10px]">●●●</span>
            </div>
          </div>
          {/* App content */}
          <div className="flex-1 overflow-auto bg-white" style={{ height: 'calc(100% - 28px)' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full" />
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-10" />
      </div>
    </div>
  )
}

// ─── Example View ─────────────────────────────────────────────────────────────

function ExampleView({ example, platform }: { example: ReactExample; platform: 'react-dom' | 'react-native' }) {
  const [showPreview, setShowPreview] = useState(true)

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{example.title}</h3>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{example.description}</p>
      </div>

      {example.preview && (
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
            style={showPreview ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' } : { background: 'transparent', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
          >
            {platform === 'react-dom' ? <Monitor size={12} /> : <Smartphone size={12} />}
            Preview
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
            style={!showPreview ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' } : { background: 'transparent', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
          >
            <Play size={12} />
            Code
          </motion.button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {showPreview && example.preview ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {platform === 'react-dom'
              ? <LivePreview html={example.preview} />
              : <PhoneMockup html={example.preview} />
            }
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReactCodeBlock code={example.code} language={platform === 'react-dom' ? 'jsx' : 'jsx (React Native)'} />
          </motion.div>
        )}
      </AnimatePresence>

      {example.preview && (
        <ReactCodeBlock code={example.code} language={platform === 'react-dom' ? 'jsx' : 'jsx (React Native)'} />
      )}
    </div>
  )
}

// ─── Platform Panel ───────────────────────────────────────────────────────────

function PlatformPanel({ platform }: { platform: typeof reactDOMPlatform }) {
  const [selectedCategory, setSelectedCategory] = useState(platform.categories[0])
  const [selectedExample, setSelectedExample] = useState(0)
  const [catOpen, setCatOpen] = useState(false)

  const handleCatSelect = (cat: typeof platform.categories[0]) => {
    setSelectedCategory(cat)
    setSelectedExample(0)
    setCatOpen(false)
  }

  return (
    <div className="flex gap-4 min-h-[500px]">
      {/* Category sidebar — desktop */}
      <div className="hidden md:flex flex-col w-48 flex-shrink-0 rounded-xl border p-2 space-y-0.5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5" style={{ color: 'var(--foreground-muted)' }}>Topics</p>
        {platform.categories.map(cat => {
          const isActive = cat.id === selectedCategory.id
          return (
            <motion.button
              key={cat.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCatSelect(cat)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors border"
              style={isActive
                ? { background: 'color-mix(in srgb, var(--color-accent) 20%, transparent)', color: 'var(--color-accent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)' }
                : { color: 'var(--foreground-muted)', borderColor: 'transparent' }}
            >
              <span className="font-medium">{cat.name}</span>
              {isActive && <ChevronRight size={13} className="ml-auto" />}
            </motion.button>
          )
        })}
      </div>

      {/* Category dropdown — mobile */}
      <div className="md:hidden w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCatOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium mb-2"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
        >
          {selectedCategory.name}
          <ChevronDown size={15} style={{ color: 'var(--foreground-muted)' }} />
        </motion.button>
        <AnimatePresence>
          {catOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border p-2 space-y-0.5 mb-3" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              {platform.categories.map(cat => (
                <button key={cat.id} onClick={() => handleCatSelect(cat)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm"
                  style={cat.id === selectedCategory.id ? { color: 'var(--color-accent)', background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)' } : { color: 'var(--foreground-muted)' }}>
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Example tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {selectedCategory.examples.map((ex, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedExample(i)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={selectedExample === i
                ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
                : { background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
            >
              {ex.title}
            </motion.button>
          ))}
        </div>

        {/* Example content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory.id}-${selectedExample}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-4 space-y-4"
            style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
          >
            <ExampleView
              example={selectedCategory.examples[selectedExample]}
              platform={platform.id}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReactLearning() {
  const [activePlatform, setActivePlatform] = useState<'react-dom' | 'react-native'>('react-dom')
  const platform = activePlatform === 'react-dom' ? reactDOMPlatform : reactNativePlatform

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border p-5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
            style={{ background: 'color-mix(in srgb, #61dafb 15%, transparent)', border: '1px solid color-mix(in srgb, #61dafb 30%, transparent)' }}>
            ⚛
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Learn React</h1>
            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Interactive examples with live preview</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
          React is a JavaScript library for building user interfaces. It renders components declaratively, manages state efficiently, and works across web (React DOM) and mobile (React Native) platforms.
        </p>

        {/* Platform tabs */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActivePlatform('react-dom')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
            style={activePlatform === 'react-dom'
              ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
              : { background: 'transparent', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
          >
            <Monitor size={14} /> React DOM
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActivePlatform('react-native')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border"
            style={activePlatform === 'react-native'
              ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
              : { background: 'transparent', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
          >
            <Smartphone size={14} /> React Native
          </motion.button>
        </div>
      </div>

      {/* Platform info badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="rounded-xl border px-4 py-3 flex items-center gap-3"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)' }}
        >
          {activePlatform === 'react-dom' ? <Monitor size={16} style={{ color: 'var(--color-accent)' }} /> : <Smartphone size={16} style={{ color: 'var(--color-accent)' }} />}
          <div>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>{platform.name}</span>
            <span className="text-xs ml-2" style={{ color: 'var(--foreground-muted)' }}>{platform.tagline}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
        >
          <PlatformPanel platform={platform} />
        </motion.div>
      </AnimatePresence>

      {/* React Playground */}
      <ReactPlayground />
    </div>
  )
}

// ─── React Playground ─────────────────────────────────────────────────────────

const REACT_PLAYGROUND_EXAMPLES = [
  {
    label: 'useState Counter',
    code: `// React useState Counter\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div style={{textAlign:'center',padding:20}}>\n      <h2 style={{marginBottom:12}}>Count: {count}</h2>\n      <button onClick={() => setCount(c => c + 1)} style={{marginRight:8,padding:'6px 16px',background:'#6366f1',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>+</button>\n      <button onClick={() => setCount(c => c - 1)} style={{padding:'6px 16px',background:'#ef4444',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>-</button>\n    </div>\n  );\n}\nrender(<Counter />);`,
  },
  {
    label: 'useEffect Timer',
    code: `// React useEffect Timer\nfunction Timer() {\n  const [seconds, setSeconds] = React.useState(0);\n  React.useEffect(() => {\n    const id = setInterval(() => setSeconds(s => s + 1), 1000);\n    return () => clearInterval(id);\n  }, []);\n  return (\n    <div style={{textAlign:'center',padding:20}}>\n      <h2 style={{fontFamily:'monospace',fontSize:48,margin:0}}>⏱ {seconds}s</h2>\n      <p style={{color:'#94a3b8',marginTop:8}}>Timer running…</p>\n    </div>\n  );\n}\nrender(<Timer />);`,
  },
  {
    label: 'List & Keys',
    code: `// React List & Keys\nfunction FruitList() {\n  const fruits = ['🍎 Apple','🍌 Banana','🍇 Grape','🍓 Strawberry'];\n  return (\n    <ul style={{padding:'16px 24px',fontFamily:'sans-serif'}}>\n      {fruits.map((fruit, i) => (\n        <li key={i} style={{padding:'6px 0',borderBottom:'1px solid #e2e8f0',color:'#1e293b'}}>{fruit}</li>\n      ))}\n    </ul>\n  );\n}\nrender(<FruitList />);`,
  },
]

function ReactPlayground() {
  const [code, setCode] = useState(REACT_PLAYGROUND_EXAMPLES[0].code)
  const [previewHtml, setPreviewHtml] = useState('')
  const [error, setError] = useState('')
  const [showSnippets, setShowSnippets] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRun = useCallback(() => {
    setError('')
    try {
      // Build a standalone HTML page with React CDN + the component code
      const html = `<!DOCTYPE html><html><head>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<style>body{margin:0;padding:0;font-family:system-ui,sans-serif;background:#fff;}</style>
</head><body><div id="root"></div>
<script type="text/babel">
const render = (el) => ReactDOM.createRoot(document.getElementById('root')).render(el);
${code}
<\/script></body></html>`
      setPreviewHtml(html)
    } catch (e) {
      setError((e as Error).message)
    }
  }, [code])

  const handleCopy = () => {
    copyToClipboard(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
        <div className="flex items-center gap-2">
          <Code2 size={15} style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>React Playground</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'color-mix(in srgb, #61dafb 15%, transparent)', color: '#61dafb' }}>Live Preview</span>
        </div>
        <div className="flex gap-2">
          {/* Snippets */}
          <div className="relative">
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowSnippets(s => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
              style={{ color: 'var(--foreground-muted)', borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
              <ChevronDown size={12} />Examples
            </motion.button>
            <AnimatePresence>
              {showSnippets && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 z-10 rounded-lg overflow-hidden border min-w-[180px]"
                  style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  {REACT_PLAYGROUND_EXAMPLES.map((ex, i) => (
                    <button key={i} onClick={() => { setCode(ex.code); setShowSnippets(false); setPreviewHtml(''); setError('') }}
                      className="w-full text-left px-4 py-2 text-xs hover:opacity-80"
                      style={{ color: 'var(--foreground-muted)' }}>{ex.label}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
            style={{ color: 'var(--foreground-muted)', borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            {copied ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[360px]">
        {/* Editor */}
        <div className="flex flex-col border-r" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>App.jsx</span>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-accent)] text-white rounded-lg text-xs font-medium">
              <Play size={11} />Run
            </motion.button>
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
            className="flex-1 resize-none p-4 font-mono text-xs leading-relaxed focus:outline-none"
            style={{ background: 'var(--color-bg)', color: 'var(--foreground)', minHeight: 320 }}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <Monitor size={13} style={{ color: 'var(--foreground-muted)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>Live Preview</span>
            <div className="flex gap-1 ml-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            </div>
          </div>
          {error ? (
            <div className="flex-1 p-4 text-xs font-mono text-[#ef4444]">{error}</div>
          ) : previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              sandbox="allow-scripts"
              className="flex-1 w-full bg-white border-0"
              style={{ minHeight: 320 }}
              title="React Preview"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: 'var(--foreground-muted)' }}>
              <Terminal size={32} className="opacity-20" />
              <p className="text-sm">Click <strong>Run</strong> to see the live preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
