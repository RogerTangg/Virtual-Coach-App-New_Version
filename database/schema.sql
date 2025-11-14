-- ======================================
-- Virtual Coach App - Database Schema
-- ======================================
-- Table: exercises
-- Purpose: 儲存所有健身動作資訊
-- ======================================

-- 建立 exercises 資料表
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  description TEXT,
  video_url VARCHAR(500) NOT NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
  target_muscles TEXT[] NOT NULL CHECK (array_length(target_muscles, 1) > 0),
  training_goals TEXT[] NOT NULL CHECK (array_length(training_goals, 1) > 0),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  priority_weight INTEGER NOT NULL DEFAULT 5 CHECK (priority_weight BETWEEN 1 AND 10),
  equipment TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 建立更新時間觸發器函式
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器
DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 建立索引（加速查詢）
CREATE INDEX IF NOT EXISTS idx_exercises_target_muscles ON exercises USING GIN (target_muscles);
CREATE INDEX IF NOT EXISTS idx_exercises_training_goals ON exercises USING GIN (training_goals);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises (difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_is_active ON exercises (is_active);

-- ======================================
-- 插入測試資料（5筆）
-- ======================================

INSERT INTO exercises (name, name_en, description, video_url, duration_seconds, target_muscles, training_goals, difficulty, priority_weight, equipment, is_active)
VALUES
  (
    '深蹲',
    'Squat',
    '雙腳與肩同寬站立，臀部向後坐，膝蓋不超過腳尖，保持背部挺直。',
    'https://www.youtube.com/watch?v=ultWZbUMPL8',
    45,
    ARRAY['legs', 'glutes'],
    ARRAY['strength', 'muscle_gain'],
    'beginner',
    9,
    ARRAY[]::TEXT[],
    TRUE
  ),
  (
    '伏地挺身',
    'Push-up',
    '雙手撐地與肩同寬，身體呈一直線，下壓至胸部接近地面後推起。',
    'https://www.youtube.com/watch?v=IODxDxX7oi4',
    30,
    ARRAY['chest', 'arms', 'core'],
    ARRAY['strength', 'endurance'],
    'intermediate',
    8,
    ARRAY[]::TEXT[],
    TRUE
  ),
  (
    '棒式',
    'Plank',
    '前臂撐地，身體呈一直線，收緊核心，保持姿勢不動。',
    'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    60,
    ARRAY['core', 'shoulders'],
    ARRAY['endurance', 'strength'],
    'beginner',
    7,
    ARRAY[]::TEXT[],
    TRUE
  ),
  (
    '弓箭步',
    'Lunge',
    '一腳向前跨步，下蹲至雙膝呈90度，後膝不碰地。',
    'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    40,
    ARRAY['legs', 'glutes'],
    ARRAY['strength', 'muscle_gain'],
    'intermediate',
    8,
    ARRAY[]::TEXT[],
    TRUE
  ),
  (
    '開合跳',
    'Jumping Jack',
    '雙腳併攏站立，跳起時雙腳打開，雙手在頭頂拍合，跳回起始位置。',
    'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
    30,
    ARRAY['full_body', 'legs'],
    ARRAY['fat_loss', 'endurance'],
    'beginner',
    6,
    ARRAY[]::TEXT[],
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- ======================================
-- 驗證資料插入
-- ======================================
SELECT COUNT(*) as total_exercises FROM exercises WHERE is_active = TRUE;
