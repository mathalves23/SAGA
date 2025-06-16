// Sistema de logging profissional para SAGA
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
  fingerprint: string;
}

class Logger {
  private static logs: LogEntry[] = [];
  private static maxLogs = 1000;
  private static isDev = import.meta.env.DEV;
  private static isProduction = import.meta.env.PROD;

  private static createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: Date.now(),
      level,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined,
      fingerprint: this.generateFingerprint()
    };
  }

  private static generateFingerprint(): string {
    return btoa(Date.now().toString()).slice(0, 8);
  }

  private static store(entry: LogEntry): void {
    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Em produção, enviar logs críticos para servidor
    if (this.isProduction && (entry.level === 'error' || entry.level === 'warn')) {
      this.sendToServer(entry);
    }
  }

  private static async sendToServer(entry: LogEntry): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Falback silencioso para não criar loop de erros
    }
  }

  static error(message: string, data?: any): void {
    const entry = this.createEntry('error', message, data);
    this.store(entry);
    
    if (this.isDev) {
      console.error(`🚨 [ERROR] ${message}`, data);
    }
  }

  static warn(message: string, data?: any): void {
    const entry = this.createEntry('warn', message, data);
    this.store(entry);
    
    if (this.isDev) {
      console.warn(`⚠️ [WARN] ${message}`, data);
    }
  }

  static info(message: string, data?: any): void {
    const entry = this.createEntry('info', message, data);
    this.store(entry);
    
    if (this.isDev) {
      console.info(`ℹ️ [INFO] ${message}`, data);
    }
  }

  static debug(message: string, data?: any): void {
    const entry = this.createEntry('debug', message, data);
    this.store(entry);
    
    if (this.isDev) {
      console.debug(`🐛 [DEBUG] ${message}`, data);
    }
  }

  static getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }

  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export default Logger; 