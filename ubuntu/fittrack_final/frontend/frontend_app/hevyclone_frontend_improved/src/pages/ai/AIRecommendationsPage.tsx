import React, { useState, useEffect } from 'react';

const AIRecommendationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'exercicios' | 'descanso' | 'cargas' | 'alertas' | 'analise'>('exercicios');

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-green-500 bg-green-50 text-green-700';
    }
  };

  const getSeverityColor = (severity: 'warning' | 'danger' | 'critical') => {
    switch (severity) {
      case 'critical': return 'border-red-600 bg-red-100 text-red-800';
      case 'danger': return 'border-orange-500 bg-orange-100 text-orange-800';
      case 'warning': return 'border-yellow-500 bg-yellow-100 text-yellow-800';
    }
  };

  // Dados simulados da IA
  const aiInsights = {
    exerciseRecommendations: [
      {
        name: 'Agachamento Livre',
        reason: 'Grupo muscular "pernas" está sendo pouco trabalhado',
        priority: 'high' as const,
        category: 'Pernas',
        suggestedSets: 3,
        suggestedReps: '8-12',
        suggestedWeight: 'Moderado',
        muscleGroups: ['quadríceps', 'glúteos']
      },
      {
        name: 'Remada Curvada',
        reason: 'Exercício complementar para desenvolvimento das costas',
        priority: 'medium' as const,
        category: 'Costas',
        suggestedSets: 4,
        suggestedReps: '6-10',
        suggestedWeight: '35kg',
        muscleGroups: ['latíssimo', 'romboides']
      }
    ],
    restRecommendations: [
      {
        exercise: 'Supino Reto',
        currentRest: 120,
        recommendedRest: 180,
        reason: 'Descanso muito curto para alta intensidade',
        intensity: 'high' as const
      }
    ],
    loadPredictions: [
      {
        exercise: 'Supino Reto',
        currentWeight: 60,
        predictedWeight: 63,
        progressionType: 'linear' as const,
        confidence: 92,
        reason: 'Progresso constante detectado'
      },
      {
        exercise: 'Agachamento',
        currentWeight: 80,
        predictedWeight: 85,
        progressionType: 'aggressive' as const,
        confidence: 88,
        reason: 'Progresso excelente baseado em 12 sessões'
      }
    ],
    overtrainingAlerts: [
      {
        severity: 'warning' as const,
        type: 'volume' as const,
        message: 'Volume de treino alto detectado',
        recommendation: 'Considere reduzir o número de séries',
        metrics: {
          current: 165,
          threshold: 150,
          unit: 'séries por semana'
        }
      }
    ],
    weeklyAnalysis: {
      totalVolume: 2850,
      averageIntensity: 7.2,
      recoveryScore: 85,
      progressTrend: 'improving' as const
    },
    personalizedTips: [
      '🎯 Tente manter uma rotina mais consistente. A regularidade é chave para o progresso!',
      '📈 Aumente gradualmente as cargas a cada 2-3 semanas para evitar platôs.',
      '⏱️ Seus treinos estão curtos. Considere aumentar o tempo para 45-60 minutos.',
      '🔄 Adicione mais variedade aos seus exercícios para estimular diferentes músculos.'
    ]
  };

  const getProgressionColor = (type: 'linear' | 'conservative' | 'aggressive') => {
    switch (type) {
      case 'aggressive': return 'text-red-600 bg-red-100';
      case 'linear': return 'text-blue-600 bg-blue-100';
      case 'conservative': return 'text-green-600 bg-green-100';
    }
  };

  const getTrendIcon = (trend: 'improving' | 'plateau' | 'declining') => {
    switch (trend) {
      case 'improving': return '📈';
      case 'plateau': return '📊';
      case 'declining': return '📉';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🧠</span>
          <h1 className="text-3xl font-bold">IA Fitness Coach</h1>
        </div>
        <p className="text-gray-400">
          Análise inteligente do seu histórico de treinos com recomendações personalizadas
        </p>
      </div>

      {/* Visão Geral Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200">Volume Semanal</p>
              <p className="text-2xl font-bold">{aiInsights.weeklyAnalysis.totalVolume}kg</p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200">Intensidade</p>
              <p className="text-2xl font-bold">{aiInsights.weeklyAnalysis.averageIntensity}</p>
            </div>
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200">Score Recuperação</p>
              <p className="text-2xl font-bold">{aiInsights.weeklyAnalysis.recoveryScore}%</p>
            </div>
            <span className="text-2xl">💤</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200">Progresso</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTrendIcon(aiInsights.weeklyAnalysis.progressTrend)}</span>
                <span className="text-lg font-semibold">
                  {aiInsights.weeklyAnalysis.progressTrend === 'improving' ? 'Melhorando' :
                   aiInsights.weeklyAnalysis.progressTrend === 'plateau' ? 'Estável' : 'Declínio'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-700">
          {[
            { id: 'exercicios', label: 'Exercícios', icon: '🎯' },
            { id: 'descanso', label: 'Descanso', icon: '⏱️' },
            { id: 'cargas', label: 'Cargas', icon: '📈' },
            { id: 'alertas', label: 'Alertas', icon: '⚠️' },
            { id: 'analise', label: 'Análise', icon: '📊' }
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-400 bg-blue-900/30'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Recomendações de Exercícios */}
        {activeTab === 'exercicios' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span>
              Recomendações de Exercícios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.exerciseRecommendations.map((rec) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{rec.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-900 text-red-300' :
                      rec.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' : 
                      'bg-green-900 text-green-300'
                    }`}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  
                  <p className="mb-4 text-gray-300">{rec.reason}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-400">Categoria:</span>
                      <p className="text-white">{rec.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Séries:</span>
                      <p className="text-white">{rec.suggestedSets}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Repetições:</span>
                      <p className="text-white">{rec.suggestedReps}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Peso:</span>
                      <p className="text-white">{rec.suggestedWeight}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-medium text-sm text-gray-400">Músculos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.muscleGroups.map((muscle, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendações de Descanso */}
        {activeTab === 'descanso' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⏱️</span>
              Recomendações de Descanso
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.restRecommendations.map((rec) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{rec.exercise}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.intensity === 'high' ? 'bg-red-900 text-red-300' :
                      rec.intensity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {rec.intensity === 'high' ? 'Alta' : rec.intensity === 'medium' ? 'Média' : 'Baixa'} Intensidade
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{rec.reason}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-900/30 rounded-lg">
                      <p className="text-sm text-gray-400">Atual</p>
                      <p className="text-xl font-bold text-red-400">{rec.currentRest}s</p>
                    </div>
                    <div className="text-center p-3 bg-green-900/30 rounded-lg">
                      <p className="text-sm text-gray-400">Recomendado</p>
                      <p className="text-xl font-bold text-green-400">{rec.recommendedRest}s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previsões de Carga */}
        {activeTab === 'cargas' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📈</span>
              Previsões de Carga
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiInsights.loadPredictions.map((pred) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{pred.exercise}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressionColor(pred.progressionType)}`}>
                      {pred.progressionType === 'aggressive' ? 'Agressiva' :
                       pred.progressionType === 'linear' ? 'Linear' : 'Conservadora'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{pred.reason}</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-400">Atual</p>
                      <p className="text-lg font-bold text-white">{pred.currentWeight}kg</p>
                    </div>
                    <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                      <p className="text-sm text-gray-400">Próxima</p>
                      <p className="text-lg font-bold text-blue-400">{pred.predictedWeight}kg</p>
                    </div>
                    <div className="text-center p-3 bg-green-900/30 rounded-lg">
                      <p className="text-sm text-gray-400">Confiança</p>
                      <p className="text-lg font-bold text-green-400">{pred.confidence}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Progressão:</span>
                      <span className="font-medium text-white">
                        +{(pred.predictedWeight - pred.currentWeight).toFixed(1)}kg 
                        ({(((pred.predictedWeight - pred.currentWeight) / pred.currentWeight) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertas de Overtraining */}
        {activeTab === 'alertas' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⚠️</span>
              Alertas de Saúde
            </h2>
            
            {aiInsights.overtrainingAlerts.length === 0 ? (
              <div className="text-center py-8 text-green-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-xl font-semibold">Tudo Certo!</p>
                <p className="text-sm text-gray-400">Nenhum sinal de overtraining detectado. Continue assim!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiInsights.overtrainingAlerts.map((alert) => (
                  <div
                    key={index}
                    className="bg-gray-800 border-l-4 border-yellow-500 p-6 rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">⚠️</span>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-white">{alert.message}</h3>
                        <p className="mb-4 text-gray-300">{alert.recommendation}</p>
                        
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-400">Atual:</span>
                              <p className="text-white">{alert.metrics.current} {alert.metrics.unit}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-400">Limite:</span>
                              <p className="text-white">{alert.metrics.threshold} {alert.metrics.unit}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-400">Tipo:</span>
                              <p className="text-white capitalize">{alert.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Análise Detalhada */}
        {activeTab === 'analise' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              Análise Detalhada
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dicas Personalizadas */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Dicas Personalizadas
                </h3>
                
                <div className="space-y-3">
                  {aiInsights.personalizedTips.map((tip) => (
                    <div key={index} className="flex gap-3 p-3 bg-blue-900/20 rounded-lg">
                      <span className="text-lg">💡</span>
                      <p className="text-sm text-blue-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas Semanais */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Métricas da Semana</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume Total:</span>
                    <span className="font-semibold text-white">{aiInsights.weeklyAnalysis.totalVolume}kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Intensidade Média:</span>
                    <span className="font-semibold text-white">{aiInsights.weeklyAnalysis.averageIntensity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Score de Recuperação:</span>
                    <span className="font-semibold text-white">{aiInsights.weeklyAnalysis.recoveryScore}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tendência de Progresso:</span>
                    <div className="flex items-center gap-2">
                      <span>{getTrendIcon(aiInsights.weeklyAnalysis.progressTrend)}</span>
                      <span className="font-semibold text-white">
                        {aiInsights.weeklyAnalysis.progressTrend === 'improving' ? 'Melhorando' :
                         aiInsights.weeklyAnalysis.progressTrend === 'plateau' ? 'Estável' : 'Em Declínio'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationsPage; 