# Data Model: 虛擬健身教練互動應用 MVP

**Branch**: 001-virtual-coach-mvp | **Date**: 2025-11-14  
**Database**: Supabase PostgreSQL | **Language**: TypeScript

---

## Database Schema Overview

本專案使用 Supabase PostgreSQL 作為資料儲存，共 4 個主要實體：

1. **`exercises`** (動作資料庫)：CMS 管理的健身動作
2. **`user_preferences`** (用戶偏好)：無登入架構下的本地暫存（localStorage），不存資料庫
3. **`workout_plans`** (訓練計畫)：前端運算生成，不存資料庫（MVP 階段）
4. **`training_sessions`** (訓練記錄)：選配功能，可延後實作

---

## Entity 1: `exercises` (動作資料庫)

### Purpose
儲存所有健身動作的資訊，供 CMS 管理與訓練計畫生成演算法使用。

### TypeScript Interface

```typescript
/**
 * 動作資料結構 (Exercise)
 * 對應 Supabase 資料表 `exercises`
 */
export interface Exercise {
  /** 動作唯一識別碼 (UUID) */
  id: string;
  
  /** 動作名稱（繁體中文） (e.g., "深蹲", "伏地挺身") */
  name: string;
  
  /** 動作名稱（英文） (e.g., "Squat", "Push-up") */
  name_en?: string;
  
  /** 動作描述（繁體中文）：執行要點、注意事項 */
  description?: string;
  
  /** 影片連結（YouTube/Vimeo URL） */
  video_url: string;
  
  /** 建議時長（秒）：單次執行建議的時間 */
  duration_seconds: number;
  
  /** 目標肌群（陣列）：對應 FR-003 */
  target_muscles: TargetMuscle[];
  
  /** 訓練目標（陣列）：對應 FR-003 */
  training_goals: TrainingGoal[];
  
  /** 困難度等級：對應 FR-003 */
  difficulty: DifficultyLevel;
  
  /** 優先權重（1-10）：演算法排序用 */
  priority_weight: number;
  
  /** 裝備需求（可選）：例如「啞鈴」、「彈力帶」 */
  equipment?: string[];
  
  /** 是否啟用：CMS 管理開關 */
  is_active: boolean;
  
  /** 建立時間 */
  created_at: string; // ISO 8601 timestamp
  
  /** 更新時間 */
  updated_at: string; // ISO 8601 timestamp
}
```

### Enums (列舉類型)

```typescript
/**
 * 目標肌群 (Target Muscle)
 * 對應 FR-003 的選項
 */
export enum TargetMuscle {
  CHEST = 'chest',           // 胸部
  BACK = 'back',             // 背部
  SHOULDERS = 'shoulders',   // 肩膀
  ARMS = 'arms',             // 手臂
  CORE = 'core',             // 核心
  LEGS = 'legs',             // 腿部
  GLUTES = 'glutes',         // 臀部
  FULL_BODY = 'full_body',   // 全身
}

/**
 * 訓練目標 (Training Goal)
 * 對應 FR-003 的選項
 */
export enum TrainingGoal {
  STRENGTH = 'strength',     // 肌力
  ENDURANCE = 'endurance',   // 耐力
  FLEXIBILITY = 'flexibility', // 柔軟度
  FAT_LOSS = 'fat_loss',     // 減脂
  MUSCLE_GAIN = 'muscle_gain', // 增肌
}

/**
 * 困難度等級 (Difficulty Level)
 * 對應 FR-003 的選項
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',     // 初學者
  INTERMEDIATE = 'intermediate', // 中階
  ADVANCED = 'advanced',     // 進階
}
```

### Supabase Table Schema (SQL)

```sql
-- 建立 exercises 資料表
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 建立更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_exercises_updated_at
BEFORE UPDATE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 建立索引（加速查詢）
CREATE INDEX idx_exercises_target_muscles ON exercises USING GIN (target_muscles);
CREATE INDEX idx_exercises_training_goals ON exercises USING GIN (training_goals);
CREATE INDEX idx_exercises_difficulty ON exercises (difficulty);
CREATE INDEX idx_exercises_is_active ON exercises (is_active);
```

### Sample Data

