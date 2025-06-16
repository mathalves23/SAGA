import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Dumbbell, Target, Clock, Plus, Play, Pause, Eye, Heart, Star, Zap } from 'lucide-react';
import { exerciseService } from '../../services/exerciseService';
import { exerciseImageService } from '../../services/exerciseImageService';
import { Exercise } from '../../types/exercise';

// Hook personalizado para lazy loading de imagens
const useImageLazyLoad = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());

  const loadImage = useCallback((src: string, id: string) => {
    if (loadedImages.has(src)) return;

    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set([...prev, src]));
      imageRefs.current.set(id, img);
    };
    img.src = src;
  }, [loadedImages]);

  const isImageLoaded = useCallback((src: string) => {
    return loadedImages.has(src);
  }, [loadedImages]);

  return { loadImage, isImageLoaded };
};

// Componente de imagem otimizada com lazy loading
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  exerciseId: string;
}> = ({ src, alt, className, placeholder, onLoad, exerciseId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse flex items-center justify-center">
          {placeholder || <Dumbbell className="w-8 h-8 text-white/60" />}
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
          <Dumbbell className="w-8 h-8 text-white/60" />
        </div>
      )}
    </div>
  );
};

// Componente de cartão de exercício otimizado
const ExerciseCard: React.FC<{
  exercise: Exercise;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onFavorite: (id: number) => void;
  isFavorite: boolean;
}> = ({ exercise, isHovered, onHover, onFavorite, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getExerciseImage = useCallback(() => {
    // Usar o serviço de imagens se não há imagem URL definida
    if (!exercise.imageUrl && !exercise.animationUrl) {
      const images = exerciseImageService.getExerciseImages(exercise.name);
      if (isHovered) {
        return images.animated;
      }
      return images.static;
    }
    
    // Comportamento original se há URLs definidas
    if (isHovered && exercise.animationUrl) {
      return exercise.animationUrl;
    }
    return exercise.imageUrl || exercise.animationUrl || null;
  }, [isHovered, exercise.imageUrl, exercise.animationUrl, exercise.name]);

  const hasAnimation = useMemo(() => {
    // Verificar se há animação definida ou se o serviço de imagens tem GIF
    if (exercise.animationUrl && exercise.animationUrl !== exercise.imageUrl) {
      return true;
    }
    
    // Se não há URLs definidas, verificar se o serviço tem imagens diferentes
    if (!exercise.imageUrl && !exercise.animationUrl) {
      const images = exerciseImageService.getExerciseImages(exercise.name);
      return images.static !== images.animated;
    }
    
    return false;
  }, [exercise.animationUrl, exercise.imageUrl, exercise.name]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Avançado': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 
                 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-xl 
                 hover:shadow-purple-500/10 hover:-translate-y-2 ${isHovered ? 'scale-105 z-10' : ''}`}
      onMouseEnter={() => onHover(exercise.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Badge de favorito */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(exercise.id);
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300
                   ${isFavorite 
                     ? 'bg-red-500/90 text-white shadow-lg scale-110' 
                     : 'bg-black/20 text-white/80 hover:bg-red-500/70 hover:text-white'}`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Container da imagem com efeitos */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
        {getExerciseImage() ? (
          <>
            <OptimizedImage
              src={getExerciseImage()!}
              alt={exercise.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              exerciseId={exercise.id.toString()}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Indicador de animação */}
            {hasAnimation && (
              <div className={`absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full p-2 
                             transition-all duration-300 ${isHovered ? 'bg-green-500/80 scale-110' : ''}`}>
                {isHovered ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </div>
            )}

            {/* Badge de mídia */}
            <div className="absolute bottom-3 left-3 flex gap-1">
              {exercise.imageUrl && (
                <span className="text-blue-400 text-xs bg-blue-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-400/30">
                  IMG
                </span>
              )}
              {exercise.animationUrl && (
                <span className="text-green-400 text-xs bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-green-400/30">
                  GIF
                </span>
              )}
              {exercise.videoUrl && (
                <span className="text-red-400 text-xs bg-red-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-red-400/30">
                  VID
                </span>
              )}
            </div>

            {/* Nome original sobreposto */}
            {exercise.originalName && exercise.originalName !== exercise.name && (
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {exercise.originalName}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/80 h-full">
            <Dumbbell className="w-16 h-16 mb-2 animate-pulse" />
            <span className="text-sm">Sem imagem</span>
          </div>
        )}
      </div>
      
      {/* Conteúdo do cartão */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {exercise.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getDifficultyColor(exercise.difficultyLevelName || 'Intermediário')}`}>
            {exercise.difficultyLevelName || 'Intermediário'}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {exercise.description || 'Descrição não disponível'}
        </p>
        
        {/* Informações do exercício */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Músculo:
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {exercise.primaryMuscleGroupName || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              Equipamento:
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {exercise.equipmentName || 'N/A'}
            </span>
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="flex gap-2">
                    <Link
            to={`/exercises/${exercise.id}`}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 
                     hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </Link>
          <button className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                           text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                           transition-all duration-300 hover:border-purple-400 hover:shadow-md">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Painel de detalhes expansível */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-300">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instruções:</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {exercise.instructions?.split('\n').map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold min-w-[1rem]">{index + 1}.</span>
                  <span>{instruction.replace(/^\d+\.\s*/, '')}</span>
                </div>
              )) || <p>Instruções não disponíveis</p>}
            </div>
          </div>  
        )}
      </div>
    </div>
  );
};

const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredExercise, setHoveredExercise] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'muscle'>('name');

  // Cache para otimização
  const { loadImage, isImageLoaded } = useImageLazyLoad();

  // Carregar exercícios da API
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await exerciseService.getAll();
        setExercises(data);
        setError(null);
        
        // Pre-carregar algumas imagens importantes
        data.slice(0, 8).forEach(exercise => {
          if (exercise.imageUrl) {
            loadImage(exercise.imageUrl, exercise.id.toString());
          } else {
            // Pré-carregar imagens do serviço para exercícios sem URL definida
            const images = exerciseImageService.getExerciseImages(exercise.name);
            loadImage(images.static, exercise.id.toString() + '_static');
            // Não pré-carregar GIFs para economizar banda
          }
        });

        // Pré-carregar imagens de exercícios mais comuns em background
        setTimeout(() => {
          exerciseImageService.preloadExerciseImages([
            'Supino Reto', 'Agachamento', 'Pull-up', 'Desenvolvimento Militar',
            'Rosca Direta', 'Abdominal', 'Levantamento Terra', 'Remada Curvada'
          ]);
        }, 1000);
      } catch (err) {
        console.error('Erro ao carregar exercícios:', err);
        setError('Erro ao carregar exercícios');
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [loadImage]);

  // Memoização para filtros e listas
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(exercises.map(ex => ex.primaryMuscleGroupName || 'Outros')))],
    [exercises]
  );

  const muscles = useMemo(() => 
    ['all', ...Array.from(new Set(exercises.map(ex => ex.primaryMuscleGroupName || 'Outros')))],
    [exercises]
  );

  const difficulties = useMemo(() => 
    ['all', ...Array.from(new Set(exercises.map(ex => ex.difficultyLevelName || 'Intermediário')))],
    [exercises]
  );

  // Filtros otimizados com memoização
  const filteredExercises = useMemo(() => {
    const filtered = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exercise.primaryMuscleGroupName === selectedCategory;
      const matchesMuscle = selectedMuscle === 'all' || exercise.primaryMuscleGroupName === selectedMuscle;
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficultyLevelName === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesMuscle && matchesDifficulty;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const diffOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
          return (diffOrder[a.difficultyLevelName as keyof typeof diffOrder] || 2) - 
                 (diffOrder[b.difficultyLevelName as keyof typeof diffOrder] || 2);
        case 'muscle':
          return (a.primaryMuscleGroupName || '').localeCompare(b.primaryMuscleGroupName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [exercises, searchTerm, selectedCategory, selectedMuscle, selectedDifficulty, sortBy]);

  // Handlers otimizados
  const handleFavorite = useCallback((exerciseId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(exerciseId)) {
        newFavorites.delete(exerciseId);
      } else {
        newFavorites.add(exerciseId);
      }
      return newFavorites;
    });
  }, []);

  const handleHover = useCallback((exerciseId: number | null) => {
    setHoveredExercise(exerciseId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Carregando exercícios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Oops! Algo deu errado</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                     hover:shadow-lg hover:shadow-purple-500/25"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header melhorado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Biblioteca de Exercícios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Explore {exercises.length} exercícios com demonstrações visuais incríveis
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                           text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold
                           transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
            <Plus className="w-5 h-5" />
            Novo Exercício
          </button>
        </div>
      </div>

      {/* Filtros e busca melhorados */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {/* Barra de busca principal */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar exercícios por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-300"
            />
          </div>
          
          {/* Filtros em linha */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas as Categorias</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dificuldade</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas as Dificuldades</option>
                {difficulties.slice(1).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'muscle')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Nome</option>
                <option value="difficulty">Dificuldade</option>
                <option value="muscle">Músculo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visualização</label>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  Grade
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold text-purple-600">{filteredExercises.length}</span> de{' '}
              <span className="font-semibold">{exercises.length}</span> exercícios
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{favorites.size} favoritos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de exercícios otimizado */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isHovered={hoveredExercise === exercise.id}
            onHover={handleHover}
            onFavorite={handleFavorite}
            isFavorite={favorites.has(exercise.id)}
          />
        ))}
      </div>

      {/* Estado vazio melhorado */}
      {filteredExercises.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Nenhum exercício encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
            Tente ajustar os filtros ou termo de busca para encontrar o exercício perfeito
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedMuscle('all');
              setSelectedDifficulty('all');
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 
                     hover:shadow-lg hover:shadow-purple-500/25"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
