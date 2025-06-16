import api from './api';
import { mockExerciseHistory, mockUserRecords, delay } from './mockRecordsData';

export interface ExerciseRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  recordType: 'WEIGHT' | 'REPS' | 'VOLUME';
  weight: number;
  reps: number;
  volume: number;
  date: string;
  userId: string;
}

export interface SetRecord {
  setIndex: number;
  recordType: 'WEIGHT' | 'REPS' | 'VOLUME';
  isNewRecord: boolean;
  previousRecord?: {
    weight: number;
    reps: number;
    volume: number;
    date: string;
  };
}

export interface WorkoutExerciseWithRecords {
  exerciseId: string;
  exerciseName: string;
  sets: Array<{
    weight: number;
    reps: number;
    volume: number;
    records: SetRecord[];
  }>;
  totalRecords: number;
}

class RecordsService {
  
  // Calcula recordes para um exercício baseado no histórico do usuário
  async calculateExerciseRecords(
    exerciseId: string,
    sets: Array<{ weight: number; reps: number }>
  ): Promise<SetRecord[]> {
    try {
      // Buscar histórico do exercício do usuário
      const history = await this.getExerciseHistory(exerciseId);
      const records: SetRecord[] = [];

      sets.forEach((currentSet, index) => {
        const currentVolume = currentSet.weight * currentSet.reps;
        const setRecords: SetRecord = {
          setIndex: index,
          recordType: 'WEIGHT',
          isNewRecord: false
        };

        // Verificar recorde de peso
        const maxWeight = this.getMaxWeightFromHistory(history);
        if (currentSet.weight > maxWeight) {
          setRecords.recordType = 'WEIGHT';
          setRecords.isNewRecord = true;
          setRecords.previousRecord = {
            weight: maxWeight,
            reps: 0,
            volume: 0,
            date: this.getLastRecordDate(history, 'WEIGHT')
          };
        }

        // Verificar recorde de repetições para o mesmo peso
        const maxRepsAtWeight = this.getMaxRepsAtWeight(history, currentSet.weight);
        if (currentSet.reps > maxRepsAtWeight && !setRecords.isNewRecord) {
          setRecords.recordType = 'REPS';
          setRecords.isNewRecord = true;
          setRecords.previousRecord = {
            weight: currentSet.weight,
            reps: maxRepsAtWeight,
            volume: 0,
            date: this.getLastRecordDate(history, 'REPS', currentSet.weight)
          };
        }

        // Verificar recorde de volume
        const maxVolume = this.getMaxVolumeFromHistory(history);
        if (currentVolume > maxVolume && !setRecords.isNewRecord) {
          setRecords.recordType = 'VOLUME';
          setRecords.isNewRecord = true;
          setRecords.previousRecord = {
            weight: 0,
            reps: 0,
            volume: maxVolume,
            date: this.getLastRecordDate(history, 'VOLUME')
          };
        }

        records.push(setRecords);
      });

      return records;
    } catch (error) {
    console.error('Erro ao calcular recordes:', error);
      return [];
    }
  }

  // Busca histórico de um exercício específico
  private async getExerciseHistory(exerciseId: string): Promise<any[]> {
    try {
      await delay(500); // Simular delay de API
      
      // Usar dados mock se disponíveis
      const mockData = mockExerciseHistory[exerciseId as keyof typeof mockExerciseHistory];
      if (mockData) {
        return mockData;
      }
      
      // Fallback para API real
      const response = await api.get(`/workout-logs/exercise/${exerciseId}/history`);
      return response.data as unknown || [];
    } catch (error) {
    console.error('Erro ao buscar histórico do exercício:', error);
      
      // Retornar dados mock em caso de erro
      const mockData = mockExerciseHistory[exerciseId as keyof typeof mockExerciseHistory];
      return mockData || [];
    }
  }

  // Utilitários para calcular recordes
  private getMaxWeightFromHistory(history: any[]): number {
    if (!history.length) return 0;
    
    return Math.max(...history.map(entry => 
      Math.max(...entry.sets.map((set: any) => set.weight || 0))
    ));
  }

