# Quickstart Guide: 本地開發環境設定

**Branch**: 001-virtual-coach-mvp | **Date**: 2025-11-14  
**Stack**: React 19.2.0 + Vite 7.2.2 + Supabase + TypeScript + Tailwind CSS

---

## 前置需求 (Prerequisites)

### 必要工具
- **Node.js**: >= 18.0.0 (建議使用 LTS 版本)
- **npm**: >= 9.0.0 (隨 Node.js 一起安裝)
- **Git**: >= 2.34.0
- **程式碼編輯器**: Visual Studio Code (建議安裝以下擴充套件)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 檢查環境

```powershell
# 檢查 Node.js 版本
node --version  # 應顯示 v18.x.x 或更高

# 檢查 npm 版本
npm --version   # 應顯示 9.x.x 或更高

# 檢查 Git 版本
git --version   # 應顯示 2.34.x 或更高
```

---

## 步驟 1: Clone 專案

```powershell
# Clone 專案至本地
git clone <repository-url>
cd virtual-coach-app

# 切換至 MVP 功能分支
git checkout 001-virtual-coach-mvp
```

---

## 步驟 2: 安裝依賴套件

### 2.1 前端依賴

```powershell
# 進入前端專案目錄
cd virtual_coach_app_frontend

# 安裝所有依賴套件
npm install
```

### 2.2 依賴套件清單

安裝完成後，`package.json` 應包含以下主要依賴：

**Production Dependencies:**
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@supabase/supabase-js": "^2.81.1"
  }
}
```

**Development Dependencies:**
```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^7.2.2",
    "eslint": "^9.39.1",
    "typescript": "^5.8.3",
    "@types/react": "^19.0.9",
    "@types/react-dom": "^19.0.5",
    "tailwindcss": "^3.4.20",
    "postcss": "^8.5.1",
    "autoprefixer": "^10.4.20",
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@vitest/ui": "^3.0.0",
    "msw": "^2.8.0"
  }
}
```

---

## 步驟 3: 設定 TypeScript

### 3.1 生成 `tsconfig.json`

```powershell
# 生成 TypeScript 配置檔
npx tsc --init
```

### 3.2 編輯 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3.3 生成 `tsconfig.node.json` (Vite 配置用)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 步驟 4: 設定 Tailwind CSS

### 4.1 安裝 Tailwind CSS

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4.2 編輯 `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // 主色調（按鈕、強調）
        secondary: '#10B981',  // 次要色調（成功狀態）
        accent: '#F59E0B',     // 強調色（計時器、進度）
        neutral: '#6B7280',    // 中性色（文字）
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'], // 繁體中文友好字體
      },
    },
  },
  plugins: [],
}
```

### 4.3 引入 Tailwind Directives

編輯 `src/index.css`：

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 全域樣式（可選） */
body {
  margin: 0;
  font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 步驟 5: 設定 Supabase

### 5.1 建立 Supabase 專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊「New Project」
3. 填寫專案資訊：
   - **Name**: `virtual-coach-app`
   - **Database Password**: 設定一個強密碼（請妥善保管）
   - **Region**: 選擇離你最近的區域（例如：Singapore）
4. 等待專案初始化完成（約 2 分鐘）

### 5.2 建立 `exercises` 資料表

1. 在 Supabase Dashboard 左側選單點擊「SQL Editor」
2. 點擊「New Query」
3. 複製貼上以下 SQL（來自 `data-model.md`）：

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

-- 建立索引
CREATE INDEX idx_exercises_target_muscles ON exercises USING GIN (target_muscles);
CREATE INDEX idx_exercises_training_goals ON exercises USING GIN (training_goals);
CREATE INDEX idx_exercises_difficulty ON exercises (difficulty);
CREATE INDEX idx_exercises_is_active ON exercises (is_active);

-- 啟用 RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- 政策：所有人可讀取啟用的動作
CREATE POLICY "公開讀取啟用動作"
ON exercises
FOR SELECT
USING (is_active = true);
```

4. 點擊「Run」執行 SQL

### 5.3 插入測試資料

