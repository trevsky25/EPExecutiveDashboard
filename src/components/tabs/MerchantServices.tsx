'use client';

import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import {
  merchantServicesData, merchantPartnerGrowth, merchantSupportVolume,
  merchantTierDistribution, merchantTopIssues,
} from '@/data/mockData';
import {
  ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function MerchantServices({ dateRange }: { dateRange?: DateRange }) {
  const d = merchantServicesData.overview;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-purple)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-purple)]">
          Merchant Services
        </span>
      </div>

      <InsightBanner tab="merchant-services" />

      {/* KPIs Row 1 — Partner Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KPICard
          title="Total Partners"
          value={d.totalPartners.toLocaleString()}
          trend={d.totalPartnersTrend}
          status="green"
          tooltip="Total number of merchant partners enrolled in the EasyPay platform, including both active and inactive."
          detail={{
            history: merchantPartnerGrowth.map(m => ({ period: m.month, value: m.total })),
            breakdown: [
              { label: 'Active Partners', value: d.activePartners.toLocaleString(), pct: d.activePartnersPct, status: 'green' },
              { label: 'Inactive Partners', value: (d.totalPartners - d.activePartners).toLocaleString(), pct: 100 - d.activePartnersPct, status: 'orange' },
            ],
            insights: [
              'Partner base growing steadily at 2.8% MoM.',
              '83.6% of partners are actively submitting applications.',
              '47 new partners onboarded this month.',
            ],
          }}
        />
        <KPICard
          title="Active Partners"
          value={d.activePartners.toLocaleString()}
          subtitle={`${d.activePartnersPct}%`}
          status="green"
          tooltip="Partners that have submitted at least one application in the last 30 days. Key indicator of partner engagement."
          detail={{
            history: merchantPartnerGrowth.map(m => ({ period: m.month, value: m.active })),
            insights: [
              'Active rate at 83.6% — above 80% target.',
              'Platinum and Gold tiers maintain highest activity rates.',
            ],
          }}
        />
        <KPICard
          title="New Onboarded MTD"
          value={d.newOnboardedMTD.toString()}
          trend={d.newOnboardedTrend}
          status="green"
          tooltip="New merchant partners onboarded month-to-date. Includes completed enrollment and system setup."
          detail={{
            history: merchantPartnerGrowth.map(m => ({ period: m.month, value: m.new })),
            insights: [
              '47 new partners onboarded — 18% increase over last month.',
              'Average onboarding time reduced to 4.2 days.',
              'Top verticals for new partners: Auto, Furniture, Home Services.',
            ],
            target: '40/month',
          }}
        />
        <KPICard
          title="Avg Onboarding Days"
          value={d.avgOnboardingDays.toString()}
          status="blue"
          tooltip="Average number of business days from enrollment to first application submission readiness."
          detail={{
            history: [
              { period: 'Aug', value: 5.8 }, { period: 'Sep', value: 5.4 }, { period: 'Oct', value: 5.1 },
              { period: 'Nov', value: 4.8 }, { period: 'Dec', value: 4.5 }, { period: 'Jan', value: 4.2 },
            ],
            insights: [
              'Onboarding time decreased from 5.8 to 4.2 days over 6 months.',
              'Streamlined portal setup contributing to faster activation.',
            ],
            target: '5 days',
          }}
        />
      </div>

      {/* KPIs Row 2 — Support & Satisfaction */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KPICard
          title="Partner Satisfaction"
          value={`${d.partnerSatisfaction}/${d.partnerSatisfactionMax}`}
          status="green"
          tooltip="Average partner satisfaction score from quarterly surveys. Scale of 1-5."
        />
        <KPICard
          title="Support Tickets Open"
          value={d.supportTicketsOpen.toString()}
          trend={d.supportTicketsTrend}
          trendDir="down"
          status="green"
          tooltip="Currently open merchant support tickets. Declining trend indicates improved resolution efficiency."
          detail={{
            history: merchantSupportVolume.map(m => ({ period: m.month, value: m.opened })),
            insights: [
              'Open tickets down 6.2% from prior month.',
              'App Processing remains the top category at 29.6% of tickets.',
              'Average resolution time improved to 18.4 hours.',
            ],
          }}
        />
        <KPICard
          title="Avg Resolution Time"
          value={`${d.avgResolutionHours}h`}
          status="green"
          tooltip="Average time in hours to resolve a merchant support ticket. Target is under 24 hours."
          detail={{
            history: merchantSupportVolume.map(m => ({ period: m.month, value: m.avgHours })),
            target: '24 hours',
          }}
        />
        <KPICard
          title="Churn Rate"
          value={`${d.merchantChurnRate}%`}
          trend={d.merchantChurnTrend}
          trendDir="up"
          status="orange"
          tooltip="Monthly merchant partner churn rate. Slight uptick — monitoring for seasonal vs structural causes."
          detail={{
            history: [
              { period: 'Aug', value: 1.6 }, { period: 'Sep', value: 1.7 }, { period: 'Oct', value: 1.8 },
              { period: 'Nov', value: 1.9 }, { period: 'Dec', value: 2.0 }, { period: 'Jan', value: 2.1 },
            ],
            insights: [
              'Churn rate trending up slightly from 1.6% to 2.1%.',
              '28 partners reactivated this month through outreach campaigns.',
              'Primary churn reasons: low volume, competitive switching.',
            ],
            target: '< 2.0%',
          }}
        />
      </div>

      {/* KPIs Row 3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="Reactivated MTD"
          value={d.reactivatedMTD.toString()}
          status="blue"
          tooltip="Previously dormant merchants reactivated this month through sales outreach or re-engagement campaigns."
        />
        <KPICard
          title="Integration Uptime"
          value={`${d.integrationUptime}%`}
          status="green"
          tooltip="API and system integration uptime for merchant-facing services. Target is 99.5% or above."
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Partner Growth & Onboarding">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={merchantPartnerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Bar yAxisId="right" dataKey="new" name="New Partners" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="total" name="Total Partners" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="active" name="Active Partners" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Support Ticket Volume">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={merchantSupportVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 30]} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Bar yAxisId="left" dataKey="opened" name="Opened" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgHours" name="Avg Hours" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tier Distribution Table */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-purple)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Partner Tier Distribution</h2>
      </div>

      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Tier</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Partners</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Volume MTD</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {merchantTierDistribution.map((tier) => (
              <tr key={tier.tier} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] transition-colors">
                <td className="px-5 py-3 font-medium">{tier.tier}</td>
                <td className="px-5 py-3 text-right tabular-nums">{tier.count.toLocaleString()}</td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">${(tier.volume / 1000000).toFixed(2)}M</td>
                <td className="px-5 py-3 text-right tabular-nums">{tier.pctTotal}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Issues Table */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-orange)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Top Support Issue Categories</h2>
      </div>

      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Category</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Tickets</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">% of Total</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {merchantTopIssues.map((issue) => (
              <tr key={issue.category} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] transition-colors">
                <td className="px-5 py-3 font-medium">{issue.category}</td>
                <td className="px-5 py-3 text-right tabular-nums">{issue.tickets}</td>
                <td className="px-5 py-3 text-right tabular-nums">{issue.pct}%</td>
                <td className={`px-5 py-3 text-right tabular-nums font-medium ${issue.trend < 0 ? 'text-[var(--color-ep-green)]' : issue.trend > 0 ? 'text-[var(--color-ep-red)]' : 'text-[var(--color-text-muted)]'}`}>
                  {issue.trend > 0 ? '+' : ''}{issue.trend}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
