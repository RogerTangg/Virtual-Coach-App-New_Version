import { useState, useCallback } from 'react';
import { generateWorkoutPlan } from '../services/workoutGenerator';
import { handleError } from '../utils/errorHandler';
import type { WorkoutPlan, UserPreferences, Exercise } from '../types/dataModel';

/**
 * useWorkout Hook 狀態介面
 */
export interface UseWorkoutReturn {
  workoutPlan: WorkoutPlan | null;
  isGenerating: boolean;
  error: string | null;
  generatePlan: (exercises: Exercise[], preferences: UserPreferences) => Promise<void>;
  clearPlan: () => void;
}

/**
 * 自訂 Hook：管理訓練計畫的生成與狀態
 * 
 * 功能：
 * - 生成訓練計畫
 * - 管理生成狀態（載入中、錯誤）
 * - 清除訓練計畫
 * - sessionStorage 持久化（刷新頁面後保留）
 * 
 * @returns UseWorkoutReturn 訓練計畫與狀態
 */
export function useWorkout(): UseWorkoutReturn {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(() => {
    // 從 sessionStorage 恢復訓練計畫
    try {
      const saved = sessionStorage.getItem('workout_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 生成訓練計畫
   */
  const generatePlan = useCallback(
    async (exercises: Exercise[], preferences: UserPreferences) => {
      try {
        setIsGenerating(true);
        setError(null);

        // 模擬生成延遲（確保用戶看到載入狀態）
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 呼叫生成演算法
        const plan = generateWorkoutPlan(exercises, preferences);
        
        // 更新狀態
        setWorkoutPlan(plan);
        
        // 儲存至 sessionStorage
        sessionStorage.setItem('workout_plan', JSON.stringify(plan));
      } catch (err) {
        const errorMessage = handleError(err);
        setError(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  /**
   * 清除訓練計畫
   */
  const clearPlan = useCallback(() => {
    setWorkoutPlan(null);
    setError(null);
    sessionStorage.removeItem('workout_plan');
  }, []);

  return {
    workoutPlan,
    isGenerating,
    error,
    generatePlan,
    clearPlan,
  };
}
