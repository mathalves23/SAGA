import React from 'react';
import { SetRecord } from '../services/recordsService';

interface RecordBadgeProps {
  record: SetRecord;
  className?: string;
}

const RecordBadge: React.FC<RecordBadgeProps> = ({ record, className = '' }) => {
  if (!record.isNewRecord) {
    return null;
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'WEIGHT':
        return '🏆'; // Troféu dourado para peso
      case 'REPS':
        return '🥇'; // Medalha de ouro para repetições
      case 'VOLUME':
        return '💪'; // Músculo para volume
      default:
        return '🏆';
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'WEIGHT':
        return 'text-teal-400 bg-teal-500/20 border-teal-500/30';
      case 'REPS':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'VOLUME':
        return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      default:
        return 'text-teal-400 bg-teal-500/20 border-teal-500/30';
    }
  };

  const getRecordText = (type: string) => {
    switch (type) {
      case 'WEIGHT':
        return 'PR Peso';
      case 'REPS':
        return 'PR Reps';
      case 'VOLUME':
        return 'PR Volume';
      default:
        return 'PR';
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-semibold ${getRecordColor(record.recordType)} ${className}`}>
      <span className="text-sm">{getRecordIcon(record.recordType)}</span>
      <span>{getRecordText(record.recordType)}</span>
    </div>
  );
};

export default RecordBadge; 