'use client';

type StatusBadgeProps = {
  status: 'Healthy' | 'Stable' | 'Watch' | 'Critical' | 'Coming Soon';
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors = {
    Healthy: 'bg-[#d1fae5] text-[#059669]',
    Stable: 'bg-[#dbeafe] text-[#2563eb]',
    Watch: 'bg-[#fef3c7] text-[#d97706]',
    Critical: 'bg-[#fee2e2] text-[#dc2626]',
    'Coming Soon': 'bg-[#f1f5f9] text-[#64748b]',
  };

  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}
