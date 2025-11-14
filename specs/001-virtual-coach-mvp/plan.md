# Implementation Plan: 虛擬健身教練互動應用 MVP

**Branch**: `001-virtual-coach-mvp` | **Date**: 2025-11-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-virtual-coach-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

打造一個無須登入的網頁應用，學員輸入個人偏好（運動目標、器材、時長、難度）後，系統立即生成客製化訓練課表，並透過全螢幕訓練播放器引導學員完成訓練。管理員透過 Supabase CMS 維護運動資料庫。

**技術方案**: 採用 React + Vite 建構前端 SPA，部署至 Render Static Site（零成本）。後端使用 Supabase 作為 BaaS 平台，提供 PostgreSQL 資料庫、自動 REST API、以及圖形化 CMS 介面。課表生成採用加權優先順序演算法，示範影片使用外部平台（YouTube/Vimeo）嵌入連結。

## Technical Context

**Language/Version**: JavaScript ES2022+ (React 19.2.0)  
**Primary Dependencies**: 
- Frontend: React 19.2.0, Vite 7.2.2, @supabase/supabase-js 2.81.1
- Development: ESLint 9.39.1, Vitest (for testing)
- UI: CSS Modules or Tailwind CSS (待選擇)

**Storage**: Supabase PostgreSQL (managed, free tier)  
**Testing**: Vitest + React Testing Library (component tests), Playwright (E2E tests, 選填)  
**Target Platform**: Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Web application (frontend SPA + BaaS backend)  
**Performance Goals**: 
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Bundle size < 250KB (gzipped)
- API response time P95 < 200ms

**Constraints**: 
- 零金錢成本（Render Static Site 免費方案 + Supabase 免費方案）
- 無須登入（無使用者認證系統）
- 學生團隊開發（低技術門檻、易維護）
- 依賴外部影片平台（YouTube/Vimeo）可用性

**Scale/Scope**: 
- 預期 MVP 階段 < 100 concurrent users
- 運動資料庫初始規模 30-50 筆
- 單一功能分支（001-virtual-coach-mvp）包含四大 Epic
- 前端單頁應用約 20-30 個組件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. 程式碼品質標準 (Code Quality Standards)
- ✅ **模組化設計**: React 組件化架構天然支援模組化，每個組件職責單一
- ✅ **程式碼可讀性**: 已配置 ESLint 9.39.1，將強制執行程式碼規範
- ⚠️ **型別安全**: 目前使用 JavaScript，建議升級至 TypeScript 以符合準則（Phase 0 研究決策）
- ✅ **錯誤處理**: 規格中明確要求所有 API 呼叫和非同步操作包含錯誤處理

### II. 測試標準 (Testing Standards)
- ✅ **組件測試**: 計畫使用 Vitest + React Testing Library 測試所有 React 組件
- ✅ **整合測試**: 關鍵流程（課表生成、訓練播放）將包含 E2E 測試
- ✅ **測試覆蓋率目標**: 核心業務邏輯目標 70%+ 覆蓋率
- ✅ **測試優先原則**: 關鍵功能（課表生成演算法）將採用 TDD 方式開發

### III. 使用者體驗一致性 (User Experience Consistency)
- ✅ **設計系統**: 將建立 design tokens (CSS variables) 統一顏色、字型、間距
- ✅ **響應式設計**: 採用 mobile-first approach，支援手機/平板/桌面
- ✅ **無障礙設計**: 遵循 WCAG 2.1 AA 標準（鍵盤導航、aria 標籤、顏色對比）
- ✅ **載入與回饋**: 所有非同步操作使用 Loading Spinner，操作結果提供 Toast 通知

### IV. 效能要求 (Performance Requirements)
- ✅ **FCP < 1.5s**: Vite code splitting + lazy loading 優化
- ✅ **LCP < 2.5s**: 外部影片平台 CDN 加速，減少首屏載入資源
- ✅ **TTI < 3.5s**: 最小化 JavaScript bundle，優先載入核心功能
- ✅ **Bundle size < 250KB**: 使用 tree shaking 和 dynamic imports
- ✅ **API response time < 200ms**: Supabase 自動索引優化查詢效能
- ✅ **效能監控**: 使用 Lighthouse CI 持續監控效能指標

