import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

interface Stat {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Iniciar Treino',
      icon: 'fitness',
      color: '#ef4444',
      onPress: () => console.log('Iniciar treino'),
    },
    {
      id: '2',
      title: 'Registrar Peso',
      icon: 'scale',
      color: '#3b82f6',
      onPress: () => console.log('Registrar peso'),
    },
    {
      id: '3',
      title: 'Adicionar Refeição',
      icon: 'restaurant',
      color: '#10b981',
      onPress: () => console.log('Adicionar refeição'),
    },
    {
      id: '4',
      title: 'Ver Progresso',
      icon: 'trending-up',
      color: '#8b5cf6',
      onPress: () => console.log('Ver progresso'),
    },
  ];

  const todayStats: Stat[] = [
    {
      label: 'Treinos',
      value: '1',
      icon: 'fitness',
      color: '#ef4444',
    },
    {
      label: 'Calorias',
      value: '1,850',
      icon: 'flame',
      color: '#f59e0b',
    },
    {
      label: 'Água',
      value: '2.1L',
      icon: 'water',
      color: '#06b6d4',
    },
    {
      label: 'Passos',
      value: '8,432',
      icon: 'walk',
      color: '#10b981',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header com saudação */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Ações rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="#ffffff" />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Estatísticas do dia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hoje</Text>
        <View style={styles.statsGrid}>
          {todayStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Ionicons name={stat.icon} size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Próximo treino */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximo Treino</Text>
        <View style={styles.nextWorkoutCard}>
          <View style={styles.nextWorkoutHeader}>
            <View>
              <Text style={styles.nextWorkoutTitle}>Treino de Peito e Tríceps</Text>
              <Text style={styles.nextWorkoutTime}>Hoje, 18:00</Text>
            </View>
            <TouchableOpacity style={styles.startWorkoutButton}>
              <Text style={styles.startWorkoutButtonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.nextWorkoutDetails}>
            <View style={styles.workoutDetail}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text style={styles.workoutDetailText}>45 min</Text>
            </View>
            <View style={styles.workoutDetail}>
              <Ionicons name="fitness-outline" size={16} color="#6b7280" />
              <Text style={styles.workoutDetailText}>8 exercícios</Text>
            </View>
            <View style={styles.workoutDetail}>
              <Ionicons name="trending-up-outline" size={16} color="#6b7280" />
              <Text style={styles.workoutDetailText}>Intermediário</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conquistas recentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Ionicons name="trophy" size={24} color="#f59e0b" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Primeira Semana Completa!</Text>
            <Text style={styles.achievementDescription}>
              Parabéns! Você completou sua primeira semana de treinos.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  nextWorkoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextWorkoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  nextWorkoutTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  startWorkoutButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  startWorkoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  nextWorkoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#fef3c7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default HomeScreen; 