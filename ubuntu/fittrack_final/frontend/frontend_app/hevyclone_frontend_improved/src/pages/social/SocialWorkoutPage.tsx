import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  PlayIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  TrophyIcon,
  FireIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface WorkoutBuddy {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastWorkout: string;
  mutualFriends: number;
  workoutCount: number;
  preferredTime: string;
  location: string;
}

interface JointWorkout {
  id: string;
  participants: WorkoutBuddy[];
  type: 'scheduled' | 'live' | 'completed';
  title: string;
  date: string;
  duration: number;
  exercises: string[];
  location: string;
  notes: string;
  photos: string[];
  stats: {
    totalVolume: number;
    avgHeartRate: number;
    caloriesBurned: number;
  };
}

interface WorkoutInvite {
  id: string;
  from: WorkoutBuddy;
  workoutType: string;
  scheduledTime: string;
  location: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}

const SocialWorkoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'buddies' | 'schedule' | 'live'>('feed');
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);

  const [workoutBuddies] = useState<WorkoutBuddy[]>([
    {
      id: '1',
      name: 'Ana Silva',
      avatar: '👩‍🦱',
      isOnline: true,
      lastWorkout: '2 horas atrás',
      mutualFriends: 5,
      workoutCount: 124,
      preferredTime: 'Manhã (6-9h)',
      location: 'Academia Central'
    },
    {
      id: '2',
      name: 'Pedro Costa',
      avatar: '👨‍💼',
      isOnline: false,
      lastWorkout: '1 dia atrás',
      mutualFriends: 3,
      workoutCount: 89,
      preferredTime: 'Noite (18-21h)',
      location: 'Parque da Cidade'
    },
    {
      id: '3',
      name: 'Maria Santos',
      avatar: '👩‍💻',
      isOnline: true,
      lastWorkout: '30 min atrás',
      mutualFriends: 8,
      workoutCount: 156,
      preferredTime: 'Tarde (14-17h)',
      location: 'CrossFit Box'
    }
  ]);

  const [jointWorkouts] = useState<JointWorkout[]>([
    {
      id: '1',
      participants: [workoutBuddies[0], workoutBuddies[2]],
      type: 'completed',
      title: 'Treino de Força - Peito e Tríceps',
      date: '2024-12-06T18:00:00',
      duration: 75,
      exercises: ['Supino Reto', 'Supino Inclinado', 'Tríceps Testa', 'Crucifixo'],
      location: 'Academia Central',
      notes: 'Treino excelente! Batemos nossos PRs no supino 💪',
      photos: ['📸', '📸', '📸'],
      stats: {
        totalVolume: 4200,
        avgHeartRate: 142,
        caloriesBurned: 380
      }
    },
    {
      id: '2',
      participants: [workoutBuddies[1]],
      type: 'scheduled',
      title: 'Corrida Matinal',
      date: '2024-12-07T07:00:00',
      duration: 45,
      exercises: ['Corrida', 'Alongamento'],
      location: 'Parque da Cidade',
      notes: 'Vamos para os 5km! 🏃‍♂️',
      photos: [],
      stats: {
        totalVolume: 0,
        avgHeartRate: 0,
        caloriesBurned: 0
      }
    },
    {
      id: '3',
      participants: [workoutBuddies[0], workoutBuddies[1]],
      type: 'live',
      title: 'HIIT Training',
      date: '2024-12-06T20:30:00',
      duration: 30,
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats'],
      location: 'Academia Virtual',
      notes: 'Treino online ao vivo! 🔥',
      photos: [],
      stats: {
        totalVolume: 0,
        avgHeartRate: 165,
        caloriesBurned: 0
      }
    }
  ]);

  const [invites] = useState<WorkoutInvite[]>([
    {
      id: '1',
      from: workoutBuddies[0],
      workoutType: 'Yoga Relaxante',
      scheduledTime: '2024-12-07T19:00:00',
      location: 'Studio Yoga Zen',
      message: 'Oi! Que tal um yoga relaxante depois do trabalho? 🧘‍♀️',
      status: 'pending'
    },
    {
      id: '2',
      from: workoutBuddies[2],
      workoutType: 'CrossFit WOD',
      scheduledTime: '2024-12-08T08:00:00',
      location: 'CrossFit Box',
      message: 'Bora quebrar tudo no sábado de manhã! 💪',
      status: 'pending'
    }
  ]);

  const getWorkoutTypeIcon = (type: string) => {
    if (type === 'live') return <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />;
    if (type === 'scheduled') return <ClockIcon className="w-5 h-5 text-yellow-400" />;
    return <TrophyIcon className="w-5 h-5 text-green-400" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            👥 Treino Social
          </h1>
          <p className="text-[#8b8b8b] text-lg">
            Treine com amigos, compartilhe conquistas e motive-se mutuamente
          </p>
        </div>

        {/* Pending Invites */}
        {invites.filter(invite => invite.status === 'pending').length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">📬 Convites Pendentes</h2>
            <div className="space-y-4">
              {invites.filter(invite => invite.status === 'pending').map((invite) => (
                <div key={invite.id} className="bg-[#1a1a1b] border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{invite.from.avatar}</div>
                      <div>
                        <h3 className="text-white font-medium">{invite.from.name} te convidou para:</h3>
                        <p className="text-yellow-400 font-semibold">{invite.workoutType}</p>
                        <p className="text-[#8b8b8b] text-sm">
                          📅 {formatDate(invite.scheduledTime)} • 📍 {invite.location}
                        </p>
                        <p className="text-[#8b8b8b] text-sm italic mt-1">"{invite.message}"</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Aceitar
                      </button>
                      <button className="bg-[#2d2d30] hover:bg-[#404040] text-white px-4 py-2 rounded-lg transition-colors">
                        Recusar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-[#1a1a1b] p-1 rounded-lg w-fit border border-[#2d2d30]">
            {[
              { id: 'feed', label: 'Feed Social', icon: '📰' },
              { id: 'buddies', label: 'Parceiros', icon: '👥' },
              { id: 'schedule', label: 'Agendados', icon: '📅' },
              { id: 'live', label: 'Ao Vivo', icon: '🔴' }
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

        {/* Feed Social Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {jointWorkouts.map((workout) => (
              <div key={workout.id} className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
                {/* Header do Post */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {workout.participants.map((participant) => (
                        <div key={index} className="text-2xl bg-[#2d2d30] rounded-full w-10 h-10 flex items-center justify-center border-2 border-[#1a1a1b]">
                          {participant.avatar}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{workout.title}</h3>
                      <div className="flex items-center gap-2 text-[#8b8b8b] text-sm">
                        {getWorkoutTypeIcon(workout.type)}
                        <span>{formatDate(workout.date)}</span>
                        <span>•</span>
                        <span>📍 {workout.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#8b8b8b] text-sm">
                    <ClockIcon className="w-4 h-4" />
                    {workout.duration} min
                  </div>
                </div>

                {/* Exercícios */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {workout.exercises.map((exercise) => (
                      <span key={index} className="bg-[#2d2d30] text-white px-3 py-1 rounded-full text-sm">
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estatísticas */}
                {workout.type === 'completed' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-[#2d2d30] rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{workout.stats.totalVolume.toLocaleString()}</div>
                      <div className="text-xs text-[#8b8b8b]">Volume Total (kg)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{workout.stats.avgHeartRate}</div>
                      <div className="text-xs text-[#8b8b8b]">FC Média (bpm)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{workout.stats.caloriesBurned}</div>
                      <div className="text-xs text-[#8b8b8b]">Calorias</div>
                    </div>
                  </div>
                )}

                {/* Fotos */}
                {workout.photos.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {workout.photos.map((photo) => (
                      <div key={index} className="w-20 h-20 bg-[#2d2d30] rounded-lg flex items-center justify-center text-2xl">
                        {photo}
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {workout.notes && (
                  <p className="text-[#8b8b8b] mb-4 italic">"{workout.notes}"</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#2d2d30]">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[#8b8b8b] hover:text-red-400 transition-colors">
                      <HeartIcon className="w-5 h-5" />
                      <span className="text-sm">Curtir</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#8b8b8b] hover:text-blue-400 transition-colors">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span className="text-sm">Comentar</span>
                    </button>
                    <button className="flex items-center gap-2 text-[#8b8b8b] hover:text-green-400 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                      <span className="text-sm">Compartilhar</span>
                    </button>
                  </div>
                  {workout.type === 'scheduled' && (
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                      Participar
                    </button>
                  )}
                  {workout.type === 'live' && (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Entrar Agora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buddies Tab */}
        {activeTab === 'buddies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Seus Parceiros de Treino</h2>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                Encontrar Novos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutBuddies.map((buddy) => (
                <div key={buddy.id} className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 hover:border-purple-500 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="text-3xl">{buddy.avatar}</div>
                        {buddy.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1b]" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{buddy.name}</h3>
                        <p className="text-[#8b8b8b] text-sm">{buddy.lastWorkout}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b8b8b]">Treinos:</span>
                      <span className="text-white">{buddy.workoutCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b8b8b]">Amigos mútuos:</span>
                      <span className="text-white">{buddy.mutualFriends}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b8b8b]">Horário preferido:</span>
                      <span className="text-white">{buddy.preferredTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8b8b8b]">Local usual:</span>
                      <span className="text-white">{buddy.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                      Convidar
                    </button>
                    <button className="bg-[#2d2d30] text-white py-2 px-4 rounded-lg hover:bg-[#404040] transition-colors">
                      Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Treinos Agendados</h2>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                Novo Treino
              </button>
            </div>

            <div className="space-y-4">
              {jointWorkouts.filter(w => w.type === 'scheduled').map((workout) => (
                <div key={workout.id} className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ClockIcon className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h3 className="text-white font-semibold">{workout.title}</h3>
                        <p className="text-[#8b8b8b]">{formatDate(workout.date)} • {workout.duration} min</p>
                        <p className="text-[#8b8b8b] text-sm">📍 {workout.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <UsersIcon className="w-4 h-4 text-[#8b8b8b]" />
                          <span className="text-sm text-[#8b8b8b]">
                            {workout.participants.map(p => p.name).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-[#2d2d30] text-white px-4 py-2 rounded-lg hover:bg-[#404040] transition-colors">
                        Editar
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Tab */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <PlayIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Treinos Ao Vivo</h2>
              <p className="text-[#8b8b8b] mb-6">
                Treine em tempo real com seus amigos, onde quer que estejam
              </p>
              
              {/* Live Sessions */}
              {jointWorkouts.filter(w => w.type === 'live').map((workout) => (
                <div key={workout.id} className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                      <div>
                        <h3 className="text-white font-semibold">{workout.title}</h3>
                        <p className="text-red-400">AO VIVO • {workout.participants.length + 1} participantes</p>
                        <div className="flex items-center gap-2 mt-1">
                          <HeartIcon className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-[#8b8b8b]">FC: {workout.stats.avgHeartRate} bpm</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <PlayIcon className="w-5 h-5" />
                      Entrar na Sessão
                    </button>
                  </div>
                </div>
              ))}

              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                Iniciar Treino Ao Vivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialWorkoutPage; 