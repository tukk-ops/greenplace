import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyQuest, QuestPhilosophy, QuestSubmission } from '../../types';
import {
  Compass,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  BookOpen,
  MessageSquare,
  X,
  Calendar,
  Check,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DailyQuests: React.FC = () => {
  const {
    dailyQuests,
    refreshDailyQuests,
    submitQuest,
    questSubmissions,
    todayDate,
  } = useApp();

  const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if a quest is already completed today
  const isQuestCompletedToday = (questId: string) => {
    return questSubmissions.some(
      (s) => s.questId === questId && s.date === todayDate
    );
  };

  const completedTodayList = questSubmissions.filter((s) => s.date === todayDate);

  const handleOpenSubmitModal = (quest: DailyQuest) => {
    setSelectedQuest(quest);
    setPhotoDataUrl('');
    setPhotoCaption('');
    setAnswer('');
    setStory('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset photos for quick demonstration if user has no photo
  const samplePhotos = [
    { label: '向日花園', url: '/src/assets/images/plant_sunflower_1794044864332.jpg' },
    { label: '新萌初芽', url: '/src/assets/images/plant_sprout_1794044851586.jpg' },
    { label: '櫻樹靜謐', url: '/src/assets/images/plant_cherry_1794044882054.jpg' },
    { label: '菩提樹影', url: '/src/assets/images/plant_bodhi_1794044894555.jpg' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuest) return;
    if (!answer.trim() || !story.trim()) {
      alert('請填寫回答問題與講述任務索求！');
      return;
    }

    setIsSubmitting(true);
    submitQuest(selectedQuest.id, {
      photoUrl: photoDataUrl || undefined,
      photoCaption: photoCaption.trim() || undefined,
      answer: answer.trim(),
      story: story.trim(),
    });

    setIsSubmitting(false);
    setSelectedQuest(null);
  };

  const getPhilosophyBadgeStyle = (philosophy: QuestPhilosophy) => {
    switch (philosophy) {
      case '做好事':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case '說好話':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case '存好心':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case '給人信心':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case '給人歡喜':
        return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case '給人希望':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case '給人方便':
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Philosophy Core Overview */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                每日隨機任務 · 三好四給善念實踐
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              系統每日主動派發 3 項善念隨機任務。透過「上傳照片、回答問題、講述任務索求」，將慈愛與體貼落實於生活。
            </p>
          </div>

          <button
            onClick={refreshDailyQuests}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors shrink-0"
            title="重新抽籤派發三個任務"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重新抽籤靈感</span>
          </button>
        </div>

        {/* 7 Philosophies Strip */}
        <div className="mt-4 pt-1">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
            實踐理念核心：
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {(
              [
                '做好事',
                '說好話',
                '存好心',
                '給人信心',
                '給人歡喜',
                '給人希望',
                '給人方便',
              ] as QuestPhilosophy[]
            ).map((phil) => (
              <span
                key={phil}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium ${getPhilosophyBadgeStyle(
                  phil
                )}`}
              >
                {phil}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Active Daily Quests Cards */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>今日派發任務（3項）</span>
            <span className="text-xs font-normal text-stone-400">
              今日已完成 {completedTodayList.length} / 3 項
            </span>
          </h3>
          <span className="text-xs text-emerald-700 dark:text-emerald-400">
            每完成一項獎勵 +50 成長點數
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyQuests.map((quest, index) => {
            const isCompleted = isQuestCompletedToday(quest.id);

            return (
              <div
                key={quest.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isCompleted
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/15'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getPhilosophyBadgeStyle(
                        quest.philosophy
                      )}`}
                    >
                      {quest.philosophy}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      +{quest.pointsReward} 點
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5 leading-snug">
                    {index + 1}. {quest.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                    {quest.description}
                  </p>

                  {/* Guidance hint */}
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
                    <p className="font-medium text-stone-700 dark:text-stone-300">
                      💡 {quest.guidance}
                    </p>
                    <p className="italic text-stone-500">
                      ❓ 思考題：{quest.reflectionQuestion}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                  {isCompleted ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>今日已實踐完成</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSubmitModal(quest)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>開始實踐打卡（照相/問答/索求）</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Modal for the Quest */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-semibold mb-1 ${getPhilosophyBadgeStyle(
                    selectedQuest.philosophy
                  )}`}
                >
                  {selectedQuest.philosophy}
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {selectedQuest.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuest(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Step 1: Upload Photo */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  ① 上傳照片 (記錄實踐現場或象徵意象)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {photoDataUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 max-h-48 flex items-center justify-center">
                    <img
                      src={photoDataUrl}
                      alt="預覽照片"
                      className="max-h-48 w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-stone-900/70 text-white hover:bg-stone-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 mx-auto text-stone-400 mb-1" />
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 block">
                        點擊選擇照片或拍照上傳
                      </span>
                      <span className="text-[10px] text-stone-400">
                        支援 JPG, PNG, WebP 格式
                      </span>
                    </div>

                    {/* Quick presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-stone-400">或快速選用自然意象：</span>
                      {samplePhotos.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setPhotoDataUrl(p.url)}
                          className="px-2 py-0.5 text-[11px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {photoDataUrl && (
                  <input
                    type="text"
                    placeholder="照片說明（選填，如：為鄰居留下整潔的公共長椅）"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="mt-1.5 w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                )}
              </div>

              {/* Step 2: Answer the Reflection Question */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  ② 回答問題：{selectedQuest.reflectionQuestion} *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="簡短分享您在實踐時的心境轉折、內心體會或對方的反饋..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Step 3: Narrate the Quest's Need & Story */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  ③ 講述任務的索求 (事件背景、對方的需求或環境現況、您如何化解) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="詳述在什麼情境下發現此需求？您採取了什麼具體行動來達成這個善念理念？"
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedQuest(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>完成提交並獲得 +50 點數</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historical Submissions Archive: 善念足跡 */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 md:p-6 shadow-sm">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowHistory(!showHistory)}
        >
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              善念足跡 · 歷次實踐記錄 ({questSubmissions.length} 篇)
            </h3>
          </div>
          <button className="text-stone-400 hover:text-stone-600">
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showHistory && (
          <div className="mt-4 divide-y divide-stone-100 dark:divide-stone-800">
            {questSubmissions.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-400">
                尚未完成任何隨機任務，今天就試著踐行一項善念吧！
              </p>
            ) : (
              questSubmissions.map((sub) => (
                <div key={sub.id} className="py-4 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${getPhilosophyBadgeStyle(
                          sub.philosophy
                        )}`}
                      >
                        {sub.philosophy}
                      </span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {sub.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{sub.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    {sub.photoUrl && (
                      <div className="sm:col-span-3">
                        <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800 aspect-video sm:aspect-square bg-stone-100 dark:bg-stone-950">
                          <img
                            src={sub.photoUrl}
                            alt={sub.photoCaption || '實踐照片'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {sub.photoCaption && (
                          <p className="text-[11px] text-stone-500 mt-1 italic truncate">
                            {sub.photoCaption}
                          </p>
                        )}
                      </div>
                    )}

                    <div className={sub.photoUrl ? 'sm:col-span-9 space-y-2' : 'sm:col-span-12 space-y-2'}>
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs text-stone-700 dark:text-stone-300">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                          💬 回答與心得：
                        </span>
                        <p className="leading-relaxed">{sub.answer}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs text-stone-700 dark:text-stone-300">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                          📖 任務索求與實踐過程：
                        </span>
                        <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                          {sub.story}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
