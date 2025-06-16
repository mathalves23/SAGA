import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function SmartIntegrationsPage() {
  const [spotifyIntegration, setSpotifyIntegration] = useState<SpotifyIntegration>({ 
    isConnected: false, 
    playlists: [] 
  });
  
  const [socialIntegrations, setSocialIntegrations] = useState<SocialIntegration[]>([
    { platform: 'instagram', isConnected: false, autoShare: false },
    { platform: 'facebook', isConnected: false, autoShare: false },
    { platform: 'strava', isConnected: true, userProfile: { username: 'fitness_pro', followerCount: 1250 }, autoShare: true },
  ]);

  const [nearbyGyms] = useState<NearbyGym[]>([
    {
      id: '1',
      name: 'Smart Fit',
      address: 'Rua das Palmeiras, 123',
      distance: 850,
      rating: 4.2,
      isOpen: true,
      workoutTypes: ['Musculação', 'Cardio', 'Funcional']
    },
    {
      id: '2',
      name: 'Academia Bodytech',
      address: 'Av. Paulista, 456',
      distance: 1200,
      rating: 4.5,
      isOpen: true,
      workoutTypes: ['Natação', 'Pilates', 'Yoga']
    },
    {
      id: '3',
      name: 'CrossFit Box',
      address: 'Rua do Fitness, 789',
      distance: 2100,
      rating: 4.8,
      isOpen: false,
      workoutTypes: ['CrossFit', 'Functional Training']
    }
  ]);

  const [aiRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      type: 'workout',
      title: 'Treino Matinal Personalizado',
      description: 'Com base no seu histórico, recomendamos um treino de força de 45min às 7h da manhã',
      confidence: 0.92,
      data: { intensity: 'high', duration: 45, time: '07:00' }
    },
    {
      id: '2',
      type: 'music',
      title: 'Playlist Energizante IA',
      description: 'Criamos uma playlist com 30 músicas ideais para seu treino de cardio',
      confidence: 0.88,
      data: { playlistId: 'ai_cardio_mix', tracks: 30, averageBPM: 140 }
    },
    {
      id: '3',
      type: 'gym',
      title: 'Academia Recomendada',
      description: 'Smart Fit está com pouco movimento agora e fica próxima de você',
      confidence: 0.85,
      data: { gymId: '1', reason: 'low_traffic' }
    },
    {
      id: '4',
      type: 'nutrition',
      title: 'Janela Nutricional',
      description: 'É o momento ideal para consumir proteínas. Que tal um shake?',
      confidence: 0.79,
      data: { type: 'protein', timing: 'post_workout' }
    }
  ]);

  const handleSpotifyConnect = () => {
    // Simular conexão Spotify
    setSpotifyIntegration({
      isConnected: true,
      userProfile: {
        display_name: 'João Silva',
        followers: { total: 248 }
      },
      playlists: [
        { name: 'Cardio Hits 🔥', description: 'Alta energia • 45 músicas', averageBPM: 150 },
        { name: 'Força e Poder 💪', description: 'Motivacional • 32 músicas', averageBPM: 130 },
        { name: 'Yoga & Zen 🧘', description: 'Relaxante • 28 músicas', averageBPM: 80 }
      ]
    });
  };

  const handleSocialConnect = (platform: string) => {
    setSocialIntegrations(prev => 
      prev.map(integration => 
        integration.platform === platform 
          ? { 
              ...integration, 
              isConnected: true,
              userProfile: { username: `user_${platform}`, followerCount: Math.floor(Math.random() * 1000) }
            }
          : integration
      )
    );
  };

  const handleSocialToggle = (platform: string) => {
    setSocialIntegrations(prev => 
      prev.map(integration => 
        integration.platform === platform 
          ? { ...integration, autoShare: !integration.autoShare }
          : integration
      )
    );
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: '📸',
      facebook: '👥',
      strava: '🏃‍♂️',
      spotify: '🎵'
    };
    return icons[platform as keyof typeof icons] || '🔗';
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-600',
      facebook: 'from-blue-500 to-blue-600',
      strava: 'from-orange-500 to-red-500',
      spotify: 'from-green-400 to-green-600'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getRecommendationIcon = (type: string) => {
    const icons = {
      workout: '💪',
      music: '🎵',
      gym: '🏋️‍♂️',
      nutrition: '🥗',
      recovery: '😴'
    };
    return icons[type as keyof typeof icons] || '🤖';
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
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            🔗 Integrações Inteligentes
          </h1>
          <p className="text-slate-400">
            Conecte suas plataformas favoritas para uma experiência personalizada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spotify Integration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Spotify</h3>
                  <p className="text-slate-400 text-sm">Música personalizada para treinos</p>
                </div>
              </div>
              
              {!spotifyIntegration.isConnected ? (
                <button
                  onClick={handleSpotifyConnect}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Conectar
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Conectado
                </div>
              )}
            </div>

            {spotifyIntegration.isConnected && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{spotifyIntegration.userProfile?.display_name}</p>
                    <p className="text-slate-400 text-sm">{spotifyIntegration.userProfile?.followers.total} seguidores</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">🎧 Playlists de Treino</h4>
                  {spotifyIntegration.playlists.map((playlist) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{playlist.name}</p>
                        <p className="text-slate-400 text-sm">{playlist.description}</p>
                      </div>
                      <div className="text-green-400 font-semibold text-sm">
                        {playlist.averageBPM} BPM
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold">
                  🤖 Gerar Playlist com IA
                </button>
              </div>
            )}
          </motion.div>

          {/* Social Media Integrations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📱 Redes Sociais
            </h3>

            <div className="space-y-4">
              {socialIntegrations.map((integration) => (
                <div key={integration.platform} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getPlatformColor(integration.platform)} rounded-lg flex items-center justify-center text-xl`}>
                        {getPlatformIcon(integration.platform)}
                      </div>
                      <div>
                        <p className="text-white font-semibold capitalize">{integration.platform}</p>
                        {integration.isConnected && integration.userProfile && (
                          <p className="text-slate-400 text-sm">@{integration.userProfile.username}</p>
                        )}
                      </div>
                    </div>

                    {!integration.isConnected ? (
                      <button
                        onClick={() => handleSocialConnect(integration.platform)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                      >
                        Conectar
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-semibold">
                        ✓ Conectado
                      </div>
                    )}
                  </div>

                  {integration.isConnected && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">Compartilhamento Automático</span>
                      <button
                        onClick={() => handleSocialToggle(integration.platform)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          integration.autoShare ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            integration.autoShare ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nearby Gyms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🏋️‍♂️ Academias Próximas
              </h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                Atualizar
              </button>
            </div>

            <div className="space-y-4">
              {nearbyGyms.map((gym) => (
                <div key={gym.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{gym.name}</h4>
                      <p className="text-slate-400 text-sm">{gym.address}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-slate-300 text-sm">📍 {gym.distance}m</span>
                        <span className="text-slate-300 text-sm">⭐ {gym.rating}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          gym.isOpen ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                        }`}>
                          {gym.isOpen ? 'Aberto' : 'Fechado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {gym.workoutTypes.map((type) => (
                      <span key={index} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600/20 text-blue-400 py-2 rounded text-sm font-semibold hover:bg-blue-600/30 transition-colors">
                      🗺️ Ver Rota
                    </button>
                    <button className="flex-1 bg-pink-600/20 text-pink-400 py-2 rounded text-sm font-semibold hover:bg-pink-600/30 transition-colors">
                      ❤️ Favoritar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold">
              🗺️ Ver Todas no Mapa
            </button>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🤖 Recomendações IA
            </h3>

            <div className="space-y-4">
              {aiRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{recommendation.title}</h4>
                        <p className="text-slate-300 text-sm mt-1">{recommendation.description}</p>
                      </div>
                    </div>
                    <div className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs font-semibold">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 rounded text-sm font-semibold">
                    ✨ Aplicar Sugestão
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              🚀 Maximize Sua Experiência
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Conecte todas suas plataformas favoritas para receber recomendações personalizadas, 
              playlists inteligentes e insights únicos sobre seu progresso fitness.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold">
                🔧 Configurações Avançadas
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold">
                📊 Ver Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 