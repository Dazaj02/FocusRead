import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { VoiceSpeakerId } from '../types';

export interface SystemVoiceInfo {
  identifier: string;
  name: string;
  language: string;
  quality?: string;
}

export class AudioService {
  private static isSpeaking = false;
  private static currentRate = 1.0;
  private static cachedVoices: SystemVoiceInfo[] = [];

  /**
   * Obtiene la lista de voces disponibles en el dispositivo móvil (Android, iOS o Web)
   */
  static async getAvailableVoices(): Promise<SystemVoiceInfo[]> {
    try {
      if (this.cachedVoices.length > 0) {
        return this.cachedVoices;
      }
      const rawVoices = await Speech.getAvailableVoicesAsync();
      // Filtrar o priorizar voces en español
      const spanishVoices = rawVoices.filter(v => v.language.toLowerCase().startsWith('es'));
      const combined = spanishVoices.length > 0 ? spanishVoices : rawVoices;
      this.cachedVoices = combined.map(v => ({
        identifier: v.identifier,
        name: v.name,
        language: v.language,
        quality: (v as any).quality,
      }));
      return this.cachedVoices;
    } catch (e) {
      console.warn('Error fetching system voices:', e);
      return [];
    }
  }

  /**
   * Reproduce texto utilizando la voz, velocidad y tono configurados
   */
  static async speak(
    text: string,
    options?: {
      rate?: number;
      speaker?: VoiceSpeakerId;
      voiceIdentifier?: string;
      onDone?: () => void;
      onError?: () => void;
    }
  ) {
    try {
      this.triggerHaptic('light');
      await this.stop();
      this.isSpeaking = true;
      this.currentRate = options?.rate || this.currentRate;

      // Determinación de tono y afinación según perfil de locutor
      let pitch = 1.0;
      let language = 'es-ES';

      if (options?.speaker === 'Marcos' || options?.speaker === 'Mateo') {
        pitch = 0.88; // Tono más grave / masculino
      } else if (options?.speaker === 'Sofia') {
        pitch = 1.15; // Tono más juvenil / brillante
      } else if (options?.speaker === 'Lucia') {
        pitch = 1.02; // Tono profesional neutro
      } else {
        pitch = 0.98; // Elena: Tono sereno y relajante
      }

      // Parámetros de síntesis
      const speechOptions: Speech.SpeechOptions = {
        language,
        pitch,
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
      };

      if (options?.voiceIdentifier) {
        speechOptions.voice = options.voiceIdentifier;
      }

      Speech.speak(text, speechOptions);
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
