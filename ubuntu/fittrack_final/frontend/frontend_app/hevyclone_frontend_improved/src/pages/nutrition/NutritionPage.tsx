import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  SearchIcon,
  CameraIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  FireIcon,
  ScaleIcon,
  ClockIcon,
  BeakerIcon,
  BookOpenIcon,
  ShoppingCartIcon,
  TargetIcon,
  BoltIcon,
  HeartIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar } from 'recharts';

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  unit: string;
  time: Date;
  image?: string;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

interface FoodDatabase {
  id: string;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  category: string;
  barcode?: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  tags: string[];
  rating: number;
}

const NutritionPage: React.FC = () => {
  const [consumedFoods, setConsumedFoods] = useState<FoodItem[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
    water: 2000
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<'diary' | 'goals' | 'recipes' | 'insights'>('diary');
  const [foodSearch, setFoodSearch] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [waterIntake, setWaterIntake] = useState(1200);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [foodDatabase, setFoodDatabase] = useState<FoodDatabase[]>([]);

  // Dados simulados
  useEffect(() => {
    const mockFoods: FoodItem[] = [
      {
        id: '1',
        name: 'Aveia com Banana',
        calories: 350,
        protein: 12,
        carbs: 58,
        fat: 8,
        fiber: 10,
        sugar: 15,
        sodium: 5,
        category: 'breakfast',
        quantity: 1,
        unit: 'porção',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Peito de Frango Grelhado',
        calories: 280,
        protein: 53,
        carbs: 0,
        fat: 6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
        category: 'lunch',
        quantity: 150,
        unit: 'g',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Arroz Integral',
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 2,
        fiber: 4,
        sugar: 1,
        sodium: 2,
        category: 'lunch',
        quantity: 100,
        unit: 'g',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Whey Protein',
        calories: 120,
        protein: 25,
        carbs: 3,
        fat: 1,
        fiber: 0,
        sugar: 2,
        sodium: 50,
        category: 'snack',
        quantity: 30,
        unit: 'g',
        time: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ];

    const mockRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Bowl de Açaí Proteico',
        description: 'Açaí cremoso com frutas e granola caseira',
        image: '🍓',
        prepTime: 10,
        cookTime: 0,
        servings: 1,
        difficulty: 'easy',
        calories: 450,
        protein: 25,
        carbs: 52,
        fat: 18,
        ingredients: [
          { name: 'Açaí congelado', amount: '100', unit: 'g' },
          { name: 'Banana', amount: '1', unit: 'unidade' },
          { name: 'Whey protein', amount: '30', unit: 'g' },
          { name: 'Granola', amount: '30', unit: 'g' },
          { name: 'Morango', amount: '50', unit: 'g' }
        ],
        instructions: [
          'Bata o açaí com a banana e o whey protein',
          'Coloque em uma tigela',
          'Adicione a granola e os morangos por cima',
          'Sirva imediatamente'
        ],
        tags: ['saudável', 'proteico', 'pós-treino', 'antioxidante'],
        rating: 4.8
      },
      {
        id: '2',
        name: 'Frango com Batata Doce',
        description: 'Refeição completa para ganho de massa',
        image: '🍗',
        prepTime: 15,
        cookTime: 25,
        servings: 2,
        difficulty: 'medium',
        calories: 520,
        protein: 45,
        carbs: 38,
        fat: 18,
        ingredients: [
          { name: 'Peito de frango', amount: '300', unit: 'g' },
          { name: 'Batata doce', amount: '200', unit: 'g' },
          { name: 'Brócolis', amount: '150', unit: 'g' },
          { name: 'Azeite', amount: '15', unit: 'ml' },
          { name: 'Temperos', amount: 'a gosto', unit: '' }
        ],
        instructions: [
          'Tempere o frango e grelhe por 12 minutos',
          'Corte a batata doce e asse por 20 minutos',
          'Refogue o brócolis no azeite',
          'Monte o prato e sirva'
        ],
        tags: ['proteico', 'massa muscular', 'completo', 'saudável'],
        rating: 4.9
      }
    ];

    const mockFoodDatabase: FoodDatabase[] = [
      { id: '1', name: 'Banana', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, fiberPer100g: 2.6, category: 'frutas' },
      { id: '2', name: 'Peito de Frango', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, fiberPer100g: 0, category: 'carnes' },
      { id: '3', name: 'Aveia', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, fiberPer100g: 10, category: 'cereais' },
      { id: '4', name: 'Ovo', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, fiberPer100g: 0, category: 'proteínas' }
    ];

    setConsumedFoods(mockFoods);
    setRecipes(mockRecipes);
    setFoodDatabase(mockFoodDatabase);
  }, []);

  // Cálculos nutricionais
  const todaysNutrition = consumedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
      fiber: acc.fiber + food.fiber
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const macroData = [
    { name: 'Proteína', value: todaysNutrition.protein * 4, fill: '#8B5CF6' },
    { name: 'Carboidratos', value: todaysNutrition.carbs * 4, fill: '#10B981' },
    { name: 'Gordura', value: todaysNutrition.fat * 9, fill: '#F59E0B' }
  ];

  const dailyProgress = [
    {
      name: 'Calorias',
      current: todaysNutrition.calories,
      target: nutritionGoals.calories,
      unit: 'kcal',
      color: '#EF4444',
      icon: FireIcon
    },
    {
      name: 'Proteína',
      current: todaysNutrition.protein,
      target: nutritionGoals.protein,
      unit: 'g',  
      color: '#8B5CF6',
      icon: BoltIcon
    },
    {
      name: 'Carboidratos',
      current: todaysNutrition.carbs,
      target: nutritionGoals.carbs,
      unit: 'g',
      color: '#10B981',
      icon: BeakerIcon
    },
    {
      name: 'Gordura',
      current: todaysNutrition.fat,
      target: nutritionGoals.fat,
      unit: 'g',
      color: '#F59E0B',
      icon: ScaleIcon
    }
  ];

  const MacroCard = ({ name, current, target, unit, color, icon: Icon }: {
    name: string;
    current: number;
    target: number;
    unit: string;
    color: string;
    icon: React.ElementType;
  }) => {
    const percentage = Math.min((current / target) * 100, 100);
    const remaining = Math.max(target - current, 0);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" style={{ color }} />
            <span className="font-medium text-gray-900">{name}</span>
          </div>
          <span className="text-sm text-gray-600">
            {current.toFixed(0)} / {target}{unit}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {remaining > 0 ? `Faltam ${remaining.toFixed(0)}${unit}` : 'Meta atingida!'}
          </span>
          <span className="font-medium" style={{ color }}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </motion.div>
    );
  };

  const MealSection = ({ 
    meal, 
    icon: Icon, 
    title, 
    foods 
  }: {
    meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    icon: React.ElementType;
    title: string;
    foods: FoodItem[];
  }) => {
    const mealFoods = foods.filter(f => f.category === meal);
    const mealCalories = mealFoods.reduce((sum, f) => sum + f.calories, 0);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Icon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{mealCalories} kcal</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedMeal(meal);
              setShowAddFood(true);
            }}
            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="space-y-2">
          {mealFoods.map(food => (
            <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{food.name}</div>
                <div className="text-sm text-gray-600">
                  {food.quantity}{food.unit} • {food.calories} kcal
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>P: {food.protein}g</div>
                <div>C: {food.carbs}g</div>
                <div>G: {food.fat}g</div>
              </div>
            </div>
          ))}
          
          {mealFoods.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <span className="text-2xl mb-2 block">🍽️</span>
              <p className="text-sm">Nenhum alimento adicionado</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-md cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{recipe.image}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{recipe.name}</h3>
            <div className="flex items-center text-yellow-500">
              <span className="text-sm mr-1">{recipe.rating}</span>
              <StarIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {recipe.prepTime + recipe.cookTime} min
            </div>
            <div className="flex items-center">
              <FireIcon className="h-4 w-4 mr-1" />
              {recipe.calories} kcal
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {recipe.difficulty}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nutrição</h1>
                <p className="text-gray-600">Monitore sua alimentação e macros</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['diary', 'goals', 'recipes', 'insights'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                      selectedTab === tab
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {selectedTab === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Daily Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dailyProgress.map(macro => (
                  <MacroCard key={macro.name} {...macro} />
                ))}
              </div>

              {/* Macro Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Macros</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${Math.round(value)} kcal`, 'Calorias']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Water Intake */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Hidratação</h3>
                      <div className="text-sm text-gray-600">
                        {waterIntake} / {nutritionGoals.water} ml
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((waterIntake / nutritionGoals.water) * 100, 100)}%` }}
                          transition={{ duration: 1 }}
                          className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[250, 500, 750, 1000].map(amount => (
                        <motion.button
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWaterIntake(prev => prev + amount)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          +{amount}ml
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MealSection
                  meal="breakfast"
                  icon={ClockIcon}
                  title="Café da Manhã"
                  foods={consumedFoods}
                />
                <MealSection
                  meal="lunch"
                  icon={FireIcon}
                  title="Almoço"
                  foods={consumedFoods}
                />
                <MealSection
                  meal="dinner"
                  icon={HeartIcon}
                  title="Jantar"
                  foods={consumedFoods}
                />
                <MealSection
                  meal="snack"
                  icon={BoltIcon}
                  title="Lanche"
                  foods={consumedFoods}
                />
              </div>
            </motion.div>
          )}

          {selectedTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Receitas Saudáveis</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar receitas..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium"
                  >
                    Nova Receita
                  </motion.button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">Metas Nutricionais</h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(nutritionGoals).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key === 'calories' ? 'Calorias (kcal)' : 
                         key === 'water' ? 'Água (ml)' : 
                         `${key} (g)`}
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setNutritionGoals(prev => ({
                          ...prev,
                          [key]: parseInt(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Salvar Metas
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddFood(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Adicionar Alimento</h3>
                <button
                  onClick={() => setShowAddFood(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    placeholder="Buscar alimento..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {foodDatabase
                    .filter(food => food.name.toLowerCase().includes(foodSearch.toLowerCase()))
                    .map(food => (
                      <div
                        key={food.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{food.name}</div>
                        <div className="text-sm text-gray-600">
                          {food.caloriesPer100g} kcal/100g • P: {food.proteinPer100g}g • C: {food.carbsPer100g}g • G: {food.fatPer100g}g
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50"
                  >
                    <CameraIcon className="h-5 w-5" />
                    <span>Escanear</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Adicionar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionPage; 