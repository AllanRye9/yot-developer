'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronRight, Play, Monitor, Code2, Terminal, ChevronDown } from 'lucide-react'
import { flutterSections, type FlutterSubsection } from '@/lib/react-learning-data'
import { copyToClipboard } from '@/lib/clipboard'

// ─── Dart Code Block ──────────────────────────────────────────────────────────

function DartCodeBlock({ code, language = 'dart' }: { code: string; language?: string }) {
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
      .replace(/\b(import|export|class|extends|implements|mixin|abstract|void|return|final|const|var|late|required|async|await|try|catch|finally|throw|if|else|for|while|switch|case|break|continue|new|this|super|null|true|false|override|static|get|set)\b/g, '<span style="color:#c792ea">$1</span>')
      .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span style="color:#c3e88d">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color:#82aaff">$1</span>')

  return (
    <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'color-mix(in srgb, #54c5f8 20%, transparent)', color: '#54c5f8' }}>Flutter</span>
          <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>{language}</span>
        </div>
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

// ─── Directory Tree ───────────────────────────────────────────────────────────

function DirectoryTree({ tree }: { tree: string }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'color-mix(in srgb, #54c5f8 20%, transparent)', color: '#54c5f8' }}>Flutter</span>
        <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>directory structure</span>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed" style={{ background: 'var(--color-bg)', color: 'var(--foreground)' }}>
        {tree.split('\n').map((line, i) => {
          const isComment = line.includes('#')
          const parts = isComment ? line.split('#') : null
          return (
            <div key={i}>
              {isComment ? (
                <>
                  <span>{parts![0]}</span>
                  <span style={{ color: '#64748b' }}># {parts!.slice(1).join('#')}</span>
                </>
              ) : (
                <span style={{ color: line.trim().endsWith('/') ? 'var(--color-accent)' : 'var(--foreground)' }}>{line}</span>
              )}
            </div>
          )
        })}
      </pre>
    </div>
  )
}

// ─── Package List ─────────────────────────────────────────────────────────────

