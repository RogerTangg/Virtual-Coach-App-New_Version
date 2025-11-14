import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrainingPlayer } from '../../src/components/player/TrainingPlayer';
import type { WorkoutPlan } from '../../src/types/dataModel';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../src/types/enums';

describe('Training Player Execution', () => {
  let mockWorkoutPlan: WorkoutPlan;
  let mockOnExit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // 建立測試用的訓練計畫
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
        {
          exercise: {
            id: 3,
            name: '棒式',
            target_muscle: TargetMuscle.CORE,
            difficulty_level: DifficultyLevel.BEGINNER,
            equipment_needed: null,
            description: '核心訓練',
            video_url: 'https://www.youtube.com/embed/test3',
            duration_seconds: 45,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          sets: 3,
          reps: 12,
          restSeconds: 0,
        },
      ],
      estimatedDurationMinutes: 15,
    };

    mockOnExit = vi.fn();
  });

  describe('播放器初始化', () => {
    it('應該顯示第一個運動', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText('深蹲')).toBeInTheDocument();
      expect(screen.getByText(/運動 1/i)).toBeInTheDocument();
    });

    it('應該顯示當前組數和次數', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText(/4 組/i)).toBeInTheDocument();
      expect(screen.getByText(/10 次/i)).toBeInTheDocument();
    });

    it('應該顯示影片播放器', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      const iframe = screen.getByTitle(/深蹲/i);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com'));
    });
  });

  describe('播放控制', () => {
    it('應該支援暫停和繼續', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      const pauseButton = screen.getByRole('button', { name: /暫停/i });
      fireEvent.click(pauseButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /繼續/i })).toBeInTheDocument();
      });

      const resumeButton = screen.getByRole('button', { name: /繼續/i });
      fireEvent.click(resumeButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /暫停/i })).toBeInTheDocument();
      });
    });

    it('應該支援跳過當前運動', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText('深蹲')).toBeInTheDocument();
      
      const skipButton = screen.getByRole('button', { name: /跳過/i });
      fireEvent.click(skipButton);
      
      await waitFor(() => {
        expect(screen.getByText('伏地挺身')).toBeInTheDocument();
      });
    });

    it('應該支援退出並顯示確認對話框', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      const exitButton = screen.getByRole('button', { name: /退出/i });
      fireEvent.click(exitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/確定要退出訓練嗎/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /確定/i });
      fireEvent.click(confirmButton);
      
      expect(mockOnExit).toHaveBeenCalledTimes(1);
    });
  });

  describe('自動切換', () => {
    it.skip('應該在倒數計時結束後自動切換至下一個運動', async () => {
      vi.useFakeTimers();
      
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText('深蹲')).toBeInTheDocument();
      
      // 模擬時間流逝（假設每個運動 40 秒）
      vi.advanceTimersByTime(41000);
      
      await waitFor(() => {
        expect(screen.getByText('伏地挺身')).toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });

    it.skip('應該在所有運動完成後顯示完成畫面', async () => {
      vi.useFakeTimers();
      
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      // 跳過所有運動
      const skipButton = screen.getByRole('button', { name: /跳過/i });
      fireEvent.click(skipButton); // 跳到第 2 個
      fireEvent.click(skipButton); // 跳到第 3 個
      fireEvent.click(skipButton); // 完成
      
      await waitFor(() => {
        expect(screen.getByText(/訓練完成/i)).toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });
  });

  describe('倒數計時器', () => {
    it('應該顯示剩餘時間', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText(/剩餘時間/i)).toBeInTheDocument();
    });

    it.skip('應該在暫停時停止計時', async () => {
      vi.useFakeTimers();
      
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      const pauseButton = screen.getByRole('button', { name: /暫停/i });
      fireEvent.click(pauseButton);
      
      const initialTime = screen.getByText(/\d+:\d+/);
      const initialTimeText = initialTime.textContent;
      
      vi.advanceTimersByTime(5000);
      
      await waitFor(() => {
        expect(initialTime.textContent).toBe(initialTimeText);
      });
      
      vi.useRealTimers();
    });
  });

  describe('進度顯示', () => {
    it('應該顯示當前運動進度 (x/total)', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText(/1.*\/.*3/)).toBeInTheDocument();
    });

    it('應該顯示進度條', () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('鍵盤快捷鍵 (選填)', () => {
    it.skip('應該支援空白鍵暫停/繼續', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      fireEvent.keyDown(document, { key: ' ', code: 'Space' });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /繼續/i })).toBeInTheDocument();
      });
    });

    it.skip('應該支援右箭頭跳過', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      expect(screen.getByText('深蹲')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'ArrowRight', code: 'ArrowRight' });
      
      await waitFor(() => {
        expect(screen.getByText('伏地挺身')).toBeInTheDocument();
      });
    });

    it.skip('應該支援 ESC 退出', async () => {
      render(<TrainingPlayer workoutPlan={mockWorkoutPlan} onExit={mockOnExit} />);
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      
      await waitFor(() => {
        expect(screen.getByText(/確定要退出訓練嗎/i)).toBeInTheDocument();
      });
    });
  });

  describe('錯誤處理', () => {
    it.skip('應該處理影片載入失敗', async () => {
      const brokenPlan = {
        ...mockWorkoutPlan,
        exercises: [
          {
            exercise: {
              ...mockWorkoutPlan.exercises[0].exercise,
              video_url: null, // 無影片
            },
            sets: 4,
            reps: 10,
            restSeconds: 15,
          },
        ],
      };
      
      render(<TrainingPlayer workoutPlan={brokenPlan} onExit={mockOnExit} />);
      
      await waitFor(() => {
        expect(screen.getByText(/影片無法載入/i)).toBeInTheDocument();
      });
    });
  });
});
