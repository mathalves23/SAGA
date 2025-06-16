// Serviço de Nutrição Integrada - SAGA Fitness
export interface NutritionProfile {
  userId: string;
  age: number;
  weight: number;
  height: number;
  gender: 'masculino' | 'feminino';
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  goal: 'perda_peso' | 'manutencao' | 'ganho_peso' | 'ganho_muscular';
  restrictions: string[];
  preferences: string[];
  bmr: number;
  tdee: number;
  targetCalories: number;
}

export interface MacroTargets {
  protein: { grams: number; calories: number; percentage: number };
  carbs: { grams: number; calories: number; percentage: number };
  fats: { grams: number; calories: number; percentage: number };
  fiber: number;
  sugar: number;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  servingSize: string;
  servingWeight: number;
  barcode?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: FoodEntry[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  targetCalories: number;
  notes?: string;
}

export interface FoodEntry {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    water: number; // ml
  };
  targets: MacroTargets;
  adherence: {
    calories: number; // %
    protein: number; // %
    carbs: number; // %
    fats: number; // %
  };
  score: number; // 0-100
}

export interface NutritionRecommendation {
  type: 'meal' | 'supplement' | 'timing' | 'hydration';
  priority: 'baixa' | 'media' | 'alta';
  title: string;
  description: string;
  foods?: string[];
  timing?: string;
  reason: string;
}

export interface SupplementPlan {
  supplements: Supplement[];
  timing: SupplementTiming[];
  budget: number;
  effectiveness: number;
}

export interface Supplement {
  id: string;
  name: string;
  type: string;
  dosage: string;
  benefits: string[];
  timing: string[];
  cost: number;
  priority: 'essencial' | 'recomendado' | 'opcional';
}

export interface SupplementTiming {
  supplementId: string;
  time: string;
  withMeal: boolean;
  notes: string;
}

export interface MealPlan {
  id: string;
  name: string;
  duration: number; // dias
  goal: string;
  dailyPlans: DailyMealPlan[];
  shoppingList: ShoppingItem[];
  prepInstructions: string[];
}

export interface DailyMealPlan {
  day: number;
  meals: PlannedMeal[];
  totalCalories: number;
  macros: MacroTargets;
  prepTime: number;
}

export interface PlannedMeal {
  name: string;
  time: string;
  recipe?: Recipe;
  foods: FoodEntry[];
  prepTime: number;
  difficulty: 'facil' | 'medio' | 'dificil';
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  nutrition: any;
}

export interface Ingredient {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  estimated_cost: number;
}

class NutritionService {
  
