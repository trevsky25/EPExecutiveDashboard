'use client';

import { useState } from 'react';
import KPICard from '../KPICard';
import InsightBanner from '../InsightBanner';
import ChartCard from '../ChartCard';
import SubTabFilter from '../SubTabFilter';
import {
  mobileAppData, mobileDownloadsTrend, mobileDauTrend,
  mobilePlatformSplit, mobileScreenViews,
} from '@/data/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { filterTimeSeries, type DateRange } from '@/lib/dateFilter';
import { TOOLTIP_STYLES } from '@/components/CustomTooltip';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function MobileApp({ dateRange }: { dateRange?: DateRange }) {
  const [subTab, setSubTab] = useState('Combined');
  const d = mobileAppData.combined;
  const ios = mobileAppData.ios;
  const android = mobileAppData.android;

  const filteredDownloads = filterTimeSeries(mobileDownloadsTrend, dateRange);
  const filteredDau = filterTimeSeries(mobileDauTrend, dateRange);

  return (
    <div>
      <SubTabFilter tabs={['Combined', 'iOS', 'Android']} activeTab={subTab} onTabChange={setSubTab} />

      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[var(--color-ep-blue)]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ep-blue)]">
          {subTab === 'Combined' ? 'MyEasyPay Mobile' : `MyEasyPay — ${subTab}`}
        </span>
      </div>

      <InsightBanner tab="mobile-app" />

      {/* KPIs */}
      {subTab === 'Combined' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
            <KPICard title="Total Downloads" value={d.totalDownloads.toLocaleString()} trend={d.totalDownloadsTrend} trendLabel="MoM" status="green" target="200,000" targetProgress={(d.totalDownloads / 200000) * 100} />
            <KPICard title="Monthly Downloads" value={d.monthlyDownloads.toLocaleString()} trend={d.monthlyDownloadsTrend} trendLabel="MoM" status="green" />
            <KPICard title="Daily Active Users" value={d.dau.toLocaleString()} trend={d.dauTrend} trendLabel="MoM" status="green" target="35,000" targetProgress={(d.dau / 35000) * 100} />
            <KPICard title="Monthly Active Users" value={d.mau.toLocaleString()} trend={d.mauTrend} trendLabel="MoM" status="green" />
            <KPICard title="Retention Rate" value={`${d.retentionRate}%`} trend={d.retentionTrend} status="green" target="75%" targetProgress={(d.retentionRate / 75) * 100} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
            <KPICard title="Avg Session" value={d.avgSessionDuration} trend={d.sessionTrend} status="blue" />
            <KPICard title="Crash Rate" value={`${d.crashRate}%`} trend={d.crashTrend} status="green" />
            <KPICard title="Push Opt-In" value={`${d.pushOptIn}%`} trend={d.pushTrend} status="green" />
            <KPICard title="Avg Rating" value={d.avgRating.toString()} subtitle={`${d.reviewCount.toLocaleString()} reviews`} status="green" />
          </div>
        </>
      )}

      {subTab === 'iOS' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          <KPICard title="iOS Downloads" value={ios.downloads.toLocaleString()} trend={ios.downloadsTrend} trendLabel="MoM" status="green" />
          <KPICard title="iOS DAU" value={ios.dau.toLocaleString()} status="green" />
          <KPICard title="iOS MAU" value={ios.mau.toLocaleString()} status="green" />
          <KPICard title="App Store Rating" value={ios.avgRating.toString()} subtitle={`${ios.reviewCount.toLocaleString()} reviews`} status="green" />
          <KPICard title="Crash Rate" value={`${ios.crashRate}%`} status="green" />
          <KPICard title="Retention" value={`${ios.retentionRate}%`} status="green" />
          <KPICard title="Current Version" value={ios.version} status="blue" />
        </div>
      )}

      {subTab === 'Android' && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          <KPICard title="Android Downloads" value={android.downloads.toLocaleString()} trend={android.downloadsTrend} trendLabel="MoM" status="green" />
          <KPICard title="Android DAU" value={android.dau.toLocaleString()} status="green" />
          <KPICard title="Android MAU" value={android.mau.toLocaleString()} status="green" />
          <KPICard title="Play Store Rating" value={android.avgRating.toString()} subtitle={`${android.reviewCount.toLocaleString()} reviews`} status="orange" />
          <KPICard title="Crash Rate" value={`${android.crashRate}%`} status="orange" />
          <KPICard title="Retention" value={`${android.retentionRate}%`} status="orange" />
          <KPICard title="Current Version" value={android.version} status="blue" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Downloads Trend — iOS vs Android">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={filteredDownloads}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Area type="monotone" dataKey="ios" name="iOS" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="android" name="Android" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Platform Split">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={mobilePlatformSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} label={({ name, value }) => `${name}: ${value}%`}>
                {mobilePlatformSplit.map((entry, i) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Active Users Trend">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredDau}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Legend />
              <Bar dataKey="ios" name="iOS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="android" name="Android" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Screens by Views">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mobileScreenViews} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis dataKey="screen" type="category" width={90} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip {...TOOLTIP_STYLES} />
              <Bar dataKey="views" name="Views" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
