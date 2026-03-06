'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  LayoutGrid,
  TrendingUp,
  Rocket,
  Store,
  Activity,
  ShieldCheck,
  DollarSign,
  Headphones,
  FileBarChart,
  Smartphone,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
};

const navItems: NavItem[] = [
  { id: 'my-dashboard', label: 'My Dashboard', icon: <LayoutGrid size={18} />, section: 'OVERVIEW' },
  { id: 'executive-summary', label: 'Executive Summary', icon: <LayoutDashboard size={18} />, section: 'OVERVIEW' },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={18} />, section: 'SALES & GROWTH' },
  { id: 'originations', label: 'Originations', icon: <Rocket size={18} />, section: 'SALES & GROWTH' },
  { id: 'merchant-services', label: 'Merchant Services', icon: <Store size={18} />, section: 'SALES & GROWTH' },
  { id: 'portfolio-health', label: 'Portfolio Health', icon: <Activity size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'credit-risk', label: 'Credit & Risk', icon: <ShieldCheck size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'collections', label: 'Collections', icon: <DollarSign size={18} />, section: 'PORTFOLIO & RISK' },
  { id: 'customer-care', label: 'Customer Care', icon: <Headphones size={18} />, section: 'OVERVIEW' },
  { id: 'mobile-app', label: 'MyEasyPay Mobile', icon: <Smartphone size={18} />, section: 'ANALYTICS' },
  { id: 'website-traffic', label: 'Website Traffic', icon: <Globe size={18} />, section: 'ANALYTICS' },
  { id: 'outbound-marketing', label: 'Outbound Marketing', icon: <Mail size={18} />, section: 'ANALYTICS' },
  { id: 'custom-reports', label: 'Custom Reports', icon: <FileBarChart size={18} />, section: 'SALES & GROWTH' },
];

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const sections = ['OVERVIEW', 'SALES & GROWTH', 'PORTFOLIO & RISK', 'ANALYTICS'];

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileClose} />
      )}
      <aside
        data-tour="sidebar"
        className={`fixed left-0 top-0 h-screen bg-[var(--color-sidebar)] text-white flex flex-col transition-all duration-300 z-50 ${mobileOpen ? 'translate-x-0' : 'max-md:-translate-x-full'}`}
        style={{ width: collapsed && !mobileOpen ? 64 : 240 }}
      >
      {/* Logo + Collapse Toggle */}
      <div className="px-4 flex items-center justify-between border-b border-white/10" style={{ height: 60 }}>
        {!collapsed ? (
          <>
            <img src="/easypay-logo.svg" alt="EasyPay" className="h-10" />
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="mx-auto p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
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
                    onClick={() => { onTabChange(item.id); onMobileClose?.(); }}
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

      {/* Bottom controls */}
      <div className="border-t border-white/10">
        {/* Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer ${collapsed ? 'justify-center px-0' : ''}`}
            title={collapsed ? 'Sign out' : undefined}
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}

      </div>

      {/* Footer — Live time + date */}
      {!collapsed && (
        <div className="px-4 py-2.5 text-[11px] text-white/30 border-t border-white/10">
          {now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()} · {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
        </div>
      )}
      </aside>
    </>
  );
}
