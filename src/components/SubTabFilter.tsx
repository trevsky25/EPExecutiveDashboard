'use client';

type SubTabFilterProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function SubTabFilter({ tabs, activeTab, onTabChange }: SubTabFilterProps) {
  return (
    <div className="flex gap-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm rounded-md transition-all cursor-pointer ${
            activeTab === tab
              ? 'bg-[var(--color-ep-green)] text-white font-medium'
              : 'bg-white text-[var(--color-text-secondary)] hover:bg-gray-100 border border-[var(--color-border)]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
