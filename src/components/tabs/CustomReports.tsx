'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import SubTabFilter from '../SubTabFilter';
import ChartCard from '../ChartCard';
import ConditionalCell from '../ConditionalCell';
import Sparkline from '../Sparkline';
import BranchProfilePanel from '../BranchProfilePanel';
import MerchantProfilePanel from '../MerchantProfilePanel';
import {
  merchantProfiles, type MerchantProfile,
  repScorecard, territoryPerformance,
  reportTemplates, savedReports,
  branchDetails, type BranchDetail,
} from '@/data/mockData';
import { downloadCSV } from '@/lib/exportCSV';
import {
  BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Search, X, Download, ChevronDown, ChevronUp, Check,
  Trophy, AlertTriangle, Map as MapIcon, Users, PieChart as PieChartIcon,
  Rocket, BarChart3, Clock, Filter, Eye, ArrowUpDown, Calendar, Hash,
} from 'lucide-react';
import type { DateRange } from '@/lib/dateFilter';

// ── Types ──
type DataSource = 'merchants' | 'reps' | 'territories';
type SortDir = 'asc' | 'desc';
type DimensionType = 'multiselect' | 'dateRange' | 'numericRange' | 'select';

type FilterValue =
  | string[]                              // multiselect
  | { after?: string; before?: string }   // dateRange
  | { min?: number; max?: number }        // numericRange
  | string;                               // select

type MetricDef = {
  key: string;
  label: string;
  format: (v: number) => string;
  invert?: boolean;
};

type DimensionDef = {
  label: string;
  type?: DimensionType;
  values?: () => string[];
  prefix?: string;
  suffix?: string;
  step?: number;
};

type SourceConfig = {
  label: string;
  metrics: MetricDef[];
  dimensions: Record<string, DimensionDef>;
  groupByOptions: string[];
  nameKey: string;
  getData: () => Record<string, unknown>[];
};

// ── Metric Configurations ──
const METRIC_CONFIG: Record<DataSource, SourceConfig> = {
  merchants: {
    label: 'Merchants',
    metrics: [
      { key: 'volumeMTD', label: 'Volume MTD', format: (v) => `$${(v / 1000).toFixed(0)}K` },
      { key: 'volumeYTD', label: 'Volume YTD', format: (v) => `$${(v / 1000).toFixed(0)}K` },
      { key: 'dealsMTD', label: 'Deals MTD', format: (v) => v.toLocaleString() },
      { key: 'dealsYTD', label: 'Deals YTD', format: (v) => v.toLocaleString() },
      { key: 'approvalRate', label: 'Approval %', format: (v) => `${v}%` },
      { key: 'fundingRate', label: 'Funding %', format: (v) => `${v}%` },
      { key: 'autoPayAttachRate', label: 'AutoPay %', format: (v) => `${v}%` },
      { key: 'delinquencyRate', label: 'Delinquency %', format: (v) => `${v}%`, invert: true },
      { key: 'chargebackRate', label: 'Chargeback %', format: (v) => `${v}%`, invert: true },
      { key: 'fpdRate', label: 'FPD %', format: (v) => `${v}%`, invert: true },
    ],
    dimensions: {
      industry: { label: 'Industry', values: () => [...new Set(merchantProfiles.map(m => m.industry))].sort() },
      state: { label: 'State', values: () => [...new Set(merchantProfiles.map(m => m.state))].sort() },
      territory: { label: 'Territory', values: () => [...new Set(merchantProfiles.map(m => m.territory))].sort() },
      status: { label: 'Status', values: () => ['Active', 'Dormant', 'Suspended', 'Terminated'] },
      tier: { label: 'Tier', values: () => ['Platinum', 'Gold', 'Silver', 'Bronze'] },
      assignedRep: { label: 'Rep', values: () => [...new Set(merchantProfiles.map(m => m.assignedRep))].sort() },
      enrolledDate: { label: 'Enrolled Date', type: 'dateRange' },
      firstFundedDate: { label: 'First Funded Date', type: 'dateRange' },
      volumeMTD: { label: 'Volume MTD', type: 'numericRange', prefix: '$', step: 1000 },
      dealsMTD: { label: 'Deals MTD', type: 'numericRange', step: 1 },
      approvalRate: { label: 'Approval Rate', type: 'numericRange', suffix: '%', step: 1 },
      fundingRate: { label: 'Funding Rate', type: 'numericRange', suffix: '%', step: 1 },
      delinquencyRate: { label: 'Delinquency Rate', type: 'numericRange', suffix: '%', step: 0.1 },
      activityRecency: { label: 'Last Activity', type: 'select', values: () => ['Last 30 days', 'Last 60 days', 'Last 90 days', 'No recent activity'] },
    },
    groupByOptions: ['industry', 'state', 'territory', 'assignedRep', 'tier'],
    nameKey: 'name',
    getData: () => merchantProfiles as unknown as Record<string, unknown>[],
  },
  reps: {
    label: 'Sales Reps',
    metrics: [
      { key: 'merchants', label: 'Merchants', format: (v) => v.toLocaleString() },
      { key: 'fundedMTD', label: 'Funded MTD', format: (v) => v.toLocaleString() },
      { key: 'volumeMTD', label: 'Volume MTD', format: (v) => `$${(v / 1000).toFixed(0)}K` },
      { key: 'enrollmentsMTD', label: 'Enrollments', format: (v) => v.toLocaleString() },
      { key: 'activationRate', label: 'Activation %', format: (v) => `${v}%` },
    ],
    dimensions: {
      territory: { label: 'Territory', values: () => [...new Set(repScorecard.map(r => r.territory))].sort() },
      volumeMTD: { label: 'Volume MTD', type: 'numericRange', prefix: '$', step: 1000 },
      enrollmentsMTD: { label: 'Enrollments', type: 'numericRange', step: 1 },
      activationRate: { label: 'Activation Rate', type: 'numericRange', suffix: '%', step: 1 },
    },
    groupByOptions: ['territory'],
    nameKey: 'name',
    getData: () => repScorecard as unknown as Record<string, unknown>[],
  },
  territories: {
    label: 'Territories',
    metrics: [
      { key: 'branchCount', label: 'Branches', format: (v) => v.toLocaleString() },
      { key: 'activeBranches', label: 'Active', format: (v) => v.toLocaleString() },
      { key: 'inactiveBranches', label: 'Inactive', format: (v) => v.toLocaleString() },
      { key: 'preAvgMonthly', label: 'Pre Avg/Mo', format: (v) => `$${(v / 1000).toFixed(0)}K` },
      { key: 'postRunRate', label: 'Post Run Rate', format: (v) => `$${(v / 1000).toFixed(0)}K` },
      { key: 'deltaPct', label: 'Delta %', format: (v) => `${v}%` },
      { key: 'totalEnrollments', label: 'Enrollments', format: (v) => v.toLocaleString() },
    ],
    dimensions: {
      deltaPct: { label: 'Delta %', type: 'numericRange', suffix: '%', step: 1 },
      totalEnrollments: { label: 'Enrollments', type: 'numericRange', step: 1 },
    },
    groupByOptions: [],
    nameKey: 'territory',
    getData: () => territoryPerformance as unknown as Record<string, unknown>[],
  },
};

