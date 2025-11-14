import { TrainingGoal, TargetMuscle, DifficultyLevel } from './enums';

/**
 * 運動項目資料模型 (對應 Supabase exercises 資料表)
 */
export interface Exercise {
  id: number;
  name: string;
  target_muscle: TargetMuscle;
  difficulty_level: DifficultyLevel;
  equipment_needed: string | null;
  description: string | null;
  video_url: string | null;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
}

/**
 * 用戶偏好設定資料模型
 */
export interface UserPreferences {
  trainingGoal: TrainingGoal;
  targetMuscles: TargetMuscle[];
  difficultyLevel: DifficultyLevel;
  equipmentAvailable?: string[];
  availableMinutes?: number;
}

/**
 * 訓練計畫項目
 */
export interface WorkoutPlanItem {
  exercise: Exercise;
  sets: number;
  reps: number;
  restSeconds: number;
}

// 別名以相容 usePlayer 匯出
export type WorkoutExercise = WorkoutPlanItem;

/**
 * 完整訓練計畫資料模型
 */
export interface WorkoutPlan {
  id: string;
  createdAt: Date;
  preferences: UserPreferences;
  exercises: WorkoutPlanItem[];
  estimatedDurationMinutes: number;
}
