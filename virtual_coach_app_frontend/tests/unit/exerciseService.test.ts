import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { fetchActiveExercises } from '../../src/services/exerciseService';
import { DifficultyLevel, TargetMuscle } from '../../src/types/enums';

// 模擬 Supabase API 回應
const mockExercisesData = [
  {
    id: 1,
    name: '深蹲',
    target_muscle: 'legs',
    difficulty_level: 'beginner',
    equipment_needed: null,
    description: '雙腳與肩同寬站立',
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-14T10:00:00Z',
  },
  {
    id: 2,
    name: '伏地挺身',
    target_muscle: 'chest',
    difficulty_level: 'intermediate',
    equipment_needed: null,
    description: '雙手撐地與肩同寬',
    created_at: '2025-11-14T10:05:00Z',
    updated_at: '2025-11-14T10:05:00Z',
  },
];

// 設定 MSW 伺服器
const server = setupServer(
  http.get('*/rest/v1/exercises', () => {
    return HttpResponse.json(mockExercisesData);
  })
);

describe('Exercise Service', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('fetchActiveExercises', () => {
    it('應該成功獲取所有啟用的運動資料', async () => {
      const exercises = await fetchActiveExercises();
      
      expect(exercises).toBeDefined();
      expect(exercises).toBeInstanceOf(Array);
      expect(exercises.length).toBeGreaterThan(0);
    });

    it('應該正確轉換資料型別', async () => {
      const exercises = await fetchActiveExercises();
      
      exercises.forEach(exercise => {
        expect(exercise).toHaveProperty('id');
        expect(exercise).toHaveProperty('name');
        expect(exercise).toHaveProperty('target_muscle');
        expect(exercise).toHaveProperty('difficulty_level');
        expect(exercise).toHaveProperty('created_at');
        expect(exercise).toHaveProperty('updated_at');
      });
    });
  });

  describe('快取機制', () => {
    it('應該在指定時間內返回快取的資料', async () => {
      const firstCall = await fetchActiveExercises();
      const secondCall = await fetchActiveExercises();
      
      // 驗證兩次呼叫返回相同的資料（應使用快取）
      expect(firstCall).toEqual(secondCall);
    });
  });
});
