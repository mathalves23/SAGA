import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  HeartIcon, 
  ChatBubbleOvalLeftIcon, 
  ShareIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  ScaleIcon,
  UserPlusIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Heart, MessageCircle, Share2, User, Clock, Dumbbell, Trophy } from 'lucide-react';

interface WorkoutPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  workout: {
    name: string;
    duration: string;
    volume: string;
    exercises: Array<{
      name: string;
      sets: number;
    }>;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  location?: string;
  pr?: boolean;
}

interface SuggestedAthlete {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<WorkoutPost[]>([
    {
      id: '1',
      user: {
        name: 'Ana Silva',
        username: '@anasilva',
        avatar: 'A'
      },
      workout: {
        name: 'B - Costas + Bíceps',
        duration: '53min',
        volume: '13.9k kg',
        exercises: [
          { name: 'Puxada Frontal', sets: 4 },
          { name: 'Remada Curvada', sets: 4 },
          { name: 'Rosca Bíceps', sets: 3 }
        ]
      },
      timestamp: '14h atrás',
      likes: 12,
      comments: 3,
      isLiked: false,
      location: 'Casa'
    },
    {
      id: '2',
      user: {
        name: 'Carlos Santos',
        username: '@carlosfit',
        avatar: 'C'
      },
      workout: {
        name: 'A - Peito + Tríceps',
        duration: '67min',
        volume: '18.2k kg',
        exercises: [
          { name: 'Supino Reto', sets: 4 },
          { name: 'Supino Inclinado', sets: 4 },
          { name: 'Tríceps Testa', sets: 3 },
          { name: 'Mergulho', sets: 3 }
        ]
      },
      timestamp: '1d atrás',
      likes: 24,
      comments: 7,
      isLiked: true,
      location: 'Academia Central'
    },
    {
      id: '3',
      user: {
        name: 'Juliana Costa',
        username: '@ju_fitness',
        avatar: 'J'
      },
      workout: {
        name: 'Leg Day - Quadríceps',
        duration: '45min',
        volume: '22.1k kg',
        exercises: [
          { name: 'Agachamento Livre', sets: 5 },
          { name: 'Leg Press', sets: 4 },
          { name: 'Extensora', sets: 3 }
        ]
      },
      timestamp: '2d atrás',
      likes: 31,
      comments: 12,
      isLiked: true,
      location: 'SmartFit'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const [newPost, setNewPost] = useState('');

  const generateWorkoutPost = (id: number): WorkoutPost => {
    const users = [
      { name: 'mathalves', username: 'Matheus', avatar: 'M' },
      { name: 'thygoribeiro', username: 'Thyago', avatar: 'T' },
      { name: 'anasilva', username: 'Ana Silva', avatar: 'A' },
      { name: 'pedrocosta', username: 'Pedro Costa', avatar: 'P' },
      { name: 'mariasantos', username: 'Maria Santos', avatar: 'S' },
      { name: 'joaoferreira', username: 'João Ferreira', avatar: 'J' },
      { name: 'carlarocha', username: 'Carla Rocha', avatar: 'C' },
      { name: 'lucasmendes', username: 'Lucas Mendes', avatar: 'L' },
      { name: 'julianacampos', username: 'Juliana Campos', avatar: 'U' },
      { name: 'rafaelsilva', username: 'Rafael Silva', avatar: 'R' }
    ];

    const workouts = [
      {
        name: 'A - Peito + Tríceps',
        exercises: [
          { name: 'Supino Reto', sets: 4 },
          { name: 'Supino Inclinado', sets: 3 },
          { name: 'Tríceps Testa', sets: 3 },
          { name: 'Mergulho', sets: 3 }
        ]
      },
      {
        name: 'B - Costas + Bíceps',
        exercises: [
          { name: 'Puxada Frontal', sets: 4 },
          { name: 'Remada Curvada', sets: 4 },
          { name: 'Rosca Direta', sets: 3 },
          { name: 'Rosca Martelo', sets: 3 }
        ]
      },
      {
        name: 'C - Pernas + Glúteos',
        exercises: [
          { name: 'Agachamento Livre', sets: 5 },
          { name: 'Leg Press', sets: 4 },
          { name: 'Stiff', sets: 4 },
          { name: 'Panturrilha', sets: 4 }
        ]
      },
      {
        name: 'D - Ombros + Trapézio',
        exercises: [
          { name: 'Desenvolvimento Military', sets: 4 },
          { name: 'Elevação Lateral', sets: 3 },
          { name: 'Elevação Frontal', sets: 3 },
          { name: 'Encolhimento', sets: 3 }
        ]
      },
      {
        name: 'HIIT Cardio',
        exercises: [
          { name: 'Burpees', sets: 5 },
          { name: 'Mountain Climbers', sets: 4 },
          { name: 'Jump Squats', sets: 4 },
          { name: 'High Knees', sets: 3 }
        ]
      },
      {
        name: 'Funcional + Core',
        exercises: [
          { name: 'Prancha', sets: 4 },
          { name: 'Kettlebell Swing', sets: 4 },
          { name: 'Medicine Ball Slam', sets: 3 },
          { name: 'Russian Twist', sets: 3 }
        ]
      }
    ];

    const locations = ['Academia Central', 'CrossFit Box', 'Parque da Cidade', 'Casa', 'Studio Pilates', 'Academia Premium'];
    
    const user = users[Math.floor(Math.random() * users.length)];
    const workout = workouts[Math.floor(Math.random() * workouts.length)];
    const location = Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : undefined;
    const isPR = Math.random() > 0.8; // 20% chance de ser PR
    
    const hoursAgo = Math.floor(Math.random() * 48) + 1;
    const duration = `${Math.floor(Math.random() * 60) + 30}min`;
    const volume = `${(Math.random() * 50 + 10).toFixed(1)}k kg`;
    
    return {
      id: `post-${id}`,
      user,
      workout: {
        name: workout.name,
        duration,
        volume,
        exercises: workout.exercises
      },
      timestamp: hoursAgo <= 24 ? `${hoursAgo}h atrás` : `${Math.floor(hoursAgo / 24)}d atrás`,
      likes: Math.floor(Math.random() * 25),
      comments: Math.floor(Math.random() * 8),
      isLiked: Math.random() > 0.7,
      location,
      pr: isPR
    };
  };

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      const newPosts = Array.from({ length: 10 }, (_, i) => generateWorkoutPost(page * 10 + i + 1));
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
      setIsLoading(false);
      
      // Simular fim de dados após 100 posts
      if (page >= 10) {
        setHasMore(false);
      }
    }, 1000);
  }, [page, isLoading]);

  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);

  useEffect(() => {
    // Carregar posts iniciais
    const initialPosts = Array.from({ length: 10 }, (_, i) => generateWorkoutPost(i + 1));
    setPosts(initialPosts);
  }, []);

  const [suggestedAthletes] = useState<SuggestedAthlete[]>([
    {
      id: '1',
      name: 'Jullie',
      username: 'jullie',
      avatar: 'J',
      isFollowing: false
    },
    {
      id: '2', 
      name: 'Gabriela Giardini',
      username: 'gabigiardini',
      avatar: 'G',
      isFollowing: false
    },
    {
      id: '3',
      name: 'Rafa',
      username: 'rafalpdias',
      avatar: 'R',
      isFollowing: false
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleFollow = (athleteId: string) => {
    console.log('Followed athlete:', athleteId);
  };

  const handleShare = (postId: string) => {
    // Implementar lógica de compartilhamento
    console.log('Compartilhar post:', postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Main Feed Content */}
        <div className="flex-1 max-w-4xl">
          {/* New Post Form */}
          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">M</span>
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Compartilhe seu treino..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-[#2d2d30] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center">
                  Postar
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center">
                  <Dumbbell className="w-4 h-4" />
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center">
                  <Trophy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl overflow-hidden shadow-sm"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{post.user.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{post.user.name}</h3>
                        {post.pr && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <TrophyIcon className="w-3 h-3" />
                            PR
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#8b8b8b]">
                        <span>{post.timestamp}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <span>📍 {post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#2d2d30] rounded-lg transition-colors">
                    <EllipsisHorizontalIcon className="w-5 h-5 text-[#8b8b8b]" />
                  </button>
                </div>

                {/* Workout Title */}
                <div className="px-4 pb-3">
                  <h2 className="text-lg font-semibold text-white">{post.workout.name}</h2>
                </div>

                {/* Workout Stats */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#0a0a0b] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <ClockIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-[#8b8b8b]">Duração</span>
                      </div>
                      <span className="text-lg font-semibold text-white">{post.workout.duration}</span>
                    </div>
                    <div className="bg-[#0a0a0b] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <ScaleIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-[#8b8b8b]">Volume</span>
                      </div>
                      <span className="text-lg font-semibold text-white">{post.workout.volume}</span>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                <div className="px-4 pb-4">
                  <h4 className="text-sm font-medium text-[#8b8b8b] mb-3">Exercícios realizados</h4>
                  <div className="space-y-2">
                    {post.workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-[#0a0a0b] rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-white">{exercise.name}</span>
                        </div>
                        <span className="text-sm text-[#8b8b8b]">{exercise.sets} sets</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-[#2d2d30]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-[#8b8b8b] hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.likes > 0 ? post.likes : 'Curtir'}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-[#8b8b8b] hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments > 0 ? post.comments : 'Comentar'}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 text-[#8b8b8b] hover:text-green-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Compartilhar</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {post.pr && <FireIcon className="w-5 h-5 text-orange-500" />}
                      <BoltIcon className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-[#8b8b8b]">Carregando mais treinos...</span>
                </div>
              </div>
            )}
            
            {/* End of Feed */}
            {!hasMore && (
              <div className="text-center py-8">
                <p className="text-[#8b8b8b]">🎉 Você viu todos os treinos por hoje!</p>
                <p className="text-sm text-[#666] mt-2">Continue treinando para ver mais conteúdo.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80">
          {/* User Profile Card */}
          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 mb-6 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Matheus</h3>
              <p className="text-sm text-[#8b8b8b] mb-4">@mathalves</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">127</div>
                  <div className="text-xs text-[#8b8b8b]">Treinos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">89</div>
                  <div className="text-xs text-[#8b8b8b]">Seguindo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">156</div>
                  <div className="text-xs text-[#8b8b8b]">Seguidores</div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Athletes */}
          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-white mb-4">Atletas Sugeridos</h3>
            <div className="space-y-3">
              {suggestedAthletes.map((athlete) => (
                <div key={athlete.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{athlete.avatar}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{athlete.name}</h4>
                      <p className="text-xs text-[#8b8b8b]">@{athlete.username}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollow(athlete.id)}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
