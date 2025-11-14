import { useState, FormEvent } from 'react';
import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../../types/enums';
import { validatePreferences } from '../../utils/validators';
import { Button } from '../common/Button';
import type { UserPreferences } from '../../types/dataModel';

/**
 * PreferenceForm Props
 */
export interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

/**
 * 偏好設定表單組件
 * 
 * 讓用戶選擇訓練目標、目標肌群、難度等級和可用時間
 */
export function PreferenceForm({ onSubmit, isLoading = false }: PreferenceFormProps) {
  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal | ''>('');
  const [targetMuscles, setTargetMuscles] = useState<TargetMuscle[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel | ''>('');
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * 處理肌群多選
   */
  const handleMuscleToggle = (muscle: TargetMuscle) => {
    setTargetMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  };

  /**
   * 處理表單提交
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // 驗證輸入
    const preferences: Partial<UserPreferences> = {
      trainingGoal: trainingGoal || undefined,
      targetMuscles,
      difficultyLevel: difficultyLevel || undefined,
      availableMinutes,
    };

    const validation = validatePreferences(preferences);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 提交表單
    onSubmit(preferences as UserPreferences);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">設定您的訓練偏好</h2>

      {/* 錯誤訊息 */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 訓練目標 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          訓練目標 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTrainingGoal(TrainingGoal.MUSCLE_GAIN)}
            className={`p-4 rounded-lg border-2 transition-all ${
              trainingGoal === TrainingGoal.MUSCLE_GAIN
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">💪</div>
            <div className="font-medium">增肌</div>
          </button>
          <button
            type="button"
            onClick={() => setTrainingGoal(TrainingGoal.WEIGHT_LOSS)}
            className={`p-4 rounded-lg border-2 transition-all ${
              trainingGoal === TrainingGoal.WEIGHT_LOSS
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-medium">減脂</div>
          </button>
          <button
            type="button"
            onClick={() => setTrainingGoal(TrainingGoal.ENDURANCE)}
            className={`p-4 rounded-lg border-2 transition-all ${
              trainingGoal === TrainingGoal.ENDURANCE
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">🏃</div>
            <div className="font-medium">耐力</div>
          </button>
        </div>
      </div>

      {/* 目標肌群 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          目標肌群（可多選） <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(TargetMuscle).map((muscle) => (
            <button
              key={muscle}
              type="button"
              onClick={() => handleMuscleToggle(muscle)}
              className={`p-3 rounded-lg border-2 transition-all text-sm ${
                targetMuscles.includes(muscle)
                  ? 'border-secondary bg-green-50 text-secondary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {getMuscleLabel(muscle)}
            </button>
          ))}
        </div>
      </div>

      {/* 難度等級 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          難度等級 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDifficultyLevel(DifficultyLevel.BEGINNER)}
            className={`p-4 rounded-lg border-2 transition-all ${
              difficultyLevel === DifficultyLevel.BEGINNER
                ? 'border-accent bg-yellow-50 text-accent'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">初學者</div>
            <div className="text-xs text-gray-500 mt-1">適合新手</div>
          </button>
          <button
            type="button"
            onClick={() => setDifficultyLevel(DifficultyLevel.INTERMEDIATE)}
            className={`p-4 rounded-lg border-2 transition-all ${
              difficultyLevel === DifficultyLevel.INTERMEDIATE
                ? 'border-accent bg-yellow-50 text-accent'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">中階</div>
            <div className="text-xs text-gray-500 mt-1">有基礎經驗</div>
          </button>
          <button
            type="button"
            onClick={() => setDifficultyLevel(DifficultyLevel.ADVANCED)}
            className={`p-4 rounded-lg border-2 transition-all ${
              difficultyLevel === DifficultyLevel.ADVANCED
                ? 'border-accent bg-yellow-50 text-accent'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">進階</div>
            <div className="text-xs text-gray-500 mt-1">資深訓練者</div>
          </button>
        </div>
      </div>

      {/* 可用時間 */}
      <div className="mb-8">
        <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-3">
          可用訓練時間 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            id="time"
            type="range"
            min="15"
            max="60"
            step="5"
            value={availableMinutes}
            onChange={(e) => setAvailableMinutes(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="text-2xl font-bold text-primary w-24 text-right">
            {availableMinutes} 分鐘
          </div>
        </div>
      </div>

      {/* 提交按鈕 */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? '生成中...' : '生成訓練計畫'}
      </Button>
    </form>
  );
}

/**
 * 取得肌群顯示名稱
 */
function getMuscleLabel(muscle: TargetMuscle): string {
  const labels: Record<TargetMuscle, string> = {
    [TargetMuscle.CHEST]: '胸部',
    [TargetMuscle.BACK]: '背部',
    [TargetMuscle.LEGS]: '腿部',
    [TargetMuscle.SHOULDERS]: '肩膀',
    [TargetMuscle.ARMS]: '手臂',
    [TargetMuscle.CORE]: '核心',
  };
  return labels[muscle] || muscle;
}
