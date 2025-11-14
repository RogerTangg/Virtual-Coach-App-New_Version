-- Virtual Coach App - Database Setup Script
-- 執行此腳本以建立所有必要的資料表和初始資料

-- ============================================
-- 1. 建立 exercises 資料表
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_muscle VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    equipment_needed VARCHAR(100),
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER DEFAULT 30,
    calories_per_minute DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    priority_weight INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_exercises_target_muscle ON public.exercises(target_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_is_active ON public.exercises(is_active);
CREATE INDEX IF NOT EXISTS idx_exercises_priority ON public.exercises(priority_weight DESC);

-- 建立更新時間戳記的觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 將觸發器綁定到 exercises 資料表
DROP TRIGGER IF EXISTS update_exercises_updated_at ON public.exercises;
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. 插入初始運動資料
-- ============================================

-- 腿部運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('深蹲', '雙腳與肩同寬站立，臀部向後坐，膝蓋彎曲至大腿與地面平行，再站起。保持背部挺直，膝蓋不超過腳尖。', 'legs', 'beginner', NULL, 10, 40, 8.5),
    ('弓箭步', '單腳向前跨步，前膝彎曲90度，後膝接近地面但不觸地。保持上半身直立，核心收緊。', 'legs', 'beginner', NULL, 9, 35, 7.8),
    ('側抬腿', '側躺在地面上，下方手臂支撐頭部。上方腿部向上抬起至45度，保持腿部伸直。', 'legs', 'beginner', NULL, 7, 30, 6.5),
    ('保加利亞分腿蹲', '後腳放在椅子或台階上，前腳向前跨，下蹲至前膝彎曲90度。', 'legs', 'intermediate', NULL, 8, 45, 9.2)
ON CONFLICT DO NOTHING;

-- 胸部運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('伏地挺身', '雙手撐地與肩同寬，身體呈一直線。彎曲手肘讓胸部接近地面，再推起。保持核心收緊。', 'chest', 'beginner', NULL, 10, 40, 8.0),
    ('寬手伏地挺身', '雙手距離比肩寬更寬，其他動作同標準伏地挺身。增加胸肌外側刺激。', 'chest', 'beginner', NULL, 9, 40, 8.3),
    ('鑽石伏地挺身', '雙手在胸前合成鑽石形狀，手肘貼近身體。強化胸肌內側和三頭肌。', 'chest', 'intermediate', NULL, 11, 45, 9.0),
    ('上斜伏地挺身', '雙手撐在椅子或台階上，身體角度向上傾斜。適合初學者建立力量。', 'chest', 'beginner', NULL, 6, 35, 6.5)
ON CONFLICT DO NOTHING;

-- 核心運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('棒式', '前臂撐地，身體呈一直線，保持核心緊繃。避免臀部下垂或抬高。', 'core', 'beginner', NULL, 10, 45, 7.5),
    ('側棒式', '單側前臂撐地，身體側面呈一直線。另一隻手可叉腰或向上伸直。', 'core', 'intermediate', NULL, 9, 40, 8.0),
    ('捲腹', '仰臥，雙手放在耳後，肩膀離地向上捲起。下背貼地，用腹肌力量而非頸部。', 'core', 'beginner', NULL, 8, 35, 7.0),
    ('登山者', '棒式姿勢，雙腿交替向前快速蹬腿至胸前。保持臀部穩定。', 'core', 'intermediate', NULL, 11, 40, 10.5)
ON CONFLICT DO NOTHING;

-- 背部運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('超人式', '俯臥，雙臂向前伸直。同時抬起雙臂和雙腿離地，保持2秒後放下。', 'back', 'beginner', NULL, 8, 35, 6.8),
    ('俯身划船', '俯身45度，雙手握水瓶或啞鈴，向腰部拉起，肩胛骨收緊。', 'back', 'intermediate', '啞鈴或水瓶', 9, 40, 8.5),
    ('反向飛鳥', '俯身，雙臂向兩側展開，肩胛骨收緊。強化上背和後肩。', 'back', 'beginner', NULL, 7, 35, 7.2)
ON CONFLICT DO NOTHING;

-- 肩膀運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('肩推', '站姿，雙手舉至肩膀高度，向上推起直至手臂伸直。', 'shoulders', 'intermediate', '啞鈴或水瓶', 9, 40, 8.0),
    ('側平舉', '雙手持物，從身側向上抬起至肩膀高度，控制下放。', 'shoulders', 'beginner', '啞鈴或水瓶', 8, 35, 7.5),
    ('前平舉', '雙手持物，從前方向上抬起至肩膀高度。', 'shoulders', 'beginner', '啞鈴或水瓶', 7, 35, 7.3),
    ('派克推舉', '下犬式姿勢，臀部抬高，手肘彎曲讓頭部接近地面，再推起。', 'shoulders', 'intermediate', NULL, 10, 40, 8.8)
ON CONFLICT DO NOTHING;

-- 手臂運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('二頭彎舉', '站姿，手持物品，肘部固定，前臂向上彎曲至肩膀位置。', 'arms', 'beginner', '啞鈴或水瓶', 8, 35, 6.5),
    ('三頭臂屈伸', '雙手撐在椅子後方，臀部離開椅子，手肘彎曲至90度再推起。', 'arms', 'beginner', '椅子', 9, 40, 7.8),
    ('錘式彎舉', '類似二頭彎舉，但掌心相對。同時訓練二頭肌和前臂。', 'arms', 'beginner', '啞鈴或水瓶', 7, 35, 6.8)
ON CONFLICT DO NOTHING;

-- 全身/有氧運動
INSERT INTO public.exercises (name, description, target_muscle, difficulty_level, equipment_needed, priority_weight, duration_seconds, calories_per_minute)
VALUES 
    ('開合跳', '站姿，雙腳併攏。跳起時雙腳分開，雙手在頭頂拍擊。', 'core', 'beginner', NULL, 9, 40, 12.0),
    ('波比跳', '站姿→蹲下→雙手撐地→跳回蹲姿→跳起。全身性高強度運動。', 'core', 'advanced', NULL, 12, 45, 15.0),
    ('高抬腿', '原地跑步，大腿抬起至腰部高度。快速交替雙腿。', 'legs', 'intermediate', NULL, 10, 40, 11.5)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. 啟用 Row Level Security (RLS)
-- ============================================

-- 啟用 RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- 建立政策：允許所有人讀取啟用的運動資料
CREATE POLICY "Allow public read access to active exercises"
    ON public.exercises
    FOR SELECT
    USING (is_active = true);

-- 建立政策：允許認證用戶讀取所有運動資料（用於管理功能）
CREATE POLICY "Allow authenticated users to read all exercises"
    ON public.exercises
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- 4. 建立有用的 View
-- ============================================

-- 建立 active_exercises view 方便查詢
CREATE OR REPLACE VIEW public.active_exercises AS
SELECT *
FROM public.exercises
WHERE is_active = true
ORDER BY priority_weight DESC, name;

-- ============================================
-- 完成！
-- ============================================

-- 驗證資料
SELECT 
    target_muscle,
    difficulty_level,
    COUNT(*) as exercise_count
FROM public.exercises
WHERE is_active = true
GROUP BY target_muscle, difficulty_level
ORDER BY target_muscle, difficulty_level;
