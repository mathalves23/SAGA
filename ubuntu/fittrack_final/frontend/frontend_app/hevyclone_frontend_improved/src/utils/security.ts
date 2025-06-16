// Security Utils para SAGA - Segurança Avançada
import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

// Content Security Policy
export function setupCSP(): void {
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.saga.fitness https://www.google-analytics.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  document.head.appendChild(cspMeta);
}

// Input Sanitization
export class InputSanitizer {
  // Sanitizar HTML
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  // Sanitizar para SQL (básico)
  static sanitizeSQL(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  }

  // Sanitizar URL
  static sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Apenas permitir protocolos seguros
      if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
        throw new Error('Protocol not allowed');
      }
      
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  // Sanitizar filename
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }

  // Escape para XSS
  static escapeXSS(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validar e sanitizar email
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = email.toLowerCase().trim();
    
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    
    return sanitized;
  }
}

// Token Management
export class TokenManager {
  private static readonly TOKEN_KEY = 'saga-auth-token';
  private static readonly REFRESH_KEY = 'saga-refresh-token';
  private static readonly SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'saga-secret-key';

  // Criptografar token antes de armazenar
  static setToken(token: string): void {
    try {
      const encrypted = CryptoJS.AES.encrypt(token, this.SECRET_KEY).toString();
      localStorage.setItem(this.TOKEN_KEY, encrypted);
    } catch (error) {
    console.error('Failed to encrypt token:', error);
      // Fallback sem criptografia (menos seguro)
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Descriptografar token
  static getToken(): string | null {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      // Tentar descriptografar
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
        const token = decrypted.toString(CryptoJS.enc.Utf8);
        return token || encrypted; // Fallback para token não criptografado
      } catch {
        // Token não estava criptografado
        return encrypted;
      }
    } catch (error) {
    console.error('Failed to decrypt token:', error);
      return null;
    }
  }

  // Validar formato do token JWT
  static validateTokenFormat(token: string): boolean {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    return jwtRegex.test(token);
  }

  // Verificar se token está expirado
  static isTokenExpired(token: string): boolean {
    try {
      if (!this.validateTokenFormat(token)) return true;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Limpar tokens
  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.clear();
  }

  // Gerar CSRF token
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Password Security
export class PasswordSecurity {
  // Critérios de força da senha
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    requirements: {
      length: boolean;
      uppercase: boolean;
      lowercase: boolean;
      numbers: boolean;
      symbols: boolean;
      commonWords: boolean;
    };
  } {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      commonWords: !this.isCommonPassword(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = score >= 4;

    return { isValid, score, requirements };
  }

  // Lista de senhas comuns (simplificada)
  private static commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
  ];

  private static isCommonPassword(password: string): boolean {
    return this.commonPasswords.includes(password.toLowerCase());
  }

  // Hash da senha (para validação local)
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  // Gerar senha segura
  static generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    return Array.from(array, byte => charset[byte % charset.length]).join('');
  }
}

// Session Management
export class SessionManager {
  private static readonly SESSION_KEY = 'saga-session';
  private static readonly TIMEOUT_KEY = 'saga-session-timeout';
  private static readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutos
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

  // Iniciar sessão
  static startSession(): void {
    const sessionId = this.generateSessionId();
    const timestamp = Date.now();
    
    sessionStorage.setItem(this.SESSION_KEY, sessionId);
    sessionStorage.setItem(this.TIMEOUT_KEY, timestamp.toString());
    
    this.scheduleWarning();
  }

  // Verificar se sessão é válida
  static isSessionValid(): boolean {
    const sessionId = sessionStorage.getItem(this.SESSION_KEY);
    const timestamp = sessionStorage.getItem(this.TIMEOUT_KEY);
    
    if (!sessionId || !timestamp) return false;
    
    const sessionAge = Date.now() - parseInt(timestamp);
    return sessionAge < this.SESSION_DURATION;
  }

