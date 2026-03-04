'use client';

import { useState, useEffect, useCallback } from 'react';
import LoginPage from '@/components/LoginPage';
import Sidebar from '@/components/Sidebar';
import DateRangeFilter from '@/components/DateRangeFilter';
import GlobalSearch from '@/components/GlobalSearch';
import MerchantProfilePanel from '@/components/MerchantProfilePanel';
import BranchProfilePanel from '@/components/BranchProfilePanel';
import ExecutiveSummary from '@/components/tabs/ExecutiveSummary';
import Collections from '@/components/tabs/Collections';
import CustomerCare from '@/components/tabs/CustomerCare';
import Originations from '@/components/tabs/Originations';
import PortfolioHealth from '@/components/tabs/PortfolioHealth';
import CreditRisk from '@/components/tabs/CreditRisk';
import Sales from '@/components/tabs/Sales';
import CustomReports from '@/components/tabs/CustomReports';
import MerchantServices from '@/components/tabs/MerchantServices';
import { Circle, Search } from 'lucide-react';
import ExportButton from '@/components/ExportButton';
import { downloadCSV } from '@/lib/exportCSV';
import type { DateRange } from '@/lib/dateFilter';
import {
  executiveSummary, collectionsData, customerCareData, originationsData,
  portfolioHealthData, creditRiskData, salesData, repScorecard, topMerchantsByVolume,
  delinquencyByIndustry, enrollmentReps, territoryPerformance, topProducingMerchants, merchantProfiles,
  branchDetails, type MerchantProfile, type BranchDetail,
} from '@/data/mockData';

