import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Plus, 
  Play, 
  TrendingUp, 
  Activity, 
  Award, 
  Calendar, 
  Clock,
  BarChart,
  Target,
  Dumbbell,
  User,
  Heart,
  MessageSquare,
  Share
} from '../ui/Icons';

interface Stat {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface QuickAction {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  featured?: boolean;
}

interface RecentWorkout {
  id: number;
  name: string;
  date: string;
  duration: string;
  exercises: number;
  volume?: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Estados dos dados
  const [stats, setStats] = useState<Stat[]>([
    {
      label: 'Treinos esta semana',
      value: 4,
      change: 33,
      changeLabel: 'vs semana passada',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      label: 'Sequência atual',
      value: 12,
      change: 20,
      changeLabel: 'melhor sequência',
      icon: Award,
      color: 'text-green-500'
    },
    {
      label: 'Volume total (kg)',
      value: '2.8k',
      change: 15,
      changeLabel: 'este mês',
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      label: 'Tempo médio',
      value: '58min',
      change: -5,
      changeLabel: 'por treino',
      icon: Clock,
      color: 'text-slate-500'
    }
  ]);
  
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([
    { 
      id: 1, 
      name: 'Treino A - Peito e Tríceps', 
      date: '2025-06-05', 
      duration: '58 min',
      exercises: 6,
      volume: 2840
    },
    { 
      id: 2, 
      name: 'Treino B - Costas e Bíceps', 
      date: '2025-06-03', 
      duration: '62 min',
      exercises: 7,
      volume: 3120
    },
    { 
      id: 3, 
      name: 'Treino C - Pernas', 
      date: '2025-06-01', 
      duration: '75 min',
      exercises: 8,
      volume: 4200
    }
  ]);

  const quickActions: QuickAction[] = [
    {
      to: '/routines',
      label: 'Iniciar Treino',
      description: 'Comece um treino agora',
      icon: Play,
      color: 'action-primary',
      featured: true
    },
    {
      to: '/routines/create',
      label: 'Nova Rotina',
      description: 'Crie uma nova rotina',
      icon: Plus,
      color: 'action-secondary'
    },
    {
      to: '/exercises',
      label: 'Exercícios',
      description: 'Explore a biblioteca',
      icon: Dumbbell,
      color: 'action-accent'
    },
    {
      to: '/workout/history',
      label: 'Estatísticas',
      description: 'Acompanhe seu progresso',
      icon: BarChart,
      color: 'action-muted'
    }
  ];

  // Simulação de carregamento
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Atualização do horário
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  if (loading) {
  return (
      <div className="container-responsive py-8 animate-fade-in">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-8 w-64"></div>
            <div className="skeleton h-5 w-48"></div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-4 w-24 mb-2"></div>
                <div className="skeleton h-8 w-16 mb-2"></div>
                <div className="skeleton h-3 w-20"></div>
              </div>
            ))}
      </div>

          {/* Actions Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-8 w-8 rounded-lg mb-3"></div>
                <div className="skeleton h-4 w-20 mb-1"></div>
                <div className="skeleton h-3 w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8 space-y-8 animate-fade-in">
      {/* Header personalizado */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || user?.username || 'Atleta'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
        </div>
          
          {/* Quick Start */}
          <div className="mt-4 sm:mt-0">
            <Link
              to="/routines"
              className="bg-gradient-to-r from-teal-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-purple-700 transition-all duration-200 shadow-lg group inline-flex items-center"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Iniciar Treino
            </Link>
        </div>
        </div>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="workout-card p-6 animate-slide-up group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg stats-icon ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stat.change > 0 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${
                      stat.change < 0 
                        ? 'rotate-180 text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                    <span className={stat.change > 0 
                      ? 'text-green-600 dark:text-green-400 font-medium' 
                      : 'text-red-600 dark:text-red-400 font-medium'
                    }>
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {stat.changeLabel && (
                  <p className="text-xs text-muted-foreground">{stat.changeLabel}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ações rápidas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Ações rápidas</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className={`workout-card p-6 animate-slide-up group ${
                  action.featured ? 'ring-2 ring-primary/20' : ''
                }`}
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
          </Link>
            );
          })}
        </div>
      </div>

      {/* Treinos recentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Treinos recentes</h2>
          <Link 
            to="/workout/history" 
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentWorkouts.map((workout) => (
            <Link
              key={workout.id}
              to={`/workout/history/${workout.id}`}
              className="workout-card block animate-slide-up hover:shadow-lg transition-all duration-200"
              style={{ animationDelay: `${index * 100 + 600}ms` }}
            >
              <div className="workout-card-body">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {workout.name}
                      </h3>
                      <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium">
                        {formatDate(workout.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{workout.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{workout.exercises} exercícios</span>
                      </div>
                      {workout.volume && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{workout.volume.toLocaleString()} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <Play className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {recentWorkouts.length === 0 && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Nenhum treino ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece sua jornada fitness criando sua primeira rotina!
            </p>
            <Link to="/routines/create" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira rotina
            </Link>
          </div>
        )}
      </div>

      {/* Conquistas da semana */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">🏆 Conquista da semana</h3>
          <Link to="/rewards" className="text-primary hover:text-primary/80 text-sm">
            Ver todas
          </Link>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-800/50 to-purple-800/50 rounded-lg border border-slate-700">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">Consistência de Ferro!</h4>
            <p className="text-sm text-muted-foreground">
              Você treinou 4 vezes esta semana. Continue assim! 💪
            </p>
          </div>
          <div className="text-primary font-bold text-lg">+50 XP</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
