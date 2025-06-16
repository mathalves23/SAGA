import React from 'react';

const WorkoutsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Meus Treinos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie e acompanhe seus treinos
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Treinos Recentes
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Seus treinos aparecerão aqui
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comece criando seu primeiro treino personalizado
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Criar Primeiro Treino
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutsPage; 