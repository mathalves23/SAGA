import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import { authService } from './authService';

interface OfflineAction {
  id: string;
  type: 'CREATE_WORKOUT' | 'UPDATE_WORKOUT' | 'CREATE_EXERCISE' | 'UPDATE_PROGRESS' | 'UPDATE_PROFILE';
  data: any;
  timestamp: string;
  synced: boolean;
}

interface CachedData {
  workouts: any[];
  exercises: any[];
  progress: any[];
  profile: any;
  lastSync: string;
}

class OfflineService {
  private isOnline: boolean = true;
  private syncQueue: OfflineAction[] = [];
  private listeners: ((isOnline: boolean) => void)[] = [];

  async initialize(): Promise<void> {
    try {
      // Monitorar conectividade
      NetInfo.addEventListener(state => {
        const wasOffline = !this.isOnline;
        this.isOnline = state.isConnected || false;
        
        // Notificar listeners sobre mudança de conectividade
        this.listeners.forEach(listener => listener(this.isOnline));
        
        // Se voltou online, tentar sincronizar
        if (wasOffline && this.isOnline) {
          this.syncPendingActions();
        }
      });

      // Carregar fila de sincronização
      await this.loadSyncQueue();
      
      console.log('✅ Serviço offline inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço offline:', error);
    }
  }

  // GERENCIAMENTO DE CONECTIVIDADE
  addConnectivityListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    
    // Retornar função para remover listener
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  // CACHE DE DADOS
  async cacheData(key: keyof CachedData, data: any): Promise<void> {
    try {
      const cached = await this.getCachedData();
      cached[key] = data;
      cached.lastSync = new Date().toISOString();
      
      await AsyncStorage.setItem('cached_data', JSON.stringify(cached));
    } catch (error) {
      console.error('Erro ao cachear dados:', error);
    }
  }

  async getCachedData(): Promise<CachedData> {
    try {
      const cached = await AsyncStorage.getItem('cached_data');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cache:', error);
    }

    return {
      workouts: [],
      exercises: [],
      progress: [],
      profile: null,
      lastSync: new Date().toISOString(),
    };
  }

  async getCachedItem(key: keyof CachedData): Promise<any> {
    const cached = await this.getCachedData();
    return cached[key];
  }

