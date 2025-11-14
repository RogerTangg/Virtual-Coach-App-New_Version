import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayer } from '../../src/hooks/usePlayer';
import type { WorkoutPlan } from '../../src/types/dataModel';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../src/types/enums';

describe('usePlayer Hook', () => {
  let mockWorkoutPlan: WorkoutPlan;

  beforeEach(() => {
    mockWorkoutPlan = {
      id: 'test-plan-1',
      createdAt: new Date(),
      preferences: {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CHEST],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
        availableMinutes: 30,
      },
      exercises: [
        {
          exercise: {
            id: 1,
            name: '深蹲',
            target_muscle: TargetMuscle.LEGS,
            difficulty_level: DifficultyLevel.BEGINNER,
            equipment_needed: null,
            description: '腿部訓練',
            video_url: 'https://www.youtube.com/embed/test1',
            duration_seconds: 40,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          sets: 4,
          reps: 10,
          restSeconds: 15,
        },
        {
          exercise: {
            id: 2,
            name: '伏地挺身',
            target_muscle: TargetMuscle.CHEST,
            difficulty_level: DifficultyLevel.BEGINNER,
            equipment_needed: null,
            description: '胸部訓練',
            video_url: 'https://www.youtube.com/embed/test2',
            duration_seconds: 40,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          sets: 4,
          reps: 10,
          restSeconds: 15,
        },
      ],
      estimatedDurationMinutes: 10,
    };
  });

  describe('初始化', () => {
    it('應該初始化為第一個運動', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.currentExercise.exercise.name).toBe('深蹲');
      expect(result.current.isPlaying).toBe(true);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isCompleted).toBe(false);
    });

    it('應該計算正確的剩餘時間', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      // 第一個運動: 40 秒
      expect(result.current.remainingSeconds).toBe(40);
    });

    it('應該計算正確的總時間', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      // 兩個運動各 40 秒 = 80 秒
      expect(result.current.totalSeconds).toBe(80);
    });
  });

  describe('播放控制', () => {
    it('應該支援暫停', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
      expect(result.current.isPlaying).toBe(false);
    });

    it('應該支援繼續', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.pause();
        result.current.resume();
      });

      expect(result.current.isPaused).toBe(false);
      expect(result.current.isPlaying).toBe(true);
    });

    it('應該支援重置', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.next();
        result.current.reset();
      });

      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.remainingSeconds).toBe(40);
    });
  });

  describe('運動切換', () => {
    it('應該支援跳到下一個運動', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.next();
      });

      expect(result.current.currentExerciseIndex).toBe(1);
      expect(result.current.currentExercise.exercise.name).toBe('伏地挺身');
      expect(result.current.remainingSeconds).toBe(40);
    });

    it('應該支援跳到上一個運動', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.next();
      });

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.currentExercise.exercise.name).toBe('深蹲');
    });

    it('應該在最後一個運動後標記為完成', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.next(); // 到第 2 個
      });

      act(() => {
        result.current.next(); // 完成
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.isPlaying).toBe(false);
    });

    it('在第一個運動時不應該往前跳', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      act(() => {
        result.current.previous();
      });

      expect(result.current.currentExerciseIndex).toBe(0);
    });
  });

  describe('進度追蹤', () => {
    it('應該計算正確的進度百分比', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      // 初始進度應該是 0%
      expect(result.current.progressPercent).toBe(0);
    });

    it('應該提供正確的運動總數', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      expect(result.current.totalExercises).toBe(2);
    });
  });

  describe('時間格式化', () => {
    it('應該格式化剩餘時間為 MM:SS', () => {
      const { result } = renderHook(() => usePlayer(mockWorkoutPlan));

      // 40 秒應該顯示為 0:40
      expect(result.current.formattedTime).toMatch(/0:40|00:40/);
    });

    it('應該格式化時間大於 60 秒', () => {
      const longPlan = {
        ...mockWorkoutPlan,
        exercises: [
          {
            ...mockWorkoutPlan.exercises[0],
            exercise: {
              ...mockWorkoutPlan.exercises[0].exercise,
              duration_seconds: 125,
            },
          },
        ],
      };

      const { result } = renderHook(() => usePlayer(longPlan));

      // 125 秒應該顯示為 2:05
      expect(result.current.formattedTime).toMatch(/2:05/);
    });
  });

  describe('錯誤處理', () => {
    it('應該處理空的訓練計畫', () => {
      const emptyPlan = {
        ...mockWorkoutPlan,
        exercises: [],
      };

      const { result } = renderHook(() => usePlayer(emptyPlan));

      expect(result.current.currentExerciseIndex).toBe(0);
      expect(result.current.isCompleted).toBe(true);
    });
  });
});
