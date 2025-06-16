import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Medal,
  Target,
  Calendar,
  TrendingUp,
  Lock,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'workout' | 'social' | 'consistency' | 'strength' | 'endurance';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

const AchievementsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Mock data para conquistas
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Primeira Jornada',
      description: 'Complete seu primeiro treino',
      icon: '🎯',
      category: 'workout',
      rarity: 'bronze',
      points: 10,
      progress: 1,
      target: 1,
      unlocked: true,
      unlockedAt: '2024-01-01',
      requirement: 'Faça 1 treino'
    },
    {
      id: '2',
      title: 'Semana Perfeita',
      description: 'Treine por 7 dias consecutivos',
      icon: '🔥',
      category: 'consistency',
      rarity: 'silver',
      points: 50,
      progress: 5,
      target: 7,
      unlocked: false,
      requirement: 'Treine 7 dias seguidos'
    },
    {
      id: '3',
      title: 'Centurião',
      description: 'Complete 100 treinos',
      icon: '💪',
      category: 'workout',
      rarity: 'gold',
      points: 200,
      progress: 67,
      target: 100,
      unlocked: false,
      requirement: 'Faça 100 treinos'
    },
    {
      id: '4',
      title: 'Influenciador',
      description: 'Tenha 100 seguidores',
      icon: '👥',
      category: 'social',
      rarity: 'silver',
      points: 100,
      progress: 156,
      target: 100,
      unlocked: true,
      unlockedAt: '2024-01-10',
      requirement: 'Conquiste 100 seguidores'
    },
    {
      id: '5',
      title: 'Força Brutal',
      description: 'Levante 200kg no deadlift',
      icon: '🏋️‍♂️',
      category: 'strength',
      rarity: 'gold',
      points: 300,
      progress: 180,
      target: 200,
      unlocked: false,
      requirement: 'Deadlift com 200kg'
    },
    {
      id: '6',
      title: 'Maratonista',
      description: 'Corra por 60 minutos sem parar',
      icon: '🏃‍♂️',
      category: 'endurance',
      rarity: 'gold',
      points: 250,
      progress: 45,
      target: 60,
      unlocked: false,
      requirement: 'Corrida de 60 minutos'
    },
    {
      id: '7',
      title: 'Lenda do SAGA',
      description: 'Alcance o nível máximo',
      icon: '👑',
      category: 'workout',
      rarity: 'diamond',
      points: 1000,
      progress: 2847,
      target: 5000,
      unlocked: false,
      requirement: 'Acumule 5000 pontos XP'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas', icon: Trophy },
    { id: 'workout', label: 'Treinos', icon: Target },
    { id: 'consistency', label: 'Consistência', icon: Calendar },
    { id: 'social', label: 'Social', icon: Star },
    { id: 'strength', label: 'Força', icon: Medal },
    { id: 'endurance', label: 'Resistência', icon: TrendingUp }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'silver': return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
      case 'gold': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'platinum': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'diamond': return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'diamond': return <Crown className="w-5 h-5" />;
      case 'platinum': return <Award className="w-5 h-5" />;
      case 'gold': return <Trophy className="w-5 h-5" />;
      case 'silver': return <Medal className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = activeCategory === 'all' || achievement.category === activeCategory;
    const statusMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && statusMatch;
  });

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Conquistas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe seu progresso e desbloqueie novas conquistas
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-yellow-500 mb-1">
            <Trophy className="w-5 h-5" />
            <span className="text-2xl font-bold">{totalPoints}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pontos totais
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {unlockedCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Desbloqueadas
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {achievements.length - unlockedCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Bloqueadas
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Progresso
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {totalPoints}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pontos XP
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Show Unlocked Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Apenas desbloqueadas
            </span>
          </label>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => (
          <div key={achievement.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${
            achievement.unlocked ? '' : 'opacity-75'
          }`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                  {getRarityIcon(achievement.rarity)}
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </div>
              </div>

              {/* Title and Description */}
              <h3 className={`text-lg font-semibold mb-2 ${
                achievement.unlocked 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {achievement.description}
              </p>

              {/* Progress */}
              {!achievement.unlocked && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Progresso</span>
                    <span>{achievement.progress}/{achievement.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {achievement.unlocked ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Desbloqueada
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Bloqueada
                      </span>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    +{achievement.points}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    XP
                  </div>
                </div>
              </div>

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              {/* Requirement */}
              {!achievement.unlocked && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Requisito: {achievement.requirement}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma conquista encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tente ajustar os filtros ou comece a treinar para desbloquear conquistas!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage; 