import React from 'react';
import { Sparkles, Compass, Lightbulb, Clock } from 'lucide-react';

export const AiAdvicePlaceholder: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-xs">
        <Sparkles className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
        AI 建議與智慧分析 · 模組預留
      </h2>

      <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 mb-6">
        「依循規劃，本欄位目前維持留白預留，未來將在此連結專屬智慧心靈教練」
      </p>

      <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 text-left space-y-3">
        <h3 className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>未來功能藍圖規劃：</span>
        </h3>
        <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">•</span>
            <span><strong>個人化習慣調適建議：</strong>根據您的連續堅持率與中斷週期，智慧微調習慣難度，避免倦怠。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">•</span>
            <span><strong>三好四給善念共鳴洞察：</strong>深度分析您的照片心得與反思文字，給予溫暖的心靈回應與每週能量總結。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">•</span>
            <span><strong>精神植物守護指引：</strong>提供身心靈平靜與正念冥想之語，陪伴生活步調。</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-400">
        <Clock className="w-3.5 h-3.5" />
        <span>心境沉澱中 · 敬請期待後續更新</span>
      </div>
    </div>
  );
};
