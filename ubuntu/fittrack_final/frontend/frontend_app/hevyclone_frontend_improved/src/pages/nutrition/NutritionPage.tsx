import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  BeakerIcon,
  CameraIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface MealPlan {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  aiGenerated: boolean;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

const NutritionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'ai-planner' | 'scanner'>('dashboard');
  const [aiPlannerLoading, setAiPlannerLoading] = useState(false);

  const [nutritionGoals] = useState<NutritionGoals>({
    calories: 2200,
    protein: 140,
    carbs: 275,
    fat: 73,
    water: 2500
  });

  const [todayIntake] = useState({
    calories: 1856,
    protein: 112,
    carbs: 203,
    fat: 58,
    water: 1800
  });

  const [mealPlans] = useState<MealPlan[]>([
    {
      id: '1',
      name: 'Plano Ganho de Massa',
      calories: 2800,
      protein: 180,
      carbs: 350,
      fat: 93,
      aiGenerated: true,
      meals: [
        {
          id: '1',
          name: 'Omelete Proteica',
          type: 'breakfast',
          calories: 420,
          protein: 32,
          carbs: 12,
          fat: 28,
          ingredients: ['3 ovos inteiros', '2 claras', '50g queijo cottage', 'Espinafre', 'Tomate'],
          instructions: ['Bater os ovos', 'Adicionar cottage e vegetais', 'Cozinhar em fogo baixo']
        }
      ]
    },
    {
      id: '2',
      name: 'Plano Definição',
      calories: 1800,
      protein: 150,
      carbs: 180,
      fat: 60,
      aiGenerated: false,
      meals: []
    }
  ]);

  const generateAIPlan = async () => {
    setAiPlannerLoading(true);
    // Simular geração de plano pela IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAiPlannerLoading(false);
  };

  const getMacroPercentage = (current: number, goal: number) => {
    return Math.min(100, (current / goal) * 100);
  };

  const getMacroColor = (percentage: number) => {
    if (percentage >= 90 && percentage <= 110) return 'text-green-400';
    if (percentage >= 70 && percentage <= 130) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'dinner': return 'Jantar';
      case 'snack': return 'Lanche';
      default: return 'Refeição';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🥗 Nutrition AI
          </h1>
          <p className="text-[#8b8b8b] text-lg">
            Planejamento nutricional inteligente integrado com seus treinos
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-[#1a1a1b] p-1 rounded-lg w-fit border border-[#2d2d30]">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'meals', label: 'Refeições', icon: '🍽️' },
              { id: 'ai-planner', label: 'IA Planner', icon: '🤖' },
              { id: 'scanner', label: 'Scanner', icon: '📸' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-[#8b8b8b] hover:text-white hover:bg-[#2d2d30]'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Resumo de Hoje</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Calories */}
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#2d2d30"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#f97316"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${getMacroPercentage(todayIntake.calories, nutritionGoals.calories) * 2.26} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {Math.round(getMacroPercentage(todayIntake.calories, nutritionGoals.calories))}%
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-orange-400">{todayIntake.calories}</div>
                  <div className="text-xs text-[#8b8b8b]">de {nutritionGoals.calories} kcal</div>
                </div>

                {/* Protein */}
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#2d2d30"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${getMacroPercentage(todayIntake.protein, nutritionGoals.protein) * 2.26} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {Math.round(getMacroPercentage(todayIntake.protein, nutritionGoals.protein))}%
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-400">{todayIntake.protein}g</div>
                  <div className="text-xs text-[#8b8b8b]">de {nutritionGoals.protein}g</div>
                </div>

                {/* Carbs */}
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#2d2d30"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs) * 2.26} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {Math.round(getMacroPercentage(todayIntake.carbs, nutritionGoals.carbs))}%
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-400">{todayIntake.carbs}g</div>
                  <div className="text-xs text-[#8b8b8b]">de {nutritionGoals.carbs}g</div>
                </div>

                {/* Fat */}
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#2d2d30"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#a855f7"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${getMacroPercentage(todayIntake.fat, nutritionGoals.fat) * 2.26} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {Math.round(getMacroPercentage(todayIntake.fat, nutritionGoals.fat))}%
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-400">{todayIntake.fat}g</div>
                  <div className="text-xs text-[#8b8b8b]">de {nutritionGoals.fat}g</div>
                </div>
              </div>
            </div>

            {/* Water Intake */}
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">💧 Hidratação</h3>
                <span className="text-cyan-400 font-medium">{todayIntake.water}ml / {nutritionGoals.water}ml</span>
              </div>
              <div className="w-full bg-[#2d2d30] rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${getMacroPercentage(todayIntake.water, nutritionGoals.water)}%` }}
                />
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Insights da IA</h3>
              </div>
              <div className="space-y-3">
                <p className="text-[#8b8b8b]">
                  • Você está 20% abaixo da meta de proteína hoje. Considere adicionar um shake pós-treino.
                </p>
                <p className="text-[#8b8b8b]">
                  • Baseado no seu treino de hoje, recomendo aumentar carboidratos em 30g na próxima refeição.
                </p>
                <p className="text-[#8b8b8b]">
                  • Sua hidratação está baixa. Tente beber mais 700ml de água até o final do dia.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Planner Tab */}
        {activeTab === 'ai-planner' && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">IA Nutrition Planner</h2>
                  <p className="text-[#8b8b8b]">Crie planos personalizados baseados em seus objetivos e treinos</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Objetivo</label>
                    <select className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white">
                      <option>Ganho de Massa</option>
                      <option>Perda de Peso</option>
                      <option>Manutenção</option>
                      <option>Definição</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tipo de Treino</label>
                    <select className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white">
                      <option>Musculação</option>
                      <option>Cardio</option>
                      <option>CrossFit</option>
                      <option>Misto</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Restrições Alimentares</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[#8b8b8b]">
                        <input type="checkbox" />
                        Vegetariano
                      </label>
                      <label className="flex items-center gap-2 text-[#8b8b8b]">
                        <input type="checkbox" />
                        Vegano
                      </label>
                      <label className="flex items-center gap-2 text-[#8b8b8b]">
                        <input type="checkbox" />
                        Sem Lactose
                      </label>
                      <label className="flex items-center gap-2 text-[#8b8b8b]">
                        <input type="checkbox" />
                        Sem Glúten
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={generateAIPlan}
                disabled={aiPlannerLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiPlannerLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Gerando Plano Personalizado...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    Gerar Plano com IA
                  </>
                )}
              </button>
            </div>

            {/* Generated Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealPlans.filter(plan => plan.aiGenerated).map((plan) => (
                <div key={plan.id} className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      IA Generated
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{plan.calories}</div>
                      <div className="text-xs text-[#8b8b8b]">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{plan.protein}g</div>
                      <div className="text-xs text-[#8b8b8b]">proteína</div>
                    </div>
                  </div>

                  <button className="w-full bg-[#2d2d30] text-white py-2 px-4 rounded-lg hover:bg-[#404040] transition-colors">
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="text-center py-16">
            <CameraIcon className="w-16 h-16 text-[#8b8b8b] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Scanner de Alimentos</h3>
            <p className="text-[#8b8b8b] mb-6">
              Escaneie códigos de barras ou tire fotos dos alimentos para análise nutricional
            </p>
            <div className="space-y-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors mx-2">
                📸 Escanear Alimento
              </button>
              <button className="bg-[#2d2d30] text-white px-6 py-3 rounded-lg hover:bg-[#404040] transition-colors mx-2">
                📱 Código de Barras
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage; 