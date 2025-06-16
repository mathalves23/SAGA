import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NutritionData {
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  water: number;
  waterGoal: number;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

const NutritionScreen: React.FC = () => {
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = async () => {
    try {
      // Load from AsyncStorage or API
      const mockData: NutritionData = {
        dailyGoals: {
          calories: 2200,
          protein: 165,
          carbs: 275,
          fat: 73,
        },
        consumed: {
          calories: 1450,
          protein: 95,
          carbs: 180,
          fat: 45,
        },
        meals: [
          {
            id: '1',
            name: 'Breakfast',
            type: 'breakfast',
            time: '08:30',
            foods: [
              {
                id: '1',
                name: 'Oatmeal with Berries',
                calories: 350,
                protein: 12,
                carbs: 65,
                fat: 8,
                quantity: 1,
                unit: 'bowl',
              },
              {
                id: '2',
                name: 'Greek Yogurt',
                calories: 150,
                protein: 20,
                carbs: 8,
                fat: 4,
                quantity: 200,
                unit: 'g',
              },
            ],
            totalCalories: 500,
            totalProtein: 32,
            totalCarbs: 73,
            totalFat: 12,
          },
          {
            id: '2',
            name: 'Lunch',
            type: 'lunch',
            time: '13:00',
            foods: [
              {
                id: '3',
                name: 'Grilled Chicken Salad',
                calories: 450,
                protein: 35,
                carbs: 25,
                fat: 18,
                quantity: 1,
                unit: 'serving',
              },
            ],
            totalCalories: 450,
            totalProtein: 35,
            totalCarbs: 25,
            totalFat: 18,
          },
          {
            id: '3',
            name: 'Snack',
            type: 'snack',
            time: '16:00',
            foods: [
              {
                id: '4',
                name: 'Protein Shake',
                calories: 250,
                protein: 28,
                carbs: 15,
                fat: 8,
                quantity: 1,
                unit: 'scoop',
              },
            ],
            totalCalories: 250,
            totalProtein: 28,
            totalCarbs: 15,
            totalFat: 8,
          },
          {
            id: '4',
            name: 'Dinner',
            type: 'dinner',
            time: '19:30',
            foods: [
              {
                id: '5',
                name: 'Salmon with Vegetables',
                calories: 400,
                protein: 30,
                carbs: 20,
                fat: 22,
                quantity: 1,
                unit: 'serving',
              },
            ],
            totalCalories: 400,
            totalProtein: 30,
            totalCarbs: 20,
            totalFat: 22,
          },
        ],
        water: 1.5,
        waterGoal: 2.5,
      };

      setNutritionData(mockData);
      setWaterIntake(mockData.water);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    }
  };

  const getMacroPercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

  const getCaloriesRemaining = () => {
    if (!nutritionData) return 0;
    return nutritionData.dailyGoals.calories - nutritionData.consumed.calories;
  };

  const addWaterIntake = (amount: number) => {
    const newWaterIntake = waterIntake + amount;
    setWaterIntake(newWaterIntake);
    // Save to AsyncStorage
    AsyncStorage.setItem('waterIntake', newWaterIntake.toString());
  };

  const renderMacroChart = () => {
    if (!nutritionData) return null;

    const data = [
      {
        name: 'Protein',
        population: nutritionData.consumed.protein * 4,
        color: colors.primary,
        legendFontColor: colors.textPrimary,
        legendFontSize: 12,
      },
      {
        name: 'Carbs',
        population: nutritionData.consumed.carbs * 4,
        color: colors.success,
        legendFontColor: colors.textPrimary,
        legendFontSize: 12,
      },
      {
        name: 'Fat',
        population: nutritionData.consumed.fat * 9,
        color: colors.warning,
        legendFontColor: colors.textPrimary,
        legendFontSize: 12,
      },
    ];

    return (
      <PieChart
        data={data}
        width={300}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderMealCard = (meal: Meal) => (
    <View key={meal.id} style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealTime}>{meal.time}</Text>
        </View>
        <View style={styles.mealStats}>
          <Text style={styles.mealCalories}>{meal.totalCalories} cal</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedMealType(meal.type);
              setShowAddFoodModal(true);
            }}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {meal.foods.map((food) => (
        <View key={food.id} style={styles.foodItem}>
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodQuantity}>
              {food.quantity} {food.unit}
            </Text>
          </View>
          <Text style={styles.foodCalories}>{food.calories} cal</Text>
        </View>
      ))}

      <View style={styles.mealMacros}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>P</Text>
          <Text style={styles.macroValue}>{meal.totalProtein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>C</Text>
          <Text style={styles.macroValue}>{meal.totalCarbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>F</Text>
          <Text style={styles.macroValue}>{meal.totalFat}g</Text>
        </View>
      </View>
    </View>
  );

  const renderWaterTracker = () => (
    <View style={styles.waterCard}>
      <View style={styles.waterHeader}>
        <View style={styles.waterInfo}>
          <Ionicons name="water" size={24} color={colors.primary} />
          <Text style={styles.waterTitle}>Water Intake</Text>
        </View>
        <Text style={styles.waterAmount}>
          {waterIntake.toFixed(1)}L / {nutritionData?.waterGoal}L
        </Text>
      </View>

      <View style={styles.waterProgress}>
        <View style={styles.waterProgressBar}>
          <View
            style={[
              styles.waterProgressFill,
              {
                width: `${nutritionData ? (waterIntake / nutritionData.waterGoal) * 100 : 0}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.waterButtons}>
        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => addWaterIntake(0.25)}
        >
          <Text style={styles.waterButtonText}>+250ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => addWaterIntake(0.5)}
        >
          <Text style={styles.waterButtonText}>+500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => addWaterIntake(1)}
        >
          <Text style={styles.waterButtonText}>+1L</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddFoodModal = () => (
    <Modal
      visible={showAddFoodModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddFoodModal(false)}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Food</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <ScrollView style={styles.foodList}>
          {/* Mock food database */}
          {[
            { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
            { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4 },
            { name: 'Brown Rice', calories: 110, protein: 3, carbs: 23, fat: 1 },
            { name: 'Broccoli', calories: 25, protein: 3, carbs: 5, fat: 0 },
            { name: 'Almonds', calories: 162, protein: 6, carbs: 6, fat: 14 },
          ]
            .filter((food) =>
              food.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((food, index) => (
              <TouchableOpacity
                key={index}
                style={styles.foodSearchItem}
                onPress={() => {
                  Alert.alert('Add Food', `${food.name} added to ${selectedMealType}`);
                  setShowAddFoodModal(false);
                }}
              >
                <View style={styles.foodSearchInfo}>
                  <Text style={styles.foodSearchName}>{food.name}</Text>
                  <Text style={styles.foodSearchMacros}>
                    {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                  </Text>
                </View>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (!nutritionData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <TouchableOpacity style={styles.statsButton}>
          <Ionicons name="stats-chart" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.caloriesSection}>
            <Text style={styles.caloriesRemaining}>
              {getCaloriesRemaining()} calories remaining
            </Text>
            <View style={styles.caloriesBreakdown}>
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesLabel}>Goal</Text>
                <Text style={styles.caloriesValue}>{nutritionData.dailyGoals.calories}</Text>
              </View>
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesLabel}>Consumed</Text>
                <Text style={styles.caloriesValue}>{nutritionData.consumed.calories}</Text>
              </View>
              <View style={styles.caloriesItem}>
                <Text style={styles.caloriesLabel}>Burned</Text>
                <Text style={styles.caloriesValue}>320</Text>
              </View>
            </View>
          </View>

          {/* Macro Progress */}
          <View style={styles.macrosSection}>
            <Text style={styles.macrosTitle}>Macronutrients</Text>
            <View style={styles.macrosList}>
              <View style={styles.macroProgress}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>Protein</Text>
                  <Text style={styles.macroAmount}>
                    {nutritionData.consumed.protein}g / {nutritionData.dailyGoals.protein}g
                  </Text>
                </View>
                <View style={styles.macroBar}>
                  <View
                    style={[
                      styles.macroBarFill,
                      {
                        width: `${getMacroPercentage(
                          nutritionData.consumed.protein,
                          nutritionData.dailyGoals.protein
                        )}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroProgress}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>Carbs</Text>
                  <Text style={styles.macroAmount}>
                    {nutritionData.consumed.carbs}g / {nutritionData.dailyGoals.carbs}g
                  </Text>
                </View>
                <View style={styles.macroBar}>
                  <View
                    style={[
                      styles.macroBarFill,
                      {
                        width: `${getMacroPercentage(
                          nutritionData.consumed.carbs,
                          nutritionData.dailyGoals.carbs
                        )}%`,
                        backgroundColor: colors.success,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroProgress}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>Fat</Text>
                  <Text style={styles.macroAmount}>
                    {nutritionData.consumed.fat}g / {nutritionData.dailyGoals.fat}g
                  </Text>
                </View>
                <View style={styles.macroBar}>
                  <View
                    style={[
                      styles.macroBarFill,
                      {
                        width: `${getMacroPercentage(
                          nutritionData.consumed.fat,
                          nutritionData.dailyGoals.fat
                        )}%`,
                        backgroundColor: colors.warning,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Water Tracker */}
        {renderWaterTracker()}

        {/* Meals */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {nutritionData.meals.map(renderMealCard)}
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddButtons}>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setSelectedMealType('breakfast');
                setShowAddFoodModal(true);
              }}
            >
              <Ionicons name="sunny" size={20} color={colors.warning} />
              <Text style={styles.quickAddText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setSelectedMealType('lunch');
                setShowAddFoodModal(true);
              }}
            >
              <Ionicons name="partly-sunny" size={20} color={colors.primary} />
              <Text style={styles.quickAddText}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setSelectedMealType('dinner');
                setShowAddFoodModal(true);
              }}
            >
              <Ionicons name="moon" size={20} color={colors.secondary} />
              <Text style={styles.quickAddText}>Dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setSelectedMealType('snack');
                setShowAddFoodModal(true);
              }}
            >
              <Ionicons name="nutrition" size={20} color={colors.success} />
              <Text style={styles.quickAddText}>Snack</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {renderAddFoodModal()}
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
  statsButton: {
    padding: spacing.sm,
    borderRadius: 25,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  caloriesSection: {
    marginBottom: spacing.md,
  },
  caloriesRemaining: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  caloriesBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  caloriesItem: {
    alignItems: 'center',
  },
  caloriesLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  macrosSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  macrosList: {
    gap: spacing.sm,
  },
  macroProgress: {
    marginBottom: spacing.xs,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  macroAmount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  macroBar: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  waterCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  waterAmount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  waterProgress: {
    marginBottom: spacing.md,
  },
  waterProgressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  waterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waterButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  waterButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  mealsSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mealTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mealStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  addButton: {
    padding: 4,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  foodQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  foodCalories: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  quickAddSection: {
    marginBottom: spacing.md,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickAddText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: spacing.xs,
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
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  foodList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  foodSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  foodSearchInfo: {
    flex: 1,
  },
  foodSearchName: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  foodSearchMacros: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default NutritionScreen; 