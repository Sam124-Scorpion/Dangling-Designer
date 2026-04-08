'use client'
import { useState, useRef, useEffect } from 'react'
import { Message } from '@/lib/types'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'

const QUICK_PROMPTS = [
  'Casual day out look under ₹1500',
  'Office outfit for women — smart casual',
  'Party wear for men under ₹2000',
  'Minimalist summer look',
  'Date night outfit — romantic vibe',
  'Ethnic wear for a wedding function',
]

const WELCOME: Message = {
  role: 'assistant',
  content: '',
  parsed: {
    message: "Hey! I'm your personal AI stylist. Tell me what you're looking for — describe the occasion, your vibe, budget, or even just a mood. I'll suggest outfits with images and shop links.",
    outfits: [],
    followup: '',
  },
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text?: string) {
    const userText = (text ?? input).trim()
    if (!userText || loading) return

    setInput('')
    const userMsg: Message = { role: 'user', content: userText }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const botMsg: Message = {
        role: 'assistant',
        content: data.raw,
        parsed: data.parsed,
      }
      setMessages([...history, botMsg])
    } catch {
      setMessages([
        ...history,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/svgs/dd-ico.svg" 
          alt="Dangling Designer" 
          className="w-10 h-10 object-contain"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dangling Designer - AI Stylist</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Online
          </p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      {/* Quick prompts — only show before first user message */}
      {messages.length === 1 && (
        <div className="max-w-3xl mx-auto w-full px-4 pb-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Describe your style, occasion, or budget..."
            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:bg-white dark:focus:bg-gray-700 transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 dark:bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 dark:hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
