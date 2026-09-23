import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, UserStats, AppSettings } from '../types';
import { INITIAL_ARTICLES, INITIAL_USER_STATS, DEFAULT_APP_SETTINGS } from '../data/mockArticles';

const STORAGE_KEYS = {
  ARTICLES: '@focusread_articles',
  USER_STATS: '@focusread_stats',
  THEME_MODE: '@focusread_theme',
  SETTINGS: '@focusread_settings',
};

export class StorageService {
  static async getArticles(): Promise<Article[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) {
        return JSON.parse(data);
      }
      await this.saveArticles(INITIAL_ARTICLES);
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  }

  static async saveArticles(articles: Article[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (err) {
      console.warn('Error saving articles:', err);
    }
  }

  static async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (data) {
        return JSON.parse(data);
      }
      await this.saveUserStats(INITIAL_USER_STATS);
      return INITIAL_USER_STATS;
    } catch {
      return INITIAL_USER_STATS;
    }
  }

  static async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (err) {
      console.warn('Error saving stats:', err);
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(data) };
      }
      await this.saveSettings(DEFAULT_APP_SETTINGS);
      return DEFAULT_APP_SETTINGS;
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.warn('Error saving settings:', err);
    }
  }

  static async markDoseCompleted(articleId: string, doseId: string): Promise<{ articles: Article[]; stats: UserStats }> {
    const articles = await this.getArticles();
    const stats = await this.getUserStats();

    let estimatedMinutes = 2;

    const updatedArticles = articles.map(art => {
      if (art.id === articleId) {
        const updatedDoses = art.microDoses.map(dose => {
          if (dose.id === doseId && !dose.isCompleted) {
            estimatedMinutes = Math.max(1, Math.round(dose.estimatedSeconds / 60));
            return { ...dose, isCompleted: true };
          }
          return dose;
        });
        return { ...art, microDoses: updatedDoses };
      }
      return art;
    });

    const currentWeekly = stats.weeklyMinutes ? [...stats.weeklyMinutes] : [14, 22, 18, 25, 16, 20, 15];
    currentWeekly[6] = (currentWeekly[6] || 15) + estimatedMinutes;

    const updatedStats: UserStats = {
      ...stats,
      todayMinutesRead: stats.todayMinutesRead + estimatedMinutes,
      completedDosesCount: stats.completedDosesCount + 1,
      focusMinutesTotal: (stats.focusMinutesTotal || 142) + estimatedMinutes,
      weeklyMinutes: currentWeekly,
    };

    await this.saveArticles(updatedArticles);
    await this.saveUserStats(updatedStats);

    return { articles: updatedArticles, stats: updatedStats };
  }

  static async toggleBookmark(articleId: string): Promise<Article[]> {
    const articles = await this.getArticles();
    const updated = articles.map(a => a.id === articleId ? { ...a, isFavorite: !a.isFavorite } : a);
    await this.saveArticles(updated);
    return updated;
  }
}