  // Renovar sessão
  static renewSession(): void {
    if (this.isSessionValid()) {
      sessionStorage.setItem(this.TIMEOUT_KEY, Date.now().toString());
      this.scheduleWarning();
    }
  }

  // Encerrar sessão
  static endSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.TIMEOUT_KEY);
    TokenManager.clearTokens();
  }

  // Agendar aviso de expiração
  private static scheduleWarning(): void {
    setTimeout(() => {
      if (this.isSessionValid()) {
        const shouldRenew = confirm('Sua sessão expirará em breve. Deseja renová-la?');
        if (shouldRenew) {
          this.renewSession();
        } else {
          this.endSession();
          window.location.href = '/login';
        }
      }
    }, this.SESSION_DURATION - this.WARNING_TIME);
  }

  private static generateSessionId(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }
}

// Rate Limiting
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map();
  
  // Verificar se ação é permitida
  static isAllowed(
    key: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remover tentativas antigas
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Adicionar tentativa atual
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  // Limpar tentativas
  static clearAttempts(key: string): void {
    this.attempts.delete(key);
  }

  // Obter tempo restante para próxima tentativa
  static getTimeUntilNextAttempt(
    key: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000
  ): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilExpiry = windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeUntilExpiry);
  }
}

// Device Fingerprinting (básico)
export class DeviceFingerprint {
  static generate(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.platform
    ];
    
    const fingerprint = components.join('|');
    return CryptoJS.SHA256(fingerprint).toString();
  }

  static store(): void {
    const fingerprint = this.generate();
    localStorage.setItem('saga-device-fingerprint', fingerprint);
  }

  static verify(): boolean {
    const stored = localStorage.getItem('saga-device-fingerprint');
    const current = this.generate();
    
    return stored === current;
  }
}

// Audit Logging
export class AuditLogger {
  private static logs: Array<{
    timestamp: number;
    action: string;
    user?: string;
    details?: any;
    fingerprint: string;
  }> = [];

  static log(action: string, details?: any): void {
    const entry = {
      timestamp: Date.now(),
      action,
      user: TokenManager.getToken() ? 'authenticated' : 'anonymous',
      details,
      fingerprint: DeviceFingerprint.generate()
    };
    
    this.logs.push(entry);
    
    // Manter apenas os últimos 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
    
    // Em produção, enviar para servidor
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(entry);
    }
  }

  private static async sendToServer(entry: any): Promise<void> {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
    console.error('Failed to send audit log:', error);
    }
  }

  static getLogs(): typeof AuditLogger.logs {
    return [...this.logs];
  }
}

// Security Headers Validator
export function validateSecurityHeaders(): void {
  fetch(window.location.href, { method: 'HEAD' })
    .then(response => {
      const headers = response.headers;
      
      const requiredHeaders = {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '1; mode=block',
        'strict-transport-security': 'max-age=31536000; includeSubDomains',
        'referrer-policy': 'strict-origin-when-cross-origin'
      };
      
      Object.entries(requiredHeaders).forEach(([header, expectedValue]) => {
        const actualValue = headers.get(header);
        if (!actualValue || !actualValue.includes(expectedValue)) {
          console.warn(`Missing or incorrect security header: ${header}`);
        }
      });
    })
    .catch(error => {
      console.error('Failed to validate security headers:', error);
    });
}

// Initialize Security
export function initializeSecurity(): void {
  // Setup CSP
  setupCSP();
  
  // Start session management
  SessionManager.startSession();
  
  // Store device fingerprint
  DeviceFingerprint.store();
  
  // Validate security headers
  validateSecurityHeaders();
  
  // Log initialization
  AuditLogger.log('security_initialized');
  
  console.log('🔒 Security system initialized');
}

export {
  InputSanitizer,
  TokenManager,
  PasswordSecurity,
  SessionManager,
  RateLimiter,
  DeviceFingerprint,
  AuditLogger,
}; 