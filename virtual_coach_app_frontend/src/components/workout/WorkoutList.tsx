import { ExerciseCard } from './ExerciseCard';
import { Button } from '../common/Button';
import type { WorkoutPlan } from '../../types/dataModel';

/**
 * WorkoutList Props
 */
export interface WorkoutListProps {
  workoutPlan: WorkoutPlan;
  onStartTraining?: () => void;
  onRegenerate?: () => void;
}

/**
 * 訓練計畫列表組件
 * 
 * 顯示完整的訓練計畫，包含所有運動項目
 */
export function WorkoutList({ workoutPlan, onStartTraining, onRegenerate }: WorkoutListProps) {
  const { exercises, estimatedDurationMinutes } = workoutPlan;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      {/* 標題與總結 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">您的訓練計畫</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>預計時長：{estimatedDurationMinutes} 分鐘</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span>{exercises.length} 個運動項目</span>
          </div>
        </div>
      </div>

      {/* 運動列表 */}
      <div className="space-y-4 mb-6">
        {exercises.map((item, index) => (
          <ExerciseCard key={index} item={item} index={index} />
        ))}
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-4">
        {onStartTraining && (
          <Button
            onClick={onStartTraining}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            開始訓練
          </Button>
        )}
        {onRegenerate && (
          <Button
            onClick={onRegenerate}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            重新生成
          </Button>
        )}
      </div>

      {/* 提示訊息 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">訓練小提示</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>訓練前請先做暖身運動</li>
              <li>注意動作正確性，避免受傷</li>
              <li>依照自己的身體狀況調整強度</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
