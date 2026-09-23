export interface RetentionQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MicroDose {
  id: string;
  articleId: string;
  sequenceOrder: number;
  title: string;
  contentChunk: string;
  wordCount: number;
  estimatedSeconds: number;
  isCompleted: boolean;
  quiz?: RetentionQuestion;
}

export interface Article {
  id: string;
  sourceUrl: string;
  title: string;
  author: string;
  category: string;
  fullCleanText: string;
  executiveSummary: string[];
  totalReadingTimeSeconds: number;
  isFavorite: boolean;
  createdAt: number;
  microDoses: MicroDose[];
}

export interface UserStats {
  currentStreakDays: number;
  todayMinutesRead: number;
  dailyGoalMinutes: number;
  completedDosesCount: number;
  articlesReadCount?: number;
  focusMinutesTotal?: number;
  retentionRatePercent?: number;
  savedHoursCognitive?: number;
  weeklyMinutes?: number[]; // [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
}

export interface AppSettings {
  deepSeekApiKey: string;
  targetDurationMinutes: number; // 1.5, 2.5, 3.5
  synthesisDepth: 'essential' | 'keypoints' | 'deep';
  retentionQuizEnabled: boolean;
  glossaryEnabled: boolean;
  voiceSpeaker: 'Elena' | 'Marcos';
  speechRate: number; // 1.0, 1.25, 1.5, 2.0
  karaokeHighlightEnabled: boolean;
  binauralBeatEnabled: boolean;
}
