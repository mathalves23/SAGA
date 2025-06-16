import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Plus, Search, Filter } from 'lucide-react';

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: number;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  lastUsed?: string;
}

const RoutinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data para rotinas
  const routines: Routine[] = [
    {
      id: '1',
      name: 'Push Pull Legs',
      description: 'Rotina clássica de treino dividida em grupos musculares',
      exercises: 12,
      duration: '60-90 min',
      difficulty: 'Intermediário',
      category: 'Hipertrofia',
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      name: 'Full Body Iniciante',
      description: 'Treino completo para quem está começando',
      exercises: 8,
      duration: '45-60 min',
      difficulty: 'Iniciante',
      category: 'Iniciante'
    },
    {
      id: '3',
      name: 'HIIT Cardio',
      description: 'Treino intervalado de alta intensidade',
      exercises: 6,
      duration: '20-30 min',
      difficulty: 'Avançado',
      category: 'Cardio',
      lastUsed: '2024-01-10'
    }
  ];

  const categories = ['all', 'Hipertrofia', 'Força', 'Cardio', 'Iniciante', 'Avançado'];

  const filteredRoutines = routines.filter(routine => {
    const matchesSearch = routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         routine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || routine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-600 bg-green-100';
      case 'Intermediário': return 'text-yellow-600 bg-yellow-100';
      case 'Avançado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rotinas de Treino
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize e gerencie suas rotinas de exercícios
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Rotina
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar rotinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todas as Categorias</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map(routine => (
          <div key={routine.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {routine.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(routine.difficulty)}`}>
                {routine.difficulty}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {routine.description}
            </p>
            
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4" />
                <span>{routine.exercises} exercícios</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{routine.duration}</span>
              </div>
            </div>
            
            {routine.lastUsed && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="w-3 h-3" />
                <span>Último uso: {new Date(routine.lastUsed).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Usar Rotina
              </button>
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma rotina encontrada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente ajustar seus filtros de busca' 
              : 'Crie sua primeira rotina de treino para começar'}
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            Criar Primeira Rotina
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutinesPage; 