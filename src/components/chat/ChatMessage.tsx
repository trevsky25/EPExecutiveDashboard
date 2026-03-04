'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/chat/chatTypes';
import ChatSuggestions from './ChatSuggestions';
import { Bot } from 'lucide-react';

type Props = {
  message: ChatMessageType;
  onSuggestionClick: (suggestion: string) => void;
};

export default function ChatMessage({ message, onSuggestionClick }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[var(--color-ep-green)] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? '' : ''}`}>
        {/* Text bubble */}
        <div
          className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
            isUser
              ? 'bg-[var(--color-ep-green)] text-white rounded-br-sm'
              : 'bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Data attachment */}
        {message.data && (
          <div className="mt-2">
            {message.data.type === 'table' && <DataTable data={message.data} />}
            {message.data.type === 'kpi' && <DataKPI data={message.data} />}
            {message.data.type === 'list' && <DataList data={message.data} />}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <ChatSuggestions suggestions={message.suggestions} onClick={onSuggestionClick} />
        )}
      </div>
    </div>
  );
}

// ── Data renderers ──

function DataTable({ data }: { data: { type: 'table'; title: string; headers: string[]; rows: (string | number)[][] } }) {
  const maxRows = 8;
  const visibleRows = data.rows.slice(0, maxRows);
  const remaining = data.rows.length - maxRows;

  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden bg-white">
      <div className="px-3 py-1.5 bg-gray-50 border-b border-[var(--color-border)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {data.title}
        </span>
      </div>
      <div className="max-h-[240px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {data.headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] bg-gray-50 sticky top-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-2.5 py-1.5 text-[var(--color-text-primary)] whitespace-nowrap">
                    {j === 0 ? <span className="font-medium">{cell}</span> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <div className="px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] bg-gray-50 border-t border-[var(--color-border)]">
          and {remaining} more...
        </div>
      )}
    </div>
  );
}

function DataKPI({ data }: { data: { type: 'kpi'; items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] } }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {data.items.map((item) => {
        const colorClass =
          item.status === 'green' ? 'text-[var(--color-ep-green)]'
          : item.status === 'orange' ? 'text-[var(--color-ep-orange)]'
          : item.status === 'red' ? 'text-[var(--color-ep-red)]'
          : 'text-[var(--color-text-primary)]';
        return (
          <div key={item.label} className="bg-gray-50 rounded-lg p-2.5 border border-[var(--color-border)]">
            <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{item.label}</div>
            <div className={`text-sm font-bold tabular-nums ${colorClass}`}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function DataList({ data }: { data: { type: 'list'; title: string; items: string[] } }) {
  return (
    <div className="bg-white rounded-lg border border-[var(--color-border)] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {data.title}
      </div>
      <ul className="space-y-1">
        {data.items.map((item) => (
          <li key={item} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-1.5">
            <span className="text-[var(--color-ep-green)] mt-1">&#8226;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Typing indicator ──
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-6 h-6 rounded-full bg-[var(--color-ep-green)] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-lg rounded-bl-sm px-4 py-2.5 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-chatBounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
