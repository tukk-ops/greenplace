import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestPhilosophy } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertCircle,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const GrowthAnalytics: React.FC = () => {
  const { habits, questSubmissions } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30days' | '14days'>('30days');

  // 1. Weekly completion rates (past 7 days)
  let weeklyHabitPossible = 0;
  let weeklyHabitCompleted = 0;
  const past7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    past7Days.push(dateStr);
    habits.forEach((h) => {
      weeklyHabitPossible++;
      if (h.completedDates.includes(dateStr)) {
        weeklyHabitCompleted++;
      }
    });
  }
  const weeklyHabitRate =
    weeklyHabitPossible > 0 ? Math.round((weeklyHabitCompleted / weeklyHabitPossible) * 100) : 0;

  // Weekly quests: 3 per day * 7 = 21 possible
  const weeklyQuestsCompleted = questSubmissions.filter((s) => past7Days.includes(s.date)).length;
  const weeklyQuestRate = Math.min(100, Math.round((weeklyQuestsCompleted / 21) * 100));

  // 2. Most Stable Habit & Most Vulnerable Habit
  const habitStats = habits.map((h) => {
    // 30 days completions
    let completedIn30Days = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      if (h.completedDates.includes(str)) completedIn30Days++;
    }
    const rate30 = Math.round((completedIn30Days / 30) * 100);
    return {
      habit: h,
      completedIn30Days,
      rate30,
      streak: h.streak,
    };
  });

  // Sort for most stable (highest rate + streak)
  const sortedByStability = [...habitStats].sort((a, b) => b.rate30 - a.rate30 || b.streak - a.streak);
  const mostStable = sortedByStability[0];

  // Sort for most fragile / needs attention (lowest rate)
  const sortedByFragile = [...habitStats].sort((a, b) => a.rate30 - b.rate30 || a.streak - b.streak);
  const mostFragile = sortedByFragile[0];

  // 3. Monthly Growth Curve Data (past 30 days)
  const daysCount = selectedTimeframe === '30days' ? 30 : 14;
  const growthCurvePoints: Array<{ date: string; label: string; points: number; completions: number }> = [];

  let runningPoints = 50; // Starting baseline
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const monthDay = `${d.getMonth() + 1}/${d.getDate()}`;

    // Count habit completions on this day
    const habitDone = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    // Count quest completions on this day
    const questDone = questSubmissions.filter((s) => s.date === dateStr).length;

    const gainedPoints = habitDone * 15 + questDone * 50;
    runningPoints += gainedPoints;

    growthCurvePoints.push({
      date: dateStr,
      label: monthDay,
      points: runningPoints,
      completions: habitDone + questDone,
    });
  }

  // 4. Positive Actions Accumulation (All 7 philosophies)
  const allPhilosophies: QuestPhilosophy[] = [
    '做好事',
    '說好話',
    '存好心',
    '給人信心',
    '給人歡喜',
    '給人希望',
    '給人方便',
  ];

  const positiveActionCounts: Record<QuestPhilosophy, number> = {
    '做好事': 0,
    '說好話': 0,
    '存好心': 0,
    '給人信心': 0,
    '給人歡喜': 0,
    '給人希望': 0,
    '給人方便': 0,
  };

  questSubmissions.forEach((sub) => {
    if (positiveActionCounts[sub.philosophy] !== undefined) {
      positiveActionCounts[sub.philosophy]++;
    }
  });

  const totalPositiveActions = Object.values(positiveActionCounts).reduce((a, b) => a + b, 0);

  // SVG Chart Dimensions for Monthly Growth
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minPts = Math.min(...growthCurvePoints.map((p) => p.points));
  const maxPts = Math.max(...growthCurvePoints.map((p) => p.points), minPts + 100);

  const getSvgX = (index: number) => {
    return paddingX + (index / (growthCurvePoints.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getSvgY = (points: number) => {
    const norm = (points - minPts) / (maxPts - minPts);
    return chartHeight - paddingY - norm * (chartHeight - paddingY * 2);
  };

  const linePathD = growthCurvePoints.reduce((acc, curr, idx) => {
    const x = getSvgX(idx);
    const y = getSvgY(curr.points);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaPathD = `${linePathD} L ${getSvgX(growthCurvePoints.length - 1)} ${chartHeight - paddingY} L ${getSvgX(
    0
  )} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            個人成長分析中心
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          整合習慣堅持度、三好四給善行次數與每月成長趨勢，以真實數據洞察身心變化
        </p>
      </div>

      {/* Row 1: Weekly Completion Rates Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Habit Completion */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs text-stone-500 dark:text-stone-400">本週指標</span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                本週習慣完成率
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {weeklyHabitRate}%
              </span>
              <span className="block text-[10px] text-stone-400">
                {weeklyHabitCompleted} / {weeklyHabitPossible} 次
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${weeklyHabitRate}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2.5">
              近 7 天全體習慣累計打卡穩定度良好，堅持即是力量。
            </p>
          </div>
        </div>

        {/* Weekly Quests Completion */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs text-stone-500 dark:text-stone-400">本週指標</span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                本週善念任務完成率
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                {weeklyQuestRate}%
              </span>
              <span className="block text-[10px] text-stone-400">
                已踐行 {weeklyQuestsCompleted} 項善行
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full h-3 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${weeklyQuestRate}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2.5">
              每日派發的隨機善念任務，正在為你周遭的生活圈注入溫暖。
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Most Stable Habit vs Most Fragile Habit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Most Stable Habit */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                最穩定的習慣 (守護先鋒)
              </span>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {mostStable ? mostStable.habit.name : '尚未統計'}
              </h4>
            </div>
          </div>

          {mostStable && (
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <span className="text-stone-400 block text-[10px]">當前連續連擊</span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {mostStable.habit.streak} 天
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <span className="text-stone-400 block text-[10px]">近 30 天完成率</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {mostStable.rate30}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                🌟 此習慣已深入您的日常生活節律，成為滋養身心最可靠的磐石。建議繼續保持此狀態，並作為養成其他習慣時的錨定點。
              </p>
            </div>
          )}
        </div>

        {/* Most Fragile Habit (Needs Care) */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                最容易中斷的習慣 (溫柔關照)
              </span>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {mostFragile ? mostFragile.habit.name : '暫無中斷數據'}
              </h4>
            </div>
          </div>

          {mostFragile && (
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <span className="text-stone-400 block text-[10px]">目前連續天數</span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                    {mostFragile.habit.streak} 天
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <span className="text-stone-400 block text-[10px]">近 30 天完成率</span>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {mostFragile.rate30}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                🌱 中斷是人之常情，無需苛責。您可以試著將此習慣難度降低一半（例如由20分鐘縮短為5分鐘），或綁定在「{mostStable ? mostStable.habit.name : '穩定習慣'}」之後完成。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Monthly Growth Curve (SVG Chart) */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                每月成長曲線 (心耕積分走勢)
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              每日習慣打卡與善念實踐獲得的經驗成長點數總累積軌跡
            </p>
          </div>

          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-lg self-start sm:self-auto text-xs">
            <button
              onClick={() => setSelectedTimeframe('14days')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTimeframe === '14days'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              近 14 天
            </button>
            <button
              onClick={() => setSelectedTimeframe('30days')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedTimeframe === '30days'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              近 30 天
            </button>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="mt-4 w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[500px] overflow-visible"
          >
            <defs>
              <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.33, 0.66, 1].map((ratio, idx) => {
              const y = paddingY + ratio * (chartHeight - paddingY * 2);
              const val = Math.round(maxPts - ratio * (maxPts - minPts));
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-stone-100 dark:text-stone-800"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-stone-400 font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Filled Area */}
            <path d={areaPathD} fill="url(#growthAreaGradient)" />

            {/* Stroke Line */}
            <path
              d={linePathD}
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Dots & X-Labels */}
            {growthCurvePoints.map((pt, idx) => {
              const x = getSvgX(idx);
              const y = getSvgY(pt.points);
              const showLabel = idx % (selectedTimeframe === '30days' ? 5 : 2) === 0 || idx === growthCurvePoints.length - 1;

              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy={y}
                    r={idx === growthCurvePoints.length - 1 ? 5 : 3}
                    fill={idx === growthCurvePoints.length - 1 ? '#059669' : '#10b981'}
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`${pt.date}: ${pt.points} 點 (當日完成 ${pt.completions} 項)`}</title>
                  </circle>
                  {showLabel && (
                    <text
                      x={x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[10px] fill-stone-400 font-mono"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Row 4: Cumulative Positive Actions Breakdown (7 Philosophies) */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                正向行動累積次數 (三好四給統計)
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              您在人間留下的每一筆真誠印記，皆是心靈深處的福德資糧
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-stone-400 block">累計善行總次數</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {totalPositiveActions}
            </span>
            <span className="text-xs text-stone-500 ml-1">次實踐</span>
          </div>
        </div>

        {/* 7 Philosophies Breakdown Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {allPhilosophies.map((phil) => {
            const count = positiveActionCounts[phil];
            const pct =
              totalPositiveActions > 0
                ? Math.round((count / totalPositiveActions) * 100)
                : 0;

            return (
              <div
                key={phil}
                className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block truncate">
                    {phil}
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {count}
                    </span>
                    <span className="text-[10px] text-stone-400">次</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="block text-[10px] text-stone-400 mt-1 tabular-nums">
                    佔比 {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
