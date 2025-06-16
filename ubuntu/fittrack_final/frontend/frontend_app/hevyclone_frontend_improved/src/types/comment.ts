// src/types/comment.ts
export type Comment = {
  id: number;
  user_id: number;
  workout_id?: number;
  routine_id?: number;
  parent_comment_id?: number;
  content: string;
  created_at: string;
  updated_at: string;
  
  // Campos relacionados
  user?: {
    id: number;
    username: string;
    profile_image_url?: string;
  };
  replies?: Comment[];
};
