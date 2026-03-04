'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/chat/chatTypes';
import { processQuery } from '@/lib/chat/chatEngine';
import ChatMessage, { TypingIndicator } from './ChatMessage';

const WELCOME_MESSAGE: ChatMessageType = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your EasyPay data assistant. Ask me anything about merchants, territories, reps, KPIs, or any dashboard data.",
  suggestions: [
    'Give me a summary',
    'Top merchants by volume',
    'How is RIC-4 performing?',
    'Show declining merchants',
  ],
  timestamp: Date.now(),
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatPanel({ open, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const query = (text || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await processQuery(query);
      const assistantMsg: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        data: response.data,
        suggestions: response.suggestions,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong processing your question. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open || typeof document === 'undefined') return null;

  const panel = (
    <div className="fixed bottom-24 right-6 w-[420px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] flex flex-col z-[9998] animate-slideUp max-sm:inset-4 max-sm:w-auto max-sm:max-h-none max-sm:bottom-4 max-sm:right-4 max-sm:rounded-xl">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-50 to-white rounded-t-2xl max-sm:rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--color-ep-green)] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">EP Data Assistant</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">Ask about your dashboard data</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={16} className="text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 min-h-0">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSuggestionClick={(s) => handleSend(s)}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about merchants, KPIs, territories..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-ep-green)] focus:border-transparent placeholder:text-[var(--color-text-muted)] disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg bg-[var(--color-ep-green)] text-white hover:brightness-110 transition-all disabled:opacity-40 disabled:hover:brightness-100 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
