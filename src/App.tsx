import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HabitManager } from './components/Habits/HabitManager';
import { DailyQuests } from './components/Quests/DailyQuests';
import { GrowthAnalytics } from './components/Analytics/GrowthAnalytics';
import { AiAdvicePlaceholder } from './components/AiAdvice/AiAdvicePlaceholder';
import { UserProfileView } from './components/Profile/UserProfile';
import { X, Sprout } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, growthNotification, clearNotification } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar />

      {/* Floating Growth Toast Notification */}
      {growthNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full p-4 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xl border border-stone-700 dark:border-stone-200 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <Sprout className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              {growthNotification}
            </p>
          </div>
          <button
            onClick={clearNotification}
            className="text-stone-400 hover:text-white dark:hover:text-stone-900 p-0.5"
            aria-label="關閉通知"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {activeTab === 'habits' && <HabitManager />}
        {activeTab === 'quests' && <DailyQuests />}
        {activeTab === 'analytics' && <GrowthAnalytics />}
        {activeTab === 'ai' && <AiAdvicePlaceholder />}
        {activeTab === 'profile' && <UserProfileView />}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            心耕樹境 · 日日行善，步步生蓮 · 做好事 · 說好話 · 存好心
          </p>
          <p className="text-[11px] text-stone-400">
            本機資料安全存儲 · 支援黑白雙主題
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
