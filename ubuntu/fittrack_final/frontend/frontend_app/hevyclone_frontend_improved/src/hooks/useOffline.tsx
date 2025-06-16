import { useState, useEffect } from 'react';

export interface OfflineStatus {
  isOnline: boolean;
  isOffline: boolean;
  lastSync: Date | null;
  pendingSyncCount: number;
}

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar dados pendentes na inicialização
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    try {
      // Sincronizar treinos pendentes
      const pendingWorkouts = JSON.parse(localStorage.getItem('pendingWorkouts') || '[]');
      const pendingGoals = JSON.parse(localStorage.getItem('pendingGoals') || '[]');
      
      // Simular sincronização (seria com API real)
      for (const workout of pendingWorkouts) {
        // await api.post('/workouts', workout);
        console.log('Sincronizando treino:', workout.id);
      }
      
      for (const goal of pendingGoals) {
        // await api.post('/goals', goal);
        console.log('Sincronizando meta:', goal.id);
      }
      
      // Limpar dados pendentes após sincronização
      localStorage.setItem('pendingWorkouts', '[]');
      localStorage.setItem('pendingGoals', '[]');
      
      setLastSync(new Date());
      setPendingSyncCount(0);
      
      // Notificar usuário sobre sincronização bem-sucedida
      if (pendingWorkouts.length > 0 || pendingGoals.length > 0) {
        console.log(`Sincronizados ${pendingWorkouts.length + pendingGoals.length} itens`);
      }
      
    } catch (error) {
    console.error('Erro na sincronização:', error);
    }
  };

  const updatePendingCount = () => {
    try {
      const pendingWorkouts = JSON.parse(localStorage.getItem('pendingWorkouts') || '[]');
      const pendingGoals = JSON.parse(localStorage.getItem('pendingGoals') || '[]');
      setPendingSyncCount(pendingWorkouts.length + pendingGoals.length);
    } catch (error) {
    console.error('Erro ao contar dados pendentes:', error);
    }
  };

  const addPendingWorkout = (workout: any) => {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingWorkouts') || '[]');
      pending.push({
        ...workout,
        id: `offline_${Date.now()}`,
        createdOffline: true,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pendingWorkouts', JSON.stringify(pending));
      updatePendingCount();
    } catch (error) {
    console.error('Erro ao adicionar treino pendente:', error);
    }
  };

  const addPendingGoal = (goal: any) => {
    try {
      const pending = JSON.parse(localStorage.getItem('pendingGoals') || '[]');
      pending.push({
        ...goal,
        id: `offline_${Date.now()}`,
        createdOffline: true,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pendingGoals', JSON.stringify(pending));
      updatePendingCount();
    } catch (error) {
    console.error('Erro ao adicionar meta pendente:', error);
    }
  };

  const forcSync = () => {
    if (isOnline) {
      syncPendingData();
    }
  };

  return {
    isOnline,
    isOffline: !isOnline,
    lastSync,
    pendingSyncCount,
    addPendingWorkout,
    addPendingGoal,
    forcSync,
    updatePendingCount
  };
}; 