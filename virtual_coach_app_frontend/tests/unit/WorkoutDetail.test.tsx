import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutList } from '../../src/components/workout/WorkoutList';
import type { WorkoutPlan } from '../../src/types/dataModel';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../src/types/enums';

describe('WorkoutDetail (WorkoutList)', () => {
  const mockWorkoutPlan: WorkoutPlan = {
    id: 'test-plan-1',
    createdAt: new Date(),
    preferences: {
      trainingGoal: TrainingGoal.MUSCLE_GAIN,
      targetMuscles: [TargetMuscle.CHEST, TargetMuscle.LEGS],
      difficultyLevel: DifficultyLevel.BEGINNER,
      equipmentAvailable: [],
      availableMinutes: 30,
    },
    exercises: [
      {
        exercise: {
          id: 1,
          name: '伏地挺身',
          target_muscle: TargetMuscle.CHEST,
          difficulty_level: DifficultyLevel.BEGINNER,
          equipment_needed: null,
          description: '基礎胸部訓練動作',
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
          name: '深蹲',
          target_muscle: TargetMuscle.LEGS,
          difficulty_level: DifficultyLevel.BEGINNER,
          equipment_needed: '啞鈴',
          description: '下半身綜合訓練',
          video_url: 'https://www.youtube.com/embed/test2',
          duration_seconds: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        sets: 3,
        reps: 12,
        restSeconds: 20,
      },
    ],
    estimatedDurationMinutes: 15,
  };

  describe('基本顯示', () => {
    it('應該顯示課表標題', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('您的訓練計畫')).toBeInTheDocument();
    });

    it('應該顯示預計時長', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText(/預計時長：15 分鐘/)).toBeInTheDocument();
    });

    it('應該顯示運動項目數量', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText(/2 個運動項目/)).toBeInTheDocument();
    });

    it('應該顯示所有運動項目名稱', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('伏地挺身')).toBeInTheDocument();
      expect(screen.getByText('深蹲')).toBeInTheDocument();
    });

    it('應該顯示運動說明', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('基礎胸部訓練動作')).toBeInTheDocument();
      expect(screen.getByText('下半身綜合訓練')).toBeInTheDocument();
    });
  });

  describe('運動項目詳細資訊', () => {
    it('應該顯示組數、次數、休息時間', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      // 第一個運動：4 組 10 次 15 秒休息
      const firstExercise = screen.getAllByText('4')[0];
      expect(firstExercise).toBeInTheDocument();
      expect(screen.getAllByText('10')[0]).toBeInTheDocument();
      expect(screen.getByText('15s')).toBeInTheDocument();
      
      // 第二個運動：3 組 12 次 20 秒休息
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('20s')).toBeInTheDocument();
    });

    it('應該顯示難度標籤', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      const beginnerLabels = screen.getAllByText('初學者');
      expect(beginnerLabels.length).toBeGreaterThan(0);
    });

    it('應該顯示目標肌群標籤', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('胸部')).toBeInTheDocument();
      expect(screen.getByText('腿部')).toBeInTheDocument();
    });

    it('應該顯示器材需求（如果有）', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('啞鈴')).toBeInTheDocument();
    });
  });

  describe('操作按鈕', () => {
    it('應該顯示「開始訓練」按鈕', () => {
      const onStartTraining = vi.fn();
      render(
        <WorkoutList
          workoutPlan={mockWorkoutPlan}
          onStartTraining={onStartTraining}
        />
      );
      
      const startButton = screen.getByText('開始訓練');
      expect(startButton).toBeInTheDocument();
    });

    it('應該顯示「重新生成」按鈕', () => {
      const onRegenerate = vi.fn();
      render(
        <WorkoutList
          workoutPlan={mockWorkoutPlan}
          onRegenerate={onRegenerate}
        />
      );
      
      const regenerateButton = screen.getByText('重新生成');
      expect(regenerateButton).toBeInTheDocument();
    });

    it('點擊「開始訓練」應該觸發回調', () => {
      const onStartTraining = vi.fn();
      render(
        <WorkoutList
          workoutPlan={mockWorkoutPlan}
          onStartTraining={onStartTraining}
        />
      );
      
      const startButton = screen.getByText('開始訓練');
      fireEvent.click(startButton);
      
      expect(onStartTraining).toHaveBeenCalledTimes(1);
    });

    it('點擊「重新生成」應該觸發回調', () => {
      const onRegenerate = vi.fn();
      render(
        <WorkoutList
          workoutPlan={mockWorkoutPlan}
          onRegenerate={onRegenerate}
        />
      );
      
      const regenerateButton = screen.getByText('重新生成');
      fireEvent.click(regenerateButton);
      
      expect(onRegenerate).toHaveBeenCalledTimes(1);
    });
  });

  describe('提示訊息', () => {
    it('應該顯示訓練小提示', () => {
      render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      expect(screen.getByText('訓練小提示')).toBeInTheDocument();
      expect(screen.getByText(/訓練前請先做暖身運動/)).toBeInTheDocument();
      expect(screen.getByText(/注意動作正確性，避免受傷/)).toBeInTheDocument();
      expect(screen.getByText(/依照自己的身體狀況調整強度/)).toBeInTheDocument();
    });
  });

  describe('響應式設計', () => {
    it('應該使用 Tailwind CSS 響應式類別', () => {
      const { container } = render(<WorkoutList workoutPlan={mockWorkoutPlan} />);
      
      // 檢查是否有 max-w-4xl (桌面), rounded-2xl (圓角), p-8 (內距) 等響應式類別
      const mainContainer = container.querySelector('.max-w-4xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });
});
