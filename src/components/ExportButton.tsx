'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';

export type ExportFormat = 'csv' | 'pdf';

type ExportButtonProps = {
  onExport: (format: ExportFormat) => void;
};

export default function ExportButton({ onExport }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover-bg)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
      >
        <Download size={13} />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--color-card-bg)] rounded-lg shadow-xl border border-[var(--color-border)] z-50 overflow-hidden animate-fadeInUp">
          <button
            onClick={() => { onExport('csv'); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-[var(--color-ep-green)]" />
            Export as CSV
          </button>
          <button
            onClick={() => { onExport('pdf'); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer border-t border-[var(--color-border)]"
          >
            <FileText size={14} className="text-[var(--color-ep-red)]" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
