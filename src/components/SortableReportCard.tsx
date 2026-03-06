'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DashboardReportCard from './DashboardReportCard';
import type { SavedReport } from '@/lib/chat/chatTypes';

type SortableReportCardProps = {
  report: SavedReport;
  isEditMode: boolean;
  onUnpin: () => void;
};

export default function SortableReportCard({
  report,
  isEditMode,
  onUnpin,
}: SortableReportCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: report.id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    touchAction: isEditMode ? 'none' as const : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? { ...attributes, ...listeners } : {})}
      className={`relative ${
        isEditMode
          ? 'ring-2 ring-dashed ring-[var(--color-border)] rounded-lg cursor-grab active:cursor-grabbing'
          : ''
      }`}
    >
      <DashboardReportCard
        report={report}
        onUnpin={onUnpin}
        showUnpin={isEditMode}
      />
    </div>
  );
}