```sql
-- 插入 5 筆測試動作資料
INSERT INTO exercises (name, name_en, description, video_url, duration_seconds, target_muscles, training_goals, difficulty, priority_weight, equipment, is_active)
VALUES
  ('深蹲', 'Squat', '雙腳與肩同寬站立，臀部向後坐，膝蓋不超過腳尖。', 'https://www.youtube.com/watch?v=aclHkVaku9U', 45, ARRAY['legs', 'glutes'], ARRAY['strength', 'muscle_gain'], 'beginner', 8, ARRAY[]::TEXT[], true),
  ('伏地挺身', 'Push-up', '雙手撐地與肩同寬，身體呈一直線，下壓至胸部接近地面。', 'https://www.youtube.com/watch?v=IODxDxX7oi4', 30, ARRAY['chest', 'arms', 'core'], ARRAY['strength', 'endurance'], 'intermediate', 7, ARRAY[]::TEXT[], true),
  ('平板支撐', 'Plank', '雙肘撐地，身體呈一直線，保持核心穩定。', 'https://www.youtube.com/watch?v=pSHjTRCQxIw', 60, ARRAY['core'], ARRAY['endurance', 'strength'], 'beginner', 9, ARRAY[]::TEXT[], true),
  ('波比跳', 'Burpee', '站立→深蹲→伏地挺身→跳躍，全身性高強度動作。', 'https://www.youtube.com/watch?v=dZgVxmf6jkA', 60, ARRAY['full_body'], ARRAY['endurance', 'fat_loss'], 'advanced', 10, ARRAY[]::TEXT[], true),
  ('弓箭步', 'Lunge', '單腿向前跨步，下蹲至大腿與地面平行。', 'https://www.youtube.com/watch?v=QOVaHwm-Q6U', 40, ARRAY['legs', 'glutes'], ARRAY['strength', 'muscle_gain'], 'intermediate', 7, ARRAY[]::TEXT[], true);
```

### 5.4 取得 Supabase API 金鑰

1. 在 Supabase Dashboard 左側選單點擊「Settings」→「API」
2. 複製以下兩個金鑰：
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5.5 設定環境變數

在 `virtual_coach_app_frontend/` 目錄下建立 `.env` 檔案：

```bash
# .env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ 重要**: 將 `.env` 加入 `.gitignore`（避免洩露 API 金鑰）

```bash
# .gitignore
.env
```

---

## 步驟 6: 生成 Supabase TypeScript 類型

```powershell
# 安裝 Supabase CLI
npm install -g supabase

# 登入 Supabase
supabase login

# 生成 TypeScript 類型定義
supabase gen types typescript --project-id <your-project-ref> > src/types/supabase.ts
```

**範例輸出** (`src/types/supabase.ts`):

```typescript
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

## 步驟 7: 重命名檔案為 TypeScript

```powershell
# 將 .jsx 檔案重命名為 .tsx
Rename-Item -Path src\App.jsx -NewName App.tsx
Rename-Item -Path src\main.jsx -NewName main.tsx

# 將 vite.config.js 重命名為 vite.config.ts
Rename-Item -Path vite.config.js -NewName vite.config.ts
```

編輯 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

---

## 步驟 8: 啟動開發伺服器

```powershell
# 啟動 Vite 開發伺服器
npm run dev
```

**預期輸出：**

```
  VITE v7.2.2  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

開啟瀏覽器訪問 `http://localhost:5173/`，應該會看到 React + Vite 預設頁面。

---

## 步驟 9: 測試 Supabase 連線

### 9.1 建立 Supabase Client

```typescript
// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('缺少 Supabase 環境變數');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
```

### 9.2 測試查詢動作資料

編輯 `src/App.tsx`：

```typescript
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import './App.css';

function App() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        setExercises(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">虛擬健身教練</h1>
      <h2 className="text-xl mb-4">動作資料庫 ({exercises.length} 筆)</h2>
      <ul className="space-y-2">
        {exercises.map((ex) => (
          <li key={ex.id} className="p-4 border rounded">
            <strong>{ex.name}</strong> ({ex.name_en}) - {ex.duration_seconds} 秒
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

**預期結果**: 頁面應顯示「動作資料庫 (5 筆)」並列出測試資料。

---

## 步驟 10: 執行測試

### 10.1 設定 Vitest

編輯 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})
```

### 10.2 建立測試設定檔

```typescript
// src/tests/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### 10.3 執行測試

```powershell
# 執行測試
npm test

