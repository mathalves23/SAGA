import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ClockIcon,
  FireIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useDebounce } from '../../hooks/useDebounce';

// Tipos
interface SearchResult {
  id: string;
  type: 'user' | 'exercise' | 'routine' | 'workout' | 'post';
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
  relevanceScore?: number;
}

interface SearchFilters {
  types: string[];
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: 'short' | 'medium' | 'long'; // <30min, 30-60min, >60min
  muscleGroups?: string[];
}

interface GlobalSearchProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  showFilters?: boolean;
  maxResults?: number;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = "Buscar usuários, exercícios, rotinas...",
  onResultSelect,
  className = "",
  showFilters = true,
  maxResults = 50
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['user', 'exercise', 'routine', 'workout', 'post'],
    dateRange: 'all'
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce para otimização
  const debouncedQuery = useDebounce(query, 300);

  // Mock data para demonstração
  const mockSearchData = useMemo(() => [
    // Usuários
    {
      id: 'user-1',
      type: 'user' as const,
      title: 'Carlos Silva',
      subtitle: '@carlos_fit',
      description: '156 seguidores • Crossfit & Musculação',
      image: 'https://api.dicebear.com/7.x/avatars/svg?seed=carlos',
      metadata: { followers: 156, workouts: 45 }
    },
    {
      id: 'user-2',
      type: 'user' as const,
      title: 'Ana Santos',
      subtitle: '@ana_strong',
      description: '89 seguidores • Yoga & Pilates',
      image: 'https://api.dicebear.com/7.x/avatars/svg?seed=ana',
      metadata: { followers: 89, workouts: 67 }
    },
    
    // Exercícios
    {
      id: 'exercise-1',
      type: 'exercise' as const,
      title: 'Supino Reto',
      subtitle: 'Peito, Tríceps, Ombros',
      description: 'Exercício básico para desenvolvimento do peitoral',
      metadata: { difficulty: 'intermediate', equipment: 'Barra', muscleGroups: ['Peito', 'Tríceps'] }
    },
    {
      id: 'exercise-2',
      type: 'exercise' as const,
      title: 'Agachamento Livre',
      subtitle: 'Pernas, Glúteos, Core',
      description: 'Exercício fundamental para força das pernas',
      metadata: { difficulty: 'beginner', equipment: 'Peso corporal', muscleGroups: ['Pernas', 'Glúteos'] }
    },
    
    // Rotinas
    {
      id: 'routine-1',
      type: 'routine' as const,
      title: 'Push Pull Legs',
      subtitle: '6 exercícios • 45-60 min',
      description: 'Rotina clássica para ganho de massa muscular',
      metadata: { exercises: 6, duration: 60, difficulty: 'intermediate' }
    },
    {
      id: 'routine-2',
      type: 'routine' as const,
      title: 'HIIT Cardio',
      subtitle: '8 exercícios • 20-30 min',
      description: 'Treino intervalado de alta intensidade',
      metadata: { exercises: 8, duration: 25, difficulty: 'advanced' }
    }
  ], []);

  // Carregar buscas recentes
  useEffect(() => {
    const saved = localStorage.getItem('saga-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.warn('Erro ao carregar buscas recentes:', error);
      }
    }
  }, []);

  // Busca principal
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    performSearch(debouncedQuery);
  }, [debouncedQuery, filters]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Filtrar dados mock
      const filteredResults = mockSearchData
        .filter(item => {
          // Filtro por tipo
          if (!filters.types.includes(item.type)) return false;
          
          // Filtro por texto
          const searchText = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(searchText);
          const matchesSubtitle = item.subtitle?.toLowerCase().includes(searchText);
          const matchesDescription = item.description?.toLowerCase().includes(searchText);
          
          return matchesTitle || matchesSubtitle || matchesDescription;
        })
        .map(item => ({
          ...item,
          relevanceScore: calculateRelevance(item, searchQuery)
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, maxResults);

      setResults(filteredResults);
    } catch (error) {
    console.error('Erro na busca:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
      setSelectedIndex(-1);
    }
  };

  const calculateRelevance = (item: SearchResult, query: string): number => {
    const searchText = query.toLowerCase();
    let score = 0;
    
    // Título tem maior peso
    if (item.title.toLowerCase().includes(searchText)) score += 10;
    if (item.title.toLowerCase().startsWith(searchText)) score += 5;
    
    // Subtitle
    if (item.subtitle?.toLowerCase().includes(searchText)) score += 5;
    
    // Description
    if (item.description?.toLowerCase().includes(searchText)) score += 2;
    
    // Penalizar resultados muito longos
    score -= item.title.length * 0.1;
    
    return score;
  };

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('saga-recent-searches', JSON.stringify(updated));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    onResultSelect?.(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('saga-recent-searches');
  };

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return UserIcon;
      case 'exercise': return FireIcon;
      case 'routine': return ClipboardDocumentListIcon;
      case 'workout': return AcademicCapIcon;
      case 'post': return HeartIcon;
      default: return MagnifyingGlassIcon;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return 'Usuários';
      case 'exercise': return 'Exercícios';
      case 'routine': return 'Rotinas';
      case 'workout': return 'Treinos';
      case 'post': return 'Posts';
      default: return type;
    }
  };

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });
    
    return groups;
  }, [results]);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Input principal */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b8b8b]" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg pl-10 pr-12 py-3 text-white placeholder-[#666] focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          data-onboarding="search"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-[#404040] rounded transition-colors"
              aria-label="Limpar busca"
            >
              <XMarkIcon className="w-4 h-4 text-[#8b8b8b]" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-1 hover:bg-[#404040] rounded transition-colors ${
                showAdvancedFilters ? 'text-purple-400' : 'text-[#8b8b8b]'
              }`}
              aria-label="Filtros avançados"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtros avançados */}
      {showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-4 shadow-xl z-50">
          <div className="space-y-4">
            {/* Tipos */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipos de resultado
              </label>
              <div className="flex flex-wrap gap-2">
                {['user', 'exercise', 'routine', 'workout', 'post'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      const newTypes = filters.types.includes(type)
                        ? filters.types.filter(t => t !== type)
                        : [...filters.types, type];
                      handleFilterChange({ types: newTypes });
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      filters.types.includes(type)
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-[#404040] text-[#8b8b8b] hover:border-purple-500'
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Período
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange({ 
                  dateRange: e.target.value as SearchFilters['dateRange'] 
                })}
                className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Todos os períodos</option>
                <option value="today">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
                <option value="year">Este ano</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1b] border border-[#2d2d30] rounded-lg shadow-xl max-h-96 overflow-y-auto z-40"
        >
          {/* Loading */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-[#8b8b8b]">Buscando...</p>
            </div>
          )}

          {/* Buscas recentes */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-[#2d2d30]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white">Buscas recentes</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#8b8b8b] hover:text-white transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      setIsOpen(true);
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm text-[#8b8b8b] hover:text-white hover:bg-[#2d2d30] rounded transition-colors flex items-center gap-2"
                  >
                    <ClockIcon className="w-4 h-4" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resultados agrupados */}
          {!isLoading && query && (
            <>
              {Object.keys(groupedResults).length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-[#8b8b8b]">Nenhum resultado encontrado</p>
                  <p className="text-xs text-[#666] mt-1">
                    Tente termos diferentes ou remova alguns filtros
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {Object.entries(groupedResults).map(([type, typeResults]) => {
                    const TypeIcon = getTypeIcon(type);
                    
                    return (
                      <div key={type}>
                        <div className="sticky top-0 bg-[#1a1a1b] px-4 py-2 border-b border-[#2d2d30]">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-[#8b8b8b]" />
                            <span className="text-sm font-medium text-white">
                              {getTypeLabel(type)} ({typeResults.length})
                            </span>
                          </div>
                        </div>
                        
                        {typeResults.map((result) => {
                          const globalIndex = results.indexOf(result);
                          return (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className={`w-full p-4 text-left hover:bg-[#2d2d30] transition-colors border-b border-[#2d2d30] last:border-b-0 ${
                                selectedIndex === globalIndex ? 'bg-[#2d2d30]' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {result.image ? (
                                  <img
                                    src={result.image}
                                    alt=""
                                    className="w-10 h-10 rounded-full bg-[#2d2d30]"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-[#2d2d30] rounded-full flex items-center justify-center">
                                    <TypeIcon className="w-5 h-5 text-[#8b8b8b]" />
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white font-medium truncate">
                                    {result.title}
                                  </h4>
                                  {result.subtitle && (
                                    <p className="text-sm text-[#8b8b8b] truncate">
                                      {result.subtitle}
                                    </p>
                                  )}
                                  {result.description && (
                                    <p className="text-xs text-[#666] mt-1 line-clamp-2">
                                      {result.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Sugestões quando vazio */}
          {!query && !isLoading && recentSearches.length === 0 && (
            <div className="p-4">
              <p className="text-sm text-[#8b8b8b] mb-3">Sugestões:</p>
              <div className="space-y-1">
                {['supino', 'agachamento', 'treino peito', 'cardio'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setIsOpen(true);
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm text-[#666] hover:text-white hover:bg-[#2d2d30] rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 