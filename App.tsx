import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './src/screens/HomeScreen';
import { MyDosesScreen } from './src/screens/MyDosesScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ZenReaderScreen } from './src/screens/ZenReaderScreen';
import { StorageService } from './src/storage/storageService';
import { DeepSeekService } from './src/services/deepSeekService';
import { AudioService } from './src/services/audioService';
import { Article, UserStats, AppSettings } from './src/types';
import { ThemeMode, themes } from './src/theme/tokens';
import { DEFAULT_APP_SETTINGS } from './src/data/mockArticles';

type ActiveTab = 'explorar' | 'mi_dosis' | 'progreso' | 'ajustes';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<UserStats>({
    currentStreakDays: 7,
    todayMinutesRead: 15,
    dailyGoalMinutes: 20,
    completedDosesCount: 14,
  });
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [themeMode, setThemeMode] = useState<ThemeMode>('paper');

  // Navegación
  const [activeTab, setActiveTab] = useState<ActiveTab>('explorar');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [initialDoseIndex, setInitialDoseIndex] = useState<number>(0);

  // Modal para Importar URL o Fragmentar con IA
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Mini-Dock Audio Global Flotante
  const [floatingAudioArticle, setFloatingAudioArticle] = useState<Article | null>(null);
  const [floatingDoseIndex, setFloatingDoseIndex] = useState<number>(0);
  const [isFloatingAudioPlaying, setIsFloatingAudioPlaying] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedArticles = await StorageService.getArticles();
      const loadedStats = await StorageService.getUserStats();
      const loadedSettings = await StorageService.getSettings();
      setArticles(loadedArticles);
      setStats(loadedStats);
      setSettings(loadedSettings);
      if (loadedArticles.length > 0) {
        setFloatingAudioArticle(loadedArticles[0]);
      }
    } catch (e) {
      console.warn('Error loading local data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArticle = (article: Article, doseIdx: number = 0) => {
    AudioService.triggerHaptic('light');
    setActiveArticle(article);
    setInitialDoseIndex(doseIdx);
  };

  const handleQuickListen = (article: Article, doseIdx: number = 0) => {
    AudioService.triggerHaptic('medium');
    setFloatingAudioArticle(article);
    setFloatingDoseIndex(doseIdx);
    const dose = article.microDoses[doseIdx] || article.microDoses[0];
    if (dose) {
      setIsFloatingAudioPlaying(true);
      AudioService.speak(dose.contentChunk, {
        rate: settings.speechRate,
        onDone: () => setIsFloatingAudioPlaying(false),
        onError: () => setIsFloatingAudioPlaying(false),
      });
    }
  };

  const toggleFloatingPlayPause = () => {
    if (!floatingAudioArticle) return;
    const dose = floatingAudioArticle.microDoses[floatingDoseIndex];
    if (!dose) return;

    if (isFloatingAudioPlaying) {
      AudioService.stop();
      setIsFloatingAudioPlaying(false);
    } else {
      setIsFloatingAudioPlaying(true);
      AudioService.speak(dose.contentChunk, {
        rate: settings.speechRate,
        onDone: () => setIsFloatingAudioPlaying(false),
        onError: () => setIsFloatingAudioPlaying(false),
      });
    }
  };

  const handleCompleteDose = async (articleId: string, doseId: string) => {
    const res = await StorageService.markDoseCompleted(articleId, doseId);
    setArticles(res.articles);
    setStats(res.stats);

    const updated = res.articles.find(a => a.id === articleId);
    if (updated) {
      setActiveArticle(updated);
    }
  };

  const handleToggleBookmark = async (articleId: string) => {
    AudioService.triggerHaptic('light');
    const updated = await StorageService.toggleBookmark(articleId);
    setArticles(updated);
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  };

  // Procesamiento real con DeepSeek API o fallback local inteligente
  const handleProcessImport = async () => {
    if (!importInput.trim()) {
      Alert.alert('Entrada vacía', 'Por favor ingresa una URL válida o pega un texto para procesar.');
      return;
    }

    setIsProcessingAi(true);
    AudioService.triggerHaptic('medium');

    try {
      const newArticle = await DeepSeekService.processArticle(importInput.trim(), settings);
      const updated = [newArticle, ...articles];
      setArticles(updated);
      await StorageService.saveArticles(updated);

      setImportInput('');
      setImportModalVisible(false);
      AudioService.triggerHaptic('success');
      Alert.alert(
        '¡Dosis Lista!',
        `El contenido "${newArticle.title}" fue fragmentado en ${newArticle.microDoses.length} micro-dosis con preguntas socráticas.`
      );
      setActiveTab('mi_dosis');
    } catch (e: any) {
      Alert.alert('Error al procesar', e.message || 'Ocurrió un error al procesar el artículo con IA.');
    } finally {
      setIsProcessingAi(false);
    }
  };

  const colors = themes[themeMode];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primaryContainer} />
      </View>
    );
  }

  // Si está en el modo Zen Reader (pantalla completa)
  if (activeArticle) {
    return (
      <ZenReaderScreen
        article={activeArticle}
        currentDoseIndex={initialDoseIndex}
        themeMode={themeMode}
        speechRate={settings.speechRate}
        onChangeTheme={setThemeMode}
        onBack={() => {
          AudioService.stop();
          setActiveArticle(null);
        }}
        onCompleteDose={handleCompleteDose}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header Global Persistente */}
      <View style={[styles.globalHeader, { borderBottomColor: colors.surfaceContainer, backgroundColor: colors.background }]}>
        <View style={styles.brandLeft}>
          <View style={[styles.brandLogoCircle, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>FocusRead AI</Text>
            <Text style={[styles.tabSubtitle, { color: colors.textSecondary }]}>
              {activeTab === 'explorar' && 'EXPLORAR'}
              {activeTab === 'mi_dosis' && 'MI DOSIS'}
              {activeTab === 'progreso' && 'PROGRESO'}
              {activeTab === 'ajustes' && 'AJUSTES'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.profileHeaderBtn, { backgroundColor: colors.surfaceContainer }]}
          onPress={() => setActiveTab('ajustes')}
        >
          <Ionicons name="person" size={16} color={colors.text} />
          <View style={[styles.headerDot, { backgroundColor: colors.tertiaryContainer }]} />
        </TouchableOpacity>
      </View>

      {/* Pantalla Activa */}
      <View style={{ flex: 1 }}>
        {activeTab === 'explorar' && (
          <HomeScreen
            articles={articles}
            stats={stats}
            themeMode={themeMode}
            onSelectArticle={handleSelectArticle}
            onQuickListen={handleQuickListen}
            onOpenImportModal={() => setImportModalVisible(true)}
            onNavigateToTab={setActiveTab}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        {activeTab === 'mi_dosis' && (
          <MyDosesScreen
            articles={articles}
            themeMode={themeMode}
            onSelectArticle={handleSelectArticle}
            onQuickListen={handleQuickListen}
            onOpenImportModal={() => setImportModalVisible(true)}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        {activeTab === 'progreso' && (
          <ProgressScreen stats={stats} themeMode={themeMode} />
        )}
        {activeTab === 'ajustes' && (
          <SettingsScreen
            settings={settings}
            themeMode={themeMode}
            onChangeTheme={setThemeMode}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </View>

      {/* Floating Audio Zen Mini Player Persistente */}
      {floatingAudioArticle && (
        <View style={[styles.floatingDock, { backgroundColor: colors.dockBackground, borderColor: colors.border }]}>
          <View style={styles.floatingDockContent}>
            <View style={[styles.floatingIconBox, { backgroundColor: colors.primaryContainer }]}>
              <Ionicons name="headset" size={17} color="#FFFFFF" />
            </View>

            <TouchableOpacity
              style={styles.floatingTextCol}
              onPress={() => handleSelectArticle(floatingAudioArticle, floatingDoseIndex)}
            >
              <Text style={[styles.floatingTitle, { color: colors.text }]} numberOfLines={1}>
                {floatingAudioArticle.microDoses[floatingDoseIndex]?.title || floatingAudioArticle.title}
              </Text>
              <Text style={[styles.floatingSub, { color: colors.textSecondary }]}>
                Dosis {floatingDoseIndex + 1} · {settings.speechRate}x Voz Neural
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.floatingPlayBtn, { backgroundColor: colors.primaryContainer }]}
              onPress={toggleFloatingPlayPause}
            >
              <Ionicons
                name={isFloatingAudioPlaying ? 'pause' : 'play'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Barra de Navegación Inferior (Global Persistent Tabs) */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.surfaceContainer }]}>
        <TouchableOpacity
          style={[
            styles.bottomNavItem,
            activeTab === 'explorar' && [styles.bottomNavActive, { backgroundColor: colors.secondaryContainer }],
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('explorar');
          }}
        >
          <Ionicons
            name={activeTab === 'explorar' ? 'compass' : 'compass-outline'}
            size={22}
            color={activeTab === 'explorar' ? colors.primaryContainer : colors.textSecondary}
          />
          <Text
            style={[
              styles.bottomNavText,
              {
                color: activeTab === 'explorar' ? colors.primaryContainer : colors.textSecondary,
                fontWeight: activeTab === 'explorar' ? '700' : '500',
              },
            ]}
          >
            Explorar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomNavItem,
            activeTab === 'mi_dosis' && [styles.bottomNavActive, { backgroundColor: colors.secondaryContainer }],
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('mi_dosis');
          }}
        >
          <Ionicons
            name={activeTab === 'mi_dosis' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'mi_dosis' ? colors.primaryContainer : colors.textSecondary}
          />
          <Text
            style={[
              styles.bottomNavText,
              {
                color: activeTab === 'mi_dosis' ? colors.primaryContainer : colors.textSecondary,
                fontWeight: activeTab === 'mi_dosis' ? '700' : '500',
              },
            ]}
          >
            Mi Dosis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomNavItem,
            activeTab === 'progreso' && [styles.bottomNavActive, { backgroundColor: colors.secondaryContainer }],
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('progreso');
          }}
        >
          <Ionicons
            name={activeTab === 'progreso' ? 'flame' : 'flame-outline'}
            size={22}
            color={activeTab === 'progreso' ? colors.primaryContainer : colors.textSecondary}
          />
          <Text
            style={[
              styles.bottomNavText,
              {
                color: activeTab === 'progreso' ? colors.primaryContainer : colors.textSecondary,
                fontWeight: activeTab === 'progreso' ? '700' : '500',
              },
            ]}
          >
            Progreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bottomNavItem,
            activeTab === 'ajustes' && [styles.bottomNavActive, { backgroundColor: colors.secondaryContainer }],
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('ajustes');
          }}
        >
          <Ionicons
            name={activeTab === 'ajustes' ? 'settings' : 'settings-outline'}
            size={22}
            color={activeTab === 'ajustes' ? colors.primaryContainer : colors.textSecondary}
          />
          <Text
            style={[
              styles.bottomNavText,
              {
                color: activeTab === 'ajustes' ? colors.primaryContainer : colors.textSecondary,
                fontWeight: activeTab === 'ajustes' ? '700' : '500',
              },
            ]}
          >
            Ajustes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para Fragmentar URL / Texto con DeepSeek IA */}
      <Modal
        visible={importModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.importModalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="sparkles" size={20} color={colors.primaryContainer} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>Fragmentar con DeepSeek IA</Text>
              </View>
              <TouchableOpacity onPress={() => setImportModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Pega un enlace web o texto denso. DeepSeek extraerá la síntesis ejecutiva y creará micro-dosis de {settings.targetDurationMinutes} min con preguntas socráticas.
            </Text>

            <TextInput
              style={[
                styles.modalTextInput,
                { backgroundColor: colors.surfaceContainerLow, color: colors.text, borderColor: colors.border },
              ]}
              placeholder="https://ejemplo.com/articulo o texto largo..."
              placeholderTextColor={colors.textMuted}
              value={importInput}
              onChangeText={setImportInput}
              multiline
              autoCapitalize="none"
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceContainer }]}
                onPress={() => setImportModalVisible(false)}
                disabled={isProcessingAi}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.primaryContainer }]}
                onPress={handleProcessImport}
                disabled={isProcessingAi}
              >
                {isProcessingAi ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="flash" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmBtnText}>Sintetizar Dosis</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  globalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandLogoCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  brandTitle: { fontSize: 16, fontWeight: '700', lineHeight: 18 },
  tabSubtitle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  profileHeaderBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  headerDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4 },
  floatingDock: {
    position: 'absolute',
    bottom: 68,
    left: 16,
    right: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  floatingDockContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  floatingIconBox: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  floatingTextCol: { flex: 1 },
  floatingTitle: { fontSize: 12, fontWeight: '600' },
  floatingSub: { fontSize: 10 },
  floatingPlayBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 2,
  },
  bottomNavActive: {
    paddingHorizontal: 16,
  },
  bottomNavText: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  importModalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalSubtitle: { fontSize: 13, lineHeight: 18 },
  modalTextInput: {
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  modalActionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 13, fontWeight: '600' },
  confirmBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
