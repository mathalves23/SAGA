import React, { useState, useEffect } from 'react';
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  ClockIcon,
  FireIcon,
  CalendarIcon,
  TagIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// Tipos
export interface FilterCriteria {
  // Filtros gerais
  search?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  
  // Filtros de exercício/treino
  muscleGroups?: string[];
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  duration?: {
    min?: number;
    max?: number;
  };
  intensity?: 'low' | 'moderate' | 'high' | 'all';
  
  // Filtros sociais
  following?: boolean;
  hasMedia?: boolean;
  hasAchievements?: boolean;
  
  // Ordenação
  sortBy?: 'date' | 'popularity' | 'difficulty' | 'duration' | 'name';
  sortOrder?: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
  onApply: () => void;
  onClear: () => void;
  filterType?: 'exercises' | 'workouts' | 'users' | 'posts';
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  filterType = 'exercises'
}) => {
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    workout: true,
    social: false,
    sorting: false
  });

  // Dados para filtros
  const muscleGroups = [
    'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 
    'Pernas', 'Glúteos', 'Abdômen', 'Panturrilha', 'Antebraço'
  ];

  const equipmentOptions = [
    'Peso corporal', 'Halteres', 'Barra', 'Máquina', 'Elástico',
    'Kettlebell', 'Medicine Ball', 'TRX', 'Cabo', 'Banco'
  ];

  const intensityLevels = [
    { value: 'all', label: 'Todas' },
    { value: 'low', label: 'Baixa' },
    { value: 'moderate', label: 'Moderada' },
    { value: 'high', label: 'Alta' }
  ];

  const difficultyLevels = [
    { value: 'all', label: 'Todos' },
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Data' },
    { value: 'popularity', label: 'Popularidade' },
    { value: 'difficulty', label: 'Dificuldade' },
    { value: 'duration', label: 'Duração' },
    { value: 'name', label: 'Nome' }
  ];

  // Sincronizar com props quando abrir
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelectChange = (key: keyof FilterCriteria, value: string, isSelected: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const newArray = isSelected 
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterCriteria = {
      dateRange: 'all',
      difficulty: 'all',
      intensity: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (localFilters.search?.trim()) count++;
    if (localFilters.dateRange && localFilters.dateRange !== 'all') count++;
    if (localFilters.muscleGroups?.length) count++;
    if (localFilters.equipment?.length) count++;
    if (localFilters.difficulty && localFilters.difficulty !== 'all') count++;
    if (localFilters.intensity && localFilters.intensity !== 'all') count++;
    if (localFilters.duration?.min || localFilters.duration?.max) count++;
    if (localFilters.following) count++;
    if (localFilters.hasMedia) count++;
    if (localFilters.hasAchievements) count++;
    
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#2d2d30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Filtros Avançados</h2>
              <p className="text-sm text-[#8b8b8b]">
                {getActiveFiltersCount()} filtro(s) ativo(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-[#8b8b8b]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          
          {/* Seção Geral */}
          <div>
            <button
              onClick={() => toggleSection('general')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
            >
              <div className="flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-white">Geral</span>
              </div>
              <ChevronDownIcon 
                className={`w-4 h-4 text-[#8b8b8b] transition-transform ${
                  expandedSections.general ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {expandedSections.general && (
              <div className="mt-4 space-y-4 pl-7">
                {/* Período */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Período
                  </label>
                  <select
                    value={localFilters.dateRange || 'all'}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="today">Hoje</option>
                    <option value="week">Esta semana</option>
                    <option value="month">Este mês</option>
                    <option value="year">Este ano</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                {/* Datas personalizadas */}
                {localFilters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-[#8b8b8b] mb-1">De:</label>
                      <input
                        type="date"
                        value={localFilters.customDateStart || ''}
                        onChange={(e) => handleFilterChange('customDateStart', e.target.value)}
                        className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#8b8b8b] mb-1">Até:</label>
                      <input
                        type="date"
                        value={localFilters.customDateEnd || ''}
                        onChange={(e) => handleFilterChange('customDateEnd', e.target.value)}
                        className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Dificuldade */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Dificuldade
                  </label>
                  <div className="flex gap-2">
                    {difficultyLevels.map(level => (
                      <button
                        key={level.value}
                        onClick={() => handleFilterChange('difficulty', level.value)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localFilters.difficulty === level.value
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-[#404040] text-[#8b8b8b] hover:border-purple-500'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção Treino/Exercício */}
          {(filterType === 'exercises' || filterType === 'workouts') && (
            <div>
              <button
                onClick={() => toggleSection('workout')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FireIcon className="w-5 h-5 text-orange-400" />
                  <span className="font-medium text-white">Treino & Exercício</span>
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-[#8b8b8b] transition-transform ${
                    expandedSections.workout ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {expandedSections.workout && (
                <div className="mt-4 space-y-4 pl-7">
                  {/* Grupos Musculares */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Grupos Musculares
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {muscleGroups.map(group => {
                        const isSelected = localFilters.muscleGroups?.includes(group);
                        return (
                          <button
                            key={group}
                            onClick={() => handleMultiSelectChange('muscleGroups', group, isSelected)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                : 'border-[#404040] text-[#8b8b8b] hover:border-purple-500'
                            }`}
                          >
                            {isSelected && <CheckIcon className="w-4 h-4" />}
                            {group}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Equipamentos */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Equipamentos
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {equipmentOptions.map(equipment => {
                        const isSelected = localFilters.equipment?.includes(equipment);
                        return (
                          <button
                            key={equipment}
                            onClick={() => handleMultiSelectChange('equipment', equipment, isSelected)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                : 'border-[#404040] text-[#8b8b8b] hover:border-blue-500'
                            }`}
                          >
                            {isSelected && <CheckIcon className="w-4 h-4" />}
                            {equipment}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duração */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Duração (minutos)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-[#8b8b8b] mb-1">Mínimo:</label>
                        <input
                          type="number"
                          value={localFilters.duration?.min || ''}
                          onChange={(e) => handleFilterChange('duration', {
                            ...localFilters.duration,
                            min: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                          className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                          min="0"
                          max="300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#8b8b8b] mb-1">Máximo:</label>
                        <input
                          type="number"
                          value={localFilters.duration?.max || ''}
                          onChange={(e) => handleFilterChange('duration', {
                            ...localFilters.duration,
                            max: e.target.value ? parseInt(e.target.value) : undefined
                          })}
                          className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                          min="0"
                          max="300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Intensidade */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Intensidade
                    </label>
                    <div className="flex gap-2">
                      {intensityLevels.map(level => (
                        <button
                          key={level.value}
                          onClick={() => handleFilterChange('intensity', level.value)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            localFilters.intensity === level.value
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-[#404040] text-[#8b8b8b] hover:border-orange-500'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seção Social */}
          {(filterType === 'posts' || filterType === 'users') && (
            <div>
              <button
                onClick={() => toggleSection('social')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-white">Social</span>
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-[#8b8b8b] transition-transform ${
                    expandedSections.social ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {expandedSections.social && (
                <div className="mt-4 space-y-4 pl-7">
                  {/* Checkboxes sociais */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.following || false}
                        onChange={(e) => handleFilterChange('following', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-[#2d2d30] border-[#404040] rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-white">Apenas quem eu sigo</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.hasMedia || false}
                        onChange={(e) => handleFilterChange('hasMedia', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-[#2d2d30] border-[#404040] rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-white">Com fotos/vídeos</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.hasAchievements || false}
                        onChange={(e) => handleFilterChange('hasAchievements', e.target.checked)}
                        className="w-4 h-4 text-purple-500 bg-[#2d2d30] border-[#404040] rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-white">Com conquistas</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seção Ordenação */}
          <div>
            <button
              onClick={() => toggleSection('sorting')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2d2d30] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Ordenação</span>
              </div>
              <ChevronDownIcon 
                className={`w-4 h-4 text-[#8b8b8b] transition-transform ${
                  expandedSections.sorting ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {expandedSections.sorting && (
              <div className="mt-4 space-y-4 pl-7">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={localFilters.sortBy || 'date'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Ordem
                    </label>
                    <select
                      value={localFilters.sortOrder || 'desc'}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      className="w-full bg-[#2d2d30] border border-[#404040] rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="desc">Decrescente</option>
                      <option value="asc">Crescente</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2d2d30] flex items-center justify-between bg-[#1a1a1b]">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-[#8b8b8b] hover:text-white transition-colors"
          >
            Limpar Filtros
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[#404040] text-white rounded-lg hover:bg-[#2d2d30] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters; 