'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Network, Gauge, Layout, Database, Bug, Cpu, Shield, ChevronRight, ChevronDown, Bot, ArrowRight, type LucideIcon } from 'lucide-react'
import { devToolsCategories, type ExecutionStep } from '@/lib/devtools-data'
import CodeBlock from './CodeBlock'
import CodeRunner from './CodeRunner'
import AIAssistant from './AIAssistant'

const iconMap: Record<string, LucideIcon> = {
  Terminal, Network, Gauge, Layout, Database, Bug, Cpu, Shield
}

// ─── Execution Flow Diagram ──────────────────────────────────────────────────

function ExecutionDiagram({ steps }: { steps: ExecutionStep[] }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--foreground-muted)' }}>
        How It Executes
      </p>
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-1 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center px-3 py-2 rounded-lg border text-center min-w-[72px]"
              style={{ borderColor: step.color + '40', background: step.color + '15' }}
            >
              <span className="text-[11px] font-semibold leading-tight" style={{ color: step.color }}>
                {step.label}
              </span>
              {step.sublabel && (
                <span className="text-[9px] mt-0.5 leading-tight" style={{ color: 'var(--foreground-muted)' }}>
                  {step.sublabel}
                </span>
              )}
            </motion.div>
            {i < steps.length - 1 && (
              <ArrowRight size={13} className="flex-shrink-0 mx-0.5" style={{ color: 'var(--foreground-muted)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import { trackFeatureUsage } from '@/lib/analytics'

export default function DevToolsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(devToolsCategories[0])
  const [selectedExample, setSelectedExample] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const Icon = iconMap[selectedCategory.icon] || Terminal

  const handleSelectCategory = (cat: typeof devToolsCategories[0]) => {
    setSelectedCategory(cat)
    setSelectedExample(0)
    setSidebarOpen(false)
    trackFeatureUsage(`DevTools:${cat.name}`)
  }

  const CategoryList = () => (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1" style={{ color: 'var(--foreground-muted)' }}>Categories</p>
      {devToolsCategories.map((cat) => {
        const CatIcon = iconMap[cat.icon] || Terminal
        const isSelected = cat.id === selectedCategory.id
        return (
          <motion.button
            key={cat.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectCategory(cat)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors border"
            style={
              isSelected
                ? { background: 'color-mix(in srgb, var(--color-accent) 20%, transparent)', color: 'var(--color-accent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)' }
                : { color: 'var(--foreground-muted)', borderColor: 'transparent' }
            }
          >
            <CatIcon size={16} />
            <span className="font-medium">{cat.name}</span>
            {isSelected && <ChevronRight size={14} className="ml-auto" />}
          </motion.button>
        )
      })}
    </>
  )

  return (
    <div className="space-y-4">
      {/* Mobile: category selector bar */}
      <div className="md:hidden">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setSidebarOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
        >
          <div className="flex items-center gap-2">
            <Icon size={16} style={{ color: 'var(--color-accent)' }} />
            {selectedCategory.name}
          </div>
          <motion.span animate={{ rotate: sidebarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} style={{ color: 'var(--foreground-muted)' }} />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border p-3 space-y-1" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <CategoryList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main layout */}
      <div className="flex gap-4">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0 rounded-xl border p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <CategoryList />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Category header */}
              <div className="rounded-xl border p-4 sm:p-6" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', borderColor: 'color-mix(in srgb, var(--color-accent) 30%, transparent)' }}
                  >
                    <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                  </motion.div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--foreground)' }}>{selectedCategory.name}</h2>
                    <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>{selectedCategory.examples.length} examples</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground-muted)' }}>{selectedCategory.description}</p>
                {selectedCategory.executionFlow && selectedCategory.executionFlow.length > 0 && (
                  <ExecutionDiagram steps={selectedCategory.executionFlow} />
                )}
              </div>

              {/* Example tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {selectedCategory.examples.map((ex, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedExample(i)}
                    className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border"
                    style={
                      selectedExample === i
                        ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
                        : { background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground-muted)' }
                    }
                  >
                    {ex.title}
                  </motion.button>
                ))}
              </div>

              {/* Example content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedExample}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border p-4 sm:p-6 space-y-4"
                  style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                      {selectedCategory.examples[selectedExample].title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                      {selectedCategory.examples[selectedExample].description}
                    </p>
                  </div>
                  <CodeBlock code={selectedCategory.examples[selectedExample].code} />
                  <CodeRunner code={selectedCategory.examples[selectedExample].code} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Mobile AI Assistant toggle */}
          <div className="xl:hidden">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setAiOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }}
            >
              <div className="flex items-center gap-2">
                <Bot size={16} style={{ color: 'var(--color-accent-light)' }} />
                AI Assistant
              </div>
              <motion.span animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} style={{ color: 'var(--foreground-muted)' }} />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {aiOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="h-[420px]">
                    <AIAssistant category={selectedCategory.id} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop AI Assistant */}
        <div className="hidden xl:block w-80 flex-shrink-0 h-[600px]">
          <AIAssistant category={selectedCategory.id} />
        </div>
      </div>
    </div>
  )
}
