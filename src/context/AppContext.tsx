import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Habit,
  DailyQuest,
  QuestSubmission,
  PlantSpecies,
  UserPlantState,
  UserProfile,
} from '../types';
import {
  INITIAL_HABITS,
  QUEST_POOL,
  INITIAL_PLANT_SPECIES,
  INITIAL_QUEST_SUBMISSIONS,
  INITIAL_USER_PROFILE,
  INITIAL_PLANT_STATE,
  getRelativeDate,
} from '../data/initialData';

interface AppContextType {
  activeTab: 'habits' | 'quests' | 'analytics' | 'ai' | 'profile';
  setActiveTab: (tab: 'habits' | 'quests' | 'analytics' | 'ai' | 'profile') => void;
  todayDate: string;
  habits: Habit[];
  dailyQuests: DailyQuest[];
  questSubmissions: QuestSubmission[];
  plantSpecies: PlantSpecies[];
  plantState: UserPlantState;
  userProfile: UserProfile;
  toggleHabit: (id: string) => void;
  createHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  submitQuest: (questId: string, data: { photoUrl?: string; photoCaption?: string; answer: string; story: string }) => void;
  refreshDailyQuests: () => void;
  waterPlant: () => void;
  baskSunlight: () => void;
  selectPlantSpecies: (speciesId: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  resetAllData: () => void;
  growthNotification: string | null;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mindful_tree_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayDate = getRelativeDate(0);

  // Initialize from LocalStorage or Fallback
  const [activeTab, setActiveTab] = useState<'habits' | 'quests' | 'analytics' | 'ai' | 'profile'>('habits');
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_habits`);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [questSubmissions, setQuestSubmissions] = useState<QuestSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_submissions`);
      return saved ? JSON.parse(saved) : INITIAL_QUEST_SUBMISSIONS;
    } catch {
      return INITIAL_QUEST_SUBMISSIONS;
    }
  });

  const [plantSpecies, setPlantSpecies] = useState<PlantSpecies[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_species`);
      return saved ? JSON.parse(saved) : INITIAL_PLANT_SPECIES;
    } catch {
      return INITIAL_PLANT_SPECIES;
    }
  });

  const [plantState, setPlantState] = useState<UserPlantState>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_plant_state`);
      return saved ? JSON.parse(saved) : INITIAL_PLANT_STATE;
    } catch {
      return INITIAL_PLANT_STATE;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user_profile`);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [growthNotification, setGrowthNotification] = useState<string | null>(null);

  // 3 daily quests selector
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_daily_quests_${todayDate}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Pick 3 diverse quests by default
    return [QUEST_POOL[0], QUEST_POOL[1], QUEST_POOL[4]];
  });

  // Apply Theme to <html> class
  useEffect(() => {
    if (userProfile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProfile.theme]);

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_habits`, JSON.stringify(habits));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_submissions`, JSON.stringify(questSubmissions));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_species`, JSON.stringify(plantSpecies));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_plant_state`, JSON.stringify(plantState));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user_profile`, JSON.stringify(userProfile));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_daily_quests_${todayDate}`, JSON.stringify(dailyQuests));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [habits, questSubmissions, plantSpecies, plantState, userProfile, dailyQuests, todayDate]);

  // Check achievements & plant stage unlocks whenever points or streaks change
  const checkPlantProgression = (newPoints: number, newHabits: Habit[]) => {
    // Stage thresholds:
    // 0-100: seed, 101-250: sprout, 251-450: sapling, 451-700: blooming, 701+: tree
    let newStage: UserPlantState['currentStage'] = 'seed';
    let stageProgress = 0;
    let level = 1;

    if (newPoints < 100) {
      newStage = 'seed';
      stageProgress = Math.round((newPoints / 100) * 100);
      level = 1;
    } else if (newPoints < 250) {
      newStage = 'sprout';
      stageProgress = Math.round(((newPoints - 100) / 150) * 100);
      level = 2;
    } else if (newPoints < 450) {
      newStage = 'sapling';
      stageProgress = Math.round(((newPoints - 250) / 200) * 100);
      level = 3;
    } else if (newPoints < 750) {
      newStage = 'blooming';
      stageProgress = Math.round(((newPoints - 450) / 300) * 100);
      level = 4;
    } else {
      newStage = 'tree';
      stageProgress = Math.min(100, Math.round(((newPoints - 750) / 400) * 100));
      level = 5;
    }

    // Calculate max streak across all habits
    const maxStreak = Math.max(...newHabits.map((h) => h.streak), 0);

    // Check unlockable species
    let newlyUnlockedName: string | null = null;
    const updatedSpecies = plantSpecies.map((sp) => {
      if (!sp.isUnlocked && (maxStreak >= sp.requiredStreak || newPoints >= sp.requiredPoints)) {
        newlyUnlockedName = sp.name;
        return { ...sp, isUnlocked: true, unlockedAt: todayDate };
      }
      return sp;
    });

    if (newlyUnlockedName) {
      setGrowthNotification(`🎉 恭喜解鎖全新神聖植物：【${newlyUnlockedName}】！已加入個人花園。`);
    }

    setPlantSpecies(updatedSpecies);
    setPlantState((prev) => ({
      ...prev,
      growthPoints: newPoints,
      currentStage: newStage,
      stageProgress,
      level,
    }));
  };

  // Toggle habit for today
  const toggleHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const isCompletedToday = habit.completedDates.includes(todayDate);
    let updatedDates: string[];
    let newStreak = habit.streak;
    let pointDelta = 0;

    if (isCompletedToday) {
      // Uncheck
      updatedDates = habit.completedDates.filter((d) => d !== todayDate);
      newStreak = Math.max(0, habit.streak - 1);
      pointDelta = -15;
    } else {
      // Check
      updatedDates = [...habit.completedDates, todayDate];
      newStreak = habit.streak + 1;
      pointDelta = 15;
      setGrowthNotification(`✨ 完成習慣「${habit.name}」！獲得 +15 點成長點數，連續堅持 ${newStreak} 天！`);
    }

    const updatedBestStreak = Math.max(habit.bestStreak, newStreak);

    const updatedHabits = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            completedDates: updatedDates,
            streak: newStreak,
            bestStreak: updatedBestStreak,
          }
        : h
    );

    setHabits(updatedHabits);
    const updatedPoints = Math.max(0, plantState.growthPoints + pointDelta);
    checkPlantProgression(updatedPoints, updatedHabits);
  };

  // Create habit
  const createHabit = (
    habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>
  ) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: todayDate,
    };
    const updated = [newHabit, ...habits];
    setHabits(updated);
    setGrowthNotification(`🌱 新習慣「${newHabit.name}」已設定，開啟美好養成旅程！`);
  };

  // Delete habit
  const deleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  // Update habit
  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  // Submit Daily Quest
  const submitQuest = (
    questId: string,
    data: { photoUrl?: string; photoCaption?: string; answer: string; story: string }
  ) => {
    const quest = QUEST_POOL.find((q) => q.id === questId);
    if (!quest) return;

    const submission: QuestSubmission = {
      id: `sub-${Date.now()}`,
      questId,
      date: todayDate,
      title: quest.title,
      philosophy: quest.philosophy,
      photoUrl: data.photoUrl,
      photoCaption: data.photoCaption,
      answer: data.answer,
      story: data.story,
      completedAt: new Date().toISOString(),
      pointsEarned: quest.pointsReward,
    };

    const updatedSubmissions = [submission, ...questSubmissions];
    setQuestSubmissions(updatedSubmissions);

    const newPoints = plantState.growthPoints + quest.pointsReward;
    setGrowthNotification(
      `🌟 善念實踐完成！已實踐【${quest.philosophy}】，獲得 +${quest.pointsReward} 成長點數，植物獲得豐沛滋養！`
    );
    checkPlantProgression(newPoints, habits);
  };

  // Refresh daily quests
  const refreshDailyQuests = () => {
    // Shuffle and pick 3
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    setDailyQuests(shuffled.slice(0, 3));
    setGrowthNotification('🍃 今日隨機任務已換新，為您帶來新的一日善行靈感！');
  };

  // Water Plant
  const waterPlant = () => {
    if (plantState.wateredToday) return;
    const newPoints = plantState.growthPoints + 10;
    setPlantState((prev) => ({ ...prev, wateredToday: true }));
    setGrowthNotification('💧 晨露甘霖！植物吸收了充足水分，成長點數 +10！');
    checkPlantProgression(newPoints, habits);
  };

  // Bask Sunlight
  const baskSunlight = () => {
    if (plantState.sunlightToday) return;
    const newPoints = plantState.growthPoints + 10;
    setPlantState((prev) => ({ ...prev, sunlightToday: true }));
    setGrowthNotification('☀️ 暖陽沐浴！植物在光合作用中舒展枝葉，成長點數 +10！');
    checkPlantProgression(newPoints, habits);
  };

  // Select Plant
  const selectPlantSpecies = (speciesId: string) => {
    const sp = plantSpecies.find((s) => s.id === speciesId);
    if (sp && sp.isUnlocked) {
      setPlantState((prev) => ({ ...prev, currentSpeciesId: speciesId }));
      setGrowthNotification(`🌸 已切換目前主育植物為【${sp.name}】`);
    }
  };

  // Profile update
  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = userProfile.theme === 'light' ? 'dark' : 'light';
    setUserProfile((prev) => ({ ...prev, theme: next }));
  };

  // Reset demo
  const resetAllData = () => {
    setHabits(INITIAL_HABITS);
    setQuestSubmissions(INITIAL_QUEST_SUBMISSIONS);
    setPlantSpecies(INITIAL_PLANT_SPECIES);
    setPlantState(INITIAL_PLANT_STATE);
    setUserProfile(INITIAL_USER_PROFILE);
    setDailyQuests([QUEST_POOL[0], QUEST_POOL[1], QUEST_POOL[4]]);
    setGrowthNotification('🔄 已重置為初始示範資料。');
  };

  const clearNotification = () => setGrowthNotification(null);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        todayDate,
        habits,
        dailyQuests,
        questSubmissions,
        plantSpecies,
        plantState,
        userProfile,
        toggleHabit,
        createHabit,
        deleteHabit,
        updateHabit,
        submitQuest,
        refreshDailyQuests,
        waterPlant,
        baskSunlight,
        selectPlantSpecies,
        updateProfile,
        toggleTheme,
        resetAllData,
        growthNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
