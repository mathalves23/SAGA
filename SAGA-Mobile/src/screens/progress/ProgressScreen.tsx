import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - spacing.md * 2;

interface ProgressData {
  weight: { labels: string[]; datasets: Array<{ data: number[] }> };
  workouts: { labels: string[]; datasets: Array<{ data: number[] }> };
  bodyFat: number[];
  muscle: number[];
  achievements: Achievement[];
  goals: Goal[];
  streaks: StreakData;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  category: 'workout' | 'weight' | 'streak' | 'goal';
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'weight' | 'workout' | 'strength';
}

interface StreakData {
  current: number;
  longest: number;
  thisWeek: number;
  thisMonth: number;
}

const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'goals' | 'achievements'>('overview');
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      // Load progress data from AsyncStorage or API
      const mockData: ProgressData = {
        weight: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{ data: [80, 78.5, 77, 76.2, 75.8, 75.1] }],
        },
        workouts: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data: [2, 1, 3, 2, 4, 1, 2] }],
        },
        bodyFat: [22, 21, 20.5, 19.8, 19.2],
        muscle: [35, 35.5, 36, 36.8, 37.2],
        achievements: [
          {
            id: '1',
            title: '30-Day Streak',
            description: 'Completed workouts for 30 consecutive days',
            icon: 'flame',
            date: '2024-01-15',
            category: 'streak',
          },
          {
            id: '2',
            title: 'Weight Goal Achieved',
            description: 'Reached target weight of 75kg',
            icon: 'trophy',
            date: '2024-01-10',
            category: 'weight',
          },
          {
            id: '3',
            title: '100 Workouts',
            description: 'Completed 100 total workouts',
            icon: 'fitness',
            date: '2024-01-05',
            category: 'workout',
          },
        ],
        goals: [
          {
            id: '1',
            title: 'Lose 10kg',
            target: 10,
            current: 8.5,
            unit: 'kg',
            deadline: '2024-03-01',
            category: 'weight',
          },
          {
            id: '2',
            title: '100 Push-ups',
            target: 100,
            current: 75,
            unit: 'reps',
            deadline: '2024-02-15',
            category: 'strength',
          },
          {
            id: '3',
            title: '5 Workouts/Week',
            target: 5,
            current: 4,
            unit: 'workouts',
            deadline: 'Weekly',
            category: 'workout',
          },
        ],
        streaks: {
          current: 15,
          longest: 32,
          thisWeek: 5,
          thisMonth: 18,
        },
      };

      setProgressData(mockData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgressData();
    setRefreshing(false);
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{progressData?.streaks.current}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="fitness" size={24} color={colors.success} />
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-down" size={24} color={colors.warning} />
          <Text style={styles.statValue}>8.5kg</Text>
          <Text style={styles.statLabel}>Weight Lost</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color={colors.error} />
          <Text style={styles.statValue}>127h</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weeklyProgress}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <View key={day} style={styles.dayProgress}>
              <View
                style={[
                  styles.dayDot,
                  index < 5 ? styles.dayDotCompleted : styles.dayDotPending,
                ]}
              />
              <Text style={styles.dayLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {progressData?.achievements.slice(0, 3).map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name={achievement.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCharts = () => (
    <View style={styles.chartsContainer}>
      {/* Time Frame Selector */}
      <View style={styles.timeFrameSelector}>
        {(['week', 'month', 'year'] as const).map((frame) => (
          <TouchableOpacity
            key={frame}
            style={[
              styles.timeFrameButton,
              timeFrame === frame && styles.timeFrameButtonActive,
            ]}
            onPress={() => setTimeFrame(frame)}
          >
            <Text
              style={[
                styles.timeFrameText,
                timeFrame === frame && styles.timeFrameTextActive,
              ]}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weight Progress Chart */}
      {progressData && (
        <>
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Weight Progress</Text>
            <LineChart
              data={progressData.weight}
              width={chartWidth}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          {/* Workout Frequency Chart */}
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Workout Frequency</Text>
            <BarChart
              data={progressData.workouts}
              width={chartWidth}
              height={200}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </View>

          {/* Body Composition */}
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Body Composition</Text>
            <View style={styles.bodyComposition}>
              <View style={styles.bodyMetric}>
                <Text style={styles.bodyMetricValue}>19.2%</Text>
                <Text style={styles.bodyMetricLabel}>Body Fat</Text>
              </View>
              <View style={styles.bodyMetric}>
                <Text style={styles.bodyMetricValue}>37.2kg</Text>
                <Text style={styles.bodyMetricLabel}>Muscle Mass</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderGoals = () => (
    <View style={styles.goalsContainer}>
      <Text style={styles.sectionTitle}>Active Goals</Text>
      {progressData?.goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDeadline}>{goal.deadline}</Text>
          </View>
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  { width: `${(goal.current / goal.target) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.goalProgressText}>
              {goal.current}/{goal.target} {goal.unit}
            </Text>
          </View>
          <Text style={styles.goalPercentage}>
            {Math.round((goal.current / goal.target) * 100)}% Complete
          </Text>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <Text style={styles.sectionTitle}>All Achievements</Text>
      {progressData?.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.fullAchievementCard}>
          <View style={styles.achievementIcon}>
            <Ionicons name={achievement.icon as any} size={24} color={colors.primary} />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.achievementMeta}>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(achievement.category) }]}>
                <Text style={styles.categoryText}>{achievement.category}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workout':
        return colors.primary;
      case 'weight':
        return colors.success;
      case 'streak':
        return colors.warning;
      case 'goal':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'charts':
        return renderCharts();
      case 'goals':
        return renderGoals();
      case 'achievements':
        return renderAchievements();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'stats-chart' },
          { key: 'charts', label: 'Charts', icon: 'bar-chart' },
          { key: 'goals', label: 'Goals', icon: 'target' },
          { key: 'achievements', label: 'Awards', icon: 'trophy' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.key ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  tabActive: {
    backgroundColor: colors.surface,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  overviewContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  dayProgress: {
    alignItems: 'center',
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  dayDotCompleted: {
    backgroundColor: colors.success,
  },
  dayDotPending: {
    backgroundColor: colors.textSecondary,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartsContainer: {
    flex: 1,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.lg,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeFrameButtonActive: {
    backgroundColor: colors.primary,
  },
  timeFrameText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeFrameTextActive: {
    color: colors.white,
  },
  chartSection: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: 16,
  },
  bodyComposition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
  },
  bodyMetric: {
    alignItems: 'center',
  },
  bodyMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  bodyMetricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  goalsContainer: {
    flex: 1,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  goalDeadline: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 60,
    textAlign: 'right',
  },
  goalPercentage: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  achievementsContainer: {
    flex: 1,
  },
  fullAchievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  achievementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
});

export default ProgressScreen; 