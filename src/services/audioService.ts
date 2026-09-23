import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class AudioService {
  private static isSpeaking = false;
  private static currentRate = 1.0;
  private static currentSpeaker = 'Elena';

  static async speak(
    text: string,
    options?: {
      rate?: number;
      voice?: string;
      onDone?: () => void;
      onError?: () => void;
    }
  ) {
    try {
      this.triggerHaptic('light');
      await this.stop();
      this.isSpeaking = true;
      this.currentRate = options?.rate || this.currentRate;

      Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: this.currentRate,
        onDone: () => {
          this.isSpeaking = false;
          options?.onDone?.();
        },
        onStopped: () => {
          this.isSpeaking = false;
        },
        onError: () => {
          this.isSpeaking = false;
          options?.onError?.();
        },
      });
    } catch (err) {
      console.warn('Speech error:', err);
      this.isSpeaking = false;
      options?.onError?.();
    }
  }

  static async stop() {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking) {
        await Speech.stop();
      }
      this.isSpeaking = false;
    } catch {
      // Fallback
    }
  }

  static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  static async triggerHaptic(type: 'light' | 'medium' | 'success' = 'light') {
    if (Platform.OS !== 'web') {
      try {
        if (type === 'success') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (type === 'medium') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // Haptic unsupported
      }
    }
  }
}
