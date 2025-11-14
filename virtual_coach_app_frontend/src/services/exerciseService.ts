import { supabase } from './supabaseClient';
import { handleError } from '../utils/errorHandler';
import type { Exercise } from '../types/dataModel';

/**
 * 快取配置
 */
const CACHE_KEY = 'exercises_cache';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 分鐘

interface CacheData {
  exercises: Exercise[];
  timestamp: number;
}

/**
 * 從 localStorage 讀取快取
 */
function getCachedExercises(): Exercise[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    const now = Date.now();

    // 檢查快取是否過期
    if (now - data.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data.exercises;
  } catch (error) {
    console.error('Failed to read exercises cache:', error);
    return null;
  }
}

/**
 * 將資料寫入快取
 */
function setCachedExercises(exercises: Exercise[]): void {
  try {
    const data: CacheData = {
      exercises,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache exercises:', error);
  }
}

/**
 * 從 Supabase 獲取所有啟用的運動資料
 * 包含 5 分鐘快取機制
 * 
 * @returns Promise<Exercise[]> 運動資料陣列
 * @throws Error 當資料庫查詢失敗時
 */
export async function fetchActiveExercises(): Promise<Exercise[]> {
  // 先嘗試從快取讀取
  const cached = getCachedExercises();
  if (cached) {
    return cached;
  }

  try {
    // 從 Supabase 查詢資料
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .order('priority_weight', { ascending: false });

    if (error) {
      throw new Error(`資料庫查詢失敗: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('資料庫中沒有可用的運動資料');
    }

    // 將資料寫入快取
    setCachedExercises(data);

    return data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
}

/**
 * 清除運動資料快取
 * 用於管理員更新運動資料後強制重新載入
 */
export function clearExercisesCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * 根據篩選條件獲取運動資料
 * 
 * @param targetMuscles 目標肌群陣列
 * @param difficultyLevel 難度等級
 * @returns Promise<Exercise[]> 符合條件的運動資料
 */
export async function fetchFilteredExercises(
  targetMuscles: string[],
  difficultyLevel: string
): Promise<Exercise[]> {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .eq('difficulty_level', difficultyLevel)
      .contains('target_muscles', targetMuscles)
      .order('priority_weight', { ascending: false });

    if (error) {
      throw new Error(`資料庫查詢失敗: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
}
