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
import MyDashboard from '@/components/tabs/MyDashboard';
import ChatButton from '@/components/chat/ChatButton';
import ChatPanel from '@/components/chat/ChatPanel';
import SavedReportsPanel from '@/components/SavedReportsPanel';
import ActivityFeed from '@/components/ActivityFeed';
import type { SavedReport, ChatResponseData } from '@/lib/chat/chatTypes';
import { Circle, Search, ChevronDown, LogOut, FileText, Bell, Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import AlertBell from '@/components/AlertBell';
import NotificationPrefsModal from '@/components/NotificationPrefsModal';
import PresentationBar from '@/components/PresentationBar';
import { useTheme } from '@/lib/ThemeContext';
import ExportButton from '@/components/ExportButton';
import { downloadCSV } from '@/lib/exportCSV';
import { downloadPDF } from '@/lib/exportPDF';
import type { ExportFormat } from '@/components/ExportButton';
import type { DateRange } from '@/lib/dateFilter';
import {
  executiveSummary, collectionsData, customerCareData, originationsData,
  portfolioHealthData, creditRiskData, salesData, repScorecard, topMerchantsByVolume,
  delinquencyByIndustry, enrollmentReps, territoryPerformance, topProducingMerchants, merchantProfiles,
  branchDetails, type MerchantProfile, type BranchDetail,
} from '@/data/mockData';

const tabTitles: Record<string, string> = {
  'my-dashboard': 'My Dashboard',
  'executive-summary': 'Executive Summary',
  'customer-care': 'Customer Care',
  'sales': 'Sales',
  'originations': 'Originations',
  'merchant-services': 'Merchant Services',
  'portfolio-health': 'Portfolio Health',
  'credit-risk': 'Credit & Risk',
  'collections': 'Collections',
  'custom-reports': 'Custom Reports',
};

type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  initials: string;
};

function parseUserFromEmail(email: string): UserInfo {
  const local = email.split('@')[0];
  // Try common formats: first.last, first_last, firstlast
  const parts = local.split(/[._-]/);
  const firstName = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase() : 'User';
  const lastName = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase() : '';
  const initials = (firstName[0] + (lastName[0] || '')).toUpperCase();
  return { email, firstName, lastName, initials };
}

