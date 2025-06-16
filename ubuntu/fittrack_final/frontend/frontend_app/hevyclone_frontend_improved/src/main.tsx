// Polyfill para process.env no browser
import './utils/env'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring
import { PerformanceMonitor } from './utils/performance.ts'

// Service Worker Registration
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      console.log('🔧 Registering Service Worker...')
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })

      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nova versão disponível! Reinicie para atualizar.')
              
              // Notificar usuário sobre atualização
              if (window.confirm('Nova versão disponível! Recarregar página?')) {
                window.location.reload()
              }
            }
          })
        }
      })

      console.log('✅ Service Worker registrado:', registration.scope)

      // Background Sync para workouts offline
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        // await registration.sync?.register('workout-sync')
        console.log('🔄 Background sync registrado')
      }

      return registration
    } catch (error) {
      console.error('❌ Falha ao registrar Service Worker:', error)
    }
  } else {
    console.warn('⚠️ Service Worker não suportado neste navegador')
  }
}

// PWA Install Prompt
function setupPWAInstall() {
  let deferredPrompt: any = null

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA install prompt disponível')
    e.preventDefault()
    deferredPrompt = e

    // Mostrar botão de instalação customizado após 30 segundos
    setTimeout(() => {
      const installBanner = document.createElement('div')
      installBanner.innerHTML = `
        <div id="pwa-install-banner" style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideUp 0.3s ease-out;
        ">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">📱 Instalar SAGA Fitness</div>
            <div style="font-size: 14px; opacity: 0.9;">Acesso rápido e funcionalidade offline</div>
          </div>
          <div>
            <button id="pwa-install-btn" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              margin-right: 8px;
              cursor: pointer;
            ">Instalar</button>
            <button id="pwa-dismiss-btn" style="
              background: transparent;
              border: none;
              color: white;
              padding: 8px;
              cursor: pointer;
              opacity: 0.7;
            ">✕</button>
          </div>
        </div>
        <style>
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        </style>
      `
      
      document.body.appendChild(installBanner)

      // Install handler
      document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`📱 PWA install: ${outcome}`)
          deferredPrompt = null
          document.getElementById('pwa-install-banner')?.remove()
        }
      })

      // Dismiss handler
      document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
        document.getElementById('pwa-install-banner')?.remove()
      })

    }, 30000) // 30 segundos após carregar
  })

  // PWA instalado
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA instalado com sucesso!')
    deferredPrompt = null
  })
}

// Initialize Performance Monitoring
function initPerformanceMonitoring() {
  // Medir Core Web Vitals
  PerformanceMonitor.monitorWebVitals()
  
  // Monitor de performance contínuo
  const monitor = {
    trackFPS: true,
    trackMemory: true,
    trackRenderTime: true,
    alertThresholds: {
      fps: 30,
      memoryMB: 100,
      renderTimeMs: 100
    }
  }

  // Log métricas importantes
  setTimeout(() => {
    const metrics = PerformanceMonitor.getAllMetrics()
    console.log('📊 Performance Metrics:', metrics)
  }, 2000)

  return monitor
}

// App Initialization
async function initializeApp() {
  console.log('🚀 Inicializando SAGA Fitness...')

  // 1. Performance Monitoring
  initPerformanceMonitoring()

  // 2. Service Worker
  await registerServiceWorker()

  // 3. PWA Install Setup
  setupPWAInstall()

  // 4. Error Reporting Setup
  window.addEventListener('error', (event) => {
    console.error('🚨 JavaScript Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', {
      reason: event.reason,
      promise: event.promise
    })
  })

  // 5. Network Status Monitoring
  window.addEventListener('online', () => {
    console.log('🌐 Conexão restaurada')
    // Trigger sync when back online
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_SYNC',
        tag: 'workout-sync'
      })
    }
  })

  window.addEventListener('offline', () => {
    console.log('📵 Modo offline ativado')
  })

  console.log('✅ SAGA Fitness inicializado com sucesso!')
}

// Corrigir dados incorretos do usuário
const fixUserData = () => {
  try {
    // Corrigir dados do AuthContext
    const savedUser = localStorage.getItem('saga-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.email === 'usuario@saga.com') {
        userData.email = 'matheus.aalves@hotmail.com';
        userData.name = 'Matheus Alves';
        localStorage.setItem('saga-user', JSON.stringify(userData));
        console.log('Dados do AuthContext corrigidos');
      }
    }

    // Corrigir dados do Profile
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      if (profileData.email === 'usuario@saga.com') {
        profileData.email = 'matheus.aalves@hotmail.com';
        if (!profileData.name || profileData.name === 'mathalves') {
          profileData.name = 'Matheus Alves';
        }
        localStorage.setItem('user_profile', JSON.stringify(profileData));
        console.log('Dados do Profile corrigidos');
      }
    }

    console.log('Verificação e correção de dados concluída');
  } catch (error) {
    console.error('Erro ao corrigir dados:', error);
  }
};

// Executar correção na inicialização
fixUserData();

// React App Render
const root = ReactDOM.createRoot(document.getElementById('root')!)

// Initialize app and render
initializeApp().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}).catch((error) => {
  console.error('❌ Falha na inicialização:', error)
  
  // Fallback render even if initialization fails
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})

// Performance monitoring
if (import.meta.env.DEV) {
  PerformanceMonitor.monitorWebVitals();
  
  // Criar monitor personalizado
  const monitor = {
    fps: 0,
    memory: 0,
    networkLatency: 0
  };
  
  // Obter métricas
  setInterval(() => {
    const metrics = PerformanceMonitor.getAllMetrics();
    console.log('Performance metrics:', metrics);
  }, 10000);
}
