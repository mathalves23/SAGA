import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Search, 
  UserPlus, 
  Crown,
  Medal,
  Star,
  Activity,
  MessageCircle
} from 'lucide-react';

interface SocialStats {
  followers: number;
  following: number;
  workoutShares: number;
  ranking: number;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastWorkout: string;
  totalWorkouts: number;
  ranking: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedBy: string;
  timeAgo: string;
}

const SocialPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const socialStats: SocialStats = {
    followers: 156,
    following: 89,
    workoutShares: 127,
    ranking: 15
  };

  const friends: Friend[] = [
    {
      id: '1',
      name: 'Ana Silva',
      username: '@anasilva',
      avatar: 'A',
      isOnline: true,
      lastWorkout: '2h atrás',
      totalWorkouts: 234,
      ranking: 8
    },
    {
      id: '2',
      name: 'Carlos Santos',
      username: '@carlosfit',
      avatar: 'C',
      isOnline: false,
      lastWorkout: '1d atrás',
      totalWorkouts: 187,
      ranking: 12
    },
    {
      id: '3',
      name: 'Juliana Costa',
      username: '@ju_fitness',
      avatar: 'J',
      isOnline: true,
      lastWorkout: '30min atrás',
      totalWorkouts: 298,
      ranking: 4
    }
  ];

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Sequência de Ferro',
      description: 'Completou 30 dias consecutivos',
      icon: '🔥',
      rarity: 'epic',
      unlockedBy: 'Ana Silva',
      timeAgo: '2h atrás'
    },
    {
      id: '2',
      title: 'Levantador Pesado',
      description: 'Levantou 200kg no deadlift',
      icon: '🏋️‍♂️',
      rarity: 'rare',
      unlockedBy: 'Carlos Santos',
      timeAgo: '4h atrás'
    },
    {
      id: '3',
      title: 'Maratonista',
      description: 'Correu por 60 minutos sem parar',
      icon: '🏃‍♀️',
      rarity: 'common',
      unlockedBy: 'Juliana Costa',
      timeAgo: '6h atrás'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
      case 'epic': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'rare': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking <= 3) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (ranking <= 10) return <Medal className="w-5 h-5 text-gray-400" />;
    return <Trophy className="w-5 h-5 text-bronze-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Social
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Conecte-se com sua comunidade fitness
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <UserPlus className="w-4 h-4" />
          Encontrar Pessoas
        </button>
      </div>

      {/* Social Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {socialStats.followers}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Seguidores
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {socialStats.following}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Seguindo
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {socialStats.workoutShares}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Treinos Compartilhados
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2">
            {getRankingIcon(socialStats.ranking)}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            #{socialStats.ranking}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ranking
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'friends', label: 'Amigos', icon: Users },
            { id: 'achievements', label: 'Conquistas', icon: Trophy },
            { id: 'ranking', label: 'Ranking', icon: Crown }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Atividade Recente
                </h3>
                <div className="space-y-3">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {achievement.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.unlockedBy} • {achievement.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar amigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{friend.avatar}</span>
                        </div>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {friend.name}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {friend.username}
                          </span>
                          {getRankingIcon(friend.ranking)}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{friend.ranking}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {friend.totalWorkouts} treinos • Último: {friend.lastWorkout}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholders */}
          {activeTab === 'achievements' && (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Conquistas da Comunidade
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe as conquistas recentes dos seus amigos
              </p>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="text-center py-8">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ranking Global
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Veja sua posição no ranking global do SAGA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialPage; 