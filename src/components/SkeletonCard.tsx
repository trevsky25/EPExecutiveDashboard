'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-2.5 bg-[var(--color-hover-bg)] rounded w-1/2" />
    </div>
  );
}
