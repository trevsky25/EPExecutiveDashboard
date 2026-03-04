'use client';

type ChartCardProps = {
  title: string;
  badge?: string;
  badgeColor?: 'green' | 'red' | 'orange' | 'blue';
  children: React.ReactNode;
  className?: string;
};

export default function ChartCard({ title, badge, badgeColor = 'green', children, className = '' }: ChartCardProps) {
  const badgeColors = {
    green: 'bg-[#d1fae5] text-[#059669]',
    red: 'bg-[#fee2e2] text-[#dc2626]',
    orange: 'bg-[#fef3c7] text-[#d97706]',
    blue: 'bg-[#dbeafe] text-[#2563eb]',
  };

  return (
    <div className={`bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5 min-w-0 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}
