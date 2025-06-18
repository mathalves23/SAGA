import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  BoltIcon,
  ChartBarIcon,
  UserGroupIcon,
  GiftIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
  CrownIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
  TargetIcon,
  HeartIcon,
  CalendarDaysIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophyIconSolid,
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'strength' | 'endurance' | 'consistency' | 'social' | 'milestone';
  xpReward: number;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  duration: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  xpReward: number;
  deadline: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
}

interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: number;
  totalUsers: number;
  streak: number;
  maxStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  achievements: number;
  badges: string[];
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  rank: number;
  isCurrentUser?: boolean;
}

const GamificationPage: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'challenges' | 'leaderboard'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strength' | 'endurance' | 'consistency' | 'social' | 'milestone'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setUserStats({
        level: 12,
        xp: 2450,
        nextLevelXp: 3000,
        rank: 127,
        totalUsers: 15420,
        streak: 7,
        maxStreak: 23,
        totalWorkouts: 156,
        totalMinutes: 8740,
        achievements: 24,
        badges: ['fire-starter', 'consistency-king', 'strength-master']
      });

      setAchievements([
        {
          id: '1',
          name: 'Primeira Conquista',
          description: 'Complete seu primeiro treino',
          icon: TrophyIcon,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          progress: 1,
          maxProgress: 1,
          isUnlocked: true,
          unlockedAt: new Date('2024-11-15'),
          rarity: 'common',
          category: 'milestone',
          xpReward: 50
        },
        {
          id: '2',
          name: 'Streak de Fogo',
          description: 'Treine por 7 dias consecutivos',
          icon: FireIcon,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          progress: 7,
          maxProgress: 7,
          isUnlocked: true,
          unlockedAt: new Date('2024-12-01'),
          rarity: 'rare',
          category: 'consistency',
          xpReward: 150
        },
        {
          id: '3',
          name: 'Força Titânica',
          description: 'Levante 100kg no supino',
          icon: BoltIcon,
          iconColor: 'text-purple-500',
          bgColor: 'bg-purple-50',
          progress: 87.5,
          maxProgress: 100,
          isUnlocked: false,
          rarity: 'epic',
          category: 'strength',
          xpReward: 300
        },
        {
          id: '4',
          name: 'Maratonista',
          description: 'Complete 100 treinos',
          icon: StarIcon,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          progress: 156,
          maxProgress: 100,
          isUnlocked: true,
          unlockedAt: new Date('2024-12-10'),
          rarity: 'epic',
          category: 'endurance',
          xpReward: 250
        },
        {
          id: '5',
          name: 'Lenda',
          description: 'Alcance o nível 20',
          icon: CrownIcon,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          progress: 12,
          maxProgress: 20,
          isUnlocked: false,
          rarity: 'legendary',
          category: 'milestone',
          xpReward: 500
        }
      ]);

      setChallenges([
        {
          id: '1',
          name: 'Treino Diário',
          description: 'Complete um treino hoje',
          type: 'daily',
          duration: 1,
          progress: 1,
          maxProgress: 1,
          isCompleted: true,
          xpReward: 25,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          difficulty: 'easy',
          participants: 1250
        },
        {
          id: '2',
          name: 'Semana Completa',
          description: 'Treine 5 vezes esta semana',
          type: 'weekly',
          duration: 7,
          progress: 3,
          maxProgress: 5,
          isCompleted: false,
          xpReward: 100,
          deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          difficulty: 'medium',
          participants: 890
        },
        {
          id: '3',
          name: 'Mestre do Mês',
          description: 'Complete 20 treinos este mês',
          type: 'monthly',
          duration: 30,
          progress: 12,
          maxProgress: 20,
          isCompleted: false,
          xpReward: 300,
          deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          difficulty: 'hard',
          participants: 450
        },
        {
          id: '4',
          name: 'Desafio de Natal',
          description: 'Treine 25 dias em dezembro',
          type: 'special',
          duration: 31,
          progress: 18,
          maxProgress: 25,
          isCompleted: false,
          xpReward: 500,
          deadline: new Date('2024-12-31'),
          difficulty: 'hard',
          participants: 2300
        }
      ]);

      setLeaderboard([
        { id: '1', name: 'Carlos Silva', avatar: '👑', level: 25, xp: 8950, streak: 45, rank: 1 },
        { id: '2', name: 'Ana Santos', avatar: '🔥', level: 23, xp: 7820, streak: 32, rank: 2 },
        { id: '3', name: 'Pedro Lima', avatar: '💪', level: 22, xp: 7450, streak: 28, rank: 3 },
        { id: '4', name: 'Mariana Costa', avatar: '⭐', level: 21, xp: 6890, streak: 15, rank: 4 },
        { id: '5', name: 'Você', avatar: '🎯', level: 12, xp: 2450, streak: 7, rank: 127, isCurrentUser: true }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: Challenge['type']) => {
    switch (type) {
      case 'daily': return ClockIcon;
      case 'weekly': return CalendarDaysIcon;
      case 'monthly': return TargetIcon;
      case 'special': return SparklesIcon;
      default: return FlagIcon;
    }
  };

  const LevelProgress = ({ level, xp, nextLevelXp }: { level: number; xp: number; nextLevelXp: number }) => {
    const progress = (xp / nextLevelXp) * 100;
    
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold">
          {level}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900">Nível {level}</span>
            <span className="text-sm text-gray-600">{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const Icon = achievement.icon;
    const progress = Math.min((achievement.progress / achievement.maxProgress) * 100, 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`relative p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)} ${
          achievement.isUnlocked ? 'opacity-100' : 'opacity-60'
        }`}
      >
        {achievement.isUnlocked ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-4 w-4 text-white" />
          </div>
        )}
        
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
            <Icon className={`h-6 w-6 ${achievement.iconColor}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
            <p className="text-sm text-gray-600">{achievement.description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">
              {achievement.progress} / {achievement.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded capitalize ${getRarityColor(achievement.rarity)}`}>
              {achievement.rarity}
            </span>
            <span className="text-sm font-medium text-purple-600">
              +{achievement.xpReward} XP
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const Icon = getTypeIcon(challenge.type);
    const progress = Math.min((challenge.progress / challenge.maxProgress) * 100, 100);
    const timeLeft = Math.max(0, challenge.deadline.getTime() - Date.now());
    const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl border-2 ${
          challenge.isCompleted 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-200 bg-white'
        } shadow-sm`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              challenge.isCompleted ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              <Icon className={`h-5 w-5 ${
                challenge.isCompleted ? 'text-green-600' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{challenge.name}</h4>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {challenge.participants.toLocaleString()} participantes
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">
              {challenge.progress} / {challenge.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className={`h-2 rounded-full ${
                challenge.isCompleted 
                  ? 'bg-green-500' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expirado'}
            </span>
            <span className="text-sm font-medium text-purple-600">
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gamificação</h1>
                <p className="text-gray-600">Conquistas, desafios e ranking</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['overview', 'achievements', 'challenges', 'leaderboard'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                      selectedTab === tab
                        ? 'bg-white text-purple-600 shadow-sm'
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
        {/* User Stats Overview */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LevelProgress 
                  level={userStats.level} 
                  xp={userStats.xp} 
                  nextLevelXp={userStats.nextLevelXp} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{userStats.rank}</div>
                  <div className="text-sm text-gray-600">Posição</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 flex items-center justify-center">
                    {userStats.streak}
                    <FireIconSolid className="h-6 w-6 ml-1" />
                  </div>
                  <div className="text-sm text-gray-600">Sequência</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <TrophyIconSolid className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats?.achievements}</div>
                  <div className="text-sm text-gray-600">Conquistas</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <FireIconSolid className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats?.maxStreak}</div>
                  <div className="text-sm text-gray-600">Melhor Sequência</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <BoltIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{userStats?.totalWorkouts}</div>
                  <div className="text-sm text-gray-600">Treinos Totais</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <ClockIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor((userStats?.totalMinutes || 0) / 60)}h
                  </div>
                  <div className="text-sm text-gray-600">Tempo Total</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conquistas Recentes</h3>
                  <div className="space-y-4">
                    {achievements.filter(a => a.isUnlocked).slice(0, 3).map(achievement => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Desafios Ativos</h3>
                  <div className="space-y-4">
                    {challenges.filter(c => !c.isCompleted).slice(0, 3).map(challenge => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Conquistas</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['all', 'strength', 'endurance', 'consistency', 'social', 'milestone'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                        selectedCategory === category
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements
                  .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                  .map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">Desafios</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900">Ranking</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="space-y-1">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 flex items-center justify-between ${
                        user.isCurrentUser 
                          ? 'bg-purple-50 border-l-4 border-purple-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">Nível {user.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{user.xp.toLocaleString()} XP</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <FireIconSolid className="h-4 w-4 text-red-500 mr-1" />
                          {user.streak}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamificationPage; 