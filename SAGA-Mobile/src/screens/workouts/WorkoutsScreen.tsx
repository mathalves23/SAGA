import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { workoutService } from '../../services/workoutService';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkoutsScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'WorkoutsScreen'>;

interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  exercises: number;
  calories: number;
  equipment: string[];
  image?: string;
  isCustom?: boolean;
  lastPerformed?: string;
}

const WorkoutsScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutsScreenNavigationProp>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Strength', 'Cardio', 'Flexibility', 'HIIT', 'Yoga', 'Custom'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, searchQuery, selectedCategory, selectedDifficulty]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      // Load default workouts
      const defaultWorkouts: Workout[] = [
        {
          id: '1',
          name: 'Full Body Strength',
          description: 'Complete full body workout targeting all major muscle groups',
          duration: 45,
          difficulty: 'Intermediate',
          category: 'Strength',
          exercises: 8,
          calories: 350,
          equipment: ['Dumbbells', 'Barbell', 'Bench'],
        },
        {
          id: '2',
          name: 'HIIT Cardio Blast',
          description: 'High-intensity interval training for maximum fat burn',
          duration: 30,
          difficulty: 'Advanced',
          category: 'HIIT',
          exercises: 6,
          calories: 400,
          equipment: ['None'],
        },
        {
          id: '3',
          name: 'Morning Yoga Flow',
          description: 'Gentle yoga sequence perfect for starting your day',
          duration: 20,
          difficulty: 'Beginner',
          category: 'Yoga',
          exercises: 12,
          calories: 150,
          equipment: ['Yoga Mat'],
        },
        {
          id: '4',
          name: 'Push Day',
          description: 'Chest, shoulders, and triceps focused workout',
          duration: 60,
          difficulty: 'Intermediate',
          category: 'Strength',
          exercises: 10,
          calories: 300,
          equipment: ['Dumbbells', 'Barbell', 'Cable Machine'],
        },
        {
          id: '5',
          name: 'Cardio Runner',
          description: 'Running-based cardio workout with intervals',
          duration: 35,
          difficulty: 'Intermediate',
          category: 'Cardio',
          exercises: 5,
          calories: 320,
          equipment: ['Treadmill'],
        },
      ];

      // Load custom workouts from storage
      const customWorkouts = await AsyncStorage.getItem('customWorkouts');
      const parsedCustomWorkouts = customWorkouts ? JSON.parse(customWorkouts) : [];
      
      setWorkouts([...defaultWorkouts, ...parsedCustomWorkouts]);
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    if (searchQuery) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(workout => workout.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(workout => workout.difficulty === selectedDifficulty);
    }

    setFilteredWorkouts(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutDetailsScreen', { workoutId: workout.id });
  };

  const createCustomWorkout = () => {
    navigation.navigate('CreateWorkoutScreen');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.success;
      case 'Intermediate':
        return colors.warning;
      case 'Advanced':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderWorkoutCard = ({ item: workout }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(workout)}
      activeOpacity={0.8}
    >
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDescription} numberOfLines={2}>
            {workout.description}
          </Text>
        </View>
        {workout.isCustom && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>Custom</Text>
          </View>
        )}
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="fitness-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workout.exercises} exercises</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statText}>{workout.calories} cal</Text>
        </View>
      </View>

      <View style={styles.workoutFooter}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(workout.difficulty) }]}>
          <Text style={styles.difficultyText}>{workout.difficulty}</Text>
        </View>
        <Text style={styles.categoryText}>{workout.category}</Text>
      </View>

      {workout.lastPerformed && (
        <Text style={styles.lastPerformed}>
          Last performed: {workout.lastPerformed}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderFilterChip = (title: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.filterChip, selected && styles.filterChipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
        <TouchableOpacity style={styles.createButton} onPress={createCustomWorkout}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <Text style={styles.filterLabel}>Category:</Text>
        {categories.map((category) =>
          renderFilterChip(
            category,
            selectedCategory === category,
            () => setSelectedCategory(category)
          )
        )}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <Text style={styles.filterLabel}>Difficulty:</Text>
        {difficulties.map((difficulty) =>
          renderFilterChip(
            difficulty,
            selectedDifficulty === difficulty,
            () => setSelectedDifficulty(difficulty)
          )
        )}
      </ScrollView>

      <FlatList
        data={filteredWorkouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.workoutsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  createButton: {
    padding: spacing.sm,
    borderRadius: 25,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  workoutsList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  customBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  workoutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  lastPerformed: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});

export default WorkoutsScreen; 