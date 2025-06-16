import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageCacheEntry {
  url: string;
  loaded: boolean;
  loading: boolean;
  error: boolean;
  element?: HTMLImageElement;
  priority: number;
  lastAccessed: number;
}

interface UseImageCacheOptions {
  maxCacheSize?: number;
  preloadDistance?: number;
  enablePreload?: boolean;
}

class ImageCacheManager {
  private cache = new Map<string, ImageCacheEntry>();
  private maxSize: number;
  private preloadQueue: string[] = [];
  private loadingQueue = new Set<string>();

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  private cleanup() {
    if (this.cache.size <= this.maxSize) return;

    // Remove os itens menos acessados
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    const toRemove = entries.slice(0, entries.length - this.maxSize);
    toRemove.forEach(([url]) => {
      this.cache.delete(url);
    });
  }

  async loadImage(url: string, priority = 0): Promise<ImageCacheEntry> {
    // Verifica se já está em cache
    let entry = this.cache.get(url);
    if (entry) {
      entry.lastAccessed = Date.now();
      if (entry.loaded) return entry;
      if (entry.loading) {
        // Espera o carregamento atual terminar
        return new Promise((resolve) => {
          const checkLoaded = () => {
            const currentEntry = this.cache.get(url);
            if (currentEntry && (currentEntry.loaded || currentEntry.error)) {
              resolve(currentEntry);
            } else {
              setTimeout(checkLoaded, 10);
            }
          };
          checkLoaded();
        });
      }
    }

    // Cria nova entrada
    entry = {
      url,
      loaded: false,
      loading: true,
      error: false,
      priority,
      lastAccessed: Date.now()
    };

    this.cache.set(url, entry);
    this.loadingQueue.add(url);

    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        entry!.loaded = true;
        entry!.loading = false;
        entry!.element = img;
        this.loadingQueue.delete(url);
        this.cleanup();
        resolve(entry!);
      };

      img.onerror = () => {
        entry!.error = true;
        entry!.loading = false;
        this.loadingQueue.delete(url);
        resolve(entry!);
      };

      img.src = url;
    });
  }

  preloadImages(urls: string[], priority = 1) {
    urls.forEach(url => {
      if (!this.cache.has(url) && !this.loadingQueue.has(url)) {
        this.preloadQueue.push(url);
      }
    });

    // Processa a fila de preload
    this.processPreloadQueue(priority);
  }

  private async processPreloadQueue(priority: number) {
    const maxConcurrent = 3;
    const concurrent = Math.min(maxConcurrent, this.preloadQueue.length);

    for (let i = 0; i < concurrent; i++) {
      const url = this.preloadQueue.shift();
      if (url) {
        this.loadImage(url, priority).catch(() => {
          // Ignora erros de preload
        });
      }
    }

    // Continua processando se ainda há itens na fila
    if (this.preloadQueue.length > 0) {
      setTimeout(() => this.processPreloadQueue(priority), 100);
    }
  }

  getImageStatus(url: string): 'loading' | 'loaded' | 'error' | 'not-loaded' {
    const entry = this.cache.get(url);
    if (!entry) return 'not-loaded';
    if (entry.error) return 'error';
    if (entry.loaded) return 'loaded';
    if (entry.loading) return 'loading';
    return 'not-loaded';
  }

  getCacheStats() {
    const total = this.cache.size;
    const loaded = Array.from(this.cache.values()).filter(e => e.loaded).length;
    const loading = Array.from(this.cache.values()).filter(e => e.loading).length;
    const errors = Array.from(this.cache.values()).filter(e => e.error).length;

    return { total, loaded, loading, errors, queueSize: this.preloadQueue.length };
  }
}

// Singleton para gerenciar o cache globalmente
const globalImageCache = new ImageCacheManager(200);

export const useImageCache = (options: UseImageCacheOptions = {}) => {
  const {
    maxCacheSize = 100,
    preloadDistance = 5,
    enablePreload = true
  } = options;

  const [cacheStats, setCacheStats] = useState(globalImageCache.getCacheStats());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());

  // Atualiza as estatísticas do cache periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(globalImageCache.getCacheStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Configurar Intersection Observer para preload inteligente
  useEffect(() => {
    if (!enablePreload) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const imageUrl = entry.target.getAttribute('data-src');
          if (imageUrl) {
            if (entry.isIntersecting) {
              setVisibleImages(prev => new Set([...prev, imageUrl]));
            } else {
              setVisibleImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(imageUrl);
                return newSet;
              });
            }
          }
        });
      },
      {
        rootMargin: `${preloadDistance * 100}px`,
        threshold: 0.1
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [enablePreload, preloadDistance]);

  const loadImage = useCallback(async (url: string, priority = 0) => {
    return globalImageCache.loadImage(url, priority);
  }, []);

  const preloadImages = useCallback((urls: string[], priority = 1) => {
    globalImageCache.preloadImages(urls, priority);
  }, []);

  const getImageStatus = useCallback((url: string) => {
    return globalImageCache.getImageStatus(url);
  }, []);

  const observeImage = useCallback((element: HTMLElement | null, imageUrl: string) => {
    if (!element || !observerRef.current) return;
    
    element.setAttribute('data-src', imageUrl);
    observerRef.current.observe(element);

    return () => {
      observerRef.current?.unobserve(element);
    };
  }, []);

  // Preload automático para imagens visíveis
  useEffect(() => {
    if (visibleImages.size > 0) {
      const urls = Array.from(visibleImages);
      preloadImages(urls, 2);
    }
  }, [visibleImages, preloadImages]);

  return {
    loadImage,
    preloadImages,
    getImageStatus,
    observeImage,
    cacheStats,
    visibleImages: Array.from(visibleImages)
  };
};

export default useImageCache; 