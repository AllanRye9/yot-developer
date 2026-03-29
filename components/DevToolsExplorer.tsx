'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Network, Gauge, Layout, Database, Bug, Cpu, Shield, ChevronRight, ChevronDown, Bot, type LucideIcon } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const Icon = iconMap[selectedCategory.icon] || Terminal

  const handleSelectCategory = (cat: typeof devToolsCategories[0]) => {
    setSelectedCategory(cat)
    setSelectedExample(0)
    setSidebarOpen(false)
  }

  const CategoryList = () => (
    <>
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wider px-2 py-1">Categories</p>
      {devToolsCategories.map((cat) => {
        const CatIcon = iconMap[cat.icon] || Terminal
        const isSelected = cat.id === selectedCategory.id
        return (
          <motion.button
            key={cat.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectCategory(cat)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
              isSelected
                ? 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'
                : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#1e1e2e]'
            }`}
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
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#12121a] border border-[#1e1e2e] text-sm font-medium text-white"
        >
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-[#6366f1]" />
            {selectedCategory.name}
          </div>
          <motion.span animate={{ rotate: sidebarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-[#64748b]" />
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
              <div className="mt-2 bg-[#12121a] rounded-xl border border-[#1e1e2e] p-3 space-y-1">
                <CategoryList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main layout */}
      <div className="flex gap-4">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0 bg-[#12121a] rounded-xl border border-[#1e1e2e] p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
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
              <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-lg border border-[#6366f1]/30 flex items-center justify-center shrink-0"
                  >
                    <Icon size={20} className="text-[#6366f1]" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">{selectedCategory.name}</h2>
                    <p className="text-xs text-[#64748b]">{selectedCategory.examples.length} examples</p>
                  </div>
                </div>
                <p className="text-[#64748b] text-sm leading-relaxed">{selectedCategory.description}</p>
              </div>

              {/* Example tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {selectedCategory.examples.map((ex, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedExample(i)}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      selectedExample === i
                        ? 'bg-[#6366f1] text-white shadow-md shadow-[#6366f1]/30'
                        : 'bg-[#12121a] border border-[#1e1e2e] text-[#64748b] hover:text-white hover:border-[#6366f1]/50'
                    }`}
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
                  className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-4 sm:p-6 space-y-4"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      {selectedCategory.examples[selectedExample].title}
                    </h3>
                    <p className="text-sm text-[#64748b] mt-1">
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
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#12121a] border border-[#1e1e2e] text-sm font-medium text-white"
            >
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-[#8b5cf6]" />
                AI Assistant
              </div>
              <motion.span animate={{ rotate: aiOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-[#64748b]" />
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
