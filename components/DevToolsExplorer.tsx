'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Network, Gauge, Layout, Database, Bug, Cpu, Shield, ChevronRight, type LucideIcon } from 'lucide-react'
import { devToolsCategories } from '@/lib/devtools-data'
import CodeBlock from './CodeBlock'
import CodeRunner from './CodeRunner'
import AIAssistant from './AIAssistant'

const iconMap: Record<string, LucideIcon> = {
  Terminal, Network, Gauge, Layout, Database, Bug, Cpu, Shield
}

export default function DevToolsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(devToolsCategories[0])
  const [selectedExample, setSelectedExample] = useState(0)
  const Icon = iconMap[selectedCategory.icon] || Terminal

  return (
    <div className="flex h-full gap-4">
      <div className="w-56 flex-shrink-0 bg-[#12121a] rounded-xl border border-[#1e1e2e] p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider px-2 py-1">Categories</p>
        {devToolsCategories.map((cat) => {
          const CatIcon = iconMap[cat.icon] || Terminal
          const isSelected = cat.id === selectedCategory.id
          return (
            <motion.button key={cat.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedCategory(cat); setSelectedExample(0) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${isSelected ? 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e1e2e]'}`}>
              <CatIcon size={16} />
              <span className="font-medium">{cat.name}</span>
              {isSelected && <ChevronRight size={14} className="ml-auto" />}
            </motion.button>
          )
        })}
      </div>
      <div className="flex-1 flex gap-4 min-w-0">
        <div className="flex-1 space-y-4 min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={selectedCategory.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-lg border border-[#6366f1]/30 flex items-center justify-center">
                    <Icon size={20} className="text-[#6366f1]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCategory.name}</h2>
                    <p className="text-xs text-[#64748b]">{selectedCategory.examples.length} examples</p>
                  </div>
                </div>
                <p className="text-[#64748b] text-sm leading-relaxed">{selectedCategory.description}</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedCategory.examples.map((ex, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={() => setSelectedExample(i)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedExample === i ? 'bg-[#6366f1] text-white' : 'bg-[#12121a] border border-[#1e1e2e] text-[#64748b] hover:text-white hover:border-[#6366f1]/50'}`}>
                    {ex.title}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={selectedExample} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedCategory.examples[selectedExample].title}</h3>
                    <p className="text-sm text-[#64748b] mt-1">{selectedCategory.examples[selectedExample].description}</p>
                  </div>
                  <CodeBlock code={selectedCategory.examples[selectedExample].code} />
                  <CodeRunner code={selectedCategory.examples[selectedExample].code} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="w-80 flex-shrink-0 h-[600px]">
          <AIAssistant category={selectedCategory.id} />
        </div>
      </div>
    </div>
  )
}
