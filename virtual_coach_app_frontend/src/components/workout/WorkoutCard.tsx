import type { WorkoutPlanItem } from '../../types/dataModel';

/**
 * WorkoutCard Props
 */
export interface WorkoutCardProps {
  item: WorkoutPlanItem;
  index: number;
}

/**
 * 訓練項目卡片組件
 * 
 * 顯示單一運動的詳細資訊
 */
export function WorkoutCard({ item, index }: WorkoutCardProps) {
  const { exercise, sets, reps, restSeconds } = item;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-primary transition-all p-4">
      {/* 編號與名稱 */}
      <div className="flex items-start gap-4 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{exercise.name}</h3>
          {exercise.description && (
            <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
          )}
        </div>
      </div>

      {/* 訓練參數 */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{sets}</div>
          <div className="text-xs text-gray-500 mt-1">組數</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{reps}</div>
          <div className="text-xs text-gray-500 mt-1">次數</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{restSeconds}s</div>
          <div className="text-xs text-gray-500 mt-1">休息</div>
        </div>
      </div>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
          {getDifficultyLabel(exercise.difficulty_level)}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          {getMuscleLabel(exercise.target_muscle)}
        </span>
        {exercise.equipment_needed && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            {exercise.equipment_needed}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * 取得難度顯示名稱
 */
function getDifficultyLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: '初學者',
    intermediate: '中階',
    advanced: '進階',
  };
  return labels[level] || level;
}

/**
 * 取得肌群顯示名稱
 */
function getMuscleLabel(muscle: string): string {
  const labels: Record<string, string> = {
    chest: '胸部',
    back: '背部',
    legs: '腿部',
    shoulders: '肩膀',
    arms: '手臂',
    core: '核心',
  };
  return labels[muscle] || muscle;
}
