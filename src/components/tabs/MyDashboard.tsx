'use client';

import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Pin, FileText, Pencil, Save, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useDashboard } from '@/lib/DashboardContext';
import { kpiById } from '@/data/availableKPIs';
import { kpiTrendData } from '@/data/kpiTrendData';
import SortableKPICard from '../SortableKPICard';
import SortableReportCard from '../SortableReportCard';
import KPIPinSelector from '../KPIPinSelector';
import ReportPinSelector from '../ReportPinSelector';
import HelpButton from '../HelpButton';
import type { SavedReport } from '@/lib/chat/chatTypes';

type MyDashboardProps = {
  onNavigateTab?: (tab: string) => void;
};

export default function MyDashboard({ onNavigateTab }: MyDashboardProps) {
  const {
    pinnedKPIIds,
    kpiCustomizations,
    pinnedReportIds,
    unpinReport,
    reorderKPIs,
    reorderReports,
  } = useDashboard();

  const [kpiSelectorOpen, setKpiSelectorOpen] = useState(false);
  const [reportSelectorOpen, setReportSelectorOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // ── Edit mode state ──
  const [isEditMode, setIsEditMode] = useState(false);
  const [kpiSnapshot, setKpiSnapshot] = useState<string[] | null>(null);
  const [reportSnapshot, setReportSnapshot] = useState<string[] | null>(null);
  const [localKpiOrder, setLocalKpiOrder] = useState<string[]>([]);
  const [localReportOrder, setLocalReportOrder] = useState<string[]>([]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Load saved reports from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ep-saved-reports');
      if (stored) setSavedReports(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Re-read when report selector closes (in case user pinned new ones)
  useEffect(() => {
    if (!reportSelectorOpen) {
      try {
        const stored = localStorage.getItem('ep-saved-reports');
        if (stored) setSavedReports(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, [reportSelectorOpen]);

  // Sync local order from context when NOT in edit mode
  useEffect(() => {
    if (!isEditMode) {
      setLocalKpiOrder(pinnedKPIIds);
      setLocalReportOrder(pinnedReportIds);
    }
  }, [pinnedKPIIds, pinnedReportIds, isEditMode]);

  // During edit mode: detect new pins and add to local order
  useEffect(() => {
    if (isEditMode) {
      setLocalKpiOrder(prev => {
        const newIds = pinnedKPIIds.filter(id => !prev.includes(id));
        const validIds = prev.filter(id => pinnedKPIIds.includes(id));
        return newIds.length > 0 ? [...validIds, ...newIds] : validIds.length !== prev.length ? validIds : prev;
      });
    }
  }, [pinnedKPIIds, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      setLocalReportOrder(prev => {
        const newIds = pinnedReportIds.filter(id => !prev.includes(id));
        const validIds = prev.filter(id => pinnedReportIds.includes(id));
        return newIds.length > 0 ? [...validIds, ...newIds] : validIds.length !== prev.length ? validIds : prev;
      });
    }
  }, [pinnedReportIds, isEditMode]);

  // ── Edit mode handlers ──
  const enterEditMode = () => {
    setKpiSnapshot([...pinnedKPIIds]);
    setReportSnapshot([...pinnedReportIds]);
    setLocalKpiOrder([...pinnedKPIIds]);
    setLocalReportOrder([...pinnedReportIds]);
    setIsEditMode(true);
  };

  const saveEditMode = () => {
    reorderKPIs(localKpiOrder);
    reorderReports(localReportOrder);
    setKpiSnapshot(null);
    setReportSnapshot(null);
    setIsEditMode(false);
  };

  const cancelEditMode = () => {
    if (kpiSnapshot) reorderKPIs(kpiSnapshot);
    if (reportSnapshot) reorderReports(reportSnapshot);
    setKpiSnapshot(null);
    setReportSnapshot(null);
    setIsEditMode(false);
  };

  // ── Drag handlers ──
  const handleKPIDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalKpiOrder(prev => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleReportDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalReportOrder(prev => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  // ── Derived data ──
  const displayKpiIds = isEditMode ? localKpiOrder : pinnedKPIIds;
  const displayReportIds = isEditMode ? localReportOrder : pinnedReportIds;

  const pinnedKPIs = displayKpiIds.map(id => kpiById.get(id)).filter(Boolean);
  const pinnedReports = displayReportIds
    .map(id => savedReports.find(r => r.id === id))
    .filter(Boolean) as SavedReport[];

  const hasContent = pinnedKPIs.length > 0 || pinnedReports.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid size={20} className="text-[var(--color-ep-green)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">My Dashboard</h2>
            <HelpButton tourId="my-dashboard" />
            {isEditMode && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ep-orange)] bg-[var(--color-ep-orange)]/10 px-2 py-0.5 rounded-full">
                Editing
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            {isEditMode
              ? 'Drag cards to reorder, customize settings, or unpin tiles. Click Save when done.'
              : 'Your personalized view — pin KPIs and reports, customize colors and charts.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={cancelEditMode}
                className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
              >
                <X size={15} />
                Cancel
              </button>
              <button
                onClick={() => setReportSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
              >
                <FileText size={15} />
                Add Reports
              </button>
              <button
                data-tour="md-add"
                onClick={() => setKpiSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add KPIs
              </button>
              <button
                onClick={saveEditMode}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Save size={15} />
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setReportSelectorOpen(true)}
                className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
              >
                <FileText size={15} />
                Add Reports
              </button>
              <button
                data-tour="md-add"
                onClick={() => setKpiSelectorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus size={16} />
                Add KPIs
              </button>
              {hasContent && (
                <button
                  onClick={enterEditMode}
                  className="flex items-center gap-2 px-3 py-2 border border-[var(--color-ep-blue)] text-[var(--color-ep-blue)] text-sm font-medium rounded-lg hover:bg-[var(--color-ep-blue)]/10 transition-colors cursor-pointer"
                  title="Edit dashboard layout"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {hasContent ? (
        <>
          {/* ── Pinned KPIs Grid ── */}
          {pinnedKPIs.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleKPIDragEnd}
            >
              <SortableContext items={displayKpiIds} strategy={rectSortingStrategy}>
                <div
                  data-tour="md-pinned"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  style={{ gridAutoFlow: 'dense' }}
                >
                  {pinnedKPIs.map((kpi) => {
                    if (!kpi) return null;
                    return (
                      <SortableKPICard
                        key={kpi.id}
                        kpi={kpi}
                        custom={kpiCustomizations[kpi.id] || {}}
                        trendData={kpiTrendData[kpi.id]}
                        isEditMode={isEditMode}
                        onNavigateTab={onNavigateTab}
                      />
                    );
                  })}

                  {/* Add more card — only in edit mode */}
                  {isEditMode && (
                    <button
                      onClick={() => setKpiSelectorOpen(true)}
                      className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-ep-green)] hover:text-[var(--color-ep-green)] transition-all cursor-pointer min-h-[140px]"
                    >
                      <Plus size={24} />
                      <span className="text-sm font-medium">Add KPI</span>
                    </button>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* ── Pinned Reports Section ── */}
          {pinnedReports.length > 0 && (
            <div className={pinnedKPIs.length > 0 ? 'mt-8' : ''}>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-[var(--color-ep-blue)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Pinned Reports</h3>
                <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] px-1.5 py-0.5 rounded-full">
                  {pinnedReports.length}
                </span>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleReportDragEnd}
              >
                <SortableContext items={displayReportIds} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pinnedReports.map(report => (
                      <SortableReportCard
                        key={report.id}
                        report={report}
                        isEditMode={isEditMode}
                        onUnpin={() => unpinReport(report.id)}
                      />
                    ))}
                    {isEditMode && (
                      <button
                        onClick={() => setReportSelectorOpen(true)}
                        className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-ep-blue)] hover:text-[var(--color-ep-blue)] transition-all cursor-pointer min-h-[120px]"
                      >
                        <FileText size={24} />
                        <span className="text-sm font-medium">Add Report</span>
                      </button>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-20 px-8 bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-ep-green-light)] flex items-center justify-center mb-4">
            <Pin size={28} className="text-[var(--color-ep-green)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Build your dashboard</h3>
          <p className="text-sm text-[var(--color-text-muted)] text-center max-w-md mb-6">
            Pin KPIs from any tab, add saved reports, and customize each card with your preferred colors and chart styles.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setKpiSelectorOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus size={16} />
              Browse KPIs
            </button>
            <button
              onClick={() => setReportSelectorOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
            >
              <FileText size={16} />
              Add Reports
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <KPIPinSelector open={kpiSelectorOpen} onClose={() => setKpiSelectorOpen(false)} />
      <ReportPinSelector open={reportSelectorOpen} onClose={() => setReportSelectorOpen(false)} />
    </div>
  );
}
