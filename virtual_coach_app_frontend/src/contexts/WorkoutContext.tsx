import { createContext, useContext, ReactNode } from 'react';
import { useExercises } from '../hooks/useExercises';
import { useWorkout } from '../hooks/useWorkout';
import type { Exercise, WorkoutPlan, UserPreferences } from '../types/dataModel';

/**
 * Workout Context 值介面
 */
interface WorkoutContextValue {
  // 運動資料
  exercises: Exercise[];
  exercisesLoading: boolean;
  exercisesError: string | null;
  refetchExercises: () => Promise<void>;
  
  // 訓練計畫
  workoutPlan: WorkoutPlan | null;
  isGenerating: boolean;
  generationError: string | null;
  generatePlan: (preferences: UserPreferences) => Promise<void>;
  clearPlan: () => void;
}

/**
 * Workout Context
 */
const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

/**
 * Workout Provider Props
 */
interface WorkoutProviderProps {
  children: ReactNode;
}

/**
 * Workout Provider 組件
 * 
 * 提供全局的運動資料與訓練計畫狀態管理
 */
export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const {
    exercises,
    isLoading: exercisesLoading,
    error: exercisesError,
    refetch: refetchExercises,
  } = useExercises();

  const {
    workoutPlan,
    isGenerating,
    error: generationError,
    generatePlan: generateWorkoutPlan,
    clearPlan,
  } = useWorkout();

  /**
   * 生成訓練計畫（包裝函式）
   */
  const generatePlan = async (preferences: UserPreferences) => {
    await generateWorkoutPlan(exercises, preferences);
  };

  const value: WorkoutContextValue = {
    exercises,
    exercisesLoading,
    exercisesError,
    refetchExercises,
    workoutPlan,
    isGenerating,
    generationError,
    generatePlan,
    clearPlan,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

/**
 * 自訂 Hook：使用 Workout Context
 * 
 * @returns WorkoutContextValue Context 值
 * @throws Error 當在 WorkoutProvider 外使用時
 */
export function useWorkoutContext(): WorkoutContextValue {
  const context = useContext(WorkoutContext);
  
  if (context === undefined) {
    throw new Error('useWorkoutContext 必須在 WorkoutProvider 內使用');
  }
  
  return context;
}
