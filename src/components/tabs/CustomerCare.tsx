'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import ChartCard from '../ChartCard';
import SubTabFilter from '../SubTabFilter';
import { customerCareData, cphByTeam, callVolumeServiceLevel } from '@/data/mockData';
import {
  BarChart, Bar, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';

export default function CustomerCare({ dateRange }: { dateRange?: DateRange }) {
  const [subTab, setSubTab] = useState('Combined');
  const d = customerCareData.combined;

  return (
    <div>
      <SubTabFilter tabs={['Combined', 'Finance (RIC)', 'LTO']} activeTab={subTab} onTabChange={setSubTab} />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-green)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-green)]">
          {subTab} Customer Care
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        <KPICard title="Total Headcount" value={d.totalHeadcount.toString()} subtitle="Across all teams" status="blue" tooltip="Total number of active customer care agents across all teams and shifts. Sourced from Genesys Cloud workforce data." />
        <KPICard title="Blended CPH" value={d.blendedCPH.toString()} subtitle={d.cphDetail} status="green" tooltip="Blended Calls Per Hour — average calls handled per agent per hour across all customer care teams (Finance + LTO combined)." />
        <KPICard title="Avg Handle Time" value={d.avgHandleTime} subtitle={`Target: ${d.avgHandleTimeTarget}`} status="orange" tooltip="Average Handle Time — total time per call including talk time, hold time, and after-call work (ACW). Sourced from Genesys Cloud." />
        <KPICard title="First Call Res." value={`${d.firstCallRes}%`} trend={d.firstCallResTrend} status="green" tooltip="First Call Resolution — percentage of customer issues resolved on the first contact without requiring a callback or escalation." />
        <KPICard title="Service Level" value={`${d.serviceLevel}%`} subtitle={`Target: ${d.serviceLevelTarget}%`} status="green" tooltip="Percentage of inbound calls answered within the target wait time (typically 30 seconds). Key measure of staffing adequacy." />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-3 mb-6">
        <KPICard title="CSAT" value={d.csat.toString()} subtitle={`/ ${d.csatMax}`} status="green" tooltip="Customer Satisfaction Score — average post-call survey rating on a 5-point scale. Measures overall customer experience quality." />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CPH — Finance vs LTO Teams" badge="Gap: 12.3" badgeColor="red">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cphByTeam} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis dataKey="team" type="category" width={100} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip />
              <Bar dataKey="cph" name="CPH" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Call Volume & Service Level">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={callVolumeServiceLevel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Legend iconSize={8} />
              <Bar yAxisId="left" dataKey="volume" name="Call Volume" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="serviceLevel" name="Service Level" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