  // Base de dados de alimentos (simulada)
  private readonly FOOD_DATABASE: Food[] = [
    {
      id: '1',
      name: 'Peito de Frango',
      category: 'Proteína',
      nutrition: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74
      },
      servingSize: '100g',
      servingWeight: 100
    },
    {
      id: '2',
      name: 'Arroz Integral',
      category: 'Carboidratos',
      nutrition: {
        calories: 123,
        protein: 2.6,
        carbs: 25,
        fats: 1,
        fiber: 1.8,
        sugar: 0.4,
        sodium: 1
      },
      servingSize: '100g cozido',
      servingWeight: 100
    },
    {
      id: '3',
      name: 'Batata Doce',
      category: 'Carboidratos',
      nutrition: {
        calories: 103,
        protein: 2,
        carbs: 24,
        fats: 0.1,
        fiber: 3.9,
        sugar: 6.8,
        sodium: 6
      },
      servingSize: '100g',
      servingWeight: 100
    },
    {
      id: '4',
      name: 'Aveia',
      category: 'Carboidratos',
      nutrition: {
        calories: 389,
        protein: 16.9,
        carbs: 66.3,
        fats: 6.9,
        fiber: 10.6,
        sugar: 0.99,
        sodium: 2
      },
      servingSize: '100g',
      servingWeight: 100
    },
    {
      id: '5',
      name: 'Ovo',
      category: 'Proteína',
      nutrition: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fats: 11,
        fiber: 0,
        sugar: 1.1,
        sodium: 124
      },
      servingSize: '100g (2 ovos)',
      servingWeight: 100
    },
    {
      id: '6',
      name: 'Banana',
      category: 'Frutas',
      nutrition: {
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fats: 0.3,
        fiber: 2.6,
        sugar: 12,
        sodium: 1
      },
      servingSize: '100g (1 média)',
      servingWeight: 100
    },
    {
      id: '7',
      name: 'Whey Protein',
      category: 'Suplementos',
      nutrition: {
        calories: 120,
        protein: 24,
        carbs: 3,
        fats: 1,
        fiber: 0,
        sugar: 2,
        sodium: 50
      },
      servingSize: '30g (1 scoop)',
      servingWeight: 30
    },
    {
      id: '8',
      name: 'Azeite de Oliva',
      category: 'Gorduras',
      nutrition: {
        calories: 884,
        protein: 0,
        carbs: 0,
        fats: 100,
        fiber: 0,
        sugar: 0,
        sodium: 2
      },
      servingSize: '100ml',
      servingWeight: 100
    }
  ];

  // Base de suplementos
  private readonly SUPPLEMENT_DATABASE: Supplement[] = [
    {
      id: '1',
      name: 'Whey Protein',
      type: 'Proteína',
      dosage: '25-30g',
      benefits: ['Síntese proteica', 'Recuperação muscular', 'Praticidade'],
      timing: ['pós-treino', 'entre-refeições'],
      cost: 150,
      priority: 'recomendado'
    },
    {
      id: '2',
      name: 'Creatina',
      type: 'Performance',
      dosage: '3-5g',
      benefits: ['Força', 'Potência', 'Volume muscular'],
      timing: ['qualquer-horário'],
      cost: 50,
      priority: 'essencial'
    },
    {
      id: '3',
      name: 'Multivitamínico',
      type: 'Vitaminas',
      dosage: '1 comprimido',
      benefits: ['Saúde geral', 'Imunidade', 'Energia'],
      timing: ['manhã-com-alimento'],
      cost: 80,
      priority: 'recomendado'
    },
    {
      id: '4',
      name: 'Ômega 3',
      type: 'Gorduras',
      dosage: '1-2g',
      benefits: ['Anti-inflamatório', 'Saúde cardiovascular', 'Recuperação'],
      timing: ['com-refeições'],
      cost: 60,
      priority: 'recomendado'
    }
  ];

  // Receitas saudáveis
  private readonly RECIPE_DATABASE: Recipe[] = [
    {
      id: '1',
      name: 'Frango com Batata Doce',
      ingredients: [
        { foodId: '1', name: 'Peito de Frango', quantity: 150, unit: 'g' },
        { foodId: '3', name: 'Batata Doce', quantity: 200, unit: 'g' },
        { foodId: '8', name: 'Azeite', quantity: 10, unit: 'ml' }
      ],
      instructions: [
        'Tempere o frango com sal, pimenta e ervas',
        'Corte a batata doce em cubos',
        'Grelhe o frango por 6-8 minutos cada lado',
        'Asse a batata doce por 25 minutos a 200°C',
        'Regue com azeite antes de servir'
      ],
      prepTime: 10,
      cookTime: 30,
      servings: 1,
      difficulty: 'facil',
      nutrition: {
        calories: 436,
        protein: 46.5,
        carbs: 48,
        fats: 7.6,
        fiber: 7.8
      }
    }
  ];

  // Calcular perfil nutricional
  calculateNutritionProfile(userData: any): NutritionProfile {
    const bmr = this.calculateBMR(userData);
    const tdee = this.calculateTDEE(bmr, userData.activityLevel);
    const targetCalories = this.calculateTargetCalories(tdee, userData.goal);

    return {
      userId: userData.id,
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
      gender: userData.gender,
      activityLevel: userData.activityLevel,
      goal: userData.goal,
      restrictions: userData.restrictions || [],
      preferences: userData.preferences || [],
      bmr,
      tdee,
      targetCalories
    };
  }

  // Calcular metas de macronutrientes
  calculateMacroTargets(profile: NutritionProfile): MacroTargets {
    const { targetCalories, goal } = profile;
    
    let proteinPercent: number, carbsPercent: number, fatsPercent: number;
    
    switch (goal) {
      case 'ganho_muscular':
        proteinPercent = 30;
        carbsPercent = 40;
        fatsPercent = 30;
        break;
      case 'perda_peso':
        proteinPercent = 35;
        carbsPercent = 30;
        fatsPercent = 35;
        break;
      case 'manutencao':
        proteinPercent = 25;
        carbsPercent = 45;
        fatsPercent = 30;
        break;
      default:
        proteinPercent = 25;
        carbsPercent = 45;
        fatsPercent = 30;
    }

    const proteinCalories = (targetCalories * proteinPercent) / 100;
    const carbsCalories = (targetCalories * carbsPercent) / 100;
    const fatsCalories = (targetCalories * fatsPercent) / 100;

    return {
      protein: {
        grams: Math.round(proteinCalories / 4),
        calories: proteinCalories,
        percentage: proteinPercent
      },
      carbs: {
        grams: Math.round(carbsCalories / 4),
        calories: carbsCalories,
        percentage: carbsPercent
      },
      fats: {
        grams: Math.round(fatsCalories / 9),
        calories: fatsCalories,
        percentage: fatsPercent
      },
      fiber: Math.max(25, Math.round(targetCalories / 100)),
      sugar: Math.round(targetCalories * 0.05 / 4) // Max 5% das calorias
    };
  }

  // Gerar recomendações nutricionais
  generateNutritionRecommendations(dailyData: DailyNutrition): NutritionRecommendation[] {
    const recommendations: NutritionRecommendation[] = [];
    const { totals, targets, adherence } = dailyData;

    // Proteína insuficiente
    if (adherence.protein < 80) {
      recommendations.push({
        type: 'meal',
        priority: 'alta',
        title: 'Aumente a Proteína',
        description: `Você consumiu apenas ${totals.protein}g de ${targets.protein.grams}g de proteína hoje.`,
        foods: ['Peito de Frango', 'Ovos', 'Whey Protein', 'Peixe'],
        reason: 'Proteína é essencial para síntese muscular'
      });
    }

    // Calorias muito baixas
    if (adherence.calories < 70) {
      recommendations.push({
        type: 'meal',
        priority: 'alta',
        title: 'Calorias Insuficientes',
        description: 'Você está comendo muito pouco. Isso pode prejudicar seu metabolismo.',
        foods: ['Oleaginosas', 'Abacate', 'Azeite'],
        reason: 'Déficit calórico extremo pode ser contraproducente'
      });
    }

    // Hidratação
    if (totals.water < 2000) {
      recommendations.push({
        type: 'hydration',
        priority: 'media',
        title: 'Beba Mais Água',
        description: `Meta: 2.5L por dia. Atual: ${totals.water / 1000}L`,
        timing: 'Ao longo do dia',
        reason: 'Hidratação adequada melhora performance'
      });
    }

    // Timing de nutrientes
    if (!this.hasPreWorkoutMeal(dailyData)) {
      recommendations.push({
        type: 'timing',
        priority: 'media',
        title: 'Refeição Pré-treino',
        description: 'Faça uma refeição 1-2h antes do treino.',
        foods: ['Banana', 'Aveia', 'Batata Doce'],
        timing: '1-2h antes do treino',
        reason: 'Energia para melhor performance'
      });
    }

    return recommendations;
  }

  // Gerar plano de suplementação
  generateSupplementPlan(profile: NutritionProfile, budget: number = 300): SupplementPlan {
    const selectedSupplements: Supplement[] = [];
    let totalCost = 0;

    // Priorizar suplementos por objetivo
    const priorityOrder = this.getSupplementPriority(profile.goal);
    
    for (const supplementId of priorityOrder) {
      const supplement = this.SUPPLEMENT_DATABASE.find(s => s.id === supplementId);
      if (supplement && totalCost + supplement.cost <= budget) {
        selectedSupplements.push(supplement);
        totalCost += supplement.cost;
      }
    }

    const timing = this.generateSupplementTiming(selectedSupplements);

    return {
      supplements: selectedSupplements,
      timing,
      budget: totalCost,
      effectiveness: this.calculateSupplementEffectiveness(selectedSupplements, profile.goal)
    };
  }

  // Gerar plano de refeições
  generateMealPlan(profile: NutritionProfile, days: number = 7): MealPlan {
    const macroTargets = this.calculateMacroTargets(profile);
    const dailyPlans: DailyMealPlan[] = [];

    for (let day = 1; day <= days; day++) {
      const meals = this.generateDailyMeals(macroTargets, profile);
      const totalCalories = meals.reduce((sum, meal) => 
        sum + meal.foods.reduce((mealSum, food) => mealSum + food.nutrition.calories, 0), 0
      );

      dailyPlans.push({
        day,
        meals,
        totalCalories,
        macros: macroTargets,
        prepTime: meals.reduce((sum, meal) => sum + meal.prepTime, 0)
      });
    }

    const shoppingList = this.generateShoppingList(dailyPlans);

    return {
      id: this.generateId(),
      name: `Plano ${profile.goal} - ${days} dias`,
      duration: days,
      goal: profile.goal,
      dailyPlans,
      shoppingList,
      prepInstructions: [
        'Prepare proteínas em lote no domingo',
        'Lave e corte vegetais antecipadamente',
        'Use tupperware para porções individuais'
      ]
    };
  }

  // Analisar dia nutricional
  analyzeDailyNutrition(meals: Meal[], targets: MacroTargets): DailyNutrition {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      water: 2000 // Simulado
    };

    meals.forEach(meal => {
      totals.calories += meal.totalNutrition.calories;
      totals.protein += meal.totalNutrition.protein;
      totals.carbs += meal.totalNutrition.carbs;
      totals.fats += meal.totalNutrition.fats;
      totals.fiber += meal.totalNutrition.fiber;
    });

    const adherence = {
      calories: Math.round((totals.calories / (targets.protein.calories + targets.carbs.calories + targets.fats.calories)) * 100),
      protein: Math.round((totals.protein / targets.protein.grams) * 100),
      carbs: Math.round((totals.carbs / targets.carbs.grams) * 100),
      fats: Math.round((totals.fats / targets.fats.grams) * 100)
    };

    const score = this.calculateNutritionScore(adherence);

    return {
      date: new Date().toISOString().split('T')[0],
      meals,
      totals,
      targets,
      adherence,
      score
    };
  }

  // Buscar alimentos
  searchFoods(query: string): Food[] {
    return this.FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Métodos auxiliares privados
  private calculateBMR(userData: any): number {
    const { weight, height, age, gender } = userData;
    
    if (gender === 'masculino') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  private calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito_intenso': 1.9
    };
    
    return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.55);
  }

  private calculateTargetCalories(tdee: number, goal: string): number {
    switch (goal) {
      case 'perda_peso':
        return Math.round(tdee * 0.8); // Déficit de 20%
      case 'ganho_peso':
      case 'ganho_muscular':
        return Math.round(tdee * 1.1); // Superávit de 10%
      default:
        return Math.round(tdee);
    }
  }

  private hasPreWorkoutMeal(dailyData: DailyNutrition): boolean {
    // Lógica simplificada
    return dailyData.meals.some(meal => 
      meal.time >= '13:00' && meal.time <= '15:00'
    );
  }

  private getSupplementPriority(goal: string): string[] {
    const priorities = {
      'ganho_muscular': ['2', '1', '3', '4'], // Creatina, Whey, Multi, Ômega
      'perda_peso': ['3', '4', '2', '1'],
      'manutencao': ['3', '4', '1', '2']
    };
    
    return priorities[goal as keyof typeof priorities] || ['3', '1', '2', '4'];
  }

  private generateSupplementTiming(supplements: Supplement[]): SupplementTiming[] {
    return supplements.map(supplement => ({
      supplementId: supplement.id,
      time: this.getOptimalSupplementTime(supplement),
      withMeal: supplement.timing.includes('com-refeições'),
      notes: `${supplement.dosage} diariamente`
    }));
  }

  private getOptimalSupplementTime(supplement: Supplement): string {
    if (supplement.timing.includes('pós-treino')) return '16:30';
    if (supplement.timing.includes('manhã')) return '07:00';
    if (supplement.timing.includes('com-refeições')) return '12:00';
    return '09:00';
  }

  private calculateSupplementEffectiveness(supplements: Supplement[], goal: string): number {
    // Algoritmo simplificado de efetividade
    let score = 0;
    const goalWeights = {
      'ganho_muscular': { 'Proteína': 30, 'Performance': 40, 'Vitaminas': 20, 'Gorduras': 10 },
      'perda_peso': { 'Vitaminas': 40, 'Gorduras': 30, 'Performance': 20, 'Proteína': 10 }
    };
    
    const weights = goalWeights[goal as keyof typeof goalWeights] || goalWeights['ganho_muscular'];
    
    supplements.forEach(supplement => {
      score += weights[supplement.type as keyof typeof weights] || 10;
    });
    
    return Math.min(score, 100);
  }

  private generateDailyMeals(targets: MacroTargets, profile: NutritionProfile): PlannedMeal[] {
    // Distribuição de calorias por refeição
    const mealDistribution = {
      'Café da Manhã': 0.25,
      'Lanche da Manhã': 0.10,
      'Almoço': 0.30,
      'Pré-treino': 0.10,
      'Pós-treino': 0.15,
      'Jantar': 0.10
    };

    const totalCalories = targets.protein.calories + targets.carbs.calories + targets.fats.calories;
    
    return Object.entries(mealDistribution).map(([mealName, percentage]) => ({
      name: mealName,
      time: this.getMealTime(mealName),
      foods: this.generateMealFoods(totalCalories * percentage, targets),
      prepTime: this.getMealPrepTime(mealName),
      difficulty: 'facil' as const
    }));
  }

  private getMealTime(mealName: string): string {
    const times = {
      'Café da Manhã': '07:00',
      'Lanche da Manhã': '10:00',
      'Almoço': '12:30',
      'Pré-treino': '14:30',
      'Pós-treino': '16:30',
      'Jantar': '19:00'
    };
    return times[mealName as keyof typeof times] || '12:00';
  }

  private getMealPrepTime(mealName: string): number {
    const times = {
      'Café da Manhã': 10,
      'Lanche da Manhã': 5,
      'Almoço': 20,
      'Pré-treino': 5,
      'Pós-treino': 5,
      'Jantar': 15
    };
    return times[mealName as keyof typeof times] || 10;
  }

  private generateMealFoods(targetCalories: number, macros: MacroTargets): FoodEntry[] {
    // Lógica simplificada para gerar alimentos da refeição
    const foods: FoodEntry[] = [];
    const availableFoods = this.FOOD_DATABASE.slice(0, 6); // Primeiros 6 alimentos
    
    let remainingCalories = targetCalories;
    
    availableFoods.forEach((food, index) => {
      if (remainingCalories > 50 && index < 3) {
        const portion = Math.min(remainingCalories / food.nutrition.calories, 2);
        const quantity = Math.round(portion * food.servingWeight);
        
        foods.push({
          foodId: food.id,
          foodName: food.name,
          quantity,
          unit: 'g',
          nutrition: {
            calories: Math.round(food.nutrition.calories * portion),
            protein: Math.round(food.nutrition.protein * portion),
            carbs: Math.round(food.nutrition.carbs * portion),
            fats: Math.round(food.nutrition.fats * portion),
            fiber: Math.round(food.nutrition.fiber * portion)
          }
        });
        
        remainingCalories -= food.nutrition.calories * portion;
      }
    });
    
    return foods;
  }

  private generateShoppingList(dailyPlans: DailyMealPlan[]): ShoppingItem[] {
    const items = new Map<string, ShoppingItem>();
    
    dailyPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        meal.foods.forEach(food => {
          const key = food.foodName;
          if (items.has(key)) {
            const existing = items.get(key)!;
            existing.quantity += food.quantity;
          } else {
            items.set(key, {
              name: food.foodName,
              quantity: food.quantity,
              unit: food.unit,
              category: this.getFoodCategory(food.foodName),
              estimated_cost: this.estimateFoodCost(food.foodName, food.quantity)
            });
          }
        });
      });
    });
    
    return Array.from(items.values());
  }

  private getFoodCategory(foodName: string): string {
    const food = this.FOOD_DATABASE.find(f => f.name === foodName);
    return food?.category || 'Diversos';
  }

  private estimateFoodCost(foodName: string, quantity: number): number {
    const costs: { [key: string]: number } = {
      'Peito de Frango': 0.025, // R$ por grama
      'Arroz Integral': 0.008,
      'Batata Doce': 0.006,
      'Aveia': 0.012,
      'Ovo': 0.015,
      'Banana': 0.004
    };
    
    return Math.round((costs[foodName] || 0.01) * quantity * 100) / 100;
  }

  private calculateNutritionScore(adherence: any): number {
    const weights = {
      calories: 0.3,
      protein: 0.4,
      carbs: 0.15,
      fats: 0.15
    };
    
    let score = 0;
    Object.entries(weights).forEach(([macro, weight]) => {
      const adherenceValue = adherence[macro as keyof typeof adherence];
      // Penaliza tanto excesso quanto déficit
      const macroScore = Math.max(0, 100 - Math.abs(100 - adherenceValue));
      score += macroScore * weight;
    });
    
    return Math.round(score);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos públicos para uso na interface
  getFoodDatabase(): Food[] {
    return this.FOOD_DATABASE;
  }

  getSupplementDatabase(): Supplement[] {
    return this.SUPPLEMENT_DATABASE;
  }

  getRecipeDatabase(): Recipe[] {
    return this.RECIPE_DATABASE;
  }
}

export const nutritionService = new NutritionService(); 