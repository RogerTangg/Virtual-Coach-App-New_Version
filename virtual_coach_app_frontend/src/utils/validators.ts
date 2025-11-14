import { TrainingGoal, TargetMuscle, DifficultyLevel } from '../types/enums';
import type { UserPreferences } from '../types/dataModel';

/**
 * 驗證結果介面
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 驗證用戶偏好設定
 * 
 * @param preferences 用戶偏好設定
 * @returns ValidationResult 驗證結果
 */
export function validatePreferences(preferences: Partial<UserPreferences>): ValidationResult {
  const errors: string[] = [];

  // 驗證訓練目標
  if (!preferences.trainingGoal) {
    errors.push('請選擇訓練目標');
  } else if (!Object.values(TrainingGoal).includes(preferences.trainingGoal)) {
    errors.push('無效的訓練目標');
  }

  // 驗證目標肌群
  if (!preferences.targetMuscles || preferences.targetMuscles.length === 0) {
    errors.push('請至少選擇一個目標肌群');
  } else {
    const invalidMuscles = preferences.targetMuscles.filter(
      (muscle) => !Object.values(TargetMuscle).includes(muscle)
    );
    if (invalidMuscles.length > 0) {
      errors.push(`無效的目標肌群: ${invalidMuscles.join(', ')}`);
    }
  }

  // 驗證難度等級
  if (!preferences.difficultyLevel) {
    errors.push('請選擇難度等級');
  } else if (!Object.values(DifficultyLevel).includes(preferences.difficultyLevel)) {
    errors.push('無效的難度等級');
  }

  // 驗證可用訓練時間
  if (!preferences.availableMinutes) {
    errors.push('請輸入可用訓練時間');
  } else if (preferences.availableMinutes < 15) {
    errors.push('訓練時間至少需要 15 分鐘');
  } else if (preferences.availableMinutes > 120) {
    errors.push('訓練時間不應超過 120 分鐘');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證訓練目標
 */
export function validateTrainingGoal(goal: string): boolean {
  return Object.values(TrainingGoal).includes(goal as TrainingGoal);
}

/**
 * 驗證目標肌群
 */
export function validateTargetMuscle(muscle: string): boolean {
  return Object.values(TargetMuscle).includes(muscle as TargetMuscle);
}

/**
 * 驗證難度等級
 */
export function validateDifficultyLevel(level: string): boolean {
  return Object.values(DifficultyLevel).includes(level as DifficultyLevel);
}

/**
 * 驗證可用訓練時間
 */
export function validateAvailableMinutes(minutes: number): ValidationResult {
  const errors: string[] = [];

  if (isNaN(minutes)) {
    errors.push('訓練時間必須是數字');
  } else if (minutes < 15) {
    errors.push('訓練時間至少需要 15 分鐘');
  } else if (minutes > 120) {
    errors.push('訓練時間不應超過 120 分鐘');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證裝備列表
 */
export function validateEquipment(equipment: string[]): ValidationResult {
  const errors: string[] = [];

  // 裝備為可選項目，允許空陣列
  if (!Array.isArray(equipment)) {
    errors.push('裝備列表必須是陣列');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
