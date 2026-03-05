'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Building2, Users, Download } from 'lucide-react';
import type { StateAggregation } from '@/lib/stateAggregation';
import type { MerchantProfile } from '@/data/mockData';
import { downloadCSV } from '@/lib/exportCSV';

type Props = {
  stateData: StateAggregation | null;
  onClose: () => void;
  onMerchantClick: (merchant: MerchantProfile) => void;
};

export default function StateDetailPanel({ stateData, onClose, onMerchantClick }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (stateData) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [stateData, onClose]);

  if (!stateData) return null;

  const s = stateData;

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10);
    const headers = ['Metric', 'Value'];
    const rows: (string | number)[][] = [
      ['State', s.stateName],
      ['State Code', s.stateCode],
      ['Merchant Count', s.merchantCount],
      ['Total Volume MTD', `$${(s.totalVolumeMTD / 1000).toFixed(0)}K`],
      ['Total Deals MTD', s.totalDealsMTD],
      ['Avg Approval Rate', `${s.avgApprovalRate.toFixed(1)}%`],
      ['Enrollments', s.enrollmentCount],
      ['Territories', s.territories.join(', ')],
      ['', ''],
      ['MERCHANTS', ''],
      ...s.merchants.map(m => [m.name, `$${(m.volumeMTD / 1000).toFixed(0)}K volume`]),
    ];
    downloadCSV(`EP_State_${s.stateCode}_${date}`, headers, rows);
  };

  const panel = (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-[520px] bg-[var(--color-card-bg)] shadow-2xl flex flex-col animate-slideIn"
        style={{ animationDuration: '200ms' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-severity-green-bg)] to-[var(--color-card-bg)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-[var(--color-ep-green)]" />
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{s.stateName}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {s.stateCode}
                </span>
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                {s.merchantCount} merchant{s.merchantCount !== 1 ? 's' : ''} · {s.territories.length} territor{s.territories.length !== 1 ? 'ies' : 'y'}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* KPIs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              State Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MiniKPI label="Merchants" value={s.merchantCount.toString()} />
              <MiniKPI label="Enrollments" value={s.enrollmentCount.toString()} />
              <MiniKPI label="Volume MTD" value={s.totalVolumeMTD > 0 ? `$${(s.totalVolumeMTD / 1000).toFixed(0)}K` : '--'} />
              <MiniKPI label="Deals MTD" value={s.totalDealsMTD > 0 ? s.totalDealsMTD.toString() : '--'} />
              <MiniKPI
                label="Avg Approval"
                value={s.avgApprovalRate > 0 ? `${s.avgApprovalRate.toFixed(1)}%` : '--'}
                color={s.avgApprovalRate >= 70 ? 'green' : s.avgApprovalRate >= 60 ? 'orange' : 'red'}
              />
              <MiniKPI label="Territories" value={s.territories.length.toString()} />
            </div>
          </div>

          {/* Territories */}
          {s.territories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
                <Users size={12} /> Territories
              </h3>
              <div className="flex flex-wrap gap-2">
                {s.territories.map(t => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Merchant table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <Building2 size={12} /> Merchants in {s.stateName}
            </h3>
            {s.merchants.length > 0 ? (
              <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--color-hover-bg)] border-b border-[var(--color-border)]">
                      <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Merchant</th>
                      <th className="text-center px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Status</th>
                      <th className="text-center px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Tier</th>
                      <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Volume</th>
                      <th className="text-right px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Deals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.merchants.map(m => (
                      <tr
                        key={m.id}
                        className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] cursor-pointer transition-colors"
                        onClick={() => onMerchantClick(m)}
                      >
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-[var(--color-ep-blue)] hover:underline">{m.name}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)]">{m.city}, {m.state}</div>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            m.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                            m.status === 'Dormant' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>{m.status}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            m.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                            m.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                            m.tier === 'Silver' ? 'bg-gray-100 text-gray-600' :
                            'bg-orange-100 text-orange-700'
                          }`}>{m.tier}</span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                          {m.volumeMTD > 0 ? `$${(m.volumeMTD / 1000).toFixed(0)}K` : '--'}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{m.dealsMTD || '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] rounded-lg border border-[var(--color-border)]">
                No detailed merchant profiles for this state.
                {s.enrollmentCount > 0 && (
                  <div className="text-xs mt-1">{s.enrollmentCount} enrollments recorded.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-hover-bg)]">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Download size={15} /> Download State Report
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(panel, document.body) : null;
}

function MiniKPI({ label, value, color }: { label: string; value: string; color?: 'green' | 'orange' | 'red' }) {
  const colorClass = color === 'green' ? 'text-[var(--color-ep-green)]'
    : color === 'orange' ? 'text-[var(--color-ep-orange)]'
    : color === 'red' ? 'text-[var(--color-ep-red)]'
    : 'text-[var(--color-text-primary)]';
  return (
    <div className="bg-[var(--color-hover-bg)] rounded-lg p-3 border border-[var(--color-border)]">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</div>
      <div className={`text-base font-bold tabular-nums ${colorClass}`}>{value}</div>
    </div>
  );
}
