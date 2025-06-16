import React, { useState, useEffect } from 'react';
import { recordsService, ExerciseRecord } from '../services/recordsService';

interface RecordsHistoryProps {
  className?: string;
}

const RecordsHistory: React.FC<RecordsHistoryProps> = ({ className = '' }) => {
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'WEIGHT' | 'REPS' | 'VOLUME'>('ALL');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const userRecords = await recordsService.getUserRecords();
      setRecords(userRecords);
    } catch (error) {
    console.error('Erro ao carregar recordes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => 
    filter === 'ALL' || record.recordType === filter
  );

  const formatRecordDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'WEIGHT':
        return '🏆';
      case 'REPS':
        return '🥇';
      case 'VOLUME':
        return '💪';
      default:
        return '🎉';
    }
  };

  const getRecordText = (record: ExerciseRecord) => {
    switch (record.recordType) {
      case 'WEIGHT':
        return `${record.weight}kg`;
      case 'REPS':
        return `${record.reps} reps com ${record.weight}kg`;
      case 'VOLUME':
        return `${record.volume}kg total`;
      default:
        return 'Recorde';
    }
  };

  const getRecordTypeText = (type: string) => {
    switch (type) {
      case 'WEIGHT':
        return 'Peso';
      case 'REPS':
        return 'Repetições';
      case 'VOLUME':
        return 'Volume';
      default:
        return 'Recorde';
    }
  };

  if (loading) {
    return (
      <div className={`bg-[#1c1c1e] rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1c1c1e] rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recordes Pessoais</h3>
        <span className="text-sm text-gray-400">{records.length} recordes</span>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['ALL', 'WEIGHT', 'REPS', 'VOLUME'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as 'ALL' | 'WEIGHT' | 'REPS' | 'VOLUME')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filter === filterType
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filterType === 'ALL' ? 'Todos' : getRecordTypeText(filterType)}
          </button>
        ))}
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-gray-400 mb-2">
            {filter === 'ALL' ? 'Nenhum recorde ainda' : `Nenhum recorde de ${getRecordTypeText(filter).toLowerCase()}`}
          </p>
          <p className="text-sm text-gray-500">
            Continue treinando para quebrar seus primeiros recordes!
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {filteredRecords
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(record => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getRecordIcon(record.recordType)}</div>
                  <div>
                    <h4 className="font-medium text-white">{record.exerciseName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="capitalize">{getRecordTypeText(record.recordType)}</span>
                      <span>•</span>
                      <span>{formatRecordDate(record.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-white">
                    {getRecordText(record)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRecordTypeText(record.recordType)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RecordsHistory; 