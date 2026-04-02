import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

// ── Data ─────────────────────────────────────────────────────
const WEEKLY = [40, 65, 50, 80, 70, 90, 60];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_INDEX = 5;
const CHART_MAX_H = 90;

const STATS = [
  { label: 'Total Questions', value: '150', color: '#6C63FF', bg: '#EEF2FF' },
  { label: 'Accuracy', value: '80%', color: '#22C55E', bg: '#ECFDF5' },
  { label: 'Avg Time', value: '18s', color: '#22C55E', bg: '#ECFDF5' },
  { label: 'Streak', value: '7 days', color: '#6C63FF', bg: '#EEF2FF' },
];

const STRENGTHS = [
  { name: 'Probability', pct: 92 },
  { name: 'Number System', pct: 88 },
];

const IMPROVE = [
  { name: 'Algebra', pct: 65 },
  { name: 'Time & Work', pct: 58 },
];

// ── Components ────────────────────────────────────────────────
const StatCard = ({ item }) => (
  <View style={[styles.statCard, { flex: 1 }]}>
    <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
      <View style={[styles.iconDot, { backgroundColor: item.color }]} />
    </View>
    <Text style={[styles.statLabel,{
      color:"#4D38A2"
    }]}>{item.label}</Text>
        <Text style={[styles.statVal, { color: "#291069" }]}>{item.value}</Text>

  </View>
);

const BarChart = () => {
  const barWidth = (width - 40 - 32 - 6 * 8) / 7;

  return (
    <View style={styles.barsRow}>
      {WEEKLY.map((v, i) => {
        const h = Math.round((v / 100) * CHART_MAX_H);
        const active = i === TODAY_INDEX;
        const past = i < TODAY_INDEX;

        const bg = active
          ? '#6C63FF'
          : past
          ? '#DCD9FF'
          : '#EEEEF5';

        return (
          <View key={i} style={[styles.barCol, { width: barWidth }]}>
            <View style={[styles.bar, { height: h, backgroundColor: bg }]} />
            <Text style={styles.barLabel}>{DAYS[i]}</Text>
          </View>
        );
      })}
    </View>
  );
};

const ProgressRow = ({ name, pct, color }) => (
  <View style={styles.progItem}>
    <View style={styles.progHeader}>
      <Text style={styles.progName}>{name}</Text>
      <Text style={[styles.progVal, { color }]}>{pct}%</Text>
    </View>

    <View style={styles.progTrack}>
      <View
        style={[styles.progFill, { width: `${pct}%`, backgroundColor: color }]}
      />
    </View>
  </View>
);

// ── Main Screen ──────────────────────────────────────────────
export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom:55
        }}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Analytics</Text>
        <Text style={styles.pageSub}>Track your learning progress</Text>

        {/* Stats */}
        <View style={styles.statRow}>
          <StatCard item={STATS[0]} />
          <View style={{ width: 12 }} />
          <StatCard item={STATS[1]} />
        </View>

        <View style={[styles.statRow, { marginTop: 12 }]}>
          <StatCard item={STATS[2]} />
          <View style={{ width: 12 }} />
          <StatCard item={STATS[3]} />
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <BarChart />
        </View>

        {/* Strengths */}
        <Text style={styles.sectionTitle}>Strengths</Text>
        {STRENGTHS.map(item => (
          <ProgressRow
            key={item.name}
            name={item.name}
            pct={item.pct}
            color="#22C55E"
          />
        ))}

        {/* Improve */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Areas to Improve
        </Text>
        {IMPROVE.map(item => (
          <ProgressRow
            key={item.name}
            name={item.name}
            pct={item.pct}
            color="#EF4444"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginTop: 20,
  },

  pageSub: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },

  statRow: {
    flexDirection: 'row',
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  iconDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statVal: {
    fontSize: 24,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    marginTop:15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },

  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_MAX_H + 22,
    justifyContent: 'space-between',
  },

  barCol: {
    alignItems: 'center',
  },

  bar: {
    width: 16,
    borderRadius: 8,
    marginBottom: 6,
  },

  barLabel: {
    fontSize: 11,
    color: '#6b7280',
  },

  progItem: {
    marginBottom: 16,
  },

  progHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  progName: {
    fontSize: 14,
    color: '#111',
  },

  progVal: {
    fontSize: 14,
    fontWeight: '700',
  },

  progTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },

  progFill: {
    height: '100%',
    borderRadius: 20,
  },
});