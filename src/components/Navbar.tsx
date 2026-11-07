import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Compass,
  BarChart3,
  Sparkles,
  User,
  Sun,
  Moon,
  Sprout,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, toggleTheme, plantState } = useApp();

  const navItems = [
    { id: 'habits', label: '習慣打卡', icon: CheckCircle2 },
    { id: 'quests', label: '每日隨機任務', icon: Compass },
    { id: 'analytics', label: '成長分析', icon: BarChart3 },
    { id: 'ai', label: 'AI 建議', icon: Sparkles },
    { id: 'profile', label: '個人資料', icon: User },
  ] as const;

  return (
    <>
      {/* Desktop / Tablet Header: Strict Top Bar Contract */}
      <header className="sticky top-0 z-30 w-full border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single element) */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('habits')}>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5 text-emerald-50" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
                心耕樹境
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-stone-500 dark:text-stone-400 font-normal">
                Mindful Habit & Tree
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single line, no capsules) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 text-sm ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Quick Plant Status & Theme Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Plant Points Pill / Metric */}
            <div
              onClick={() => setActiveTab('habits')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium cursor-pointer hover:bg-emerald-100 transition-colors"
              title="點擊前往虛擬植物園"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="tabular-nums font-semibold">{plantState.growthPoints}</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400/80">心耕點</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="切換黑白主題"
              className="w-9 h-9 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={userProfile.theme === 'dark' ? '切換為明亮模式' : '切換為深黑模式'}
            >
              {userProfile.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Responsive Pattern 1) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1">
        <div className="grid grid-cols-5 items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[58px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
