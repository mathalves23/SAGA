import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ExerciseStackParamList } from '../../navigation/types';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const { width: screenWidth } = Dimensions.get('window');

type ExerciseDetailsScreenRouteProp = RouteProp<ExerciseStackParamList, 'ExerciseDetailsScreen'>;
type ExerciseDetailsScreenNavigationProp = StackNavigationProp<ExerciseStackParamList, 'ExerciseDetailsScreen'>;

interface ExerciseDetails {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  type: 'Strength' | 'Cardio' | 'Flexibility' | 'Plyometrics';
  images: string[];
  tips: string[];
  variations: ExerciseVariation[];
  commonMistakes: string[];
  safetyNotes: string[];
}

interface ExerciseVariation {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easier' | 'Harder';
}

const ExerciseDetailsScreen: React.FC = () => {
  const navigation = useNavigation<ExerciseDetailsScreenNavigationProp>();
  const route = useRoute<ExerciseDetailsScreenRouteProp>();
  const { exerciseId } = route.params;

  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetails | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'instructions' | 'tips' | 'variations' | 'safety'>('instructions');

  useEffect(() => {
    loadExerciseDetails();
  }, [exerciseId]);

  const loadExerciseDetails = async () => {
    try {
      // Mock exercise details based on exerciseId
      const mockExercise: ExerciseDetails = {
        id: exerciseId,
        name: 'Barbell Squat',
        description: 'The barbell squat is a compound movement that targets multiple muscle groups, primarily the quadriceps, glutes, and hamstrings. It\'s one of the most effective exercises for building lower body strength and mass.',
        instructions: [
          'Position the barbell on your upper back, resting on your trapezius muscles',
          'Stand with feet shoulder-width apart, toes slightly pointed outward',
          'Engage your core and maintain a neutral spine throughout the movement',
          'Initiate the movement by pushing your hips back and bending your knees',
          'Lower down as if sitting back into a chair until thighs are parallel to the floor',
          'Keep your chest up and knees tracking in line with your toes',
          'Drive through your heels to push the floor away and return to starting position',
          'Fully extend your hips and knees at the top of the movement',
        ],
        primaryMuscles: ['Quadriceps', 'Glutes'],
        secondaryMuscles: ['Hamstrings', 'Calves', 'Core', 'Lower Back'],
        equipment: ['Barbell', 'Squat Rack', 'Weight Plates'],
        difficulty: 'Intermediate',
        category: 'Compound',
        type: 'Strength',
        images: [
          'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Squat+Start',
          'https://via.placeholder.com/400x300/007AFF/FFFFFF?text=Squat+Bottom',
        ],
        tips: [
          'Start with bodyweight squats to master the movement pattern',
          'Focus on mobility and flexibility before adding weight',
          'Keep your weight balanced across your whole foot',
          'Breathe in on the way down, exhale on the way up',
          'Progress gradually by adding weight or reps',
          'Use a mirror to check your form from the side',
          'Consider using a box or bench to practice depth',
        ],
        variations: [
          {
            id: '1',
            name: 'Goblet Squat',
            description: 'Hold a dumbbell or kettlebell at chest level. Great for beginners to learn proper squat mechanics.',
            difficulty: 'Easier',
          },
          {
            id: '2',
            name: 'Bodyweight Squat',
            description: 'Perform the squat movement without any external weight. Perfect for mastering form.',
            difficulty: 'Easier',
          },
          {
            id: '3',
            name: 'Front Squat',
            description: 'Hold the barbell in front of your body at shoulder level. Emphasizes quadriceps and core.',
            difficulty: 'Harder',
          },
          {
            id: '4',
            name: 'Overhead Squat',
            description: 'Hold weight overhead throughout the movement. Requires excellent mobility and stability.',
            difficulty: 'Harder',
          },
          {
            id: '5',
            name: 'Bulgarian Split Squat',
            description: 'Single-leg squat variation with rear foot elevated. Challenges balance and unilateral strength.',
            difficulty: 'Harder',
          },
        ],
        commonMistakes: [
          'Knees caving inward (valgus collapse)',
          'Not reaching proper depth',
          'Leaning too far forward',
          'Rising on toes instead of staying flat-footed',
          'Rounding the lower back',
          'Looking up or down instead of straight ahead',
        ],
        safetyNotes: [
          'Always warm up thoroughly before squatting with weight',
          'Use a spotter or safety bars when lifting heavy',
          'Stop immediately if you feel pain in your knees or back',
          'Start with lighter weights and focus on perfect form',
          'Consider working with a qualified trainer initially',
          'Listen to your body and don\'t ego lift',
        ],
      };

      setExerciseDetails(mockExercise);
    } catch (error) {
      console.error('Error loading exercise details:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
      case 'Easier':
        return colors.success;
      case 'Intermediate':
        return colors.warning;
      case 'Advanced':
      case 'Harder':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderImageCarousel = () => {
    if (!exerciseDetails?.images.length) return null;

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentImageIndex(index);
          }}
        >
          {exerciseDetails.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {exerciseDetails.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {exerciseDetails.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderMuscleGroups = () => (
    <View style={styles.muscleSection}>
      <Text style={styles.sectionTitle}>Target Muscles</Text>
      
      <View style={styles.muscleGroup}>
        <Text style={styles.muscleGroupTitle}>Primary</Text>
        <View style={styles.musclesList}>
          {exerciseDetails?.primaryMuscles.map((muscle, index) => (
            <View key={index} style={[styles.muscleChip, styles.primaryMuscleChip]}>
              <Text style={styles.primaryMuscleText}>{muscle}</Text>
            </View>
          ))}
        </View>
      </View>

      {exerciseDetails?.secondaryMuscles && exerciseDetails.secondaryMuscles.length > 0 && (
        <View style={styles.muscleGroup}>
          <Text style={styles.muscleGroupTitle}>Secondary</Text>
          <View style={styles.musclesList}>
            {exerciseDetails.secondaryMuscles.map((muscle, index) => (
              <View key={index} style={[styles.muscleChip, styles.secondaryMuscleChip]}>
                <Text style={styles.secondaryMuscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'instructions':
        return (
          <View style={styles.tabContent}>
            {exerciseDetails?.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        );

      case 'tips':
        return (
          <View style={styles.tabContent}>
            {exerciseDetails?.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="bulb" size={16} color={colors.warning} style={styles.tipIcon} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        );

      case 'variations':
        return (
          <View style={styles.tabContent}>
            {exerciseDetails?.variations.map((variation) => (
              <View key={variation.id} style={styles.variationItem}>
                <View style={styles.variationHeader}>
                  <Text style={styles.variationName}>{variation.name}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(variation.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{variation.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.variationDescription}>{variation.description}</Text>
              </View>
            ))}
          </View>
        );

      case 'safety':
        return (
          <View style={styles.tabContent}>
            <View style={styles.safetySection}>
              <Text style={styles.safetyTitle}>Common Mistakes</Text>
              {exerciseDetails?.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.safetyItem}>
                  <Ionicons name="warning" size={16} color={colors.error} style={styles.safetyIcon} />
                  <Text style={styles.safetyText}>{mistake}</Text>
                </View>
              ))}
            </View>

            <View style={styles.safetySection}>
              <Text style={styles.safetyTitle}>Safety Notes</Text>
              {exerciseDetails?.safetyNotes.map((note, index) => (
                <View key={index} style={styles.safetyItem}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.success} style={styles.safetyIcon} />
                  <Text style={styles.safetyText}>{note}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (!exerciseDetails) {
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
        <Text style={styles.title} numberOfLines={1}>{exerciseDetails.name}</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise Images */}
        {renderImageCarousel()}

        {/* Exercise Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View>
              <Text style={styles.exerciseName}>{exerciseDetails.name}</Text>
              <Text style={styles.exerciseCategory}>{exerciseDetails.category} • {exerciseDetails.type}</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exerciseDetails.difficulty) }]}>
              <Text style={styles.difficultyText}>{exerciseDetails.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.exerciseDescription}>{exerciseDetails.description}</Text>

          {/* Equipment */}
          <View style={styles.equipmentSection}>
            <Text style={styles.equipmentTitle}>Equipment</Text>
            <View style={styles.equipmentList}>
              {exerciseDetails.equipment.map((item, index) => (
                <View key={index} style={styles.equipmentChip}>
                  <Ionicons name="fitness" size={14} color={colors.textSecondary} />
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Target Muscles */}
        {renderMuscleGroups()}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            {[
              { key: 'instructions', label: 'Steps', icon: 'list' },
              { key: 'tips', label: 'Tips', icon: 'bulb' },
              { key: 'variations', label: 'Variations', icon: 'swap-horizontal' },
              { key: 'safety', label: 'Safety', icon: 'shield-checkmark' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.activeTab,
                ]}
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
                    activeTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}
        </View>
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xl,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  exerciseImage: {
    width: screenWidth,
    height: 250,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: 16,
    padding: spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  exerciseCategory: {
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
  exerciseDescription: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  equipmentSection: {
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 4,
  },
  muscleSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  muscleGroup: {
    marginBottom: spacing.md,
  },
  muscleGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleChip: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  primaryMuscleChip: {
    backgroundColor: colors.primary,
  },
  secondaryMuscleChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryMuscleText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  secondaryMuscleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  tabContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.surface,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    padding: spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: spacing.sm,
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  variationItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  variationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  variationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  variationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  safetySection: {
    marginBottom: spacing.lg,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  safetyItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  safetyIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default ExerciseDetailsScreen; 