'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import SubTabFilter from '../SubTabFilter';
import { portfolioHealthData, autoPayVsManualDelinquency, autoPayEnrollmentTrend, portfolioAging } from '@/data/mockData';
import {
  BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function PortfolioHealth({ dateRange }: { dateRange?: DateRange }) {
  const [subTab, setSubTab] = useState('Combined');
  const d = portfolioHealthData.combined;

  return (
    <div>
      <SubTabFilter tabs={['Combined', 'Finance (RIC)', 'LTO']} activeTab={subTab} onTabChange={setSubTab} />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          {subTab} Portfolio Health
        </span>
      </div>

      <InsightBanner tab="portfolio-health" />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Auto-Pay Accounts" value={d.autoPayAccounts.toLocaleString()} subtitle={`${d.autoPayPct}%`} status="green" tooltip="Total accounts enrolled in automatic payment (ACH or card-on-file). Higher auto-pay enrollment correlates with lower delinquency." />
        <KPICard title="AP Current" value={`${d.apCurrent}%`} subtitle={`${d.apCurrentCount.toLocaleString()} accts`} status="green" tooltip="Percentage of auto-pay accounts that are current (0 DPD). Auto-pay accounts typically have significantly lower delinquency rates." />
        <KPICard title="AP Delinquent" value={d.apDelinquent.toLocaleString()} subtitle={`${d.apDelinquentPct}%`} status="red" tooltip="Number of auto-pay accounts that are delinquent — usually due to NSF/returned payments. These require immediate attention." />
        <KPICard title="Manual Pay" value={d.manualPay.toLocaleString()} subtitle={`${d.manualPayPct}%`} status="orange" tooltip="Accounts making payments manually (not enrolled in auto-pay). These have higher delinquency risk and are targets for AP enrollment campaigns." />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Auto-Pay vs Manual — Delinquency">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={autoPayVsManualDelinquency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="label" type="category" width={90} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => `${value}%`} />
              <Legend iconSize={8} />
              <Bar dataKey="current" name="Current" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="delinquent" name="Delinquent" fill="#ef4444" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Auto-Pay Enrollment Trend">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={autoPayEnrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Bar yAxisId="left" dataKey="enrolled" name="Enrolled" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="pct" name="% Current" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Portfolio Aging */}
      <ChartCard title="Portfolio Aging — Stacked View">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={portfolioAging}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => value.toLocaleString()} />
            <Legend iconSize={8} />
            <Bar dataKey="current" name="Current" fill="#10b981" stackId="a" />
            <Bar dataKey="dpd1_15" name="1-15 DPD" fill="#14b8a6" stackId="a" />
            <Bar dataKey="dpd16_30" name="16-30 DPD" fill="#f97316" stackId="a" />
            <Bar dataKey="dpd31_60" name="31-60 DPD" fill="#f59e0b" stackId="a" />
            <Bar dataKey="dpd61plus" name="61+ DPD" fill="#ef4444" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
