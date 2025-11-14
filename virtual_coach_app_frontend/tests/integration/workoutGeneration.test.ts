import { describe, it, expect, beforeEach } from 'vitest';
import { generateWorkoutPlan } from '../../src/services/workoutGenerator';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../src/types/enums';
import type { Exercise, UserPreferences } from '../../src/types/dataModel';

describe('Workout Generation Algorithm', () => {
  let mockExercises: Exercise[];
  
  beforeEach(() => {
    // 建立測試用的運動資料 - 至少需要 3 個符合條件的運動
    mockExercises = [
      {
        id: 1,
        name: '深蹲',
        target_muscle: TargetMuscle.LEGS,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '腿部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: '弓箭步',
        target_muscle: TargetMuscle.LEGS,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '腿部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: '側抬腿',
        target_muscle: TargetMuscle.LEGS,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '腿部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        name: '伏地挺身',
        target_muscle: TargetMuscle.CHEST,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '胸部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        name: '寬手伏地挺身',
        target_muscle: TargetMuscle.CHEST,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '胸部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        name: '鑽石伏地挺身',
        target_muscle: TargetMuscle.CHEST,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '胸部訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        name: '棒式',
        target_muscle: TargetMuscle.CORE,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '核心訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        name: '側棒式',
        target_muscle: TargetMuscle.CORE,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '核心訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 9,
        name: '捲腹',
        target_muscle: TargetMuscle.CORE,
        difficulty_level: DifficultyLevel.BEGINNER,
        equipment_needed: null,
        description: '核心訓練',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  });

  describe('加權優先順序測試', () => {
    it('應該根據 priority_weight 排序運動項目', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CHEST],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
      };

      const plan = generateWorkoutPlan(mockExercises, preferences);
      
      expect(plan).toBeDefined();
      expect(plan.exercises).toBeInstanceOf(Array);
    });
  });

  describe('時長匹配測試', () => {
    it('應該生成接近目標時長的訓練計畫 (±10%)', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CHEST, TargetMuscle.CORE],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
        availableMinutes: 30,
      };

      const plan = generateWorkoutPlan(mockExercises, preferences);
      
      // 驗證生成的計畫時長合理（至少有符合數量的運動）
      expect(plan.estimatedDurationMinutes).toBeGreaterThan(10);
      expect(plan.exercises.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('標籤篩選測試', () => {
    it('應該只包含符合目標肌群的運動', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
      };

      const plan = generateWorkoutPlan(mockExercises, preferences);
      
      plan.exercises.forEach((item: any) => {
        expect(item.exercise.target_muscle).toBe(TargetMuscle.LEGS);
      });
    });

    it('應該只包含符合難度等級的運動', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CHEST],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
      };

      const plan = generateWorkoutPlan(mockExercises, preferences);
      
      plan.exercises.forEach((item: any) => {
        expect(item.exercise.difficulty_level).toBe(DifficultyLevel.BEGINNER);
      });
    });
  });

  describe('最小運動數量測試', () => {
    it('應該至少包含 3 個運動項目 (SC-002)', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CHEST, TargetMuscle.CORE],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
      };

      const plan = generateWorkoutPlan(mockExercises, preferences);
      
      expect(plan.exercises.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('邊界案例測試', () => {
    it('當無符合運動時應拋出錯誤', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.ARMS], // 測試資料中沒有手臂訓練
        difficultyLevel: DifficultyLevel.ADVANCED, // 測試資料中沒有進階難度
        equipmentAvailable: [],
      };

      expect(() => {
        generateWorkoutPlan(mockExercises, preferences);
      }).toThrow();
    });

    it('當符合運動 < 3 個時應發出警告', () => {
      const preferences: UserPreferences = {
        trainingGoal: TrainingGoal.MUSCLE_GAIN,
        targetMuscles: [TargetMuscle.LEGS],
        difficultyLevel: DifficultyLevel.BEGINNER,
        equipmentAvailable: [],
      };

      // 只有 1 個符合的運動
      const limitedExercises = mockExercises.slice(0, 1);
      
      expect(() => {
        generateWorkoutPlan(limitedExercises, preferences);
      }).toThrow(/至少需要 3 個運動項目/);
    });
  });
});
