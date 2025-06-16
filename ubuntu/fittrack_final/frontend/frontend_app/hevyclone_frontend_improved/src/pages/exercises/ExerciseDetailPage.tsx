// src/pages/exercises/ExerciseDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exerciseService } from '../../services/exerciseService';
import { exerciseImageService } from '../../services/exerciseImageService';
import { exerciseStatsService, ExerciseStats } from '../../services/exerciseStatsService';
import { exerciseTranslations, muscleTranslations } from '../../utils/translations';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/card';
import { Exercise } from '../../types/exercise';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Award, 
  BarChart3,
  Clock,
  Target,
  Dumbbell,
  Play,
  Pause,
  Activity
} from 'lucide-react';

const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [stats, setStats] = useState<ExerciseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Carregar dados do exercício
        const exerciseData = await exerciseService.getById(id);
        setExercise(exerciseData);
        
        // Carregar estatísticas
        const exerciseStats = await exerciseStatsService.getExerciseStats(
          parseInt(id), 
          exerciseData.name
        );
        setStats(exerciseStats);
        
      } catch (err) {
        console.error('Erro ao carregar detalhes do exercício:', err);
        setError('Não foi possível carregar os detalhes deste exercício.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id]);

  // Função para traduzir nome do exercício
  const getTranslatedName = (originalName: string): string => {
    return exerciseTranslations[originalName] || originalName;
  };

  // Função para traduzir grupos musculares
  const getTranslatedMuscle = (muscleName: string): string => {
    return muscleTranslations[muscleName?.toLowerCase()] || muscleName;
  };

  // Função para obter imagens do exercício
  const getExerciseImages = () => {
    if (!exercise) return null;
    
    if (exercise.imageUrl || exercise.animationUrl) {
      return {
        static: exercise.imageUrl || exercise.animationUrl,
        animated: exercise.animationUrl || exercise.imageUrl
      };
    }
    
    return exerciseImageService.getExerciseImages(exercise.name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Carregando detalhes do exercício...</p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p className="text-gray-400 mb-6">{error || 'Exercício não encontrado.'}</p>
          <Link to="/exercises">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Voltar para Exercícios
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = getExerciseImages();
  const translatedName = getTranslatedName(exercise.name);
  const translatedPrimaryMuscle = getTranslatedMuscle(exercise.primaryMuscleGroupName || '');
  const translatedSecondaryMuscle = getTranslatedMuscle(exercise.secondaryMuscleGroupName || '');
  const translatedEquipment = exercise.equipmentName || 'Não especificado';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com navegação */}
        <div className="mb-8">
          <Link 
            to="/exercises" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Exercícios
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{translatedName}</h1>
              <p className="text-xl text-gray-400">{exercise.name !== translatedName && `(${exercise.name})`}</p>
            </div>
            
            <div className="flex gap-3">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Treino
              </Button>
              <Button variant="outline" className="border-gray-600 hover:border-purple-500">
                <Award className="w-4 h-4 mr-2" />
                Adicionar à Rotina
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Imagem/GIF do Exercício */}
            {images && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Demonstração</h2>
                    {images.static !== images.animated && (
                      <button
                        onClick={() => setIsAnimated(!isAnimated)}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        {isAnimated ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span className="text-sm">Pausar</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span className="text-sm">Animar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={isAnimated ? images.animated : images.static}
                      alt={translatedName}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    
                    {/* Overlay com informações */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">Equipamento:</span>
                          <span className="text-white font-medium">{translatedEquipment}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-300">Grupo Muscular:</span>
                          <span className="text-white font-medium">{translatedPrimaryMuscle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Estatísticas */}
            {stats && stats.totalWorkouts > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Estatísticas</h2>
                    <select 
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white rounded-lg px-3 py-1"
                    >
                      <option value="1month">Último mês</option>
                      <option value="3months">Últimos 3 meses</option>
                      <option value="6months">Últimos 6 meses</option>
                      <option value="1year">Último ano</option>
                    </select>
                  </div>

                  {/* Grid de Estatísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Recorde</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.heaviestWeight > 0 ? `${stats.heaviestWeight} kg` : 'Peso corporal'}
                      </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Último Treino</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.lastWeight > 0 ? `${stats.lastWeight} kg` : 'Peso corporal'}
                      </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Progresso</span>
                      </div>
                      <p className={`text-2xl font-bold ${stats.progressPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stats.progressPercentage >= 0 ? '+' : ''}{stats.progressPercentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Treinos</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
                    </div>
                  </div>

                  {/* Gráfico simples de progresso */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Progresso de Peso</h3>
                    <div className="space-y-2">
                      {stats.recentHistory.slice(-8).map((workout, index) => {
                        const maxWeight = Math.max(...stats.recentHistory.map(w => w.weight));
                        const percentage = maxWeight > 0 ? (workout.weight / maxWeight) * 100 : 0;
                        
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-16">{workout.date}</span>
                            <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-white w-12">
                              {workout.weight > 0 ? `${workout.weight}kg` : 'PC'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instruções */}
            {exercise.instructions && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Como Executar</h2>
                  <div className="space-y-3">
                    {exercise.instructions.split('\n').map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <p className="text-gray-300 leading-relaxed">{instruction.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dicas */}
            {exercise.tips && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Dicas Importantes</h2>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">{exercise.tips}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Exercício */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Informações</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Músculo Principal</p>
                      <p className="text-white font-medium">{translatedPrimaryMuscle}</p>
                    </div>
                  </div>
                  
                  {translatedSecondaryMuscle && (
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Músculo Secundário</p>
                        <p className="text-white font-medium">{translatedSecondaryMuscle}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Equipamento</p>
                      <p className="text-white font-medium">{translatedEquipment}</p>
                    </div>
                  </div>

                  {exercise.difficultyLevelName && (
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm text-gray-400">Dificuldade</p>
                        <p className="text-white font-medium">{exercise.difficultyLevelName}</p>
                      </div>
                    </div>
                  )}

                  {stats && stats.lastWorkoutDate !== 'Nunca' && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Último Treino</p>
                        <p className="text-white font-medium">{stats.lastWorkoutDate}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Treino
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 hover:border-purple-500">
                    <Award className="w-4 h-4 mr-2" />
                    Adicionar à Rotina
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Record */}
            {stats && stats.personalRecord.weight > 0 && (
              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold">Recorde Pessoal</h2>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400 mb-1">
                      {stats.personalRecord.weight} kg
                    </p>
                    <p className="text-gray-300 mb-2">
                      {stats.personalRecord.reps} repetições
                    </p>
                    <p className="text-sm text-gray-400">
                      {stats.personalRecord.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dados não disponíveis */}
            {(!stats || stats.totalWorkouts === 0) && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Sem dados disponíveis</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Comece a treinar este exercício para ver suas estatísticas aqui.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Registrar Primeiro Treino
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
