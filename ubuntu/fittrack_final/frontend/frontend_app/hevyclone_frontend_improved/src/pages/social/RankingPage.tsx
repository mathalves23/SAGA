import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  FireIcon, 
  BoltIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface FriendRanking {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  workoutsThisWeek: number;
  streakDays: number;
  badges: number;
  rank: number;
  change: number; // +1, -1, 0
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  prize: string;
  endDate: string;
  type: 'workout' | 'streak' | 'social';
  progress: number;
  maxProgress: number;
}

const RankingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'challenges' | 'groups'>('ranking');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  
  const [friends] = useState<FriendRanking[]>([
    {
      id: '1',
      name: 'Ana Silva',
      avatar: '👩‍🦱',
      level: 15,
      xp: 12450,
      workoutsThisWeek: 5,
      streakDays: 14,
      badges: 8,
      rank: 1,
      change: 0
    },
    {
      id: '2',
      name: 'Pedro Costa',
      avatar: '👨‍💼',
      level: 14,
      xp: 11890,
      workoutsThisWeek: 4,
      streakDays: 21,
      badges: 12,
      rank: 2,
      change: 1
    },
    {
      id: '3',
      name: 'Você',
      avatar: '😎',
      level: 13,
      xp: 10340,
      workoutsThisWeek: 3,
      streakDays: 7,
      badges: 6,
      rank: 3,
      change: -1
    },
    {
      id: '4',
      name: 'Maria Santos',
      avatar: '👩‍💻',
      level: 12,
      xp: 9870,
      workoutsThisWeek: 6,
      streakDays: 5,
      badges: 9,
      rank: 4,
      change: 2
    },
    {
      id: '5',
      name: 'João Oliveira',
      avatar: '👨‍🎓',
      level: 11,
      xp: 8900,
      workoutsThisWeek: 2,
      streakDays: 3,
      badges: 4,
      rank: 5,
      change: -1
    }
  ]);

  const [challenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Semana do Ferro',
      description: 'Complete 5 treinos de força nesta semana',
      participants: 24,
      prize: '500 XP + Badge Exclusive',
      endDate: '2024-12-15',
      type: 'workout',
      progress: 3,
      maxProgress: 5
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Mantenha uma sequência de 10 dias',
      participants: 18,
      prize: '1000 XP + Título Especial',
      endDate: '2024-12-20',
      type: 'streak',
      progress: 7,
      maxProgress: 10
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Interaja com 20 posts de amigos',
      participants: 31,
      prize: '300 XP + Badge Social',
      endDate: '2024-12-18',
      type: 'social',
      progress: 12,
      maxProgress: 20
    }
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <span className="text-green-400">↗ +{change}</span>;
    if (change < 0) return <span className="text-red-400">↘ {change}</span>;
    return <span className="text-gray-400">–</span>;
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <BoltIcon className="w-5 h-5 text-orange-400" />;
      case 'streak': return <FireIcon className="w-5 h-5 text-red-400" />;
      case 'social': return <UserGroupIcon className="w-5 h-5 text-blue-400" />;
      default: return <ChartBarIcon className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🏆 Ranking & Desafios
          </h1>
          <p className="text-[#8b8b8b] text-lg">
            Compete com amigos, participe de desafios e suba no ranking!
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-[#1a1a1b] p-1 rounded-lg w-fit border border-[#2d2d30]">
            {[
              { id: 'ranking', label: 'Ranking', icon: '🏅' },
              { id: 'challenges', label: 'Desafios', icon: '🎯' },
              { id: 'groups', label: 'Grupos', icon: '👥' }
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

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { id: 'week', label: 'Esta Semana' },
                { id: 'month', label: 'Este Mês' },
                { id: 'all', label: 'Geral' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeFilter(filter.id as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeFilter === filter.id
                      ? 'bg-[#2d2d30] text-white border border-purple-500'
                      : 'bg-[#1a1a1b] text-[#8b8b8b] border border-[#2d2d30] hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Ranking List */}
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`bg-[#1a1a1b] border rounded-xl p-6 transition-all hover:border-purple-500 ${
                    friend.name === 'Você' 
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
                      : 'border-[#2d2d30]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-white min-w-[60px]">
                        {getRankIcon(friend.rank)}
                      </div>
                      <div className="text-4xl">{friend.avatar}</div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          friend.name === 'Você' ? 'text-purple-400' : 'text-white'
                        }`}>
                          {friend.name}
                        </h3>
                        <p className="text-[#8b8b8b] text-sm">Nível {friend.level}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{friend.xp.toLocaleString()}</div>
                        <div className="text-xs text-[#8b8b8b]">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{friend.workoutsThisWeek}</div>
                        <div className="text-xs text-[#8b8b8b]">Treinos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-400">{friend.streakDays}</div>
                        <div className="text-xs text-[#8b8b8b]">Sequência</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{friend.badges}</div>
                        <div className="text-xs text-[#8b8b8b]">Badges</div>
                      </div>
                      <div className="text-center min-w-[60px]">
                        {getChangeIcon(friend.change)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    {getChallengeTypeIcon(challenge.type)}
                    <span className="text-xs bg-[#2d2d30] text-[#8b8b8b] px-2 py-1 rounded-full">
                      {challenge.participants} participantes
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                  <p className="text-[#8b8b8b] text-sm mb-4">{challenge.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#8b8b8b]">Progresso</span>
                      <span className="text-white">{challenge.progress}/{challenge.maxProgress}</span>
                    </div>
                    <div className="w-full bg-[#2d2d30] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-[#8b8b8b] mb-4">
                    <span className="font-medium text-white">Prêmio:</span> {challenge.prize}
                  </div>

                  <div className="text-xs text-[#8b8b8b] mb-4">
                    Termina em: {new Date(challenge.endDate).toLocaleDateString('pt-BR')}
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                    {challenge.progress >= challenge.maxProgress ? 'Resgatar Prêmio' : 'Continuar Desafio'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="text-center py-16">
            <UserGroupIcon className="w-16 h-16 text-[#8b8b8b] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Grupos de Treino</h3>
            <p className="text-[#8b8b8b] mb-6">
              Crie ou participe de grupos para treinar com amigos
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
              Criar Grupo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage; 