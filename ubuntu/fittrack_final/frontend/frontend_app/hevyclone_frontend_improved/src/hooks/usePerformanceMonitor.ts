import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  frameRate: number;
  cacheHitRate: number;
  imageLoadTime: number;
  apiResponseTime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
}

interface UsePerformanceMonitorOptions {
  enableRealTimeMonitoring?: boolean;
  alertThresholds?: Partial<Record<keyof PerformanceMetrics, number>>;
  samplingInterval?: number;
  enableOptimizations?: boolean;
}

const DEFAULT_THRESHOLDS: Record<keyof PerformanceMetrics, number> = {
  renderTime: 16, // 60fps target
  memoryUsage: 100, // MB
  cpuUsage: 80, // %
  networkLatency: 1000, // ms
  frameRate: 55, // fps
  cacheHitRate: 80, // %
  imageLoadTime: 2000, // ms
  apiResponseTime: 5000, // ms
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    frameRate: 60,
    cacheHitRate: 100,
    imageLoadTime: 0,
    apiResponseTime: 0,
  };

  private alerts: PerformanceAlert[] = [];
  private observers: Set<Function> = new Set();
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private renderStartTime = 0;
  private isMonitoring = false;

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    
    this.monitorFrameRate();
    this.monitorMemoryUsage();
    this.monitorNetworkLatency();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  private monitorFrameRate() {
    const measureFrame = () => {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      
      this.frameCount++;
      
      if (this.frameCount % 60 === 0) {
        const avgFrameTime = deltaTime / 60;
        this.metrics.frameRate = Math.round(1000 / avgFrameTime);
        this.frameCount = 0;
        this.notifyObservers();
      }
      
      this.lastFrameTime = currentTime;
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  private monitorMemoryUsage() {
    if (!('memory' in performance)) return;

    const interval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }

      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        this.notifyObservers();
      }
    }, 1000);
  }

  private async monitorNetworkLatency() {
    if (!navigator.onLine) return;

    const interval = setInterval(async () => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }

      try {
        const start = performance.now();
        await fetch('/api/ping', { method: 'HEAD' });
        const latency = performance.now() - start;
        this.metrics.networkLatency = Math.round(latency);
        this.notifyObservers();
      } catch (error) {
        // Ignora erros de rede
      }
    }, 5000);
  }

  measureRenderStart() {
    this.renderStartTime = performance.now();
  }

  measureRenderEnd() {
    if (this.renderStartTime > 0) {
      this.metrics.renderTime = Math.round(performance.now() - this.renderStartTime);
      this.renderStartTime = 0;
      this.notifyObservers();
    }
  }

  measureApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    return apiCall().then(
      (result) => {
        this.metrics.apiResponseTime = Math.round(performance.now() - start);
        this.notifyObservers();
        return result;
      },
      (error) => {
        this.metrics.apiResponseTime = Math.round(performance.now() - start);
        this.notifyObservers();
        throw error;
      }
    );
  }

  measureImageLoad(imageUrl: string): Promise<void> {
    const start = performance.now();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.metrics.imageLoadTime = Math.round(performance.now() - start);
        this.notifyObservers();
        resolve();
      };
      
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  updateCacheMetrics(hits: number, total: number) {
    this.metrics.cacheHitRate = total > 0 ? Math.round((hits / total) * 100) : 100;
    this.notifyObservers();
  }

  checkThresholds(thresholds: Record<keyof PerformanceMetrics, number>) {
    const newAlerts: PerformanceAlert[] = [];

    Object.entries(this.metrics).forEach(([metric, value]) => {
      const threshold = thresholds[metric as keyof PerformanceMetrics];
      
      if (threshold && this.shouldAlert(metric as keyof PerformanceMetrics, value, threshold)) {
        newAlerts.push({
          type: this.getAlertType(metric as keyof PerformanceMetrics, value, threshold),
          message: this.getAlertMessage(metric as keyof PerformanceMetrics, value, threshold),
          timestamp: Date.now(),
          metric: metric as keyof PerformanceMetrics,
          value,
          threshold,
        });
      }
    });

    this.alerts.push(...newAlerts);
    
    // Manter apenas os últimos 50 alertas
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }

    if (newAlerts.length > 0) {
      this.notifyObservers();
    }
  }

  private shouldAlert(metric: keyof PerformanceMetrics, value: number, threshold: number): boolean {
    switch (metric) {
      case 'frameRate':
      case 'cacheHitRate':
        return value < threshold;
      default:
        return value > threshold;
    }
  }

  private getAlertType(metric: keyof PerformanceMetrics, value: number, threshold: number): 'warning' | 'error' | 'info' {
    const ratio = this.shouldAlert(metric, value, threshold) ? value / threshold : threshold / value;
    
    if (ratio > 2) return 'error';
    if (ratio > 1.5) return 'warning';
    return 'info';
  }

  private getAlertMessage(metric: keyof PerformanceMetrics, value: number, threshold: number): string {
    const messages = {
      renderTime: `Tempo de renderização alto: ${value}ms (limite: ${threshold}ms)`,
      memoryUsage: `Uso de memória alto: ${value}MB (limite: ${threshold}MB)`,
      cpuUsage: `Uso de CPU alto: ${value}% (limite: ${threshold}%)`,
      networkLatency: `Latência de rede alta: ${value}ms (limite: ${threshold}ms)`,
      frameRate: `Taxa de quadros baixa: ${value}fps (mínimo: ${threshold}fps)`,
      cacheHitRate: `Taxa de cache baixa: ${value}% (mínimo: ${threshold}%)`,
      imageLoadTime: `Carregamento de imagem lento: ${value}ms (limite: ${threshold}ms)`,
      apiResponseTime: `Resposta da API lenta: ${value}ms (limite: ${threshold}ms)`,
    };

    return messages[metric];
  }

  subscribe(callback: Function) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  private notifyObservers() {
    this.observers.forEach(callback => callback(this.metrics, this.alerts));
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  clearAlerts() {
    this.alerts = [];
    this.notifyObservers();
  }

  // Otimizações automáticas
  applyOptimizations() {
    // Reduzir qualidade de imagens se performance estiver ruim
    if (this.metrics.frameRate < 30 || this.metrics.memoryUsage > 150) {
      this.suggestImageOptimization();
    }

    // Sugerir lazy loading se muitas imagens estão carregando
    if (this.metrics.imageLoadTime > 3000) {
      this.suggestLazyLoading();
    }

    // Sugerir cache mais agressivo se hit rate estiver baixo
    if (this.metrics.cacheHitRate < 60) {
      this.suggestCacheOptimization();
    }
  }

  private suggestImageOptimization() {
    console.log('🎯 Sugestão: Reduzir qualidade das imagens para melhorar performance');
  }

  private suggestLazyLoading() {
    console.log('🎯 Sugestão: Implementar lazy loading mais agressivo para imagens');
  }

  private suggestCacheOptimization() {
    console.log('🎯 Sugestão: Aumentar cache de imagens e dados da API');
  }
}

const globalPerformanceMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions = {}) => {
  const {
    enableRealTimeMonitoring = true,
    alertThresholds = DEFAULT_THRESHOLDS,
    samplingInterval = 1000,
    enableOptimizations = true,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>(globalPerformanceMonitor.getMetrics());
  const [alerts, setAlerts] = useState<PerformanceAlert[]>(globalPerformanceMonitor.getAlerts());
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const thresholds = { ...DEFAULT_THRESHOLDS, ...alertThresholds };
  const optimizationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enableRealTimeMonitoring) {
      globalPerformanceMonitor.startMonitoring();
      setIsMonitoring(true);
    }

    const unsubscribe = globalPerformanceMonitor.subscribe((newMetrics: PerformanceMetrics, newAlerts: PerformanceAlert[]) => {
      setMetrics(newMetrics);
      setAlerts(newAlerts);
    });

    return () => {
      unsubscribe();
      if (enableRealTimeMonitoring) {
        globalPerformanceMonitor.stopMonitoring();
        setIsMonitoring(false);
      }
    };
  }, [enableRealTimeMonitoring]);

  // Verificação de thresholds
  useEffect(() => {
    const interval = setInterval(() => {
      globalPerformanceMonitor.checkThresholds(thresholds);
      
      if (enableOptimizations) {
        globalPerformanceMonitor.applyOptimizations();
      }
    }, samplingInterval);

    return () => clearInterval(interval);
  }, [thresholds, samplingInterval, enableOptimizations]);

  const measureRender = useCallback(() => {
    return {
      start: () => globalPerformanceMonitor.measureRenderStart(),
      end: () => globalPerformanceMonitor.measureRenderEnd(),
    };
  }, []);

  const measureApiCall = useCallback(<T,>(apiCall: () => Promise<T>) => {
    return globalPerformanceMonitor.measureApiCall(apiCall);
  }, []);

  const measureImageLoad = useCallback((imageUrl: string) => {
    return globalPerformanceMonitor.measureImageLoad(imageUrl);
  }, []);

  const updateCacheMetrics = useCallback((hits: number, total: number) => {
    globalPerformanceMonitor.updateCacheMetrics(hits, total);
  }, []);

  const clearAlerts = useCallback(() => {
    globalPerformanceMonitor.clearAlerts();
  }, []);

  const getPerformanceScore = useCallback(() => {
    const scores = {
      renderTime: Math.max(0, 100 - (metrics.renderTime / thresholds.renderTime) * 100),
      memoryUsage: Math.max(0, 100 - (metrics.memoryUsage / thresholds.memoryUsage) * 100),
      frameRate: Math.min(100, (metrics.frameRate / thresholds.frameRate) * 100),
      cacheHitRate: metrics.cacheHitRate,
      networkLatency: Math.max(0, 100 - (metrics.networkLatency / thresholds.networkLatency) * 100),
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    return Math.round(totalScore);
  }, [metrics, thresholds]);

  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];

    if (metrics.renderTime > thresholds.renderTime) {
      suggestions.push('Otimizar componentes pesados e reduzir re-renders');
    }

    if (metrics.memoryUsage > thresholds.memoryUsage) {
      suggestions.push('Limpar cache de imagens e componentes não utilizados');
    }

    if (metrics.frameRate < thresholds.frameRate) {
      suggestions.push('Reduzir animações complexas e usar transform/opacity');
    }

    if (metrics.cacheHitRate < thresholds.cacheHitRate) {
      suggestions.push('Implementar cache mais eficiente para dados e imagens');
    }

    if (metrics.imageLoadTime > thresholds.imageLoadTime) {
      suggestions.push('Usar formatos de imagem mais eficientes (WebP, AVIF)');
    }

    if (metrics.apiResponseTime > thresholds.apiResponseTime) {
      suggestions.push('Otimizar queries da API e implementar cache');
    }

    return suggestions;
  }, [metrics, thresholds]);

  return {
    metrics,
    alerts,
    isMonitoring,
    measureRender,
    measureApiCall,
    measureImageLoad,
    updateCacheMetrics,
    clearAlerts,
    getPerformanceScore,
    getOptimizationSuggestions,
    thresholds,
  };
};

export default usePerformanceMonitor; 