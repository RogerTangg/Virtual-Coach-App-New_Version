# API Contracts: Supabase 查詢模式

**Branch**: 001-virtual-coach-mvp | **Date**: 2025-11-14  
**Backend**: Supabase PostgreSQL + Auto-generated REST API

---

## Overview

本專案使用 **Supabase BaaS**（Backend-as-a-Service）作為後端，無需自建 API 層。Supabase 自動為 PostgreSQL 資料表生成 RESTful API 與 JavaScript SDK。本文檔定義前端與 Supabase 的所有查詢模式、錯誤處理與安全策略。

---

## Supabase Client Setup

### Installation

```powershell
npm install @supabase/supabase-js
```

### Client Configuration

```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // 自動生成的類型定義

// 環境變數配置（Vite）
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('缺少 Supabase 環境變數：請在 .env 檔案中設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY');
}

/**
 * Supabase 客戶端（全域單例）
 * 用於所有資料庫查詢操作
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // MVP 無登入功能，關閉 session 持久化
  },
});
```

### Environment Variables

```bash
# .env (本地開發環境)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## API Contract 1: 取得所有啟用的動作

### Use Case
用戶進入應用時，前端需取得所有可用的健身動作資料，供訓練計畫生成器使用（對應 FR-001, FR-005）。

### Request

```typescript
// src/services/exerciseService.ts
import { supabase } from './supabaseClient';
import type { Exercise } from '../types/dataModel';

/**
 * 取得所有啟用的健身動作
 * @returns Promise<Exercise[]> 動作列表
 * @throws Error 查詢失敗時拋出錯誤
 */
export const fetchActiveExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true)
    .order('priority_weight', { ascending: false });

  if (error) {
    throw new Error(`取得動作資料失敗：${error.message}`);
  }

  return data as Exercise[];
};
```

### Response (Success)

```json
[
  {
    "id": "e1a2b3c4-5678-90ab-cdef-1234567890ab",
    "name": "深蹲",
    "name_en": "Squat",
    "description": "雙腳與肩同寬站立，臀部向後坐...",
    "video_url": "https://www.youtube.com/watch?v=example_squat",
    "duration_seconds": 45,
    "target_muscles": ["legs", "glutes"],
    "training_goals": ["strength", "muscle_gain"],
    "difficulty": "beginner",
    "priority_weight": 8,
    "equipment": [],
    "is_active": true,
    "created_at": "2025-11-14T10:00:00Z",
    "updated_at": "2025-11-14T10:00:00Z"
  },
  {
    "id": "f2b3c4d5-6789-01bc-def2-234567890bcd",
    "name": "伏地挺身",
    "name_en": "Push-up",
    ...
  }
]
```

### Response (Error)

```json
{
  "error": {
    "message": "relation \"exercises\" does not exist",
    "details": "...",
    "hint": "..."
  }
}
```

### Error Handling

```typescript
// 前端錯誤處理範例
try {
  const exercises = await fetchActiveExercises();
  console.log('成功取得動作資料:', exercises.length, '筆');
} catch (error) {
  console.error('錯誤:', error.message);
  // 顯示錯誤訊息給用戶（例如：Toast 通知）
  alert('無法載入動作資料，請檢查網路連線後重試');
}
```

---

## API Contract 2: 根據偏好過濾動作

### Use Case
用戶選擇偏好後，前端需篩選符合條件的動作（目標肌群、訓練目標、困難度），供訓練計畫生成器使用（對應 FR-005）。

### Request

```typescript
// src/services/exerciseService.ts
import type { UserPreferences } from '../types/dataModel';

/**
 * 根據用戶偏好過濾動作
 * @param preferences 用戶偏好
 * @returns Promise<Exercise[]> 符合條件的動作列表
 */
