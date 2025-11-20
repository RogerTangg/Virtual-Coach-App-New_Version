-- ==========================================
-- Phase 2: 使用者與歷史紀錄 Schema
-- Virtual Coach App - Database Migration
-- ==========================================
-- 執行說明：
-- 1. 登入 Supabase Dashboard
-- 2. 進入 SQL Editor
-- 3. 複製並執行此檔案內容
-- ==========================================

-- ==========================================
-- 0. 建立共用函數 (若尚未存在)
-- ==========================================

-- 建立更新時間觸發器函式 (若不存在則建立)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 1. Profiles 表 (使用者個人資料)
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  height NUMERIC,
  weight NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 建立更新時間觸發器 (沿用既有的 update_updated_at_column 函式)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE profiles IS '使用者個人資料表，與 auth.users 一對一關聯';

-- ==========================================
-- 2. Workout Logs 表 (訓練紀錄)
-- ==========================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
  calories_burned INTEGER CHECK (calories_burned >= 0),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  feeling TEXT CHECK (feeling IN ('easy', 'good', 'hard')),
  exercises_completed JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引優化：加速使用者查詢與日期排序
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_created_at ON workout_logs(created_at DESC);

COMMENT ON TABLE workout_logs IS '訓練紀錄表，儲存每次訓練的詳細資料';
COMMENT ON COLUMN workout_logs.exercises_completed IS '以 JSONB 格式儲存完整的訓練計畫 (PlanItem[])';

-- ==========================================
-- 3. User Favorites 表 (收藏動作)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- 索引優化：加速使用者收藏清單查詢
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_exercise ON user_favorites(exercise_id);

COMMENT ON TABLE user_favorites IS '使用者收藏的動作列表';

-- ==========================================
-- 4. Row Level Security (RLS) 政策
-- ==========================================

-- 啟用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Profiles 政策
-- ==========================================

-- 政策：使用者可查看自己的個人資料
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 政策：使用者可更新自己的個人資料
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 政策：使用者可插入自己的個人資料 (註冊時自動建立)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ==========================================
-- Workout Logs 政策
-- ==========================================

-- 政策：使用者可查看自己的訓練紀錄
CREATE POLICY "Users can view own workout logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

-- 政策：使用者可新增自己的訓練紀錄
CREATE POLICY "Users can insert own workout logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 政策：使用者可刪除自己的訓練紀錄 (選用)
CREATE POLICY "Users can delete own workout logs" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- User Favorites 政策
-- ==========================================

-- 政策：使用者可管理自己的收藏 (CRUD)
CREATE POLICY "Users can manage own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 5. 自動建立 Profile 觸發器
-- ==========================================
-- 當新使用者註冊時，自動在 profiles 表建立對應記錄

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立觸發器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 6. 驗證資料表建立
-- ==========================================
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM profiles
UNION ALL
SELECT 
  'workout_logs' as table_name, 
  COUNT(*) as row_count 
FROM workout_logs
UNION ALL
SELECT 
  'user_favorites' as table_name, 
  COUNT(*) as row_count 
FROM user_favorites;

-- ==========================================
-- Migration 完成！
-- ==========================================
