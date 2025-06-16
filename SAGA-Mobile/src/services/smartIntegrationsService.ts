import { Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// INTERFACES PARA INTEGRAÇÕES
interface SpotifyIntegration {
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  userProfile?: SpotifyUser;
  playlists: WorkoutPlaylist[];
  currentTrack?: SpotifyTrack;
}

interface SpotifyUser {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  preview_url?: string;
  energy: number; // 0-1
  tempo: number; // BPM
}

interface WorkoutPlaylist {
  id: string;
  name: string;
  description: string;
  workoutType: 'cardio' | 'strength' | 'yoga' | 'warmup' | 'cooldown';
  averageBPM: number;
  tracks: SpotifyTrack[];
  isAIGenerated: boolean;
}

interface NearbyGym {
  id: string;
  name: string;
  address: string;
  distance: number; // em metros
  rating: number;
  priceLevel: number;
  amenities: string[];
  photos: string[];
  openingHours: string[];
  isOpen: boolean;
  workoutTypes: string[];
  phoneNumber?: string;
  website?: string;
}

interface SocialIntegration {
  platform: 'instagram' | 'facebook' | 'strava' | 'fitbit';
  isConnected: boolean;
  accessToken?: string;
  userProfile?: SocialProfile;
  autoShare: boolean;
  shareTypes: string[];
}

interface SocialProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followerCount?: number;
}

interface AIRecommendation {
  id: string;
  type: 'workout' | 'music' | 'gym' | 'nutrition' | 'recovery';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string;
  data: any;
  createdAt: string;
  isPersonalized: boolean;
}

interface SmartNotification {
  id: string;
  type: 'motivation' | 'reminder' | 'achievement' | 'social' | 'weather';
  title: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
  timing: 'immediate' | 'scheduled' | 'contextual';
  scheduledFor?: string;
  context?: any;
  actionButton?: {
    text: string;
    action: string;
  };
}

class SmartIntegrationsService {
  private spotifyIntegration: SpotifyIntegration = {
    isConnected: false,
    playlists: [],
  };
  private socialIntegrations: SocialIntegration[] = [];
  private nearbyGyms: NearbyGym[] = [];
  private aiRecommendations: AIRecommendation[] = [];

  async initialize(): Promise<void> {
    try {
      await this.loadIntegrations();
      await this.initializeLocationServices();
      await this.generateAIRecommendations();
      
      console.log('🔗 Integrações inteligentes inicializadas');
    } catch (error) {
      console.error('❌ Erro ao inicializar integrações:', error);
    }
  }

  // INTEGRAÇÃO SPOTIFY
  async connectSpotify(): Promise<boolean> {
    try {
      console.log('🎵 Conectando ao Spotify...');
      
      // Em produção, usaria o Spotify Web API
      // Por enquanto, simular conexão
      const mockSpotifyUser: SpotifyUser = {
        id: 'user123',
        display_name: 'Fitness Enthusiast',
        images: [{ url: 'https://via.placeholder.com/150' }],
        followers: { total: 42 },
      };

      this.spotifyIntegration = {
        isConnected: true,
        accessToken: 'mock_access_token',
        userProfile: mockSpotifyUser,
        playlists: await this.generateWorkoutPlaylists(),
      };

      await this.saveIntegrations();
      
      console.log('✅ Spotify conectado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao conectar Spotify:', error);
      return false;
    }
  }

  private async generateWorkoutPlaylists(): Promise<WorkoutPlaylist[]> {
    const mockTracks: SpotifyTrack[] = [
      {
        id: 'track1',
        name: 'Thunder',
        artists: [{ name: 'Imagine Dragons' }],
        album: { name: 'Evolve', images: [{ url: 'https://via.placeholder.com/300' }] },
        duration_ms: 187000,
        energy: 0.9,
        tempo: 168,
      },
      {
        id: 'track2',
        name: 'Stronger',
        artists: [{ name: 'The Score' }],
        album: { name: 'ATLAS', images: [{ url: 'https://via.placeholder.com/300' }] },
        duration_ms: 215000,
        energy: 0.95,
        tempo: 140,
      },
    ];

    return [
      {
        id: 'cardio_hits',
        name: 'Cardio Hits 🔥',
        description: 'Músicas de alta energia para cardio',
        workoutType: 'cardio',
        averageBPM: 150,
        tracks: mockTracks.filter(t => t.tempo > 140),
        isAIGenerated: true,
      },
      {
        id: 'strength_power',
        name: 'Força e Poder 💪',
        description: 'Músicas motivacionais para treino de força',
        workoutType: 'strength',
        averageBPM: 130,
        tracks: mockTracks.filter(t => t.energy > 0.8),
        isAIGenerated: true,
      },
      {
        id: 'yoga_zen',
        name: 'Yoga & Zen 🧘',
        description: 'Músicas relaxantes para yoga',
        workoutType: 'yoga',
        averageBPM: 80,
        tracks: [],
        isAIGenerated: true,
      },
    ];
  }

