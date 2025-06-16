import React, { useState } from 'react';
import { 
  Heart, 
  Dumbbell, 
  User, 
  Calendar,
  Search,
  Filter,
  Star,
  BookmarkIcon,
  TrendingUp,
  Plus
} from 'lucide-react';

interface FavoriteItem {
  id: string;
  type: 'exercise' | 'routine' | 'workout' | 'user';
  title: string;
  description: string;
  author?: string;
  category: string;
  rating: number;
  uses: number;
  dateAdded: string;
  thumbnail?: string;
}

const FavoritesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data para favoritos
  const favorites: FavoriteItem[] = [
    {
      id: '1',
      type: 'exercise',
      title: 'Supino Reto',
      description: 'Exercício fundamental para desenvolvimento do peitoral',
      category: 'Peito',
      rating: 4.8,
      uses: 127,
      dateAdded: '2024-01-10'
    },
    {
      id: '2',
      type: 'routine',
      title: 'Push Pull Legs - Intermediário',
      description: 'Rotina completa de 6 dias dividida por grupos musculares',
      author: 'Carlos Fitness',
      category: 'Hipertrofia',
      rating: 4.9,
      uses: 89,
      dateAdded: '2024-01-08'
    },
    {
      id: '3',
      type: 'workout',
      title: 'HIIT Matinal',
      description: 'Treino rápido de 20 minutos para começar o dia',
      author: 'Ana Silva',
      category: 'Cardio',
      rating: 4.7,
      uses: 234,
      dateAdded: '2024-01-05'
    },
    {
      id: '4',
      type: 'user',
      title: 'Personal João',
      description: 'Personal trainer especializado em hipertrofia',
      category: 'Personal',
      rating: 4.9,
      uses: 156,
      dateAdded: '2024-01-03'
    },
    {
      id: '5',
      type: 'exercise',
      title: 'Agachamento Livre',
      description: 'Movimento básico para desenvolvimento das pernas',
      category: 'Pernas',
      rating: 4.6,
      uses: 198,
      dateAdded: '2024-01-01'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <Dumbbell className="w-5 h-5" />;
      case 'routine': return <Calendar className="w-5 h-5" />;
      case 'workout': return <TrendingUp className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      case 'routine': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'workout': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'user': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exercise': return 'Exercício';
      case 'routine': return 'Rotina';
      case 'workout': return 'Treino';
      case 'user': return 'Usuário';
      default: return 'Item';
    }
  };

  const filteredFavorites = favorites.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.uses - a.uses;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveFavorite = (id: string) => {
    // Implementar remoção de favorito
    console.log('Remover favorito:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Favoritos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Seus exercícios, rotinas e treinos salvos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {favorites.length} itens salvos
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: 'exercise', count: favorites.filter(f => f.type === 'exercise').length, label: 'Exercícios' },
          { type: 'routine', count: favorites.filter(f => f.type === 'routine').length, label: 'Rotinas' },
          { type: 'workout', count: favorites.filter(f => f.type === 'workout').length, label: 'Treinos' },
          { type: 'user', count: favorites.filter(f => f.type === 'user').length, label: 'Usuários' }
        ].map(stat => (
          <div key={stat.type} className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${getTypeColor(stat.type)}`}>
              {getTypeIcon(stat.type)}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.count}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="recent">Mais Recentes</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="popular">Mais Populares</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todos', count: favorites.length },
            { id: 'exercise', label: 'Exercícios', count: favorites.filter(f => f.type === 'exercise').length },
            { id: 'routine', label: 'Rotinas', count: favorites.filter(f => f.type === 'routine').length },
            { id: 'workout', label: 'Treinos', count: favorites.filter(f => f.type === 'workout').length },
            { id: 'user', label: 'Usuários', count: favorites.filter(f => f.type === 'user').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFavorites.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  {getTypeLabel(item.type)}
                </div>
                <button 
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {item.description}
              </p>

              {item.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Por: {item.author}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.uses} usos</span>
                </div>
                <span>
                  Salvo em {new Date(item.dateAdded).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Usar
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <BookmarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedFavorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum favorito encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || activeTab !== 'all' 
              ? 'Tente ajustar seus filtros' 
              : 'Comece salvando exercícios, rotinas e treinos que você mais gosta'}
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            Explorar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 