const RADAR_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  trophy: <Trophy size={20} className="text-[var(--color-ep-orange)]" />,
  alertTriangle: <AlertTriangle size={20} className="text-[var(--color-ep-red)]" />,
  map: <MapIcon size={20} className="text-[var(--color-ep-blue)]" />,
  users: <Users size={20} className="text-[var(--color-ep-green)]" />,
  pieChart: <PieChartIcon size={20} className="text-[var(--color-ep-purple)]" />,
  rocket: <Rocket size={20} className="text-[var(--color-ep-teal)]" />,
};

const SUB_TABS = ['Report Builder', 'Compare', 'Saved Reports'];

// ── Multi-Select Dropdown ──
function MultiSelectDropdown({
  label, options, selected, onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (s: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
          selected.length > 0
            ? 'border-[var(--color-ep-purple)] bg-[var(--color-ep-purple)]/5 text-[var(--color-ep-purple)] font-medium'
            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
        }`}
      >
        <Filter size={12} />
        {label}{selected.length > 0 && ` (${selected.length})`}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-[var(--color-border)] shadow-lg z-50 min-w-[180px] py-1 max-h-[240px] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)]">
            <button onClick={() => onChange(options)} className="text-[10px] text-[var(--color-ep-blue)] hover:underline cursor-pointer">Select All</button>
            <button onClick={() => onChange([])} className="text-[10px] text-[var(--color-text-muted)] hover:underline cursor-pointer">Clear</button>
          </div>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-gray-50 cursor-pointer"
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                selected.includes(opt) ? 'bg-[var(--color-ep-purple)] border-[var(--color-ep-purple)]' : 'border-gray-300'
              }`}>
                {selected.includes(opt) && <Check size={10} className="text-white" />}
              </div>
              <span className={selected.includes(opt) ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Date Range Input ──
function DateRangeInput({
  label, value, onChange,
}: {
  label: string;
  value: { after?: string; before?: string };
  onChange: (v: { after?: string; before?: string }) => void;
}) {
  const hasValue = value.after || value.before;
  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all ${
        hasValue ? 'border-[var(--color-ep-purple)] bg-[var(--color-ep-purple)]/5' : 'border-[var(--color-border)]'
      }`}>
        <Calendar size={12} className={hasValue ? 'text-[var(--color-ep-purple)]' : 'text-[var(--color-text-muted)]'} />
        <span className={`text-[11px] ${hasValue ? 'text-[var(--color-ep-purple)] font-medium' : 'text-[var(--color-text-muted)]'}`}>{label}</span>
        <input
          type="date"
          value={value.after || ''}
          onChange={(e) => onChange({ ...value, after: e.target.value || undefined })}
          className="w-[110px] text-[11px] bg-transparent border-0 outline-none text-[var(--color-text-primary)] cursor-pointer"
          placeholder="After"
        />
        <span className="text-[10px] text-[var(--color-text-muted)]">to</span>
        <input
          type="date"
          value={value.before || ''}
          onChange={(e) => onChange({ ...value, before: e.target.value || undefined })}
          className="w-[110px] text-[11px] bg-transparent border-0 outline-none text-[var(--color-text-primary)] cursor-pointer"
          placeholder="Before"
        />
        {hasValue && (
          <button onClick={() => onChange({})} className="text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] cursor-pointer"><X size={12} /></button>
        )}
      </div>
    </div>
  );
}

// ── Numeric Range Input ──
function NumericRangeInput({
  label, value, onChange, prefix, suffix, step,
}: {
  label: string;
  value: { min?: number; max?: number };
  onChange: (v: { min?: number; max?: number }) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  const hasValue = value.min != null || value.max != null;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all ${
      hasValue ? 'border-[var(--color-ep-purple)] bg-[var(--color-ep-purple)]/5' : 'border-[var(--color-border)]'
    }`}>
      <Hash size={12} className={hasValue ? 'text-[var(--color-ep-purple)]' : 'text-[var(--color-text-muted)]'} />
      <span className={`text-[11px] whitespace-nowrap ${hasValue ? 'text-[var(--color-ep-purple)] font-medium' : 'text-[var(--color-text-muted)]'}`}>{label}</span>
      {prefix && <span className="text-[10px] text-[var(--color-text-muted)]">{prefix}</span>}
      <input
        type="number"
        value={value.min ?? ''}
        onChange={(e) => onChange({ ...value, min: e.target.value ? Number(e.target.value) : undefined })}
        className="w-[60px] text-[11px] bg-transparent border-0 outline-none text-[var(--color-text-primary)] tabular-nums placeholder:text-gray-300"
        placeholder="Min"
        step={step || 1}
      />
      <span className="text-[10px] text-[var(--color-text-muted)]">–</span>
      <input
        type="number"
        value={value.max ?? ''}
        onChange={(e) => onChange({ ...value, max: e.target.value ? Number(e.target.value) : undefined })}
        className="w-[60px] text-[11px] bg-transparent border-0 outline-none text-[var(--color-text-primary)] tabular-nums placeholder:text-gray-300"
        placeholder="Max"
        step={step || 1}
      />
      {suffix && <span className="text-[10px] text-[var(--color-text-muted)]">{suffix}</span>}
      {hasValue && (
        <button onClick={() => onChange({})} className="text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] cursor-pointer"><X size={12} /></button>
      )}
    </div>
  );
}