# 執行測試並顯示覆蓋率
npm run test:coverage
```

---

## 專案結構總覽

```
virtual-coach-app/
├── .specify/                      # Speckit 配置檔案
│   ├── memory/
│   │   └── constitution.md        # 專案治理文件
│   └── scripts/
│       └── powershell/            # PowerShell 腳本
├── specs/                         # 功能規格文件
│   └── 001-virtual-coach-mvp/
│       ├── spec.md                # 功能規格
│       ├── plan.md                # 實作計畫
│       ├── research.md            # 技術研究決策
│       ├── data-model.md          # 資料模型
│       ├── contracts/
│       │   └── supabase-api.md    # API 合約
│       └── quickstart.md          # 本文件
├── virtual_coach_app_frontend/    # React 前端專案
│   ├── public/                    # 靜態資源
│   ├── src/
│   │   ├── components/            # React 組件
│   │   │   ├── common/            # 共用組件
│   │   │   ├── preferences/       # 偏好設定組件
│   │   │   ├── workout/           # 訓練計畫組件
│   │   │   └── player/            # 播放器組件
│   │   ├── services/              # API 服務層
│   │   │   ├── supabaseClient.ts  # Supabase 客戶端
│   │   │   ├── exerciseService.ts # 動作查詢服務
│   │   │   └── workoutGenerator.ts# 訓練計畫生成器
│   │   ├── hooks/                 # Custom Hooks
│   │   │   ├── useExercises.ts    # 動作資料 Hook
│   │   │   ├── useWorkout.ts      # 訓練計畫 Hook
│   │   │   └── usePlayer.ts       # 播放器 Hook
│   │   ├── contexts/              # React Context
│   │   │   └── WorkoutContext.tsx # 訓練狀態 Context
│   │   ├── types/                 # TypeScript 類型定義
│   │   │   ├── supabase.ts        # Supabase 自動生成類型
│   │   │   └── dataModel.ts       # 自定義資料模型
│   │   ├── utils/                 # 工具函式
│   │   │   └── errorHandler.ts    # 錯誤處理
│   │   ├── tests/                 # 測試檔案
│   │   │   └── setup.ts           # 測試設定
│   │   ├── App.tsx                # 主應用組件
│   │   ├── main.tsx               # 應用入口
│   │   └── index.css              # Tailwind CSS
│   ├── .env                       # 環境變數（不提交至 Git）
│   ├── .gitignore                 # Git 忽略清單
│   ├── package.json               # 依賴套件清單
│   ├── vite.config.ts             # Vite 配置
│   ├── tsconfig.json              # TypeScript 配置
│   ├── tailwind.config.js         # Tailwind CSS 配置
│   └── eslint.config.js           # ESLint 配置
├── PRD.md                         # 產品需求文件
└── TECH.md                        # 技術架構決策
```

---

## 常見問題 (FAQ)

### Q1: `npm install` 失敗怎麼辦？

**解決方法：**
```powershell
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 與 package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 重新安裝
npm install
```

### Q2: 為什麼 Tailwind CSS 樣式沒有生效？

**可能原因：**
1. `index.css` 未引入 Tailwind directives
2. `tailwind.config.js` 的 `content` 路徑設定錯誤

**檢查方法：**
```powershell
# 確認 index.css 開頭是否有以下內容
Get-Content src\index.css -TotalCount 3
# 應顯示: @tailwind base; @tailwind components; @tailwind utilities;
```

### Q3: Supabase 查詢返回空陣列

**可能原因：**
1. `.env` 檔案中的 API 金鑰錯誤
2. RLS (Row-Level Security) 政策未正確設定
3. `exercises` 資料表無資料

**檢查方法：**
```powershell
# 1. 確認環境變數
Get-Content .env

# 2. 在 Supabase Dashboard 的 SQL Editor 執行
SELECT * FROM exercises WHERE is_active = true;
```

### Q4: TypeScript 編譯錯誤

**解決方法：**
```powershell
# 重新生成 Supabase 類型定義
supabase gen types typescript --project-id <your-project-ref> > src/types/supabase.ts

# 重新啟動 Vite 開發伺服器
npm run dev
```

---

## 下一步 (Next Steps)

1. ✅ **本地開發環境已完成設定**
2. ⏭️ **實作 PreferenceForm 組件**（對應 FR-001）
3. ⏭️ **實作 WorkoutGenerator 服務**（對應 FR-005）
4. ⏭️ **實作 VideoPlayer 組件**（對應 FR-006）
5. ⏭️ **撰寫單元測試**（達成 60% 覆蓋率）

---

## 相關文件

- [Constitution](../../.specify/memory/constitution.md) - 專案治理原則
- [Feature Spec](./spec.md) - 功能規格文件
- [Research Decisions](./research.md) - 技術研究決策
- [Data Model](./data-model.md) - 資料庫設計
- [API Contracts](./contracts/supabase-api.md) - Supabase API 使用規範

---

**Approved By**: GitHub Copilot  
**Date**: 2025-11-14
