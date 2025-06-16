import React, { useState } from 'react';
import { 
  DevicePhoneMobileIcon,
  WifiIcon,
  HeartIcon,
  MoonIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface WearableDevice {
  id: string;
  name: string;
  brand: string;
  model: string;
  connected: boolean;
  batteryLevel: number;
  lastSync: string;
  features: string[];
  icon: string;
}

interface HealthData {
  heartRate: {
    current: number;
    resting: number;
    max: number;
    zones: {
      fat_burn: number;
      cardio: number;
      peak: number;
    };
  };
  sleep: {
    duration: number;
    quality: number;
    deepSleep: number;
    remSleep: number;
  };
  recovery: {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    recommendation: string;
  };
  activity: {
    steps: number;
    calories: number;
    activeMinutes: number;
    workouts: number;
  };
}

const WearablesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'devices' | 'health' | 'settings'>('devices');
  const [syncInProgress, setSyncInProgress] = useState(false);

  const [devices] = useState<WearableDevice[]>([
    {
      id: '1',
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      model: 'Series 9 45mm',
      connected: true,
      batteryLevel: 78,
      lastSync: '2024-12-06T20:15:00',
      features: ['Heart Rate', 'GPS', 'Sleep Tracking', 'Workout Detection'],
      icon: '⌚'
    },
    {
      id: '2',
      name: 'Garmin Forerunner 955',
      brand: 'Garmin',
      model: 'Forerunner 955',
      connected: false,
      batteryLevel: 0,
      lastSync: '2024-12-04T18:30:00',
      features: ['Advanced GPS', 'Training Load', 'Recovery Advisor', 'Body Battery'],
      icon: '🏃‍♂️'
    },
    {
      id: '3',
      name: 'Polar H10',
      brand: 'Polar',
      model: 'H10 Heart Rate Monitor',
      connected: true,
      batteryLevel: 92,
      lastSync: '2024-12-06T20:10:00',
      features: ['ECG Heart Rate', 'Bluetooth/ANT+', 'Waterproof'],
      icon: '❤️'
    }
  ]);

  const [healthData] = useState<HealthData>({
    heartRate: {
      current: 72,
      resting: 58,
      max: 190,
      zones: {
        fat_burn: 45,
        cardio: 35,
        peak: 20
      }
    },
    sleep: {
      duration: 7.5,
      quality: 82,
      deepSleep: 1.8,
      remSleep: 1.2
    },
    recovery: {
      score: 78,
      status: 'good',
      recommendation: 'Hoje é um bom dia para treino moderado. Sua recuperação está boa.'
    },
    activity: {
      steps: 8247,
      calories: 2456,
      activeMinutes: 67,
      workouts: 1
    }
  });

  const handleSync = async (deviceId: string) => {
    setSyncInProgress(true);
    // Simular sincronização
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncInProgress(false);
  };

  const getRecoveryColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            📱 Integração com Wearables
          </h1>
          <p className="text-[#8b8b8b] text-lg">
            Conecte seus dispositivos e monitore dados de saúde em tempo real
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-[#1a1a1b] p-1 rounded-lg w-fit border border-[#2d2d30]">
            {[
              { id: 'devices', label: 'Dispositivos', icon: '📱' },
              { id: 'health', label: 'Dados de Saúde', icon: '❤️' },
              { id: 'settings', label: 'Configurações', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'text-[#8b8b8b] hover:text-white hover:bg-[#2d2d30]'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`bg-[#1a1a1b] border rounded-xl p-6 transition-all ${
                    device.connected 
                      ? 'border-green-500 hover:border-green-400' 
                      : 'border-[#2d2d30] hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{device.icon}</div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                      device.connected 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        device.connected ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      {device.connected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{device.name}</h3>
                  <p className="text-[#8b8b8b] text-sm mb-4">{device.brand} {device.model}</p>

                  {/* Battery Level */}
                  {device.connected && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#8b8b8b]">Bateria</span>
                        <span className="text-white">{device.batteryLevel}%</span>
                      </div>
                      <div className="w-full bg-[#2d2d30] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getBatteryColor(device.batteryLevel)}`}
                          style={{ width: `${device.batteryLevel}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-4">
                    <p className="text-sm text-[#8b8b8b] mb-2">Recursos:</p>
                    <div className="flex flex-wrap gap-1">
                      {device.features.map((feature) => (
                        <span 
                          key={index}
                          className="text-xs bg-[#2d2d30] text-white px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Last Sync */}
                  <p className="text-xs text-[#8b8b8b] mb-4">
                    Última sincronização: {new Date(device.lastSync).toLocaleString('pt-BR')}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {device.connected ? (
                      <button
                        onClick={() => handleSync(device.id)}
                        disabled={syncInProgress}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {syncInProgress ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Sincronizando...
                          </>
                        ) : (
                          <>
                            <WifiIcon className="w-4 h-4" />
                            Sincronizar
                          </>
                        )}
                      </button>
                    ) : (
                      <button className="flex-1 bg-[#2d2d30] text-white py-2 px-4 rounded-lg hover:bg-[#404040] transition-colors">
                        Conectar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Data Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Recovery Score */}
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BoltIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Recuperação</h2>
                  <p className="text-[#8b8b8b]">Score baseado em frequência cardíaca e sono</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getRecoveryColor(healthData.recovery.status)}`}>
                    {healthData.recovery.score}
                  </div>
                  <div className="text-sm text-[#8b8b8b]">Score de Recuperação</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold mb-2 capitalize ${getRecoveryColor(healthData.recovery.status)}`}>
                    {healthData.recovery.status === 'excellent' ? 'Excelente' :
                     healthData.recovery.status === 'good' ? 'Boa' :
                     healthData.recovery.status === 'fair' ? 'Regular' : 'Ruim'}
                  </div>
                  <div className="text-sm text-[#8b8b8b]">Status</div>
                </div>
                <div className="md:col-span-1">
                  <p className="text-sm text-[#8b8b8b] leading-relaxed">
                    {healthData.recovery.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Frequência Cardíaca</h2>
                  <p className="text-[#8b8b8b]">Dados em tempo real e zonas de treino</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{healthData.heartRate.current}</div>
                  <div className="text-xs text-[#8b8b8b]">Atual (bpm)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{healthData.heartRate.resting}</div>
                  <div className="text-xs text-[#8b8b8b]">Repouso (bpm)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{healthData.heartRate.max}</div>
                  <div className="text-xs text-[#8b8b8b]">Máxima (bpm)</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white mb-1">Zonas de Treino</div>
                  <div className="text-xs text-[#8b8b8b]">
                    Queima: {healthData.heartRate.zones.fat_burn}%<br/>
                    Cardio: {healthData.heartRate.zones.cardio}%<br/>
                    Pico: {healthData.heartRate.zones.peak}%
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sleep */}
              <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <MoonIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sono</h3>
                    <p className="text-[#8b8b8b] text-sm">Qualidade do sono</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Duração</span>
                    <span className="text-white font-medium">{healthData.sleep.duration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Qualidade</span>
                    <span className="text-blue-400 font-medium">{healthData.sleep.quality}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Sono Profundo</span>
                    <span className="text-white font-medium">{healthData.sleep.deepSleep}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">REM</span>
                    <span className="text-white font-medium">{healthData.sleep.remSleep}h</span>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <BoltIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Atividade</h3>
                    <p className="text-[#8b8b8b] text-sm">Hoje</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Passos</span>
                    <span className="text-green-400 font-medium">{healthData.activity.steps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Calorias</span>
                    <span className="text-orange-400 font-medium">{healthData.activity.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Minutos Ativos</span>
                    <span className="text-blue-400 font-medium">{healthData.activity.activeMinutes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b8b8b]">Treinos</span>
                    <span className="text-purple-400 font-medium">{healthData.activity.workouts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Configurações de Sincronização</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Sincronização Automática</h4>
                    <p className="text-[#8b8b8b] text-sm">Sincronizar dados a cada 15 minutos</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Notificações de Saúde</h4>
                    <p className="text-[#8b8b8b] text-sm">Alertas baseados em dados dos wearables</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Análise de Overtraining</h4>
                    <p className="text-[#8b8b8b] text-sm">Detectar sinais de overtraining automaticamente</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Compartilhar com Coach</h4>
                    <p className="text-[#8b8b8b] text-sm">Permitir que o coach virtual acesse dados de saúde</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1b] border border-[#2d2d30] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Privacidade dos Dados</h3>
              
              <div className="space-y-4">
                <p className="text-[#8b8b8b] text-sm">
                  Seus dados de saúde são criptografados e armazenados com segurança. 
                  Você tem controle total sobre quem pode acessar suas informações.
                </p>
                
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
                  Gerenciar Privacidade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WearablesPage; 