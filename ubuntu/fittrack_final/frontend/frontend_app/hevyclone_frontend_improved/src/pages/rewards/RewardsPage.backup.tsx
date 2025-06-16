import React from 'react';

const RewardsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">🎮 Sistema de Recompensas</h1>
      <p className="text-xl mb-8">Página de recompensas funcionando!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">🏆 Nível</h3>
          <p className="text-3xl font-bold text-blue-400">3</p>
          <p className="text-gray-400">Dedicado</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">⭐ XP Total</h3>
          <p className="text-3xl font-bold text-purple-400">1,250</p>
          <p className="text-gray-400">Pontos de experiência</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">🎖️ Badges</h3>
          <p className="text-3xl font-bold text-green-400">5</p>
          <p className="text-gray-400">Conquistas desbloqueadas</p>
        </div>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🔥 Progresso Atual</h2>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full" style={{width: '65%'}}></div>
        </div>
        <p className="text-gray-300">Faltam 350 XP para o próximo nível!</p>
      </div>
    </div>
  );
};

export default RewardsPage; 