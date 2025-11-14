# Tasks: 虛擬健身教練互動應用 MVP

**Branch**: `001-virtual-coach-mvp` | **Generated**: 2025-11-14  
**Input**: Design documents from `/specs/001-virtual-coach-mvp/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: 本專案包含測試任務，因 Constitution 要求 60%+ 覆蓋率

**Organization**: 任務按 User Story 組織，每個 Story 可獨立實作與測試

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無相依性）
- **[Story]**: 所屬 User Story（US1, US2, US3, US4）
- 描述包含完整檔案路徑

## Path Conventions

專案採用 Web Application 架構：
- 前端：`virtual_coach_app_frontend/src/`
- 測試：`virtual_coach_app_frontend/tests/`
- 配置：`virtual_coach_app_frontend/` 根目錄

---

## Phase 1: Setup (專案初始化)

**Purpose**: 建立專案基礎結構與開發環境

- [x] T001 依照 quickstart.md 步驟 1-2 安裝 Node.js 依賴套件 (npm install)
- [x] T002 依照 research.md 決策，安裝 TypeScript 相關套件 (typescript, @types/react, @types/react-dom)
- [x] T003 [P] 生成 tsconfig.json 與 tsconfig.node.json 配置檔（參考 quickstart.md 步驟 3）
- [x] T004 [P] 安裝 Tailwind CSS 套件 (tailwindcss, postcss, autoprefixer)
- [x] T005 建立 tailwind.config.js 配置檔，設定 Design Tokens（顏色、字型）（參考 research.md 決策）
- [x] T006 [P] 更新 virtual_coach_app_frontend/src/index.css 引入 Tailwind directives
- [x] T007 [P] 安裝測試相關套件 (vitest, @testing-library/react, @testing-library/jest-dom, @vitest/ui, msw)
- [x] T008 建立 virtual_coach_app_frontend/vite.config.ts 並配置 Vitest 測試環境
- [x] T009 [P] 建立 virtual_coach_app_frontend/src/tests/setup.ts 測試初始化檔案
- [x] T010 重命名 App.jsx → App.tsx, main.jsx → main.tsx（TypeScript 遷移）
- [x] T011 [P] 更新 vite.config.js → vite.config.ts

---

## Phase 2: Foundational (基礎建設 - 阻塞所有 User Story)

**Purpose**: 核心基礎設施，所有 User Story 實作前必須完成

**⚠️ 重要**: 此階段完成前，無法開始任何 User Story 實作

- [x] T012 依照 quickstart.md 步驟 5 建立 Supabase 專案
- [x] T013 在 Supabase Dashboard 執行 database/schema.sql 建立 exercises 資料表
- [x] T014 [P] 在 Supabase Dashboard 插入測試資料（5 筆運動資料已包含在 schema.sql）
- [x] T015 建立 virtual_coach_app_frontend/.env 檔案，設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY
- [x] T016 [P] 安裝 Supabase 客戶端套件 (@supabase/supabase-js)
- [x] T017 使用 Supabase CLI 生成 TypeScript 類型定義至 virtual_coach_app_frontend/src/types/supabase.ts (跳過：已有手動型別定義)
- [x] T018 [P] 建立 virtual_coach_app_frontend/src/types/dataModel.ts，定義 Exercise, UserPreferences, WorkoutPlan, WorkoutExercise 介面（參考 data-model.md）
- [x] T019 [P] 建立 virtual_coach_app_frontend/src/types/enums.ts，定義 TargetMuscle, TrainingGoal, DifficultyLevel 列舉
- [x] T020 建立 virtual_coach_app_frontend/src/services/supabaseClient.ts，初始化 Supabase 客戶端（參考 contracts/supabase-api.md）
- [x] T021 建立 virtual_coach_app_frontend/src/utils/errorHandler.ts，實作 handleSupabaseError 統一錯誤處理器
- [x] T022 [P] 建立 virtual_coach_app_frontend/src/styles/variables.css，定義 CSS Design Tokens（顏色、字型、間距）
- [x] T023 測試 Supabase 連線：在 App.tsx 中呼叫 supabase.from('exercises').select('*') 驗證資料讀取成功

**Checkpoint**: 基礎建設完成 - User Story 實作現在可以開始

---

## Phase 3: User Story 1 - 學員設定偏好並生成課表 (Priority: P1) 🎯 MVP

**Goal**: 學員選擇訓練偏好（目標、器材、時長、難度）後，系統生成客製化訓練課表

**Independent Test**: 開啟應用 → 選擇偏好（增肌、徒手、30分鐘、初階）→ 點擊生成 → 驗證課表包含 3+ 個符合標籤的運動且總時長接近 30 分鐘

### Tests for User Story 1

> **NOTE: 先撰寫測試，確認測試失敗後再實作**

- [x] T024 [P] [US1] 建立 virtual_coach_app_frontend/tests/integration/workoutGeneration.test.ts，測試課表生成演算法（加權優先順序、時長匹配、標籤篩選）
- [x] T025 [P] [US1] 建立 virtual_coach_app_frontend/tests/unit/exerciseService.test.ts，使用 MSW mock Supabase API 測試動作資料查詢
- [x] T026 [P] [US1] 建立 virtual_coach_app_frontend/tests/unit/PreferenceForm.test.tsx，測試偏好表單驗證與提交

### Implementation for User Story 1

- [x] T027 [P] [US1] 建立 virtual_coach_app_frontend/src/services/exerciseService.ts，實作 fetchActiveExercises() 函式（參考 contracts/supabase-api.md）
- [x] T028 [P] [US1] 建立 virtual_coach_app_frontend/src/services/workoutGenerator.ts，實作 generateWorkoutPlan() 演算法（參考 data-model.md 加權規則）
- [x] T029 [P] [US1] 建立 virtual_coach_app_frontend/src/utils/validators.ts，實作偏好輸入驗證函式
- [x] T030 [US1] 建立 virtual_coach_app_frontend/src/hooks/useExercises.ts，實作快取動作資料的 Custom Hook（參考 contracts/supabase-api.md 快取策略）
- [x] T031 [US1] 建立 virtual_coach_app_frontend/src/hooks/useWorkout.ts，管理訓練計畫狀態
- [x] T032 [P] [US1] 建立 virtual_coach_app_frontend/src/contexts/WorkoutContext.tsx，實作 WorkoutProvider 與 useWorkoutContext（參考 research.md 狀態管理決策）
- [x] T033 [P] [US1] 建立 virtual_coach_app_frontend/src/components/common/Button.tsx，實作通用按鈕組件（Tailwind CSS 樣式）
- [x] T034 [P] [US1] 建立 virtual_coach_app_frontend/src/components/common/Loading.tsx，實作載入動畫組件
- [x] T035 [P] [US1] 建立 virtual_coach_app_frontend/src/components/common/Toast.tsx，實作提示訊息組件
- [x] T036 [US1] 建立 virtual_coach_app_frontend/src/components/preferences/PreferenceForm.tsx，實作偏好設定表單（FR-006 到 FR-012）
- [x] T037 [US1] 建立 virtual_coach_app_frontend/src/components/workout/WorkoutCard.tsx，實作課表預覽卡片組件
- [x] T038 [US1] 建立 virtual_coach_app_frontend/src/components/workout/WorkoutList.tsx，實作課表列表組件
- [x] T039 [US1] 在 virtual_coach_app_frontend/src/App.tsx 整合 PreferenceForm 與 WorkoutList，實現完整用戶流程
- [x] T040 [US1] 加入錯誤處理：無符合動作時顯示友善訊息（FR-017）- 已在 workoutGenerator 中實作
- [x] T041 [US1] 加入警告處理：符合動作 < 3 個時顯示警告（FR-018）- 已在 workoutGenerator 中實作
- [x] T042 [US1] 加入載入狀態：課表生成時顯示 Loading Spinner（FR-030）- 已在 App.tsx 中實作
- [ ] T043 [US1] 驗證課表生成時間 < 3 秒（SC-002）
- [ ] T044 [US1] 驗證課表總時長誤差 ±10%（SC-003）

**Checkpoint**: User Story 1 完整可用 - 學員可設定偏好並獲得客製化課表

---

## Phase 4: User Story 2 - 學員使用訓練播放器完成訓練 (Priority: P2)

**Goal**: 學員進入全螢幕播放器，系統依序播放運動影片、顯示倒數計時、自動切換至下一個運動

**Independent Test**: 生成 3 個運動的課表 → 點擊「開始訓練」→ 驗證全螢幕顯示、依序播放、倒數計時、自動切換、完成畫面

### Tests for User Story 2

- [x] T045 [P] [US2] 建立 virtual_coach_app_frontend/tests/integration/playerExecution.test.tsx，測試播放器完整執行流程（播放、暫停、跳過、退出）
- [x] T046 [P] [US2] 建立 virtual_coach_app_frontend/tests/unit/usePlayer.test.ts，測試播放器狀態管理 Hook

### Implementation for User Story 2

- [x] T047 [P] [US2] 建立 virtual_coach_app_frontend/src/hooks/usePlayer.ts，實作播放器狀態與計時器邏輯（參考 research.md HTML5 決策）
- [x] T048 [P] [US2] 建立 virtual_coach_app_frontend/src/components/player/VideoPlayer.tsx，實作影片播放組件（嵌入 YouTube iframe）
- [x] T049 [P] [US2] 建立 virtual_coach_app_frontend/src/components/player/Timer.tsx，實作倒數計時器組件（視覺化進度條）
- [x] T050 [P] [US2] 建立 virtual_coach_app_frontend/src/components/player/PlayerControls.tsx，實作播放控制按鈕（播放/暫停、跳過、退出）
- [x] T051 [US2] 建立 virtual_coach_app_frontend/src/components/player/TrainingPlayer.tsx，整合 VideoPlayer、Timer、PlayerControls 成全螢幕播放器（FR-019 到 FR-026）
- [x] T052 [US2] 在 virtual_coach_app_frontend/src/App.tsx 加入路由邏輯，點擊「開始訓練」進入 TrainingPlayer
- [x] T053 [US2] 實作播放器自動切換邏輯：倒數計時歸零時切換至下一個運動（FR-021）- 已在 usePlayer.ts 實作
- [x] T054 [US2] 實作暫停/繼續功能（FR-022）- 已在 usePlayer.ts 和 TrainingPlayer.tsx 實作
- [x] T055 [US2] 實作跳過功能（FR-023）- 已在 usePlayer.ts 和 PlayerControls.tsx 實作
- [x] T056 [US2] 實作退出確認對話框（FR-024）- 已在 TrainingPlayer.tsx 實作
- [x] T057 [US2] 建立 virtual_coach_app_frontend/src/components/player/CompletionScreen.tsx，實作訓練完成畫面（FR-025）
- [x] T058 [US2] 加入鍵盤快捷鍵支援：空白鍵（暫停/繼續）、方向鍵（跳過/上一個）、ESC（退出）（FR-026）- 已在 TrainingPlayer.tsx 實作
- [x] T059 [US2] 加入錯誤處理：影片載入失敗時顯示提示訊息（Edge Case）- 已在 VideoPlayer.tsx 實作
- [ ] T060 [US2] 驗證倒數計時準確度 ±1 秒（SC-004）
- [ ] T061 [US2] 驗證運動項目切換時間 < 1 秒（SC-004）

**Checkpoint**: User Story 1 + 2 皆可獨立運作 - 學員可生成課表並完整執行訓練

---

## Phase 5: User Story 4 - 學員查看課表詳情 (Priority: P4)

**Goal**: 學員生成課表後，可在預覽頁面查看所有運動項目的完整資訊

**Independent Test**: 生成課表 → 在預覽頁面 → 驗證顯示所有運動的名稱、說明、時長、器材 → 確認有「開始訓練」和「重新生成」按鈕

**Note**: User Story 4 優先於 US3（CMS 管理），因 US4 直接提升學員體驗，US3 可由開發團隊手動管理

### Tests for User Story 4

- [x] T062 [P] [US4] 建立 virtual_coach_app_frontend/tests/unit/WorkoutDetail.test.tsx，測試課表詳情顯示組件

### Implementation for User Story 4

- [x] T063 [P] [US4] 建立 virtual_coach_app_frontend/src/components/workout/ExerciseCard.tsx，實作運動項目卡片（顯示名稱、說明、時長、器材）
- [x] T064 [US4] WorkoutList.tsx 已實作課表詳情頁面（FR-027 到 FR-030）
- [x] T065 [US4] 在 ExerciseCard.tsx 實作展開/收合功能：點擊運動項目顯示完整說明
- [x] T066 [US4] 在 WorkoutList.tsx 已有「開始訓練」按鈕，連結至 TrainingPlayer（US2）
- [x] T067 [US4] 在 WorkoutList.tsx 已有「重新生成」按鈕，返回 PreferenceForm（US1）
- [x] T068 [US4] App.tsx 已整合 WorkoutList 至路由流程
- [ ] T069 [US4] 驗證響應式設計：在手機、平板、桌面裝置測試顯示效果（FR-028）

**Checkpoint**: 學員體驗完整 - 可設定偏好、查看詳情、執行訓練

---

## Phase 6: User Story 3 - 管理員管理運動資料庫 (Priority: P3)

**Goal**: 管理員透過 Supabase Dashboard 管理運動資料（新增、編輯、刪除）

**Independent Test**: 登入 Supabase → 開啟 exercises 資料表 → 新增/編輯/刪除運動資料 → 驗證資料變更在前端應用中生效

**Note**: 此 User Story 主要為文檔與驗證任務，無需大量程式碼（Supabase Dashboard 已提供 CMS 功能）

### Implementation for User Story 3

- [X] T070 [P] [US3] 建立 virtual_coach_app_frontend/docs/cms-guide.md，撰寫管理員操作手冊（如何使用 Supabase Dashboard 管理動作資料）
- [ ] T071 [US3] 在 Supabase Dashboard 驗證 exercises 資料表的 RLS 政策（參考 contracts/supabase-api.md）
- [ ] T072 [US3] 在 Supabase Dashboard 測試新增運動資料（填寫所有必填欄位）
- [ ] T073 [US3] 在 Supabase Dashboard 測試編輯運動資料（修改 duration_seconds 或 priority_weight）
- [ ] T074 [US3] 在 Supabase Dashboard 測試軟刪除運動資料（設定 is_active = false）
- [ ] T075 [US3] 在前端驗證：新增/編輯/刪除的運動資料即時反映在課表生成結果中
- [ ] T076 [US3] 加入 Edge Case 處理：管理員刪除正在使用的運動時，播放器自動跳過（參考 spec.md Edge Cases）
- [ ] T077 [US3] 驗證管理員能在 5 分鐘內新增 10 筆運動資料（SC-007）

**Checkpoint**: 所有 User Stories 完成 - 應用功能完整

---

## Phase 7: Polish & Cross-Cutting Concerns (跨功能優化)

**Purpose**: 影響多個 User Story 的改進與最終優化

- [ ] T078 [P] 在所有組件加入 ARIA 標籤，確保無障礙設計（WCAG 2.1 AA 標準）
- [X] T079 [P] 建立 virtual_coach_app_frontend/docs/architecture.md，撰寫架構文件（組件關係圖、資料流程圖）
- [X] T080 [P] 建立 virtual_coach_app_frontend/README.md，撰寫專案說明與本地開發指南
- [ ] T081 執行 Lighthouse 效能測試，確認 FCP < 1.5s, LCP < 2.5s, TTI < 3.5s（SC-006）
- [X] T082 執行 npm run build，驗證 bundle size < 250KB gzipped（Constitution IV）
- [X] T083 [P] 執行 npm run test:coverage，確認測試覆覆率 > 60%（Constitution II）
- [X] T084 [P] 執行 ESLint 檢查，修正所有程式碼品質問題（Constitution I）
- [ ] T085 在所有關鍵操作加入 Loading 狀態與錯誤提示（FR-030）
- [ ] T086 [P] 加入 Edge Case 處理：運動資料庫為空時顯示管理員通知
- [ ] T087 [P] 加入 Edge Case 處理：課表時長差異過大時顯示確認對話框
- [ ] T088 [P] 加入 Edge Case 處理：播放器執行超過 30 分鐘暫停時顯示繼續提示
- [ ] T089 依照 quickstart.md 步驟 8-10 完整驗證本地開發環境設定
- [ ] T090 建立 30-50 筆初始運動資料，確保每個偏好組合有 3-5 個選項（SC-007）
- [ ] T091 執行完整的使用者測試：驗證 90% 用戶能無指引完成核心操作（SC-005）
- [ ] T092 執行完整的訓練流程測試：驗證 70% 用戶能完成至少一次完整訓練（SC-010）
- [ ] T093 [P] 建立 .github/workflows/ci.yml，設定 GitHub Actions 自動執行 ESLint + 測試
- [ ] T094 準備部署：建立 Render Static Site 專案，設定自動部署（參考 TECH.md）
- [ ] T095 執行最終檢查清單：驗證所有 Functional Requirements (FR-001 到 FR-030) 皆已實作
- [ ] T096 執行最終檢查清單：驗證所有 Success Criteria (SC-001 到 SC-010) 皆已達成

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無相依性 - 可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - **阻塞所有 User Stories**
- **User Stories (Phase 3-6)**: 皆依賴 Foundational 完成
  - User Stories 可平行實作（若有足夠人力）
  - 或依優先順序循序實作（P1 → P2 → P4 → P3）
- **Polish (Phase 7)**: 依賴所有期望的 User Stories 完成

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Foundational 完成後即可開始 - 無其他 Story 相依性
- **User Story 2 (P2)**: Foundational 完成後即可開始 - 整合 US1 的課表資料，但應獨立可測試
- **User Story 4 (P4)**: Foundational 完成後即可開始 - 與 US1, US2 整合但應獨立可測試
- **User Story 3 (P3)**: Foundational 完成後即可開始 - 完全獨立，可由管理員執行

### Within Each User Story

- 測試必須先撰寫並失敗，再開始實作
- Models/Types → Services → Hooks → Components
- 核心實作 → 整合 → 錯誤處理 → 驗證
- Story 完成後才進入下一個優先順序

### Parallel Opportunities

- **Phase 1 (Setup)**: T003, T004, T006, T007, T009, T011 可平行執行（不同配置檔）
- **Phase 2 (Foundational)**: T014, T016, T019, T022 可平行執行
- **Phase 3 (US1 Tests)**: T024, T025, T026 可平行執行
- **Phase 3 (US1 Implementation)**: T027, T028, T029, T033, T034, T035 可平行執行（不同檔案）
- **Phase 4 (US2 Tests)**: T045, T046 可平行執行
- **Phase 4 (US2 Implementation)**: T047, T048, T049, T050 可平行執行
- **Phase 5 (US4)**: T063 可獨立平行於其他任務
- **Phase 6 (US3)**: T070, T072-T074 可平行執行（文檔 + Dashboard 操作）
- **Phase 7 (Polish)**: T078, T079, T080, T083, T084, T086, T087, T088, T093 可平行執行

**基礎設施完成後 (Phase 2 後)**，所有 User Stories 可由不同團隊成員平行開發

---

## Parallel Example: User Story 1

```bash
# 同時啟動 User Story 1 的所有測試：
Task: "建立 workoutGeneration.test.ts - 課表生成演算法測試"
Task: "建立 exerciseService.test.ts - 動作資料查詢測試"
Task: "建立 PreferenceForm.test.tsx - 偏好表單測試"

