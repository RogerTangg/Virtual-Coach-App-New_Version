import { supabase } from '../lib/supabase';
import { WorkoutLog } from '../types/db';
import { getWorkoutLogsByDateRange } from './workoutLogService';

/**
 * 週統計資料介面
 */
export interface WeeklyStats {
    totalWorkouts: number;
    totalDuration: number; // 秒
    totalCalories: number;
    averageRating: number;
}

/**
 * 肌群分佈資料介面
 */
export interface MuscleDistribution {
    muscle: string;
    count: number;
    percentage: number;
}

/**
 * 訓練趨勢資料點介面
 */
export interface TrendDataPoint {
    date: string;
    duration: number; // 分鐘
    calories: number;
}

/**
 * 獲取本週統計 (Get Weekly Statistics)
 * 
 * @param {string} userId - 使用者 ID
 * @returns {Promise<WeeklyStats>} 本週統計資料
 */
export const getWeeklyStats = async (userId: string): Promise<WeeklyStats> => {
    // 計算本週起始與結束日期
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const logs = await getWorkoutLogsByDateRange(
        userId,
        startOfWeek.toISOString(),
        endOfWeek.toISOString()
    );

    const stats: WeeklyStats = {
        totalWorkouts: logs.length,
        totalDuration: logs.reduce((sum, log) => sum + log.duration_seconds, 0),
        totalCalories: logs.reduce((sum, log) => sum + (log.calories_burned || 0), 0),
        averageRating: logs.length > 0
            ? logs.reduce((sum, log) => sum + (log.difficulty_rating || 0), 0) / logs.length
            : 0,
    };

    return stats;
};

/**
 * 獲取訓練趨勢資料 (Get Workout Trend Data)
 * 
 * 取得過去 N 天的訓練時長趨勢
 * 
 * @param {string} userId - 使用者 ID
 * @param {number} [days=30] - 過去幾天 (預設 30)
 * @returns {Promise<TrendDataPoint[]>} 趨勢資料點陣列
 */
export const getWorkoutTrend = async (
    userId: string,
    days = 30
): Promise<TrendDataPoint[]> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const logs = await getWorkoutLogsByDateRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
    );

    // 依日期分組
    const dataByDate: Record<string, TrendDataPoint> = {};

    logs.forEach((log) => {
        const date = new Date(log.workout_date).toISOString().split('T')[0];

        if (!dataByDate[date]) {
            dataByDate[date] = {
                date,
                duration: 0,
                calories: 0,
            };
        }

        dataByDate[date].duration += log.duration_seconds / 60; // 轉為分鐘
        dataByDate[date].calories += log.calories_burned || 0;
    });

    // 轉為陣列並依日期排序
    return Object.values(dataByDate).sort((a, b) =>
        a.date.localeCompare(b.date)
    );
};

/**
 * 獲取肌群訓練分佈 (Get Muscle Group Distribution)
 * 
 * 分析使用者過去訓練了哪些肌群
 * 
 * @param {string} userId - 使用者 ID
 * @param {number} [days=30] - 過去幾天 (預設 30)
 * @returns {Promise<MuscleDistribution[]>} 肌群分佈資料
 */
export const getMuscleDistribution = async (
    userId: string,
    days = 30
): Promise<MuscleDistribution[]> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const logs = await getWorkoutLogsByDateRange(
        userId,
        startDate.toISOString(),
        endDate.toISOString()
    );

    // 統計各肌群出現次數
    const muscleCount: Record<string, number> = {};
    let totalExercises = 0;

    logs.forEach((log) => {
        if (!log.exercises_completed) return;

        log.exercises_completed.forEach((item) => {
            if (item.type === 'exercise' && item.exercise) {
                totalExercises++;
                // 從 tags 提取肌群資訊 (假設有 muscle:chest 格式)
                const tags = item.exercise.tags || [];
                tags.forEach((tag) => {
                    if (tag.startsWith('muscle:')) {
                        const muscle = tag.replace('muscle:', '');
                        muscleCount[muscle] = (muscleCount[muscle] || 0) + 1;
                    }
                });
            }
        });
    });

    // 轉為百分比
    const distribution: MuscleDistribution[] = Object.entries(muscleCount).map(
        ([muscle, count]) => ({
            muscle,
            count,
            percentage: totalExercises > 0 ? (count / totalExercises) * 100 : 0,
        })
    );

    // 依 count 排序
    return distribution.sort((a, b) => b.count - a.count);
};

/**
 * 獲取最近訓練列表 (Get Recent Workouts)
 * 
 * @param {string} userId - 使用者 ID
 * @param {number} [limit=5] - 取得筆數
 * @returns {Promise<WorkoutLog[]>} 最近訓練記錄
 */
export const getRecentWorkouts = async (
    userId: string,
    limit = 5
): Promise<WorkoutLog[]> => {
    const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .order('workout_date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('獲取最近訓練失敗:', error);
        throw new Error(error.message || '獲取最近訓練失敗');
    }

    return data || [];
};
