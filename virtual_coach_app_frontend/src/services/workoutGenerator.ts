import type { Exercise, UserPreferences, WorkoutPlan, WorkoutPlanItem } from '../types/dataModel';
import { v4 as uuidv4 } from 'uuid';

/**
 * 預設休息時間（秒）
 */
const DEFAULT_REST_SECONDS = 15;

/**
 * 最小運動數量要求
 */
const MIN_EXERCISES_COUNT = 3;

/**
 * 訓練計畫生成演算法
 * 
 * 根據用戶偏好從運動資料庫中篩選並排序運動項目，
 * 生成符合時長要求且包含至少 3 個運動的訓練計畫
 * 
 * @param exercises 所有可用的運動資料
 * @param preferences 用戶偏好設定
 * @returns WorkoutPlan 生成的訓練計畫
 * @throws Error 當無法生成符合條件的訓練計畫時
 */
export function generateWorkoutPlan(
  exercises: Exercise[],
  preferences: UserPreferences
): WorkoutPlan {
  // 1. 過濾符合偏好的運動
  const filteredExercises = filterExercises(exercises, preferences);

  if (filteredExercises.length === 0) {
    throw new Error('找不到符合您偏好的運動項目，請調整篩選條件');
  }

  if (filteredExercises.length < MIN_EXERCISES_COUNT) {
    throw new Error(
      `找到的符合運動項目少於 ${MIN_EXERCISES_COUNT} 個，至少需要 ${MIN_EXERCISES_COUNT} 個運動項目才能生成訓練計畫。請調整篩選條件。`
    );
  }

  // 2. 選取運動項目以匹配目標時長
  const selectedExercises = selectExercises(filteredExercises, preferences);

  if (selectedExercises.length < MIN_EXERCISES_COUNT) {
    throw new Error(
      `無法生成包含至少 ${MIN_EXERCISES_COUNT} 個運動的訓練計畫，請增加可用訓練時間`
    );
  }

  // 3. 計算總時長
  const totalDurationMinutes = calculateTotalDuration(selectedExercises);

  // 4. 生成訓練計畫
  const plan: WorkoutPlan = {
    id: uuidv4(),
    createdAt: new Date(),
    preferences,
    exercises: selectedExercises,
    estimatedDurationMinutes: totalDurationMinutes,
  };

  return plan;
}

/**
 * 根據用戶偏好篩選運動項目
 */
function filterExercises(
  exercises: Exercise[],
  preferences: UserPreferences
): Exercise[] {
  return exercises.filter((exercise) => {
    // 檢查難度等級是否匹配
    const difficultyMatch = exercise.difficulty_level === preferences.difficultyLevel;

    // 檢查目標肌群是否匹配（至少匹配一個）
    const muscleMatch = preferences.targetMuscles.includes(exercise.target_muscle);

    // 檢查裝備需求（如果用戶有指定可用裝備）
    let equipmentMatch = true;
    if (preferences.equipmentAvailable && preferences.equipmentAvailable.length > 0) {
      if (exercise.equipment_needed) {
        equipmentMatch = preferences.equipmentAvailable.includes(exercise.equipment_needed);
      }
    }

    return difficultyMatch && muscleMatch && equipmentMatch;
  });
}

/**
 * 選取運動項目以匹配目標時長
 * 使用貪婪演算法，優先選擇高優先權的運動
 */
function selectExercises(
  exercises: Exercise[],
  preferences: UserPreferences
): WorkoutPlanItem[] {
  const selected: WorkoutPlanItem[] = [];
  let accumulatedSeconds = 0;
  const targetSeconds = (preferences.availableMinutes || 30) * 60;

  // 按 priority_weight 降序排序（如果有的話，否則按名稱排序）
  const sortedExercises = [...exercises].sort((a, b) => {
    return b.name.localeCompare(a.name);
  });

  for (const exercise of sortedExercises) {
    // 計算該運動的總時長（包括所有組數和休息）
    const sets = calculateSets(preferences.trainingGoal);
    const reps = calculateReps(preferences.trainingGoal);
    const secondsPerRep = 3; // 假設每次動作 3 秒
    const restBetweenSets = 30; // 組間休息 30 秒
    
    // 單組時長 = 次數 * 每次秒數
    const singleSetDuration = reps * secondsPerRep;
    // 總時長 = (單組時長 + 組間休息) * 組數 + 運動後休息
    const exerciseTotalTime = (singleSetDuration + restBetweenSets) * sets + DEFAULT_REST_SECONDS;

    // 檢查加入此運動是否會超過目標時長太多（允許 10% 彈性）
    if (accumulatedSeconds + exerciseTotalTime <= targetSeconds * 1.1) {
      selected.push({
        exercise,
        sets,
        reps,
        restSeconds: DEFAULT_REST_SECONDS,
      });

      accumulatedSeconds += exerciseTotalTime;
    }

    // 如果已經達到或超過目標時長且有足夠的運動數量，停止選取
    if (accumulatedSeconds >= targetSeconds && selected.length >= MIN_EXERCISES_COUNT) {
      break;
    }
  }

  // 最後一個運動不需要休息
  if (selected.length > 0) {
    selected[selected.length - 1].restSeconds = 0;
  }

  return selected;
}

/**
 * 根據訓練目標計算建議組數
 */
function calculateSets(trainingGoal: string): number {
  switch (trainingGoal) {
    case 'muscle_gain':
      return 4; // 增肌：較多組數
    case 'weight_loss':
      return 3; // 減脂：中等組數
    case 'endurance':
      return 3; // 耐力：中等組數
    default:
      return 3;
  }
}

/**
 * 根據訓練目標計算建議次數
 */
function calculateReps(trainingGoal: string): number {
  switch (trainingGoal) {
    case 'muscle_gain':
      return 10; // 增肌：中等次數
    case 'weight_loss':
      return 15; // 減脂：較多次數
    case 'endurance':
      return 20; // 耐力：高次數
    default:
      return 12;
  }
}

/**
 * 計算訓練計畫總時長（分鐘）
 */
function calculateTotalDuration(exercises: WorkoutPlanItem[]): number {
  let totalSeconds = 0;
  const secondsPerRep = 3; // 假設每次動作 3 秒
  const restBetweenSets = 30; // 組間休息 30 秒

  for (const item of exercises) {
    // 單組時長 = 次數 * 每次秒數
    const singleSetDuration = item.reps * secondsPerRep;
    // 該運動總時長 = (單組時長 + 組間休息) * 組數 + 運動後休息
    const exerciseDuration = (singleSetDuration + restBetweenSets) * item.sets + item.restSeconds;
    totalSeconds += exerciseDuration;
  }

  return Math.round(totalSeconds / 60);
}