```typescript
// 範例動作資料 1: 深蹲
const sampleExercise1: Exercise = {
  id: 'e1a2b3c4-5678-90ab-cdef-1234567890ab',
  name: '深蹲',
  name_en: 'Squat',
  description: '雙腳與肩同寬站立，臀部向後坐，膝蓋不超過腳尖，保持背部挺直。',
  video_url: 'https://www.youtube.com/watch?v=example_squat',
  duration_seconds: 45,
  target_muscles: [TargetMuscle.LEGS, TargetMuscle.GLUTES],
  training_goals: [TrainingGoal.STRENGTH, TrainingGoal.MUSCLE_GAIN],
  difficulty: DifficultyLevel.BEGINNER,
  priority_weight: 8,
  equipment: [],
  is_active: true,
  created_at: '2025-11-14T10:00:00Z',
  updated_at: '2025-11-14T10:00:00Z',
};

// 範例動作資料 2: 伏地挺身
const sampleExercise2: Exercise = {
  id: 'f2b3c4d5-6789-01bc-def2-234567890bcd',
  name: '伏地挺身',
  name_en: 'Push-up',
  description: '雙手撐地與肩同寬,身體呈一直線,下壓至胸部接近地面後推起。',
  video_url: 'https://www.youtube.com/watch?v=example_pushup',
  duration_seconds: 30,
  target_muscles: [TargetMuscle.CHEST, TargetMuscle.ARMS, TargetMuscle.CORE],
  training_goals: [TrainingGoal.STRENGTH, TrainingGoal.ENDURANCE],
  difficulty: DifficultyLevel.INTERMEDIATE,
  priority_weight: 7,
  equipment: [],
  is_active: true,
  created_at: '2025-11-14T10:05:00Z',
  updated_at: '2025-11-14T10:05:00Z',
};
```

---

## Entity 2: `user_preferences` (用戶偏好)

### Purpose
儲存用戶在 PreferenceForm 中選擇的訓練偏好，用於生成個人化訓練計畫。

### Storage Strategy
**❌ 不存入 Supabase 資料庫**（因為 MVP 無登入機制）  
**✅ 儲存於瀏覽器 localStorage**（對應 FR-001）

### TypeScript Interface

```typescript
/**
 * 用戶偏好結構 (User Preferences)
 * 儲存於 localStorage，key: 'virtual_coach_preferences'
 */
export interface UserPreferences {
  /** 目標肌群（多選） */
  targetMuscles: TargetMuscle[];
  
  /** 訓練目標（多選） */
  trainingGoals: TrainingGoal[];
  
  /** 困難度等級（單選） */
  difficulty: DifficultyLevel;
  
  /** 可用訓練時間（分鐘） */
  availableMinutes: number;
  
  /** 偏好設定時間（用於判斷是否過期） */
  timestamp: string; // ISO 8601 timestamp
}
```

### LocalStorage Helper Functions

```typescript
/**
 * 儲存用戶偏好至 localStorage
 */
export const savePreferences = (preferences: Omit<UserPreferences, 'timestamp'>): void => {
  const preferencesWithTimestamp: UserPreferences = {
    ...preferences,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('virtual_coach_preferences', JSON.stringify(preferencesWithTimestamp));
};

/**
 * 從 localStorage 讀取用戶偏好
 * @returns UserPreferences | null（若無資料或已過期則返回 null）
 */
export const loadPreferences = (): UserPreferences | null => {
  const data = localStorage.getItem('virtual_coach_preferences');
  if (!data) return null;
  
  try {
    const preferences: UserPreferences = JSON.parse(data);
    // 檢查是否過期（例如：7天後過期）
    const expiryDays = 7;
    const timestamp = new Date(preferences.timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > expiryDays) {
      localStorage.removeItem('virtual_coach_preferences');
      return null;
    }
    
    return preferences;
  } catch (error) {
    console.error('Failed to parse preferences from localStorage:', error);
    return null;
  }
};

/**
 * 清除用戶偏好（對應 FR-014 重新選擇）
 */
export const clearPreferences = (): void => {
  localStorage.removeItem('virtual_coach_preferences');
};
```

### Sample Data

```typescript
// 範例偏好設定
const samplePreferences: UserPreferences = {
  targetMuscles: [TargetMuscle.LEGS, TargetMuscle.CORE],
  trainingGoals: [TrainingGoal.STRENGTH, TrainingGoal.FAT_LOSS],
  difficulty: DifficultyLevel.BEGINNER,
  availableMinutes: 30,
  timestamp: '2025-11-14T12:00:00Z',
};
```

---

## Entity 3: `workout_plans` (訓練計畫)

