'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import ChartCard from '../ChartCard';
import SubTabFilter from '../SubTabFilter';
import MerchantSearch from '../MerchantSearch';
import MerchantProfilePanel from '../MerchantProfilePanel';
import BranchProfilePanel from '../BranchProfilePanel';
import Sparkline from '../Sparkline';
import {
  salesData, repScorecard, enrollmentsByMonth, topMerchantsByVolume, approvalRateByIndustry,
  merchantProfiles, type MerchantProfile,
  enrollmentOverview, enrollmentReps, isrAssignments, dailyEnrollmentPace,
  enrollmentProductMix, enrollmentsByState, enrollmentsByIndustry,
  territoryPerformance, topProducingMerchants, productionFunnel,
  branchDetails, type BranchDetail,
} from '@/data/mockData';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';

const SUB_TABS = ['Sales Overview', 'Enrollments', 'Territory', 'Production'];

export default function Sales({ dateRange }: { dateRange?: DateRange }) {
  const d = salesData.overview;
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<BranchDetail | null>(null);
  const [activeSubTab, setActiveSubTab] = useState('Sales Overview');

  const handleMerchantClick = (name: string) => {
    const match = merchantProfiles.find(
      (m) => m.name === name || m.dba === name || m.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) setSelectedMerchant(match);
  };

  const handleTerritoryClick = (territory: string) => {
    setSelectedTerritory(branchDetails[territory] || null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--color-ep-blue)]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-blue)]">
            Sales Performance
          </span>
        </div>
        {activeSubTab === 'Sales Overview' && (
          <MerchantSearch onSelect={setSelectedMerchant} />
        )}
      </div>

      <SubTabFilter tabs={SUB_TABS} activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === 'Sales Overview' && renderOverview(d, repScorecard, handleMerchantClick, handleTerritoryClick)}
      {activeSubTab === 'Enrollments' && renderEnrollments(handleTerritoryClick)}
      {activeSubTab === 'Territory' && renderTerritory(handleTerritoryClick)}
      {activeSubTab === 'Production' && renderProduction(handleMerchantClick)}

      <MerchantProfilePanel
        merchant={selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
      />
      <BranchProfilePanel
        territory={selectedTerritory}
        onClose={() => setSelectedTerritory(null)}
      />
    </div>
  );
}

// ─── Sales Overview (existing content) ───────────────────────────────────────

