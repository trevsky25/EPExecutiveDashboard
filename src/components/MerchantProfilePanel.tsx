'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, Mail, MapPin, Calendar, User, TrendingUp, TrendingDown, AlertTriangle, Download } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { MerchantProfile } from '@/data/mockData';
import { exportMerchantReport } from '@/lib/exportCSV';

type Props = {
  merchant: MerchantProfile | null;
  onClose: () => void;
};

export default function MerchantProfilePanel({ merchant, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (merchant) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [merchant, onClose]);

  if (!merchant) return null;

  const m = merchant;

  const statusColor: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Dormant: 'bg-amber-100 text-amber-700',
    Suspended: 'bg-red-100 text-red-700',
    Terminated: 'bg-gray-100 text-gray-600',
  };

  const tierBadge: Record<string, string> = {
    Platinum: 'bg-violet-100 text-violet-700 border-violet-200',
    Gold: 'bg-amber-50 text-amber-700 border-amber-200',
    Silver: 'bg-gray-100 text-gray-600 border-gray-200',
    Bronze: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const activityIcon: Record<string, string> = {
    Call: 'bg-blue-100 text-blue-600',
    Email: 'bg-emerald-100 text-emerald-600',
    Visit: 'bg-violet-100 text-violet-600',
  };

  const riskColor = (val: number, thresholds: [number, number]) =>
    val <= thresholds[0] ? 'text-[var(--color-ep-green)]' : val <= thresholds[1] ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]';

  const panel = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-[520px] bg-white shadow-2xl flex flex-col animate-slideIn"
        style={{ animationDuration: '200ms' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-ep-green-light)] to-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{m.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${tierBadge[m.tier]}`}>
                  {m.tier}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">{m.dba}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[m.status]}`}>
                  {m.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <MapPin size={14} className="text-[var(--color-text-muted)]" />
              <span>{m.city}, {m.state}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Phone size={14} className="text-[var(--color-text-muted)]" />
              <span>{m.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Mail size={14} className="text-[var(--color-text-muted)]" />
              <span className="truncate">{m.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <User size={14} className="text-[var(--color-text-muted)]" />
              <span>{m.assignedRep}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Calendar size={14} className="text-[var(--color-text-muted)]" />
              <span>Enrolled {m.enrolledDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Calendar size={14} className="text-[var(--color-text-muted)]" />
              <span>First Fund {m.firstFundedDate || 'N/A'}</span>
            </div>
          </div>

          {/* Performance KPIs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              <KPI label="Volume MTD" value={`$${(m.volumeMTD / 1000).toFixed(0)}K`} />
              <KPI label="Volume YTD" value={`$${(m.volumeYTD / 1000).toFixed(0)}K`} />
              <KPI label="Deals MTD" value={m.dealsMTD.toString()} />
              <KPI label="Deals YTD" value={m.dealsYTD.toString()} />
              <KPI label="Approval Rate" value={`${m.approvalRate}%`} color={m.approvalRate >= 70 ? 'green' : m.approvalRate >= 60 ? 'orange' : 'red'} />
              <KPI label="Funding Rate" value={`${m.fundingRate}%`} color={m.fundingRate >= 65 ? 'green' : m.fundingRate >= 55 ? 'orange' : 'red'} />
              <KPI label="Avg Ticket" value={`$${m.avgTicket.toLocaleString()}`} />
              <KPI label="AutoPay Attach" value={`${m.autoPayAttachRate}%`} color={m.autoPayAttachRate >= 80 ? 'green' : m.autoPayAttachRate >= 70 ? 'orange' : 'red'} />
            </div>
          </div>

          {/* Volume Trend Chart */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Volume Trend (6 Months)</h3>
            <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)]">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={m.monthlyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} />
                  <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Indicators */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              Risk Indicators
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)] text-center">
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Delinquency</div>
                <div className={`text-lg font-bold tabular-nums ${riskColor(m.delinquencyRate, [4, 7])}`}>
                  {m.delinquencyRate}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)] text-center">
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Chargeback</div>
                <div className={`text-lg font-bold tabular-nums ${riskColor(m.chargebackRate, [1, 2])}`}>
                  {m.chargebackRate}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)] text-center">
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">FPD Rate</div>
                <div className={`text-lg font-bold tabular-nums ${riskColor(m.fpdRate, [5, 8])}`}>
                  {m.fpdRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {m.recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${activityIcon[a.type] || 'bg-gray-100 text-gray-600'}`}>
                    {a.type[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">{a.type}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">{a.date}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{a.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--color-border)] bg-gray-50">
          <button
            onClick={() => exportMerchantReport(m)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-ep-green)] text-white text-sm font-medium rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Download size={15} />
            Download Merchant Report
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(panel, document.body) : null;
}

function KPI({ label, value, color }: { label: string; value: string; color?: 'green' | 'orange' | 'red' }) {
  const colorClass = color === 'green' ? 'text-[var(--color-ep-green)]' : color === 'orange' ? 'text-[var(--color-ep-orange)]' : color === 'red' ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-text-primary)]';
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-[var(--color-border)]">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</div>
      <div className={`text-base font-bold tabular-nums ${colorClass}`}>{value}</div>
    </div>
  );
}