export const fetchExercisesByPreferences = async (
  preferences: UserPreferences
): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true)
    .eq('difficulty', preferences.difficulty)
    .contains('target_muscles', preferences.targetMuscles)
    .contains('training_goals', preferences.trainingGoals)
    .order('priority_weight', { ascending: false });

  if (error) {
    throw new Error(`過濾動作資料失敗：${error.message}`);
  }

  return data as Exercise[];
};
```

### Query Parameters
- **`is_active`**: 必須為 `true`（僅顯示啟用的動作）
- **`difficulty`**: 必須匹配用戶選擇的困難度（`beginner` / `intermediate` / `advanced`）
- **`target_muscles`**: 必須包含至少一個用戶選擇的肌群（PostgreSQL `@>` 運算符）
- **`training_goals`**: 必須包含至少一個用戶選擇的目標（PostgreSQL `@>` 運算符）

### Response (Success)

```json
[
  {
    "id": "e1a2b3c4-5678-90ab-cdef-1234567890ab",
    "name": "深蹲",
    "target_muscles": ["legs", "glutes"],
    "training_goals": ["strength", "muscle_gain"],
    "difficulty": "beginner",
    "priority_weight": 8,
    ...
  }
]
```

### Response (No Matches)

```json
[]
```

### Error Handling

```typescript
// 前端處理無符合動作的情況
try {
  const exercises = await fetchExercisesByPreferences(preferences);
  
  if (exercises.length === 0) {
    alert('目前沒有符合您偏好的動作，請調整選項後重試');
    return;
  }
  
  // 生成訓練計畫
  const plan = generateWorkoutPlan(exercises, preferences);
} catch (error) {
  console.error('錯誤:', error.message);
}
```

---

## API Contract 3: 取得單一動作詳細資料

### Use Case
用戶在訓練過程中點擊動作名稱，顯示該動作的詳細資訊（描述、裝備需求等）（對應 FR-008）。

### Request

```typescript
// src/services/exerciseService.ts

/**
 * 取得單一動作的詳細資料
 * @param exerciseId 動作唯一識別碼
 * @returns Promise<Exercise | null> 動作資料或 null（若不存在）
 */
export const fetchExerciseById = async (exerciseId: string): Promise<Exercise | null> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .single(); // 確保只返回一筆資料

  if (error) {
    if (error.code === 'PGRST116') {
      // 資料不存在
      return null;
    }
    throw new Error(`取得動作詳細資料失敗：${error.message}`);
  }

  return data as Exercise;
};
```

### Response (Success)

```json
{
  "id": "e1a2b3c4-5678-90ab-cdef-1234567890ab",
  "name": "深蹲",
  "name_en": "Squat",
  "description": "雙腳與肩同寬站立，臀部向後坐，膝蓋不超過腳尖，保持背部挺直。",
  "video_url": "https://www.youtube.com/watch?v=example_squat",
  "duration_seconds": 45,
  "target_muscles": ["legs", "glutes"],
  "training_goals": ["strength", "muscle_gain"],
  "difficulty": "beginner",
  "priority_weight": 8,
  "equipment": [],
  "is_active": true,
  "created_at": "2025-11-14T10:00:00Z",
  "updated_at": "2025-11-14T10:00:00Z"
}
```

### Response (Not Found)

```json
{
  "error": {
    "message": "No rows found",
    "code": "PGRST116"
  }
}
```

---

## API Contract 4: CMS 管理動作（新增/編輯/刪除）

### Use Case
管理員透過 Supabase Dashboard（或自建 CMS 介面）管理動作資料（對應 FR-002）。

### 4.1 新增動作 (Create)

```typescript
// src/services/exerciseService.ts

/**
 * 新增健身動作（僅管理員使用）
 * @param exercise 動作資料（不包含 id, created_at, updated_at）
 * @returns Promise<Exercise> 新增成功的動作資料
 */
export const createExercise = async (
  exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>
): Promise<Exercise> => {
  const { data, error } = await supabase
    .from('exercises')
    .insert([exercise])
    .select()
    .single();

  if (error) {
    throw new Error(`新增動作失敗：${error.message}`);
  }

  return data as Exercise;
};
```

### Request Body Example

```json
{
  "name": "波比跳",
  "name_en": "Burpee",
  "description": "站立→深蹲→伏地挺身→跳躍，全身性高強度動作。",
  "video_url": "https://www.youtube.com/watch?v=example_burpee",
  "duration_seconds": 60,
  "target_muscles": ["full_body"],
  "training_goals": ["endurance", "fat_loss"],
  "difficulty": "advanced",
  "priority_weight": 9,
  "equipment": [],
  "is_active": true
}
```

### 4.2 更新動作 (Update)

```typescript
/**
 * 更新健身動作（僅管理員使用）
 * @param exerciseId 動作唯一識別碼
 * @param updates 需更新的欄位
 * @returns Promise<Exercise> 更新後的動作資料
 */
