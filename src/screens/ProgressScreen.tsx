import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStats } from '../types';
import { ThemeColors, ThemeMode, themes } from '../theme/tokens';
import { AudioService } from '../services/audioService';

interface ProgressScreenProps {
  stats: UserStats;
  themeMode: ThemeMode;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ stats, themeMode }) => {
  const colors: ThemeColors = themes[themeMode];
  const [reminderActivated, setReminderActivated] = useState(false);

  const daysLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const weeklyData = stats.weeklyMinutes || [14, 22, 18, 25, 16, 20, 15];
  const maxMinute = Math.max(...weeklyData, 25);

  const handleReminderToggle = () => {
    AudioService.triggerHaptic('success');
    setReminderActivated(true);
    setTimeout(() => {
      setReminderActivated(false);
    }, 2500);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabecera de Página */}
      <View style={styles.headerSection}>
        <View style={styles.headerTopBadgeRow}>
          <Text style={[styles.analytOverline, { color: colors.primaryContainer }]}>
            ANALÍTICA NEURO-LECTORA
          </Text>
          <View style={[styles.levelPill, { backgroundColor: colors.secondaryContainer }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primaryContainer} />
            <Text style={[styles.levelPillText, { color: colors.onSecondaryContainer }]}>
              Nivel 4: Lector Metódico
            </Text>
          </View>
        </View>

        <Text style={[styles.pageHeading, { color: colors.text }]}>Progreso Cognitivo</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Semana en curso · Calibrado con IA
        </Text>
      </View>

      {/* Tarjeta Maestra de Racha (Hero Streak Card) */}
      <View style={[styles.streakHeroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.streakTopRow}>
          <View>
            <Text style={[styles.streakLabel, { color: colors.tertiary }]}>COMPROMISO DIARIO</Text>
            <View style={styles.streakCountRow}>
              <Text style={[styles.streakCountBig, { color: colors.text }]}>
                {stats.currentStreakDays} Días
              </Text>
              <Text style={{ fontSize: 24 }}>🔥</Text>
            </View>
            <Text style={[styles.streakCaption, { color: colors.textSecondary }]}>
              Racha impecable · Tu mejor marca semanal
            </Text>
          </View>

          {/* Medidor Radial */}
          <View style={[styles.radialBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.primaryContainer }]}>
            <Text style={[styles.radialPercent, { color: colors.primaryContainer }]}>75%</Text>
            <Text style={[styles.radialMeta, { color: colors.textSecondary }]}>Meta</Text>
          </View>
        </View>

        {/* Progreso Diario de Minutos */}
        <View style={[styles.dailyMinutesBox, { backgroundColor: colors.surfaceContainerLow }]}>
          <View style={styles.minutesLabelsRow}>
            <Text style={[styles.minutesCurrent, { color: colors.text }]}>
              Meta diaria: {stats.todayMinutesRead} / {stats.dailyGoalMinutes} min
            </Text>
            <Text style={[styles.dosesGoalText, { color: colors.primaryContainer }]}>
              4 dosis hoy (2-3 min c/u)
            </Text>
          </View>
          <View style={[styles.minutesTrack, { backgroundColor: colors.surfaceContainerHighest }]}>
            <View
              style={[
                styles.minutesFill,
                {
                  backgroundColor: colors.primaryContainer,
                  width: `${Math.min(100, Math.round((stats.todayMinutesRead / stats.dailyGoalMinutes) * 100))}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Calendario Semanal de Micro-Dosis */}
        <View style={[styles.weekCalendarRow, { borderTopColor: colors.surfaceContainer }]}>
          {daysLabels.map((day, idx) => {
            const isToday = idx === 6;
            return (
              <View key={day} style={styles.calendarDayCol}>
                <Text style={[styles.calDayLabel, { color: isToday ? colors.primaryContainer : colors.textSecondary, fontWeight: isToday ? '700' : '500' }]}>
                  {day}
                </Text>
                <View
                  style={[
                    styles.calCheckCircle,
                    {
                      backgroundColor: isToday ? colors.secondaryContainer : colors.primaryContainer,
                      borderColor: isToday ? colors.primaryContainer : 'transparent',
                      borderWidth: isToday ? 2 : 0,
                    },
                  ]}
                >
                  <Ionicons
                    name={isToday ? 'book' : 'checkmark'}
                    size={14}
                    color={isToday ? colors.primaryContainer : '#FFFFFF'}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Métricas Clave de Rendimiento (Grid 2x2) */}
      <View style={styles.metricsSection}>
        <Text style={[styles.metricsHeading, { color: colors.text }]}>Métricas de Rendimiento</Text>
        <View style={styles.grid2x2}>
          {/* Card 1 */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="timer-outline" size={18} color={colors.primaryContainer} />
            </View>
            <View style={styles.metricValuesRow}>
              <Text style={[styles.metricBigNum, { color: colors.text }]}>{stats.focusMinutesTotal || 142}</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>min</Text>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Tiempo de Foco</Text>
            <View style={styles.metricTrendRow}>
              <Ionicons name="arrow-up" size={12} color={colors.primaryContainer} />
              <Text style={[styles.metricTrendText, { color: colors.primaryContainer }]}>+18% vs sem. ant.</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="book-outline" size={18} color={colors.secondary} />
            </View>
            <View style={styles.metricValuesRow}>
              <Text style={[styles.metricBigNum, { color: colors.text }]}>{stats.articlesReadCount || 28}</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>art.</Text>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Artículos Digeridos</Text>
            <Text style={[styles.metricSubInfo, { color: colors.textMuted }]}>84 dosis asimiladas</Text>
          </View>

          {/* Card 3 */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="bulb-outline" size={18} color={colors.tertiary} />
            </View>
            <View style={styles.metricValuesRow}>
              <Text style={[styles.metricBigNum, { color: colors.text }]}>{stats.retentionRatePercent || 91}%</Text>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Índice de Retención</Text>
            <Text style={[styles.metricSubInfo, { color: colors.textMuted }]}>Repasos de 30 seg</Text>
          </View>

          {/* Card 4 */}
          <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.metricIconWrap, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="battery-charging-outline" size={18} color={colors.text} />
            </View>
            <View style={styles.metricValuesRow}>
              <Text style={[styles.metricBigNum, { color: colors.text }]}>{stats.savedHoursCognitive || 4.2}</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>hrs</Text>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Sobrecarga Evitada</Text>
            <Text style={[styles.metricSubInfo, { color: colors.textMuted }]}>Menos fricción mental</Text>
          </View>
        </View>
      </View>

      {/* Gráfico Semanal de Retención y Tiempo */}
      <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Ritmo Semanal de Lectura</Text>
            <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>Minutos acumulados por jornada</Text>
          </View>
          <View style={[styles.sevenDaysBadge, { backgroundColor: colors.surfaceContainer }]}>
            <Text style={[styles.sevenDaysText, { color: colors.textSecondary }]}>7 DÍAS</Text>
          </View>
        </View>

        {/* Barras Semanales */}
        <View style={styles.barsContainer}>
          {weeklyData.map((mins, idx) => {
            const heightPercent = Math.max(20, Math.round((mins / maxMinute) * 100));
            const isToday = idx === 6;
            return (
              <View key={idx} style={styles.barCol}>
                <Text style={[styles.barValText, { color: isToday ? colors.primaryContainer : colors.textMuted }]}>
                  {mins}m
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isToday ? colors.primaryContainer : colors.secondaryContainer,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barDayText, { color: isToday ? colors.primaryContainer : colors.textSecondary, fontWeight: isToday ? '700' : '500' }]}>
                  {daysLabels[idx]}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.chartFooterRow, { borderTopColor: colors.surfaceContainer }]}>
          <View style={styles.chartAverageRow}>
            <View style={[styles.dotIndicator, { backgroundColor: colors.primaryContainer }]} />
            <Text style={[styles.avgText, { color: colors.textSecondary }]}>Promedio: 18.5 min/día</Text>
          </View>
          <Text style={[styles.blocksText, { color: colors.textMuted }]}>Bloques de 2.5 min</Text>
        </View>
      </View>

      {/* Recomendación Circadiana IA */}
      <View style={[styles.circadianCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.secondaryContainer }]}>
        <View style={styles.circadianTop}>
          <View style={[styles.circadianIconCircle, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="sunny-outline" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.circadianTextCol}>
            <Text style={[styles.circadianOverline, { color: colors.primaryContainer }]}>
              RITMO CIRCADIANO IA
            </Text>
            <Text style={[styles.circadianBody, { color: colors.text }]}>
              Tu pico de retención ocurre a las <Text style={{ fontWeight: '700', color: colors.primaryContainer }}>9:30 AM</Text>. Recomendamos tu próxima dosis en <Text style={{ fontWeight: '600', color: colors.tertiary }}>45 min</Text>.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.circadianBtn,
            { backgroundColor: reminderActivated ? colors.success : colors.primaryContainer },
          ]}
          onPress={handleReminderToggle}
          activeOpacity={0.85}
        >
          <Ionicons
            name={reminderActivated ? 'checkmark-circle' : 'notifications-outline'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.circadianBtnText}>
            {reminderActivated ? '¡Recordatorio Activado!' : 'Programar Recordatorio Zen'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  headerSection: { marginBottom: 16, gap: 4 },
  headerTopBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  analytOverline: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  levelPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  levelPillText: { fontSize: 11, fontWeight: '600' },
  pageHeading: { fontSize: 26, fontWeight: '700', marginTop: 2 },
  pageSubtitle: { fontSize: 13 },
  streakHeroCard: { borderRadius: 16, padding: 18, borderWidth: 1, marginBottom: 20, gap: 14 },
  streakTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  streakLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  streakCountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  streakCountBig: { fontSize: 32, fontWeight: '700' },
  streakCaption: { fontSize: 12 },
  radialBox: { width: 62, height: 62, borderRadius: 31, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  radialPercent: { fontSize: 14, fontWeight: '800' },
  radialMeta: { fontSize: 9, fontWeight: '600' },
  dailyMinutesBox: { padding: 12, borderRadius: 10, gap: 6 },
  minutesLabelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  minutesCurrent: { fontSize: 12, fontWeight: '600' },
  dosesGoalText: { fontSize: 11, fontWeight: '600' },
  minutesTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  minutesFill: { height: '100%', borderRadius: 3 },
  weekCalendarRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 12 },
  calendarDayCol: { alignItems: 'center', gap: 4 },
  calDayLabel: { fontSize: 11 },
  calCheckCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  metricsSection: { marginBottom: 20, gap: 10 },
  metricsHeading: { fontSize: 17, fontWeight: '700' },
  grid2x2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '48%', borderRadius: 14, padding: 14, borderWidth: 1, gap: 4 },
  metricIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  metricValuesRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  metricBigNum: { fontSize: 24, fontWeight: '700' },
  metricUnit: { fontSize: 12 },
  metricLabel: { fontSize: 11, fontWeight: '600' },
  metricTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  metricTrendText: { fontSize: 11, fontWeight: '700' },
  metricSubInfo: { fontSize: 10, marginTop: 2 },
  chartCard: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 20, gap: 14 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle: { fontSize: 16, fontWeight: '700' },
  chartSubtitle: { fontSize: 11 },
  sevenDaysBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  sevenDaysText: { fontSize: 9, fontWeight: '800' },
  barsContainer: { flexDirection: 'row', height: 130, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4 },
  barCol: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: 4 },
  barValText: { fontSize: 10, fontWeight: '600' },
  barTrack: { width: 22, height: 85, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  barDayText: { fontSize: 11 },
  chartFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 10 },
  chartAverageRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotIndicator: { width: 8, height: 8, borderRadius: 4 },
  avgText: { fontSize: 11 },
  blocksText: { fontSize: 11 },
  circadianCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 14, marginBottom: 20 },
  circadianTop: { flexDirection: 'row', gap: 12 },
  circadianIconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  circadianTextCol: { flex: 1, gap: 4 },
  circadianOverline: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  circadianBody: { fontSize: 13, lineHeight: 18 },
  circadianBtn: {
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  circadianBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