### Purpose
根據用戶偏好與動作資料庫生成的個人化訓練計畫，包含動作序列與總時長。

### Storage Strategy
**❌ 不存入 Supabase 資料庫**（MVP 階段不保存歷史計畫）  
**✅ 儲存於 React State**（`WorkoutContext`）與 **sessionStorage**（刷新頁面後保留）

### TypeScript Interface

```typescript
/**
 * 訓練計畫結構 (Workout Plan)
 * 由前端演算法生成（對應 FR-005）
 */
export interface WorkoutPlan {
  /** 計畫唯一識別碼（前端生成） */
  id: string;
  
  /** 訓練動作序列（按順序排列） */
  exercises: WorkoutExercise[];
  
  /** 計畫總時長（秒）：所有動作時長 + 休息時間 */
  totalDurationSeconds: number;
  
  /** 生成時間 */
  generatedAt: string; // ISO 8601 timestamp
  
  /** 基於的用戶偏好 */
  basedOnPreferences: UserPreferences;
}

/**
 * 訓練計畫中的單一動作（含順序與休息時間）
 */
export interface WorkoutExercise {
  /** 動作資料（來自 exercises 資料表） */
  exercise: Exercise;
  
  /** 動作在計畫中的順序（1-based） */
  order: number;
  
  /** 動作後的休息時間（秒） */
  restAfterSeconds: number;
}
```

### Generation Algorithm (演算法邏輯)

```typescript
/**
 * 訓練計畫生成演算法（對應 FR-005a: 加權優先順序）
 * 
 * 邏輯：
 * 1. 從 Supabase 取得所有 is_active = true 的動作
 * 2. 過濾出符合用戶偏好的動作（target_muscles, training_goals, difficulty）
 * 3. 按 priority_weight 排序
 * 4. 選取動作直到總時長接近用戶可用時間（考慮休息時間）
 * 5. 確保至少選取 3 個動作（對應 SC-002）
 */
export const generateWorkoutPlan = (
  exercises: Exercise[],
  preferences: UserPreferences
): WorkoutPlan => {
  const REST_TIME_SECONDS = 15; // 預設休息時間
  
  // 1. 過濾符合偏好的動作
  const filteredExercises = exercises.filter(ex => 
    ex.is_active &&
    ex.difficulty === preferences.difficulty &&
    ex.target_muscles.some(muscle => preferences.targetMuscles.includes(muscle)) &&
    ex.training_goals.some(goal => preferences.trainingGoals.includes(goal))
  );
  
  // 2. 按 priority_weight 降序排序
  const sortedExercises = filteredExercises.sort((a, b) => b.priority_weight - a.priority_weight);
  
  // 3. 選取動作（累積時長不超過可用時間）
  const selectedExercises: WorkoutExercise[] = [];
  let accumulatedTime = 0;
  const targetTimeSeconds = preferences.availableMinutes * 60;
  
  for (let i = 0; i < sortedExercises.length; i++) {
    const exercise = sortedExercises[i];
    const exerciseTime = exercise.duration_seconds + REST_TIME_SECONDS;
    
    if (accumulatedTime + exerciseTime <= targetTimeSeconds) {
      selectedExercises.push({
        exercise,
        order: selectedExercises.length + 1,
        restAfterSeconds: REST_TIME_SECONDS,
      });
      accumulatedTime += exerciseTime;
    }
    
    // 確保至少有 3 個動作
    if (selectedExercises.length >= 3 && accumulatedTime >= targetTimeSeconds * 0.8) {
      break;
    }
  }
  
  // 4. 最後一個動作不需要休息
  if (selectedExercises.length > 0) {
    selectedExercises[selectedExercises.length - 1].restAfterSeconds = 0;
  }
  
  // 5. 生成計畫
  const plan: WorkoutPlan = {
    id: `plan_${Date.now()}`,
    exercises: selectedExercises,
    totalDurationSeconds: accumulatedTime,
    generatedAt: new Date().toISOString(),
    basedOnPreferences: preferences,
  };
  
  return plan;
};
```

### Sample Data

```typescript
// 範例訓練計畫
const sampleWorkoutPlan: WorkoutPlan = {
  id: 'plan_1731585600000',
  exercises: [
    {
      exercise: sampleExercise1, // 深蹲
      order: 1,
      restAfterSeconds: 15,
    },
    {
      exercise: sampleExercise2, // 伏地挺身
      order: 2,
      restAfterSeconds: 15,
    },
    // ... 更多動作
  ],
  totalDurationSeconds: 1800, // 30 分鐘
  generatedAt: '2025-11-14T12:05:00Z',
  basedOnPreferences: samplePreferences,
};
```

