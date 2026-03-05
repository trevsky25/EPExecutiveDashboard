'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/chat/chatTypes';
import ChatSuggestions from './ChatSuggestions';
import Image from 'next/image';
import { Download, Bookmark } from 'lucide-react';
import { downloadCSV } from '@/lib/exportCSV';
import type { ChatResponseData } from '@/lib/chat/chatTypes';

type Props = {
  message: ChatMessageType;
  onSuggestionClick: (suggestion: string) => void;
  onSaveReport?: (name: string, data: ChatResponseData, query?: string) => void;
};

function FinleyAvatar({ pose = '03' }: { pose?: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[var(--color-severity-green-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2 overflow-hidden">
      <Image src={`/finley/finley-${pose}.svg`} alt="Finley" width={28} height={28} className="object-contain mt-1" />
    </div>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

export default function ChatMessage({ message, onSuggestionClick, onSaveReport }: Props) {
  const isUser = message.role === 'user';
  const isWelcome = message.id === 'welcome';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && <FinleyAvatar pose={isWelcome ? '01' : '03'} />}
      <div className={`max-w-[85%]`}>
        {/* Text bubble */}
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm shadow-sm'
              : 'bg-[var(--color-card-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={`text-[9px] text-[var(--color-text-muted)] mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {formatTime(message.timestamp)}
        </div>

        {/* Data attachment */}
        {message.data && (
          <div className="mt-1.5">
            {message.data.type === 'table' && <DataTable data={message.data} onSave={onSaveReport} />}
            {message.data.type === 'kpi' && <DataKPI data={message.data} onSave={onSaveReport} />}
            {message.data.type === 'list' && <DataList data={message.data} onSave={onSaveReport} />}
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

function DataTable({ data, onSave }: { data: { type: 'table'; title: string; headers: string[]; rows: (string | number)[][] }; onSave?: (name: string, data: ChatResponseData) => void }) {
  const maxRows = 8;
  const visibleRows = data.rows.slice(0, maxRows);
  const remaining = data.rows.length - maxRows;

  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-card-bg)] shadow-sm">
      <div className="px-3 py-1.5 bg-[var(--color-hover-bg)] border-b border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {data.title}
        </span>
        <div className="flex items-center gap-1">
          {onSave && (
            <button
              onClick={() => onSave(data.title, data)}
              className="flex items-center gap-1 text-[10px] text-[var(--color-ep-blue)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Save report"
            >
              <Bookmark size={10} />
              Save
            </button>
          )}
          <button
            onClick={() => downloadCSV(
              `Finley_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}`,
              data.headers,
              data.rows,
            )}
            className="flex items-center gap-1 text-[10px] text-[var(--color-ep-green)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Download as CSV"
          >
            <Download size={10} />
            CSV
          </button>
        </div>
      </div>
      <div className="max-h-[240px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {data.headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] sticky top-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] transition-colors">
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
        <div className="px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] border-t border-[var(--color-border)]">
          and {remaining} more...
        </div>
      )}
    </div>
  );
}

function DataKPI({ data, onSave }: { data: { type: 'kpi'; items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] }; onSave?: (name: string, data: ChatResponseData) => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5">
        {data.items.map((item) => {
          const colorClass =
            item.status === 'green' ? 'text-[var(--color-ep-green)]'
            : item.status === 'orange' ? 'text-[var(--color-ep-orange)]'
            : item.status === 'red' ? 'text-[var(--color-ep-red)]'
            : 'text-[var(--color-text-primary)]';
          return (
            <div key={item.label} className="bg-[var(--color-hover-bg)] rounded-xl p-2.5 border border-[var(--color-border)]">
              <div className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">{item.label}</div>
              <div className={`text-sm font-bold tabular-nums ${colorClass}`}>{item.value}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        {onSave && (
          <button
            onClick={() => onSave('KPI Summary', data)}
            className="flex items-center gap-1 text-[10px] text-[var(--color-ep-blue)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Save report"
          >
            <Bookmark size={10} />
            Save
          </button>
        )}
        <button
          onClick={() => downloadCSV(
            `Finley_KPIs_${new Date().toISOString().slice(0, 10)}`,
            ['Metric', 'Value'],
            data.items.map(item => [item.label, item.value]),
          )}
          className="flex items-center gap-1 text-[10px] text-[var(--color-ep-green)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
          title="Download as CSV"
        >
          <Download size={10} />
          Download CSV
        </button>
      </div>
    </div>
  );
}

function DataList({ data, onSave }: { data: { type: 'list'; title: string; items: string[] }; onSave?: (name: string, data: ChatResponseData) => void }) {
  return (
    <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {data.title}
        </span>
        <div className="flex items-center gap-1">
          {onSave && (
            <button
              onClick={() => onSave(data.title, data)}
              className="flex items-center gap-1 text-[10px] text-[var(--color-ep-blue)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Save report"
            >
              <Bookmark size={10} />
              Save
            </button>
          )}
          <button
            onClick={() => downloadCSV(
              `Finley_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}`,
              [data.title],
              data.items.map(item => [item]),
            )}
            className="flex items-center gap-1 text-[10px] text-[var(--color-ep-green)] hover:bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Download as CSV"
          >
            <Download size={10} />
            CSV
          </button>
        </div>
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
      <FinleyAvatar pose="04" />
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-chatBounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] italic">Finley is thinking...</span>
      </div>
    </div>
  );
}
