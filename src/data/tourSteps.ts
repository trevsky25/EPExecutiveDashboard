import type { Step } from 'react-joyride';

// ── Main Onboarding Tour (first login) ──
export const mainTourSteps: Step[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigate the Dashboard',
    content: 'Use the sidebar to switch between departments — Overview, Sales & Growth, Portfolio & Risk, and Analytics.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="search"]',
    title: 'Quick Search',
    content: 'Press ⌘K (or Ctrl+K) to instantly search across merchants, metrics, and reports.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="date-filter"]',
    title: 'Filter by Date Range',
    content: 'Toggle between MTD, QTD, YTD, or set a custom date range. All metrics update in real-time.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="insight-banner"]',
    title: 'AI-Powered Insights',
    content: 'Each page shows real-time AI insights that highlight what needs your attention. Use the arrows to cycle through them.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="kpi-cards"]',
    title: 'Key Performance Indicators',
    content: 'Click any KPI card for a detailed breakdown with historical trends, targets, and contextual analysis.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="alert-bell"]',
    title: 'Alerts & Notifications',
    content: 'The bell icon shows alerts when metrics cross thresholds. Customize which alerts you receive in your profile settings.',
    placement: 'left-start',
  },
  {
    target: '[data-tour="export"]',
    title: 'Export Your Data',
    content: 'Download any view as CSV for spreadsheets or PDF for presentations and stakeholder reports.',
    placement: 'left-start',
  },
  {
    target: '[data-tour="profile-menu"]',
    title: 'Your Profile',
    content: 'Access saved reports, notification preferences, and re-take this tour anytime from here.',
    placement: 'left-start',
  },
];

// ── Custom Reports Tour ──
export const customReportsTourSteps: Step[] = [
  {
    target: '[data-tour="cr-subtabs"]',
    title: 'Choose Your View',
    content: 'Switch between Report Builder to create reports, Compare to analyze merchants side-by-side, and Saved Reports for templates.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="cr-datasource"]',
    title: 'Select a Data Source',
    content: 'Choose Merchants, Sales Reps, or Territories as the basis for your report. Each shows different dimensions and metrics.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="cr-metrics"]',
    title: 'Pick Your Metrics',
    content: 'Expand this panel to select which columns appear in your report. Toggle metrics on/off to customize your view.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="cr-filters"]',
    title: 'Add Filters',
    content: 'Narrow your results by industry, state, territory, performance metrics, or activity level. Combine multiple filters for precise analysis.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="cr-table"]',
    title: 'View & Sort Results',
    content: 'Click any column header to sort ascending or descending. The table updates in real-time as you adjust filters and metrics.',
    placement: 'top',
  },
  {
    target: '[data-tour="cr-export"]',
    title: 'Save or Export',
    content: 'Save your report for quick access later, or export it as CSV to share with your team.',
    placement: 'bottom',
  },
];

// ── Executive Summary Tour ──
export const executiveSummaryTourSteps: Step[] = [
  {
    target: '[data-tour="es-comparison"]',
    title: 'Finance vs LTO Comparison',
    content: 'Toggle the comparison view to see Finance (RIC) and Lease-to-Own metrics side-by-side. Quickly spot performance gaps between products.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="kpi-cards"]',
    title: 'Portfolio KPIs',
    content: 'These cards show real-time portfolio health — active accounts, delinquency, save rates, and collections. Click any card for a detailed breakdown.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="es-charts"]',
    title: 'Charts & Annotations',
    content: 'Hover data points for details. Use the Compare toggle to overlay prior-period data. Green dots mark annotations with context on notable events.',
    placement: 'top',
  },
];

// ── My Dashboard Tour ──
export const myDashboardTourSteps: Step[] = [
  {
    target: '[data-tour="md-pinned"]',
    title: 'Your Pinned KPIs',
    content: 'This is your personalized view. Pin the metrics that matter most to you for quick daily access.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="md-add"]',
    title: 'Add More KPIs',
    content: 'Click "Add KPIs" to browse metrics from every department — Sales, Collections, Credit Risk, and more.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="md-remove"]',
    title: 'Remove a KPI',
    content: 'Click the pin icon on any card to unpin it from your dashboard. You can always re-add it later.',
    placement: 'bottom',
  },
];

// ── Tour Registry ──
export const tourRegistry: Record<string, Step[]> = {
  main: mainTourSteps,
  'custom-reports': customReportsTourSteps,
  'executive-summary': executiveSummaryTourSteps,
  'my-dashboard': myDashboardTourSteps,
};
