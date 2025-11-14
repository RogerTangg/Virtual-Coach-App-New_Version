import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PreferenceForm } from '../../src/components/preferences/PreferenceForm';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../src/types/enums';

describe('PreferenceForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('表單渲染', () => {
    it('應該顯示所有必填欄位', () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText(/訓練目標/i)).toBeInTheDocument();
      expect(screen.getByText(/目標肌群/i)).toBeInTheDocument();
      expect(screen.getByText(/難度等級/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/可用訓練時間/i)).toBeInTheDocument();
    });

    it('應該顯示提交按鈕', () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: /生成訓練計畫/i })).toBeInTheDocument();
    });
  });

  describe('表單驗證', () => {
    it('應該要求至少選擇一個訓練目標', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /生成訓練計畫/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/請選擇訓練目標/i)).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('應該要求至少選擇一個目標肌群', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      // 選擇訓練目標但不選肌群
      const goalButton = screen.getByRole('button', { name: /增肌/i });
      fireEvent.click(goalButton);
      
      const submitButton = screen.getByRole('button', { name: /生成訓練計畫/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/請至少選擇一個目標肌群/i)).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('應該要求選擇難度等級', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      // 選擇訓練目標和肌群，但不選難度
      const goalButton = screen.getByRole('button', { name: /增肌/i });
      fireEvent.click(goalButton);
      
      const muscleButton = screen.getByRole('button', { name: /腿部/i });
      fireEvent.click(muscleButton);
      
      const submitButton = screen.getByRole('button', { name: /生成訓練計畫/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/請選擇難度等級/i)).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('表單提交', () => {
    it('應該在所有欄位有效時成功提交', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      // 填寫所有欄位
      const goalButton = screen.getByRole('button', { name: /增肌/i });
      fireEvent.click(goalButton);
      
      const muscleButton = screen.getByRole('button', { name: /腿部/i });
      fireEvent.click(muscleButton);
      
      const difficultyButton = screen.getByRole('button', { name: /初學者/i });
      fireEvent.click(difficultyButton);
      
      const timeInput = screen.getByLabelText(/可用訓練時間/i);
      fireEvent.change(timeInput, { target: { value: '30' } });
      
      const submitButton = screen.getByRole('button', { name: /生成訓練計畫/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          trainingGoal: TrainingGoal.MUSCLE_GAIN,
          targetMuscles: [TargetMuscle.LEGS],
          difficultyLevel: DifficultyLevel.BEGINNER,
          availableMinutes: 30,
        });
      });
    });

    it('應該支援多選肌群', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} />);
      
      // 選擇訓練目標
      fireEvent.click(screen.getByRole('button', { name: /增肌/i }));
      
      // 選擇多個肌群
      fireEvent.click(screen.getByRole('button', { name: /腿部/i }));
      fireEvent.click(screen.getByRole('button', { name: /核心/i }));
      
      fireEvent.click(screen.getByRole('button', { name: /初學者/i }));
      
      const timeInput = screen.getByLabelText(/可用訓練時間/i);
      fireEvent.change(timeInput, { target: { value: '30' } });
      
      const submitButton = screen.getByRole('button', { name: /生成訓練計畫/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            trainingGoal: TrainingGoal.MUSCLE_GAIN,
            targetMuscles: expect.arrayContaining([
              TargetMuscle.LEGS,
              TargetMuscle.CORE,
            ]),
          })
        );
      });
    });
  });

  describe('使用者體驗', () => {
    it('提交時應顯示載入狀態', async () => {
      render(<PreferenceForm onSubmit={mockOnSubmit} isLoading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /生成中/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
