import React, { useState, useEffect } from 'react';
import { virtualCoachService } from '../../services/virtualCoachService';

const VirtualCoachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('planos');
  const [coachInsights, setCoachInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('agachamento');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    loadCoachInsights();
  }, []);

  const loadCoachInsights = async () => {
    try {
      setLoading(true);
      const insights = virtualCoachService.generateCoachInsights();
      setCoachInsights(insights);
    } catch (error) {
    console.error('Erro ao carregar insights do coach:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Simular análise de vídeo
      const analysis = virtualCoachService.analyzeVideoForm(selectedExercise);
      setAnalysisResult(analysis);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <div className="text-white text-xl">Carregando Coach Virtual...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-purple-600 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h1 className="text-3xl font-bold text-white">Coach Virtual SAGA</h1>
              <p className="text-purple-100">
                Seu personal trainer inteligente com IA avançada
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="flex flex-wrap border-b border-gray-700">
            {[
              { id: 'planos', label: 'Planos Adaptativos' },
              { id: 'video', label: 'Análise de Forma' },
              { id: 'nutricao', label: 'Nutrição' },
              { id: 'calendario', label: 'Calendário' },
              { id: 'recomendacoes', label: 'Recomendações' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'planos' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Planos Adaptativos</h3>
              {coachInsights?.adaptivePlans?.map((plan: any) => (
                <div key={plan.id} className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                      <p className="text-gray-300">Semana {plan.currentWeek} • {plan.workoutsPerWeek}x por semana</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{plan.progressScore}%</div>
                      <div className="text-sm text-gray-400">Progresso</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.exercises.map((exercise: any) => (
                      <div key={exercise.id} className="bg-gray-600 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-white">{exercise.name}</h5>
                          <span className="text-sm text-purple-400">{exercise.weight}</span>
                        </div>
                        <div className="text-sm text-gray-300">
                          {exercise.sets} séries • {exercise.reps} reps • {exercise.restTime}s descanso
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">📹 Análise de Forma</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coachInsights?.formAnalyses?.map((analysis: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-white">{analysis.exerciseName}</h5>
                      <span className="text-lg font-bold text-purple-400">
                        {analysis.overallScore}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(analysis.analysis).map(([key, data]: [string, any]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-300 capitalize">{key}</span>
                          <span className="text-purple-400">{data.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutricao' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">🥗 Nutrição Integrada</h3>
              {coachInsights?.nutritionPlan && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Resumo Diário</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-purple-400">
                        {coachInsights.nutritionPlan.dailyCalories}
                      </div>
                      <div className="text-sm text-gray-300">Calorias/dia</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-400">
                          {coachInsights.nutritionPlan.macros.protein}%
                        </div>
                        <div className="text-sm text-gray-300">Proteína</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">
                          {coachInsights.nutritionPlan.macros.carbs}%
                        </div>
                        <div className="text-sm text-gray-300">Carbos</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-teal-400">
                          {coachInsights.nutritionPlan.macros.fats}%
                        </div>
                        <div className="text-sm text-gray-300">Gorduras</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Refeições</h4>
                    <div className="space-y-3">
                      {coachInsights.nutritionPlan.meals.map((meal: any, index: number) => (
                        <div key={index} className="bg-gray-600 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white">{meal.name}</span>
                            <span className="text-sm text-purple-400">{meal.time}</span>
                          </div>
                          <div className="text-sm text-gray-300 mb-2">
                            {meal.calories} calorias
                          </div>
                          <div className="text-sm text-gray-400">
                            {meal.foods.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendario' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">📅 Calendário Inteligente</h3>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {coachInsights?.weeklySchedule?.map((item: any, index: number) => {
                  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                  const dayName = dayNames[index];
                  
                  return (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-white">{dayName}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(item.date).getDate()}
                        </div>
                      </div>
                      
                      {item.type === 'treino' ? (
                        <div className="space-y-2">
                          <div className="bg-purple-600 rounded p-2 text-center">
                            <div className="text-sm font-medium text-white">Treino</div>
                            <div className="text-xs text-purple-200">{item.time}</div>
                          </div>
                          <div className="text-xs text-gray-300">
                            {item.duration}min
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="bg-gray-600 rounded p-2">
                            <div className="text-sm text-gray-300">Descanso</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'recomendacoes' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">💡 Recomendações do Coach</h3>
              <div className="space-y-4">
                {coachInsights?.recommendations?.map((rec: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs text-white ${
                        rec.priority === 'critica' ? 'bg-red-600' :
                                                  rec.priority === 'alta' ? 'bg-slate-600' :
                        rec.priority === 'media' ? 'bg-teal-600' : 'bg-green-600'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{rec.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{rec.category}</span>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualCoachPage; 