  async playWorkoutMusic(workoutType: string, intensity: number): Promise<void> {
    if (!this.spotifyIntegration.isConnected) {
      console.log('Spotify não conectado');
      return;
    }

    const playlist = this.spotifyIntegration.playlists.find(p => p.workoutType === workoutType);
    if (!playlist) {
      console.log('Playlist não encontrada para o tipo de treino');
      return;
    }

    const targetBPM = this.calculateTargetBPM(intensity);
    const suitableTracks = playlist.tracks.filter(track => 
      Math.abs(track.tempo - targetBPM) < 20
    );

    if (suitableTracks.length > 0) {
      const randomTrack = suitableTracks[Math.floor(Math.random() * suitableTracks.length)];
      this.spotifyIntegration.currentTrack = randomTrack;
      
      console.log(`🎵 Tocando: ${randomTrack.name} - ${randomTrack.artists[0].name}`);
    }
  }

  private calculateTargetBPM(intensity: number): number {
    return Math.floor(100 + (intensity * 80));
  }

  async generateAIPlaylist(workoutPlan: any): Promise<WorkoutPlaylist> {
    console.log('🤖 Gerando playlist com IA...');
    
    const workoutDuration = workoutPlan.duration || 45;
    const exerciseTypes = workoutPlan.exercises || [];
    const userPreferences = await this.getUserMusicPreferences();

    let workoutType: 'cardio' | 'strength' | 'yoga' | 'warmup' | 'cooldown' = 'strength';
    let targetBPM = 130;

    if (exerciseTypes.includes('running') || exerciseTypes.includes('cycling')) {
      workoutType = 'cardio';
      targetBPM = 150;
    } else if (exerciseTypes.includes('yoga') || exerciseTypes.includes('stretching')) {
      workoutType = 'yoga';
      targetBPM = 80;
    }

    const aiPlaylist: WorkoutPlaylist = {
      id: `ai_${Date.now()}`,
      name: `Treino IA - ${new Date().toLocaleDateString()}`,
      description: 'Playlist personalizada gerada por IA',
      workoutType,
      averageBPM: targetBPM,
      tracks: await this.selectTracksWithAI(targetBPM, workoutDuration, userPreferences),
      isAIGenerated: true,
    };

    this.spotifyIntegration.playlists.unshift(aiPlaylist);
    await this.saveIntegrations();

    return aiPlaylist;
  }

  private async getUserMusicPreferences(): Promise<any> {
    try {
      const saved = await AsyncStorage.getItem('music_preferences');
      return saved ? JSON.parse(saved) : {
        genres: ['pop', 'rock', 'electronic'],
        energy: 0.8,
        avoidExplicit: false,
      };
    } catch (error) {
      return { genres: ['pop'], energy: 0.8, avoidExplicit: false };
    }
  }

  private async selectTracksWithAI(targetBPM: number, duration: number, preferences: any): Promise<SpotifyTrack[]> {
    return [];
  }

