# Virtual Coach App - 架構文件

## 目錄
1. [系統概覽](#系統概覽)
2. [技術堆疊](#技術堆疊)
3. [專案結構](#專案結構)
4. [資料流程](#資料流程)
5. [組件架構](#組件架構)
6. [狀態管理](#狀態管理)
7. [資料庫設計](#資料庫設計)

---

## 系統概覽

Virtual Coach App 是一個基於 React 的單頁應用程式（SPA），為使用者提供個人化健身訓練計畫。

### 核心功能
- 偏好設定：使用者選擇訓練目標、肌群、難度和時間
- 課表生成：根據偏好自動生成客製化訓練計畫
- 訓練播放器：全螢幕播放模式，包含影片、計時器和控制功能
- 課表詳情：查看完整運動資訊和說明

### 架構模式
- **前端架構**: Component-based (React)
- **狀態管理**: Context API + Custom Hooks
- **資料存取**: Supabase Client (BaaS)
- **樣式系統**: Tailwind CSS (Utility-first)

---

## 技術堆疊

### 核心技術
- **React 19.2.0** - UI 框架
- **TypeScript 5.8.3** - 類型安全
- **Vite 7.2.2** - 建置工具和開發伺服器
- **Tailwind CSS 3.4.20** - CSS 框架

### 後端服務
- **Supabase PostgreSQL** - 資料庫 (BaaS)
- **@supabase/supabase-js 2.48.0** - 客戶端 SDK

### 測試工具
- **Vitest 3.0.0** - 測試框架
- **React Testing Library 16.1.0** - React 元件測試
- **MSW 2.8.0** - API Mocking
- **jsdom** - DOM 環境模擬

### 開發工具
- **ESLint 9.x** - 程式碼檢查
- **PostCSS** - CSS 處理
- **@tailwindcss/postcss** - Tailwind CSS 整合

---

## 專案結構

```
virtual_coach_app_frontend/
├── public/                 # 靜態資源
├── src/
│   ├── components/        # React 元件
│   │   ├── common/        # 共用元件
│   │   │   ├── Button.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Toast.tsx
│   │   ├── preferences/   # 偏好設定元件
│   │   │   └── PreferenceForm.tsx
│   │   ├── workout/       # 課表相關元件
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── WorkoutCard.tsx
│   │   │   └── WorkoutList.tsx
│   │   └── player/        # 播放器元件
│   │       ├── TrainingPlayer.tsx
│   │       ├── VideoPlayer.tsx
│   │       ├── Timer.tsx
│   │       ├── PlayerControls.tsx
│   │       └── CompletionScreen.tsx
│   ├── contexts/          # React Context
│   │   └── WorkoutContext.tsx
│   ├── hooks/             # 自訂 Hooks
│   │   ├── useExercises.ts
│   │   ├── useWorkout.ts
│   │   └── usePlayer.ts
│   ├── services/          # 業務邏輯服務
│   │   ├── supabaseClient.ts
│   │   ├── exerciseService.ts
│   │   └── workoutGenerator.ts
│   ├── types/             # TypeScript 型別定義
│   │   ├── dataModel.ts
│   │   └── enums.ts
│   ├── utils/             # 工具函式
│   │   └── validators.ts
│   ├── App.tsx            # 主應用元件
│   ├── App.css
│   ├── index.css
│   └── main.tsx           # 應用入口
├── tests/                 # 測試檔案
│   ├── integration/       # 整合測試
│   └── unit/              # 單元測試
├── docs/                  # 文件
│   ├── cms-guide.md       # CMS 管理員手冊
│   └── architecture.md    # 本檔案
├── database/              # 資料庫腳本
│   ├── setup.sql
│   ├── README.md
│   └── QUICK_FIX.md
├── .env                   # 環境變數（不提交到 git）
├── .env.example           # 環境變數範本
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 資料流程

### 1. 應用程式啟動流程

```
main.tsx
  ↓
App.tsx (WorkoutProvider)
  ↓
AppContent
  ├── useWorkoutContext() - 取得全域狀態
  ├── useExercises() - 載入運動資料
  └── 渲染 UI (PreferenceForm / WorkoutList / TrainingPlayer)
```

### 2. 偏好設定與課表生成流程

```
使用者填寫 PreferenceForm
  ↓
handlePreferenceSubmit(preferences)
  ↓
WorkoutContext.generatePlan(preferences)
  ↓
exerciseService.getExercises(preferences) - 從 Supabase 查詢
  ↓
workoutGenerator.generateWorkoutPlan(exercises, preferences)
  ↓
更新 workoutPlan 狀態
  ↓
渲染 WorkoutList
```

### 3. 訓練播放器流程

```
點擊「開始訓練」
  ↓
App.tsx 設定 isTrainingMode = true
  ↓
渲染 TrainingPlayer(workoutPlan)
  ↓
usePlayer(workoutPlan) - 初始化播放器狀態
  ├── 計時器循環 (每秒)
  ├── 自動切換運動
  └── 處理使用者控制 (暫停/跳過/退出)
  ↓
完成所有運動
  ↓
渲染 CompletionScreen
```

### 4. 資料庫查詢流程

```
exerciseService.getExercises(filters)
  ↓
supabaseClient.from('exercises').select()
  ↓
套用篩選條件:
  - target_muscle IN (preferences.targetMuscles)
  - difficulty_level = preferences.difficultyLevel
  - is_active = true
  ↓
依 priority_weight DESC 排序
  ↓
回傳 Exercise[]
```

---

## 組件架構

### 組件層級關係

```
App (WorkoutProvider)
├── Loading (載入中)
├── Error (錯誤畫面)
└── AppContent
    ├── PreferenceForm (偏好設定)
    │   ├── Button
    │   └── 表單輸入元件
    ├── WorkoutList (課表列表)
    │   ├── ExerciseCard (運動卡片) - 可展開
    │   │   └── 運動詳細資訊
    │   └── Button (開始訓練 / 重新生成)
    └── TrainingPlayer (訓練播放器)
        ├── VideoPlayer (影片播放)
        ├── Timer (倒數計時)
        ├── PlayerControls (控制按鈕)
        └── CompletionScreen (完成畫面)
            └── Button (再練一次 / 返回首頁)
```

### 組件職責

#### Common 組件
- **Button**: 可重用按鈕 (primary/outline/ghost 變體)
- **Loading**: 載入動畫和訊息
- **Toast**: 通知訊息 (success/error/info/warning)

#### PreferenceForm
- 收集使用者偏好設定
- 表單驗證
- 呼叫課表生成 API

#### WorkoutList
- 顯示完整課表
- 展示預計時長和運動數量
- 提供操作按鈕 (開始訓練/重新生成)

#### ExerciseCard
- 顯示單一運動資訊
- 展開/收合詳細說明
- 顯示訓練參數 (組數、次數、休息)
- 連結教學影片

#### TrainingPlayer
- 全螢幕播放模式
- 整合影片、計時器、控制
- 鍵盤快捷鍵支援
- 退出確認對話框

#### VideoPlayer
- YouTube iframe 嵌入
- 自動播放支援
- 錯誤處理 (無影片時顯示提示)

#### Timer
- 倒數計時顯示 (MM:SS)
- 進度條視覺化
- 即時更新

#### PlayerControls
- 播放/暫停切換
- 上一個/下一個運動
- 跳過和退出按鈕

#### CompletionScreen
- 訓練完成祝賀
- 顯示統計資訊 (完成運動數、時長)
- 操作選項 (再練一次/返回首頁)

---

## 狀態管理

### Context API 架構

```typescript
WorkoutContext
├── exercisesLoading: boolean      // 運動資料載入中
├── exercisesError: string | null  // 運動資料錯誤
├── workoutPlan: WorkoutPlan | null // 當前課表
├── isGenerating: boolean          // 課表生成中
├── generationError: string | null // 課表生成錯誤
├── generatePlan: (preferences) => Promise<void>
└── clearPlan: () => void
```

### Custom Hooks

#### useExercises
```typescript
{
  exercises: Exercise[]      // 所有運動資料
  loading: boolean          // 載入狀態
  error: string | null      // 錯誤訊息
  refetch: () => void       // 重新載入
}
```

#### useWorkout
```typescript
{
  generateWorkoutPlan: (preferences) => WorkoutPlan
  // 根據偏好和運動資料生成課表
}
```

#### usePlayer
```typescript
{
  // 當前狀態
  currentExerciseIndex: number
  currentExercise: WorkoutExercise
  isPlaying: boolean
  isPaused: boolean
  isCompleted: boolean
  
  // 時間追蹤
  remainingSeconds: number
  totalSeconds: number
  formattedTime: string
  progressPercent: number
  
  // 控制方法
  play: () => void
  pause: () => void
  resume: () => void
  next: () => void
  previous: () => void
  reset: () => void
}
```

### 狀態流轉

```
初始狀態
  ↓
[載入運動資料] → exercisesLoading = true
  ↓
[載入完成] → exercises 填充, exercisesLoading = false
  ↓
[使用者填寫偏好]
  ↓
[生成課表] → isGenerating = true
  ↓
[生成完成] → workoutPlan 填充, isGenerating = false
  ↓
[顯示課表]
  ↓
[開始訓練] → isTrainingMode = true
  ↓
[播放中] → usePlayer 管理播放狀態
  ↓
[完成訓練] → isCompleted = true, 顯示 CompletionScreen
  ↓
[退出/重練] → 重置狀態或清除課表
```

---

## 資料庫設計

### exercises 資料表

```sql
CREATE TABLE exercises (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  target_muscle TEXT NOT NULL CHECK (target_muscle IN (
    'chest', 'back', 'legs', 'shoulders', 'arms', 'core'
  )),
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN (
    'beginner', 'intermediate', 'advanced'
  )),
  equipment_needed TEXT,
  description TEXT,
  video_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 40,
  priority_weight INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 索引

```sql
-- 查詢效能優化
CREATE INDEX idx_exercises_target_muscle ON exercises(target_muscle);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_active ON exercises(is_active);
CREATE INDEX idx_exercises_priority ON exercises(priority_weight DESC);
CREATE INDEX idx_exercises_compound ON exercises(target_muscle, difficulty_level, is_active);
```

### Row Level Security (RLS)

```sql
-- 允許所有使用者讀取啟用的運動
CREATE POLICY "Enable read for all users"
  ON exercises FOR SELECT
  USING (is_active = true);
```

### 觸發器

```sql
-- 自動更新 updated_at
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 關鍵設計決策

### 1. 為什麼使用 Context API 而非 Redux？
- **簡單性**: Context API 足以應付中小型應用
- **學習曲線**: 較低的學習成本
- **Bundle Size**: 無需額外依賴
- **開發速度**: 快速迭代

### 2. 為什麼使用 Supabase？
- **快速開發**: BaaS 減少後端開發時間
- **即時功能**: 內建 Realtime subscriptions
- **認證整合**: 內建用戶管理（未來可擴展）
- **免費方案**: 適合 MVP 和小型專案
- **PostgreSQL**: 成熟穩定的關係型資料庫

### 3. 為什麼使用 Tailwind CSS？
- **快速開發**: Utility-first 加快 UI 開發
- **一致性**: Design tokens 確保設計一致
- **效能**: PurgeCSS 移除未使用的樣式
- **響應式**: 內建響應式設計支援
- **可維護性**: 樣式與元件同處

### 4. 為什麼不使用路由器（React Router）？
- **簡化架構**: 單一頁面應用，狀態切換即可
- **減少依賴**: 降低 bundle size
- **MVP 範疇**: 目前功能無需複雜路由
- **未來擴展**: 需要時可輕易加入

### 5. 計時器實作方式
- **選擇**: JavaScript setInterval
- **理由**: 
  - 簡單直觀
  - 足夠準確（±1 秒需求）
  - 無需額外依賴
- **替代方案**: Web Workers (過度設計)

---

## 效能考量

### 優化策略

1. **Code Splitting** (未實作，未來考慮)
   - 使用 React.lazy() 和 Suspense
   - 按需載入大型元件

2. **Memoization**
   - 使用 React.memo() 防止不必要的重渲染
   - 使用 useMemo() 和 useCallback() 優化計算

3. **Tailwind CSS Purging**
   - 自動移除未使用的樣式
   - 生產環境 bundle size < 250KB

4. **圖片優化**
   - 使用 WebP 格式
   - 延遲載入 (lazy loading)

5. **資料庫查詢優化**
   - 索引優化（已實作）
   - 只查詢必要欄位
   - 客戶端快取（useExercises）

---

## 安全性

### 資料庫安全
- **RLS 政策**: 限制資料存取
- **環境變數**: .env 檔案不提交到 git
- **Anon Key**: 前端使用匿名金鑰（有限權限）

### 前端安全
- **XSS 防護**: React 自動跳脫
- **HTTPS**: 生產環境必須使用
- **CSP**: Content Security Policy (未來考慮)

---

## 測試策略

### 測試金字塔

```
       /\
      /  \
     / E2E\ (整合測試: 9 tests)
    /------\
   /  單元  \ (單元測試: 48 tests)
  /----------\
 / 靜態分析   \ (TypeScript + ESLint)
/--------------\
```

### 測試覆蓋率目標
- **整體覆蓋率**: > 60%
- **關鍵路徑**: > 80%
- **工具函式**: 100%

### 測試類型

1. **單元測試** (Vitest)
   - Hooks (usePlayer, useWorkout)
   - Services (exerciseService, workoutGenerator)
   - Components (PreferenceForm)

2. **整合測試** (React Testing Library)
   - 使用者流程 (偏好設定 → 生成課表)
   - 播放器完整執行流程

3. **靜態測試** (TypeScript + ESLint)
   - 型別檢查
   - 程式碼品質

---

## 部署架構

### 目標平台
- **Render Static Site** (推薦)
- 或 **Vercel / Netlify / GitHub Pages**

### CI/CD 流程

```
git push
  ↓
GitHub Actions
  ├── npm install
  ├── npm run lint
  ├── npm run test
  └── npm run build
  ↓
部署到 Render
  ↓
上線
```

### 環境變數管理

```
開發環境: .env (本地)
測試環境: GitHub Secrets
生產環境: Render Environment Variables
```

---

## 未來擴展考慮

### 短期（3-6 個月）
- 用戶認證與個人化歷史記錄
- 課表收藏和分享功能
- 更多訓練目標選項
- 進階篩選器（排除特定器材）

### 中期（6-12 個月）
- 行動應用程式 (React Native)
- 社群功能（評論、評分）
- AI 推薦演算法優化
- 多語言支援

### 長期（1 年以上）
- 教練付費服務
- 營養計畫整合
- 健身追蹤與數據分析
- VR/AR 訓練體驗

---

## 參考資源

- [React 官方文件](https://react.dev)
- [Supabase 文件](https://supabase.com/docs)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [Vitest 文件](https://vitest.dev)
- [TypeScript 文件](https://www.typescriptlang.org/docs)
