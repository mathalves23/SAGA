// SAGA Fitness Service Worker v2.0
// Cache inteligente com estratégias otimizadas

const CACHE_NAME = 'saga-fitness-v2.0';
const STATIC_CACHE = 'saga-static-v2.0';
const DYNAMIC_CACHE = 'saga-dynamic-v2.0';
const IMAGE_CACHE = 'saga-images-v2.0';
const API_CACHE = 'saga-api-v2.0';

// Recursos críticos para cache inicial
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Recursos de exercícios para cache prioritário
const EXERCISE_PATTERNS = [
  /\/exercises/,
  /\/workouts/,
  /\/routines/
];

// API endpoints para cache
const API_PATTERNS = [
  /\/api\/exercises/,
  /\/api\/workouts/,
  /\/api\/user\/profile/
];

// Configurações de cache
const CACHE_CONFIG = {
  maxAgeStatic: 24 * 60 * 60 * 1000, // 24 horas
  maxAgeDynamic: 60 * 60 * 1000, // 1 hora
  maxAgeImages: 7 * 24 * 60 * 60 * 1000, // 7 dias
  maxAgeAPI: 5 * 60 * 1000, // 5 minutos
  maxEntries: 100
};

// Install Event - Cache recursos críticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('saga-') && !name.includes('v2.0'))
            .map(name => caches.delete(name))
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      self.skipWaiting();
    })
  );
});

// Activate Event - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    clients.claim().then(() => {
      console.log('✅ Service Worker: Activated and claiming clients');
    })
  );
});

// Fetch Event - Estratégias de cache inteligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições non-http
  if (!request.url.startsWith('http')) return;
  
  // Estratégia por tipo de recurso
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isExerciseRequest(request)) {
    event.respondWith(handleExerciseRequest(request));
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Estratégia Cache First para imagens
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.maxAgeImages)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone e cache
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      
      // Limitar tamanho do cache
      await limitCacheSize(IMAGE_CACHE, CACHE_CONFIG.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('📷 Image cache miss:', request.url);
    return caches.match('/assets/placeholder.svg') || new Response('Image not available', { status: 404 });
  }
}

// Estratégia Stale While Revalidate para API
async function handleAPIRequest(request) {
  try {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Resposta em paralelo: cache + network
    const networkPromise = fetch(request).then(async (response) => {
      if (response.ok) {
        const responseClone = response.clone();
        await cache.put(request, responseClone);
      }
      return response;
    });
    
    // Retornar cache se válido, senão aguardar network
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.maxAgeAPI)) {
      networkPromise.catch(() => {}); // Silenciar erros de background update
      return cachedResponse;
    }
    
    return await networkPromise;
  } catch (error) {
    console.warn('🌐 API cache miss:', request.url);
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Estratégia Cache First para exercícios
async function handleExerciseRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, CACHE_CONFIG.maxAgeDynamic)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Content not available offline', { status: 404 });
  }
}

// Estratégia Cache First para recursos estáticos
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    return caches.match('/index.html');
  }
}

// Estratégia Network First para conteúdo dinâmico
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await limitCacheSize(DYNAMIC_CACHE, CACHE_CONFIG.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('Content not available offline', { status: 404 });
  }
}

// Utility Functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

function isAPIRequest(request) {
  return API_PATTERNS.some(pattern => pattern.test(request.url));
}

function isExerciseRequest(request) {
  return EXERCISE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isStaticResource(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         /\.(js|css|woff|woff2|ttf)$/i.test(request.url);
}

function isExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const cacheDate = new Date(dateHeader);
  const now = new Date();
  
  return (now.getTime() - cacheDate.getTime()) > maxAge;
}

async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    // Remover 20% dos itens mais antigos
    const itemsToDelete = keys.slice(0, Math.floor(keys.length * 0.2));
    await Promise.all(itemsToDelete.map(key => cache.delete(key)));
  }
}

// Background Sync para operações offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkouts());
  }
});

async function syncWorkouts() {
  try {
    // Sincronizar workouts pendentes quando voltar online
    console.log('🔄 Syncing pending workouts...');
    // Implementar lógica de sincronização
  } catch (error) {
    console.error('❌ Workout sync failed:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data,
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view-workout') {
    event.waitUntil(
      clients.openWindow('/workouts/' + event.notification.data.workoutId)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🎯 SAGA Fitness Service Worker v2.0 loaded successfully!'); 
console.log('[SW] Service Worker loaded successfully'); 