// src/types/exercise.ts
export type Exercise = {
  id: number;
  name: string;
  description: string;
  instructions?: string;
  tips?: string;
  primary_muscle_group_id: number;
  secondary_muscle_group_id?: number;
  equipment_id: number;
  secondary_muscle_groups?: string;
  video_url?: string;
  image_url?: string;
  
  // Novos campos para imagens e animações
  imageUrl?: string;           // URL da imagem estática
  videoUrl?: string;           // URL do vídeo
  animationUrl?: string;       // URL do GIF/animação
  thumbnailUrl?: string;       // URL da thumbnail
  originalName?: string;       // Nome original em inglês
  externalId?: string;         // ID externo (ex: Hevy)
  
  // Campos relacionados (para exibição)
  primaryMuscleGroupName?: string;
  secondaryMuscleGroupName?: string;
  equipmentName?: string;
  difficultyLevelName?: string;  // Nome do nível de dificuldade
  difficultyLevelId?: number;    // ID do nível de dificuldade
};
