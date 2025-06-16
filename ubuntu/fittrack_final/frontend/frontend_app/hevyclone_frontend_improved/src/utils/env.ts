// Utilitário para variáveis de ambiente compatível com Vite
export const env = {
  NODE_ENV: import.meta.env.DEV ? 'development' : 'production',
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  VITE_ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || 'saga-secret-key',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}

// Polyfill global para compatibilidade
if (typeof window !== 'undefined') {
  (window as any).process = {
    env: env
  }
} 