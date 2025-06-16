import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Tipos
export interface FavoriteItem {
  id: string;
  type: 'exercise' | 'routine' | 'post' | 'user';
  title: string;
  subtitle?: string;
  metadata?: Record<string, any>;
  dateAdded: string;
  category?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'dateAdded'>) => Promise<void>;
  removeFavorite: (id: string, type: FavoriteItem['type']) => Promise<void>;
  isFavorite: (id: string, type: FavoriteItem['type']) => boolean;
  getFavoritesByType: (type: FavoriteItem['type']) => FavoriteItem[];
  getFavoritesByCategory: (category: string) => FavoriteItem[];
  clearFavorites: (type?: FavoriteItem['type']) => Promise<void>;
  toggleFavorite: (item: Omit<FavoriteItem, 'dateAdded'>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider
interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    loadFavorites();
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem('saga-favorites');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
      
      // Em uma aplicação real, faria uma requisição para a API aqui
      // const response = await api.get('/favorites');
      // setFavorites(response.data as unknown);
    } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
      setError('Erro ao carregar favoritos');
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (favoritesToSave: FavoriteItem[]) => {
    try {
      localStorage.setItem('saga-favorites', JSON.stringify(favoritesToSave));
      
      // Em uma aplicação real, sincronizaria com a API
      // await api.post('/favorites/sync', favoritesToSave);
    } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addFavorite = async (item: Omit<FavoriteItem, 'dateAdded'>) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar se já existe
      const exists = favorites.some(fav => fav.id === item.id && fav.type === item.type);
      if (exists) {
        toast.error('Item já está nos favoritos');
        return;
      }

      const newFavorite: FavoriteItem = {
        ...item,
        dateAdded: new Date().toISOString()
      };

      setFavorites(prev => [newFavorite, ...prev]);
      
      // Em uma aplicação real, faria requisição para API
      // await api.post('/favorites', newFavorite);
      
      toast.success(`${getTypeLabel(item.type)} adicionado aos favoritos`);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_favorites', {
          event_category: 'engagement',
          event_label: item.type,
          item_id: item.id
        });
      }
    } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
      setError('Erro ao adicionar favorito');
      toast.error('Erro ao adicionar aos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string, type: FavoriteItem['type']) => {
    try {
      setLoading(true);
      setError(null);

      const favoriteToRemove = favorites.find(fav => fav.id === id && fav.type === type);
      if (!favoriteToRemove) {
        toast.error('Item não encontrado nos favoritos');
        return;
      }

      setFavorites(prev => prev.filter(fav => !(fav.id === id && fav.type === type)));
      
      // Em uma aplicação real, faria requisição para API
      // await api.delete(`/favorites/${id}?type=${type}`);
      
      toast.success(`${getTypeLabel(type)} removido dos favoritos`);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'remove_from_favorites', {
          event_category: 'engagement',
          event_label: type,
          item_id: id
        });
      }
    } catch (error) {
    console.error('Erro ao remover favorito:', error);
      setError('Erro ao remover favorito');
      toast.error('Erro ao remover dos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (id: string, type: FavoriteItem['type']): boolean => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  };

  const getFavoritesByType = (type: FavoriteItem['type']): FavoriteItem[] => {
    return favorites
      .filter(fav => fav.type === type)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  };

  const getFavoritesByCategory = (category: string): FavoriteItem[] => {
    return favorites
      .filter(fav => fav.category === category)
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
  };

  const clearFavorites = async (type?: FavoriteItem['type']) => {
    try {
      setLoading(true);
      setError(null);

      if (type) {
        setFavorites(prev => prev.filter(fav => fav.type !== type));
        toast.success(`Favoritos de ${getTypeLabel(type)} removidos`);
      } else {
        setFavorites([]);
        toast.success('Todos os favoritos removidos');
      }
      
      // Em uma aplicação real, faria requisição para API
      // await api.delete(`/favorites${type ? `?type=${type}` : ''}`);
    } catch (error) {
    console.error('Erro ao limpar favoritos:', error);
      setError('Erro ao limpar favoritos');
      toast.error('Erro ao limpar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (item: Omit<FavoriteItem, 'dateAdded'>) => {
    if (isFavorite(item.id, item.type)) {
      await removeFavorite(item.id, item.type);
    } else {
      await addFavorite(item);
    }
  };

  const getTypeLabel = (type: FavoriteItem['type']): string => {
    switch (type) {
      case 'exercise': return 'Exercício';
      case 'routine': return 'Rotina';
      case 'post': return 'Post';
      case 'user': return 'Usuário';
      default: return 'Item';
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoritesByType,
    getFavoritesByCategory,
    clearFavorites,
    toggleFavorite,
    loading,
    error
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  
  if (context === undefined) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  
  return context;
};

// Componente de botão de favorito
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'dateAdded'>;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'button' | 'icon';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  item,
  size = 'md',
  showText = false,
  className = '',
  variant = 'icon'
}) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const favorited = isFavorite(item.id, item.type);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    await toggleFavorite(item);
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          favorited
            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
            : 'border-[#404040] text-[#8b8b8b] hover:border-red-500/50 hover:text-red-400'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {favorited ? (
          <HeartSolid className={`${sizes[size]} text-red-500`} />
        ) : (
          <HeartOutline className={sizes[size]} />
        )}
        {showText && (
          <span className="text-sm">
            {favorited ? 'Favoritado' : 'Favoritar'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${buttonSizes[size]} rounded-lg transition-all duration-200 group ${
        favorited
          ? 'text-red-500 hover:bg-red-500/10'
          : 'text-[#8b8b8b] hover:text-red-400 hover:bg-red-500/5'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      {favorited ? (
        <HeartSolid 
          className={`${sizes[size]} transition-transform group-hover:scale-110`} 
        />
      ) : (
        <HeartOutline 
          className={`${sizes[size]} transition-transform group-hover:scale-110`} 
        />
      )}
    </button>
  );
};

// Componente de lista de favoritos
interface FavoritesListProps {
  type?: FavoriteItem['type'];
  category?: string;
  onItemClick?: (item: FavoriteItem) => void;
  className?: string;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  type,
  category,
  onItemClick,
  className = ''
}) => {
  const { favorites, getFavoritesByType, getFavoritesByCategory, removeFavorite } = useFavorites();

  const filteredFavorites = type 
    ? getFavoritesByType(type)
    : category 
    ? getFavoritesByCategory(category)
    : favorites;

  if (filteredFavorites.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <HeartOutline className="w-12 h-12 text-[#404040] mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-1">
          Nenhum favorito ainda
        </h3>
        <p className="text-[#8b8b8b] text-sm">
          Adicione exercícios, rotinas e posts aos favoritos para acesso rápido
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {filteredFavorites.map((favorite) => (
        <div
          key={`${favorite.type}-${favorite.id}`}
          className="flex items-center gap-3 p-3 bg-[#1a1a1b] border border-[#2d2d30] rounded-lg hover:bg-[#2d2d30] transition-colors cursor-pointer"
          onClick={() => onItemClick?.(favorite)}
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">
              {favorite.title}
            </h4>
            {favorite.subtitle && (
              <p className="text-sm text-[#8b8b8b] truncate">
                {favorite.subtitle}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#666] capitalize">
                {favorite.type}
              </span>
              <span className="text-xs text-[#666]">
                {new Date(favorite.dateAdded).toLocaleDateString('pt-BR')}
              </span>
              {favorite.category && (
                <span className="text-xs px-2 py-0.5 bg-[#404040] text-[#8b8b8b] rounded">
                  {favorite.category}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFavorite(favorite.id, favorite.type);
            }}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Remover dos favoritos"
          >
            <HeartSolid className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default useFavorites; 