// ── Single Select Dropdown ──
function SingleSelectFilter({
  label, options, value, onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const hasValue = !!value;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all ${
      hasValue ? 'border-[var(--color-ep-purple)] bg-[var(--color-ep-purple)]/5' : 'border-[var(--color-border)]'
    }`}>
      <Clock size={12} className={hasValue ? 'text-[var(--color-ep-purple)]' : 'text-[var(--color-text-muted)]'} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-[11px] bg-transparent border-0 outline-none cursor-pointer ${hasValue ? 'text-[var(--color-ep-purple)] font-medium' : 'text-[var(--color-text-muted)]'}`}
      >
        <option value="">{label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {hasValue && (
        <button onClick={() => onChange('')} className="text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] cursor-pointer"><X size={12} /></button>
      )}
    </div>
  );
}

// ── Add Filter Menu ──
const FILTER_TYPE_LABELS: Record<string, string> = {
  multiselect: 'Category',
  dateRange: 'Dates',
  numericRange: 'Performance',
  select: 'Activity',
};

function AddFilterMenu({
  dimensions, activeKeys, onAdd,
}: {
  dimensions: Record<string, DimensionDef>;
  activeKeys: string[];
  onAdd: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Group dimensions by type
  const groups = new Map<string, [string, DimensionDef][]>();
  Object.entries(dimensions).forEach(([key, dim]) => {
    const type = dim.type || 'multiselect';
    const label = FILTER_TYPE_LABELS[type] || type;
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push([key, dim]);
  });

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-dashed border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-ep-purple)] hover:text-[var(--color-ep-purple)] transition-all cursor-pointer"
      >
        <Filter size={12} />
        Add Filter
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-[var(--color-border)] shadow-lg z-50 min-w-[200px] py-1">
          {Array.from(groups.entries()).map(([groupLabel, items]) => (
            <div key={groupLabel}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold border-b border-[var(--color-border)] bg-gray-50/50">
                {groupLabel}
              </div>
              {items.map(([key, dim]) => {
                const isActive = activeKeys.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => { if (!isActive) { onAdd(key); setOpen(false); } }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                      isActive ? 'text-[var(--color-text-muted)] bg-gray-50 cursor-default' : 'text-[var(--color-text-primary)] hover:bg-[var(--color-ep-purple)]/5 cursor-pointer'
                    }`}
                  >
                    {isActive ? (
                      <Check size={12} className="text-[var(--color-ep-purple)]" />
                    ) : (
                      <div className="w-3 h-3" />
                    )}
                    {dim.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Custom Tooltip for Charts ──
function ReportTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-sidebar)] text-white rounded-lg px-3 py-2.5 shadow-xl border border-white/10 min-w-[140px]">
      {label && <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">{label}</div>}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-300">{entry.name}</span>
            </div>
            <span className="font-semibold tabular-nums">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──
export default function CustomReports({ dateRange }: { dateRange?: DateRange }) {
  const [activeSubTab, setActiveSubTab] = useState('Report Builder');

  // Report Builder state
  const [dataSource, setDataSource] = useState<DataSource>('merchants');
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>('volumeMTD');
  const [sortDirection, setSortDirection] = useState<SortDir>('desc');
  const [showChart, setShowChart] = useState(false);
  const [metricsExpanded, setMetricsExpanded] = useState(false);
  const [activeFilterKeys, setActiveFilterKeys] = useState<string[]>([]);

  // Panel state
  const [selectedTerritory, setSelectedTerritory] = useState<BranchDetail | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);

  // Compare state
  const [selectedMerchants, setSelectedMerchants] = useState<MerchantProfile[]>([]);
  const [compareSearch, setCompareSearch] = useState('');
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (compareRef.current && !compareRef.current.contains(e.target as Node)) setCompareDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Reset filters and metrics when data source changes
  useEffect(() => {
    setFilters({});
    setActiveFilterKeys([]);
    setSelectedMetrics(METRIC_CONFIG[dataSource].metrics.map(m => m.key));
    setGroupBy(null);
    setSortColumn(METRIC_CONFIG[dataSource].metrics[0]?.key || null);
    setSortDirection('desc');
  }, [dataSource]);

  // Initialize selected metrics on mount
  useEffect(() => {
    setSelectedMetrics(METRIC_CONFIG[dataSource].metrics.map(m => m.key));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = METRIC_CONFIG[dataSource];
  const activeMetrics = config.metrics.filter(m => selectedMetrics.includes(m.key));

  // ── Filtered & sorted data ──
  const processedData = useMemo(() => {
    let data = [...config.getData()];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      const dim = config.dimensions[key];
      const dimType = dim?.type || 'multiselect';

      if (dimType === 'multiselect' && Array.isArray(value) && value.length > 0) {
        data = data.filter(row => (value as string[]).includes(String(row[key])));
      } else if (dimType === 'dateRange' && typeof value === 'object' && !Array.isArray(value)) {
        const { after, before } = value as { after?: string; before?: string };
        if (after) data = data.filter(row => { const d = String(row[key] || ''); return d >= after; });
        if (before) data = data.filter(row => { const d = String(row[key] || ''); return d && d <= before; });
      } else if (dimType === 'numericRange' && typeof value === 'object' && !Array.isArray(value)) {
        const { min, max } = value as { min?: number; max?: number };
        if (min != null) data = data.filter(row => Number(row[key]) >= min);
        if (max != null) data = data.filter(row => Number(row[key]) <= max);
      } else if (dimType === 'select' && typeof value === 'string' && value) {
        // Activity recency filter
        if (key === 'activityRecency') {
          const now = new Date();
          data = data.filter(row => {
            const activity = row.recentActivity as { date: string }[] | undefined;
            const lastDate = activity?.[0]?.date;
            if (value === 'No recent activity') return !lastDate || (now.getTime() - new Date(lastDate).getTime()) > 90 * 86400000;
            const days = value === 'Last 30 days' ? 30 : value === 'Last 60 days' ? 60 : 90;
            return lastDate && (now.getTime() - new Date(lastDate).getTime()) <= days * 86400000;
          });
        }
      }
    });

    // Group by
    if (groupBy && dataSource === 'merchants') {
      const groups = new Map<string, Record<string, unknown>[]>();
      data.forEach(row => {
        const key = String(row[groupBy]);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      });

      data = Array.from(groups.entries()).map(([groupName, rows]) => {
        const result: Record<string, unknown> = { _groupName: groupName, _count: rows.length, name: groupName };
        activeMetrics.forEach(metric => {
          if (metric.key.includes('Rate') || metric.key.includes('fpdRate')) {
            result[metric.key] = Number((rows.reduce((sum, r) => sum + (Number(r[metric.key]) || 0), 0) / rows.length).toFixed(1));
          } else {
            result[metric.key] = rows.reduce((sum, r) => sum + (Number(r[metric.key]) || 0), 0);
          }
        });
        return result;
      });
    }

    // Sort
    if (sortColumn) {
      data.sort((a, b) => {
        const aVal = Number(a[sortColumn]) || 0;
        const bVal = Number(b[sortColumn]) || 0;
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return data;
  }, [config, filters, groupBy, dataSource, activeMetrics, sortColumn, sortDirection]);

  // ── Template / Saved Report loader ──
  const loadReport = useCallback((report: { dataSource: DataSource; filters: Record<string, FilterValue>; metrics: string[]; sortBy: string; sortDir: SortDir; groupBy?: string }) => {
    setDataSource(report.dataSource);
    setTimeout(() => {
      setFilters(report.filters || {});
      setActiveFilterKeys(Object.keys(report.filters || {}));
      setSelectedMetrics(report.metrics);
      setSortColumn(report.sortBy);
      setSortDirection(report.sortDir);
      setGroupBy(report.groupBy || null);
      setActiveSubTab('Report Builder');
    }, 0);
  }, []);

  // ── Export current report ──
  const exportReport = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    const headers = [groupBy ? config.dimensions[groupBy]?.label || 'Group' : config.nameKey, ...(groupBy ? ['Count'] : []), ...activeMetrics.map(m => m.label)];
    const rows = processedData.map(row => [
      String(row[groupBy ? '_groupName' : config.nameKey] || ''),
      ...(groupBy ? [String(row._count || '')] : []),
      ...activeMetrics.map(m => m.format(Number(row[m.key]) || 0)),
    ]);
    downloadCSV(`EP_Custom_Report_${config.label.replace(/\s/g, '_')}_${date}`, headers, rows);
  }, [config, activeMetrics, processedData, groupBy]);

  // ── Compare search results ──
  const compareResults = useMemo(() => {
    if (!compareSearch.trim()) return [];
    const q = compareSearch.toLowerCase();
    return merchantProfiles
      .filter(m => !selectedMerchants.find(s => s.id === m.id))
      .filter(m => m.name.toLowerCase().includes(q) || m.dba.toLowerCase().includes(q) || m.industry.toLowerCase().includes(q) || m.state.toLowerCase().includes(q))
      .slice(0, 6);
  }, [compareSearch, selectedMerchants]);

  // ── Radar data for comparison ──
  const radarData = useMemo(() => {
    if (selectedMerchants.length < 2) return [];
    const maxVol = Math.max(...selectedMerchants.map(m => m.volumeMTD), 1);
    return ['Volume', 'Approval', 'Funding', 'AutoPay', 'Risk Score'].map(metric => {
      const point: Record<string, unknown> = { metric };
      selectedMerchants.forEach((m, i) => {
        switch (metric) {
          case 'Volume': point[`m${i}`] = Math.round((m.volumeMTD / maxVol) * 100); break;
          case 'Approval': point[`m${i}`] = m.approvalRate; break;
          case 'Funding': point[`m${i}`] = m.fundingRate; break;
          case 'AutoPay': point[`m${i}`] = m.autoPayAttachRate; break;
          case 'Risk Score': point[`m${i}`] = Math.max(0, 100 - m.delinquencyRate * 10); break;
        }
      });
      return point;
    });
  }, [selectedMerchants]);

  // ── Trend data for comparison ──
  const trendData = useMemo(() => {
    if (selectedMerchants.length < 2) return [];
    const months = selectedMerchants[0]?.monthlyVolume.map(mv => mv.month) || [];
    return months.map((month, idx) => {
      const point: Record<string, unknown> = { month };
      selectedMerchants.forEach(m => {
        point[m.name] = m.monthlyVolume[idx]?.volume || 0;
      });
      return point;
    });
  }, [selectedMerchants]);

  // ── Compare metrics (transposed table) ──
  const compareMetrics: { label: string; key: keyof MerchantProfile; format: (v: number) => string; invert?: boolean }[] = [
    { label: 'Volume MTD', key: 'volumeMTD', format: (v) => `$${(v / 1000).toFixed(0)}K` },
    { label: 'Volume YTD', key: 'volumeYTD', format: (v) => `$${(v / 1000).toFixed(0)}K` },
    { label: 'Deals MTD', key: 'dealsMTD', format: (v) => v.toLocaleString() },
    { label: 'Avg Ticket', key: 'avgTicket', format: (v) => `$${v.toLocaleString()}` },
    { label: 'Approval %', key: 'approvalRate', format: (v) => `${v}%` },
    { label: 'Funding %', key: 'fundingRate', format: (v) => `${v}%` },
    { label: 'AutoPay %', key: 'autoPayAttachRate', format: (v) => `${v}%` },
    { label: 'Delinquency %', key: 'delinquencyRate', format: (v) => `${v}%`, invert: true },
    { label: 'Chargeback %', key: 'chargebackRate', format: (v) => `${v}%`, invert: true },
    { label: 'FPD %', key: 'fpdRate', format: (v) => `${v}%`, invert: true },
  ];

  function handleSort(key: string) {
    if (sortColumn === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('desc');
    }
  }

  function toggleMetric(key: string) {
    setSelectedMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  // ── RENDER: Report Builder ──
  function renderReportBuilder() {
    return (
      <div className="space-y-5 mt-5">
        {/* Controls */}
        <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-4 space-y-3">
          {/* Row 1: Data Source */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Data Source</span>
            {(['merchants', 'reps', 'territories'] as DataSource[]).map(src => (
              <button
                key={src}
                onClick={() => setDataSource(src)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all cursor-pointer ${
                  dataSource === src
                    ? 'bg-[var(--color-ep-purple)] text-white font-medium shadow-sm'
                    : 'bg-gray-100 text-[var(--color-text-secondary)] hover:bg-gray-200'
                }`}
              >
                {METRIC_CONFIG[src].label}
              </button>
            ))}
          </div>

          {/* Row 2: Filters — Add Filter menu + active filter rows */}
          {(() => {
            const hasAnyFilter = Object.entries(filters).some(([, v]) => {
              if (Array.isArray(v)) return v.length > 0;
              if (typeof v === 'string') return !!v;
              if (typeof v === 'object' && v) return (v as { after?: string; before?: string; min?: number; max?: number }).after || (v as { after?: string; before?: string; min?: number; max?: number }).before || (v as { min?: number; max?: number }).min != null || (v as { min?: number; max?: number }).max != null;
              return false;
            });

            const removeFilter = (key: string) => {
              setActiveFilterKeys(prev => prev.filter(k => k !== key));
              setFilters(prev => { const next = { ...prev }; delete next[key]; return next; });
            };

            const clearAll = () => {
              setActiveFilterKeys([]);
              setFilters({});
            };

            return (
              <>
                {/* Add Filter button + Clear All */}
                <div className="flex items-center gap-2">
                  <AddFilterMenu
                    dimensions={config.dimensions}
                    activeKeys={activeFilterKeys}
                    onAdd={(key) => setActiveFilterKeys(prev => [...prev, key])}
                  />
                  {hasAnyFilter && (
                    <button
                      onClick={clearAll}
                      className="text-[10px] text-[var(--color-ep-red)] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  {activeFilterKeys.length > 0 && !hasAnyFilter && (
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {activeFilterKeys.length} filter{activeFilterKeys.length > 1 ? 's' : ''} added — set values below
                    </span>
                  )}
                </div>

                {/* Active filter rows — vertical stack */}
                {activeFilterKeys.length > 0 && (
                  <div className="space-y-2">
                    {activeFilterKeys.map(key => {
                      const dim = config.dimensions[key];
                      if (!dim) return null;
                      const dimType = dim.type || 'multiselect';

                      return (
                        <div key={key} className="flex items-center gap-2 pl-1">
                          {dimType === 'multiselect' && dim.values && (
                            <MultiSelectDropdown
                              label={dim.label}
                              options={dim.values()}
                              selected={(filters[key] as string[]) || []}
                              onChange={(vals) => setFilters(prev => ({ ...prev, [key]: vals }))}
                            />
                          )}
                          {dimType === 'dateRange' && (
                            <DateRangeInput
                              label={dim.label}
                              value={(filters[key] as { after?: string; before?: string }) || {}}
                              onChange={(v) => setFilters(prev => ({ ...prev, [key]: v }))}
                            />
                          )}
                          {dimType === 'numericRange' && (
                            <NumericRangeInput
                              label={dim.label}
                              value={(filters[key] as { min?: number; max?: number }) || {}}
                              onChange={(v) => setFilters(prev => ({ ...prev, [key]: v }))}
                              prefix={dim.prefix}
                              suffix={dim.suffix}
                              step={dim.step}
                            />
                          )}
                          {dimType === 'select' && dim.values && (
                            <SingleSelectFilter
                              label={dim.label}
                              options={dim.values()}
                              value={(filters[key] as string) || ''}
                              onChange={(v) => setFilters(prev => ({ ...prev, [key]: v }))}
                            />
                          )}
                          <button
                            onClick={() => removeFilter(key)}
                            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-ep-red)] transition-colors cursor-pointer"
                            title="Remove filter"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Active filter pills summary */}
                {hasAnyFilter && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">Active:</span>
                    {Object.entries(filters).map(([key, value]) => {
                      const dim = config.dimensions[key];
                      if (!dim) return null;
                      const dimType = dim.type || 'multiselect';
                      let pillLabel = '';
                      if (dimType === 'multiselect' && Array.isArray(value) && value.length > 0) {
                        pillLabel = `${dim.label}: ${value.length > 2 ? `${value.slice(0, 2).join(', ')} +${value.length - 2}` : value.join(', ')}`;
                      } else if (dimType === 'dateRange' && typeof value === 'object' && !Array.isArray(value)) {
                        const { after, before } = value as { after?: string; before?: string };
                        if (after && before) pillLabel = `${dim.label}: ${after} → ${before}`;
                        else if (after) pillLabel = `${dim.label}: after ${after}`;
                        else if (before) pillLabel = `${dim.label}: before ${before}`;
                      } else if (dimType === 'numericRange' && typeof value === 'object' && !Array.isArray(value)) {
                        const { min, max } = value as { min?: number; max?: number };
                        const p = dim.prefix || '';
                        const s = dim.suffix || '';
                        if (min != null && max != null) pillLabel = `${dim.label}: ${p}${min}${s} – ${p}${max}${s}`;
                        else if (min != null) pillLabel = `${dim.label}: ≥ ${p}${min}${s}`;
                        else if (max != null) pillLabel = `${dim.label}: ≤ ${p}${max}${s}`;
                      } else if (dimType === 'select' && typeof value === 'string' && value) {
                        pillLabel = `${dim.label}: ${value}`;
                      }
                      if (!pillLabel) return null;
                      return (
                        <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-ep-purple)]/10 text-[var(--color-ep-purple)] text-[10px] font-medium rounded-full border border-[var(--color-ep-purple)]/20">
                          {pillLabel}
                          <button onClick={() => removeFilter(key)} className="hover:text-[var(--color-ep-red)] cursor-pointer"><X size={10} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

          {/* Row 3: Metrics, Group By, Chart toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Metric selector */}
            <div className="relative">
              <button
                onClick={() => setMetricsExpanded(!metricsExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] cursor-pointer"
              >
                <Eye size={12} />
                Columns ({selectedMetrics.length}/{config.metrics.length})
                <ChevronDown size={12} />
              </button>
              {metricsExpanded && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-[var(--color-border)] shadow-lg z-50 min-w-[220px] py-1">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)]">
                    <button onClick={() => setSelectedMetrics(config.metrics.map(m => m.key))} className="text-[10px] text-[var(--color-ep-blue)] hover:underline cursor-pointer">All</button>
                    <button onClick={() => setSelectedMetrics([])} className="text-[10px] text-[var(--color-text-muted)] hover:underline cursor-pointer">None</button>
                  </div>
                  {config.metrics.map(m => (
                    <button
                      key={m.key}
                      onClick={() => toggleMetric(m.key)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-gray-50 cursor-pointer"
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                        selectedMetrics.includes(m.key) ? 'bg-[var(--color-ep-purple)] border-[var(--color-ep-purple)]' : 'border-gray-300'
                      }`}>
                        {selectedMetrics.includes(m.key) && <Check size={10} className="text-white" />}
                      </div>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group By */}
            {config.groupByOptions.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--color-text-muted)]">Group by:</span>
                <select
                  value={groupBy || ''}
                  onChange={(e) => setGroupBy(e.target.value || null)}
                  className="text-xs border border-[var(--color-border)] rounded-md px-2 py-1.5 bg-white text-[var(--color-text-secondary)] cursor-pointer"
                >
                  <option value="">None</option>
                  {config.groupByOptions.map(opt => (
                    <option key={opt} value={opt}>{config.dimensions[opt]?.label || opt}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Chart toggle */}
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
                showChart
                  ? 'border-[var(--color-ep-blue)] bg-[var(--color-ep-blue)]/5 text-[var(--color-ep-blue)] font-medium'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
              }`}
            >
              <BarChart3 size={12} />
              Chart
            </button>

            <div className="flex-1" />

            {/* Export */}
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] cursor-pointer"
            >
              <Download size={12} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)]">
            Showing {processedData.length} {groupBy ? 'groups' : config.label.toLowerCase()}
            {Object.values(filters).some(v => v.length > 0) && ' (filtered)'}
          </span>
        </div>

        {/* Summary Chart */}
        {showChart && processedData.length > 0 && activeMetrics.length > 0 && (
          <ChartCard title={`${activeMetrics[0].label} by ${groupBy ? config.dimensions[groupBy]?.label || 'Group' : config.label}`}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={processedData.slice(0, 12)} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey={groupBy ? '_groupName' : config.nameKey} tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<ReportTooltip />} />
                <Bar dataKey={activeMetrics[0].key} name={activeMetrics[0].label} fill="var(--color-ep-purple)" radius={[4, 4, 0, 0]} />
                {activeMetrics[1] && (
                  <Bar dataKey={activeMetrics[1].key} name={activeMetrics[1].label} fill="var(--color-ep-blue)" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Results Table */}
        {processedData.length > 0 ? (
          <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] px-4 py-3">
                    {groupBy ? config.dimensions[groupBy]?.label || 'Group' : config.nameKey === 'territory' ? 'Territory' : 'Name'}
                  </th>
                  {groupBy && (
                    <th className="text-right text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] px-4 py-3">
                      Count
                    </th>
                  )}
                  {activeMetrics.map(m => (
                    <th
                      key={m.key}
                      onClick={() => handleSort(m.key)}
                      className="text-right text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] px-4 py-3 cursor-pointer hover:text-[var(--color-text-primary)] select-none"
                    >
                      <div className="flex items-center justify-end gap-1">
                        {m.label}
                        {sortColumn === m.key ? (
                          sortDirection === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />
                        ) : (
                          <ArrowUpDown size={10} className="opacity-30" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedData.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-[var(--color-ep-blue)]">
                      {(() => {
                        const nameVal = String(row[groupBy ? '_groupName' : config.nameKey] || '');
                        const isTerritoryName = (config.nameKey === 'territory' && !groupBy) || (groupBy === 'territory');
                        const hasBranchData = isTerritoryName && branchDetails[nameVal];
                        const isMerchantName = dataSource === 'merchants' && !groupBy;
                        if (hasBranchData) {
                          return <button onClick={() => setSelectedTerritory(branchDetails[nameVal])} className="hover:underline cursor-pointer">{nameVal}</button>;
                        }
                        if (isMerchantName) {
                          const match = merchantProfiles.find(m => m.name === nameVal);
                          return match
                            ? <button onClick={() => setSelectedMerchant(match)} className="hover:underline cursor-pointer">{nameVal}</button>
                            : nameVal;
                        }
                        return nameVal;
                      })()}
                      {row._count != null && groupBy && (
                        <span className="ml-1.5 text-[10px] bg-gray-100 text-[var(--color-text-muted)] px-1.5 py-0.5 rounded-full">
                          {String(row._count)}
                        </span>
                      )}
                    </td>
                    {groupBy && !row._count && <td />}
                    {activeMetrics.map(m => {
                      const val = Number(row[m.key]) || 0;
                      const isRate = m.key.includes('Rate') || m.key === 'fpdRate' || m.key === 'deltaPct';
                      return (
                        <td key={m.key} className="px-4 py-3 text-right tabular-nums">
                          {isRate ? (
                            <ConditionalCell
                              value={val}
                              format={(v) => m.format(v)}
                              thresholds={m.invert ? [4, 7] : [60, 70]}
                              invert={m.invert}
                            />
                          ) : (
                            <span className="font-medium">{m.format(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] py-16 flex flex-col items-center gap-3 text-center">
            <Filter size={32} className="text-[var(--color-text-muted)]" />
            <p className="text-sm text-[var(--color-text-muted)]">No results match your filters.</p>
            <button onClick={() => setFilters({})} className="text-xs text-[var(--color-ep-purple)] hover:underline cursor-pointer">Clear all filters</button>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER: Compare ──
  function renderCompare() {
    return (
      <div className="space-y-5 mt-5">
        {/* Merchant Picker */}
        <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Select Merchants to Compare</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">(up to 4)</span>
          </div>

          {/* Selected pills */}
          {selectedMerchants.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedMerchants.map((m, i) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: RADAR_COLORS[i] }}
                >
                  {m.name}
                  <button onClick={() => setSelectedMerchants(prev => prev.filter(s => s.id !== m.id))} className="hover:opacity-70 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <div ref={compareRef} className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={compareSearch}
              onChange={(e) => { setCompareSearch(e.target.value); setCompareDropdownOpen(true); }}
              onFocus={() => setCompareDropdownOpen(true)}
              placeholder={selectedMerchants.length >= 4 ? 'Maximum 4 merchants selected' : 'Search by name, industry, or state...'}
              disabled={selectedMerchants.length >= 4}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ep-purple)]/30 focus:border-[var(--color-ep-purple)] disabled:opacity-50"
            />
            {compareDropdownOpen && compareResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[var(--color-border)] shadow-lg z-50 max-h-[240px] overflow-y-auto">
                {compareResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMerchants(prev => [...prev, m]);
                      setCompareSearch('');
                      setCompareDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 cursor-pointer border-b border-[var(--color-border)] last:border-0"
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--color-text-primary)]">{m.name}</div>
                      <div className="text-[11px] text-[var(--color-text-muted)]">{m.industry} · {m.city}, {m.state}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[var(--color-text-primary)]">${(m.volumeMTD / 1000).toFixed(0)}K</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        m.tier === 'Platinum' ? 'bg-purple-50 text-purple-600' :
                        m.tier === 'Gold' ? 'bg-yellow-50 text-yellow-700' :
                        m.tier === 'Silver' ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'
                      }`}>{m.tier}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedMerchants.length >= 2 ? (
          <>
            {/* Comparison Table (transposed) */}
            <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] overflow-x-auto">
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Side-by-Side Comparison</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] px-4 py-3 min-w-[120px]">Metric</th>
                    {selectedMerchants.map((m, i) => (
                      <th key={m.id} className="text-right text-[10px] uppercase tracking-wider font-semibold px-4 py-3 min-w-[110px]" style={{ color: RADAR_COLORS[i] }}>
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareMetrics.map(metric => {
                    const values = selectedMerchants.map(m => Number(m[metric.key]) || 0);
                    let bestIdx = 0, worstIdx = 0;
                    values.forEach((v, i) => {
                      if (metric.invert ? v < values[bestIdx] : v > values[bestIdx]) bestIdx = i;
                      if (metric.invert ? v > values[worstIdx] : v < values[worstIdx]) worstIdx = i;
                    });
                    return (
                      <tr key={metric.key} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="px-4 py-3 text-xs font-medium text-[var(--color-text-secondary)]">{metric.label}</td>
                        {values.map((val, i) => (
                          <td
                            key={i}
                            className={`px-4 py-3 text-right font-semibold tabular-nums text-sm ${
                              i === bestIdx ? 'bg-emerald-50 text-emerald-600' :
                              i === worstIdx ? 'bg-red-50 text-red-500' : ''
                            }`}
                          >
                            {metric.format(val)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {/* Trend row */}
                  <tr className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 text-xs font-medium text-[var(--color-text-secondary)]">6-Mo Trend</td>
                    {selectedMerchants.map((m, i) => (
                      <td key={m.id} className="px-4 py-3 text-right">
                        <div className="flex justify-end">
                          <Sparkline data={m.monthlyVolume.map(mv => mv.volume)} color={RADAR_COLORS[i]} />
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <ChartCard title="Performance Radar">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData} cx="50%" cy="50%">
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    {selectedMerchants.map((m, i) => (
                      <Radar key={m.id} name={m.name} dataKey={`m${i}`} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip content={<ReportTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Trend Comparison */}
              <ChartCard title="Volume Trend Comparison">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<ReportTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {selectedMerchants.map((m, i) => (
                      <Line key={m.id} type="monotone" dataKey={m.name} stroke={RADAR_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        ) : (
          <div className="bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] py-16 flex flex-col items-center gap-3 text-center">
            <Users size={36} className="text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {selectedMerchants.length === 0
                ? 'Search and select at least 2 merchants to compare'
                : 'Select one more merchant to start comparing'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">Compare up to 4 merchants side-by-side with radar charts, trend lines, and metric highlights.</p>
          </div>
        )}
      </div>
    );
  }

  // ── RENDER: Saved Reports ──
  function renderSavedReports() {
    return (
      <div className="space-y-6 mt-5">
        {/* Templates */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[var(--color-ep-purple)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Report Templates</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => loadReport(tpl as Parameters<typeof loadReport>[0])}
                className="text-left bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-md hover:border-[var(--color-text-muted)] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {TEMPLATE_ICONS[tpl.icon] || <BarChart3 size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-ep-purple)] transition-colors">{tpl.name}</div>
                    <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{tpl.description}</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={10} className="text-[var(--color-text-muted)]" />
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        Last run {new Date(tpl.lastRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-[var(--color-text-muted)] px-1.5 py-0.5 rounded-full ml-auto">
                        {METRIC_CONFIG[tpl.dataSource]?.label || tpl.dataSource}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-[var(--color-ep-blue)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Saved Reports</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedReports.map(report => (
              <button
                key={report.id}
                onClick={() => loadReport(report as Parameters<typeof loadReport>[0])}
                className="text-left bg-[var(--color-card-bg)] rounded-xl border border-[var(--color-border)] p-4 hover:shadow-md hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
              >
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  {METRIC_CONFIG[report.dataSource]?.label || report.dataSource}
                </div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">{report.name}</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">{report.filterSummary}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] mt-2">Created {report.createdDate}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-purple)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-purple)]">
          Custom Reports
        </span>
      </div>

      <SubTabFilter tabs={SUB_TABS} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === 'Report Builder' && renderReportBuilder()}
      {activeSubTab === 'Compare' && renderCompare()}
      {activeSubTab === 'Saved Reports' && renderSavedReports()}

      <BranchProfilePanel
        territory={selectedTerritory}
        onClose={() => setSelectedTerritory(null)}
      />
      <MerchantProfilePanel
        merchant={selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
      />
    </div>
  );
}