  private getMaxRepsAtWeight(history: any[], weight: number): number {
    if (!history.length) return 0;
    
    const setsAtWeight = history.flatMap(entry => 
      entry.sets.filter((set: any) => set.weight === weight)
    );
    
    if (!setsAtWeight.length) return 0;
    
    return Math.max(...setsAtWeight.map(set => set.reps || 0));
  }

  private getMaxVolumeFromHistory(history: any[]): number {
    if (!history.length) return 0;
    
    return Math.max(...history.flatMap(entry => 
      entry.sets.map((set: any) => (set.weight || 0) * (set.reps || 0))
    ));
  }

  private getLastRecordDate(history: any[], recordType: string, weight?: number): string {
    if (!history.length) return new Date().toISOString();
    
    // Implementar lógica para encontrar a data do último recorde
    return history[0]?.date || new Date().toISOString();
  }

  // Salva novos recordes no backend
  async saveRecord(record: Omit<ExerciseRecord, 'id'>): Promise<ExerciseRecord> {
    try {
      const response = await api.post('/records', record);
      return response.data as unknown;
    } catch (error) {
    console.error('Erro ao salvar recorde:', error);
      throw error;
    }
  }

  // Busca todos os recordes do usuário
  async getUserRecords(): Promise<ExerciseRecord[]> {
    try {
      await delay(300); // Simular delay de API
      
      // Usar dados mock primeiro
      if (mockUserRecords.length > 0) {
        return mockUserRecords;
      }
      
      // Fallback para API real
      const response = await api.get('/records/user');
      return response.data as unknown || [];
    } catch (error) {
    console.error('Erro ao buscar recordes do usuário:', error);
      
      // Retornar dados mock em caso de erro
      return mockUserRecords;
    }
  }

  // Busca recordes de um exercício específico
  async getExerciseRecords(exerciseId: string): Promise<ExerciseRecord[]> {
    try {
      const response = await api.get(`/records/exercise/${exerciseId}`);
      return response.data as unknown || [];
    } catch (error) {
    console.error('Erro ao buscar recordes do exercício:', error);
      return [];
    }
  }

  // Verifica se uma série quebrou algum recorde
  async checkForNewRecords(
    exerciseId: string,
    exerciseName: string,
    sets: Array<{ weight: number; reps: number }>,
    userId: string
  ): Promise<ExerciseRecord[]> {
    try {
      const setRecords = await this.calculateExerciseRecords(exerciseId, sets);
      const newRecords: ExerciseRecord[] = [];

      setRecords.forEach((setRecord, index) => {
        if (setRecord.isNewRecord) {
          const set = sets[index];
          const volume = set.weight * set.reps;

          const record: ExerciseRecord = {
            id: `${exerciseId}-${Date.now()}-${index}`,
            exerciseId,
            exerciseName,
            recordType: setRecord.recordType,
            weight: set.weight,
            reps: set.reps,
            volume,
            date: new Date().toISOString(),
            userId
          };

          newRecords.push(record);
        }
      });

      // Salvar novos recordes no backend
      for (const record of newRecords) {
        await this.saveRecord(record);
      }

      return newRecords;
    } catch (error) {
    console.error('Erro ao verificar novos recordes:', error);
      return [];
    }
  }

  // Formata mensagem de recorde para exibição
  formatRecordMessage(record: SetRecord): string {
    if (!record.isNewRecord) return '';

    switch (record.recordType) {
      case 'WEIGHT':
        return `🏆 Novo recorde de peso!`;
      case 'REPS':
        return `🏆 Novo recorde de repetições!`;
      case 'VOLUME':
        return `🏆 Novo recorde de volume!`;
      default:
        return `🏆 Novo recorde!`;
    }
  }

  // Obtém estatísticas de recordes do usuário
  async getRecordStats(): Promise<{
    totalRecords: number;
    recordsByType: Record<string, number>;
    recentRecords: ExerciseRecord[];
  }> {
    try {
      const records = await this.getUserRecords();
      const recordsByType = records.reduce((acc, record) => {
        acc[record.recordType] = (acc[record.recordType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentRecords = records
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      return {
        totalRecords: records.length,
        recordsByType,
        recentRecords
      };
    } catch (error) {
    console.error('Erro ao buscar estatísticas de recordes:', error);
      return {
        totalRecords: 0,
        recordsByType: {},
        recentRecords: []
      };
    }
  }
}

export const recordsService = new RecordsService(); 