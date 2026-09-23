import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppSettings } from '../types';
import { ThemeColors, ThemeMode, themes } from '../theme/tokens';
import { AudioService } from '../services/audioService';

interface SettingsScreenProps {
  settings: AppSettings;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  themeMode,
  onChangeTheme,
  onUpdateSettings,
}) => {
  const colors: ThemeColors = themes[themeMode];
  const [apiKeyInput, setApiKeyInput] = useState(settings.deepSeekApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    onUpdateSettings({ ...settings, deepSeekApiKey: apiKeyInput.trim() });
    AudioService.triggerHaptic('success');
    Alert.alert('DeepSeek API Key', 'Clave guardada exitosamente en el almacenamiento local seguro.');
  };

  const handleDurationSelect = (mins: number) => {
    AudioService.triggerHaptic('light');
    onUpdateSettings({ ...settings, targetDurationMinutes: mins });
  };

  const handleVoiceSelect = (voice: 'Elena' | 'Marcos') => {
    AudioService.triggerHaptic('light');
    onUpdateSettings({ ...settings, voiceSpeaker: voice });
  };

  const handleSpeechRateSelect = (rate: number) => {
    AudioService.triggerHaptic('light');
    onUpdateSettings({ ...settings, speechRate: rate });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Perfil del Usuario y Plan Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatarWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
            <Ionicons name="person" size={28} color={colors.text} />
            <View style={[styles.verifiedBadge, { backgroundColor: colors.tertiaryContainer }]}>
              <Ionicons name="checkmark" size={10} color="#FFF" />
            </View>
          </View>

          <View style={styles.profileTextCol}>
            <View style={styles.nameRow}>
              <Text style={[styles.profileName, { color: colors.text }]}>Alex Rivera</Text>
              <Ionicons name="checkmark-circle" size={16} color={colors.primaryContainer} />
            </View>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              alex.rivera@focusread.ai
            </Text>
            <View style={[styles.planBadge, { backgroundColor: colors.secondaryContainer }]}>
              <Ionicons name="diamond-outline" size={12} color={colors.onSecondaryContainer} />
              <Text style={[styles.planBadgeText, { color: colors.onSecondaryContainer }]}>
                FocusRead Pro
              </Text>
            </View>
          </View>
        </View>

        {/* Telemetría de Créditos de IA */}
        <View style={[styles.creditsBox, { backgroundColor: colors.surfaceContainerLow }]}>
          <View style={styles.creditsTop}>
            <View style={styles.creditsLabelLeft}>
              <Ionicons name="hardware-chip-outline" size={16} color={colors.tertiaryContainer} />
              <Text style={[styles.creditsTitle, { color: colors.text }]}>Créditos de IA Cognitiva</Text>
            </View>
            <Text style={[styles.creditsUsedText, { color: colors.textSecondary }]}>24 / 30 Usados</Text>
          </View>
          <View style={[styles.creditsTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
            <View style={[styles.creditsFill, { backgroundColor: colors.primaryContainer, width: '80%' }]} />
          </View>
          <Text style={[styles.creditsFooterText, { color: colors.textMuted }]}>
            Renovación en 6 días · <Text style={{ color: colors.primaryContainer, fontWeight: '600' }}>Gestionar cuota</Text>
          </Text>
        </View>
      </View>

      {/* 2. Configuración del Motor de IA (DeepSeek) */}
      <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="sparkles" size={19} color={colors.primaryContainer} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Motor de IA y DeepSeek</Text>
        </View>

        {/* Entrada API Key DeepSeek */}
        <View style={styles.settingField}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            DeepSeek API Key (deepseek-chat)
          </Text>
          <View style={[styles.apiKeyInputRow, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
            <TextInput
              style={[styles.apiKeyInput, { color: colors.text }]}
              placeholder="sk-..."
              placeholderTextColor={colors.textMuted}
              value={apiKeyInput}
              secureTextEntry={!showApiKey}
              onChangeText={setApiKeyInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowApiKey(!showApiKey)} style={{ padding: 6 }}>
              <Ionicons
                name={showApiKey ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveKeyBtn, { backgroundColor: colors.primaryContainer }]}
              onPress={handleSaveApiKey}
            >
              <Text style={styles.saveKeyBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.fieldHint, { color: colors.textMuted }]}>
            {settings.deepSeekApiKey
              ? '✓ API Key configurada. Consumo aprox: ~$0.002 por cada 10 artículos.'
              : 'Sin API Key se usará el motor de parsing local inteligente.'}
          </Text>
        </View>

        {/* Duración Objetivo por Micro-Dosis */}
        <View style={styles.settingField}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Duración objetivo por micro-dosis
          </Text>
          <View style={[styles.optionsGroup, { backgroundColor: colors.surfaceContainerLow }]}>
            {[1.5, 2.5, 3.5].map(mins => {
              const isSelected = settings.targetDurationMinutes === mins;
              return (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : 'transparent',
                    },
                  ]}
                  onPress={() => handleDurationSelect(mins)}
                >
                  <Text
                    style={[
                      styles.optionBtnText,
                      { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {mins} min
                  </Text>
                  {mins === 2.5 && (
                    <Text style={[styles.optSubtext, { color: isSelected ? '#FFFFFF' : colors.textMuted }]}>
                      Recomendado
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Switches IA */}
        <View style={styles.switchesGroup}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>Preguntas de retención activa</Text>
              <Text style={[styles.switchSubtitle, { color: colors.textSecondary }]}>
                Micro-evaluación socrática al concluir cada dosis
              </Text>
            </View>
            <Switch
              value={settings.retentionQuizEnabled}
              onValueChange={val => onUpdateSettings({ ...settings, retentionQuizEnabled: val })}
              trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>Extracción de glosario clave</Text>
              <Text style={[styles.switchSubtitle, { color: colors.textSecondary }]}>
                Destaca conceptos densos con definiciones en 1 tap
              </Text>
            </View>
            <Switch
              value={settings.glossaryEnabled}
              onValueChange={val => onUpdateSettings({ ...settings, glossaryEnabled: val })}
              trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
            />
          </View>
        </View>
      </View>

      {/* 3. Experiencia de Audio y Voz Zen */}
      <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="headset-outline" size={19} color={colors.tertiaryContainer} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio y Voz Zen</Text>
          </View>
          <View style={[styles.ttsBadge, { backgroundColor: colors.tertiaryFixed }]}>
            <Text style={[styles.ttsBadgeText, { color: colors.tertiaryContainer }]}>NEURO-TTS</Text>
          </View>
        </View>

        {/* Selector de Voz */}
        <View style={styles.settingField}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Voz de lectura sintética</Text>
          <View style={styles.voiceCardsRow}>
            <TouchableOpacity
              style={[
                styles.voiceCard,
                {
                  backgroundColor: settings.voiceSpeaker === 'Elena' ? colors.secondaryContainer : colors.surfaceContainerLow,
                  borderColor: settings.voiceSpeaker === 'Elena' ? colors.primaryContainer : 'transparent',
                },
              ]}
              onPress={() => handleVoiceSelect('Elena')}
            >
              <View style={styles.voiceCardHeader}>
                <Text style={[styles.voiceName, { color: colors.text }]}>Elena</Text>
                <Ionicons
                  name={settings.voiceSpeaker === 'Elena' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={colors.primaryContainer}
                />
              </View>
              <Text style={[styles.voiceDesc, { color: colors.textSecondary }]}>Serena · Tono Neuro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.voiceCard,
                {
                  backgroundColor: settings.voiceSpeaker === 'Marcos' ? colors.secondaryContainer : colors.surfaceContainerLow,
                  borderColor: settings.voiceSpeaker === 'Marcos' ? colors.primaryContainer : 'transparent',
                },
              ]}
              onPress={() => handleVoiceSelect('Marcos')}
            >
              <View style={styles.voiceCardHeader}>
                <Text style={[styles.voiceName, { color: colors.text }]}>Marcos</Text>
                <Ionicons
                  name={settings.voiceSpeaker === 'Marcos' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={colors.primaryContainer}
                />
              </View>
              <Text style={[styles.voiceDesc, { color: colors.textSecondary }]}>Dinámico · Enérgico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Velocidad */}
        <View style={styles.settingField}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Velocidad de reproducción</Text>
          <View style={[styles.optionsGroup, { backgroundColor: colors.surfaceContainerLow }]}>
            {[1.0, 1.25, 1.5, 2.0].map(rate => {
              const isSelected = settings.speechRate === rate;
              return (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.rateBtn,
                    {
                      backgroundColor: isSelected ? colors.primaryContainer : 'transparent',
                    },
                  ]}
                  onPress={() => handleSpeechRateSelect(rate)}
                >
                  <Text
                    style={[
                      styles.optionBtnText,
                      { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {rate}x
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 4. Ambiente de Lectura y Tema Cromático */}
      <View style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="color-palette-outline" size={19} color={colors.primaryContainer} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ambiente de Lectura</Text>
        </View>

        <View style={styles.settingField}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Esquema cromático santuario</Text>
          <View style={styles.themeModesRow}>
            {/* Papel Día */}
            <TouchableOpacity
              style={[
                styles.themeModeItem,
                {
                  borderColor: themeMode === 'paper' ? colors.primaryContainer : 'transparent',
                  borderWidth: 2,
                  backgroundColor: colors.surfaceContainerLow,
                },
              ]}
              onPress={() => {
                AudioService.triggerHaptic('light');
                onChangeTheme('paper');
              }}
            >
              <View style={[styles.themePreviewBox, { backgroundColor: '#FAF9F6' }]} />
              <Text style={[styles.themeModeName, { color: colors.text }]}>Papel Día</Text>
              {themeMode === 'paper' && (
                <View style={[styles.themeCheck, { backgroundColor: colors.primaryContainer }]}>
                  <Ionicons name="checkmark" size={10} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Sepia Cálido */}
            <TouchableOpacity
              style={[
                styles.themeModeItem,
                {
                  borderColor: themeMode === 'sepia' ? colors.primaryContainer : 'transparent',
                  borderWidth: 2,
                  backgroundColor: colors.surfaceContainerLow,
                },
              ]}
              onPress={() => {
                AudioService.triggerHaptic('light');
                onChangeTheme('sepia');
              }}
            >
              <View style={[styles.themePreviewBox, { backgroundColor: '#F5EEDB' }]} />
              <Text style={[styles.themeModeName, { color: colors.text }]}>Sepia</Text>
              {themeMode === 'sepia' && (
                <View style={[styles.themeCheck, { backgroundColor: colors.primaryContainer }]}>
                  <Ionicons name="checkmark" size={10} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Noche OLED */}
            <TouchableOpacity
              style={[
                styles.themeModeItem,
                {
                  borderColor: themeMode === 'dark' ? colors.primaryContainer : 'transparent',
                  borderWidth: 2,
                  backgroundColor: colors.surfaceContainerLow,
                },
              ]}
              onPress={() => {
                AudioService.triggerHaptic('light');
                onChangeTheme('dark');
              }}
            >
              <View style={[styles.themePreviewBox, { backgroundColor: '#09090B' }]} />
              <Text style={[styles.themeModeName, { color: colors.text }]}>Noche OLED</Text>
              {themeMode === 'dark' && (
                <View style={[styles.themeCheck, { backgroundColor: colors.primaryContainer }]}>
                  <Ionicons name="checkmark" size={10} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  profileCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16, gap: 14 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  profileTextCol: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileName: { fontSize: 17, fontWeight: '700' },
  profileEmail: { fontSize: 12 },
  planBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4, gap: 4 },
  planBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  creditsBox: { padding: 12, borderRadius: 10, gap: 6 },
  creditsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditsLabelLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  creditsTitle: { fontSize: 12, fontWeight: '600' },
  creditsUsedText: { fontSize: 11, fontWeight: '600' },
  creditsTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  creditsFill: { height: '100%', borderRadius: 3 },
  creditsFooterText: { fontSize: 10 },
  cardSection: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16, gap: 14 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  ttsBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  ttsBadgeText: { fontSize: 9, fontWeight: '800' },
  settingField: { gap: 8 },
  fieldLabel: { fontSize: 12, fontWeight: '600' },
  apiKeyInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 44, gap: 6 },
  apiKeyInput: { flex: 1, fontSize: 13 },
  saveKeyBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  saveKeyBtnText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  fieldHint: { fontSize: 11, lineHeight: 15 },
  optionsGroup: { flexDirection: 'row', borderRadius: 10, padding: 4, gap: 4 },
  optionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  optionBtnText: { fontSize: 12 },
  optSubtext: { fontSize: 8, marginTop: 1 },
  rateBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  switchesGroup: { gap: 12, borderTopWidth: 1, borderTopColor: '#00000010', paddingTop: 10 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  switchTextCol: { flex: 1 },
  switchTitle: { fontSize: 13, fontWeight: '600' },
  switchSubtitle: { fontSize: 11, marginTop: 1 },
  voiceCardsRow: { flexDirection: 'row', gap: 10 },
  voiceCard: { flex: 1, borderRadius: 10, padding: 10, borderWidth: 1, gap: 2 },
  voiceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voiceName: { fontSize: 13, fontWeight: '700' },
  voiceDesc: { fontSize: 10 },
  themeModesRow: { flexDirection: 'row', gap: 10 },
  themeModeItem: { flex: 1, borderRadius: 12, padding: 8, alignItems: 'center', gap: 6, position: 'relative' },
  themePreviewBox: { width: '100%', height: 38, borderRadius: 6 },
  themeModeName: { fontSize: 11, fontWeight: '600' },
  themeCheck: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
