export type ActivityEvent = {
  id: string;
  type: 'merchant_onboarded' | 'funding_milestone' | 'rep_achievement' | 'alert_triggered' | 'system_event';
  title: string;
  description: string;
  timestamp: number;
  icon: string;  // Lucide icon name
  color: string; // hex color
  tab?: string;
};

function recentTimestamp(minutesAgo: number): number {
  return Date.now() - minutesAgo * 60 * 1000;
}

export const activityEvents: ActivityEvent[] = [
  { id: 'evt-1', type: 'merchant_onboarded', title: 'New Merchant Enrolled', description: 'Bella Casa Furniture (Dallas, TX) completed onboarding', timestamp: recentTimestamp(3), icon: 'Store', color: '#10b981', tab: 'merchant-services' },
  { id: 'evt-2', type: 'funding_milestone', title: 'Funding Milestone', description: 'January funded volume crossed $2.8M', timestamp: recentTimestamp(15), icon: 'DollarSign', color: '#3b82f6', tab: 'originations' },
  { id: 'evt-3', type: 'rep_achievement', title: 'Rep Achievement', description: 'Sara Porter hit 300+ funded MTD', timestamp: recentTimestamp(42), icon: 'Award', color: '#8b5cf6', tab: 'sales' },
  { id: 'evt-4', type: 'alert_triggered', title: 'Threshold Alert', description: 'LTO save rate dropped below 40%', timestamp: recentTimestamp(68), icon: 'AlertTriangle', color: '#f59e0b', tab: 'collections' },
  { id: 'evt-5', type: 'system_event', title: 'Batch Processing', description: 'Nightly ACH batch completed — 2,847 transactions', timestamp: recentTimestamp(120), icon: 'RefreshCw', color: '#64748b' },
  { id: 'evt-6', type: 'merchant_onboarded', title: 'New Merchant Enrolled', description: 'Supreme Auto Glass (Miami, FL) activated', timestamp: recentTimestamp(180), icon: 'Store', color: '#10b981', tab: 'merchant-services' },
  { id: 'evt-7', type: 'funding_milestone', title: 'Same-Day Funding', description: '68% of todays apps funded same-day', timestamp: recentTimestamp(210), icon: 'Zap', color: '#3b82f6', tab: 'originations' },
  { id: 'evt-8', type: 'rep_achievement', title: 'Territory Milestone', description: 'RIC-4 territory crossed $1M MTD volume', timestamp: recentTimestamp(300), icon: 'TrendingUp', color: '#8b5cf6', tab: 'sales' },
];

// Pool of additional events for simulation
const eventPool: Omit<ActivityEvent, 'id' | 'timestamp'>[] = [
  { type: 'merchant_onboarded', title: 'New Merchant Enrolled', description: 'Quick Fix Appliances (Austin, TX) signed up', icon: 'Store', color: '#10b981', tab: 'merchant-services' },
  { type: 'funding_milestone', title: 'Volume Update', description: 'Finance RIC funded volume at $1.1M', icon: 'DollarSign', color: '#3b82f6', tab: 'originations' },
  { type: 'rep_achievement', title: 'Enrollment Milestone', description: 'Jared Midkiff enrolled 20th merchant this month', icon: 'Award', color: '#8b5cf6', tab: 'sales' },
  { type: 'system_event', title: 'Report Generated', description: 'Weekly collections summary ready for review', icon: 'FileText', color: '#64748b', tab: 'collections' },
  { type: 'alert_triggered', title: 'Performance Alert', description: 'Customer care service level recovered to 84%', icon: 'Bell', color: '#f59e0b', tab: 'customer-care' },
];

let eventCounter = 100;
export function getNewEvent(): ActivityEvent {
  const template = eventPool[Math.floor(Math.random() * eventPool.length)];
  return { ...template, id: `evt-${eventCounter++}`, timestamp: Date.now() };
}
