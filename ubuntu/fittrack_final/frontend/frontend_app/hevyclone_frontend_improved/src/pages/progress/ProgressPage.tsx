import React from 'react';

const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Meu Progresso
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Acompanhe sua evolução e estatísticas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Treinos Totais</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">0h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Total</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sequência Atual</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conquistas</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Gráfico de Progresso
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Dados de progresso aparecerão aqui
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Complete alguns treinos para ver suas estatísticas
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 