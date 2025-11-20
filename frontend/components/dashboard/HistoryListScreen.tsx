import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { getWorkoutHistory } from '../../services/workoutLogService';
import { WorkoutLog } from '../../types/db';
import { Calendar, Clock, Flame, Star, ChevronRight } from 'lucide-react';

/**
 * HistoryListScreen 組件 (History List Screen Component)
 * 
 * 完整訓練歷史列表頁面
 * 
 * @param {Object} props - 組件 Props
 * @param {Function} props.onBack - 返回上一頁
 */
export const HistoryListScreen: React.FC<{
    onBack: () => void;
}> = ({ onBack }) => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(null);

    useEffect(() => {
        if (!user) return;

        const loadHistory = async () => {
            setLoading(true);
            try {
                const history = await getWorkoutHistory(user.id, 50); // 取得最近 50 筆
                setWorkouts(history);
            } catch (error) {
                console.error('載入訓練歷史失敗:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-light border-t-brand-dark rounded-full animate-spin mx-auto"></div>
                    <p className="text-brand-gray">載入歷史紀錄...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-brand-dark">訓練歷史</h2>
                <button
                    onClick={onBack}
                    className="text-brand-gray hover:text-brand-dark transition"
                >
                    返回
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 bg-white rounded-xl shadow-lg p-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-brand-dark">{workouts.length}</p>
                    <p className="text-sm text-brand-gray">總訓練次數</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-brand-dark">
                        {Math.round(workouts.reduce((sum, w) => sum + w.duration_seconds, 0) / 60)}
                    </p>
                    <p className="text-sm text-brand-gray">總訓練時長 (分鐘)</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-brand-dark">
                        {workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0)}
                    </p>
                    <p className="text-sm text-brand-gray">總消耗卡路里</p>
                </div>
            </div>

            {/* Workout List */}
            {workouts.length > 0 ? (
                <div className="space-y-3">
                    {workouts.map((workout) => (
                        <div
                            key={workout.id}
                            onClick={() => setSelectedWorkout(workout)}
                            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={18} className="text-brand-gray" />
                                        <span className="font-bold text-brand-dark">
                                            {new Date(workout.workout_date).toLocaleDateString('zh-TW', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                weekday: 'short',
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-brand-gray">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>{Math.round(workout.duration_seconds / 60)} 分鐘</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Flame size={16} />
                                            <span>{workout.calories_burned || 0} kcal</span>
                                        </div>
                                        {workout.difficulty_rating && (
                                            <div className="flex items-center gap-1">
                                                <Star size={16} fill="currentColor" className="text-yellow-500" />
                                                <span>{workout.difficulty_rating}/5</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight className="text-brand-gray" size={24} />
                            </div>

                            {/* Feeling Badge */}
                            {workout.feeling && (
                                <div className="mt-3">
                                    <span className={`text-xs px-3 py-1 rounded-full ${workout.feeling === 'easy' ? 'bg-green-100 text-green-700' :
                                            workout.feeling === 'good' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {workout.feeling === 'easy' ? '太簡單' : workout.feeling === 'good' ? '剛好' : '太難'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <p className="text-brand-gray mb-4">尚無訓練紀錄</p>
                    <Button onClick={onBack}>開始第一次訓練</Button>
                </div>
            )}

            {/* Detail Modal */}
            {selectedWorkout && (
                <WorkoutDetailModal
                    workout={selectedWorkout}
                    onClose={() => setSelectedWorkout(null)}
                />
            )}
        </div>
    );
};

/**
 * WorkoutDetailModal 組件 (Workout Detail Modal Component)
 * 
 * 訓練詳細內容 Modal
 */
const WorkoutDetailModal: React.FC<{
    workout: WorkoutLog;
    onClose: () => void;
}> = ({ workout, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-brand-dark">訓練詳情</h3>
                        <button
                            onClick={onClose}
                            className="text-brand-gray hover:text-brand-dark transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Date */}
                    <div className="text-center py-4 bg-brand-light/20 rounded-lg">
                        <p className="text-sm text-brand-gray">訓練日期</p>
                        <p className="text-xl font-bold text-brand-dark">
                            {new Date(workout.workout_date).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long',
                            })}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Clock size={24} className="mx-auto mb-2 text-brand-dark" />
                            <p className="text-2xl font-bold text-brand-dark">
                                {Math.round(workout.duration_seconds / 60)}
                            </p>
                            <p className="text-xs text-brand-gray">分鐘</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Flame size={24} className="mx-auto mb-2 text-orange-500" />
                            <p className="text-2xl font-bold text-brand-dark">
                                {workout.calories_burned || 0}
                            </p>
                            <p className="text-xs text-brand-gray">大卡</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Star size={24} className="mx-auto mb-2 text-yellow-500" />
                            <p className="text-2xl font-bold text-brand-dark">
                                {workout.difficulty_rating || '-'}/5
                            </p>
                            <p className="text-xs text-brand-gray">難度</p>
                        </div>
                    </div>

                    {/* Exercises */}
                    <div>
                        <h4 className="font-bold text-brand-dark mb-3">訓練項目</h4>
                        <div className="space-y-2">
                            {workout.exercises_completed.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${item.type === 'exercise' ? 'bg-brand-light/20' : 'bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-brand-dark">{item.title}</span>
                                        <span className="text-sm text-brand-gray">
                                            {Math.round(item.duration)} 秒
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Close Button */}
                    <Button onClick={onClose} fullWidth>
                        關閉
                    </Button>
                </div>
            </div>
        </div>
    );
};