# 同時啟動 User Story 1 的所有 Service 層：
Task: "建立 exerciseService.ts - 實作 fetchActiveExercises()"
Task: "建立 workoutGenerator.ts - 實作 generateWorkoutPlan()"
Task: "建立 validators.ts - 實作偏好驗證"

# 同時啟動 User Story 1 的所有通用組件：
Task: "建立 Button.tsx - 通用按鈕"
Task: "建立 Loading.tsx - 載入動畫"
Task: "建立 Toast.tsx - 提示訊息"
```

---

## Implementation Strategy

### MVP First (僅實作 User Story 1)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（**關鍵 - 阻塞所有 Stories**）
3. 完成 Phase 3: User Story 1
4. **停止並驗證**: 獨立測試 User Story 1
5. 準備部署/展示

**此時 MVP 可交付：學員可設定偏好並獲得客製化課表**

### Incremental Delivery (漸進式交付)

1. 完成 Setup + Foundational → 基礎就緒
2. 加入 User Story 1 → 獨立測試 → 部署/展示（MVP！）
3. 加入 User Story 2 → 獨立測試 → 部署/展示（可執行訓練）
4. 加入 User Story 4 → 獨立測試 → 部署/展示（完整學員體驗）
5. 加入 User Story 3 → 獨立測試 → 部署/展示（管理員功能）
6. 每個 Story 都增加價值且不破壞先前 Stories

### Parallel Team Strategy (平行團隊策略)

**多位開發者同時開發：**

1. 團隊一起完成 Setup + Foundational
2. Foundational 完成後：
   - **開發者 A**: User Story 1（偏好設定 + 課表生成）
   - **開發者 B**: User Story 2（訓練播放器）
   - **開發者 C**: User Story 4（課表詳情）
   - **管理員/PM**: User Story 3（內容準備與 CMS 驗證）
3. 各 Story 獨立完成並整合

---

## Task Count Summary

- **Phase 1 (Setup)**: 11 tasks
- **Phase 2 (Foundational)**: 12 tasks (BLOCKING)
- **Phase 3 (US1 - MVP)**: 21 tasks (3 tests + 18 implementation)
- **Phase 4 (US2)**: 17 tasks (2 tests + 15 implementation)
- **Phase 5 (US4)**: 8 tasks (1 test + 7 implementation)
- **Phase 6 (US3)**: 8 tasks
- **Phase 7 (Polish)**: 19 tasks

**Total**: 96 tasks

### Tasks per User Story

- **User Story 1 (P1 - MVP)**: 21 tasks
- **User Story 2 (P2)**: 17 tasks
- **User Story 4 (P4)**: 8 tasks
- **User Story 3 (P3)**: 8 tasks

### Parallel Opportunities Identified

- **Setup phase**: 6 parallelizable tasks (55%)
- **Foundational phase**: 4 parallelizable tasks (33%)
- **User Story phases**: 30+ parallelizable tasks across all stories
- **Polish phase**: 9 parallelizable tasks (47%)

**總計約 40+ 任務可平行執行**，在多人團隊中可大幅縮短開發時間

---

## Independent Test Criteria

### User Story 1 (MVP)
✅ 開啟應用 → 選擇偏好（增肌、徒手、30分鐘、初階）→ 點擊生成 → 驗證課表包含 3+ 個符合標籤的運動且總時長 27-33 分鐘

### User Story 2
✅ 生成 3 個運動的課表 → 點擊「開始訓練」→ 驗證全螢幕顯示、依序播放影片、倒數計時準確、自動切換運動、顯示完成畫面

### User Story 4
✅ 生成課表 → 在預覽頁面查看 → 驗證顯示所有運動的名稱、說明、時長、器材 → 點擊「開始訓練」和「重新生成」按鈕正常運作

### User Story 3
✅ 登入 Supabase Dashboard → 新增運動資料 → 在前端驗證新運動出現在課表中 → 編輯運動 → 驗證變更生效 → 刪除運動 → 驗證運動不再出現

---

## Suggested MVP Scope

**建議 MVP 範圍：User Story 1 (Phase 1-3)**

**理由：**
- User Story 1 是核心價值主張：學員可獲得客製化訓練課表
- 包含完整的資料流程：偏好輸入 → 演算法生成 → 課表顯示
- 可獨立展示與驗證產品概念
- 為後續 Stories 奠定基礎架構

**預估工時：**
- Setup (Phase 1): 4-6 小時
- Foundational (Phase 2): 8-10 小時
- User Story 1 (Phase 3): 20-25 小時

**總計約 32-41 小時（4-5 個工作天）**

---

## Format Validation

✅ **所有任務皆遵循 Checklist 格式**：
- Checkbox: `- [ ]` ✅
- Task ID: T001 到 T096 依序編號 ✅
- [P] marker: 標記可平行任務 ✅
- [Story] label: Phase 3-6 任務皆標記 US1-US4 ✅
- File paths: 所有實作任務包含完整檔案路徑 ✅

---

## Notes

- **[P] 任務**: 不同檔案、無相依性、可同時執行
- **[Story] 標籤**: 追蹤任務所屬 User Story，確保可獨立測試
- **每個 User Story 應獨立完成與測試**
- **先確認測試失敗再開始實作**（TDD 原則）
- **每個任務或邏輯群組完成後提交 commit**
- **在每個 Checkpoint 停止並獨立驗證 Story**
- **避免**: 模糊任務、同檔案衝突、破壞獨立性的跨 Story 相依性

---

**Generated by**: `/speckit.tasks` command  
**Ready for**: Immediate execution by development team or LLM agents  
**Next Steps**: 開始 Phase 1 Setup，依照 quickstart.md 設定開發環境
