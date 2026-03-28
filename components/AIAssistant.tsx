'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react'
import { getAIResponse, quickSuggestions } from '@/lib/ai-responses'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

interface AIAssistantProps { category?: string }

export default function AIAssistant({ category }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'assistant',
    content: `Hi! I'm your DevTools AI assistant. Ask me anything about ${category ? `the ${category} API` : 'browser developer tools'}.`
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const streamText = (text: string, messageId: string) => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: text.slice(0, i), streaming: i < text.length } : m))
        i++
      } else {
        clearInterval(interval)
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, streaming: false } : m))
      }
    }, 15)
  }

  const handleSend = async (query?: string) => {
    const text = query || input
    if (!text.trim() || isLoading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '', streaming: true }])
    setInput(''); setIsLoading(true)
    const response = await getAIResponse(text, category)
    setIsLoading(false)
    streamText(response, assistantId)
  }

  return (
    <div className="flex flex-col h-full bg-[#12121a] rounded-xl border border-[#1e1e2e] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-white">AI Assistant</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
          <span className="text-xs text-[#64748b]">Online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'user' ? 'bg-[#6366f1] text-white rounded-tr-sm' : 'bg-[#1e1e2e] text-[#e2e8f0] rounded-tl-sm'
              }`}>
                {message.content}
                {message.streaming && <span className="inline-block w-1 h-4 bg-[#6366f1] ml-1 animate-pulse align-middle" />}
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 bg-[#1e1e2e] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                  <User size={14} className="text-[#64748b]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-[#64748b] mb-2 flex items-center gap-1"><Zap size={10} />Quick suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                className="text-xs px-2 py-1 bg-[#1e1e2e] hover:bg-[#2e2e3e] text-[#64748b] hover:text-[#e2e8f0] rounded-md transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 border-t border-[#1e1e2e]">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about DevTools..."
            className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] transition-colors" />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 bg-[#6366f1] hover:bg-[#5457e5] disabled:opacity-50 rounded-lg flex items-center justify-center transition-colors">
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
