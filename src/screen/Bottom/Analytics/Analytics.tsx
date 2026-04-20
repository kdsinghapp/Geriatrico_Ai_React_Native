import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GetAnalyticsApi, AnalyticsResponse } from '../../../Api/apiRequest';
import CustomLoader from '../../../compoent/CustomLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Constants ────────────────────────────────────────────────
const CHART_MAX_H = 120;
const PURPLE = '#7625FE';
const GREEN = '#22C55E';
const RED = '#EF4444';

// ── Components ────────────────────────────────────────────────
const StatCard = ({ label, value, color, bg }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: bg }]}>
      <View style={[styles.iconDot, { backgroundColor: color }]} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statVal, { color: '#291069' }]}>{value}</Text>
  </View>
);

const BarChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const barWidth = (width - 40 - 32 - (data.length - 1) * 8) / data.length;

  return (
    <View style={styles.barsRow}>
      {data.map((item, i) => {
        const height = Math.round((item.count / maxCount) * CHART_MAX_H);
        const isToday = i === data.length - 1; // Assuming last item is today

        return (
          <View key={i} style={[styles.barCol, { width: barWidth }]}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(height, 5),
                  backgroundColor: isToday ? PURPLE : '#DCD9FF'
                }
              ]}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
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
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  const fetchAnalytics = async (showLoader = true) => {
    const res = await GetAnalyticsApi(showLoader ? setLoading : () => { });
    if (res) {
      setData(res);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchAnalytics();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalytics(false);
  }, []);

  if (loading && !data) {
    return (
      <View style={styles.loaderContainer}>
        <CustomLoader message="Loading your progress..." />
      </View>
    );
  }

  const stats = data?.top_stats;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PURPLE]} />
        }
        style={{ marginBottom: 55 }}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Analytics</Text>
        <Text style={styles.pageSub}>Track your learning progress</Text>

        {/* Stats Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statRow}>
            <StatCard
              label="Total Questions"
              value={stats?.total_questions ?? '0'}
              color={PURPLE}
              bg="#EEF2FF"
            />
            <View style={{ width: 12 }} />
            <StatCard
              label="Accuracy"
              value={stats?.accuracy ?? '0%'}
              color={GREEN}
              bg="#ECFDF5"
            />
          </View>

          <View style={[styles.statRow, { marginTop: 12 }]}>
            <StatCard
              label="Avg Time"
              value={stats?.avg_time ?? '0s'}
              color={GREEN}
              bg="#ECFDF5"
            />
            <View style={{ width: 12 }} />
            <StatCard
              label="Streak"
              value={stats?.streak ?? '0 days'}
              color={PURPLE}
              bg="#EEF2FF"
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          {data?.weekly_progress && data.weekly_progress.length > 0 ? (
            <BarChart data={data.weekly_progress} />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>No activity data available for this week</Text>
            </View>
          )}
        </View>

        {/* Strengths */}
        {data?.strengths && data.strengths.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {data.strengths.map((item: any, index: number) => (
              <ProgressRow
                key={index}
                name={item.topic || item.name}
                pct={item.percentage || item.pct}
                color={GREEN}
              />
            ))}
          </View>
        )}

        {/* Areas to Improve */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Areas to Improve
        </Text>
        {data?.areas_to_improve && data.areas_to_improve.length > 0 ? (
          data.areas_to_improve.map((item: any, index: number) => (
            <ProgressRow
              key={index}
              name={item.topic || item.name}
              pct={item.percentage || item.pct}
              color={RED}
            />
          ))
        ) : (
          <View style={styles.emptyItems}>
            <Text style={styles.emptyText}>Keep practicing to identify areas for improvement!</Text>
          </View>
        )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statGrid: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
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
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: '#4D38A2',
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_MAX_H + 30,
    justifyContent: 'space-between',
  },
  barCol: {
    alignItems: 'center',
  },
  bar: {
    width: 14,
    borderRadius: 7,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  progItem: {
    marginBottom: 18,
  },
  progHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  progVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  progTrack: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 5,
  },
  emptyChart: {
    height: CHART_MAX_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyItems: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});