'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import SubTabFilter from '../SubTabFilter';
import { originationsData, fundingTrend, approvalFunnel, merchantOnboardingTrend, merchantVerticalMix } from '@/data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

export default function Originations({ dateRange }: { dateRange?: DateRange }) {
  const [subTab, setSubTab] = useState('Combined');
  const f = originationsData.funding;
  const ms = originationsData.merchantServices;
  const mt = originationsData.merchantTeam;

  return (
    <div>
      <SubTabFilter tabs={['Combined', 'Finance (RIC)', 'LTO']} activeTab={subTab} onTabChange={setSubTab} />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          {subTab} Originations & Merchant Services
        </span>
      </div>

      <InsightBanner tab="originations" />

      {/* Funding Performance */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-blue)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Funding Performance</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        <KPICard title="Funded MTD" value={f.fundedMTD.toLocaleString()} trend={f.fundedMTDTrend} status="green" tooltip="Total number of new contracts funded (approved + disbursed) month-to-date across all channels." />
        <KPICard title="Volume MTD" value={`$${f.volumeMTD}M`} trend={f.volumeMTDTrend} status="green" tooltip="Total dollar amount of contracts funded month-to-date. Sum of all disbursed principal amounts." />
        <KPICard title="Avg Ticket" value={`$${f.avgTicket.toLocaleString()}`} subtitle="→ Flat" status="green" tooltip="Average financed amount per funded contract. Calculated as total funded volume divided by number of funded contracts." />
        <KPICard title="Approval Rate" value={`${f.approvalRate}%`} trend={f.approvalRateTrend} status="green" tooltip="Percentage of submitted applications that receive credit approval. Does not include withdrawn or incomplete applications." />
        <KPICard title="Auto-Pay Attach" value={`${f.autoPayAttach}%`} trend={f.autoPayAttachTrend} status="green" tooltip="Percentage of newly funded contracts enrolled in automatic payment (ACH/card) at the point of origination." />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 mb-8">
        <KPICard title="Avg Funding Speed" value={f.avgFundingSpeed} subtitle={`Same-day: ${f.sameDayPct}%`} status="blue" tooltip="Average time from application approval to funds disbursement. Same-day percentage shows instant funding rate." />
      </div>

      {/* Merchant Services */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[var(--color-ep-green)] rounded-full" />
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Merchant Services</h2>
        </div>
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          {ms.agents} Agents · {ms.totalPartners} Merchant Partners
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        <KPICard title="Active Merchants" value={ms.activeMerchants.toLocaleString()} trend={ms.activeMerchantsTrend} trendLabel="MoM" status="green" tooltip="Total merchant partners currently active and submitting applications. Excludes suspended or terminated merchants." />
        <KPICard title="New Onboarded MTD" value={ms.newOnboardedMTD.toString()} trend={ms.newOnboardedTrend} subtitle={`Pipeline: 82`} status="green" tooltip="New merchant partners fully onboarded and approved to submit applications month-to-date. Pipeline shows pending approvals." />
        <KPICard title="Activation Rate" value={`${ms.activationRate}%`} trend={ms.activationRateTrend} subtitle="First fund ≤30 days" status="green" tooltip="Percentage of newly onboarded merchants that submit and fund their first deal within 30 days of activation." />
        <KPICard title="Avg Vol / Merchant" value={`$${ms.avgVolPerMerchant}`} subtitle="Monthly avg" status="green" tooltip="Average monthly funded volume per active merchant. Indicates merchant productivity and engagement level." />
        <KPICard title="Merchant Churn" value={`${ms.merchantChurn}%`} trend={ms.merchantChurnTrend} subtitle={`108 lost MTD`} status="orange" tooltip="Monthly merchant attrition rate — percentage of active merchants that terminated or became inactive in the period." />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 mb-8">
        <KPICard title="Merchant CSAT" value={ms.merchantCSAT.toString()} subtitle="/ 5.0" status="green" tooltip="Merchant satisfaction score from quarterly surveys. Measures merchant partner experience with EP support and processes." />
      </div>

      {/* Merchant Services Team */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-teal)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Merchant Services Team</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
        <KPICard title="Calls MTD" value={mt.callsMTD.toLocaleString()} trend={mt.callsMTDTrend} status="green" tooltip="Total inbound and outbound calls handled by the Merchant Services team month-to-date. Sourced from Genesys Cloud." />
        <KPICard title="CPH" value={mt.cph.toString()} subtitle={mt.cphStatus} status="green" tooltip="Calls Per Hour for the Merchant Services team — measures agent efficiency in handling merchant support calls." />
        <KPICard title="Contacts / Merchant" value={mt.contactsPerMerchant.toString()} subtitle="Monthly avg" status="green" tooltip="Average number of touchpoints (calls, emails, chats) per active merchant per month. Indicates support engagement." />
        <KPICard title="Avg Response Time" value={mt.avgResponseTime} subtitle={`Target: ${mt.avgResponseTimeTarget}`} status="green" tooltip="Average time to first response on merchant inquiries. Includes calls, emails, and support tickets." />
        <KPICard title="Apps Processed" value={mt.appsProcessed.toLocaleString()} trend={mt.appsProcessedTrend} status="green" tooltip="Total applications reviewed and processed by the Merchant Services team month-to-date. Includes approvals, declines, and stipulations." />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Funding Trend — Finance vs LTO">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fundingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Bar dataKey="finance" name="Finance" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lto" name="LTO" fill="#14b8a6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Approval Funnel">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={approvalFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} formatter={(value: number) => value.toLocaleString()} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                {approvalFunnel.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Merchant Onboarding & Activation Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={merchantOnboardingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend iconSize={8} />
              <Line type="monotone" dataKey="newMerchants" name="New Merchants" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="activated" name="Activated" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Merchant Vertical Mix">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={merchantVerticalMix} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" label={({ name, value, cx: cxP, cy: cyP, midAngle, outerRadius: oR }) => { const RADIAN = Math.PI / 180; const r = (oR as number) + 18; const x = (cxP as number) + r * Math.cos(-midAngle * RADIAN); const y = (cyP as number) + r * Math.sin(-midAngle * RADIAN); return <text x={x} y={y} fill="var(--color-text-secondary)" textAnchor={x > (cxP as number) ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>{`${name}: ${value}%`}</text>; }} labelLine={{ stroke: 'var(--color-text-muted)', strokeWidth: 1 }}>
                {merchantVerticalMix.map((entry, index) => (
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
