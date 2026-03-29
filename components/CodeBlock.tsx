'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'

interface CodeBlockProps {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyToClipboard(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => { /* copy failed — leave button in default state */ })
  }

  const highlight = (src: string) => {
    return src
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(\/\/[^\n]*)/g, '<span style="color:#64748b">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|new|class|import|export|default|async|await|typeof|instanceof|void|null|undefined|true|false)\b/g, '<span style="color:#c792ea">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#c3e88d">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span style="color:#82aaff">$1</span>')
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#1e1e2e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0f] border-b border-[#1e1e2e]">
        <span className="text-xs text-[#64748b] font-mono">{language}</span>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} className="text-[#64748b] hover:text-white transition-colors">
          {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
        </motion.button>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto bg-[#0a0a0f] text-[#e2e8f0] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  )
}
