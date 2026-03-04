'use client';

import KPICard from '../KPICard';
import ChartCard from '../ChartCard';
import StatusBadge from '../StatusBadge';
import SubTabFilter from '../SubTabFilter';
import { useState } from 'react';
import { collectionsData, saveVsRollTrend, recoveryPerformance } from '@/data/mockData';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';

export default function Collections({ dateRange }: { dateRange?: DateRange }) {
  const [subTab, setSubTab] = useState('Combined');
  const d = collectionsData;

  return (
    <div>
      <SubTabFilter tabs={['Combined', 'Finance (RIC)', 'LTO']} activeTab={subTab} onTabChange={setSubTab} />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          {subTab} Collections
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <KPICard title="Contact Rate" value={`${d.combined.contactRate}%`} subtitle={`Target: ${d.combined.contactRateTarget}%`} status={d.combined.contactRate >= d.combined.contactRateTarget ? 'green' : 'orange'} tooltip="Percentage of delinquent accounts where an agent successfully made contact with the borrower. Right Party Contact (RPC) only." />
        <KPICard title="PTP Capture" value={`${d.combined.ptpCapture}%`} subtitle={`Target: ${d.combined.ptpCaptureTarget}%`} status={d.combined.ptpCapture >= d.combined.ptpCaptureTarget ? 'green' : 'orange'} tooltip="Promise-to-Pay Capture — percentage of contacted accounts where the borrower committed to a payment date." />
        <KPICard title="PTP Fulfill" value={`${d.combined.ptpFulfill}%`} subtitle={`Target: ${d.combined.ptpFulfillTarget}%`} status={d.combined.ptpFulfill >= d.combined.ptpFulfillTarget ? 'green' : 'orange'} tooltip="Promise-to-Pay Fulfill — percentage of PTP commitments where the borrower actually made the promised payment on time." />
        <KPICard title="Payment Plans" value={`${d.combined.paymentPlans}%`} subtitle={`Target: ${d.combined.paymentPlansTarget}%`} status={d.combined.paymentPlans >= d.combined.paymentPlansTarget ? 'green' : 'orange'} tooltip="Percentage of delinquent accounts enrolled in a structured payment plan arrangement to cure their past-due balance." />
        <KPICard title="Cure Rate" value={`${d.combined.cureRate}%`} subtitle={`Target: ${d.combined.cureRateTarget}%`} status={d.combined.cureRate >= d.combined.cureRateTarget ? 'green' : 'orange'} tooltip="Percentage of delinquent accounts that returned to current (0 DPD) status within the reporting period." />
        <KPICard title="Save Rate" value={`${d.combined.saveRate}%`} subtitle={`Target: ${d.combined.saveRateTarget}%`} status={d.combined.saveRate >= d.combined.saveRateTarget ? 'green' : 'red'} tooltip="Percentage of accounts that were saved from charge-off through collections efforts. Combines cures, payment plans, and settlements." />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Save vs Roll Rate Trend">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={saveVsRollTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend iconSize={8} />
              <Area type="monotone" dataKey="saveRate" name="Save Rate" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              <Area type="monotone" dataKey="rollRate" name="Roll Rate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recovery Performance">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={recoveryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip />
              <Legend iconSize={8} />
              <Line yAxisId="left" type="monotone" dataKey="recoveryPct" name="Recovery %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="amount" name="Amount ($)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* DPD Bucket Table */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-green)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">DPD Bucket Detail — {subTab}</h2>
      </div>

      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Bucket</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Accounts</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">% Portfolio</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Exposure</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">MoM</th>
              <th className="text-center px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {d.dpdBuckets.map((row) => (
              <tr key={row.bucket} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${row.status === 'Healthy' ? 'bg-[var(--color-ep-green)]' : row.status === 'Stable' ? 'bg-[var(--color-ep-green)]' : row.status === 'Watch' ? 'bg-[var(--color-ep-orange)]' : 'bg-[var(--color-ep-red)]'}`} />
                  <span className="font-medium">{row.bucket}</span>
                </td>
                <td className="text-right px-5 py-3.5 font-semibold tabular-nums">{row.accounts.toLocaleString()}</td>
                <td className="text-right px-5 py-3.5 tabular-nums">{row.pctPortfolio}%</td>
                <td className="text-right px-5 py-3.5 font-semibold tabular-nums">${row.exposure}M</td>
                <td className={`text-right px-5 py-3.5 tabular-nums ${row.momDir === 'up' ? 'text-[var(--color-ep-red)]' : row.momDir === 'flat' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-ep-green)]'}`}>
                  {row.momDir === 'up' ? '↑' : row.momDir === 'flat' ? '→' : '↓'} {row.mom}%
                </td>
                <td className="text-center px-5 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