function PackageList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const [pkg, ...rest] = item.split(' — ')
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg border"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
          >
            <ChevronRight size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
            <div className="min-w-0">
              <span className="text-sm font-mono font-medium" style={{ color: 'var(--color-accent)' }}>{pkg}</span>
              {rest.length > 0 && (
                <span className="text-xs ml-1" style={{ color: 'var(--foreground-muted)' }}>— {rest.join(' — ')}</span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Subsection ───────────────────────────────────────────────────────────────

function SubsectionCard({ subsection }: { subsection: FlutterSubsection }) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{subsection.title}</h4>
        <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>{subsection.description}</p>
      </div>

      {subsection.tree && <DirectoryTree tree={subsection.tree} />}
      {subsection.code && <DartCodeBlock code={subsection.code} />}
      {subsection.items && <PackageList items={subsection.items} />}
    </div>
  )
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

function FlutterPhoneMockup() {
  return (
    <div className="flex justify-center py-4">
      <div className="relative" style={{ width: 200, height: 380 }}>
        <div className="absolute inset-0 rounded-[28px] border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900">
            <span className="text-white text-[10px]">9:41</span>
            <span className="text-white text-[10px]">●●●</span>
          </div>
          {/* Flutter app mockup content */}
          <div className="bg-white h-full overflow-hidden">
            {/* AppBar */}
            <div style={{ background: '#6366f1', padding: '10px 16px' }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 }}>Flutter App</p>
            </div>
            {/* Body */}
            <div style={{ padding: 16 }}>
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13, color: '#0f172a' }}>Hello Flutter!</p>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Built with Dart widgets</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ background: '#e0e7ff', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#4338ca' }}>Widget</div>
                <div style={{ background: '#dcfce7', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#16a34a' }}>State</div>
                <div style={{ background: '#fef9c3', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#ca8a04' }}>Build</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-600 rounded-full" />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-slate-900 rounded-full z-10" />
      </div>
    </div>
  )
}

// ─── Main Flutter Component ────────────────────────────────────────────────────

export default function FlutterLearning() {
  const [activeSection, setActiveSection] = useState(flutterSections[0])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border p-5" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 font-bold"
            style={{ background: 'color-mix(in srgb, #54c5f8 18%, transparent)', border: '1px solid color-mix(in srgb, #54c5f8 35%, transparent)', color: '#54c5f8' }}>
            F
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Flutter</h1>
            <p className="text-xs mb-2" style={{ color: 'var(--foreground-muted)' }}>Google&apos;s UI toolkit for cross-platform apps</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              Flutter lets you build natively compiled apps for mobile, web, and desktop from a single Dart codebase.
              It uses its own rendering engine (Skia / Impeller) so UI looks identical on every platform.
            </p>
          </div>
          <div className="hidden lg:block ml-auto shrink-0">
            <FlutterPhoneMockup />
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {flutterSections.map(section => (
          <motion.button
            key={section.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveSection(section)}
            className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium border"
            style={activeSection.id === section.id
              ? { background: '#54c5f8', color: '#0c4a6e', borderColor: '#54c5f8' }
              : { background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }}
          >
            {section.title}
          </motion.button>
        ))}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-xl border p-5 space-y-6"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>{activeSection.title}</h2>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
              {activeSection.content.description}
            </p>
          </div>

          {activeSection.content.subsections.map((sub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            >
              <SubsectionCard subsection={sub} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Flutter Playground */}
      <FlutterPlayground />
    </div>
  )
}

// ─── Flutter Playground ───────────────────────────────────────────────────────

const FLUTTER_EXAMPLES = [
  {
    label: 'Hello Widget',
    code: `import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Hello Flutter')),
        body: Center(
          child: Text(
            'Hello, Flutter! 🎉',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    ),
  );
}`,
  },
  {
    label: 'Stateful Counter',
    code: `import 'package:flutter/material.dart';

void main() => runApp(MaterialApp(home: CounterApp()));

class CounterApp extends StatefulWidget {
  @override
  _CounterAppState createState() => _CounterAppState();
}

class _CounterAppState extends State<CounterApp> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Counter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Count: \$_count', style: TextStyle(fontSize: 32)),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () => setState(() => _count++),
                  child: Text('+'),
                ),
                SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () => setState(() => _count--),
                  child: Text('-'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`,
  },
  {
    label: 'ListView',
    code: `import 'package:flutter/material.dart';

void main() {
  final items = ['Apple 🍎', 'Banana 🍌', 'Cherry 🍒', 'Mango 🥭'];
  runApp(MaterialApp(
    home: Scaffold(
      appBar: AppBar(title: Text('Fruit List')),
      body: ListView.separated(
        itemCount: items.length,
        separatorBuilder: (_, __) => Divider(),
        itemBuilder: (context, index) => ListTile(
          leading: CircleAvatar(child: Text('\${index + 1}')),
          title: Text(items[index]),
        ),
      ),
    ),
  ));
}`,
  },
]

function runDartSimulated(code: string): string[] {
  const outputs: string[] = []
  // Extract print statements and simulate their output
  const printRegex = /print\s*\(\s*(['"`])(.+?)\1\s*\)/g
  let match
  while ((match = printRegex.exec(code)) !== null) {
    outputs.push(match[2])
  }
  if (outputs.length === 0) {
    // Try print with interpolation
    const lines = code.split('\n')
    for (const line of lines) {
      const m = line.match(/^\s*print\s*\((.+)\)\s*;/)
      if (m) outputs.push(`→ ${m[1].replace(/['"]/g, '').trim()}`)
    }
  }
  if (outputs.length === 0) {
    outputs.push('(No print statements found – output shown in preview)')
  }
  return outputs
}

function FlutterPlayground() {
  const [code, setCode] = useState(FLUTTER_EXAMPLES[0].code)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [showSnippets, setShowSnippets] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const handleRun = useCallback(() => {
    setConsoleOutput(runDartSimulated(code))
    setHasRun(true)
  }, [code])

  const handleCopy = () => {
    copyToClipboard(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
  }

  // Build a simple phone-mock HTML preview of the Dart widget structure
  const buildPreview = () => {
    const appBarMatch = code.match(/AppBar\s*\(\s*title:\s*Text\s*\(\s*['"](.+?)['"]\s*\)/)
    const appBarTitle = appBarMatch ? appBarMatch[1] : 'Flutter App'
    const bodyTexts: string[] = []
    const textRegex = /Text\s*\(\s*['"](.+?)['"]/g
    let m
    while ((m = textRegex.exec(code)) !== null) {
      if (m[1] !== appBarTitle) bodyTexts.push(m[1])
    }
    const listItems: string[] = []
    // Extract array items for list preview
    const arrayMatch = code.match(/\[([^\]]+)\]/)
    if (arrayMatch) {
      const items = arrayMatch[1].match(/['"]([^'"]+)['"]/g)
      if (items) listItems.push(...items.map(i => i.replace(/['"]/g, '')))
    }

    const hasCounter = code.includes('_count') || code.includes('count')
    const hasList = code.includes('ListView') || listItems.length > 0

    return `<div style="font-family:system-ui,sans-serif;background:#f8fafc;height:100%;display:flex;flex-direction:column;">
      <div style="background:#6366f1;color:white;padding:12px 16px;font-weight:bold;font-size:14px;">${appBarTitle}</div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:${hasList ? 'flex-start' : 'center'};padding:16px;gap:12px;">
        ${hasList && listItems.length > 0
          ? listItems.map((item, i) => `<div style="width:100%;padding:12px 16px;background:white;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.08);display:flex;align-items:center;gap:12px;"><span style="width:28px;height:28px;background:#6366f1;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">${i+1}</span><span style="font-size:14px;">${item}</span></div>`).join('')
          : hasCounter
            ? `<div style="text-align:center;"><p style="font-size:32px;font-weight:bold;margin-bottom:16px;">Count: 0</p><div style="display:flex;gap:16px;"><button style="padding:10px 24px;background:#6366f1;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;">+</button><button style="padding:10px 24px;background:#ef4444;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;">-</button></div></div>`
            : bodyTexts.map(t => `<p style="font-size:16px;color:#1e293b;margin:0;">${t}</p>`).join('')
        }
      </div>
    </div>`
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
        <div className="flex items-center gap-2">
          <Code2 size={15} style={{ color: '#54c5f8' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Flutter Playground</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'color-mix(in srgb, #54c5f8 15%, transparent)', color: '#54c5f8' }}>Dart</span>
        </div>
        <div className="flex gap-2">
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
                  {FLUTTER_EXAMPLES.map((ex, i) => (
                    <button key={i} onClick={() => { setCode(ex.code); setShowSnippets(false); setConsoleOutput([]); setHasRun(false) }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Editor */}
        <div className="flex flex-col border-r" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>main.dart</span>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 text-white rounded-lg text-xs font-medium"
              style={{ background: '#54c5f8' }}>
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
            style={{ background: 'var(--color-bg)', color: 'var(--foreground)', minHeight: 340 }}
          />
          {/* Console Output */}
          {hasRun && (
            <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
                <Terminal size={12} style={{ color: 'var(--foreground-muted)' }} />
                <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>Debug Console</span>
              </div>
              <div className="p-3 font-mono text-xs space-y-0.5 max-h-24 overflow-y-auto" style={{ background: 'var(--color-bg)' }}>
                {consoleOutput.map((line, i) => (
                  <div key={i} style={{ color: 'var(--foreground)' }}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Preview */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
            <Monitor size={13} style={{ color: 'var(--foreground-muted)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--foreground-muted)' }}>Widget Preview</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--color-bg)', minHeight: 340 }}>
            {hasRun ? (
              <div className="relative" style={{ width: 240, height: 420 }}>
                <div className="absolute inset-0 rounded-[32px] border-4 border-slate-700 bg-black shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-1.5 bg-black">
                    <span className="text-white text-[10px] font-medium">9:41</span>
                    <span className="text-white text-[10px]">●●●</span>
                  </div>
                  <div className="overflow-auto bg-white" style={{ height: 'calc(100% - 28px)' }}
                    dangerouslySetInnerHTML={{ __html: buildPreview() }} />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-10" />
              </div>
            ) : (
              <div className="text-center space-y-3" style={{ color: 'var(--foreground-muted)' }}>
                <Monitor size={40} className="opacity-20 mx-auto" />
                <p className="text-sm">Click <strong>Run</strong> to preview the widget</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
