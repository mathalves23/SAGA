import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamificationService } from '../../services/gamificationService';

const { width, height } = Dimensions.get('window');

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
  achievements: any[];
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

interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  difficulty: string;
  progress: number;
  rewards: { type: string; amount?: number }[];
  timeLimit?: number;
}

export default function GamificationHomeScreen({ navigation }: any) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeGamification();
  }, []);

  const initializeGamification = async () => {
    try {
      await gamificationService.initialize();
      loadUserData();
    } catch (error) {
      console.error('Erro ao inicializar gamificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = () => {
    const profile = gamificationService.getUserProfile();
    const quests = gamificationService.getActiveQuests();
    
    setUserProfile(profile);
    setActiveQuests(quests);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeGamification();
    setRefreshing(false);
  };

  const handleClaimReward = async (questId: string) => {
    Alert.alert(
      '🎁 Recompensa Coletada!',
      'Você ganhou XP e moedas!',
      [{ text: 'Incrível!', onPress: loadUserData }]
    );
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const formatTimeRemaining = (timeLimit?: number) => {
    if (!timeLimit) return '';
    const hours = Math.floor(timeLimit);
    const minutes = Math.floor((timeLimit - hours) * 60);
    return `${hours}h ${minutes}m restantes`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="casino" size={50} color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando Perfil RPG...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={50} color="#ef4444" />
          <Text style={styles.errorText}>Erro ao carregar perfil</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeGamification}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com perfil do usuário */}
        <LinearGradient
          colors={[userProfile.rank.color + '90', userProfile.rank.color + '60']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>
                {getAvatarEmoji(userProfile.avatar.baseModel, userProfile.avatar.evolutionStage)}
              </Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankIcon}>{userProfile.rank.icon}</Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{userProfile.username}</Text>
              <Text style={styles.title}>{userProfile.title}</Text>
              <Text style={styles.rankName}>{userProfile.rank.name}</Text>
            </View>

            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('ProfileCustomization')}
            >
              <MaterialIcons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Barra de XP */}
          <View style={styles.xpContainer}>
            <View style={styles.xpInfo}>
              <Text style={styles.xpText}>Nível {userProfile.level}</Text>
              <Text style={styles.xpNumbers}>
                {userProfile.experience} / {userProfile.experienceToNext} XP
              </Text>
            </View>
            <View style={styles.xpBarContainer}>
              <View 
                style={[
                  styles.xpBar, 
                  { 
                    width: `${(userProfile.experience / userProfile.experienceToNext) * 100}%`,
                    backgroundColor: userProfile.rank.color 
                  }
                ]} 
              />
            </View>
          </View>
        </LinearGradient>

        {/* Stats do jogador */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Atributos do Guerreiro</Text>
          <View style={styles.statsGrid}>
            {Object.entries(userProfile.stats).map(([key, value], index) => (
              <View key={key} style={styles.statItem}>
                <Text style={styles.statIcon}>
                  {getStatIcon(key)}
                </Text>
                <Text style={styles.statName}>{getStatName(key)}</Text>
                <View style={styles.statBarContainer}>
                  <View 
                    style={[
                      styles.statBar, 
                      { width: `${Math.min(value * 10, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Moedas */}
        <View style={styles.currencyContainer}>
          <TouchableOpacity 
            style={styles.currencyItem}
            onPress={() => navigation.navigate('Shop')}
          >
            <MaterialIcons name="monetization-on" size={24} color="#f59e0b" />
            <Text style={styles.currencyValue}>{userProfile.currency.coins}</Text>
            <Text style={styles.currencyLabel}>Moedas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.currencyItem}
            onPress={() => navigation.navigate('Shop')}
          >
            <FontAwesome5 name="gem" size={20} color="#8b5cf6" />
            <Text style={styles.currencyValue}>{userProfile.currency.gems}</Text>
            <Text style={styles.currencyLabel}>Gemas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.currencyItem}
            onPress={() => navigation.navigate('EventShop')}
          >
            <MaterialIcons name="stars" size={24} color="#ec4899" />
            <Text style={styles.currencyValue}>{userProfile.currency.tokens}</Text>
            <Text style={styles.currencyLabel}>Tokens</Text>
          </TouchableOpacity>
        </View>

        {/* Streaks */}
        <View style={styles.streaksContainer}>
          <Text style={styles.sectionTitle}>🔥 Sequências Ativas</Text>
          <View style={styles.streaksGrid}>
            <View style={styles.streakItem}>
              <Text style={styles.streakIcon}>💪</Text>
              <Text style={styles.streakValue}>{userProfile.streaks.workout}</Text>
              <Text style={styles.streakLabel}>Treinos</Text>
            </View>
            <View style={styles.streakItem}>
              <Text style={styles.streakIcon}>📱</Text>
              <Text style={styles.streakValue}>{userProfile.streaks.login}</Text>
              <Text style={styles.streakLabel}>Login</Text>
            </View>
            <View style={styles.streakItem}>
              <Text style={styles.streakIcon}>🎯</Text>
              <Text style={styles.streakValue}>{userProfile.streaks.goal}</Text>
              <Text style={styles.streakLabel}>Metas</Text>
            </View>
            <View style={styles.streakItem}>
              <Text style={styles.streakIcon}>👥</Text>
              <Text style={styles.streakValue}>{userProfile.streaks.social}</Text>
              <Text style={styles.streakLabel}>Social</Text>
            </View>
          </View>
        </View>

        {/* Missões ativas */}
        <View style={styles.questsContainer}>
          <View style={styles.questsHeader}>
            <Text style={styles.sectionTitle}>⚔️ Missões Ativas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('QuestBook')}>
              <Text style={styles.viewAllText}>Ver Todas</Text>
            </TouchableOpacity>
          </View>

          {activeQuests.slice(0, 3).map((quest) => (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questHeader}>
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDescription}>{quest.description}</Text>
                </View>
                <View 
                  style={[
                    styles.difficultyBadge, 
                    { backgroundColor: getDifficultyColor(quest.difficulty) }
                  ]}
                >
                  <Text style={styles.difficultyText}>{quest.difficulty.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.questProgress}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${quest.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(quest.progress)}%</Text>
              </View>

              <View style={styles.questRewards}>
                <Text style={styles.rewardsLabel}>Recompensas:</Text>
                <View style={styles.rewardsList}>
                  {quest.rewards.map((reward, index) => (
                    <Text key={index} style={styles.rewardItem}>
                      {reward.type === 'experience' && `🌟 ${reward.amount} XP`}
                      {reward.type === 'coins' && `💰 ${reward.amount} Moedas`}
                      {reward.type === 'gems' && `💎 ${reward.amount} Gemas`}
                    </Text>
                  ))}
                </View>
              </View>

              {quest.timeLimit && (
                <Text style={styles.timeRemaining}>
                  ⏰ {formatTimeRemaining(quest.timeLimit)}
                </Text>
              )}

              {quest.progress >= 100 && (
                <TouchableOpacity 
                  style={styles.claimButton}
                  onPress={() => handleClaimReward(quest.id)}
                >
                  <Text style={styles.claimButtonText}>🎁 Coletar Recompensa</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Botões de navegação */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Achievements')}
          >
            <MaterialIcons name="emoji-events" size={30} color="#f59e0b" />
            <Text style={styles.navButtonText}>Conquistas</Text>
            <Text style={styles.navButtonSubtext}>{userProfile.achievements.length} desbloqueadas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Leaderboards')}
          >
            <FontAwesome5 name="trophy" size={26} color="#ef4444" />
            <Text style={styles.navButtonText}>Rankings</Text>
            <Text style={styles.navButtonSubtext}>Ver posição</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Guild')}
          >
            <FontAwesome5 name="users" size={26} color="#8b5cf6" />
            <Text style={styles.navButtonText}>Guilda</Text>
            <Text style={styles.navButtonSubtext}>Junte-se</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Equipment')}
          >
            <MaterialIcons name="inventory" size={30} color="#10b981" />
            <Text style={styles.navButtonText}>Equipamentos</Text>
            <Text style={styles.navButtonSubtext}>Customize</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatIcon = (stat: string) => {
  const icons: { [key: string]: string } = {
    strength: '💪',
    endurance: '🏃‍♂️',
    flexibility: '🤸‍♂️',
    consistency: '📅',
    motivation: '🔥',
    leadership: '👑',
  };
  return icons[stat] || '⭐';
};

const getStatName = (stat: string) => {
  const names: { [key: string]: string } = {
    strength: 'Força',
    endurance: 'Resistência',
    flexibility: 'Flexibilidade',
    consistency: 'Consistência',
    motivation: 'Motivação',
    leadership: 'Liderança',
  };
  return names[stat] || stat;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankIcon: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 2,
  },
  rankName: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  xpContainer: {
    marginTop: 12,
  },
  xpInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  xpNumbers: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBar: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  statName: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
  statBarContainer: {
    flex: 2,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  statValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  currencyItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  currencyValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  currencyLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  streaksContainer: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
  },
  streaksGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  streakValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  questsContainer: {
    margin: 20,
  },
  questsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  questCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questInfo: {
    flex: 1,
    marginRight: 12,
  },
  questTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  questRewards: {
    marginBottom: 8,
  },
  rewardsLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rewardItem: {
    color: 'white',
    fontSize: 12,
    marginRight: 12,
    marginBottom: 2,
  },
  timeRemaining: {
    color: '#f59e0b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  claimButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  claimButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 20,
    gap: 12,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 52) / 2,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  navButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
  },
}); 