  // INTEGRAÇÃO MAPS & GYMS
  private async initializeLocationServices(): Promise<void> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      }

      console.log('📍 Serviços de localização inicializados');
    } catch (error) {
      console.error('Erro ao inicializar localização:', error);
    }
  }

  async findNearbyGyms(radius: number = 5000): Promise<NearbyGym[]> {
    try {
      const location = await Location.getCurrentPositionAsync({});
      console.log('🏋️ Buscando academias próximas...');

      const mockGyms: NearbyGym[] = [
        {
          id: 'gym1',
          name: 'Smart Fit',
          address: 'Rua das Palmeiras, 123',
          distance: 850,
          rating: 4.2,
          priceLevel: 2,
          amenities: ['Estacionamento', 'Vestiário', 'Ar condicionado'],
          photos: ['https://via.placeholder.com/400x300'],
          openingHours: ['Segunda a Sexta: 6h às 22h', 'Sábado: 8h às 18h'],
          isOpen: true,
          workoutTypes: ['Musculação', 'Cardio', 'Funcional'],
          phoneNumber: '(11) 1234-5678',
          website: 'https://smartfit.com.br',
        },
        {
          id: 'gym2',
          name: 'Academia Bodytech',
          address: 'Av. Paulista, 456',
          distance: 1200,
          rating: 4.5,
          priceLevel: 3,
          amenities: ['Piscina', 'Sauna', 'Personal Trainer', 'Aulas em grupo'],
          photos: ['https://via.placeholder.com/400x300'],
          openingHours: ['Segunda a Domingo: 5h às 23h'],
          isOpen: true,
          workoutTypes: ['Musculação', 'Natação', 'Pilates', 'Yoga'],
          phoneNumber: '(11) 8765-4321',
        },
        {
          id: 'gym3',
          name: 'CrossFit Box',
          address: 'Rua do Fitness, 789',
          distance: 2100,
          rating: 4.8,
          priceLevel: 4,
          amenities: ['Equipamentos especializados', 'Coaching personalizado'],
          photos: ['https://via.placeholder.com/400x300'],
          openingHours: ['Segunda a Sexta: 6h às 21h', 'Sábado: 8h às 16h'],
          isOpen: false,
          workoutTypes: ['CrossFit', 'Functional Training'],
          phoneNumber: '(11) 5555-0000',
        },
      ];

      this.nearbyGyms = mockGyms.sort((a, b) => a.distance - b.distance);
      return this.nearbyGyms;
    } catch (error) {
      console.error('Erro ao buscar academias:', error);
      return [];
    }
  }

  async getGymRoute(gymId: string): Promise<void> {
    const gym = this.nearbyGyms.find(g => g.id === gymId);
    if (!gym) return;

    const url = Platform.select({
      ios: `maps:?q=${encodeURIComponent(gym.address)}`,
      android: `geo:0,0?q=${encodeURIComponent(gym.address)}`,
    });

    if (url) {
      await Linking.openURL(url);
    }
  }

  async saveGymAsFavorite(gymId: string): Promise<void> {
    try {
      const favorites = await AsyncStorage.getItem('favorite_gyms');
      const favoritesList = favorites ? JSON.parse(favorites) : [];
      
      if (!favoritesList.includes(gymId)) {
        favoritesList.push(gymId);
        await AsyncStorage.setItem('favorite_gyms', JSON.stringify(favoritesList));
        console.log('⭐ Academia salva como favorita');
      }
    } catch (error) {
      console.error('Erro ao salvar academia favorita:', error);
    }
  }

  // INTEGRAÇÕES SOCIAIS
  async connectSocialPlatform(platform: 'instagram' | 'facebook' | 'strava'): Promise<boolean> {
    try {
      console.log(`📱 Conectando ao ${platform}...`);
      
      const socialIntegration: SocialIntegration = {
        platform,
        isConnected: true,
        accessToken: `mock_${platform}_token`,
        userProfile: {
          id: `${platform}_user123`,
          username: `fitness_user_${platform}`,
          displayName: 'Fitness User',
          avatar: 'https://via.placeholder.com/100',
          followerCount: Math.floor(Math.random() * 1000),
        },
        autoShare: false,
        shareTypes: ['workout_completed', 'achievement_unlocked'],
      };

      const existingIndex = this.socialIntegrations.findIndex(s => s.platform === platform);
      if (existingIndex >= 0) {
        this.socialIntegrations[existingIndex] = socialIntegration;
      } else {
        this.socialIntegrations.push(socialIntegration);
      }

      await this.saveIntegrations();
      console.log(`✅ ${platform} conectado com sucesso`);
      return true;
    } catch (error) {
      console.error(`Erro ao conectar ${platform}:`, error);
      return false;
    }
  }

  async shareWorkoutToSocial(workoutData: any, platforms: string[]): Promise<void> {
    for (const platform of platforms) {
      const integration = this.socialIntegrations.find(s => s.platform === platform);
      if (!integration?.isConnected) continue;

      const shareContent = this.generateShareContent(workoutData, platform);
      console.log(`📤 Compartilhando no ${platform}: ${shareContent.text}`);
    }
  }

  private generateShareContent(workoutData: any, platform: string): { text: string; image?: string } {
    const achievements = [
      `🔥 Acabei de completar ${workoutData.exercises?.length || 0} exercícios!`,
      `💪 ${workoutData.duration}min de treino intenso!`,
      `🎯 Mais um dia vencido no #SAGA!`,
      `⚡ Queimei ${workoutData.calories || 0} calorias hoje!`,
    ];

    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    
    return {
      text: `${randomAchievement} #SagaFitness #FitnessMotivation #Workout`,
      image: workoutData.screenshot || undefined,
    };
  }

  // IA RECOMENDAÇÕES
  private async generateAIRecommendations(): Promise<void> {
    try {
      console.log('🤖 Gerando recomendações com IA...');
      
      const userHistory = await this.getUserWorkoutHistory();
      const currentTime = new Date();
      const dayOfWeek = currentTime.getDay();
      const hour = currentTime.getHours();

      const recommendations: AIRecommendation[] = [];

      if (userHistory.lastWorkout) {
        const daysSinceLastWorkout = Math.floor(
          (currentTime.getTime() - new Date(userHistory.lastWorkout).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastWorkout >= 2) {
          recommendations.push({
            id: 'workout_reminder',
            type: 'workout',
            title: 'Hora de Voltar aos Treinos!',
            description: `Já se passaram ${daysSinceLastWorkout} dias desde seu último treino. Que tal uma sessão leve hoje?`,
            confidence: 0.8,
            reasoning: 'Baseado no padrão de treinos do usuário',
            data: { suggestedIntensity: 'light', duration: 30 },
            createdAt: new Date().toISOString(),
            isPersonalized: true,
          });
        }
      }

      if (hour >= 6 && hour <= 10) {
        recommendations.push({
          id: 'morning_music',
          type: 'music',
          title: 'Playlist Matinal Energizante',
          description: 'Músicas perfeitas para começar o dia com energia!',
          confidence: 0.7,
          reasoning: 'Horário matinal detectado',
          data: { playlistId: 'morning_energy' },
          createdAt: new Date().toISOString(),
          isPersonalized: false,
        });
      }

      if (this.nearbyGyms.length > 0) {
        const bestGym = this.nearbyGyms
          .filter(gym => gym.isOpen)
          .sort((a, b) => b.rating - a.rating)[0];

        if (bestGym) {
          recommendations.push({
            id: 'nearby_gym',
            type: 'gym',
            title: 'Academia Recomendada',
            description: `${bestGym.name} está aberta e fica a apenas ${Math.round(bestGym.distance)}m de você!`,
            confidence: 0.9,
            reasoning: 'Baseado na localização e avaliações',
            data: { gymId: bestGym.id },
            createdAt: new Date().toISOString(),
            isPersonalized: true,
          });
        }
      }

      this.aiRecommendations = recommendations;
      console.log(`✅ ${recommendations.length} recomendações geradas`);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
    }
  }

  private async getUserWorkoutHistory(): Promise<any> {
    try {
      const saved = await AsyncStorage.getItem('workout_history');
      return saved ? JSON.parse(saved) : { lastWorkout: null, totalWorkouts: 0 };
    } catch (error) {
      return { lastWorkout: null, totalWorkouts: 0 };
    }
  }

  async scheduleSmartNotifications(): Promise<void> {
    const notifications: SmartNotification[] = [
      {
        id: 'weather_workout',
        type: 'weather',
        title: '☀️ Tempo Perfeito para Exercícios!',
        body: 'Está um dia lindo lá fora. Que tal uma corrida no parque?',
        priority: 'medium',
        timing: 'contextual',
        context: { weather: 'sunny', temperature: 25 },
        actionButton: {
          text: 'Ver Rotas',
          action: 'open_outdoor_routes',
        },
      },
      {
        id: 'motivation_evening',
        type: 'motivation',
        title: '💪 Termine o Dia com Força!',
        body: 'Um treino rápido agora vai te dar energia para amanhã!',
        priority: 'low',
        timing: 'scheduled',
        scheduledFor: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const notification of notifications) {
      if (notification.timing === 'contextual') {
        await this.evaluateContextualNotification(notification);
      }
    }
  }

  private async evaluateContextualNotification(notification: SmartNotification): Promise<void> {
    if (notification.type === 'weather' && notification.context?.weather === 'sunny') {
      const currentHour = new Date().getHours();
      if (currentHour >= 7 && currentHour <= 19) {
        console.log(`🌤️ Enviando notificação contextual: ${notification.title}`);
      }
    }
  }

  // GESTÃO DE DADOS
  private async loadIntegrations(): Promise<void> {
    try {
      const spotifyData = await AsyncStorage.getItem('spotify_integration');
      if (spotifyData) {
        this.spotifyIntegration = JSON.parse(spotifyData);
      }

      const socialData = await AsyncStorage.getItem('social_integrations');
      if (socialData) {
        this.socialIntegrations = JSON.parse(socialData);
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
    }
  }

  private async saveIntegrations(): Promise<void> {
    try {
      await AsyncStorage.setItem('spotify_integration', JSON.stringify(this.spotifyIntegration));
      await AsyncStorage.setItem('social_integrations', JSON.stringify(this.socialIntegrations));
    } catch (error) {
      console.error('Erro ao salvar integrações:', error);
    }
  }

  // GETTERS PÚBLICOS
  getSpotifyIntegration(): SpotifyIntegration {
    return this.spotifyIntegration;
  }

  getSocialIntegrations(): SocialIntegration[] {
    return this.socialIntegrations;
  }

  getNearbyGyms(): NearbyGym[] {
    return this.nearbyGyms;
  }

  getAIRecommendations(): AIRecommendation[] {
    return this.aiRecommendations;
  }

  async analyzeUserContext(): Promise<{
    mood: string;
    energy: number;
    availability: number;
    preferredWorkoutTime: string;
  }> {
    const currentHour = new Date().getHours();
    
    return {
      mood: 'motivated',
      energy: 0.8,
      availability: 0.7,
      preferredWorkoutTime: currentHour < 12 ? 'morning' : 'evening',
    };
  }
}

export const smartIntegrationsService = new SmartIntegrationsService(); 