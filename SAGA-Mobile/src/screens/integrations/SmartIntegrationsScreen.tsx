import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Switch,
  RefreshControl,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { smartIntegrationsService } from '../../services/smartIntegrationsService';

const { width } = Dimensions.get('window');

interface SpotifyIntegration {
  isConnected: boolean;
  userProfile?: {
    display_name: string;
    followers: { total: number };
  };
  playlists: any[];
}

interface SocialIntegration {
  platform: string;
  isConnected: boolean;
  userProfile?: {
    username: string;
    followerCount?: number;
  };
  autoShare: boolean;
}

interface NearbyGym {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  workoutTypes: string[];
}

interface AIRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: number;
  data: any;
}

export default function SmartIntegrationsScreen({ navigation }: any) {
  const [spotifyIntegration, setSpotifyIntegration] = useState<SpotifyIntegration>({ isConnected: false, playlists: [] });
  const [socialIntegrations, setSocialIntegrations] = useState<SocialIntegration[]>([]);
  const [nearbyGyms, setNearbyGyms] = useState<NearbyGym[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeIntegrations();
  }, []);

  const initializeIntegrations = async () => {
    try {
      await smartIntegrationsService.initialize();
      loadIntegrationsData();
    } catch (error) {
      console.error('Erro ao inicializar integrações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrationsData = async () => {
    const spotify = smartIntegrationsService.getSpotifyIntegration();
    const social = smartIntegrationsService.getSocialIntegrations();
    const gyms = smartIntegrationsService.getNearbyGyms();
    const recommendations = smartIntegrationsService.getAIRecommendations();

    setSpotifyIntegration(spotify);
    setSocialIntegrations(social);
    setNearbyGyms(gyms);
    setAIRecommendations(recommendations);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeIntegrations();
    await smartIntegrationsService.findNearbyGyms();
    await loadIntegrationsData();
    setRefreshing(false);
  };

  const handleSpotifyConnect = async () => {
    try {
      const success = await smartIntegrationsService.connectSpotify();
      if (success) {
        Alert.alert('🎵 Sucesso!', 'Spotify conectado com sucesso!');
        loadIntegrationsData();
      } else {
        Alert.alert('❌ Erro', 'Falha ao conectar com o Spotify');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Erro ao conectar com o Spotify');
    }
  };

  const handleSocialConnect = async (platform: 'instagram' | 'facebook' | 'strava') => {
    try {
      const success = await smartIntegrationsService.connectSocialPlatform(platform);
      if (success) {
        Alert.alert('📱 Sucesso!', `${platform} conectado com sucesso!`);
        loadIntegrationsData();
      } else {
        Alert.alert('❌ Erro', `Falha ao conectar com ${platform}`);
      }
    } catch (error) {
      Alert.alert('❌ Erro', `Erro ao conectar com ${platform}`);
    }
  };

  const handleGymNavigation = async (gymId: string) => {
    await smartIntegrationsService.getGymRoute(gymId);
  };

  const handleGymFavorite = async (gymId: string) => {
    await smartIntegrationsService.saveGymAsFavorite(gymId);
    Alert.alert('⭐ Favorito!', 'Academia salva como favorita');
  };

  const renderSpotifySection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <FontAwesome5 name="spotify" size={24} color="#1db954" />
          <Text style={styles.sectionTitle}>Spotify</Text>
        </View>
        {!spotifyIntegration.isConnected ? (
          <TouchableOpacity style={styles.connectButton} onPress={handleSpotifyConnect}>
            <Text style={styles.connectButtonText}>Conectar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.connectedBadge}>
            <MaterialIcons name="check-circle" size={16} color="#10b981" />
            <Text style={styles.connectedText}>Conectado</Text>
          </View>
        )}
      </View>

      {spotifyIntegration.isConnected && (
        <View style={styles.integrationContent}>
          <Text style={styles.userInfo}>
            👤 {spotifyIntegration.userProfile?.display_name}
          </Text>
          <Text style={styles.userStats}>
            🎵 {spotifyIntegration.playlists.length} playlists de treino
          </Text>

          <View style={styles.playlistsContainer}>
            <Text style={styles.subsectionTitle}>🎧 Playlists de Treino</Text>
            {spotifyIntegration.playlists.slice(0, 3).map((playlist: any, index: number) => (
              <TouchableOpacity key={index} style={styles.playlistItem}>
                <Text style={styles.playlistIcon}>🎵</Text>
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                  <Text style={styles.playlistDescription}>{playlist.description}</Text>
                </View>
                <Text style={styles.playlistBPM}>{playlist.averageBPM} BPM</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('SpotifyPlaylists')}
          >
            <Text style={styles.actionButtonText}>🤖 Gerar Playlist com IA</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSocialSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="share" size={24} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Redes Sociais</Text>
        </View>
      </View>

      <View style={styles.socialGrid}>
        {['instagram', 'facebook', 'strava'].map((platform) => {
          const integration = socialIntegrations.find(s => s.platform === platform);
          const isConnected = integration?.isConnected || false;

          return (
            <TouchableOpacity
              key={platform}
              style={[styles.socialItem, isConnected && styles.socialItemConnected]}
              onPress={() => !isConnected && handleSocialConnect(platform as any)}
            >
              <FontAwesome5 
                name={platform} 
                size={24} 
                color={isConnected ? '#10b981' : '#6b7280'} 
              />
              <Text style={[styles.socialName, isConnected && styles.socialNameConnected]}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Text>
              {isConnected && (
                <>
                  <Text style={styles.socialUsername}>@{integration?.userProfile?.username}</Text>
                  <View style={styles.autoShareContainer}>
                    <Text style={styles.autoShareLabel}>Auto Share</Text>
                    <Switch
                      value={integration?.autoShare || false}
                      onValueChange={(value) => {
                        // Implementar toggle auto share
                      }}
                      thumbColor="#10b981"
                      trackColor={{ false: '#374151', true: '#065f46' }}
                    />
                  </View>
                </>
              )}
              {!isConnected && (
                <Text style={styles.connectText}>Tocar para conectar</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderGymsSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="fitness-center" size={24} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Academias Próximas</Text>
        </View>
        <TouchableOpacity onPress={() => smartIntegrationsService.findNearbyGyms().then(loadIntegrationsData)}>
          <MaterialIcons name="refresh" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {nearbyGyms.slice(0, 3).map((gym) => (
        <View key={gym.id} style={styles.gymCard}>
          <View style={styles.gymHeader}>
            <View style={styles.gymInfo}>
              <Text style={styles.gymName}>{gym.name}</Text>
              <Text style={styles.gymAddress}>{gym.address}</Text>
              <View style={styles.gymMeta}>
                <Text style={styles.gymDistance}>📍 {Math.round(gym.distance)}m</Text>
                <Text style={styles.gymRating}>⭐ {gym.rating}</Text>
                <View style={[styles.gymStatus, { backgroundColor: gym.isOpen ? '#10b981' : '#ef4444' }]}>
                  <Text style={styles.gymStatusText}>{gym.isOpen ? 'Aberto' : 'Fechado'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.gymWorkoutTypes}>
            {gym.workoutTypes.map((type, index) => (
              <View key={index} style={styles.workoutTypeTag}>
                <Text style={styles.workoutTypeText}>{type}</Text>
              </View>
            ))}
          </View>

          <View style={styles.gymActions}>
            <TouchableOpacity 
              style={styles.gymActionButton}
              onPress={() => handleGymNavigation(gym.id)}
            >
              <MaterialIcons name="directions" size={16} color="#3b82f6" />
              <Text style={styles.gymActionText}>Rota</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gymActionButton}
              onPress={() => handleGymFavorite(gym.id)}
            >
              <MaterialIcons name="favorite-border" size={16} color="#ec4899" />
              <Text style={styles.gymActionText}>Favoritar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('GymMap')}
      >
        <Text style={styles.actionButtonText}>🗺️ Ver Todas no Mapa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAIRecommendations = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="psychology" size={24} color="#8b5cf6" />
          <Text style={styles.sectionTitle}>Recomendações IA</Text>
        </View>
      </View>

      {aiRecommendations.map((recommendation) => (
        <View key={recommendation.id} style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationIcon}>
              {getRecommendationIcon(recommendation.type)}
            </Text>
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
              <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            </View>
            <View style={styles.confidenceIndicator}>
              <Text style={styles.confidenceText}>{Math.round(recommendation.confidence * 100)}%</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.recommendationAction}
            onPress={() => handleRecommendationAction(recommendation)}
          >
            <Text style={styles.recommendationActionText}>✨ Aplicar Sugestão</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const getRecommendationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      workout: '💪',
      music: '🎵',
      gym: '🏋️‍♂️',
      nutrition: '🥗',
      recovery: '😴',
    };
    return icons[type] || '🤖';
  };

  const handleRecommendationAction = (recommendation: AIRecommendation) => {
    switch (recommendation.type) {
      case 'workout':
        navigation.navigate('WorkoutPlanner', { suggestion: recommendation.data });
        break;
      case 'music':
        navigation.navigate('SpotifyPlaylists', { playlistId: recommendation.data.playlistId });
        break;
      case 'gym':
        handleGymNavigation(recommendation.data.gymId);
        break;
      default:
        Alert.alert('🤖 IA Sugestão', recommendation.description);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="settings" size={50} color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando Integrações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🔗 Integrações Inteligentes</Text>
        <TouchableOpacity onPress={onRefresh}>
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderSpotifySection()}
        {renderSocialSection()}
        {renderGymsSection()}
        {renderAIRecommendations()}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🚀 Conecte todas suas plataformas favoritas para uma experiência personalizada!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  connectButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  integrationContent: {
    marginTop: 12,
  },
  userInfo: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  userStats: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 16,
  },
  playlistsContainer: {
    marginBottom: 16,
  },
  subsectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  playlistIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  playlistBPM: {
    color: '#1db954',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 3,
    marginBottom: 12,
  },
  socialItemConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  socialName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  socialNameConnected: {
    color: '#10b981',
  },
  socialUsername: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 4,
  },
  autoShareContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  autoShareLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  connectText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  gymCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  gymHeader: {
    marginBottom: 12,
  },
  gymInfo: {
    flex: 1,
  },
  gymName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gymAddress: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  gymMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gymDistance: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginRight: 16,
  },
  gymRating: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginRight: 16,
  },
  gymStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gymStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  gymWorkoutTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  workoutTypeTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  workoutTypeText: {
    color: '#3b82f6',
    fontSize: 12,
  },
  gymActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gymActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  gymActionText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  confidenceIndicator: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationAction: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  recommendationActionText: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 