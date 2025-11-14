import { useState, useEffect } from 'react';
import { fetchActiveExercises } from '../services/exerciseService';
import { handleError } from '../utils/errorHandler';
import type { Exercise } from '../types/dataModel';

/**
 * useExercises Hook 狀態介面
 */
export interface UseExercisesReturn {
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * 自訂 Hook：管理運動資料的獲取與快取
 * 
 * 功能：
 * - 自動載入運動資料
 * - 5 分鐘快取機制（在 exerciseService 中實作）
 * - 錯誤處理
 * - 重新載入功能
 * 
 * @returns UseExercisesReturn 運動資料與狀態
 */
export function useExercises(): UseExercisesReturn {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 載入運動資料
   */
  const loadExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchActiveExercises();
      setExercises(data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 重新載入運動資料
   */
  const refetch = async () => {
    await loadExercises();
  };

  // 組件掛載時自動載入資料
  useEffect(() => {
    loadExercises();
  }, []);

  return {
    exercises,
    isLoading,
    error,
    refetch,
  };
}
