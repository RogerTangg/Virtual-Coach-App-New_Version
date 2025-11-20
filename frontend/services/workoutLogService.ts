import { supabase } from '../lib/supabase';
import { WorkoutLog } from '../types/db';

/**
 * 儲存訓練紀錄至資料庫 (Save Workout Log to Database)
 * 
 * 在使用者完成訓練後呼叫此函數，將訓練資料持久化
 * 
 * @param {Omit<WorkoutLog, 'id' | 'created_at'>} log - 訓練紀錄資料 (不含 id 與 created_at)
 * @returns {Promise<WorkoutLog>} 儲存後的完整訓練紀錄
 * 
 * @example
 * const log = await saveWorkoutLog({
 *   user_id: user.id,
 *   workout_date: new Date().toISOString(),
 *   duration_seconds: 1800,
 *   difficulty_rating: 3,
 *   feeling: 'good',
 *   exercises_completed: workoutPlan
 * });
 */
export const saveWorkoutLog = async (
    log: Omit<WorkoutLog, 'id' | 'created_at'>
): Promise<WorkoutLog> => {
    const { data, error } = await supabase
        .from('workout_logs')
        .insert(log)
        .select()
        .single();

    if (error) {
        console.error('儲存訓練紀錄失敗:', error);
        throw new Error(error.message || '儲存訓練紀錄失敗');
    }

    return data;
};

/**
 * 獲取使用者訓練歷史 (Get User Workout History)
 * 
 * 依時間倒序取得使用者的訓練紀錄
 * 
 * @param {string} userId - 使用者 ID
 * @param {number} [limit=30] - 最多取得幾筆紀錄 (預設 30)
 * @returns {Promise<WorkoutLog[]>} 訓練紀錄陣列
 */
export const getWorkoutHistory = async (
    userId: string,
    limit = 30
): Promise<WorkoutLog[]> => {
    const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .order('workout_date', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('獲取訓練歷史失敗:', error);
        throw new Error(error.message || '獲取訓練歷史失敗');
    }

    return data || [];
};

/**
 * 獲取指定時間範圍的訓練紀錄 (Get Workout Logs by Date Range)
 * 
 * @param {string} userId - 使用者 ID
 * @param {string} startDate - 開始日期 (ISO 格式)
 * @param {string} endDate - 結束日期 (ISO 格式)
 * @returns {Promise<WorkoutLog[]>} 訓練紀錄陣列
 */
export const getWorkoutLogsByDateRange = async (
    userId: string,
    startDate: string,
    endDate: string
): Promise<WorkoutLog[]> => {
    const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('workout_date', startDate)
        .lte('workout_date', endDate)
        .order('workout_date', { ascending: false });

    if (error) {
        console.error('獲取訓練紀錄失敗:', error);
        throw new Error(error.message || '獲取訓練紀錄失敗');
    }

    return data || [];
};

/**
 * 刪除訓練紀錄 (Delete Workout Log)
 * 
 * @param {string} logId - 訓練紀錄 ID
 */
export const deleteWorkoutLog = async (logId: string): Promise<void> => {
    const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', logId);

    if (error) {
        console.error('刪除訓練紀錄失敗:', error);
        throw new Error(error.message || '刪除訓練紀錄失敗');
    }
};

/**
 * 計算預估消耗卡路里 (Calculate Estimated Calories Burned)
 * 
 * 使用 MET (Metabolic Equivalent of Task) 公式計算：
 * Calories = MET * Weight(kg) * Duration(hours)
 * 
 * MET 值對應難度：
 * 1 (Very Light): 3.0
 * 2 (Light): 4.0
 * 3 (Moderate): 5.0
 * 4 (Vigorous): 6.0
 * 5 (Very Vigorous): 8.0
 * 
 * @param {number} durationSeconds - 訓練時長 (秒)
 * @param {number} [difficultyRating=3] - 難度評分 (1-5)
 * @param {number} [userWeight=70] - 使用者體重 (kg)，預設 70kg
 * @returns {number} 預估消耗卡路里
 */
export const calculateCaloriesBurned = (
    durationSeconds: number,
    difficultyRating: number = 3,
    userWeight: number = 70
): number => {
    const durationHours = durationSeconds / 3600;

    // 定義不同難度的 MET 值
    const metValues: Record<number, number> = {
        1: 3.0,
        2: 4.0,
        3: 5.0,
        4: 6.0,
        5: 8.0
    };

    // 確保 rating 在 1-5 之間，並取得對應 MET
    const validRating = Math.max(1, Math.min(5, Math.round(difficultyRating)));
    const met = metValues[validRating] || 5.0; // 預設使用中等強度 (MET 5.0)

    // 如果沒有提供體重或體重為 0，使用預設值 70kg
    const weight = userWeight > 0 ? userWeight : 70;

    return Math.round(met * weight * durationHours);
};
