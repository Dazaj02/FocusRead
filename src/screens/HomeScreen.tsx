import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Article, UserStats } from '../types';
import { ThemeColors, ThemeMode, themes } from '../theme/tokens';
import { AudioService } from '../services/audioService';

interface HomeScreenProps {
  articles: Article[];
  stats: UserStats;
  themeMode: ThemeMode;
  onSelectArticle: (article: Article, initialDoseIndex?: number) => void;
  onQuickListen: (article: Article, doseIndex?: number) => void;
  onOpenImportModal: () => void;
  onNavigateToTab: (tab: 'explorar' | 'mi_dosis' | 'progreso' | 'ajustes') => void;
  onToggleBookmark: (articleId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  articles,
  stats,
  themeMode,
  onSelectArticle,
  onQuickListen,
  onOpenImportModal,
  onNavigateToTab,
  onToggleBookmark,
}) => {
  const colors: ThemeColors = themes[themeMode];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filterChips = [`Todos (${articles.length})`, 'IA & Tech', 'Productividad', 'Neurociencia', '< 3 min'];

  const filteredArticles = articles.filter(art => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'Todos' || selectedFilter.startsWith('Todos')) return matchesSearch;
    if (selectedFilter === 'IA & Tech') return matchesSearch && art.category.includes('Tecnología');
    if (selectedFilter === 'Productividad') return matchesSearch && art.category.includes('Productividad');
    if (selectedFilter === 'Neurociencia') return matchesSearch && art.category.includes('Neurociencia');
    if (selectedFilter === '< 3 min') {
      const avg = art.totalReadingTimeSeconds / (art.microDoses.length || 1);
      return matchesSearch && avg <= 180;
    }
    return matchesSearch;
  });

  // Primer artículo para la tarjeta destacada "Siguiente Dosis Recomendada"
  const recommendedArticle = filteredArticles[0] || articles[0] || null;
  const doses = recommendedArticle?.microDoses || [];
  const currentDoseIndex = doses.findIndex(d => !d.isCompleted) !== -1 
    ? doses.findIndex(d => !d.isCompleted) 
    : 0;

  // Otros artículos filtrados (excluyendo el primero si se muestra como destacado)
  const otherArticles = filteredArticles.filter(a => a.id !== recommendedArticle?.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Saludo & Cabecera Contextual */}
      <View style={styles.headerRow}>
        <View style={styles.greetingCol}>
          <Text style={[styles.greetingTitle, { color: colors.text }]}>
            Hola Alex 👋
          </Text>
          <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>
            Tu mente rinde mejor en bloques de 2-3 min.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.importBtn, { backgroundColor: colors.secondaryContainer }]}
          onPress={onOpenImportModal}
          activeOpacity={0.8}
        >
          <Ionicons name="flash" size={16} color={colors.primaryContainer} />
          <Text style={[styles.importBtnText, { color: colors.primaryContainer }]}>
            Importar URL
          </Text>
          <View style={[styles.badgePill, { backgroundColor: colors.primaryContainer }]}>
            <Text style={styles.badgePillText}>IA</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. Barra de Búsqueda y Filtros Rápidos */}
      <View style={styles.searchSection}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={19} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar artículos, temas o autores..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {filterChips.map(chip => {
            const isSelected = selectedFilter === chip || (chip.startsWith('Todos') && selectedFilter.startsWith('Todos'));
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primaryContainer : colors.surfaceContainerHigh,
                  },
                ]}
                onPress={() => {
                  AudioService.triggerHaptic('light');
                  setSelectedFilter(chip.startsWith('Todos') ? 'Todos' : chip);
                }}
              >
                {chip.includes('< 3 min') && (
                  <Ionicons name="flash-outline" size={13} color={isSelected ? '#fff' : colors.tertiary} style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '600' : '400' },
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Card de Progreso Diario (DailyProgressCard) */}
      <TouchableOpacity
        style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.9}
        onPress={() => onNavigateToTab('progreso')}
      >
        <View style={styles.progressCardContent}>
          {/* Círculo de Racha */}
          <View style={[styles.streakCircle, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.primaryContainer }]}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={[styles.streakNumber, { color: colors.text }]}>{stats.currentStreakDays}</Text>
          </View>

          <View style={styles.progressTextCol}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              Racha de Lectura: {stats.currentStreakDays} Días 🔥
            </Text>
            <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.primaryContainer,
                    width: `${Math.min(100, Math.round((stats.todayMinutesRead / stats.dailyGoalMinutes) * 100))}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: '700', color: colors.text }}>
                {stats.todayMinutesRead} / {stats.dailyGoalMinutes} min
              </Text>{' '}
              leídos hoy · 3 dosis para la meta
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 4. Sección: Tu Siguiente Dosis Recomendada */}
      {recommendedArticle && (
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.overlineLabel, { color: colors.primaryContainer }]}>
              ENFOQUE PERSONALIZADO
            </Text>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              Tu siguiente dosis recomendada
            </Text>
          </View>
          <TouchableOpacity
            style={styles.libLink}
            onPress={() => onNavigateToTab('mi_dosis')}
          >
            <Text style={[styles.libLinkText, { color: colors.primaryContainer }]}>Biblioteca</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primaryContainer} />
          </TouchableOpacity>
        </View>
      )}

      {/* ArticleCompleteCard Destacado */}
      {recommendedArticle && (
        <View style={[styles.articleCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
          {/* Tags Superiores */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.tagsGroup}>
              <View style={[styles.tagPill, { backgroundColor: colors.secondaryContainer }]}>
                <Text style={[styles.tagPillText, { color: colors.onSecondaryContainer }]}>
                  {recommendedArticle.category.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.timeBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <Text style={[styles.timeBadgeText, { color: colors.textSecondary }]}>
                  {recommendedArticle.microDoses.length} Dosis · {Math.round(recommendedArticle.totalReadingTimeSeconds / 60)} min
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bookmarkBtn}
              onPress={() => onToggleBookmark(recommendedArticle.id)}
            >
              <Ionicons
                name={recommendedArticle.isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={colors.primaryContainer}
              />
            </TouchableOpacity>
          </View>

          {/* Título y Byline Editorial */}
          <Text style={[styles.articleTitle, { color: colors.text }]}>
            {recommendedArticle.title}
          </Text>
          <View style={styles.authorRow}>
            <View style={[styles.authorAvatarPlaceholder, { backgroundColor: colors.surfaceContainerHighest }]}>
              <Ionicons name="person" size={12} color={colors.textSecondary} />
            </View>
            <Text style={[styles.authorText, { color: colors.textSecondary }]}>
              Por <Text style={{ fontWeight: '600', color: colors.text }}>{recommendedArticle.author}</Text> · Nature Mind
            </Text>
          </View>

          {/* Caja de Síntesis Ejecutiva IA */}
          <View style={[styles.summaryBox, { backgroundColor: colors.card }]}>
            <View style={styles.summaryTitleRow}>
              <Ionicons name="sparkles" size={15} color={colors.primaryContainer} />
              <Text style={[styles.summaryTitle, { color: colors.primaryContainer }]}>
                SÍNTESIS EJECUTIVA IA
              </Text>
            </View>
            {recommendedArticle.executiveSummary.map((point, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={[styles.bulletPoint, { color: colors.primaryContainer }]}>▪</Text>
                <Text style={[styles.bulletText, { color: colors.text }]}>{point}</Text>
              </View>
            ))}
          </View>

          {/* Lista de Micro-Dosis */}
          <View style={styles.dosesList}>
            <Text style={[styles.dosesListLabel, { color: colors.textSecondary }]}>
              ESTRUCTURA MODULAR
            </Text>
            {doses.map((dose, idx) => {
              const isCurrent = idx === currentDoseIndex;
              return (
                <TouchableOpacity
                  key={dose.id}
                  style={[
                    styles.doseItemRow,
                    {
                      backgroundColor: isCurrent ? colors.secondaryContainer : colors.card,
                      borderColor: isCurrent ? colors.primaryContainer : 'transparent',
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => onSelectArticle(recommendedArticle, idx)}
                >
                  <View style={styles.doseLeft}>
                    <View
                      style={[
                        styles.doseStatusIcon,
                        {
                          backgroundColor: dose.isCompleted
                            ? colors.surfaceContainerHigh
                            : isCurrent
                            ? colors.primaryContainer
                            : colors.surfaceContainer,
                        },
                      ]}
                    >
                      <Ionicons
                        name={dose.isCompleted ? 'checkmark-circle' : isCurrent ? 'volume-high' : 'lock-closed'}
                        size={15}
                        color={dose.isCompleted ? colors.success : isCurrent ? '#FFFFFF' : colors.textMuted}
                      />
                    </View>
                    <View style={styles.doseTitles}>
                      <Text
                        style={[
                          styles.doseTitleText,
                          {
                            color: colors.text,
                            fontWeight: isCurrent ? '600' : '500',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {dose.title}
                      </Text>
                      <Text style={[styles.doseTimeText, { color: colors.textSecondary }]}>
                        {Math.round(dose.estimatedSeconds / 60)} min · {isCurrent ? 'En curso' : dose.isCompleted ? 'Completado' : 'Lectura'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.doseBadge,
                      {
                        backgroundColor: dose.isCompleted
                          ? colors.surfaceContainerHigh
                          : isCurrent
                          ? colors.primaryContainer
                          : colors.surfaceContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.doseBadgeText,
                        {
                          color: isCurrent ? '#FFFFFF' : colors.textSecondary,
                        },
                      ]}
                    >
                      {dose.isCompleted ? 'Completado' : isCurrent ? 'En curso' : 'Pendiente'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botones de Acción */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: colors.primaryContainer }]}
              activeOpacity={0.85}
              onPress={() => onSelectArticle(recommendedArticle, currentDoseIndex)}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>
                Continuar Dosis {currentDoseIndex + 1} ({Math.round((doses[currentDoseIndex]?.estimatedSeconds || 150) / 60)} min)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zenIconBtn, { backgroundColor: colors.surfaceContainerHighest }]}
              onPress={() => onSelectArticle(recommendedArticle, currentDoseIndex)}
            >
              <Ionicons name="book-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. Lista de Más Lecturas Disponibles */}
      {otherArticles.length > 0 && (
        <View style={styles.moreArticlesSection}>
          <Text style={[styles.sectionHeading, { color: colors.text, marginBottom: 12 }]}>
            Más Lecturas Preparadas
          </Text>
          {otherArticles.map(art => {
            const finished = art.microDoses.filter(d => d.isCompleted).length;
            const total = art.microDoses.length;
            const pct = Math.round((finished / total) * 100);

            return (
              <TouchableOpacity
                key={art.id}
                style={[styles.smallArticleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.85}
                onPress={() => onSelectArticle(art)}
              >
                <View style={styles.smallCardTop}>
                  <View style={[styles.catBadge, { backgroundColor: colors.surfaceContainer }]}>
                    <Text style={[styles.catBadgeText, { color: colors.textSecondary }]}>
                      {art.category.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => onToggleBookmark(art.id)} style={{ padding: 4 }}>
                    <Ionicons
                      name={art.isFavorite ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={art.isFavorite ? colors.primaryContainer : colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.smallArticleTitle, { color: colors.text }]} numberOfLines={2}>
                  {art.title}
                </Text>

                <View style={styles.smallCardBottom}>
                  <Text style={[styles.smallCardDoses, { color: colors.textSecondary }]}>
                    {finished}/{total} dosis · {Math.round(art.totalReadingTimeSeconds / 60)} min
                  </Text>
                  <TouchableOpacity
                    style={[styles.smallListenBtn, { backgroundColor: colors.secondaryContainer }]}
                    onPress={() => onQuickListen(art)}
                  >
                    <Ionicons name="play" size={14} color={colors.primaryContainer} />
                    <Text style={[styles.smallListenText, { color: colors.primaryContainer }]}>Escuchar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Espaciador inferior para no tapar con el dock de navegación */}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greetingCol: {
    flex: 1,
    paddingRight: 8,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  importBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 2,
  },
  badgePillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  searchSection: {
    marginBottom: 16,
    gap: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterChipText: {
    fontSize: 12,
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  progressCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  streakCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressTextCol: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressSubtitle: {
    fontSize: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overlineLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  libLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  libLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 11,
  },
  bookmarkBtn: {
    padding: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatarPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorText: {
    fontSize: 12,
  },
  summaryBox: {
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletPoint: {
    fontSize: 12,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  dosesList: {
    gap: 8,
    marginTop: 4,
  },
  dosesListLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  doseItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  doseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  doseStatusIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseTitles: {
    flex: 1,
  },
  doseTitleText: {
    fontSize: 13,
  },
  doseTimeText: {
    fontSize: 11,
    marginTop: 1,
  },
  doseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  doseBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  zenIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreArticlesSection: {
    gap: 10,
  },
  smallArticleCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  smallCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smallArticleTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  smallCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  smallCardDoses: {
    fontSize: 12,
  },
  smallListenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  smallListenText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
