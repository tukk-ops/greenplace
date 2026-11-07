import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Droplets,
  Sun,
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';

export const PlantGarden: React.FC = () => {
  const {
    plantState,
    plantSpecies,
    selectPlantSpecies,
    waterPlant,
    baskSunlight,
    habits,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'current' | 'achievements'>('current');
  const [showStageInfo, setShowStageInfo] = useState(false);

  const activeSpecies =
    plantSpecies.find((s) => s.id === plantState.currentSpeciesId) || plantSpecies[0];

  const maxStreak = Math.max(...habits.map((h) => h.streak), 0);

  // Stage display metadata
  const stagesMap = {
    seed: { name: '種子期', label: '深植沃土', icon: '🌱', nextAt: 100 },
    sprout: { name: '發芽期', label: '破土迎光', icon: '🌿', nextAt: 250 },
    sapling: { name: '幼苗期', label: '舒展新枝', icon: '🪴', nextAt: 450 },
    blooming: { name: '開花期', label: '繁茂綻放', icon: '🌸', nextAt: 750 },
    tree: { name: '參天大樹', label: '庇蔭長青', icon: '🌳', nextAt: 1200 },
  };

  const currentStageMeta = stagesMap[plantState.currentStage];

  // Stage progression step indicators
  const stagesList: Array<keyof typeof stagesMap> = ['seed', 'sprout', 'sapling', 'blooming', 'tree'];
  const currentStageIndex = stagesList.indexOf(plantState.currentStage);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm transition-colors">
      {/* Header with Segmented Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              心靈虛擬植物園
            </h2>
            <span className="text-xs text-stone-400 dark:text-stone-500">·</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Lv.{plantState.level} 成長中
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            完成每日習慣與善行，累積心耕點數，滋養你的專屬精神大樹
          </p>
        </div>

        {/* Segmented Tab */}
        <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTabSub('current')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTabSub === 'current'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            主育植物
          </button>
          <button
            onClick={() => setActiveTabSub('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTabSub === 'achievements'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>解鎖成就庫</span>
            <span className="text-[11px] text-stone-400">
              ({plantSpecies.filter((s) => s.isUnlocked).length}/{plantSpecies.length})
            </span>
          </button>
        </div>
      </div>

      {activeTabSub === 'current' ? (
        /* Main Plant Showcase */
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Plant Card Artwork */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 shadow-sm group">
              <img
                src={activeSpecies.imagePath}
                alt={activeSpecies.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle scrim at the bottom for species title */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {activeSpecies.name}
                    </h3>
                    <p className="text-[11px] text-stone-200 line-clamp-1">
                      {activeSpecies.subtitle}
                    </p>
                  </div>
                  <span className="text-lg" aria-hidden="true">
                    {currentStageMeta.icon}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Tag */}
            <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                【{currentStageMeta.name}】
              </span>
              <span>·</span>
              <span>{currentStageMeta.label}</span>
              <button
                onClick={() => setShowStageInfo(!showStageInfo)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
                title="查看成長階段規則"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Plant Growth Dashboard */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* Stage Stepper */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  生命成長階梯
                </span>
                <span className="tabular-nums">
                  當前經驗：<strong className="text-emerald-600 dark:text-emerald-400">{plantState.growthPoints}</strong> 點
                </span>
              </div>

              {/* Step dots */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {stagesList.map((stKey, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const item = stagesMap[stKey];
                  return (
                    <div
                      key={stKey}
                      className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-xs'
                          : isDone
                          ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                          : 'border-stone-200 dark:border-stone-800 opacity-50 bg-stone-50 dark:bg-stone-900 text-stone-400'
                      }`}
                    >
                      <span className="text-base sm:text-lg mb-1">{item.icon}</span>
                      <span className="text-[11px] font-medium leading-none truncate w-full">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar within stage */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400 mb-1.5">
                  <span>距下一階演化</span>
                  <span className="font-semibold tabular-nums">{plantState.stageProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 rounded-full"
                    style={{ width: `${plantState.stageProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Daily Nourishment (Water & Sun) */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    每日晨光養護（每日各可灌溉一次 +10 點）
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">心靈撫慰儀式</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={waterPlant}
                  disabled={plantState.wateredToday}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                    plantState.wateredToday
                      ? 'border-sky-200 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 cursor-default'
                      : 'border-sky-300 dark:border-sky-800 bg-white dark:bg-stone-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/50 shadow-xs active:scale-[0.98]'
                  }`}
                >
                  <Droplets className={`w-4 h-4 ${plantState.wateredToday ? 'text-sky-500' : 'text-sky-600'}`} />
                  <span>{plantState.wateredToday ? '今日已甘霖澆灌 ✓' : '澆灌晨露 (+10點)'}</span>
                </button>

                <button
                  onClick={baskSunlight}
                  disabled={plantState.sunlightToday}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                    plantState.sunlightToday
                      ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 cursor-default'
                      : 'border-amber-300 dark:border-amber-800 bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 shadow-xs active:scale-[0.98]'
                  }`}
                >
                  <Sun className={`w-4 h-4 ${plantState.sunlightToday ? 'text-amber-500' : 'text-amber-600'}`} />
                  <span>{plantState.sunlightToday ? '今日已沐浴陽光 ✓' : '沐浴暖陽 (+10點)'}</span>
                </button>
              </div>
            </div>

            {/* Description & Wisdom */}
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed italic">
              「{activeSpecies.description}」
            </p>
          </div>
        </div>
      ) : (
        /* Achievement Showcase Gallery */
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              透過連續打卡與踐行善行成就，解鎖不同神聖意象的植物品種
            </p>
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
              當前最高連續打卡：<strong className="text-emerald-600">{maxStreak}</strong> 天
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plantSpecies.map((sp) => {
              const isCurrent = sp.id === plantState.currentSpeciesId;
              const canUnlock = !sp.isUnlocked && (maxStreak >= sp.requiredStreak || plantState.growthPoints >= sp.requiredPoints);

              return (
                <div
                  key={sp.id}
                  className={`relative flex flex-col rounded-xl border p-4 transition-all ${
                    isCurrent
                      ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                      : sp.isUnlocked
                      ? 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 hover:border-stone-300 dark:hover:border-stone-700'
                      : 'border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/60 opacity-80'
                  }`}
                >
                  {/* Image with lock badge */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-950 mb-3 border border-stone-200 dark:border-stone-800">
                    <img
                      src={sp.imagePath}
                      alt={sp.name}
                      className={`w-full h-full object-cover transition-all ${
                        sp.isUnlocked ? '' : 'grayscale contrast-125 opacity-40'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {!sp.isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-stone-950/40 text-white text-center">
                        <Lock className="w-5 h-5 text-stone-200 mb-1" />
                        <span className="text-[11px] font-medium text-stone-100">
                          需打卡 {sp.requiredStreak} 天 或 {sp.requiredPoints} 點
                        </span>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3" />
                        <span>主育中</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                        <span>{sp.name}</span>
                        {sp.isUnlocked && (
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                        {sp.subtitle}
                      </p>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {sp.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                      {isCurrent ? (
                        <div className="text-center py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          目前正在滋養此樹
                        </div>
                      ) : sp.isUnlocked ? (
                        <button
                          onClick={() => selectPlantSpecies(sp.id)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <span>設為主育植物</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="text-center py-1 text-[11px] text-stone-400 dark:text-stone-500">
                          打卡達標自動解鎖
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage Info Modal / Drawer */}
      {showStageInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">
              🌱 虛擬植物成長體系說明
            </h3>
            <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>• <strong>完成每日習慣：</strong>每次打卡獲得 +15 點成長點數。</p>
              <p>• <strong>踐行每日善念任務：</strong>每次圖文心得獲取 +50 點成長點數。</p>
              <p>• <strong>日常晨露與陽光：</strong>每日各可為植物提供一次關照 (+10 點)。</p>
              <p>• <strong>成長階梯：</strong>種子 (0-100) → 發芽 (101-250) → 幼苗 (251-450) → 開花 (451-750) → 參天大樹 (750+)。</p>
              <p>• <strong>成就解鎖：</strong>累積連續天數或總點數即可解鎖向日葵、櫻花樹與菩提樹等不同植物！</p>
            </div>
            <button
              onClick={() => setShowStageInfo(false)}
              className="mt-5 w-full py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
