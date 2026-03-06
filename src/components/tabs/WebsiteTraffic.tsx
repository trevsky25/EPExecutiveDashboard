'use client';

import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import {
  websiteTrafficData, websiteSessionsTrend, websiteTrafficSources,
  websiteDeviceBreakdown, websiteTopPages, websiteBounceRateTrend,
} from '@/data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function WebsiteTraffic({ dateRange }: { dateRange?: DateRange }) {
  const d = websiteTrafficData;
  const filteredSessions = filterTimeSeries(websiteSessionsTrend, dateRange);
  const filteredBounce = filterTimeSeries(websiteBounceRateTrend, dateRange);

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          Website Analytics
        </span>
      </div>

      <InsightBanner tab="website-traffic" />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        <KPICard title="Sessions" value={d.sessions.toLocaleString()} trend={d.sessionsTrend} trendLabel="MoM" status="green" />
        <KPICard title="Unique Visitors" value={d.uniqueVisitors.toLocaleString()} trend={d.uniqueVisitorsTrend} trendLabel="MoM" status="green" />
        <KPICard title="Page Views" value={d.pageViews.toLocaleString()} trend={d.pageViewsTrend} trendLabel="MoM" status="green" />
        <KPICard title="Bounce Rate" value={`${d.bounceRate}%`} trend={d.bounceRateTrend} status="orange" target="35%" targetProgress={((50 - d.bounceRate) / (50 - 35)) * 100} />
        <KPICard title="Avg Duration" value={d.avgSessionDuration} trend={d.sessionDurationTrend} status="green" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <KPICard title="Conversion Rate" value={`${d.conversionRate}%`} trend={d.conversionTrend} status="green" target="5%" targetProgress={(d.conversionRate / 5) * 100} />
        <KPICard title="Goal Completions" value={d.goalCompletions.toLocaleString()} trend={d.goalTrend} trendLabel="MoM" status="green" />
        <KPICard title="Pages / Session" value={d.pagesPerSession.toString()} status="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sessions & Visitors Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={filteredSessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Traffic Sources">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={websiteTrafficSources} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} label={({ name, value }) => `${name}: ${value}%`}>
                {websiteTrafficSources.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bounce Rate Trend vs Target">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={filteredBounce}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} domain={[30, 50]} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Bar dataKey="bounceRate" name="Bounce Rate" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Device Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={websiteDeviceBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="device" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Bar dataKey="sessions" name="Sessions %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="bounceRate" name="Bounce Rate %" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Pages Table */}
        <ChartCard title="Top Pages by Views" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Page</th>
                  <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Views</th>
                  <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)]">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {websiteTopPages.map((page) => (
                  <tr key={page.page} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 px-3 font-medium text-[var(--color-text-primary)]">{page.page}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[var(--color-text-secondary)]">{page.views.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      <span className={page.convRate >= 5 ? 'text-[var(--color-ep-green)]' : 'text-[var(--color-text-secondary)]'}>
                        {page.convRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
