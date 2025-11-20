import { supabase } from '../lib/supabase';
import { UserFavorite, Exercise } from '../types/db';

/**
 * 新增收藏動作 (Add Exercise to Favorites)
 * 
 * @param {string} userId - 使用者 ID
 * @param {string} exerciseId - 動作 ID
 * @returns {Promise<UserFavorite>} 收藏記錄
 */
export const addFavorite = async (
    userId: string,
    exerciseId: string
): Promise<UserFavorite> => {
    const { data, error } = await supabase
        .from('user_favorites')
        .insert({ user_id: userId, exercise_id: exerciseId })
        .select()
        .single();

    if (error) {
        // 若為重複收藏（UNIQUE constraint 錯誤），不拋出錯誤
        if (error.code === '23505') {
            console.warn('此動作已在收藏清單中');
            return data;
        }
        console.error('新增收藏失敗:', error);
        throw new Error(error.message || '新增收藏失敗');
    }

    return data;
};

/**
 * 移除收藏動作 (Remove Exercise from Favorites)
 * 
 * @param {string} userId - 使用者 ID
 * @param {string} exerciseId - 動作 ID
 */
export const removeFavorite = async (
    userId: string,
    exerciseId: string
): Promise<void> => {
    const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId);

    if (error) {
        console.error('移除收藏失敗:', error);
        throw new Error(error.message || '移除收藏失敗');
    }
};

/**
 * 獲取使用者的收藏清單 (Get User's Favorite Exercises)
 * 
 * @param {string} userId - 使用者 ID
 * @returns {Promise<Exercise[]>} 收藏的動作清單
 */
export const getFavorites = async (userId: string): Promise<Exercise[]> => {
    const { data, error } = await supabase
        .from('user_favorites')
        .select(`
      exercise_id,
      exercises (*)
    `)
        .eq('user_id', userId);

    if (error) {
        console.error('獲取收藏清單失敗:', error);
        throw new Error(error.message || '獲取收藏清單失敗');
    }

    // 提取 exercises 欄位
    return (data || []).map((item: any) => item.exercises).filter(Boolean);
};

/**
 * 檢查動作是否已收藏 (Check if Exercise is Favorited)
 * 
 * @param {string} userId - 使用者 ID
 * @param {string} exerciseId - 動作 ID
 * @returns {Promise<boolean>} 是否已收藏
 */
export const isFavorite = async (
    userId: string,
    exerciseId: string
): Promise<boolean> => {
    const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .single();

    if (error && error.code !== 'PGRST116') {
        // PGRST116 = 查無資料，不視為錯誤
        console.error('檢查收藏狀態失敗:', error);
        return false;
    }

    return !!data;
};

/**
 * 切換收藏狀態 (Toggle Favorite Status)
 * 
 * 若已收藏則移除，若未收藏則新增
 * 
 * @param {string} userId - 使用者 ID
 * @param {string} exerciseId - 動作 ID
 * @returns {Promise<boolean>} 切換後的收藏狀態 (true = 已收藏)
 */
export const toggleFavorite = async (
    userId: string,
    exerciseId: string
): Promise<boolean> => {
    const favorited = await isFavorite(userId, exerciseId);

    if (favorited) {
        await removeFavorite(userId, exerciseId);
        return false;
    } else {
        await addFavorite(userId, exerciseId);
        return true;
    }
};
