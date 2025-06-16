import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type WorkoutDetailsScreenRouteProp = RouteProp<WorkoutStackParamList, 'WorkoutDetailsScreen'>;
type WorkoutDetailsScreenNavigationProp = StackNavigationProp<WorkoutStackParamList, 'WorkoutDetailsScreen'>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: number;
  restTime: number;
  instructions: string[];
  targetMuscles: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface WorkoutDetails {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  exercises: Exercise[];
  equipment: string[];
  calories: number;
  instructions: string[];
}

const WorkoutDetailsScreen: React.FC = () => {
  const navigation = useNavigation<WorkoutDetailsScreenNavigationProp>();
  const route = useRoute<WorkoutDetailsScreenRouteProp>();
  const { workoutId } = route.params;

  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadWorkoutDetails();
  }, [workoutId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isResting) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isResting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const loadWorkoutDetails = async () => {
    try {
      // Mock workout details based on workoutId
      const mockWorkout: WorkoutDetails = {
        id: workoutId,
        name: 'Full Body Strength',
        description: 'Complete full body workout targeting all major muscle groups',
        duration: 45,
        difficulty: 'Intermediate',
        category: 'Strength',
        calories: 350,
        equipment: ['Dumbbells', 'Barbell', 'Bench'],
        instructions: [
          'Warm up for 5-10 minutes with light cardio',
          'Follow the exercise order as presented',
          'Rest 60-90 seconds between sets',
          'Focus on proper form over heavy weight',
          'Cool down with 5 minutes of stretching',
        ],
        exercises: [
          {
            id: '1',
            name: 'Barbell Squat',
            description: 'Compound movement targeting legs and glutes',
            sets: 3,
            reps: '8-12',
            weight: '60-80kg',
            restTime: 90,
            instructions: [
              'Stand with feet shoulder-width apart',
              'Hold barbell on your upper back',
              'Lower down as if sitting back into a chair',
              'Keep chest up and knees tracking over toes',
              'Drive through heels to return to starting position',
            ],
            targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
            difficulty: 'Medium',
          },
          {
            id: '2',
            name: 'Bench Press',
            description: 'Upper body pushing movement',
            sets: 3,
            reps: '6-10',
            weight: '70-90kg',
            restTime: 120,
            instructions: [
              'Lie flat on bench with feet on floor',
              'Grip barbell slightly wider than shoulder-width',
              'Lower bar to chest with control',
              'Press bar up explosively',
              'Keep core tight throughout movement',
            ],
            targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
            difficulty: 'Medium',
          },
          {
            id: '3',
            name: 'Bent-Over Row',
            description: 'Back and bicep strengthening exercise',
            sets: 3,
            reps: '8-12',
            weight: '50-70kg',
            restTime: 90,
            instructions: [
              'Hinge at hips with slight knee bend',
              'Hold barbell with overhand grip',
              'Pull bar to lower chest',
              'Squeeze shoulder blades together',
              'Lower with control',
            ],
            targetMuscles: ['Lats', 'Rhomboids', 'Biceps'],
            difficulty: 'Medium',
          },
          {
            id: '4',
            name: 'Overhead Press',
            description: 'Shoulder and core strengthening',
            sets: 3,
            reps: '6-10',
            weight: '40-60kg',
            restTime: 90,
            instructions: [
              'Stand with feet hip-width apart',
              'Hold barbell at shoulder height',
              'Press bar straight overhead',
              'Keep core engaged',
              'Lower with control',
            ],
            targetMuscles: ['Shoulders', 'Triceps', 'Core'],
            difficulty: 'Hard',
          },
          {
            id: '5',
            name: 'Deadlift',
            description: 'Full body strength movement',
            sets: 3,
            reps: '5-8',
            weight: '80-120kg',
            restTime: 120,
            instructions: [
              'Stand with feet hip-width apart',
              'Grip barbell with hands just outside legs',
              'Keep back straight and chest up',
              'Drive through heels to lift bar',
              'Stand tall and squeeze glutes',
            ],
            targetMuscles: ['Hamstrings', 'Glutes', 'Back', 'Traps'],
            difficulty: 'Hard',
          },
        ],
      };

      setWorkoutDetails(mockWorkout);
    } catch (error) {
      console.error('Error loading workout details:', error);
      Alert.alert('Error', 'Failed to load workout details');
    }
  };

  const startWorkout = () => {
    setIsStarted(true);
    setTimer(0);
    setCurrentExerciseIndex(0);
    setCompletedSets({});
  };

  const completeSet = (exerciseId: string) => {
    setCompletedSets((prev) => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1,
    }));

    const currentExercise = workoutDetails?.exercises[currentExerciseIndex];
    if (currentExercise) {
      setIsResting(true);
      setRestTimer(currentExercise.restTime);
    }
  };

  const nextExercise = () => {
    if (workoutDetails && currentExerciseIndex < workoutDetails.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      finishWorkout();
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const finishWorkout = () => {
    Alert.alert(
      'Workout Complete!',
      `Great job! You completed the workout in ${formatTime(timer)}.`,
      [
        {
          text: 'Save & Exit',
          onPress: () => {
            // Save workout to history
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return colors.success;
      case 'Medium':
        return colors.warning;
      case 'Hard':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderExerciseCard = (exercise: Exercise, index: number) => {
    const isActive = isStarted && index === currentExerciseIndex;
    const completed = completedSets[exercise.id] || 0;

    return (
      <View
        key={exercise.id}
        style={[
          styles.exerciseCard,
          isActive && styles.activeExerciseCard,
        ]}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseNumber}>{index + 1}</Text>
            <View style={styles.exerciseTitleContainer}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
            <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
          </View>
        </View>

        <View style={styles.exerciseDetails}>
          <View style={styles.exerciseStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Sets</Text>
              <Text style={styles.statValue}>
                {completed}/{exercise.sets}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reps</Text>
              <Text style={styles.statValue}>{exercise.reps}</Text>
            </View>
            {exercise.weight && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>{exercise.weight}</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rest</Text>
              <Text style={styles.statValue}>{exercise.restTime}s</Text>
            </View>
          </View>

          <View style={styles.targetMuscles}>
            <Text style={styles.musclesLabel}>Target Muscles:</Text>
            <View style={styles.musclesList}>
              {exercise.targetMuscles.map((muscle, idx) => (
                <View key={idx} style={styles.muscleChip}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>

          {isActive && (
            <View style={styles.exerciseActions}>
              <TouchableOpacity
                style={styles.instructionsButton}
                onPress={() => setShowInstructionsModal(true)}
              >
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={styles.instructionsButtonText}>Instructions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeSetButton}
                onPress={() => completeSet(exercise.id)}
                disabled={completed >= exercise.sets}
              >
                <Text style={styles.completeSetButtonText}>
                  {completed >= exercise.sets ? 'Completed' : 'Complete Set'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderInstructionsModal = () => {
    const currentExercise = workoutDetails?.exercises[currentExerciseIndex];
    if (!currentExercise) return null;

    return (
      <Modal
        visible={showInstructionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowInstructionsModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{currentExercise.name}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {currentExercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  if (!workoutDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{workoutDetails.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Workout Timer Bar */}
      {isStarted && (
        <View style={styles.timerBar}>
          <View style={styles.timerInfo}>
            <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
            <Text style={styles.exerciseProgress}>
              Exercise {currentExerciseIndex + 1} of {workoutDetails.exercises.length}
            </Text>
          </View>
          {isResting && (
            <View style={styles.restIndicator}>
              <Text style={styles.restText}>Rest: {restTimer}s</Text>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Overview */}
        {!isStarted && (
          <View style={styles.overviewCard}>
            <Text style={styles.workoutName}>{workoutDetails.name}</Text>
            <Text style={styles.workoutDescription}>{workoutDetails.description}</Text>

            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{workoutDetails.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="fitness" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{workoutDetails.exercises.length} exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={16} color={colors.textSecondary} />
                <Text style={styles.statText}>{workoutDetails.calories} cal</Text>
              </View>
            </View>

            <View style={styles.equipmentSection}>
              <Text style={styles.equipmentTitle}>Equipment needed:</Text>
              <View style={styles.equipmentList}>
                {workoutDetails.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentChip}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
              <Ionicons name="play" size={20} color={colors.white} />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Exercise Navigation */}
        {isStarted && (
          <View style={styles.navigationBar}>
            <TouchableOpacity
              style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
              onPress={previousExercise}
              disabled={currentExerciseIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={nextExercise}
            >
              <Text style={styles.navButtonText}>
                {currentExerciseIndex === workoutDetails.exercises.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Exercises List */}
        <View style={styles.exercisesList}>
          {workoutDetails.exercises.map((exercise, index) => 
            renderExerciseCard(exercise, index)
          )}
        </View>
      </ScrollView>

      {renderInstructionsModal()}
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  timerBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerInfo: {
    flex: 1,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  exerciseProgress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  restIndicator: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  restText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  workoutDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
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
  equipmentSection: {
    marginBottom: spacing.lg,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentChip: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  equipmentText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginLeft: spacing.sm,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginHorizontal: spacing.xs,
  },
  exercisesList: {
    gap: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeExerciseCard: {
    borderColor: colors.primary,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  exerciseInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: spacing.sm,
    minWidth: 24,
  },
  exerciseTitleContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
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
  exerciseDetails: {
    gap: spacing.sm,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  targetMuscles: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
  },
  musclesLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleChip: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: 4,
  },
  muscleText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '500',
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  instructionsButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  completeSetButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  completeSetButtonText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: spacing.sm,
    minWidth: 24,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default WorkoutDetailsScreen; 