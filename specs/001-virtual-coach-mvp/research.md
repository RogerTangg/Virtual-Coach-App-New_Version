# Research & Design Decisions: 虛擬健身教練互動應用 MVP

**Branch**: 001-virtual-coach-mvp | **Date**: 2025-11-14

---

## Research Questions

本文檔記錄實作前需研究的技術決策，每項決策需評估「如何最小化 MVP 複雜度」與「如何滿足 Constitution 要求」的平衡。

---

## 1. TypeScript vs JavaScript

### Question
是否從 JavaScript 升級為 TypeScript？目前專案使用 React 19.2.0 + Vite 7.2.2，專案結構已建立但尚未寫入大量業務邏輯。

### Considerations

**升級 TypeScript 的優勢：**
- ✅ 符合 Constitution「I. 程式碼品質標準」第 2 點（型別檢查）
- ✅ 減少 runtime 錯誤，提升維護性
- ✅ Vite 原生支援 TypeScript（零配置成本）
- ✅ Supabase SDK 已提供完整 TypeScript 類型定義
- ✅ 編輯器智能提示增強，開發效率提升

**保持 JavaScript 的理由：**
- ⚠️ 團隊若不熟悉 TypeScript 會增加學習曲線
- ⚠️ MVP 階段快速迭代，型別定義可能頻繁調整
- ⚠️ PropTypes 已能提供基本的 runtime 型別檢查

### Decision Criteria
- **If** 團隊成員已熟悉 TypeScript 或願意快速學習
- **And** 專案預計持續維護（非一次性專案）
- **Then** 採用 TypeScript

### Recommendation
**✅ 採用 TypeScript**

**理由：**
1. **低升級成本**: 專案處於早期階段，轉換成本低
2. **Vite 零配置**: `vite.config.js` → `vite.config.ts` 即可，無需複雜配置
3. **Constitution 契合度高**: 直接滿足程式碼品質標準第 2 點
4. **Supabase 類型生成**: 可自動產生 Database Schema 對應的 TypeScript 類型
5. **長期收益**: 健身教練應用涉及運動資料、時間計算等邏輯，型別安全能有效防範錯誤

**實施步驟：**
```powershell
# 1. 安裝 TypeScript 相關依賴
npm install --save-dev typescript @types/react @types/react-dom

# 2. 生成 tsconfig.json
npx tsc --init --jsx react-jsx --target ES2022 --module ESNext --moduleResolution bundler --strict

# 3. 重命名檔案
# App.jsx → App.tsx, main.jsx → main.tsx

# 4. 生成 Supabase 類型定義（連接 Supabase 專案後）
npx supabase gen types typescript --project-id <project-ref> > src/types/supabase.ts
```

---

## 2. Testing Framework Details

### Question
Constitution 要求「II. 測試標準」包含單元測試（>60% 覆蓋率）、整合測試（關鍵流程）、E2E 測試（可選），需確定具體工具與策略。

### Current Stack
- **Unit Testing**: Vitest + React Testing Library（已在 TECH.md 決策）
- **E2E Testing**: Playwright（可選，TECH.md 標註）

### Considerations

**單元測試策略：**
- ✅ **React Testing Library**: 專注於用戶行為測試而非實作細節
- ✅ **Vitest**: 與 Vite 深度整合，速度快
- ⚠️ 需涵蓋的關鍵組件：
  - `WorkoutGenerator` (演算法邏輯)
  - `VideoPlayer` (播放狀態管理)
  - `PreferenceForm` (表單驗證)
  - `ExerciseCard` (資料顯示)

**整合測試策略：**
- ✅ 使用 `@supabase/supabase-js` mock 資料進行整合測試
- ✅ 測試關鍵用戶流程：
  1. 選擇偏好 → 產生訓練計畫（FR-001 → FR-005）
  2. 啟動訓練 → 播放影片 → 計時管理（FR-006 → FR-011）
  3. 完成訓練 → 重新選擇（FR-012 → FR-014）

**E2E 測試策略：**
- ⚠️ **MVP 階段不強制要求**（Constitution 標註可選）
- ✅ **如需實施**: 使用 Playwright 測試完整用戶旅程
  - 涵蓋 Render 部署後的真實環境
  - 測試跨瀏覽器相容性（Chrome, Firefox, Safari）

