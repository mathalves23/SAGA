import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Image as ImageIcon, 
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minimize2,
  Maximize2,
  Settings,
  RefreshCw
} from 'lucide-react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  threshold?: number;
  isGood?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  color, 
  threshold,
  isGood = true 
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
  const percentage = threshold ? Math.min(100, (numericValue / threshold) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isGood 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {isGood ? 'OK' : 'ALERT'}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          <span className="text-sm text-gray-500 ml-1">{unit}</span>
        </div>
        
        {threshold && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">
              {threshold}{unit} max
            </span>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-${color}-500`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, percentage)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AlertsPanel: React.FC<{ alerts: any[] }> = ({ alerts }) => {
  const recentAlerts = alerts.slice(-5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alertas Recentes
        </h3>
        <span className="ml-auto text-sm text-gray-500">
          {alerts.length} total
        </span>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        <AnimatePresence>
          {recentAlerts.map((alert) => (
            <motion.div
              key={alert.timestamp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'error' 
                  ? 'bg-red-50 border-red-500 dark:bg-red-900/20' 
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                  : 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded ${
                  alert.type === 'error' 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' 
                    : alert.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                  {alert.type === 'error' ? (
                    <XCircle className="w-4 h-4" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recentAlerts.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhum alerta recente</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PerformanceChart: React.FC<{ metrics: any }> = ({ metrics }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, { ...metrics, timestamp: Date.now() }];
      return newHistory.slice(-20); // Manter apenas os últimos 20 pontos
    });
  }, [metrics]);

  const maxValue = Math.max(...history.map(h => h.frameRate), 60);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Performance ao Longo do Tempo
        </h3>
      </div>

      <div className="h-32 relative">
        <svg className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-200 dark:text-gray-600"
              opacity="0.3"
            />
          ))}
          
          {/* Frame rate line */}
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={history.map((point) => 
              `${(index / (history.length - 1)) * 100}%,${100 - (point.frameRate / maxValue) * 100}%`
            ).join(' ')}
          />
          
          {/* Render time line */}
          <polyline
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            points={history.map((point) => 
              `${(index / (history.length - 1)) * 100}%,${100 - (Math.min(point.renderTime, 32) / 32) * 100}%`
            ).join(' ')}
          />
        </svg>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">FPS</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Render (ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptimizationSuggestions: React.FC<{ suggestions: string[] }> = ({ suggestions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sugestões de Otimização
        </h3>
      </div>

      <div className="space-y-2">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
            >
              <div className="p-1 bg-purple-100 dark:bg-purple-900/40 rounded">
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Performance otimizada! Nenhuma sugestão no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PerformanceDashboard: React.FC = () => {
  const {
    metrics,
    alerts,
    isMonitoring,
    clearAlerts,
    getPerformanceScore,
    getOptimizationSuggestions,
    thresholds
  } = usePerformanceMonitor({
    enableRealTimeMonitoring: true,
    enableOptimizations: true,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const performanceScore = getPerformanceScore();
  const suggestions = getOptimizationSuggestions();

  // Só mostra em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'top-4 right-4'} z-50 ${
        isMinimized ? 'w-auto' : 'w-96 max-h-[80vh] overflow-y-auto'
      }`}
    >
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium text-gray-900 dark:text-white">
              Performance Monitor
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              performanceScore >= 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : performanceScore >= 60 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              Score: {performanceScore}
            </div>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Métricas principais */}
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    title="FPS"
                    value={metrics.frameRate}
                    unit="fps"
                    icon={<Activity className="w-4 h-4 text-blue-600" />}
                    color="blue"
                    threshold={thresholds.frameRate}
                    isGood={metrics.frameRate >= thresholds.frameRate}
                  />
                  
                  <MetricCard
                    title="Render"
                    value={metrics.renderTime}
                    unit="ms"
                    icon={<Cpu className="w-4 h-4 text-green-600" />}
                    color="green"
                    threshold={thresholds.renderTime}
                    isGood={metrics.renderTime <= thresholds.renderTime}
                  />
                  
                  <MetricCard
                    title="Memória"
                    value={metrics.memoryUsage}
                    unit="MB"
                    icon={<HardDrive className="w-4 h-4 text-yellow-600" />}
                    color="yellow"
                    threshold={thresholds.memoryUsage}
                    isGood={metrics.memoryUsage <= thresholds.memoryUsage}
                  />
                  
                  <MetricCard
                    title="Cache"
                    value={metrics.cacheHitRate}
                    unit="%"
                    icon={<Server className="w-4 h-4 text-purple-600" />}
                    color="purple"
                    threshold={thresholds.cacheHitRate}
                    isGood={metrics.cacheHitRate >= thresholds.cacheHitRate}
                  />
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
                  </button>
                  
                  <button
                    onClick={clearAlerts}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Detalhes expandidos */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <PerformanceChart metrics={metrics} />
                      <AlertsPanel alerts={alerts} />
                      <OptimizationSuggestions suggestions={suggestions} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PerformanceDashboard; 