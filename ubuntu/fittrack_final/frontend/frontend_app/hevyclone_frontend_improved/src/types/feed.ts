// types/feed.ts

export type ExerciseSummary = {
  exerciseName: string;
  totalReps: number;
  maxWeight: number;
};

export type AchievementInfo = {
  title: string;
  icon: string;
  date: string; // formato ISO
};

export type ChallengeInfo = {
  title: string;
  challengerName: string;
  opponentName: string;
  deadline: string; // formato ISO
  accepted: boolean;
};

export type RankingInfo = {
  metric: string;
  value: number;
};

export type FeedDTO = {
  workoutId: number;
  userId: number; // ✅ adicionado conforme backend
  friendName: string;
  workoutDate: string;
  exercises: ExerciseSummary[];
  achievements: AchievementInfo[];
  challenges: ChallengeInfo[];
  rankings: RankingInfo[];
};

export type Comment = {
  id: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  parentCommentId?: number;
};

export type WorkoutInteractionRequestDTO = {
  userId: number;
  workoutId: number;
  comment?: string;
  emoji?: string;
  parentCommentId?: number;
};
