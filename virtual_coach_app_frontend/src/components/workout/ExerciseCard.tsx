import { useState } from 'react';
import type { WorkoutPlanItem } from '../../types/dataModel';

/**
 * ExerciseCard Props
 */
export interface ExerciseCardProps {
  item: WorkoutPlanItem;
  index: number;
  defaultExpanded?: boolean;
}

/**
 * 運動項目卡片組件（增強版）
 * 
 * 顯示單一運動的詳細資訊，支援展開/收合完整說明
 */
export function ExerciseCard({ item, index, defaultExpanded = false }: ExerciseCardProps) {
  const { exercise, sets, reps, restSeconds } = item;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-primary transition-all">
      {/* 主要內容 */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* 編號與名稱 */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{exercise.name}</h3>
              {/* 展開/收合圖示 */}
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {!isExpanded && exercise.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exercise.description}</p>
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
          {exercise.duration_seconds && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              {exercise.duration_seconds} 秒
            </span>
          )}
        </div>
      </div>

      {/* 展開的詳細內容 */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          {/* 完整說明 */}
          {exercise.description && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">運動說明</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{exercise.description}</p>
            </div>
          )}

          {/* 詳細資訊 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">訓練細節</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {sets} 組 × {reps} 次
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  每組休息 {restSeconds} 秒
                </li>
                {exercise.duration_seconds && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    預計 {exercise.duration_seconds} 秒
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">運動屬性</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <span className="text-gray-500">難度：</span>
                  {getDifficultyLabel(exercise.difficulty_level)}
                </li>
                <li>
                  <span className="text-gray-500">目標：</span>
                  {getMuscleLabel(exercise.target_muscle)}
                </li>
                <li>
                  <span className="text-gray-500">器材：</span>
                  {exercise.equipment_needed || '無需器材'}
                </li>
              </ul>
            </div>
          </div>

          {/* 影片連結 */}
          {exercise.video_url && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={exercise.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                觀看教學影片
              </a>
            </div>
          )}
        </div>
      )}
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
