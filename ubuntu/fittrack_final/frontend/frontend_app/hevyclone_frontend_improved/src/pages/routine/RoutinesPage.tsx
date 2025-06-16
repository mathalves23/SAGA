import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  FireIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface Routine {
  id: number;
  name: string;
  exercises: number;
  duration: string;
  difficulty: string;
  category: string;
  description: string;
  lastUsed?: string;
}

interface Folder {
  id: number;
  name: string;
  count: number;
  routines: Routine[];
}

const RoutinesPage: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<number | null>(null);

  const folders: Folder[] = [
    {
      id: 1,
      name: 'Treino de Força',
      count: 5,
      routines: [
        {
          id: 1,
          name: 'Push Day',
          exercises: 6,
          duration: '45min',
          difficulty: 'Intermediário',
          category: 'Força',
          description: 'Treino focado em peito, ombros e tríceps'
        },
        {
          id: 2,
          name: 'Pull Day',
          exercises: 5,
          duration: '40min',
          difficulty: 'Intermediário', 
          category: 'Força',
          description: 'Treino focado em costas e bíceps'
        }
      ]
    },
    {
      id: 2,
      name: 'Cardio & Resistência',
      count: 3,
      routines: [
        {
          id: 3,
          name: 'HIIT Completo',
          exercises: 8,
          duration: '30min',
          difficulty: 'Avançado',
          category: 'Cardio',
          description: 'Treino intervalado de alta intensidade'
        }
      ]
    }
  ];

  const recentRoutines: Routine[] = [
    {
      id: 1,
      name: 'Push Day',
      exercises: 6,
      duration: '45min',
      difficulty: 'Intermediário',
      category: 'Força',
      description: 'Treino focado em peito, ombros e tríceps',
      lastUsed: '2 dias atrás'
    },
    {
      id: 3,
      name: 'HIIT Completo',
      exercises: 8,
      duration: '30min', 
      difficulty: 'Avançado',
      category: 'Cardio',
      description: 'Treino intervalado de alta intensidade',
      lastUsed: '1 semana atrás'
    }
  ];

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Rotinas
            </h1>
            <p className="text-[#8b8b8b]">Organize e gerencie suas rotinas de treino</p>
          </div>
          <Link
            to="/routines/create"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nova Rotina
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Folders */}
          <div className="xl:col-span-1">
            <h2 className="text-xl font-bold text-white mb-6">Pastas</h2>
            <div className="space-y-3">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-purple-500 ${
                    activeFolder === folder.id ? 'border-purple-500 bg-[#252527]' : ''
                  }`}
                  onClick={() => setActiveFolder(activeFolder === folder.id ? null : folder.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderIcon className="w-6 h-6 text-purple-400" />
                      <div>
                        <h3 className="font-medium text-white">{folder.name}</h3>
                        <p className="text-sm text-[#8b8b8b]">({folder.count})</p>
                      </div>
                    </div>
                    <EllipsisHorizontalIcon className="w-5 h-5 text-[#8b8b8b]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Routines */}
          <div className="xl:col-span-2">
            {/* Recent Routines */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentRoutines.map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-6 hover:border-purple-500 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{routine.name}</h3>
                        <p className="text-sm text-[#8b8b8b] mb-2">{routine.category}</p>
                        <p className="text-sm text-[#8b8b8b]">{routine.description}</p>
                      </div>
                      <EllipsisHorizontalIcon className="w-5 h-5 text-[#8b8b8b]" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#8b8b8b] mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FireIcon className="w-4 h-4" />
                          <span>{routine.exercises} exercícios</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{routine.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b]">
                        {routine.lastUsed}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-[#2d2d30] transition-colors">
                          <DocumentDuplicateIcon className="w-4 h-4 text-[#8b8b8b]" />
                        </button>
                        <Link
                          to={`/routines/${routine.id}`}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm"
                        >
                          Iniciar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Routines */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Todas as Rotinas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.flatMap(folder => folder.routines).map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-[#1a1a1b] border border-[#2d2d30] rounded-lg p-4 hover:border-purple-500 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-white mb-2">{routine.name}</h3>
                    <p className="text-sm text-[#8b8b8b] mb-3">{routine.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8b8b8b]">{routine.exercises} exercícios</span>
                      <span className="text-[#8b8b8b]">{routine.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutinesPage; 