
export enum Language {
  PYTHON = 'Python',
  HTML = 'HTML'
}

export enum Screen {
  LOGIN = 'login',
  HOME = 'home',
  SELECTION = 'selection',
  MAP = 'map',
  MISSION = 'mission',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile',
  RESULT = 'result',
  QUIZ_PRACTICE_SELECT = 'quiz_practice_select',
  QUIZ_PRACTICE_LEVELS = 'quiz_practice_levels',
  QUIZ_PRACTICE_PLAY = 'quiz_practice_play',
  QUIZ_PRACTICE_RESULT = 'quiz_practice_result'
}

export type MissionType = 'quiz' | 'code';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  tier?: 'gold' | 'silver' | 'bronze' | 'none';
  unlockedAt?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  task: string;
  type: MissionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  order: number;
  options?: string[];
  correctOption?: number;
}

export interface UserProfile {
  name: string;
  className: string;
  level: number;
  xp: number;
  badges: Badge[];
  completedMissions: string[];
  selectedLanguage?: Language;
}

export interface AIResponse {
  isCorrect: boolean;
  feedback: string;
  hint: string;
  suggestions?: string[];
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
}