export const updateExercise = async (
  exerciseId: string,
  updates: Partial<Omit<Exercise, 'id' | 'created_at' | 'updated_at'>>
): Promise<Exercise> => {
  const { data, error } = await supabase
    .from('exercises')
    .update(updates)
    .eq('id', exerciseId)
    .select()
    .single();

  if (error) {
    throw new Error(`更新動作失敗：${error.message}`);
  }

  return data as Exercise;
};
```

### Request Body Example (部分更新)

```json
{
  "priority_weight": 10,
  "is_active": false
}
```

### 4.3 刪除動作 (Soft Delete)

```typescript
/**
 * 軟刪除動作（將 is_active 設為 false）
 * @param exerciseId 動作唯一識別碼
 * @returns Promise<void>
 */
export const deleteExercise = async (exerciseId: string): Promise<void> => {
  const { error } = await supabase
    .from('exercises')
    .update({ is_active: false })
    .eq('id', exerciseId);

  if (error) {
    throw new Error(`刪除動作失敗：${error.message}`);
  }
};
```

---

## Row-Level Security (RLS) Policies

### Security Strategy
- **讀取權限（SELECT）**: 所有用戶可讀取 `is_active = true` 的動作（公開資料）
- **寫入權限（INSERT/UPDATE/DELETE）**: 僅管理員可操作（透過 Supabase Dashboard 或自建管理介面）

### SQL Policies

```sql
-- 啟用 RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- 政策 1: 所有人可讀取啟用的動作
CREATE POLICY "公開讀取啟用動作"
ON exercises
FOR SELECT
USING (is_active = true);

-- 政策 2: 僅管理員可新增動作（未來擴展用）
-- 若加入用戶登入功能，可限制特定角色
CREATE POLICY "管理員可新增動作"
ON exercises
FOR INSERT
WITH CHECK (false); -- MVP 階段關閉 API 新增，僅透過 Dashboard 操作

-- 政策 3: 僅管理員可更新動作
CREATE POLICY "管理員可更新動作"
ON exercises
FOR UPDATE
USING (false); -- MVP 階段關閉 API 更新

-- 政策 4: 僅管理員可刪除動作
CREATE POLICY "管理員可刪除動作"
ON exercises
FOR DELETE
USING (false); -- MVP 階段關閉 API 刪除
```

### MVP 階段管理策略
**✅ 使用 Supabase Dashboard 手動管理動作資料**  
**❌ 不實作前端 CMS 介面**（避免過度工程，符合 Constitution I）

---

## Error Handling Standards

### Error Types

| Error Code | Description | Frontend Action |
|------------|-------------|-----------------|
| `PGRST116` | 查詢無結果（No rows found） | 顯示「無符合資料」訊息 |
| `PGRST301` | 違反唯一性約束（Duplicate key） | 顯示「動作名稱已存在」 |
| `42P01` | 資料表不存在（Relation does not exist） | 顯示「系統錯誤，請聯絡管理員」 |
| `23502` | 違反 NOT NULL 約束（Null value） | 顯示「必填欄位不可為空」 |
| Network Error | 網路連線失敗 | 顯示「網路連線失敗，請稍後重試」 |

### Centralized Error Handler

```typescript
// src/utils/errorHandler.ts

/**
 * Supabase 錯誤處理器（統一處理錯誤訊息）
 * @param error Supabase 返回的錯誤物件
 * @returns 用戶友好的錯誤訊息（繁體中文）
 */
export const handleSupabaseError = (error: any): string => {
  if (!error) return '未知錯誤';

  // 網路連線失敗
  if (error.message.includes('fetch')) {
    return '網路連線失敗，請檢查您的網路狀態後重試';
  }

  // PostgreSQL 錯誤碼對應
  switch (error.code) {
    case 'PGRST116':
      return '查無符合的資料';
    case 'PGRST301':
      return '資料已存在，請勿重複新增';
    case '42P01':
      return '系統設定錯誤，請聯絡技術支援';
    case '23502':
      return '必填欄位不可為空，請檢查輸入資料';
    default:
      return `資料庫錯誤：${error.message}`;
  }
};
```

### Usage Example

```typescript
// src/services/exerciseService.ts
import { handleSupabaseError } from '../utils/errorHandler';

