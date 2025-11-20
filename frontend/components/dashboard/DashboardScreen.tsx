import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import {
    getWeeklyStats,
    getWorkoutTrend,
    getRecentWorkouts,
    WeeklyStats,
    TrendDataPoint,
} from '../../services/statsService';
import { WorkoutLog } from '../../types/db';
import { Activity, TrendingUp, Flame, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * DashboardScreen 組件 (Dashboard Screen Component)
 * 
 * 使用者訓練數據儀表板首頁
 * 
 * @param {Object} props - 組件 Props
 * @param {Function} props.onNavigateToHistory - 導向完整歷史頁面
 * @param {Function} props.onNavigateToProfile - 導向個人資料頁面
 * @param {Function} props.onStartWorkout - 開始新訓練
 */
export const DashboardScreen: React.FC<{
    onNavigateToHistory: () => void;
    onNavigateToProfile: () => void;
    onStartWorkout: () => void;
}> = ({ onNavigateToHistory, onNavigateToProfile, onStartWorkout }) => {
    const { user, profile } = useAuth();
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
    const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
    const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [stats, trend, recent] = await Promise.all([
                    getWeeklyStats(user.id),
                    getWorkoutTrend(user.id, 14), // 過去 14 天
                    getRecentWorkouts(user.id, 5),
                ]);

                setWeeklyStats(stats);
                setTrendData(trend);
                setRecentWorkouts(recent);
            } catch (error) {
                console.error('載入儀表板資料失敗:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-light border-t-brand-dark rounded-full animate-spin mx-auto"></div>
                    <p className="text-brand-gray">載入儀表板...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">
                        歡迎回來，{profile?.display_name || '訓練夥伴'}！
                    </h1>
                    <p className="text-brand-gray mt-1">追蹤你的健身進度</p>
                </div>
                <button
                    onClick={onNavigateToProfile}
                    className="px-4 py-2 text-brand-dark hover:bg-gray-100 rounded-lg transition"
                >
                    個人資料
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={<Activity size={24} />}
                    label="本週訓練"
                    value={weeklyStats?.totalWorkouts || 0}
                    unit="次"
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={<TrendingUp size={24} />}
                    label="總時長"
                    value={Math.round((weeklyStats?.totalDuration || 0) / 60)}
                    unit="分鐘"
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    icon={<Flame size={24} />}
                    label="消耗卡路里"
                    value={weeklyStats?.totalCalories || 0}
                    unit="kcal"
                    color="bg-orange-50 text-orange-600"
                />
                <StatCard
                    icon={<Star size={24} />}
                    label="平均難度"
                    value={weeklyStats?.averageRating.toFixed(1) || '0'}
                    unit="/ 5"
                    color="bg-yellow-50 text-yellow-600"
                />
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-brand-dark mb-4">訓練時長趨勢 (過去 14 天)</h2>
                {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
                            />
                            <YAxis label={{ value: '分鐘', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                labelFormatter={(date) => new Date(date).toLocaleDateString('zh-TW')}
                                formatter={(value: number) => [`${value.toFixed(1)} 分鐘`, '訓練時長']}
                            />
                            <Line type="monotone" dataKey="duration" stroke="#394508" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-brand-gray">
                        過去 14 天無訓練紀錄，開始你的第一次訓練吧！
                    </div>
                )}
            </div>

            {/* Recent Workouts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-brand-dark">最近訓練</h2>
                    <button
                        onClick={onNavigateToHistory}
                        className="text-brand-dark hover:underline text-sm font-medium"
                    >
                        查看全部 →
                    </button>
                </div>

                {recentWorkouts.length > 0 ? (
                    <div className="space-y-3">
                        {recentWorkouts.map((workout) => (
                            <div
                                key={workout.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium text-brand-dark">
                                        {new Date(workout.workout_date).toLocaleDateString('zh-TW', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-sm text-brand-gray">
                                        {Math.round(workout.duration_seconds / 60)} 分鐘 • {workout.exercises_completed.length} 個動作
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {workout.difficulty_rating && (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm font-medium">{workout.difficulty_rating}</span>
                                        </div>
                                    )}
                                    {workout.feeling && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${workout.feeling === 'easy' ? 'bg-green-100 text-green-700' :
                                                workout.feeling === 'good' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {workout.feeling === 'easy' ? '太簡單' : workout.feeling === 'good' ? '剛好' : '太難'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-brand-gray">
                        <p className="mb-4">尚無訓練紀錄</p>
                        <Button onClick={onStartWorkout}>開始第一次訓練</Button>
                    </div>
                )}
            </div>

            {/* CTA */}
            {recentWorkouts.length > 0 && (
                <div className="text-center">
                    <Button onClick={onStartWorkout} size="lg" className="px-12">
                        開始新訓練
                    </Button>
                </div>
            )}
        </div>
    );
};

/**
 * StatCard 組件 (Statistics Card Component)
 * 
 * 統計數據卡片
 */
const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: number | string;
    unit: string;
    color: string;
}> = ({ icon, label, value, unit, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-brand-gray">{label}</p>
            <p className="text-2xl font-bold text-brand-dark">
                {value} <span className="text-sm font-normal text-brand-gray">{unit}</span>
            </p>
        </div>
    </div>
);