const tabTitles: Record<string, string> = {
  'executive-summary': 'Executive Summary',
  'sales': 'Sales',
  'originations': 'Originations',
  'merchant-services': 'Merchant Services',
  'portfolio-health': 'Portfolio Health',
  'credit-risk': 'Credit & Risk',
  'collections': 'Collections',
  'customer-care': 'Customer Care',
  'custom-reports': 'Custom Reports',
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ period: 'MTD' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<BranchDetail | null>(null);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 64 : 240;

  const handleExport = () => {
    const tab = activeTab;
    const date = new Date().toISOString().slice(0, 10);
    const tabLabel = tabTitles[tab] || 'Dashboard';

    switch (tab) {
      case 'executive-summary': {
        const d = executiveSummary;
        downloadCSV(`EP_Executive_Summary_${date}`, ['Metric', 'Value'], [
          ['Active Accounts', d.combined.activeAccounts],
          ['Current (0 DPD)', d.combined.current0DPD],
          ['Current %', `${d.combined.current0DPDPct}%`],
          ['At-Risk (31-60)', d.combined.atRisk31_60],
          ['Default (61+)', d.combined.default61Plus],
          ['Save Rate', `${d.combined.saveRate}%`],
          ['Collections MTD', `$${d.combined.collectionsMTD}M`],
          ['Finance Active', d.finance.active],
          ['LTO Active', d.lto.active],
        ]);
        break;
      }
      case 'collections': {
        const d = collectionsData;
        downloadCSV(`EP_Collections_${date}`, ['Metric', 'Value'], [
          ['Contact Rate', `${d.combined.contactRate}%`],
          ['Contact Rate Target', `${d.combined.contactRateTarget}%`],
          ['PTP Capture', `${d.combined.ptpCapture}%`],
          ['PTP Fulfill', `${d.combined.ptpFulfill}%`],
          ['Payment Plans', `${d.combined.paymentPlans}%`],
          ['Cure Rate', `${d.combined.cureRate}%`],
          ['Save Rate', `${d.combined.saveRate}%`],
          ['Save Rate Target', `${d.combined.saveRateTarget}%`],
        ]);
        break;
      }
      case 'sales': {
        // Export all sales data: rep scorecard + enrollment credits + territory performance
        const repHeaders = ['Rep', 'Territory', 'Merchants', 'Funded MTD', 'Volume MTD', 'Enrollments', 'Activation %'];
        const repRows = repScorecard.map(r => [r.name, r.territory, r.merchants, r.fundedMTD, `$${r.volumeMTD.toLocaleString()}`, r.enrollmentsMTD, `${r.activationRate}%`]);

        const enrollHeaders = ['', '', 'ENROLLMENT CREDITS', '', '', '', ''];
        const enrollColHeaders = ['Rep', 'Territory', 'Enrollments MTD', 'Credited MTD', 'Funded $', 'Funded Apps', 'Conv %'];
        const enrollRows = enrollmentReps.map(r => [r.name, r.territory, r.enrollmentsMTD, r.creditedMTD, `$${r.fundedVolume.toLocaleString()}`, r.fundedApps, `${((r.fundedApps / r.totalApps) * 100).toFixed(1)}%`]);

        const terrHeaders = ['', '', 'TERRITORY PERFORMANCE', '', '', '', ''];
        const terrColHeaders = ['Territory', 'Branches', 'Active', 'Inactive', 'Pre Avg/Mo', 'Post Run Rate', 'Delta %'];
        const terrRows = territoryPerformance.map(r => [r.territory, r.branchCount, r.activeBranches, r.inactiveBranches, `$${(r.preAvgMonthly / 1000).toFixed(0)}K`, `$${(r.postRunRate / 1000).toFixed(0)}K`, `${r.deltaPct}%`]);

        downloadCSV(`EP_Sales_Full_Report_${date}`, repHeaders, [
          ...repRows, [''], enrollHeaders, enrollColHeaders, ...enrollRows, [''], terrHeaders, terrColHeaders, ...terrRows,
        ]);
        break;
      }
      case 'custom-reports': {
        const headers = ['Merchant', 'Industry', 'State', 'Territory', 'Tier', 'Status', 'Volume MTD', 'Approval %', 'Delinquency %'];
        const rows = merchantProfiles.map(m => [m.name, m.industry, m.state, m.territory, m.tier, m.status, `$${m.volumeMTD.toLocaleString()}`, `${m.approvalRate}%`, `${m.delinquencyRate}%`]);
        downloadCSV(`EP_Merchant_Data_${date}`, headers, rows);
        break;
      }
      case 'credit-risk': {
        const headers = ['Industry', 'Accounts', 'Delinq Rate', 'Exposure ($M)'];
        const rows = delinquencyByIndustry.map(r => [r.industry, r.accounts, `${r.delinqRate}%`, `$${r.exposure}M`]);
        downloadCSV(`EP_Credit_Risk_${date}`, headers, rows);
        break;
      }
      default: {
        // Generic export with tab overview KPIs
        downloadCSV(`EP_${tabLabel.replace(/\s+/g, '_')}_${date}`, ['Tab', 'Exported'], [[tabLabel, date]]);
        break;
      }
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();

  const renderTab = () => {
    switch (activeTab) {
      case 'executive-summary':
        return <ExecutiveSummary dateRange={dateRange} />;
      case 'collections':
        return <Collections dateRange={dateRange} />;
      case 'customer-care':
        return <CustomerCare dateRange={dateRange} />;
      case 'originations':
        return <Originations dateRange={dateRange} />;
      case 'portfolio-health':
        return <PortfolioHealth dateRange={dateRange} />;
      case 'credit-risk':
        return <CreditRisk dateRange={dateRange} />;
      case 'sales':
        return <Sales dateRange={dateRange} />;
      case 'custom-reports':
        return <CustomReports dateRange={dateRange} />;
      case 'merchant-services':
        return <MerchantServices dateRange={dateRange} />;
      default:
        return <ExecutiveSummary dateRange={dateRange} />;
    }
  };

  // ── Login Gate ──
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Content — dynamically offset by sidebar width */}
      <div
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#f0f2f5] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {tabTitles[activeTab] || 'Dashboard'}
            </h1>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-ep-green)] bg-[var(--color-ep-green-light)] px-2.5 py-1 rounded-full font-medium">
              <Circle size={6} fill="currentColor" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-muted)] bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-text-muted)] transition-colors cursor-pointer"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] bg-gray-50 rounded border border-gray-200 ml-2">
                {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}K
              </kbd>
            </button>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <ExportButton onClick={handleExport} />
            <div className="text-sm text-[var(--color-text-muted)] font-mono tracking-wider">
              {today}
            </div>
          </div>
        </header>

        {/* Tab Navigation — horizontal scroll */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 mb-5 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(tabTitles).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 text-[13px] rounded-md whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  activeTab === id
                    ? 'bg-[var(--color-ep-green)] text-white font-medium shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-text-primary)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-10">
          <div key={activeTab} className="animate-fadeInUp">
            {renderTab()}
          </div>
        </div>
      </div>

      {/* Global Search */}
      <GlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateTab={setActiveTab}
        onOpenMerchant={(m) => setSelectedMerchant(m)}
        onOpenTerritory={(t) => setSelectedTerritory(t)}
      />

      {/* Profile Panels (accessible from search) */}
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