export const fetchActiveExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true);

  if (error) {
    const errorMessage = handleSupabaseError(error);
    throw new Error(errorMessage);
  }

  return data as Exercise[];
};
```

---

## Performance Optimization

### Caching Strategy

#### 1. 快取所有動作資料（減少 API 呼叫）

```typescript
// src/hooks/useExercises.ts
import { useState, useEffect } from 'react';
import { fetchActiveExercises } from '../services/exerciseService';

/**
 * 快取健身動作資料（使用 React State）
 * 整個 session 期間只查詢一次資料庫
 */
export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveExercises();
        setExercises(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []); // 僅在組件掛載時執行一次

  return { exercises, loading, error };
};
```

#### 2. SessionStorage 備份（刷新頁面後保留資料）

```typescript
// src/hooks/useExercises.ts (進階版)
import { useState, useEffect } from 'react';

const EXERCISES_CACHE_KEY = 'virtual_coach_exercises_cache';
const CACHE_EXPIRY_HOURS = 24; // 快取有效期限 24 小時

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);

        // 1. 檢查 sessionStorage 是否有快取
        const cached = sessionStorage.getItem(EXERCISES_CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;

          // 若快取未過期，直接使用
          if (now - timestamp < expiryTime) {
            setExercises(data);
            setLoading(false);
            return;
          }
        }

        // 2. 快取過期或不存在，重新查詢資料庫
        const data = await fetchActiveExercises();
        setExercises(data);

        // 3. 儲存至 sessionStorage
        sessionStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }));

        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  return { exercises, loading, error };
};
```

### Index Optimization
已在 `data-model.md` 定義的資料庫索引：
- `idx_exercises_target_muscles`（GIN 索引，加速陣列查詢）
- `idx_exercises_training_goals`（GIN 索引，加速陣列查詢）
- `idx_exercises_difficulty`（B-tree 索引，加速等值查詢）
- `idx_exercises_is_active`（B-tree 索引，加速過濾）

---

## Testing Strategy

### Unit Tests (Vitest + MSW)

```typescript
// src/services/exerciseService.test.ts
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchActiveExercises } from './exerciseService';

// Mock Supabase API
const server = setupServer(
  http.get('https://your-project-ref.supabase.co/rest/v1/exercises', () => {
    return HttpResponse.json([
      {
        id: 'test-id-1',
        name: '深蹲',
        is_active: true,
        // ... 其他欄位
      },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('exerciseService', () => {
  it('應成功取得啟用的動作資料', async () => {
    const exercises = await fetchActiveExercises();
    expect(exercises).toHaveLength(1);
    expect(exercises[0].name).toBe('深蹲');
  });

  it('應正確處理網路錯誤', async () => {
    server.use(
      http.get('https://your-project-ref.supabase.co/rest/v1/exercises', () => {
        return HttpResponse.error();
      })
    );

    await expect(fetchActiveExercises()).rejects.toThrow('網路連線失敗');
  });
});
```

---

## API Documentation Summary

| API | Method | Endpoint | Description | Auth Required |
|-----|--------|----------|-------------|---------------|
| 取得所有啟用動作 | GET | `/exercises?is_active=eq.true` | 取得所有 `is_active = true` 的動作 | ❌ |
| 根據偏好過濾動作 | GET | `/exercises?is_active=eq.true&difficulty=eq.beginner&...` | 過濾符合偏好的動作 | ❌ |
| 取得單一動作 | GET | `/exercises?id=eq.<uuid>` | 取得指定 ID 的動作詳細資料 | ❌ |
| 新增動作 | POST | `/exercises` | 新增健身動作（CMS 使用） | ✅ (Dashboard Only) |
| 更新動作 | PATCH | `/exercises?id=eq.<uuid>` | 更新動作資料（CMS 使用） | ✅ (Dashboard Only) |
| 刪除動作 | PATCH | `/exercises?id=eq.<uuid>` | 軟刪除（設定 `is_active = false`） | ✅ (Dashboard Only) |

---

## Next Steps

1. ✅ **Phase 1 - API Contracts 完成**: Supabase 查詢模式與錯誤處理已定義
2. ⏭️ **Phase 1 - Quickstart**: 產生 `quickstart.md`（本地開發環境設定）
3. ⏭️ **Implementation**: 實作 `supabaseClient.ts`, `exerciseService.ts`, `useExercises` hook
4. ⏭️ **Testing**: 實作 MSW mock 測試（Vitest）

---

**Approved By**: GitHub Copilot  
**Date**: 2025-11-14
