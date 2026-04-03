'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronRight } from 'lucide-react'
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
    </div>
  )
}
