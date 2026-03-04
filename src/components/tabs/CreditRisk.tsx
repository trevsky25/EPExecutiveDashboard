'use client';

import KPICard from '../KPICard';
import ChartCard from '../ChartCard';
import { creditRiskData, defaultRateByVintage, creditScoreDistribution, fpdByChannel, delinquencyByIndustry } from '@/data/mockData';
import {
  LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';

export default function CreditRisk({ dateRange }: { dateRange?: DateRange }) {
  const d = creditRiskData.overview;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-purple)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-purple)]">
          Credit & Risk Analytics
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Funded Contracts" value={d.totalFundedContracts.toLocaleString()} status="blue" tooltip="Cumulative number of contracts ever funded in the portfolio. Includes active, paid-off, and charged-off accounts." />
        <KPICard title="Avg DR Score" value={d.avgDRScore.toString()} status="green" tooltip="Average Decision Risk score across the funded portfolio. EP's proprietary credit scoring model — higher scores indicate lower risk." />
        <KPICard title="Avg APR" value={`${d.avgAPR}%`} status="blue" tooltip="Average Annual Percentage Rate across all active contracts. Reflects the portfolio's weighted average cost of credit to borrowers." />
        <KPICard title="Portfolio Balance" value={`$${d.portfolioBalance}M`} status="green" tooltip="Total outstanding principal balance across all active accounts in the portfolio. Excludes charged-off and paid-in-full accounts." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard title="FPD Rate (10+ DPD)" value={`${d.fpdRate}%`} trend={d.fpdRateTrend} status="green" tooltip="First Payment Default rate — percentage of newly funded contracts where the first payment is 10+ days past due. Early indicator of origination quality." />
        <KPICard title="Default Rate (61+)" value={`${d.defaultRate61}%`} trend={d.defaultRate61Trend} status="orange" tooltip="Percentage of active portfolio accounts that are 61+ days past due and classified as defaulted. Key credit risk metric." />
        <KPICard title="Avg Amount Financed" value={`$${d.avgAmountFinanced.toLocaleString()}`} status="blue" tooltip="Average principal amount per funded contract. Indicates typical deal size and exposure per account." />
      </div>

      {/* Vintage Curves */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-purple)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Default Rate by Vintage</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Vintage Default Curves">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={defaultRateByVintage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="vintage" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number | null) => value !== null ? `${value}%` : 'N/A'} />
              <Legend iconSize={8} />
              <Line type="monotone" dataKey="def90" name="Def 90" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="def120" name="Def 120" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="def180" name="Def 180" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
              <Line type="monotone" dataKey="def360" name="Def 360" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Credit Score Distribution & Default Rate">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={creditScoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Legend iconSize={8} />
              <Bar yAxisId="left" dataKey="count" name="Contracts" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="defaultRate" name="Default Rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* FPD by Channel & Industry Delinquency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="First Payment Default Rate by Channel">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fpdByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number, name: string) => name === 'fpdRate' ? `${value}%` : value.toLocaleString()} />
              <Bar dataKey="fpdRate" name="FPD Rate" radius={[4, 4, 0, 0]} barSize={40}>
                {fpdByChannel.map((entry, index) => (
                  <Cell key={index} fill={entry.fpdRate > 8 ? '#ef4444' : entry.fpdRate > 6 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Delinquency by Industry Table */}
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Delinquency by Industry</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left pb-2 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">Industry</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">Accounts</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">Delinq Rate</th>
                <th className="text-right pb-2 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">Exposure ($M)</th>
              </tr>
            </thead>
            <tbody>
              {delinquencyByIndustry.map((row) => (
                <tr key={row.industry} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-2.5 font-medium">{row.industry}</td>
                  <td className="py-2.5 text-right tabular-nums">{row.accounts.toLocaleString()}</td>
                  <td className={`py-2.5 text-right tabular-nums font-medium ${row.delinqRate > 8 ? 'text-[var(--color-ep-red)]' : row.delinqRate > 6 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-green)]'}`}>
                    {row.delinqRate}%
                  </td>
                  <td className="py-2.5 text-right tabular-nums">${row.exposure}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