function renderOverview(
  d: typeof salesData.overview,
  reps: typeof repScorecard,
  handleMerchantClick: (name: string) => void,
  handleTerritoryClick: (territory: string) => void,
) {
  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <KPICard title="Active Merchants" value={d.totalActiveMerchants.toLocaleString()} status="green" tooltip="Total merchant partners currently active in the sales pipeline." />
        <KPICard title="New Enrollments MTD" value={d.newEnrollmentsMTD.toString()} trend={d.newEnrollmentsTrend} status="green" tooltip="New merchant partners enrolled month-to-date." />
        <KPICard title="Avg Days to First App" value={d.avgDaysToFirstApp.toString()} status="blue" tooltip="Average days from enrollment to first submitted application." />
        <KPICard title="Avg Days to First Fund" value={d.avgDaysToFirstFunding.toString()} status="blue" tooltip="Average days from enrollment to first funded deal." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <KPICard title="Approval Rate" value={`${d.overallApprovalRate}%`} status="green" tooltip="Overall approval rate across all merchants." />
        <KPICard title="Funding Rate" value={`${d.overallFundingRate}%`} status="green" tooltip="Percentage of approved applications that convert to funded contracts." />
        <KPICard title="Funded Volume MTD" value={`$${d.totalFundedVolumeMTD}M`} status="green" tooltip="Total dollar volume of contracts funded month-to-date." />
        <KPICard title="Funded Volume YTD" value={`$${d.totalFundedVolumeYTD}M`} status="green" tooltip="Total dollar volume of contracts funded year-to-date." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <KPICard title="Dormant 30+ Days" value={d.dormantMerchants30.toString()} subtitle="No activity" status="orange" tooltip="Merchants with no submissions in 30 days." />
        <KPICard title="Dormant 60+ Days" value={d.dormantMerchants60.toString()} subtitle="No activity" status="red" tooltip="Merchants with no submissions in 60+ days." />
        <KPICard title="Terminations MTD" value={d.merchantTerminations.toString()} status="red" tooltip="Merchant partners terminated month-to-date." />
      </div>

      {/* Rep Scorecard */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-blue)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Sales Rep Scorecard</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Rep</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Territory</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Merchants</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded MTD</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Volume MTD</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Enrollments</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Activation %</th>
              <th className="text-center px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {reps.map((rep) => (
              <tr key={rep.name} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium">{rep.name}</td>
                <td className="px-5 py-3"><button onClick={() => handleTerritoryClick(rep.territory)} className="text-[var(--color-ep-blue)] hover:underline cursor-pointer font-medium">{rep.territory}</button></td>
                <td className="px-5 py-3 text-right tabular-nums">{rep.merchants}</td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">{rep.fundedMTD}</td>
                <td className="px-5 py-3 text-right tabular-nums">${(rep.volumeMTD / 1000).toFixed(0)}K</td>
                <td className="px-5 py-3 text-right tabular-nums">{rep.enrollmentsMTD}</td>
                <td className={`px-5 py-3 text-right tabular-nums font-medium ${rep.activationRate >= 88 ? 'text-[var(--color-ep-green)]' : rep.activationRate >= 85 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]'}`}>
                  {rep.activationRate}%
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex justify-center">
                    <Sparkline data={rep.monthlyFunded} color={rep.activationRate >= 88 ? '#10b981' : rep.activationRate >= 85 ? '#f59e0b' : '#ef4444'} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Enrollment & Activation Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip />
              <Legend iconSize={8} />
              <Line type="monotone" dataKey="enrolled" name="Enrolled" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="activated" name="Activated" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="terminated" name="Terminated" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Approval Rate by Industry">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={approvalRateByIndustry}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="industry" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="rate" name="Approval Rate" radius={[4, 4, 0, 0]} barSize={40}>
                {approvalRateByIndustry.map((entry, index) => (
                  <Cell key={index} fill={entry.rate >= 65 ? '#10b981' : entry.rate >= 58 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Merchants Table */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-green)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Top Merchants by Volume</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Merchant</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Industry</th>
              <th className="text-center px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">State</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Volume MTD</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Deals MTD</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Approval %</th>
              <th className="text-center px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topMerchantsByVolume.map((m) => {
              const profile = merchantProfiles.find(p => p.name === m.name);
              const volumeData = profile?.monthlyVolume.map(v => v.volume) || [];
              return (
                <tr key={m.name} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleMerchantClick(m.name)}>
                  <td className="px-5 py-3 font-medium text-[var(--color-ep-blue)] hover:underline">{m.name}</td>
                  <td className="px-5 py-3 text-[var(--color-text-secondary)]">{m.industry}</td>
                  <td className="px-5 py-3 text-center">{m.state}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">${(m.volumeMTD / 1000).toFixed(0)}K</td>
                  <td className="px-5 py-3 text-right tabular-nums">{m.dealsMTD}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{m.approvalRate}%</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center">
                      {volumeData.length > 0 && <Sparkline data={volumeData} color="#3b82f6" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Enrollments Sub-Tab ─────────────────────────────────────────────────────

function renderEnrollments(handleTerritoryClick: (territory: string) => void) {
  const e = enrollmentOverview;
  return (
    <>
      {/* Enrollment KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard title="Total Enrollments" value={e.totalEnrollments.toString()} status="blue" tooltip="All new merchant enrollments this month across all sources." />
        <KPICard title="Credited to OSR" value={e.creditedToOSR.toString()} subtitle={`${e.creditedPct}% of total`} status="green" tooltip="Enrollments credited to Outside Sales Reps for commission tracking." />
        <KPICard title="Funded Volume" value={`$${(e.fundedVolume / 1000).toFixed(0)}K`} status="green" tooltip="Total funded dollar volume from enrolled merchants this month." />
        <KPICard title="Funded Apps" value={`${e.fundedApps} of ${e.totalApps}`} status="blue" tooltip="Funded applications out of total submitted across all merchants." />
        <KPICard title="Conversion Rate" value={`${e.conversionRate}%`} status="orange" tooltip="Percentage of submitted applications that resulted in a funded contract." />
      </div>

      {/* Daily Enrollment Pace */}
      <ChartCard title="Daily Enrollment Pace" badge="Feb 2026" badgeColor="blue">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dailyEnrollmentPace}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" name="Enrollments" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Product Mix + Top Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
        <ChartCard title="Product Mix">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={enrollmentProductMix} cx="50%" cy="50%" innerRadius={65} outerRadius={100} dataKey="value" nameKey="name" label={({ name, pct }) => `${name}: ${pct}%`}>
                {enrollmentProductMix.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value} />
              <Legend iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Markets by State">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentsByState} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis dataKey="state" type="category" width={100} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip />
              <Bar dataKey="count" name="Enrollments" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Rep Enrollment Credits */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-blue)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Rep Enrollment Credits</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Rep</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Territory</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Enrollments</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Credited</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded $</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded Apps</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Total Apps</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Conv %</th>
              <th className="text-center px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentReps.map((rep) => {
              const conv = rep.totalApps > 0 ? ((rep.fundedApps / rep.totalApps) * 100).toFixed(1) : '0';
              return (
                <tr key={rep.name} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium">{rep.name}</td>
                  <td className="px-5 py-3"><button onClick={() => handleTerritoryClick(rep.territory)} className="text-[var(--color-ep-blue)] hover:underline cursor-pointer font-medium">{rep.territory}</button></td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">{rep.enrollmentsMTD}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{rep.creditedMTD}</td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold">${(rep.fundedVolume / 1000).toFixed(1)}K</td>
                  <td className="px-5 py-3 text-right tabular-nums">{rep.fundedApps}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{rep.totalApps}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-medium ${Number(conv) >= 30 ? 'text-[var(--color-ep-green)]' : Number(conv) >= 20 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]'}`}>
                    {conv}%
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center">
                      <Sparkline data={rep.monthlyEnrollments} color="#3b82f6" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Industry Breakdown */}
      <ChartCard title="Enrollments by Industry">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={enrollmentsByIndustry} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis dataKey="industry" type="category" width={140} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip />
            <Bar dataKey="count" name="Enrollments" radius={[0, 4, 4, 0]} barSize={20}>
              {enrollmentsByIndustry.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}

// ─── Territory Sub-Tab ───────────────────────────────────────────────────────

function renderTerritory(handleTerritoryClick: (territory: string) => void) {
  const totalBranches = territoryPerformance.reduce((s, t) => s + t.branchCount, 0);
  const totalActive = territoryPerformance.reduce((s, t) => s + t.activeBranches, 0);
  const avgDelta = (territoryPerformance.reduce((s, t) => s + t.deltaPct, 0) / territoryPerformance.length).toFixed(1);

  return (
    <>
      {/* Territory KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Territories" value={territoryPerformance.length.toString()} status="blue" tooltip="Number of active sales territories." />
        <KPICard title="Total Branches" value={totalBranches.toString()} status="blue" tooltip="Total merchant branches across all territories." />
        <KPICard title="Active Branches" value={totalActive.toString()} subtitle={`${((totalActive / totalBranches) * 100).toFixed(1)}%`} status="green" tooltip="Branches with post-migration activity." />
        <KPICard title="Avg Delta vs Pre" value={`${avgDelta}%`} status="red" tooltip="Average performance change vs pre-migration pace across all territories." />
      </div>

      {/* Territory Performance Table */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-blue)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Territory Performance</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Territory</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Branches</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Active</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Inactive</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Pre Avg/Mo</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Post Run Rate</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Delta %</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Enrollments</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">OSRs</th>
            </tr>
          </thead>
          <tbody>
            {territoryPerformance.map((t) => (
              <tr key={t.territory} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3"><button onClick={() => handleTerritoryClick(t.territory)} className="font-semibold text-[var(--color-ep-blue)] hover:underline cursor-pointer">{t.territory}</button></td>
                <td className="px-5 py-3 text-right tabular-nums">{t.branchCount}</td>
                <td className="px-5 py-3 text-right tabular-nums text-[var(--color-ep-green)]">{t.activeBranches}</td>
                <td className="px-5 py-3 text-right tabular-nums text-[var(--color-text-muted)]">{t.inactiveBranches}</td>
                <td className="px-5 py-3 text-right tabular-nums">${(t.preAvgMonthly / 1000).toFixed(0)}K</td>
                <td className="px-5 py-3 text-right tabular-nums">${(t.postRunRate / 1000).toFixed(0)}K</td>
                <td className={`px-5 py-3 text-right tabular-nums font-medium ${t.deltaPct > -20 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]'}`}>
                  {t.deltaPct}%
                </td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">{t.totalEnrollments}</td>
                <td className="px-5 py-3 text-sm text-[var(--color-text-secondary)]">{t.osrs.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OSR Assignment + ISR Support side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OSR Assignment */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[var(--color-ep-green)] rounded-full" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">OSR Assignment Breakdown</h2>
          </div>
          <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">OSR</th>
                  <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Territory</th>
                  <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Enrollments</th>
                  <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded $</th>
                  <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Apps</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentReps.map((rep) => (
                  <tr key={rep.name} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium">{rep.name}</td>
                    <td className="px-5 py-3"><button onClick={() => handleTerritoryClick(rep.territory)} className="text-[var(--color-ep-blue)] hover:underline cursor-pointer font-medium">{rep.territory}</button></td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{rep.enrollmentsMTD}</td>
                    <td className="px-5 py-3 text-right tabular-nums">${(rep.fundedVolume / 1000).toFixed(1)}K</td>
                    <td className="px-5 py-3 text-right tabular-nums">{rep.totalApps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ISR Support */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[var(--color-ep-teal)] rounded-full" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">ISR Support</h2>
          </div>
          <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">ISR</th>
                  <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Territory</th>
                  <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Enrollments Supported</th>
                </tr>
              </thead>
              <tbody>
                {isrAssignments.map((isr) => (
                  <tr key={isr.name} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium">{isr.name}</td>
                    <td className="px-5 py-3"><button onClick={() => handleTerritoryClick(isr.territory)} className="text-[var(--color-ep-blue)] hover:underline cursor-pointer font-medium">{isr.territory}</button></td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">{isr.enrollmentsSupported}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Production Sub-Tab ──────────────────────────────────────────────────────

function renderProduction(handleMerchantClick: (name: string) => void) {
  const e = enrollmentOverview;
  return (
    <>
      {/* Production KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KPICard title="Total Funded" value={`$${(e.fundedVolume / 1000).toFixed(0)}K`} status="green" tooltip="Total funded dollar volume from enrolled merchants." />
        <KPICard title="Producing Merchants" value={`${e.producingMerchants} of ${e.activeMerchants}`} status="green" tooltip="Merchants that have generated at least one funded deal." />
        <KPICard title="Avg Ticket" value={`$${e.avgTicket.toLocaleString()}`} status="blue" tooltip="Average funded amount per application." />
        <KPICard title="Total Apps" value={e.totalApps.toString()} status="blue" tooltip="Total applications submitted across all enrolled merchants." />
        <KPICard title="Funding Rate" value={`${e.conversionRate}%`} status="orange" tooltip="Percentage of applications that convert to funded contracts." />
      </div>

      {/* Production Funnel */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-purple)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Production Funnel</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-5 mb-6">
        <div className="space-y-4">
          {productionFunnel.map((stage, i) => {
            const maxVal = productionFunnel[0].value;
            const widthPct = Math.max((stage.value / maxVal) * 100, 8);
            return (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{stage.stage}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: stage.color }}>{stage.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-7 relative overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${widthPct}%`, backgroundColor: stage.color, opacity: 0.85 }}
                  >
                    {widthPct > 20 && (
                      <span className="text-white text-xs font-semibold">{stage.pct}%</span>
                    )}
                  </div>
                  {widthPct <= 20 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-text-muted)]">{stage.pct}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Producing Merchants */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-green)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Top Producing Merchants</h2>
      </div>
      <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-center px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">#</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Merchant</th>
              <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">OSR</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded $</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Funded Apps</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Total Apps</th>
              <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Conv Rate</th>
            </tr>
          </thead>
          <tbody>
            {topProducingMerchants.map((m) => (
              <tr key={m.rank} className="border-b border-[var(--color-border)] last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-[var(--color-text-muted)] font-medium">{m.rank}</td>
                <td className="px-5 py-3 font-medium text-[var(--color-ep-blue)]">
                  <button onClick={() => handleMerchantClick(m.name)} className="hover:underline cursor-pointer">{m.name}</button>
                </td>
                <td className="px-5 py-3 text-[var(--color-text-secondary)]">{m.osr}</td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold">${m.funded.toLocaleString()}</td>
                <td className="px-5 py-3 text-right tabular-nums">{m.fundedApps}</td>
                <td className="px-5 py-3 text-right tabular-nums">{m.totalApps}</td>
                <td className={`px-5 py-3 text-right tabular-nums font-medium ${m.conversionRate >= 50 ? 'text-[var(--color-ep-green)]' : m.conversionRate >= 30 ? 'text-[var(--color-ep-orange)]' : 'text-[var(--color-ep-red)]'}`}>
                  {m.conversionRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key Observations */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-[var(--color-ep-orange)] rounded-full" />
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Key Observations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Top Producer</div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">Puppies For Less Skypointe</div>
          <div className="text-xs text-[var(--color-ep-green)] mt-1">$28.5K — 17.1% of total</div>
        </div>
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Concentration</div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">Top 5 = $82.3K</div>
          <div className="text-xs text-[var(--color-ep-orange)] mt-1">49.4% of total volume</div>
        </div>
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Best Conversion</div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">The Auto Garage</div>
          <div className="text-xs text-[var(--color-ep-green)] mt-1">75.0% (3/4 funded)</div>
        </div>
        <div className="bg-[var(--color-card-bg)] rounded-lg border border-[var(--color-border)] p-4">
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Pets Vertical</div>
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">$46.8K funded</div>
          <div className="text-xs text-[var(--color-ep-blue)] mt-1">28.1% of non-auto production</div>
        </div>
      </div>
    </>
  );
}