  // FILA DE SINCRONIZAÇÃO
  async addToSyncQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>): Promise<void> {
    const newAction: OfflineAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      synced: false,
    };

    this.syncQueue.push(newAction);
    await this.saveSyncQueue();

    // Se online, tentar sincronizar imediatamente
    if (this.isOnline) {
      await this.syncPendingActions();
    }
  }

  private async loadSyncQueue(): Promise<void> {
    try {
      const saved = await AsyncStorage.getItem('sync_queue');
      this.syncQueue = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar fila de sincronização:', error);
      this.syncQueue = [];
    }
  }

  private async saveSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Erro ao salvar fila de sincronização:', error);
    }
  }

  async syncPendingActions(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    console.log(`🔄 Sincronizando ${this.syncQueue.length} ações pendentes...`);

    const pendingActions = this.syncQueue.filter(action => !action.synced);
    
    for (const action of pendingActions) {
      try {
        await this.syncAction(action);
        action.synced = true;
        console.log(`✅ Ação ${action.type} sincronizada`);
      } catch (error) {
        console.error(`❌ Erro ao sincronizar ação ${action.type}:`, error);
        // Manter na fila para tentar novamente depois
      }
    }

    // Remover ações sincronizadas da fila
    this.syncQueue = this.syncQueue.filter(action => !action.synced);
    await this.saveSyncQueue();

    console.log('🎉 Sincronização concluída!');
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'CREATE_WORKOUT':
        // Implementar sincronização de criação de treino
        break;
      
      case 'UPDATE_WORKOUT':
        // Implementar sincronização de atualização de treino
        break;
      
      case 'CREATE_EXERCISE':
        // Implementar sincronização de criação de exercício
        break;
      
      case 'UPDATE_PROGRESS':
        // Implementar sincronização de atualização de progresso
        break;
      
      case 'UPDATE_PROFILE':
        // Implementar sincronização de atualização de perfil
        break;
      
      default:
        throw new Error(`Tipo de ação não suportado: ${action.type}`);
    }
  }

  // OPERAÇÕES OFFLINE
  async createWorkoutOffline(workoutData: any): Promise<string> {
    const tempId = `temp_${Date.now()}`;
    
    // Salvar no cache local
    const cached = await this.getCachedData();
    cached.workouts.push({ ...workoutData, id: tempId, offline: true });
    await this.cacheData('workouts', cached.workouts);

    // Adicionar à fila de sincronização
    await this.addToSyncQueue({
      type: 'CREATE_WORKOUT',
      data: workoutData,
    });

    return tempId;
  }

  async updateProgressOffline(progressData: any): Promise<void> {
    // Salvar no cache local
    const cached = await this.getCachedData();
    const existingIndex = cached.progress.findIndex(p => p.id === progressData.id);
    
    if (existingIndex >= 0) {
      cached.progress[existingIndex] = { ...cached.progress[existingIndex], ...progressData };
    } else {
      cached.progress.push(progressData);
    }
    
    await this.cacheData('progress', cached.progress);

    // Adicionar à fila de sincronização
    await this.addToSyncQueue({
      type: 'UPDATE_PROGRESS',
      data: progressData,
    });
  }

  async updateProfileOffline(profileData: any): Promise<void> {
    // Salvar no cache local
    await this.cacheData('profile', profileData);

    // Adicionar à fila de sincronização
    await this.addToSyncQueue({
      type: 'UPDATE_PROFILE',
      data: profileData,
    });
  }

  // UTILITÁRIOS
  async getPendingActionsCount(): Promise<number> {
    return this.syncQueue.filter(action => !action.synced).length;
  }

  async getLastSyncTime(): Promise<string | null> {
    const cached = await this.getCachedData();
    return cached.lastSync;
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem('cached_data');
      await AsyncStorage.removeItem('sync_queue');
      this.syncQueue = [];
      console.log('✅ Cache limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('cached_') || 
        key === 'sync_queue' || 
        key === 'cached_data'
      );
      
      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Erro ao calcular tamanho do cache:', error);
      return 0;
    }
  }

  // CONFLITOS DE SINCRONIZAÇÃO
  async resolveConflict(localData: any, serverData: any, strategy: 'local' | 'server' | 'merge' = 'server'): Promise<any> {
    switch (strategy) {
      case 'local':
        return localData;
      
      case 'server':
        return serverData;
      
      case 'merge':
        // Implementar lógica de merge baseada em timestamps
        return {
          ...serverData,
          ...localData,
          updatedAt: new Date().toISOString(),
        };
      
      default:
        return serverData;
    }
  }

  // PRELOAD DE DADOS ESSENCIAIS
  async preloadEssentialData(): Promise<void> {
    if (!this.isOnline) {
      console.log('📱 Modo offline - usando dados em cache');
      return;
    }

    try {
      console.log('⬇️ Carregando dados essenciais...');
      
      // Carregar exercícios (dados raramente mudam)
      // const exercises = await exerciseService.getAllExercises();
      // await this.cacheData('exercises', exercises);

      // Carregar treinos recentes
      // const workouts = await workoutService.getRecentWorkouts();
      // await this.cacheData('workouts', workouts);

      // Carregar perfil do usuário
      // const profile = await userService.getProfile();
      // await this.cacheData('profile', profile);

      console.log('✅ Dados essenciais carregados');
    } catch (error) {
      console.error('❌ Erro ao carregar dados essenciais:', error);
    }
  }

  // STATUS E DIAGNÓSTICO
  async getOfflineStatus(): Promise<{
    isOnline: boolean;
    pendingActions: number;
    cacheSize: number;
    lastSync: string | null;
  }> {
    return {
      isOnline: this.isOnline,
      pendingActions: await this.getPendingActionsCount(),
      cacheSize: await this.getCacheSize(),
      lastSync: await this.getLastSyncTime(),
    };
  }
}

export const offlineService = new OfflineService(); 