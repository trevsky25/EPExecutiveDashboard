'use client';

import { Download } from 'lucide-react';

type ExportButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function ExportButton({ onClick, label = 'Export CSV' }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-lg hover:bg-gray-50 hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
    >
      <Download size={13} />
      {label}
    </button>
  );
}
