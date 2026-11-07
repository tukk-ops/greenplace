import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Moon,
  Sun,
  ShieldCheck,
  Calendar,
  Sparkles,
  Trophy,
  RotateCcw,
  Download,
  Upload,
  Check,
  Edit3,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    toggleTheme,
    plantState,
    habits,
    questSubmissions,
    resetAllData,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);
  const [title, setTitle] = useState(userProfile.title);

  // Avatar presets
  const avatarPresets = [
    { id: 'plant-sprout', label: '初芽行者', img: '/src/assets/images/plant_sprout_1794044851586.jpg' },
    { id: 'plant-sunflower', label: '暖陽使者', img: '/src/assets/images/plant_sunflower_1794044864332.jpg' },
    { id: 'plant-cherry', label: '落櫻居士', img: '/src/assets/images/plant_cherry_1794044882054.jpg' },
    { id: 'plant-bodhi', label: '菩提覺者', img: '/src/assets/images/plant_bodhi_1794044894555.jpg' },
  ];

  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const maxStreak = Math.max(...habits.map((h) => h.streak), 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || '善念行者',
      bio: bio.trim(),
      title: title.trim(),
    });
    setIsEditing(false);
  };

  const handleExportData = () => {
    const data = {
      habits,
      questSubmissions,
      userProfile,
      plantState,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful_habit_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Black & White Theme Toggle Banner (Page Adjustment) */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {userProfile.theme === 'dark' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                頁面外觀模式調整 (黑與白)
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              當前為【{userProfile.theme === 'dark' ? '深黑護眼模式' : '明亮素雅模式'}】，一鍵切換日夜視覺體驗
            </p>
          </div>

          {/* Theme Interactive Switcher */}
          <div className="flex items-center p-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl self-start sm:self-auto gap-2">
            <button
              onClick={() => userProfile.theme !== 'light' && toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                userProfile.theme === 'light'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>素雅白 (Light)</span>
            </button>
            <button
              onClick={() => userProfile.theme !== 'dark' && toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                userProfile.theme === 'dark'
                  ? 'bg-stone-950 text-white shadow-sm border border-stone-700'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>靜謐黑 (Dark)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/80 bg-stone-100 dark:bg-stone-950 shadow-sm shrink-0">
              <img
                src={
                  avatarPresets.find((a) => a.id === userProfile.avatarSeed)?.img ||
                  avatarPresets[0].img
                }
                alt={userProfile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {userProfile.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  {userProfile.title}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md">
                {userProfile.bio}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? '收起編輯' : '編輯資料'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-5 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  個人暱稱
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  稱號身份
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                心靈座右銘
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            {/* Avatar selector */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
                選擇心靈頭像意象
              </label>
              <div className="grid grid-cols-4 gap-2">
                {avatarPresets.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => updateProfile({ avatarSeed: av.id })}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      userProfile.avatarSeed === av.id
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden mb-1">
                      <img src={av.img} alt={av.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-stone-700 dark:text-stone-300">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                儲存設定
              </button>
            </div>
          </form>
        )}

        {/* Milestone Stats */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">樹境修持等級</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              Lv.{plantState.level}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">習慣累計打卡</span>
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {totalCompletions}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">最高連續堅持</span>
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">
              {maxStreak} 天
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
            <span className="text-[10px] text-stone-400 block">善行實踐記錄</span>
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400 tabular-nums">
              {questSubmissions.length} 篇
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            心靈里程勳章
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">破土萌新</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">完成第一次日常習慣打卡</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">向光行善</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">踐行三好四給善行累計 3 次</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/30 dark:bg-teal-950/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">恆常之水</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">達成連續打卡達 7 天以上</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
          資料管理與備份
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          所有打卡與任務均儲存於您的瀏覽器本地空間，您可以隨時匯出備份或重置為初始示範資料。
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出備份 JSON</span>
          </button>

          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置為範例初始資料</span>
          </button>
        </div>
      </div>
    </div>
  );
};
