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
    <div className="flex flex-col h-full rounded-xl border overflow-hidden" style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
        <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-lg flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>AI Assistant</span>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
          <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-lg flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                }`}
                style={
                  message.role === 'user'
                    ? { background: 'var(--color-accent)', color: '#fff' }
                    : { background: 'var(--color-border)', color: 'var(--foreground)' }
                }
              >
                {message.content}
                {message.streaming && <span className="inline-block w-1 h-4 ml-1 animate-pulse align-middle" style={{ background: 'var(--color-accent)' }} />}
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1" style={{ background: 'var(--color-border)' }}>
                  <User size={14} style={{ color: 'var(--foreground-muted)' }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs mb-2 flex items-center gap-1" style={{ color: 'var(--foreground-muted)' }}><Zap size={10} />Quick suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                className="text-xs px-2 py-1 rounded-md transition-colors"
                style={{ background: 'var(--color-border)', color: 'var(--foreground-muted)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about DevTools..."
            className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors border"
            style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--foreground)' }} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 disabled:opacity-50 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}>
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
