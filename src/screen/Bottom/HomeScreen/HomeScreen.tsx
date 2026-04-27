import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import imageIndex from '../../../assets/imageIndex';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { GetAuthProfileApi, GetQuizzesApi, Quiz, GetAnalyticsApi, AnalyticsResponse, GetCombinedStatsApi, CombinedStatsResponse } from '../../../Api/apiRequest';
import CustomLoader from '../../../compoent/CustomLoader';
import { updateUserData } from '../../../redux/feature/authSlice';

const getDifficultyStyles = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'easy':
      return { bg: '#f0fdf4', color: '#22c55e' };
    case 'medium':
      return { bg: '#ecfdf5', color: '#10b981' };
    case 'hard':
      return { bg: '#fff7ed', color: '#f97316' };
    default:
      return { bg: '#f3f4f6', color: '#6b7280' };
  }
};

// Moved dynamic stats to component state

const navItems = [
  { label: 'Home', icon: '🏠', active: true },
  { label: 'Practice', icon: '📖', active: false },
  { label: 'Stats', icon: '📊', active: false },
  { label: 'Profile', icon: '👤', active: false },
];

const HomeScreen = () => {
  const na = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth.userData);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [combinedStats, setCombinedStats] = useState<CombinedStatsResponse | null>(null);

  useEffect(() => {
    if (isFocused) {
      fetchQuizzes();
      fetchUserProfile();
      fetchAnalytics();
      fetchCombinedStats();
    }
  }, [isFocused]);

  const fetchUserProfile = async () => {
    const res = await GetAuthProfileApi(() => { });
    if (res && res.profile) {
      console.log('--- Profile Fetched in Home (Success) ---', res.profile);
      dispatch(updateUserData(res.profile));
    } else if (res) {
      console.log('--- Profile Fetched in Home (No profile prop) ---', res);
      dispatch(updateUserData(res));
    }
  };

  const fetchQuizzes = async () => {
    const res = await GetQuizzesApi(setLoading);
    if (res && res.quizzes) {
      // Pick first 5 for recommendations
      setQuizzes(res.quizzes.slice(0, 7));
    }
  };

  const fetchAnalytics = async () => {
    const res = await GetAnalyticsApi(() => { }); // Don't block UI with loader here
    if (res) {
      setAnalytics(res);
    }
  };

  const fetchCombinedStats = async () => {
    const res = await GetCombinedStatsApi(() => { });
    if (res) {
      setCombinedStats(res);
    }
  };

  const overall = combinedStats?.overall;
  const progressPercent = overall ? (overall.played / overall.total) : 0;
  const progressPercentLabel = overall ? `${overall.played}/${overall.total}` : '0/0';

  const performanceStats = [
    {
      id: 1,
      label: 'Accuracy',
      value: analytics?.top_stats?.accuracy || '0%',
      icon: imageIndex.Accuracy,
    },
    {
      id: 2,
      label: 'Attempted',
      value: analytics?.top_stats?.total_questions || '0',
      icon: imageIndex.Questions,
    },
    {
      id: 3,
      label: 'Weak Area',
      value: analytics?.areas_to_improve?.[0]?.topic || analytics?.top_stats?.streak || 'None',
      icon: imageIndex.time,
    },
  ];
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container,]}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hi {userData?.name || 'User'} 👋</Text>
              <Text style={styles.subText}>Ready to practice today?</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity  >
                <Image source={imageIndex.Notification}
                  style={{
                    height: 44,
                    width: 44,
                  }}
                />
              </TouchableOpacity>
              <Image
                source={userData?.profile_photo ? { uri: userData.profile_photo } : imageIndex.prfile}
                style={styles.avatar}
              />
            </View>
          </View>
        </View>

        {/* PROGRESS CARD */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPercent}>{progressPercentLabel}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
          </View>
          <Text style={styles.continueLearning}>Continue Practicing</Text>
          <Text style={styles.sectionTitle}>
            {overall?.remaining ?? 0} Questions Remaining
          </Text>
          <TouchableOpacity style={styles.resumeBtn}
            onPress={() => na.navigate(ScreenNameEnum.Questions)}
          >
            <Text style={styles.resumeBtnIcon}>▶  </Text>
            <Text style={styles.btnText}>Resume Practice</Text>
          </TouchableOpacity>
        </View>

        {/* RECOMMENDED QUESTIONS */}
        <Text style={styles.heading}>Recommended Questions</Text>
        {loading ? (
          <View style={{ height: 180, justifyContent: 'center' }}>
            <CustomLoader message="Finding best questions for you..." />
          </View>
        ) : quizzes.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {quizzes.map((item) => {
              const styles_diff = getDifficultyStyles(item.level);
              return (
                <View key={item.quiz_id} style={styles.questionCard}>
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={imageIndex.CardImage}
                      style={styles.cardImg}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={[styles.difficultyPill, { backgroundColor: styles_diff.bg }]}>
                      <Text style={[styles.difficultyText, { color: styles_diff.color }]}>
                        {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                      </Text>
                    </View>

                    <Text style={styles.qTitle} numberOfLines={1}>{item.quiz_name}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Image source={imageIndex.Questions} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{item.total_questions} questions</Text>
                      </View>
                      {/* <View style={styles.metaItem}>
                        <Image source={imageIndex.time} style={styles.metaIcon} />
                        <Text style={styles.metaText}>15 mins</Text>
                      </View> */}
                    </View>

                    <TouchableOpacity style={styles.startBtn}
                      onPress={() => {
                        na.navigate(ScreenNameEnum.QuestionBank, { quiz_id: item.quiz_id })
                      }}
                    >
                      <Image source={imageIndex.Next} style={styles.playIcon} />
                      <Text style={styles.startBtnText}>Start</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recommended questions yet.</Text>
          </View>
        )}

        {/* PERFORMANCE SNAPSHOT */}
        <Text style={styles.heading}>Performance Snapshot</Text>
        <View style={styles.statsRow}>
          {performanceStats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <Image source={stat.icon}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: PURPLE,
                }}
              />
              <Text style={styles.statLabel}>{stat.label}</Text>

              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
            {item.active && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const PURPLE = '#7625FE';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  // HEADER
  header: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 160
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 13
  },
  greeting: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subText: {
    color: 'white',
    fontSize: 15,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 16,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'white',
  },

  // PROGRESS CARD
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -44,
    padding: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "gray",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },

  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: 'black',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: "#FCAA17",
  },
  progressBar: {
    height: 7,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: "#5DCF00",
    borderRadius: 10,
  },
  continueLearning: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 15,
  },
  resumeBtn: {
    backgroundColor: PURPLE,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resumeBtnIcon: {
    color: '#fff',
    fontSize: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // RECOMMENDED
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 12,
  },
  questionCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 15,
    paddingBottom: 16,
    // Premium Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,

    marginTop: 40, // Space for overlapping image
    borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderColor: "#ccc",
  },
  cardImageContainer: {
    alignItems: 'center',
    marginTop: -45, // Pull image up
    height: 120,
    justifyContent: 'center',
  },
  cardImg: {
    width: 140,
    height: 140,
  },
  cardContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  difficultyPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  qTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D2D50',
    marginBottom: 10,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    width: 14,
    height: 14,
    tintColor: '#9E9EBC',
  },
  metaText: {
    fontSize: 12,
    color: '#9E9EBC',
    fontWeight: '500',
  },
  startBtn: {
    backgroundColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  playIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
  },

  // PERFORMANCE
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 8,
    shadowColor: "gray",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#291069',
    marginTop: 11
  },
  statLabel: {
    fontSize: 15,
    color: '#4D38A2',
    marginTop: 10,
    textAlign: 'center',
  },

  // BOTTOM NAV
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: '#bbb',
    fontWeight: '500',
  },
  navLabelActive: {
    color: PURPLE,
    fontWeight: '600',
  },
  navDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: PURPLE,
    marginTop: 2,
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});