'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import type { ChatMessage as ChatMessageType, ChatResponseData } from '@/lib/chat/chatTypes';
import { processQuery } from '@/lib/chat/chatEngine';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';

function getGreetings(name?: string): string[] {
  const n = name || 'there';
  return [
    `Good morning, ${n}! I'm Finley, your EasyPay data sidekick. I can dig into merchants, territories, reps, KPIs — you name it. What are you curious about?`,
    `Hey ${n}! Finley here — I live and breathe your EasyPay data. Ask me anything about your portfolio, and I'll pull the numbers for you.`,
    `Welcome back, ${n}! I'm Finley, ready to crunch some numbers. What would you like to explore today?`,
  ];
}

const STARTER_SUGGESTIONS = [
  'Give me a quick summary',
  'Who are our top merchants?',
  'How is RIC-4 performing?',
  'Any merchants at risk?',
];

function createWelcomeMessage(name?: string): ChatMessageType {
  const greetings = getGreetings(name);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? greetings[0] : hour < 17 ? greetings[1] : greetings[2];
  return {
    id: 'welcome',
    role: 'assistant',
    content: greeting,
    suggestions: STARTER_SUGGESTIONS,
    timestamp: Date.now(),
  };
}

type Props = {
  open: boolean;
  onClose: () => void;
  userName?: string;
  onSaveReport?: (name: string, data: ChatResponseData, query?: string) => void;
};

export default function ChatPanel({ open, onClose, userName, onSaveReport }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>([createWelcomeMessage(userName)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);
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
    setMessageCount(prev => prev + 1);

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
        content: "Hmm, I hit a snag pulling that data. Mind trying again? If it keeps happening, try rephrasing your question.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([createWelcomeMessage(userName)]);
    setMessageCount(0);
  };

  const handleSaveReport = useCallback((name: string, data: ChatResponseData, query?: string) => {
    onSaveReport?.(name, data, query);
    setSaveToast(name);
    setTimeout(() => setSaveToast(null), 2000);
  }, [onSaveReport]);

  // Find the user query that preceded an assistant message with data
  const findQueryForMessage = useCallback((msgIndex: number) => {
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].content;
    }
    return undefined;
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open || typeof document === 'undefined') return null;

  const panel = (
    <div className="fixed bottom-6 right-6 w-[420px] max-h-[85vh] bg-[var(--color-card-bg)] rounded-2xl shadow-2xl border border-[var(--color-border)] flex flex-col z-[9998] animate-slideUp max-sm:inset-4 max-sm:w-auto max-sm:max-h-none max-sm:bottom-4 max-sm:right-4 max-sm:rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 overflow-hidden">
            <Image src="/finley/finley-02.svg" alt="Finley" width={32} height={32} className="object-contain mt-1" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Finley</div>
            <div className="text-[10px] text-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block animate-pulse" />
              Ready to help
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messageCount > 0 && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
              title="New conversation"
            >
              <RotateCcw size={14} className="text-white/80" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X size={16} className="text-white/80" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 min-h-0 bg-[var(--color-content-bg)]">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSuggestionClick={(s) => handleSend(s)}
            onSaveReport={onSaveReport ? (name, data) => handleSaveReport(name, data, findQueryForMessage(idx)) : undefined}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Save toast */}
      {saveToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#1a2332] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-fadeInUp whitespace-nowrap z-10">
          Saved &ldquo;{saveToast}&rdquo;
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-card-bg)]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Finley anything..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 text-sm bg-[var(--color-hover-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)] disabled:opacity-50 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-md transition-all disabled:opacity-40 disabled:hover:shadow-none cursor-pointer active:scale-95"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[9px] text-[var(--color-text-muted)]">Finley uses your dashboard data to answer questions</span>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