---

## Entity 4: `training_sessions` (訓練記錄)

### Purpose
記錄用戶完成訓練的歷史（選配功能，MVP 階段可延後）。

### Storage Strategy
**⏳ MVP 階段不實作**（對應 FR-012 僅提示「訓練完成」，無保存紀錄）  
**✅ 未來擴展**: 若加入用戶登入功能，可儲存至 Supabase 資料表

### TypeScript Interface (未來擴展用)

```typescript
/**
 * 訓練記錄結構 (Training Session)
 * 未來若加入用戶登入功能可使用
 */
export interface TrainingSession {
  /** 記錄唯一識別碼 */
  id: string;
  
  /** 用戶識別碼（未來加入登入功能後使用） */
  user_id?: string;
  
  /** 使用的訓練計畫 */
  workout_plan_id: string;
  
  /** 完成的動作數量 */
  completed_exercises: number;
  
  /** 總訓練時長（秒） */
  total_duration_seconds: number;
  
  /** 訓練開始時間 */
  started_at: string; // ISO 8601 timestamp
  
  /** 訓練完成時間 */
  completed_at: string; // ISO 8601 timestamp
}
```

---

## Supabase Type Generation

### Generate TypeScript Types from Database

```powershell
# 1. 安裝 Supabase CLI
npm install -g supabase

# 2. 登入 Supabase 專案
supabase login

# 3. 生成 TypeScript 類型定義（連接到遠端專案）
supabase gen types typescript --project-id <your-project-ref> > src/types/supabase.ts
```

### Generated Type Example

```typescript
// src/types/supabase.ts (自動生成)
export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          description: string | null;
          video_url: string;
          duration_seconds: number;
          target_muscles: string[];
          training_goals: string[];
          difficulty: string;
          priority_weight: number;
          equipment: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
    };
  };
};
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Supabase DB    │
│   exercises     │  ← CMS 管理員新增/編輯動作
└────────┬────────┘
         │
         │ Fetch (REST API)
         ▼
┌─────────────────┐
│ React Frontend  │
│  exerciseService│  ← 取得所有動作資料
└────────┬────────┘
         │
         │ Filter + Sort
         ▼
┌─────────────────┐
│ workoutGenerator│  ← 生成訓練計畫（演算法）
└────────┬────────┘
         │
         │ Output
         ▼
┌─────────────────┐
│ WorkoutContext  │  ← React State（訓練計畫）
│ + sessionStorage│
└────────┬────────┘
         │
         │ Display
         ▼
┌─────────────────┐
│ VideoPlayer     │  ← 播放動作影片
└─────────────────┘
```

---

## Validation Rules

### `exercises` 資料表驗證
- `name`: 不可為空，最大 100 字元
- `video_url`: 必須為有效的 YouTube/Vimeo URL（可用正則驗證）
- `duration_seconds`: 必須 > 0
- `target_muscles`: 至少包含 1 個肌群
- `training_goals`: 至少包含 1 個目標
- `priority_weight`: 1-10 之間的整數

### `user_preferences` LocalStorage 驗證
- `targetMuscles`: 至少選擇 1 個肌群
- `trainingGoals`: 至少選擇 1 個目標
- `difficulty`: 必須為 beginner/intermediate/advanced 之一
- `availableMinutes`: 必須 >= 15 分鐘（對應 FR-002）

### `workout_plans` 生成驗證
- `exercises`: 至少包含 3 個動作（對應 SC-002）
- `totalDurationSeconds`: 不超過 `availableMinutes * 60 * 1.1`（允許 10% 誤差）

---

## Next Steps

1. ✅ **Phase 1 - Data Model 完成**: TypeScript 介面與資料庫 Schema 已定義
2. ⏭️ **Phase 1 - API Contracts**: 產生 `contracts/supabase-api.md`（Supabase 查詢模式）
3. ⏭️ **Phase 1 - Quickstart**: 產生 `quickstart.md`（本地開發環境設定）
4. ⏭️ **Implementation**: 實作 `exerciseService.js`, `workoutGenerator.js`, `useExercises` hook

---

**Approved By**: GitHub Copilot  
**Date**: 2025-11-14
