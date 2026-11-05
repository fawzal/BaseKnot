import { BookOpen, Layers, Palette, Terminal } from 'lucide-react';
import { ActiveTab } from '@/types/database';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  counts: {
    research: number;
    features: number;
    sitemap: number;
    tokens: number;
  };
}

export function NavigationTabs({ activeTab, onTabChange, counts }: NavigationTabsProps) {
  const tabs = [
    {
      id: 'research' as ActiveTab,
      label: '1. Research & Features',
      icon: BookOpen,
      badge: `${counts.research} / ${counts.features}`,
      desc: 'Insight to Feature Mapping',
    },
    {
      id: 'sitemap' as ActiveTab,
      label: '2. Sitemap Console',
      icon: Layers,
      badge: counts.sitemap,
      desc: 'Page & Hierarchy Placement',
    },
    {
      id: 'tokens' as ActiveTab,
      label: '3. UI & Token Definer',
      icon: Palette,
      badge: counts.tokens,
      desc: 'Design Tokens & Components',
    },
    {
      id: 'export' as ActiveTab,
      label: '4. Context Export',
      icon: Terminal,
      badge: 'Prompt',
      desc: 'Relational System Prompt',
    },
  ];

  return (
    <div className="border-b border-border bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-surface-elevated text-foreground border border-border shadow-surface-card'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-foreground-subtle'}`} />
                <span className="font-medium tracking-tight">{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/20'
                      : 'bg-surface text-foreground-subtle border border-border'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
