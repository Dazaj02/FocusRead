import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../types';
import { ThemeColors, ThemeMode, themes } from '../theme/tokens';
import { AudioService } from '../services/audioService';

interface MyDosesScreenProps {
  articles: Article[];
  themeMode: ThemeMode;
  onSelectArticle: (article: Article, initialDoseIndex?: number) => void;
  onQuickListen: (article: Article, doseIndex?: number) => void;
  onOpenImportModal: () => void;
  onToggleBookmark: (articleId: string) => void;
}

export const MyDosesScreen: React.FC<MyDosesScreenProps> = ({
  articles,
  themeMode,
  onSelectArticle,
  onQuickListen,
  onOpenImportModal,
  onToggleBookmark,
}) => {
  const colors: ThemeColors = themes[themeMode];
  const [activeTab, setActiveTab] = useState<'in-progress' | 'saved' | 'completed' | 'audio'>('in-progress');

  const heroArticle = articles[0] || null;
  const heroDoses = heroArticle?.microDoses || [];
  const completedCount = heroDoses.filter(d => d.isCompleted).length;
  const heroProgressPercent = heroDoses.length > 0 ? Math.round((completedCount / heroDoses.length) * 100) : 0;

  // Filtrado según la pestaña activa
  const filteredArticles = articles.filter(art => {
    const hasCompleted = art.microDoses.some(d => d.isCompleted);
    const allCompleted = art.microDoses.every(d => d.isCompleted);

    if (activeTab === 'in-progress') return !allCompleted;
    if (activeTab === 'saved') return art.isFavorite;
    if (activeTab === 'completed') return allCompleted || hasCompleted;
    if (activeTab === 'audio') return true;
    return true;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sección Encabezado & Acción Rápida */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headingTitle, { color: colors.text }]}>Mi Dosis</Text>
          <View style={styles.statusSubRow}>
            <View style={[styles.activeDot, { backgroundColor: colors.primaryContainer }]} />
            <Text style={[styles.headingSubtitle, { color: colors.textSecondary }]}>
              {articles.length} lecturas en curso · 14 completadas
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.fragmentBtn, { backgroundColor: colors.primaryContainer }]}
          onPress={onOpenImportModal}
          activeOpacity={0.85}
        >
          <Ionicons name="link-outline" size={17} color="#FFFFFF" />
          <Text style={styles.fragmentBtnText}>+ Fragmentar URL</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros / Segmented Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        <TouchableOpacity
          style={[
            styles.tabPill,
            {
              backgroundColor: activeTab === 'in-progress' ? colors.primaryContainer : colors.surfaceContainer,
            },
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('in-progress');
          }}
        >
          <Text
            style={[
              styles.tabPillText,
              { color: activeTab === 'in-progress' ? '#FFFFFF' : colors.textSecondary, fontWeight: activeTab === 'in-progress' ? '700' : '500' },
            ]}
          >
            En Curso ({articles.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabPill,
            {
              backgroundColor: activeTab === 'saved' ? colors.primaryContainer : colors.surfaceContainer,
            },
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('saved');
          }}
        >
          <Text
            style={[
              styles.tabPillText,
              { color: activeTab === 'saved' ? '#FFFFFF' : colors.textSecondary, fontWeight: activeTab === 'saved' ? '700' : '500' },
            ]}
          >
            Guardados (8)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabPill,
            {
              backgroundColor: activeTab === 'completed' ? colors.primaryContainer : colors.surfaceContainer,
            },
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('completed');
          }}
        >
          <Text
            style={[
              styles.tabPillText,
              { color: activeTab === 'completed' ? '#FFFFFF' : colors.textSecondary, fontWeight: activeTab === 'completed' ? '700' : '500' },
            ]}
          >
            Completados (14)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabPill,
            {
              backgroundColor: activeTab === 'audio' ? colors.primaryContainer : colors.surfaceContainer,
            },
          ]}
          onPress={() => {
            AudioService.triggerHaptic('light');
            setActiveTab('audio');
          }}
        >
          <Ionicons name="headset-outline" size={14} color={activeTab === 'audio' ? '#FFFFFF' : colors.textSecondary} style={{ marginRight: 4 }} />
          <Text
            style={[
              styles.tabPillText,
              { color: activeTab === 'audio' ? '#FFFFFF' : colors.textSecondary, fontWeight: activeTab === 'audio' ? '700' : '500' },
            ]}
          >
            Dosis de Audio
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tarjeta Hero: Continuación Inmediata */}
      {heroArticle && (
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadgeLeft}>
              <Ionicons name="book" size={16} color={colors.primaryContainer} />
              <Text style={[styles.heroOverline, { color: colors.primaryContainer }]}>
                LECTURA ACTIVA INMEDIATA
              </Text>
            </View>
            <View style={[styles.timeLeftBadge, { backgroundColor: colors.secondaryContainer }]}>
              <Text style={[styles.timeLeftText, { color: colors.onSecondaryContainer }]}>
                Falta 1 min 10 s
              </Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {heroArticle.title}
          </Text>
          <Text style={[styles.heroAuthor, { color: colors.textSecondary }]}>
            {heroArticle.author} · <Text style={{ fontStyle: 'italic' }}>Nature Mind</Text>
          </Text>

          {/* Stepper de Dosis Fragmentadas */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperHeader}>
              <Text style={[styles.stepperLabel, { color: colors.primaryContainer }]}>
                Dosis 2 de 3 · El filtro atencional
              </Text>
              <Text style={[styles.stepperPercent, { color: colors.textSecondary }]}>
                {heroProgressPercent}% completado
              </Text>
            </View>

            <View style={styles.stepperTrack}>
              {heroDoses.map((dose, idx) => {
                const isFinished = dose.isCompleted;
                const isCurrent = !isFinished && idx === heroDoses.findIndex(d => !d.isCompleted);
                return (
                  <View
                    key={dose.id}
                    style={[
                      styles.stepperSegment,
                      {
                        backgroundColor: isFinished
                          ? colors.primaryContainer
                          : isCurrent
                          ? colors.primaryContainer + 'CC'
                          : colors.surfaceContainerHighest,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* Acciones Hero */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={[styles.heroPlayBtn, { backgroundColor: colors.primaryContainer }]}
              onPress={() => onSelectArticle(heroArticle, 1)}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.heroPlayBtnText}>Continuar Audio & Texto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.heroBookmarkBtn, { backgroundColor: colors.surfaceContainer }]}
              onPress={() => onToggleBookmark(heroArticle.id)}
            >
              <Ionicons
                name={heroArticle.isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Lista de Artículos en Curso */}
      <View style={styles.listHeaderRow}>
        <Text style={[styles.listHeading, { color: colors.text }]}>Lecturas en Curso</Text>
        <Text style={[styles.syncBadge, { color: colors.textSecondary }]}>SINCRONIZADO VÍA AI</Text>
      </View>

      <View style={styles.articlesStack}>
        {filteredArticles.map(art => {
          const finished = art.microDoses.filter(d => d.isCompleted).length;
          const total = art.microDoses.length;
          const pct = Math.round((finished / total) * 100);

          return (
            <TouchableOpacity
              key={art.id}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.8}
              onPress={() => onSelectArticle(art)}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemTags}>
                  <View style={[styles.catBadge, { backgroundColor: colors.surfaceContainer }]}>
                    <Text style={[styles.catBadgeText, { color: colors.textSecondary }]}>
                      {art.category.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.dosesCountText, { color: colors.textMuted }]}>
                    {total} Dosis ({Math.round(art.totalReadingTimeSeconds / 60)} min)
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onToggleBookmark(art.id)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={art.isFavorite ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={art.isFavorite ? colors.primaryContainer : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.itemTitle, { color: colors.text }]}>{art.title}</Text>

              <View style={styles.itemProgressRow}>
                <View style={styles.itemProgressCol}>
                  <View style={[styles.itemProgressBar, { backgroundColor: colors.surfaceContainer }]}>
                    <View
                      style={[
                        styles.itemProgressFill,
                        { backgroundColor: colors.primaryContainer, width: `${pct}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.itemProgressLabels}>
                    <Text style={[styles.itemProgressText, { color: colors.textSecondary }]}>
                      {finished} de {total} dosis finalizadas
                    </Text>
                    <Text style={[styles.itemProgressPercent, { color: colors.primaryContainer }]}>
                      {pct}%
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.itemPlayBtn, { backgroundColor: colors.secondaryContainer }]}
                  onPress={() => onQuickListen(art)}
                >
                  <Ionicons name="play" size={17} color={colors.onSecondaryContainer} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Colecciones Temáticas */}
      <View style={styles.collectionsSection}>
        <View style={styles.collectionsHeader}>
          <Text style={[styles.collectionsTitle, { color: colors.text }]}>Colecciones Temáticas</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primaryContainer }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.collectionsRow}>
          <TouchableOpacity style={[styles.colChip, { backgroundColor: colors.surfaceContainerLow }]}>
            <Ionicons name="bulb-outline" size={17} color={colors.primaryContainer} />
            <Text style={[styles.colChipText, { color: colors.text }]}>Neurociencia</Text>
            <View style={[styles.colCountBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[styles.colCountText, { color: colors.textSecondary }]}>5</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.colChip, { backgroundColor: colors.surfaceContainerLow }]}>
            <Ionicons name="hardware-chip-outline" size={17} color={colors.primaryContainer} />
            <Text style={[styles.colChipText, { color: colors.text }]}>Tecnología</Text>
            <View style={[styles.colCountBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[styles.colCountText, { color: colors.textSecondary }]}>7</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.colChip, { backgroundColor: colors.surfaceContainerLow }]}>
            <Ionicons name="book-outline" size={17} color={colors.primaryContainer} />
            <Text style={[styles.colChipText, { color: colors.text }]}>Filosofía</Text>
            <View style={[styles.colCountBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[styles.colCountText, { color: colors.textSecondary }]}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headingTitle: { fontSize: 26, fontWeight: '700' },
  statusSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  headingSubtitle: { fontSize: 13 },
  fragmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  fragmentBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  tabsRow: { gap: 8, marginBottom: 18 },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabPillText: { fontSize: 13 },
  heroCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadgeLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroOverline: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  timeLeftBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  timeLeftText: { fontSize: 10, fontWeight: '600' },
  heroTitle: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  heroAuthor: { fontSize: 12 },
  stepperContainer: { gap: 6, marginTop: 4 },
  stepperHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  stepperLabel: { fontSize: 12, fontWeight: '600' },
  stepperPercent: { fontSize: 10, fontWeight: '700' },
  stepperTrack: { flexDirection: 'row', height: 7, gap: 5, borderRadius: 4, overflow: 'hidden' },
  stepperSegment: { flex: 1, borderRadius: 4 },
  heroActionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  heroPlayBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroPlayBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  heroBookmarkBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeading: { fontSize: 17, fontWeight: '700' },
  syncBadge: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  articlesStack: { gap: 10 },
  itemCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTags: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  catBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  dosesCountText: { fontSize: 11 },
  itemTitle: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  itemProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  itemProgressCol: { flex: 1, gap: 4 },
  itemProgressBar: { height: 5, borderRadius: 3, overflow: 'hidden' },
  itemProgressFill: { height: '100%', borderRadius: 3 },
  itemProgressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  itemProgressText: { fontSize: 11 },
  itemProgressPercent: { fontSize: 11, fontWeight: '700' },
  itemPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionsSection: { marginTop: 22, gap: 10 },
  collectionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  collectionsTitle: { fontSize: 17, fontWeight: '700' },
  seeAllText: { fontSize: 12, fontWeight: '600' },
  collectionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  colChipText: { fontSize: 12, fontWeight: '500' },
  colCountBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  colCountText: { fontSize: 10, fontWeight: '700' },
});