### Decision

**單元測試：**
- 使用 **Vitest + React Testing Library**
- 目標覆蓋率 **60%+**（Constitution 最低要求）
- 優先覆蓋：Services (`workoutGenerator.js`, `exerciseService.js`) + Hooks (`useWorkout`, `usePlayer`)

**整合測試：**
- 使用 **Vitest + MSW (Mock Service Worker)** 模擬 Supabase API
- 測試 3 條關鍵用戶流程（對應 Acceptance Scenarios）

**E2E 測試：**
- **MVP 階段暫不實施**（符合 Constitution 可選原則）
- 上線後若發現跨瀏覽器問題再補充

**測試命令：**
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 3. UI Styling Approach

### Question
應使用 **CSS Modules**、**Tailwind CSS** 或 **Styled-components**？需考慮 MVP 快速開發與 Constitution 的 UX 一致性要求。

### Considerations

**選項 A: CSS Modules** (Vite 原生支援)
- ✅ 零配置，Vite 自動支援 `.module.css` 檔案
- ✅ 作用域隔離（避免 class 衝突）
- ⚠️ 需手動維護一致性（顏色、間距、字體）
- ⚠️ 響應式設計需手寫 media queries

**選項 B: Tailwind CSS**
- ✅ Utility-first 快速開發
- ✅ 內建設計系統（`tailwind.config.js` 統一定義顏色、間距）
- ✅ 響應式設計簡便（`sm:`, `md:`, `lg:` 前綴）
- ⚠️ 需額外配置（安裝依賴、PostCSS 設定）
- ⚠️ 學習曲線（團隊需熟悉 utility classes）

**選項 C: Styled-components**
- ✅ CSS-in-JS，動態樣式簡便
- ⚠️ 增加 bundle size（~15KB gzipped）
- ⚠️ 效能開銷（runtime 生成樣式）

### Decision Criteria
- **Constitution III. UX 一致性**: 要求元件間視覺元素一致（顏色、字體、間距）
- **Constitution IV. 效能要求**: Bundle size < 250KB gzipped
- **MVP 原則**: 最小化配置成本，快速開發

### Recommendation
**✅ 採用 Tailwind CSS**

**理由：**
1. **UX 一致性**: `tailwind.config.js` 統一定義 Design Tokens（顏色、字體、間距），符合 Constitution III
2. **快速開發**: Utility classes 減少手寫 CSS，加速 MVP 迭代
3. **響應式友好**: 健身教練應用需支援手機/平板（多數用戶場景），Tailwind 響應式前綴極大簡化開發
4. **效能可控**: 
   - 使用 PurgeCSS 自動移除未使用的樣式
   - Production build 通常 < 10KB（遠低於 250KB 限制）
5. **團隊學習成本低**: 官方文檔清晰，VS Code 有 Tailwind Intellisense 插件

**實施步驟：**
```powershell
# 1. 安裝 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 2. 配置 tailwind.config.js
# content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
# theme: { extend: { colors: {...}, fontFamily: {...} } }

# 3. 引入 Tailwind directives (src/index.css)
# @tailwind base; @tailwind components; @tailwind utilities;
```

**Design Tokens 定義（初步）：**
```javascript
// tailwind.config.js
module.exports = {
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
}
```

---

## 4. Video Player Implementation

### Question
使用 **原生 HTML5 `<video>` + React Hooks** 或 **第三方 Player 庫**（如 video.js, Plyr）？

### Considerations

**選項 A: 原生 HTML5 `<video>` + Custom Controls**
- ✅ 零依賴，bundle size 最小
- ✅ 完全自訂控制項（符合 UI 設計）
- ⚠️ 需手動實現計時器邏輯、播放狀態管理
- ⚠️ 跨瀏覽器相容性需測試（Safari 對 HLS 支援）

**選項 B: 第三方庫（Plyr）**
- ✅ 開箱即用的播放控制項
- ✅ 自帶進度條、音量控制、全螢幕
- ⚠️ 增加依賴（~20KB gzipped）
- ⚠️ 自訂樣式需覆寫 CSS

