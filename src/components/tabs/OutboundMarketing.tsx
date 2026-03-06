'use client';

import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import {
  outboundMarketingData, marketingCampaigns,
  marketingOpenClickTrend, marketingListGrowth,
} from '@/data/mockData';
import {
  AreaChart, Area, ComposedChart, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function OutboundMarketing({ dateRange }: { dateRange?: DateRange }) {
  const d = outboundMarketingData;
  const filteredOpenClick = filterTimeSeries(marketingOpenClickTrend, dateRange);
  const filteredListGrowth = filterTimeSeries(marketingListGrowth, dateRange);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-orange)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-orange)]">
          Outbound Marketing — Mailchimp
        </span>
      </div>

      <InsightBanner tab="outbound-marketing" />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        <KPICard title="Campaigns Sent" value={d.totalCampaigns.toString()} subtitle={`+${d.campaignsTrend} this month`} status="blue" />
        <KPICard title="Emails Sent" value={d.emailsSent.toLocaleString()} trend={d.emailsSentTrend} trendLabel="MoM" status="green" />
        <KPICard title="Avg Open Rate" value={`${d.avgOpenRate}%`} trend={d.openRateTrend} status="green" target="40%" targetProgress={(d.avgOpenRate / 40) * 100} />
        <KPICard title="Avg Click Rate" value={`${d.avgClickRate}%`} trend={d.clickRateTrend} status="green" />
        <KPICard title="Unsubscribe Rate" value={`${d.unsubscribeRate}%`} trend={d.unsubscribeTrend} status="green" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KPICard title="List Size" value={d.listSize.toLocaleString()} trend={d.listGrowthRate} trendLabel="growth" status="green" />
        <KPICard title="Bounce Rate" value={`${d.bounceRate}%`} trend={d.bounceTrend} status="green" />
        <KPICard title="Revenue Attributed" value={`$${(d.revenueAttributed / 1000).toFixed(0)}K`} trend={d.revenueTrend} trendLabel="MoM" status="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Open Rate & Click Rate Trend">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={filteredOpenClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Bar dataKey="openRate" name="Open Rate %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
              <Line type="monotone" dataKey="clickRate" name="Click Rate %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subscriber List Growth">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={filteredListGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Area type="monotone" dataKey="subscribers" name="Total Subscribers" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Campaign Table */}
      <ChartCard title="Recent Campaigns">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Campaign</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Sent</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Open Rate</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Click Rate</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Date</th>
                <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {marketingCampaigns.map((c) => (
                <tr key={c.name} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-2.5 px-3 font-medium text-[var(--color-text-primary)]">{c.name}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-text-secondary)]">{c.sent.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className={c.openRate >= 35 ? 'text-[var(--color-ep-green)]' : 'text-[var(--color-text-secondary)]'}>
                      {c.openRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className={c.clickRate >= 5 ? 'text-[var(--color-ep-green)]' : 'text-[var(--color-text-secondary)]'}>
                      {c.clickRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-[var(--color-text-muted)]">{c.date}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ep-green)] bg-[var(--color-ep-green)]/10 px-2 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
