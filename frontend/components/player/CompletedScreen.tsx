import React, { useState, useMemo } from 'react';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { Trophy, RotateCcw, Home, Clock, Dumbbell, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { saveWorkoutLog, calculateCaloriesBurned } from '../../services/workoutLogService';
import { PlanItem } from '../../types/app';

interface CompletedScreenProps {
  durationMinutes: number;
  workoutPlan: PlanItem[];
  onHome: () => void;
}

export const CompletedScreen: React.FC<CompletedScreenProps> = ({
  durationMinutes,
  workoutPlan,
  onHome
}) => {
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [feeling, setFeeling] = useState<'easy' | 'good' | 'hard' | ''>('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 計算訓練統計（訪客與登入使用者都可用）
  const workoutStats = useMemo(() => {
    const exerciseCount = workoutPlan.filter(item => item.type === 'exercise').length;
    const durationSeconds = durationMinutes * 60;
    // 使用中等難度 (3) 和使用者體重 (如果有) 來估算卡路里
    const estimatedCalories = calculateCaloriesBurned(
      durationSeconds,
      rating || 3,
      profile?.weight
    );

    return {
      duration: durationMinutes,
      exerciseCount,
      estimatedCalories,
    };
  }, [durationMinutes, workoutPlan, rating, profile?.weight]);

  const handleSaveWorkout = async () => {
    if (!user || rating === 0 || !feeling) {
      alert('請完成評分與感受選擇');
      return;
    }

    setSaving(true);

    try {
      const durationSeconds = durationMinutes * 60;
      const calories = calculateCaloriesBurned(
        durationSeconds,
        rating,
        profile?.weight
      );

      await saveWorkoutLog({
        user_id: user.id,
        workout_date: new Date().toISOString(),
        duration_seconds: durationSeconds,
        calories_burned: calories,
        difficulty_rating: rating,
        feeling,
        exercises_completed: workoutPlan,
      });

      setSaved(true);
    } catch (error) {
      console.error('儲存訓練紀錄失敗:', error);
      alert('儲存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
      <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(250,204,21,0.4)] animate-bounce-limited ring-4 ring-yellow-100">
        <Trophy size={56} className="text-yellow-900 drop-shadow-md" />
      </div>

      <h2 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tight">
        訓練完成！
      </h2>

      <p className="text-xl text-gray-600 max-w-md mb-8 leading-relaxed">
        太棒了！您剛剛完成了 <span className="font-bold text-brand-dark text-2xl">{durationMinutes}</span> 分鐘的訓練。<br />
        今天的汗水是明天的線條。
      </p>

      {/* 訓練統計卡片（訪客與登入使用者都顯示） */}
      <div className="w-full max-w-2xl bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">🎯 本次訓練統計</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <Clock size={36} className="mx-auto mb-3 text-blue-600" strokeWidth={2.5} />
            <p className="text-5xl font-black text-brand-dark mb-1">{workoutStats.duration}</p>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wide">分鐘</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-2xl border-2 border-green-100 shadow-md hover:shadow-lg transition-shadow">
            <Dumbbell size={36} className="mx-auto mb-3 text-green-600" strokeWidth={2.5} />
            <p className="text-5xl font-black text-brand-dark mb-1">{workoutStats.exerciseCount}</p>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wide">動作</p>
          </div>
          <div className="text-center p-6 bg-orange-50 rounded-2xl border-2 border-orange-100 shadow-md hover:shadow-lg transition-shadow">
            <Flame size={36} className="mx-auto mb-3 text-orange-600" strokeWidth={2.5} />
            <p className="text-5xl font-black text-brand-dark mb-1">{workoutStats.estimatedCalories}</p>
            <p className="text-sm font-medium text-brand-gray uppercase tracking-wide">大卡</p>
          </div>
        </div>
        {!user && (
          <div className="mt-6 p-4 bg-gradient-to-r from-brand-dark/5 to-brand-dark/10 rounded-xl border border-brand-dark/20">
            <p className="text-sm text-brand-dark text-center font-medium">
              💡 登入後可永久保存訓練紀錄並查看長期趨勢
            </p>
          </div>
        )}
      </div>

      {/* Feedback Form (僅登入使用者顯示) */}
      {user && !saved && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-6">
          <h3 className="text-xl font-bold text-brand-dark">訓練回饋</h3>

          {/* Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-dark">
              這次訓練對你來說有多難？
            </label>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} size={32} />
            </div>
            <p className="text-xs text-brand-gray">
              1 星 = 非常輕鬆，5 星 = 非常困難
            </p>
          </div>

          {/* Feeling */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-dark">
              整體感受
            </label>
            <div className="flex gap-2">
              {[
                { value: 'easy', label: '太簡單', color: 'bg-green-50 text-green-700 border-green-300' },
                { value: 'good', label: '剛剛好', color: 'bg-blue-50 text-blue-700 border-blue-300' },
                { value: 'hard', label: '太難了', color: 'bg-red-50 text-red-700 border-red-300' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFeeling(option.value as typeof feeling)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${feeling === option.value
                    ? option.color + ' font-bold'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSaveWorkout}
            fullWidth
            disabled={saving || rating === 0 || !feeling}
          >
            {saving ? '儲存中...' : '儲存紀錄'}
          </Button>
        </div>
      )}

      {saved && (
        <div className="w-full max-w-md bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-8">
          ✓ 訓練紀錄已儲存！可至儀表板查看統計資料。
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button onClick={onHome} fullWidth size="lg" className="gap-2 shadow-lg shadow-brand-dark/20 whitespace-nowrap">
          <Home size={20} /> 返回首頁
        </Button>
        <Button variant="outline" onClick={onHome} fullWidth size="lg" className="gap-2 whitespace-nowrap">
          <RotateCcw size={20} /> 再練一次
        </Button>
      </div>
    </div>
  );
};