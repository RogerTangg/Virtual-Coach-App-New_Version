/**
 * 資料庫結構定義 (Database Schema Definitions)
 * 對應 Supabase 中的 Table 結構
 */

import { PlanItem } from './app';

/**
 * 運動項目 (Exercise)
 * 對應 PRD F-1.1: 運動資料表結構
 */
export interface Exercise {
  id: string;
  created_at?: string;
  
  /** 動作名稱 */
  name: string;
  
  /** 動作說明/注意事項 */
  description: string;
  
  /** 示範影片連結 (MP4 或 GIF) */
  video_url: string;
  
  /** 建議持續時間 (秒) */
  duration_seconds: number;
  
  /** 
   * 標籤陣列，用於篩選
   * 格式範例: ["goal:增肌", "difficulty:初階", "equipment:啞鈴", "type:肌力"]
   */
  tags: string[];
}

/**
 * 使用者個人資料 (User Profile)
 * Phase 2: 對應 profiles 資料表
 */
export interface Profile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  height?: number;
  weight?: number;
  created_at: string;
  updated_at: string;
}

/**
 * 訓練紀錄 (Workout Log)
 * Phase 2: 對應 workout_logs 資料表
 */
export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_date: string;
  duration_seconds: number;
  calories_burned?: number;
  difficulty_rating?: number;
  feeling?: 'easy' | 'good' | 'hard';
  exercises_completed: PlanItem[];
  created_at: string;
}

/**
 * 收藏動作 (User Favorite)
 * Phase 2: 對應 user_favorites 資料表
 */
export interface UserFavorite {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
}