### Decision
**✅ 原生 HTML5 `<video>` + React Hooks**

**理由：**
1. **MVP 功能簡單**: FR-007 僅需播放/暫停/進度顯示，無需複雜功能
2. **效能優先**: 避免額外依賴，符合 Constitution IV（Bundle size < 250KB）
3. **自訂性高**: 計時器邏輯與播放狀態需深度整合（`usePlayer` hook）
4. **外部影片來源**: YouTube/Vimeo 已提供播放器，本專案僅需處理 iframe 嵌入

**實施策略：**
```jsx
// src/hooks/usePlayer.js
import { useRef, useState, useEffect } from 'react';

export const usePlayer = (videoUrl) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 播放/暫停控制
  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // 監聽時間更新
  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video?.addEventListener('timeupdate', updateTime);
    video?.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      video?.removeEventListener('timeupdate', updateTime);
      video?.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  return { videoRef, isPlaying, currentTime, duration, togglePlay };
};
```

---

## 5. State Management Strategy

### Question
是否需要引入 **Redux / Zustand / Jotai** 等全域狀態管理庫？

### Considerations

**目前需管理的狀態：**
- 用戶偏好（`preferences`）：選擇後傳遞給訓練計畫生成器
- 訓練計畫（`workoutPlan`）：生成後傳遞給播放器
- 播放狀態（`playerState`）：當前動作、計時器、休息狀態

**React Context + Hooks 足夠的情況：**
- ✅ 狀態傳遞深度 < 3 層（Preferences → Workout → Player）
- ✅ 狀態更新頻率低（用戶切換動作時才更新）
- ✅ 無複雜的跨組件共享邏輯

**需要全域狀態管理的情況：**
- ⚠️ 狀態傳遞超過 3 層（出現 props drilling）
- ⚠️ 多個組件需同步更新同一狀態
- ⚠️ 需要時間旅行調試（Redux DevTools）

### Decision
**✅ 僅使用 React Context + Custom Hooks**

**理由：**
1. **MVP 狀態簡單**: 3 個主要狀態（偏好、計畫、播放）可用 Context 封裝
2. **避免過度工程**: Redux/Zustand 引入額外學習成本與配置複雜度
3. **符合 Constitution I**: 避免不必要的依賴
4. **可擴展**: 若未來狀態複雜度增加，可無縫遷移至 Zustand（零配置迭代）

**實施策略：**
```jsx
// src/contexts/WorkoutContext.jsx
import { createContext, useContext, useState } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [playerState, setPlayerState] = useState({
    currentExerciseIndex: 0,
    isResting: false,
    elapsedTime: 0,
  });

  return (
    <WorkoutContext.Provider value={{
      preferences, setPreferences,
      workoutPlan, setWorkoutPlan,
      playerState, setPlayerState,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);
```

---

## Research Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **語言** | TypeScript ✅ | 低升級成本 + Constitution 契合度高 + Supabase 類型生成 |
| **單元測試** | Vitest + React Testing Library ✅ | Vite 整合 + 60% 覆蓋率目標 |
| **整合測試** | Vitest + MSW ✅ | 模擬 Supabase API + 3 條關鍵流程 |
| **E2E 測試** | 暫不實施 ⏳ | MVP 階段可選（Constitution 允許） |
| **UI 樣式** | Tailwind CSS ✅ | UX 一致性 + 快速開發 + 響應式友好 |
| **播放器** | 原生 HTML5 + Hooks ✅ | 零依賴 + 自訂性高 + 效能最佳 |
| **狀態管理** | React Context + Hooks ✅ | MVP 狀態簡單 + 避免過度工程 |

---

## Next Steps

1. ✅ **Phase 0 完成**: 所有技術決策已明確
2. ⏭️ **Phase 1**: 產生 `data-model.md`（基於 TypeScript 介面定義）
3. ⏭️ **Phase 1**: 產生 `contracts/supabase-api.md`（Supabase 查詢模式）
4. ⏭️ **Phase 1**: 產生 `quickstart.md`（本地開發環境設定）
5. ⏭️ **Agent Context Update**: 更新 AI agent 情境（TypeScript + Tailwind CSS）

---

**Approved By**: GitHub Copilot  
**Date**: 2025-11-14
