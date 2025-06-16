import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { userService } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import RecordsHistory from '../../components/RecordsHistory';
import { 
  User, 
  Settings, 
  Trophy, 
  Calendar, 
  Target, 
  TrendingUp, 
  Edit3,
  Camera,
  MapPin,
  Clock,
  Dumbbell,
  Award
} from 'lucide-react';

type ProfileData = {
  name: string;
  email: string;
  bio: string;
  height: string;
  weight: string;
  age: string;
  fitnessGoal: string;
  profileImage: string;
};

type WorkoutData = {
  id: number;
  name: string;
  date: string;
  duration: string;
  volume: string;
  records: number;
  exercises: Array<{
    name: string;
    sets: number;
    icon: string;
  }>;
};

type ProfileStats = {
  totalWorkouts: number;
  followers: number;
  following: number;
  totalWeight: string;
  currentStreak: number;
  maxStreak: number;
  weeklyDuration: Array<{
    week: string;
    hours: number;
  }>;
  totalHours: number;
};

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  // const { profileStats } = useProfile(); // Temporariamente removido
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('Last 12 weeks');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'mathalves',
    email: '',
    bio: '',
    height: '',
    weight: '',
    age: '',
    fitnessGoal: '',
    profileImage: ''
  });

  const [stats] = useState<ProfileStats>({
    totalWorkouts: 488,
    followers: 4,
    following: 4,
    totalWeight: "125.5kg",
    currentStreak: 7,
    maxStreak: 23,
    weeklyDuration: [
      { week: 'Mar 23', hours: 5 },
      { week: 'Apr 06', hours: 5 },
      { week: 'Apr 20', hours: 4 },
      { week: 'May 04', hours: 4 },
      { week: 'May 18', hours: 5 },
      { week: 'Jun 01', hours: 2 },
      { week: 'Jun 15', hours: 5 },
      { week: 'Jun 29', hours: 3 },
      { week: 'Jul 13', hours: 6 },
      { week: 'Jul 27', hours: 5 },
      { week: 'Aug 10', hours: 4 },
      { week: 'Aug 24', hours: 3 }
    ],
    totalHours: 52
  });

  const [recentWorkouts] = useState<WorkoutData[]>([
    {
      id: 1,
      name: 'A - peito + tríceps',
      date: 'an hour ago',
      duration: '52min',
      volume: '21,625 kg',
      records: 1,
      exercises: [
        { name: '4 sets Butterfly (Pec Deck)', sets: 4, icon: '🦋' },
        { name: '4 sets Bench Press (Barbell)', sets: 4, icon: '🏋️' },
        { name: '4 sets Incline Bench Press (Dumbbell)', sets: 4, icon: '💪' }
      ]
    },
    {
      id: 2,
      name: 'B - ombro + antebraço',
      date: '20 May 2025, 16:08',
      duration: '1h 3min',
      volume: '27,030 kg',
      records: 1,
      exercises: [
        { name: '3 sets Crucifixo Inverso Cross', sets: 3, icon: '✋' },
        { name: '3 sets Single Arm Lateral Raise (Cable)', sets: 3, icon: '💪' },
        { name: '4 sets Straight Leg Deadlift', sets: 4, icon: '🏋️' }
      ]
    }
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const achievements = [
    {
      id: '1',
      title: 'Primeira Semana',
      description: 'Complete 7 dias consecutivos',
      icon: '🎯',
      unlocked: true,
      date: '2023-12-01'
    },
    {
      id: '2',
      title: '100 Treinos',
      description: 'Complete 100 treinos',
      icon: '💯',
      unlocked: true,
      date: '2024-01-10'
    },
    {
      id: '3',
      title: 'Maratonista',
      description: 'Complete 30 dias consecutivos',
      icon: '🏃',
      unlocked: false,
      progress: 23
    }
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      const apiData = data as {
        name?: string;
        full_name?: string;
        email?: string;
        bio?: string;
        height?: string;
        weight?: string;
        age?: string;
        fitnessGoal?: string;
        profileImage?: string;
        profile_image_url?: string;
      };
      
      const profileToSet = {
        name: apiData.name || apiData.full_name || user?.name || 'mathalves',
        email: apiData.email || user?.email || 'matheus.aalves@hotmail.com',
        bio: apiData.bio || '',
        height: apiData.height || '',
        weight: apiData.weight || '',
        age: apiData.age || '',
        fitnessGoal: apiData.fitnessGoal || '',
        profileImage: apiData.profileImage || apiData.profile_image_url || ''
      };
      
      setProfileData(profileToSet);
    } catch (error) {
    console.error('Erro ao carregar perfil:', error);
      // Carregar dados do localStorage se disponível
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfileData({
            name: parsed.name || parsed.full_name || user?.name || 'mathalves',
            email: parsed.email || user?.email || 'matheus.aalves@hotmail.com',
            bio: parsed.bio || '',
            height: parsed.height || '',
            weight: parsed.weight || '',
            age: parsed.age || '',
            fitnessGoal: parsed.fitnessGoal || '',
            profileImage: parsed.profileImage || parsed.profile_image_url || ''
          });
        } catch (parseError) {
          console.error('Erro ao parsear dados salvos:', parseError);
          // Fallback para dados do AuthContext
          setProfileData({
            name: user?.name || 'mathalves',
            email: user?.email || 'matheus.aalves@hotmail.com',
            bio: '',
            height: '',
            weight: '',
            age: '',
            fitnessGoal: '',
            profileImage: ''
          });
        }
      } else {
        // Se não há dados salvos, usar dados do AuthContext
        setProfileData({
          name: user?.name || 'mathalves',
          email: user?.email || 'matheus.aalves@hotmail.com',
          bio: '',
          height: '',
          weight: '',
          age: '',
          fitnessGoal: '',
          profileImage: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    loadUserProfile();
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'M';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedData = { ...profileData };
      
      if (imageFile) {
        const base64Image = await convertFileToBase64(imageFile);
        updatedData.profileImage = base64Image;
      }
      
      // Chamar o serviço de atualização
      const result = await userService.updateProfile(updatedData);
      
      // Atualizar o estado local com os dados retornados
      setProfileData({
        name: result.name || result.full_name || updatedData.name,
        email: result.email || updatedData.email,
        bio: result.bio || updatedData.bio,
        height: result.height || updatedData.height,
        weight: result.weight || updatedData.weight,
        age: result.age || updatedData.age,
        fitnessGoal: result.fitnessGoal || updatedData.fitnessGoal,
        profileImage: result.profileImage || result.profile_image_url || updatedData.profileImage
      });
      
      // Sincronizar com o AuthContext
      if (user) {
        const updatedUser = {
          ...user,
          name: result.name || result.full_name || updatedData.name,
          email: result.email || updatedData.email
        };
        setUser(updatedUser);
        // Atualizar também o localStorage do AuthContext
        localStorage.setItem("saga-user", JSON.stringify(updatedUser));
      }
      
      setImagePreview(null);
      setImageFile(null);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes('ago')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = (): React.ReactElement[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: React.ReactElement[] = [];
    
    // Espaços vazios para o primeiro dia
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const hasWorkout = [2, 3, 5, 8, 10, 15, 18, 22, 25, 28].includes(day);
      const isToday = day === 5; // Simular dia atual
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors ${
            isToday 
              ? 'bg-blue-500 text-white font-bold' 
              : hasWorkout 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold' 
                : 'text-[#8b8b8b] hover:bg-[#2d2d30]'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const maxHours = Math.max(...stats.weeklyDuration.map(d => d.hours));

  if (loading && !isEditing) {
    return (
      <div className="pt-20 pb-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">Carregando perfil...</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-[#0a0a0b] min-h-screen text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Editar Perfil</h1>
          <div className="flex gap-2">
            <button 
              onClick={cancelEdit}
                className="bg-[#2d2d30] border border-[#404040] text-white px-4 py-2 rounded-lg hover:bg-[#3d3d40] transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

          <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2d2d30] flex items-center justify-center">
                  {imagePreview || profileData.profileImage ? (
                    <img 
                      src={imagePreview || profileData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                      <span className="text-2xl font-bold text-[#8b8b8b]">
                      {getInitials(profileData.name)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                  <label className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer text-sm">
                  Escolher Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {(imagePreview || profileData.profileImage) && (
                  <button
                    type="button"
                    onClick={removeImage}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-[#8b8b8b] placeholder-[#666] cursor-not-allowed"
                  readOnly
                  disabled
                  title="O email não pode ser alterado após o registro"
                />
                <p className="text-xs text-[#666] mt-1">O email não pode ser alterado</p>
              </div>

              <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleChange}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="170"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleChange}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="70"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Idade
                </label>
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleChange}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="25"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                  Objetivo
                </label>
                <select
                  name="fitnessGoal"
                  value={profileData.fitnessGoal}
                  onChange={handleChange}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Selecione um objetivo</option>
                  <option value="PERDA_PESO">Perda de Peso</option>
                  <option value="GANHO_MASSA">Ganho de Massa</option>
                  <option value="DEFINICAO">Definição</option>
                  <option value="RESISTENCIA">Resistência</option>
                  <option value="FORCA">Força</option>
                </select>
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#8b8b8b] mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                  className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none h-24"
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 relative">
          <button className="absolute top-4 right-4 p-2 bg-black/20 rounded-lg text-white hover:bg-black/30 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-10 border-4 border-white dark:border-gray-800">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              
              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.name || 'Usuário'}
                  </h1>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  @{user?.email?.split('@')[0] || 'usuario'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>São Paulo, BR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde Dez 2023</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalWorkouts}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Treinos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.following}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Seguindo
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.followers}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Seguidores
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalWeight}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Volume Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Sequência
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.maxStreak}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recorde
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'workouts', label: 'Treinos', icon: Dumbbell },
            { id: 'achievements', label: 'Conquistas', icon: Trophy },
            { id: 'progress', label: 'Progresso', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Esta Semana</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">4 treinos</div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Meta Semanal</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">4/5 dias</div>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">58 min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Atividade Recente
                </h3>
                <div className="space-y-3">
                  {recentWorkouts.map(workout => (
                    <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {workout.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(workout.date).toLocaleDateString('pt-BR')} • {workout.duration} • {workout.exercises.length} exercícios
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {workout.volume}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Volume
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Conquistas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                    achievement.unlocked 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          achievement.unlocked 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.unlocked ? (
                          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Award className="w-3 h-3" />
                            Desbloqueado em {new Date(achievement.date!).toLocaleDateString('pt-BR')}
                          </div>
                        ) : achievement.progress ? (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Progresso: {achievement.progress}/30
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(achievement.progress / 30) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === 'workouts' && (
            <div className="text-center py-8">
              <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Histórico de Treinos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aqui você verá todo seu histórico de treinos
              </p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Gráficos de Progresso
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize sua evolução ao longo do tempo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
