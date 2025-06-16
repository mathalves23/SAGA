// Performance Utils para SAGA - Otimizações Completas
import { useCallback, useEffect, useRef, useState } from 'react';

// Performance Monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();
  private static observers: Map<string, PerformanceObserver> = new Map();

  static startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  static endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name, 'measure');
    const duration = entries[entries.length - 1]?.duration || 0;
    
    this.metrics.set(name, duration);
    
    // Limpar marcadores
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  static getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  static getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics.entries());
  }

  static monitorWebVitals(): void {
    // Core Web Vitals
    this.observeMetric('largest-contentful-paint', (entry) => {
      console.log('LCP:', entry.value);
    });

    this.observeMetric('first-input-delay', (entry) => {
      console.log('FID:', entry.value);
    });

    this.observeMetric('cumulative-layout-shift', (entry) => {
      console.log('CLS:', entry.value);
    });

    // Outras métricas importantes
    this.observeMetric('first-contentful-paint', (entry) => {
      console.log('FCP:', entry.value);
    });

    this.observeMetric('time-to-first-byte', (entry) => {
      console.log('TTFB:', entry.value);
    });
  }

  private static observeMetric(
    entryType: string,
    callback: (entry: PerformanceEntry) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });

      observer.observe({ entryTypes: [entryType] });
      this.observers.set(entryType, observer);
    } catch (error) {
      console.warn(`Cannot observe metric ${entryType}:`, error);
    }
  }

  static cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Lazy Loading Hook
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  deps: React.DependencyList = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadFn();
      setData(result);
      loadedRef.current = true;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loadFn, ...deps]);

  const reload = useCallback(() => {
    loadedRef.current = false;
    load();
  }, [load]);

  return { data, loading, error, reload };
}

// Intersection Observer Hook
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const { threshold = 0, root = null, rootMargin = '0%' } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, threshold, root, rootMargin]);

  return entry;
}

// Virtual Scrolling Hook
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
} {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    handleScroll,
  };
}

// Image Optimization
export class ImageOptimizer {
  private static cache = new Map<string, string>();

  static async optimizeImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'webp' | 'png';
    } = {}
  ): Promise<Blob> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem otimizada
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static generateThumbnail(
    file: File,
    size: number = 150
  ): Promise<string> {
    const cacheKey = `${file.name}-${file.size}-${size}`;
    
    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey)!);
    }

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Desenhar thumbnail quadrado
        const minDimension = Math.min(img.width, img.height);
        const x = (img.width - minDimension) / 2;
        const y = (img.height - minDimension) / 2;

        ctx?.drawImage(
          img,
          x, y, minDimension, minDimension,
          0, 0, size, size
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        this.cache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Bundle Analyzer
export function analyzeBundleSize(): void {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((size, script) => {
    const src = (script as HTMLScriptElement).src;
    return size + (src.length * 2); // Estimativa básica
  }, 0);

  console.group('📦 Bundle Analysis');
  console.log(`Total Scripts: ${scripts.length}`);
  console.log(`Estimated Size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  scripts.forEach((script, index) => {
    const src = (script as HTMLScriptElement).src;
    const name = src.split('/').pop() || 'unknown';
    console.log(`${index + 1}. ${name} - ${(src.length * 2 / 1024).toFixed(2)} KB`);
  });
  
  console.groupEnd();
}

// Resource Hints
export function addResourceHints(urls: string[]): void {
  urls.forEach(url => {
    // Preload para recursos críticos
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
}

// Preconnect para domínios externos
export function preconnectDomains(domains: string[]): void {
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Service Worker Cache
export class CacheManager {
  private static cacheName = 'saga-v1';

  static async precacheResources(urls: string[]): Promise<void> {
    if (!('serviceWorker' in navigator)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
      console.log('Resources precached successfully');
    } catch (error) {
    console.error('Failed to precache resources:', error);
    }
  }

  static async getCachedResponse(url: string): Promise<Response | undefined> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      return await cache.match(url);
    } catch (error) {
    console.error('Failed to get cached response:', error);
    }
  }

  static async updateCache(url: string, response: Response): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(url, response.clone());
    } catch (error) {
    console.error('Failed to update cache:', error);
    }
  }

  static async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.cacheName);
      console.log('Cache cleared successfully');
    } catch (error) {
    console.error('Failed to clear cache:', error);
    }
  }
}

// Memory Management
export function cleanupMemory(): void {
  // Limpar observadores
  PerformanceMonitor.cleanup();
  
  // Limpar URLs de objeto
  if ('URL' in window && URL.revokeObjectURL) {
    // Implementar lógica para URLs específicas
  }
  
  // Forçar garbage collection se disponível
  if ('gc' in window && typeof window.gc === 'function') {
    window.gc();
  }
}

// Performance Testing
export function runPerformanceTest(): void {
  console.group('🚀 Performance Test');
  
  // Testar tempo de renderização
  PerformanceMonitor.startMeasure('render-test');
  
  // Simular operação pesada
  const start = performance.now();
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += Math.random();
  }
  // Use sum to avoid unused variable warning
  console.log(`Sum result: ${sum.toFixed(2)}`);
  const end = performance.now();
  
  PerformanceMonitor.endMeasure('render-test');
  
  console.log(`Heavy Operation: ${(end - start).toFixed(2)}ms`);
  console.log('All Metrics:', PerformanceMonitor.getAllMetrics());
  
  console.groupEnd();
}

// All functions are already exported above 