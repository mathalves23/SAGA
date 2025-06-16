import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown, 
  Sword, 
  Shield,
  Coins,
  Gem,
  Users,
  Flame,
  Calendar,
  TrendingUp,
  Gift,
  Gamepad2
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  level: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  rank: {
    name: string;
    level: number;
    icon: string;
    color: string;
  };
  title: string;
  avatar: {
    baseModel: string;
    evolutionStage: number;
  };
  stats: {
    strength: number;
    endurance: number;
    flexibility: number;
    consistency: number;
    motivation: number;
    leadership: number;
  };
  achievements: Achievement[];
  currency: {
    coins: number;
    gems: number;
    tokens: number;
  };
  streaks: {
    workout: number;
    login: number;
    goal: number;
    social: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  experience: number;
  currency: number;
  unlockedAt?: string;
  progress: number;
  target: number;
  secret: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'event';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | 'legendary';
  progress: number;
  rewards: { type: string; amount?: number }[];
  timeLimit?: number;
}

export default function GamificationDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    username: 'FitnessWarrior',
    level: 42,
    experience: 2847,
    experienceToNext: 3200,
    totalExperience: 45847,
    rank: {
      name: 'Guerreiro',
      level: 50,
      icon: '⚔️',
      color: '#f59e0b',
    },
    title: 'Destruidor de Metas',
    avatar: {
      baseModel: 'warrior',
      evolutionStage: 3,
    },
    stats: {
      strength: 85,
      endurance: 72,
      flexibility: 68,
      consistency: 94,
      motivation: 88,
      leadership: 76,
    },
    achievements: [],
    currency: {
      coins: 12450,
      gems: 89,
      tokens: 15,
    },
    streaks: {
      workout: 23,
      login: 45,
      goal: 12,
      social: 8,
    },
  });

  const [activeQuests, setActiveQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Guerreiro Matinal',
      description: 'Complete 3 treinos antes das 10h',
      type: 'weekly',
      category: 'workout',
      difficulty: 'medium',
      progress: 66.7,
      rewards: [
        { type: 'experience', amount: 500 },
        { type: 'coins', amount: 200 },
      ],
      timeLimit: 72,
    },
    {
      id: '2',
      title: 'Mestre da Consistência',
      description: 'Mantenha um streak de 30 dias',
      type: 'monthly',
      category: 'consistency',
      difficulty: 'epic',
      progress: 76.7,
      rewards: [
        { type: 'experience', amount: 2000 },
        { type: 'gems', amount: 25 },
      ],
      timeLimit: 168,
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Interaja com 10 membros diferentes',
      type: 'weekly',
      category: 'social',
      difficulty: 'easy',
      progress: 80,
      rewards: [
        { type: 'experience', amount: 300 },
        { type: 'coins', amount: 150 },
      ],
      timeLimit: 48,
    },
  ]);

  const [recentAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Centurião',
      description: 'Complete 100 treinos',
      category: 'milestone',
      rarity: 'gold',
      icon: '🏆',
      experience: 1000,
      currency: 500,
      unlockedAt: '2024-12-07',
      progress: 100,
      target: 100,
      secret: false,
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Mantenha um streak de 20 dias',
      category: 'consistency',
      rarity: 'silver',
      icon: '🔥',
      experience: 500,
      currency: 250,
      unlockedAt: '2024-12-06',
      progress: 100,
      target: 20,
      secret: false,
    },
  ]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2',
      diamond: '#b9f2ff',
    };
    return colors[rarity as keyof typeof colors] || '#6b7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
      epic: '#8b5cf6',
      legendary: '#ec4899',
    };
    return colors[difficulty as keyof typeof colors] || '#6b7280';
  };

  const getStatIcon = (stat: string) => {
    const icons = {
      strength: <Sword className="w-5 h-5" />,
      endurance: <Target className="w-5 h-5" />,
      flexibility: <Zap className="w-5 h-5" />,
      consistency: <Calendar className="w-5 h-5" />,
      motivation: <Flame className="w-5 h-5" />,
      leadership: <Crown className="w-5 h-5" />,
    };
    return icons[stat as keyof typeof icons] || <Star className="w-5 h-5" />;
  };

  const getAvatarEmoji = (baseModel: string, evolutionStage: number) => {
    const avatars: { [key: string]: string[] } = {
      warrior: ['🧑‍💼', '🧑‍⚔️', '👨‍⚔️', '🦸‍♂️', '👑'],
      archer: ['🏹', '🧑‍🎯', '🎯', '🏆', '🌟'],
      mage: ['🧙‍♂️', '🔮', '✨', '⚡', '🌟'],
      monk: ['🧘‍♂️', '🕉️', '☯️', '🙏', '👼'],
      berserker: ['😤', '💪', '🔥', '⚔️', '👹'],
    };
    
    return avatars[baseModel]?.[evolutionStage - 1] || '🧑‍💼';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Gamepad2 className="w-10 h-10 text-blue-400" />
                Painel RPG
              </h1>
              <p className="text-slate-400">
                Evolua seu personagem, complete missões e torne-se uma lenda!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-slate-400 text-sm">Rank Global</p>
                <p className="text-2xl font-bold text-yellow-400">#247</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Perfil do Usuário */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-8 mb-8 border border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl">
                  {getAvatarEmoji(userProfile.avatar.baseModel, userProfile.avatar.evolutionStage)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1 border-2 border-amber-400">
                  <span className="text-sm">{userProfile.rank.icon}</span>
                </div>
              </div>

              {/* Informações do Usuário */}
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile.username}</h2>
                <p className="text-amber-300 font-semibold">{userProfile.title}</p>
                <p className="text-slate-300">{userProfile.rank.name} • Nível {userProfile.level}</p>
              </div>
            </div>

            {/* Moedas */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{userProfile.currency.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
                <Gem className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold">{userProfile.currency.gems}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2">
                <Star className="w-5 h-5 text-pink-400" />
                <span className="text-white font-bold">{userProfile.currency.tokens}</span>
              </div>
            </div>
          </div>

          {/* Barra de XP */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-semibold">Experiência</span>
              <span className="text-slate-300 text-sm">
                {userProfile.experience.toLocaleString()} / {userProfile.experienceToNext.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userProfile.experience / userProfile.experienceToNext) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atributos do Guerreiro */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                Atributos do Guerreiro
              </h3>

              <div className="space-y-4">
                {Object.entries(userProfile.stats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatIcon(key)}
                        <span className="text-white font-medium capitalize">
                          {key === 'strength' ? 'Força' :
                           key === 'endurance' ? 'Resistência' :
                           key === 'flexibility' ? 'Flexibilidade' :
                           key === 'consistency' ? 'Consistência' :
                           key === 'motivation' ? 'Motivação' :
                           key === 'leadership' ? 'Liderança' : key}
                        </span>
                      </div>
                      <span className="text-white font-bold">{value}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaks */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700 mt-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                Sequências Ativas
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-2xl font-bold text-white">{userProfile.streaks.workout}</div>
                  <div className="text-slate-400 text-sm">Treinos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div className="text-2xl font-bold text-white">{userProfile.streaks.login}</div>
                  <div className="text-slate-400 text-sm">Login</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-2xl font-bold text-white">{userProfile.streaks.goal}</div>
                  <div className="text-slate-400 text-sm">Metas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-2xl font-bold text-white">{userProfile.streaks.social}</div>
                  <div className="text-slate-400 text-sm">Social</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Missões e Conquistas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Missões Ativas */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-400" />
                  Missões Ativas
                </h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                  Ver Todas
                </button>
              </div>

              <div className="space-y-4">
                {activeQuests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-700/30 rounded-xl p-4 border border-slate-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-semibold">{quest.title}</h4>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: getDifficultyColor(quest.difficulty) }}
                          >
                            {quest.difficulty.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{quest.description}</p>
                      </div>
                      {quest.timeLimit && (
                        <div className="text-orange-400 text-sm font-semibold">
                          ⏰ {quest.timeLimit}h restantes
                        </div>
                      )}
                    </div>

                    {/* Progresso */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">Progresso</span>
                        <span className="text-white font-bold text-sm">{Math.round(quest.progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${quest.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Recompensas */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">Recompensas:</span>
                      {quest.rewards.map((reward, index) => (
                        <span key={index} className="text-white">
                          {reward.type === 'experience' && `🌟 ${reward.amount} XP`}
                          {reward.type === 'coins' && `💰 ${reward.amount} Moedas`}
                          {reward.type === 'gems' && `💎 ${reward.amount} Gemas`}
                        </span>
                      ))}
                    </div>

                    {quest.progress >= 100 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        🎁 Coletar Recompensa
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conquistas Recentes */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Conquistas Recentes
                </h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                  Ver Todas
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {recentAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-4 border-l-4"
                      style={{ borderLeftColor: getRarityColor(achievement.rarity) }}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: getRarityColor(achievement.rarity) + '30' }}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold">{achievement.title}</h4>
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                            >
                              {achievement.rarity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">🌟 +{achievement.experience} XP</div>
                          <div className="text-blue-400 font-bold">💰 +{achievement.currency}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Entrar em Guilda
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Rankings
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Loja de Itens
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 