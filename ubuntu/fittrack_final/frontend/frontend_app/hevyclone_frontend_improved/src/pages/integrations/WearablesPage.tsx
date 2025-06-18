import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DevicePhoneMobileIcon,
  WifiIcon,
  BatteryIcon,
  HeartIcon,
  BoltIcon,
  MapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  LinkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  FaceSmileIcon,
  FireIcon,
  PlayIcon,
  PauseIcon,
  SignalIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  WifiIcon as WifiIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

interface WearableDevice {
  id: string;
  name: string;
  brand: 'apple' | 'fitbit' | 'garmin' | 'samsung' | 'huawei' | 'google';
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  lastSync: Date;
  syncStatus: 'syncing' | 'synced' | 'error' | 'offline';
  capabilities: string[];
  icon: string;
  color: string;
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  source: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
}

interface WorkoutData {
  id: string;
  type: string;
  duration: number;
  calories: number;
  heartRate: {
    avg: number;
    max: number;
    zones: { zone: string; time: number; percentage: number }[];
  };
  distance?: number;
  steps?: number;
  source: string;
  timestamp: Date;
}

const WearablesPage: React.FC = () => {
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [availableDevices, setAvailableDevices] = useState<WearableDevice[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<WearableDevice | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 15, // minutes
    syncWorkouts: true,
    syncHeartRate: true,
    syncSleep: true,
    syncSteps: true,
    syncCalories: true,
    notifications: true
  });

  useEffect(() => {
    // Dados mockados
    const mockConnectedDevices: WearableDevice[] = [
      {
        id: '1',
        name: 'Apple Watch Series 9',
        brand: 'apple',
        model: 'A2986',
        isConnected: true,
        batteryLevel: 78,
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        syncStatus: 'synced',
        capabilities: ['heart-rate', 'gps', 'workout', 'sleep', 'notifications'],
        icon: '⌚',
        color: '#007AFF'
      },
      {
        id: '2',
        name: 'Fitbit Charge 5',
        brand: 'fitbit',
        model: 'FB421',
        isConnected: true,
        batteryLevel: 45,
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        syncStatus: 'syncing',
        capabilities: ['heart-rate', 'steps', 'sleep', 'stress'],
        icon: '💪',
        color: '#00D2FF'
      }
    ];

    const mockAvailableDevices: WearableDevice[] = [
      {
        id: '3',
        name: 'Garmin Forerunner 955',
        brand: 'garmin',
        model: 'GRM955',
        isConnected: false,
        batteryLevel: 0,
        lastSync: new Date(0),
        syncStatus: 'offline',
        capabilities: ['heart-rate', 'gps', 'workout', 'recovery', 'training-load'],
        icon: '🏃',
        color: '#007CC3'
      },
      {
        id: '4',
        name: 'Samsung Galaxy Watch 6',
        brand: 'samsung',
        model: 'SM-R950',
        isConnected: false,
        batteryLevel: 0,
        lastSync: new Date(0),
        syncStatus: 'offline',
        capabilities: ['heart-rate', 'sleep', 'stress', 'body-composition'],
        icon: '⌚',
        color: '#1428A0'
      }
    ];

    const mockHealthMetrics: HealthMetric[] = [
      {
        id: '1',
        name: 'Frequência Cardíaca',
        value: 72,
        unit: 'bpm',
        trend: 'stable',
        source: 'Apple Watch',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        icon: HeartIcon,
        color: 'text-red-500'
      },
      {
        id: '2',
        name: 'Passos',
        value: 8456,
        unit: 'passos',
        trend: 'up',
        source: 'Fitbit',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        icon: MapIcon,
        color: 'text-blue-500'
      },
      {
        id: '3',
        name: 'Calorias Queimadas',
        value: 345,
        unit: 'kcal',
        trend: 'up',
        source: 'Apple Watch',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        icon: FireIcon,
        color: 'text-orange-500'
      },
      {
        id: '4',
        name: 'Qualidade do Sono',
        value: 87,
        unit: '%',
        trend: 'up',
        source: 'Fitbit',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        icon: FaceSmileIcon,
        color: 'text-purple-500'
      }
    ];

    const mockWorkoutData: WorkoutData[] = [
      {
        id: '1',
        type: 'Corrida',
        duration: 32,
        calories: 285,
        heartRate: {
          avg: 145,
          max: 178,
          zones: [
            { zone: 'Zona 1', time: 5, percentage: 15.6 },
            { zone: 'Zona 2', time: 18, percentage: 56.3 },
            { zone: 'Zona 3', time: 9, percentage: 28.1 }
          ]
        },
        distance: 5.2,
        steps: 6890,
        source: 'Apple Watch',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'Musculação',
        duration: 45,
        calories: 195,
        heartRate: {
          avg: 125,
          max: 165,
          zones: [
            { zone: 'Zona 1', time: 15, percentage: 33.3 },
            { zone: 'Zona 2', time: 25, percentage: 55.6 },
            { zone: 'Zona 3', time: 5, percentage: 11.1 }
          ]
        },
        source: 'Fitbit',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    setConnectedDevices(mockConnectedDevices);
    setAvailableDevices(mockAvailableDevices);
    setHealthMetrics(mockHealthMetrics);
    setWorkoutData(mockWorkoutData);
  }, []);

  const getBrandColor = (brand: WearableDevice['brand']) => {
    switch (brand) {
      case 'apple': return '#007AFF';
      case 'fitbit': return '#00D2FF';
      case 'garmin': return '#007CC3';
      case 'samsung': return '#1428A0';
      case 'huawei': return '#FF0000';
      case 'google': return '#4285F4';
      default: return '#6B7280';
    }
  };

  const getSyncStatusIcon = (status: WearableDevice['syncStatus']) => {
    switch (status) {
      case 'synced': return <CheckCircleIconSolid className="h-5 w-5 text-green-500" />;
      case 'syncing': return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'offline': return <WifiIcon className="h-5 w-5 text-gray-400" />;
      default: return <WifiIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const connectDevice = async (deviceId: string) => {
    const device = availableDevices.find(d => d.id === deviceId);
    if (!device) return;

    // Simulate connection
    setIsScanning(true);
    setTimeout(() => {
      const connectedDevice = {
        ...device,
        isConnected: true,
        batteryLevel: Math.floor(Math.random() * 100),
        lastSync: new Date(),
        syncStatus: 'synced' as const
      };
      
      setConnectedDevices(prev => [...prev, connectedDevice]);
      setAvailableDevices(prev => prev.filter(d => d.id !== deviceId));
      setIsScanning(false);
    }, 3000);
  };

  const disconnectDevice = (deviceId: string) => {
    const device = connectedDevices.find(d => d.id === deviceId);
    if (!device) return;

    const disconnectedDevice = {
      ...device,
      isConnected: false,
      batteryLevel: 0,
      lastSync: new Date(0),
      syncStatus: 'offline' as const
    };

    setConnectedDevices(prev => prev.filter(d => d.id !== deviceId));
    setAvailableDevices(prev => [...prev, disconnectedDevice]);
  };

  const syncDevice = (deviceId: string) => {
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, syncStatus: 'syncing', lastSync: new Date() }
          : device
      )
    );

    setTimeout(() => {
      setConnectedDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { ...device, syncStatus: 'synced' }
            : device
        )
      );
    }, 2000);
  };

  const DeviceCard = ({ device, isConnected }: { device: WearableDevice; isConnected: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-2xl border-2 ${
        isConnected 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } transition-all cursor-pointer`}
      onClick={() => setSelectedDevice(device)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{device.icon}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.name}</h3>
            <p className="text-sm text-gray-600">{device.model}</p>
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center space-x-2">
            {getSyncStatusIcon(device.syncStatus)}
            <div className="flex items-center space-x-1">
              <BatteryIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{device.batteryLevel}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {device.capabilities.map(capability => (
          <span 
            key={capability}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {capability}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isConnected ? (
            <>Última sync: {device.lastSync.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</>
          ) : (
            'Dispositivo disponível'
          )}
        </div>
        
        {isConnected ? (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                syncDevice(device.id);
              }}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              disabled={device.syncStatus === 'syncing'}
            >
              <ArrowPathIcon className={`h-4 w-4 ${device.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                disconnectDevice(device.id);
              }}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LinkIcon className="h-4 w-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              connectDevice(device.id);
            }}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isScanning ? 'Conectando...' : 'Conectar'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  const MetricCard = ({ metric }: { metric: HealthMetric }) => {
    const Icon = metric.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${metric.color}`} />
            <span className="font-medium text-gray-900">{metric.name}</span>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            metric.trend === 'up' ? 'bg-green-100 text-green-700' :
            metric.trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {metric.value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{metric.source}</span>
          <span>{metric.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
      </motion.div>
    );
  };

  const WorkoutCard = ({ workout }: { workout: WorkoutData }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{workout.type}</h4>
          <p className="text-sm text-gray-600">{workout.source}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{workout.duration} min</div>
          <div className="text-xs text-gray-600">
            {workout.timestamp.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-orange-600">{workout.calories}</div>
          <div className="text-xs text-gray-600">kcal</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{workout.heartRate.avg}</div>
          <div className="text-xs text-gray-600">bpm médio</div>
        </div>
        {workout.distance && (
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{workout.distance}</div>
            <div className="text-xs text-gray-600">km</div>
          </div>
        )}
        {workout.steps && (
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{workout.steps.toLocaleString()}</div>
            <div className="text-xs text-gray-600">passos</div>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-700 mb-1">Zonas de FC:</div>
        {workout.heartRate.zones.map((zone, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{zone.zone}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-red-500 h-1.5 rounded-full"
                  style={{ width: `${zone.percentage}%` }}
                />
              </div>
              <span className="text-gray-600 w-8">{zone.time}min</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wearables</h1>
                <p className="text-gray-600">Conecte e sincronize seus dispositivos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsScanning(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
              >
                Escanear Dispositivos
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Status da Conexão</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <WifiIconSolid className="h-4 w-4 text-green-500" />
              <span>{connectedDevices.length} dispositivo(s) conectado(s)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedDevices.map(device => (
              <DeviceCard key={device.id} device={device} isConnected={true} />
            ))}
            {connectedDevices.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <DevicePhoneMobileIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum dispositivo conectado</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Saúde</h3>
              <div className="grid grid-cols-1 gap-4">
                {healthMetrics.map(metric => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            </div>

            {/* Available Devices */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos Disponíveis</h3>
              <div className="space-y-4">
                {availableDevices.map(device => (
                  <DeviceCard key={device.id} device={device} isConnected={false} />
                ))}
                {availableDevices.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Todos os dispositivos compatíveis já estão conectados</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Workout Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treinos Sincronizados</h3>
            <div className="space-y-4">
              {workoutData.map(workout => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configurações de Sincronização</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Sincronização Automática</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSyncSettings(prev => ({ ...prev, autoSync: !prev.autoSync }))}
                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                      syncSettings.autoSync ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: syncSettings.autoSync ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="inline-block h-5 w-5 mt-0.5 bg-white rounded-full shadow"
                    />
                  </motion.button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo de Sincronização (minutos)
                  </label>
                  <select
                    value={syncSettings.syncInterval}
                    onChange={(e) => setSyncSettings(prev => ({ 
                      ...prev, 
                      syncInterval: parseInt(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                  </select>
                </div>
                
                {['syncWorkouts', 'syncHeartRate', 'syncSleep', 'syncSteps', 'syncCalories', 'notifications'].map(setting => (
                  <div key={setting} className="flex items-center justify-between">
                    <span className="text-gray-900">
                      {setting === 'syncWorkouts' ? 'Sincronizar Treinos' :
                       setting === 'syncHeartRate' ? 'Sincronizar Frequência Cardíaca' :
                       setting === 'syncSleep' ? 'Sincronizar Sono' :
                       setting === 'syncSteps' ? 'Sincronizar Passos' :
                       setting === 'syncCalories' ? 'Sincronizar Calorias' :
                       'Notificações'}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSyncSettings(prev => ({ 
                        ...prev, 
                        [setting]: !prev[setting as keyof typeof prev] 
                      }))}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        syncSettings[setting as keyof typeof syncSettings] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: syncSettings[setting as keyof typeof syncSettings] ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-block h-5 w-5 mt-0.5 bg-white rounded-full shadow"
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WearablesPage; 