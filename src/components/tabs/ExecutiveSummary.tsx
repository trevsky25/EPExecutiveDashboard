'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import ComparisonToggle from '../ComparisonToggle';
import AnnotationDot from '../AnnotationDot';
import HelpButton from '../HelpButton';
import {
  executiveSummary,
  saveRateTrend,
  monthlyFundingTrend,
  delinquencyWaterfall,
  channelMix,
  kpiDetails,
  prevSaveRateTrend,
  prevMonthlyFundingTrend,
} from '@/data/mockData';
import { mergeComparisonData } from '@/lib/comparisonData';
import { chartAnnotations } from '@/data/annotations';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function ExecutiveSummary({ dateRange }: { dateRange?: DateRange }) {
  const [showSaveRateComparison, setShowSaveRateComparison] = useState(false);
  const [showFundingComparison, setShowFundingComparison] = useState(false);

  const d = executiveSummary;
  const dr = dateRange || { period: 'MTD' as const };
  const filteredSaveRate = filterTimeSeries(saveRateTrend, dr);
  const filteredFunding = filterTimeSeries(monthlyFundingTrend, dr);
  const filteredPrevSaveRate = filterTimeSeries(prevSaveRateTrend, dr);
  const filteredPrevFunding = filterTimeSeries(prevMonthlyFundingTrend, dr);
  const saveRateAnnotations = chartAnnotations['save-rate-trend'] || [];
  const fundingAnnotations = chartAnnotations['monthly-funding-trend'] || [];

  const saveRateData = showSaveRateComparison
    ? mergeComparisonData(filteredSaveRate, filteredPrevSaveRate, ['financeSave', 'ltoSave'])
    : filteredSaveRate;

  const fundingData = showFundingComparison
    ? mergeComparisonData(filteredFunding, filteredPrevFunding, ['finance', 'lto'])
    : filteredFunding;

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          Combined Portfolio
        </span>
        <HelpButton tourId="executive-summary" />
      </div>

      <InsightBanner tab="executive-summary" />

      {/* Top KPIs */}
      <div data-tour="kpi-cards" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KPICard title="Active Accounts" value={d.combined.activeAccounts.toLocaleString()} trend={d.combined.activeAccountsTrend} trendLabel="MoM" status="green" tooltip="Total number of accounts with an outstanding balance across both Finance (RIC) and LTO portfolios." detail={kpiDetails.activeAccounts} target="50,000" targetProgress={(d.combined.activeAccounts / 50000) * 100} />
        <KPICard title="Current (0 DPD)" value={d.combined.current0DPD.toLocaleString()} subtitle={`${d.combined.current0DPDPct}%`} status="green" tooltip="Accounts with zero days past due — fully current on payments. Higher is better." detail={kpiDetails.current0DPD} target="85%" targetProgress={(d.combined.current0DPDPct / 85) * 100} />
        <KPICard title="At-Risk (31-60)" value={d.combined.atRisk31_60.toLocaleString()} trend={d.combined.atRisk31_60Trend} subtitle={`$${d.combined.atRisk31_60Exposure}M exposure`} status="orange" tooltip="Accounts 31–60 days past due. These are at risk of defaulting if not cured. Exposure = total outstanding balance." detail={kpiDetails.atRisk31_60} />
        <KPICard title="Default (61+)" value={d.combined.default61Plus.toLocaleString()} subtitle={`$${d.combined.default61PlusExposure}M exposure`} trendLabel={`${d.combined.default61PlusPct}%`} status="red" tooltip="Accounts 61+ days past due, classified as defaulted. These are typically sent to external collections or written off." detail={kpiDetails.default61Plus} />
        <KPICard title="Save Rate" value={`${d.combined.saveRate}%`} trend={d.combined.saveRateTrend} trendLabel="1pt target" status="red" tooltip="Percentage of delinquent accounts that collections agents successfully bring back to current status before charge-off." detail={kpiDetails.saveRate} target="46%" targetProgress={(d.combined.saveRate / 46) * 100} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <KPICard title="Collections MTD" value={`$${d.combined.collectionsMTD}M`} subtitle={`${d.combined.collectionsMTDPct}% of target`} status="green" tooltip="Total dollar amount collected from delinquent accounts month-to-date. Includes payments, settlements, and payment plan receipts." detail={kpiDetails.collectionsMTD} target="$1.96M" targetProgress={d.combined.collectionsMTDPct} />
      </div>

      {/* Finance vs LTO Side by Side */}
      <div data-tour="es-comparison" className="flex items-center gap-2 mb-4 mt-8">
        <div className="w-1 h-5 bg-[var(--color-ep-orange)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Finance (RIC) vs LTO — Side by Side</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Finance */}
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">Finance (RIC)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Active" value={d.finance.active.toLocaleString()} subtitle={`${d.finance.activePct}%`} status="green" tooltip="Active Finance (RIC) accounts with outstanding balances. Percentage shows share of total combined portfolio." />
            <KPICard title="Save Rate" value={`${d.finance.saveRate}%`} trend={d.finance.saveRateTrend} status="red" tooltip="Finance portfolio save rate — percentage of delinquent RIC accounts brought back to current status." />
            <KPICard title="Funded MTD" value={d.finance.fundedMTD.toLocaleString()} trend={d.finance.fundedMTDTrend} status="green" tooltip="Number of new Finance (RIC) contracts funded month-to-date through originations." />
            <KPICard title="CPH" value={d.finance.cph.toString()} subtitle={d.finance.cphStatus} status="green" tooltip="Calls Per Hour — average number of outbound collection calls handled per agent per hour on the Finance team." />
          </div>
        </div>

        {/* LTO */}
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">LTO (Lease-to-Own)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Active" value={d.lto.active.toLocaleString()} subtitle={`${d.lto.activePct}%`} status="green" tooltip="Active LTO (Lease-to-Own) accounts with outstanding balances. Percentage shows share of total combined portfolio." />
            <KPICard title="Save Rate" value={`${d.lto.saveRate}%`} trend={d.lto.saveRateTrend} status="red" tooltip="LTO portfolio save rate — percentage of delinquent lease accounts brought back to current status." />
            <KPICard title="Funded MTD" value={d.lto.fundedMTD.toLocaleString()} trend={d.lto.fundedMTDTrend} status="green" tooltip="Number of new LTO (Lease-to-Own) contracts funded month-to-date through originations." />
            <KPICard title="CPH" value={d.lto.cph.toString()} subtitle={d.lto.cphStatus} status="orange" tooltip="Calls Per Hour — average number of outbound collection calls handled per agent per hour on the LTO team." />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div data-tour="es-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Save Rate — Finance vs LTO" badge="Declining" badgeColor="red" headerRight={<ComparisonToggle enabled={showSaveRateComparison} onToggle={setShowSaveRateComparison} />}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={saveRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => `${value}%`} />
              <Legend iconSize={8} />
              <Area type="monotone" dataKey="financeSave" name="Finance Save" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="ltoSave" name="LTO Save" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" fill="transparent" strokeWidth={1} strokeDasharray="5 5" dot={(props: any) => {
                const ann = saveRateAnnotations.find(a => a.dataKey === props.payload?.month);
                if (ann) return <AnnotationDot key={ann.id} cx={props.cx} cy={props.cy} annotation={ann} />;
                return null;
              }} />
              {showSaveRateComparison && (
                <>
                  <Area type="monotone" dataKey="prev_financeSave" name="Prev Finance Save" stroke="#10b981" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.4} />
                  <Area type="monotone" dataKey="prev_ltoSave" name="Prev LTO Save" stroke="#14b8a6" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.4} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Funding — Finance vs LTO" badge="↑ 12.3%" badgeColor="green" headerRight={<ComparisonToggle enabled={showFundingComparison} onToggle={setShowFundingComparison} />}>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={fundingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Bar dataKey="finance" name="Finance" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lto" name="LTO" fill="#14b8a6" radius={[2, 2, 0, 0]} />
              <Line dataKey="lto" stroke="transparent" dot={(props: any) => {
                const ann = fundingAnnotations.find(a => a.dataKey === props.payload?.month);
                if (ann) return <AnnotationDot key={ann.id} cx={props.cx} cy={props.cy} annotation={ann} />;
                return null;
              }} legendType="none" activeDot={false} />
              {showFundingComparison && (
                <>
                  <Line type="monotone" dataKey="prev_finance" name="Prev Finance" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.4} dot={false} />
                  <Line type="monotone" dataKey="prev_lto" name="Prev LTO" stroke="#14b8a6" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.4} dot={false} />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Portfolio Delinquency Waterfall">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={delinquencyWaterfall}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
              <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => value.toLocaleString()} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {delinquencyWaterfall.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collections Channel Mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={channelMix} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" label={({ name, value, cx: cxP, cy: cyP, midAngle, outerRadius: oR }) => { const RADIAN = Math.PI / 180; const r = (oR as number) + 18; const x = (cxP as number) + r * Math.cos(-midAngle * RADIAN); const y = (cyP as number) + r * Math.sin(-midAngle * RADIAN); return <text x={x} y={y} fill="var(--color-text-secondary)" textAnchor={x > (cxP as number) ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>{`${name}: ${value}%`}</text>; }} labelLine={{ stroke: 'var(--color-text-muted)', strokeWidth: 1 }}>
                {channelMix.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => `${value}%`} />
              <Legend iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
