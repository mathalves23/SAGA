import React, { useState } from 'react';
import { useOffline } from '../../hooks/useOffline';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/card';

const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline, lastSync, pendingSyncCount, forcSync } = useOffline();
  const [showDetails, setShowDetails] = useState(false);

  if (isOnline && pendingSyncCount === 0) {
    return null; // Não mostrar nada quando online e sem dados pendentes
  }

  return (
    <>
      {/* Indicador fixo no topo */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOffline ? 'bg-red-900/90' : 'bg-teal-900/90'
      } backdrop-blur-sm border-b border-gray-700`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                isOffline ? 'bg-red-400' : 'bg-yellow-400'
              } animate-pulse`}></div>
              
              <div className="text-sm text-white">
                {isOffline ? (
                  <span>🔄 Modo Offline - Dados serão sincronizados quando conectar</span>
                ) : (
                  <span>⚠️ Sincronizando dados...</span>
                )}
              </div>
              
              {pendingSyncCount > 0 && (
                <div className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">
                  {pendingSyncCount} pendente{pendingSyncCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isOnline && pendingSyncCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={forcSync}
                  className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Sincronizar Agora
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-white hover:bg-white/10"
              >
                {showDetails ? 'Ocultar' : 'Detalhes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Espaçador para evitar sobreposição */}
      <div className="h-12"></div>

      {/* Painel de detalhes */}
      {showDetails && (
        <div className="fixed top-12 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  {isOffline ? '📱' : '🔄'} Status de Sincronização
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status de Conexão */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Conexão</h4>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                      isOnline ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm text-white">
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Dados Pendentes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Pendentes</h4>
                    <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700">
                      <span className="text-lg font-bold text-yellow-400">{pendingSyncCount}</span>
                      <p className="text-xs text-gray-400 mt-1">
                        {pendingSyncCount === 1 ? 'item para sincronizar' : 'itens para sincronizar'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Última Sincronização */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Última Sync</h4>
                    <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-700">
                      <span className="text-sm text-white">
                        {lastSync ? (
                          <>
                            <div>{lastSync.toLocaleDateString('pt-BR')}</div>
                            <div className="text-xs text-gray-400">
                              {lastSync.toLocaleTimeString('pt-BR')}
                            </div>
                          </>
                        ) : (
                          'Nunca'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Informações sobre funcionalidade offline */}
                <div className="mt-4 p-3 rounded-lg bg-blue-900/20 border border-blue-700">
                  <h5 className="text-sm font-medium text-blue-300 mb-2">
                    💡 Como funciona o modo offline:
                  </h5>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Seus treinos e metas são salvos localmente</li>
                    <li>• Dados são sincronizados automaticamente quando conectar</li>
                    <li>• Todas as funcionalidades continuam disponíveis offline</li>
                    <li>• Gráficos e relatórios funcionam com dados locais</li>
                  </ul>
                </div>
                
                {/* Ações */}
                <div className="flex justify-end gap-2 mt-4">
                  {isOnline && pendingSyncCount > 0 && (
                    <Button
                      onClick={forcSync}
                      className="bg-primary hover:bg-primary/90"
                    >
                      🔄 Sincronizar Agora
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineIndicator; 