export default function Dashboard() {
  const { presentationMode, togglePresentation } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ period: 'MTD' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantProfile | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<BranchDetail | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [savedReportsOpen, setSavedReportsOpen] = useState(false);
  const [notifPrefsOpen, setNotifPrefsOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Load saved reports from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ep-saved-reports');
      if (stored) setSavedReports(JSON.parse(stored));
    } catch { /* ignore parse errors */ }
  }, []);

  // Persist saved reports to localStorage on change
  useEffect(() => {
    localStorage.setItem('ep-saved-reports', JSON.stringify(savedReports));
  }, [savedReports]);

  // Scroll shadow for sticky header
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSaveReport = useCallback((name: string, data: ChatResponseData, query?: string, source: 'finley' | 'custom' = 'finley') => {
    const report: SavedReport = {
      id: `report-${Date.now()}`,
      name,
      savedAt: Date.now(),
      source,
      query,
      data,
    };
    setSavedReports(prev => [report, ...prev]);
  }, []);

  const handleSaveCustomReport = useCallback((name: string, data: ChatResponseData) => {
    handleSaveReport(name, data, undefined, 'custom');
  }, [handleSaveReport]);

  const handleDeleteReport = useCallback((id: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== id));
  }, []);

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

  const handleExport = async (format: ExportFormat = 'csv') => {
    const tab = activeTab;
    const date = new Date().toISOString().slice(0, 10);
    const tabLabel = tabTitles[tab] || 'Dashboard';

    if (format === 'pdf') {
      await downloadPDF('dashboard-content', `EP_${tabLabel.replace(/\s+/g, '_')}_${date}`, `EasyPay ${tabLabel} Report — ${date}`);
      return;
    }

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
      case 'my-dashboard':
        return <MyDashboard onNavigateTab={setActiveTab} />;
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
        return <CustomReports dateRange={dateRange} onSaveReport={handleSaveCustomReport} />;
      case 'merchant-services':
        return <MerchantServices dateRange={dateRange} />;
      default:
        return <ExecutiveSummary dateRange={dateRange} />;
    }
  };

  // ── Login Gate ──
  if (!isAuthenticated) {
    return <LoginPage onLogin={(email) => {
      setUser(parseUserFromEmail(email));
      setIsAuthenticated(true);
    }} />;
  }

  // Presentation mode: use 0 sidebar width
  const effectiveSidebarWidth = presentationMode ? 0 : sidebarWidth;

  return (
    <div className={`min-h-screen ${presentationMode ? 'text-lg' : ''}`} style={{ overflowX: 'clip' }}>
      {!presentationMode && (
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={() => { setIsAuthenticated(false); setUser(null); setProfileMenuOpen(false); }}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content — dynamically offset by sidebar width */}
      <div
        className="min-h-screen transition-all duration-300 max-md:!ml-0"
        style={{ marginLeft: effectiveSidebarWidth }}
      >
        {/* Sticky Header — hidden in presentation mode */}
        <div className={`sticky top-0 z-40 bg-[var(--color-card-bg)] transition-shadow duration-200 ${isScrolled ? 'shadow-md' : ''} ${presentationMode ? 'hidden' : ''}`}>
          {/* Top row — Title, Search, Actions, Profile */}
          <div className="px-3 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer md:hidden flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={18} className="text-[var(--color-text-secondary)]" />
            </button>
            <h1 className="text-base font-semibold text-[var(--color-text-primary)] whitespace-nowrap">
              {tabTitles[activeTab] || 'Dashboard'}
            </h1>
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-ep-green)] bg-[var(--color-ep-green-light)] px-2 py-0.5 rounded-full font-medium">
              <Circle size={5} fill="currentColor" />
              Live
            </span>

            {/* Search — grows to fill space */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-hover-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-text-muted)] transition-colors cursor-pointer ml-auto max-w-[220px]"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-card-bg)] rounded border border-[var(--color-border)] ml-2">
                {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}K
              </kbd>
            </button>

            <div className="hidden sm:contents">
              <DateRangeFilter value={dateRange} onChange={setDateRange} />
              <ExportButton onExport={handleExport} />
              <ActivityFeed onNavigateTab={setActiveTab} />
            </div>
            <AlertBell onNavigateTab={setActiveTab} />
            <ThemeToggle />

            {/* Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(prev => !prev)}
                  className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-lg hover:bg-[var(--color-hover-bg)] transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a2332] to-[#2d4a6f] flex items-center justify-center text-white text-xs font-bold">
                    {user.initials}
                  </div>
                  <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-50" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-64 bg-[var(--color-card-bg)] rounded-xl shadow-lg border border-[var(--color-border)] z-50 overflow-hidden animate-fadeInUp">
                      <div className="px-4 py-3 bg-gradient-to-r from-[#1a2332] to-[#2d4a6f]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                            {user.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{user.firstName} {user.lastName}</div>
                            <div className="text-[11px] text-white/60">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setSavedReportsOpen(true); setProfileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
                        >
                          <FileText size={15} className="text-[var(--color-text-muted)]" />
                          Saved Reports
                          {savedReports.length > 0 && (
                            <span className="ml-auto text-[10px] font-medium bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                              {savedReports.length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => { setNotifPrefsOpen(true); setProfileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
                        >
                          <Bell size={15} className="text-[var(--color-text-muted)]" />
                          Notification Preferences
                        </button>
                        <div className="h-px bg-[var(--color-border)] mx-3 my-1" />
                        <button
                          onClick={() => { setIsAuthenticated(false); setUser(null); setProfileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-ep-red)] hover:bg-[var(--color-hover-bg)] transition-colors cursor-pointer"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                      <div className="px-4 py-2 bg-[var(--color-hover-bg)] border-t border-[var(--color-border)]">
                        <div className="text-[10px] text-[var(--color-text-muted)]">Signed in via Microsoft Entra ID</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div id="dashboard-content" className={presentationMode ? 'px-8 pt-6 pb-16' : 'px-3 sm:px-6 pt-4 sm:pt-5 pb-8 sm:pb-10'}>
          <div key={activeTab} className="animate-fadeInUp">
            {renderTab()}
          </div>
        </div>
      </div>

      {/* Presentation Mode Control Bar */}
      {presentationMode && (
        <PresentationBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExit={togglePresentation}
        />
      )}

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

      {/* Data-Aware Chatbot — hidden in presentation mode */}
      {!presentationMode && (
        <>
          <ChatButton
            onClick={() => setChatOpen(prev => !prev)}
            isOpen={chatOpen}
            unreadCount={0}
          />
          <ChatPanel
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            userName={user?.firstName}
            onSaveReport={handleSaveReport}
          />
        </>
      )}

      {/* Saved Reports Panel */}
      <SavedReportsPanel
        open={savedReportsOpen}
        onClose={() => setSavedReportsOpen(false)}
        reports={savedReports}
        onDelete={handleDeleteReport}
      />

      {/* Notification Preferences */}
      <NotificationPrefsModal open={notifPrefsOpen} onClose={() => setNotifPrefsOpen(false)} />

    </div>
  );
}