### 文件與註解規範
- ✅ **繁體中文為主**: 所有文件、註解、commit message 以繁體中文撰寫
- ✅ **技術術語輔助英文**: 使用「中文 (English)」格式

### 開發流程
- ✅ **分支策略**: 使用 `001-virtual-coach-mvp` 功能分支
- ✅ **程式碼審查**: 所有變更需經過 PR review
- ✅ **Commit 規範**: 遵循 Conventional Commits 格式
- ✅ **CI/CD**: Render 自動部署，ESLint + 測試作為 PR gate

**總結**: 所有準則檢查通過 ✅，唯一建議項為升級至 TypeScript（將在 Phase 0 研究決策）。無違規項需要特殊豁免。

## Project Structure

### Documentation (this feature)

```text
specs/001-virtual-coach-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── supabase-api.md  # Supabase queries and data access patterns
├── checklists/
│   └── requirements.md  # Quality checklist (already exists)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
virtual_coach_app_frontend/
├── src/
│   ├── components/           # React components
│   │   ├── common/           # Shared components (Button, Loading, Toast)
│   │   ├── preferences/      # Epic 2: 偏好設定組件
│   │   ├── workout/          # Epic 3: 課表顯示組件
│   │   └── player/           # Epic 4: 訓練播放器組件
│   ├── services/             # Business logic & API calls
│   │   ├── supabaseClient.js # Supabase initialization
│   │   ├── exerciseService.js # Exercise data fetching
│   │   └── workoutGenerator.js # Workout generation algorithm
│   ├── hooks/                # Custom React hooks
│   │   ├── useExercises.js   # Fetch and cache exercises
│   │   ├── useWorkout.js     # Workout state management
│   │   └── usePlayer.js      # Player state and timer logic
│   ├── utils/                # Utility functions
│   │   ├── validators.js     # Input validation
│   │   └── formatters.js     # Data formatting
│   ├── styles/               # CSS modules or global styles
│   │   ├── variables.css     # Design tokens (colors, fonts, spacing)
│   │   └── global.css        # Global styles and resets
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── assets/               # Static assets (icons, images)
├── tests/
│   ├── unit/                 # Component unit tests (Vitest)
│   ├── integration/          # Integration tests (Vitest)
│   └── e2e/                  # End-to-end tests (Playwright, optional)
├── public/                   # Public assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration (already exists)
├── package.json              # Dependencies (already exists)
└── README.md                 # Project documentation

package.json                  # Root package for Supabase client (already exists)
PRD.md                        # Product requirements (already exists)
TECH.md                       # Technical architecture (already exists)
.specify/                     # Spec toolkit configuration
.github/                      # GitHub workflows (optional CI/CD)
```

**Structure Decision**: 

此專案採用 **Web Application** 結構（Option 2 變體）。由於後端完全由 Supabase BaaS 託管，我們不需要建立獨立的 backend/ 目錄。所有程式碼集中在 `virtual_coach_app_frontend/` 目錄（已存在），遵循 React + Vite 標準結構。

關鍵設計決策：
1. **組件按功能分組**: `components/` 下按 Epic 組織（preferences, workout, player），提高可維護性
2. **服務層分離**: `services/` 目錄封裝所有 Supabase API 呼叫和業務邏輯，保持組件純粹
3. **自定義 Hooks**: `hooks/` 目錄集中管理狀態邏輯，便於測試和重用
4. **設計系統基礎**: `styles/variables.css` 使用 CSS custom properties 建立 design tokens

此結構符合 Constitution 的模組化設計原則，並為未來可能的 React Native 遷移預留彈性（services 和 hooks 可直接共享）。

## Complexity Tracking

> **所有 Constitution Check 項目皆已通過，無需特殊豁免或複雜度豁免。**

本專案架構簡潔，符合 MVP 原則：
- 單一功能分支（001-virtual-coach-mvp）
- 無自建後端（使用 Supabase BaaS）
- 無複雜的狀態管理（React hooks 已足夠）
- 直接的組件架構（無需額外抽象層）

**TypeScript 決策**: 將在 Phase 0 研究中評估，若升級成本低且團隊熟悉度高則採用，否則保持 JavaScript + PropTypes 以降低學習曲線。
