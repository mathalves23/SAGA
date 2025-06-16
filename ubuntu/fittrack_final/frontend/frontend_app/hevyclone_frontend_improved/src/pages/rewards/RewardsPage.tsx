import React from 'react';

const RewardsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">🎮 Sistema de Recompensas</h1>
      <p className="text-xl mb-8">Evolua, colete badges e suba no ranking através dos seus treinos!</p>
      
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
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full" 
            style={{width: '65%'}}
          ></div>
        </div>
        <p className="text-gray-300">Faltam 350 XP para o próximo nível!</p>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">🏅 Badges Recentes</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-gray-700 rounded">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-medium">Primeiro Treino</p>
                <p className="text-sm text-gray-400">Completou seu primeiro treino</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-700 rounded">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-medium">10 Treinos</p>
                <p className="text-sm text-gray-400">Completou 10 treinos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-700 rounded">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-medium">10 Horas de Treino</p>
                <p className="text-sm text-gray-400">Acumulou 10 horas treinando</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">📊 Estatísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Treinos Completos:</span>
              <span className="font-bold text-blue-400">15</span>
            </div>
            <div className="flex justify-between">
              <span>Tempo Total:</span>
              <span className="font-bold text-green-400">12h</span>
            </div>
            <div className="flex justify-between">
              <span>Sequência Atual:</span>
              <span className="font-bold text-orange-400">3 dias</span>
            </div>
            <div className="flex justify-between">
              <span>Sequência Máxima:</span>
              <span className="font-bold text-purple-400">7 dias</span>
            </div>
            <div className="flex justify-between">
              <span>Peso Total Levantado:</span>
              <span className="font-bold text-red-400">2,500kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">🏆 Ranking Global</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-medium">Carlos Silva</p>
                <p className="text-sm text-gray-400">Nível 5</p>
              </div>
            </div>
            <span className="text-yellow-400 font-bold">2,850 XP</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥈</span>
              <div>
                <p className="font-medium">Ana Costa</p>
                <p className="text-sm text-gray-400">Nível 4</p>
              </div>
            </div>
            <span className="text-gray-300 font-bold">2,100 XP</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-900 rounded border border-purple-500">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-medium text-purple-400">Matheus (Você)</p>
                <p className="text-sm text-gray-400">Nível 3</p>
              </div>
            </div>
            <span className="text-purple-400 font-bold">1,250 XP</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <div className="flex items-center gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <p className="font-medium">João Santos</p>
                <p className="text-sm text-gray-400">Nível 2</p>
              </div>
            </div>
            <span className="text-gray-300 font-bold">980 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
