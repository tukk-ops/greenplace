import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlantGarden } from './PlantGarden';
import { Habit } from '../../types';
import {
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  Calendar,
  Sparkles,
  TrendingUp,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  Target,
  Heart,
  Droplets,
  BookOpen,
  Footprints,
  Clock,
} from 'lucide-react';

export const HabitManager: React.FC = () => {
  const { habits, todayDate, toggleHabit, createHabit, deleteHabit, updateHabit } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // New habit form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Habit['category']>('mindfulness');
  const [targetDays, setTargetDays] = useState(7);
  const [reminderNote, setReminderNote] = useState('');

  // Calculate statistics:
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayDate)).length;
  const todayRate = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Weekly completion rate: past 7 days across all habits
  let weekPossible = 0;
  let weekCompleted = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    habits.forEach((h) => {
      weekPossible++;
      if (h.completedDates.includes(dateStr)) {
        weekCompleted++;
      }
    });
  }
  const weeklyRate = weekPossible > 0 ? Math.round((weekCompleted / weekPossible) * 100) : 0;

  // Monthly completion rate: past 30 days
  let monthPossible = 0;
  let monthCompleted = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    habits.forEach((h) => {
      monthPossible++;
      if (h.completedDates.includes(dateStr)) {
        monthCompleted++;
      }
    });
  }
  const monthlyRate = monthPossible > 0 ? Math.round((monthCompleted / monthPossible) * 100) : 0;

  // Max streak
  const currentMaxStreak = Math.max(...habits.map((h) => h.streak), 0);
  const totalLifetimeCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

  const handleOpenAdd = () => {
    setName('');
    setCategory('mindfulness');
    setTargetDays(7);
    setReminderNote('');
    setIsAddModalOpen(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: name.trim(),
        category,
        targetDaysPerWeek: targetDays,
        reminderNote: reminderNote.trim() || undefined,
      });
      setEditingHabit(null);
    } else {
      createHabit({
        name: name.trim(),
        category,
        iconName: category === 'health' ? 'Droplets' : category === 'learning' ? 'BookOpen' : 'Sparkles',
        targetDaysPerWeek: targetDays,
        reminderNote: reminderNote.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setCategory(habit.category);
    setTargetDays(habit.targetDaysPerWeek);
    setReminderNote(habit.reminderNote || '');
  };

  const getCategoryIcon = (cat: Habit['category']) => {
    switch (cat) {
      case 'health':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'learning':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'kindness':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'life':
        return <Footprints className="w-4 h-4 text-indigo-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getCategoryLabel = (cat: Habit['category']) => {
    switch (cat) {
      case 'health':
        return '身體健康';
      case 'learning':
        return '學習啟迪';
      case 'kindness':
        return '善意關懷';
      case 'life':
        return '規律生活';
      default:
        return '心靈靜心';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Growth Botanical Garden */}
      <PlantGarden />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Today's Tasks */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>今日需完成</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
              {completedTodayCount}
            </span>
            <span className="text-xs text-stone-500">/ {totalHabits} 項</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400">
            今日完成率 {todayRate}%
          </div>
        </div>

        {/* Metric 2: Weekly Rate */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>每週完成率</span>
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
              {weeklyRate}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            近7天堅持指數
          </div>
        </div>

        {/* Metric 3: Monthly Rate */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>每月完成率</span>
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
              {monthlyRate}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            近30天綜合進度
          </div>
        </div>

        {/* Metric 4: Consecutive Streak */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>連續打卡天數</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400 tabular-nums">
              {currentMaxStreak}
            </span>
            <span className="text-xs text-stone-500">天</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            堅持最長習慣
          </div>
        </div>

        {/* Metric 5: Habit Growth Progress */}
        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>習慣養成累計</span>
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 tabular-nums">
              {totalLifetimeCompletions}
            </span>
            <span className="text-xs text-stone-500">次打卡</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-600 dark:text-purple-400">
            穩健積聚心靈力量
          </div>
        </div>
      </div>

      {/* Main Habit Checklist Section */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                今日需要完成的習慣
              </h3>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {new Date().toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              點擊打卡標記完成，每項為虛擬植物挹注 +15 點成長養分
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>先設定新習慣</span>
          </button>
        </div>

        {/* Habit List */}
        <div className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
          {habits.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-8 h-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                尚未設定任何習慣
              </p>
              <p className="text-xs text-stone-400 mt-1">
                點擊上方「先設定新習慣」，開啟日常的自律與安定
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const isCompleted = habit.completedDates.includes(todayDate);

              return (
                <div
                  key={habit.id}
                  className={`py-3.5 px-2 flex items-center justify-between gap-3 rounded-xl transition-colors ${
                    isCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                  }`}
                >
                  {/* Left: Completion Toggle & Title */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-all ${
                        isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
                      }`}
                      aria-label={isCompleted ? '取消完成' : '標記完成'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white dark:fill-emerald-500 dark:text-stone-900 transition-transform active:scale-90" />
                      ) : (
                        <Circle className="w-6 h-6 stroke-[1.7] transition-transform hover:scale-105 active:scale-90" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold transition-all ${
                            isCompleted
                              ? 'text-stone-500 line-through dark:text-stone-400'
                              : 'text-stone-900 dark:text-stone-100'
                          }`}
                        >
                          {habit.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                          {getCategoryIcon(habit.category)}
                          <span>{getCategoryLabel(habit.category)}</span>
                        </div>
                      </div>

                      {habit.reminderNote && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                          {habit.reminderNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Streak info */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Streak flame */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-400 text-xs">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="tabular-nums font-semibold">{habit.streak}</span>
                      <span className="text-[10px]">天連擊</span>
                    </div>

                    {/* Completion Status Tag */}
                    <div className="hidden sm:block">
                      {isCompleted ? (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          今日已完成 ✓
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 dark:text-stone-500">
                          待打卡
                        </span>
                      )}
                    </div>

                    {/* Edit / Delete actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(habit)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        title="編輯習慣"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="刪除習慣"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Habit Modal */}
      {(isAddModalOpen || editingHabit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {editingHabit ? '編輯個人習慣' : '先設定習慣'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingHabit(null);
                }}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  習慣名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：每日靜心冥想 15 分鐘"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  領域分類
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Habit['category'])}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="mindfulness">心靈靜心 (冥想、感恩、覺察)</option>
                  <option value="health">身體健康 (飲水、散步、早睡)</option>
                  <option value="learning">學習啟迪 (閱讀、筆記、研習)</option>
                  <option value="kindness">善意關懷 (行善、問候、祝福)</option>
                  <option value="life">規律生活 (整理、自律、作息)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  每週目標頻率：{targetDays} 天
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={targetDays}
                  onChange={(e) => setTargetDays(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>每週1天</span>
                  <span>每週4天</span>
                  <span>每日堅持 (7天)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  提醒或激勵小語 (選填)
                </label>
                <input
                  type="text"
                  placeholder="例如：觀照呼吸，感受此刻當下"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingHabit(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  {editingHabit ? '儲存變更' : '確認設定'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
