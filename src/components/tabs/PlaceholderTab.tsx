'use client';

import { Clock } from 'lucide-react';

type PlaceholderTabProps = {
  department: string;
  pointOfContact: string;
  meetingDate?: string;
  status: string;
  description: string;
};

export default function PlaceholderTab({ department, pointOfContact, meetingDate, status, description }: PlaceholderTabProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-text-muted)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-text-muted)]">
          {department}
        </span>
      </div>

      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-content-bg)] flex items-center justify-center mx-auto mb-6">
          <Clock size={28} className="text-[var(--color-text-muted)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          {department} — Coming Soon
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          {description}
        </p>

        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5 text-left">
          <h3 className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-3">EAC Requirements Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Point of Contact</span>
              <span className="font-medium">{pointOfContact}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Status</span>
              <span className={`font-medium ${status === 'Not Started' ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-ep-orange)]'}`}>{status}</span>
            </div>
            {meetingDate && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Meeting Date</span>
                <span className="font-medium">{meetingDate}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Fields Captured</span>
              <span className="font-medium text-[var(--color-text-muted)]">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
