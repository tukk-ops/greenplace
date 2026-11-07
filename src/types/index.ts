export type QuestPhilosophy =
  | '做好事'
  | '說好話'
  | '存好心'
  | '給人信心'
  | '給人歡喜'
  | '給人希望'
  | '給人方便';

export interface Habit {
  id: string;
  name: string;
  category: 'health' | 'mindfulness' | 'learning' | 'life' | 'kindness';
  iconName: string;
  targetDaysPerWeek: number;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ISO 'YYYY-MM-DD'
  createdAt: string;
  reminderNote?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  philosophy: QuestPhilosophy;
  description: string;
  reflectionQuestion: string; // 回答問題
  guidance: string; // 任務索求與實踐指引
  pointsReward: number;
}

export interface QuestSubmission {
  id: string;
  questId: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  philosophy: QuestPhilosophy;
  photoUrl?: string; // Base64 or local image
  photoCaption?: string;
  answer: string; // 回答問題
  story: string; // 講述任務索求與過程
  completedAt: string;
  pointsEarned: number;
}

export interface PlantSpecies {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imagePath: string;
  requiredStreak: number;
  requiredPoints: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserPlantState {
  currentSpeciesId: string;
  growthPoints: number; // Overall experience points
  currentStage: 'seed' | 'sprout' | 'sapling' | 'blooming' | 'tree';
  stageProgress: number; // 0 to 100% within current stage
  wateredToday: boolean;
  sunlightToday: boolean;
  level: number;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarSeed: string;
  joinedDate: string;
  theme: 'light' | 'dark';
}
