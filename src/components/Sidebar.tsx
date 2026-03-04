'use client';

import {
  LayoutDashboard,
  TrendingUp,
  Rocket,
  Store,
  Activity,
  ShieldCheck,
  DollarSign,
  Headphones,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
};

const navItems: NavItem[] = [
  { id: 'executive-summary', label: 'Executive Summary', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={18} />, section: 'SALES & GROWTH' },
  { id: 'originations', label: 'Originations', icon: <Rocket size={18} />, section: 'SALES & GROWTH' },
  { id: 'merchant-services', label: 'Merchant Services', icon: <Store size={18} />, section: 'SALES & GROWTH' },
  { id: 'portfolio-health', label: 'Portfolio Health', icon: <Activity size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'credit-risk', label: 'Credit & Risk', icon: <ShieldCheck size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'collections', label: 'Collections', icon: <DollarSign size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'customer-care', label: 'Customer Care', icon: <Headphones size={18} />, section: 'OVERVIEW' },
  { id: 'custom-reports', label: 'Custom Reports', icon: <FileBarChart size={18} />, section: 'ANALYTICS' },
];

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) {
  const sections = ['OVERVIEW', 'SALES & GROWTH', 'PORTFOLIO & RISK', 'ANALYTICS'];

  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[var(--color-sidebar)] text-white flex flex-col transition-all duration-300 z-50"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2 border-b border-white/10">
        {!collapsed ? (
          <div>
            <img src="/easypay-logo.svg" alt="EasyPay" className="h-7" />
            <div className="text-[var(--color-ep-green)] text-[10px] tracking-[0.2em] uppercase mt-1.5">
              Executive Dashboard
            </div>
          </div>
        ) : (
          <img src="/easypay-e.svg" alt="EP" className="h-8 mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map((section) => {
          const items = navItems.filter((item) => item.section === section);
          if (items.length === 0) return null;

          return (
            <div key={section} className="mb-2">
              {!collapsed && (
                <div className="px-4 py-2 text-[10px] tracking-[0.15em] text-white/40 uppercase font-medium">
                  {section}
                </div>
              )}
              {items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-sidebar-active)] text-[var(--color-ep-green)] border-l-2 border-[var(--color-ep-green)]'
                        : 'text-white/70 hover:bg-[var(--color-sidebar-hover)] hover:text-white border-l-2 border-transparent'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="p-3 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors flex items-center justify-center cursor-pointer"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 text-[11px] text-white/30 border-t border-white/10">
          Updated Daily · 6:00 AM EST
        </div>
      )}
    </aside>
  );
}
