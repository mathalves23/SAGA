import React, { useEffect, useState } from 'react';
import { ExerciseRecord } from '../services/recordsService';

interface RecordNotificationProps {
  records: ExerciseRecord[];
  onClose: () => void;
  duration?: number;
}

const RecordNotification: React.FC<RecordNotificationProps> = ({ 
  records, 
  onClose, 
  duration = 5000 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Aguarda animação de saída
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!records.length || !visible) return null;

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

  const getRecordMessage = (record: ExerciseRecord) => {
    switch (record.recordType) {
      case 'WEIGHT':
        return `Novo recorde de peso em ${record.exerciseName}: ${record.weight}kg!`;
      case 'REPS':
        return `Novo recorde de repetições em ${record.exerciseName}: ${record.reps} reps com ${record.weight}kg!`;
      case 'VOLUME':
        return `Novo recorde de volume em ${record.exerciseName}: ${record.volume}kg total!`;
      default:
        return `Novo recorde em ${record.exerciseName}!`;
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="font-bold text-lg">Parabéns!</span>
            </div>
            
            <div className="space-y-2">
              {records.map((record) => (
                <div key={record.id} className="flex items-center space-x-2">
                  <span className="text-lg">{getRecordIcon(record.recordType)}</span>
                  <span className="text-sm">{getRecordMessage(record)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/70 hover:text-white ml-2 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordNotification; 