# Phase 2: 平台化升級規格書 (Platform Upgrade Specification)

## 1. 總覽 (Overview)

本階段目標是將「Virtual Coach App」從一次性工具升級為具備長期追蹤能力的個人化健身平台。透過引入使用者帳號系統，我們將能夠保存使用者的訓練紀錄、偏好設定與身體數據，並透過數據儀表板提供長期的進步回饋。

---

## 2. 模組規格 (Module Specifications)

### 模組 A：使用者帳號與身份驗證 (User Account & Authentication)

**目標**: 建立安全的使用者身份系統，作為個人化服務的基礎。

**功能需求 (Functional Requirements):**

| ID | User Story | 驗收標準 (Acceptance Criteria) |
| :--- | :--- | :--- |
| **A-1** | 作為使用者，我必須能註冊新帳號。 | 1. 支援 Email/Password 註冊。<br>2. 密碼需符合安全性強度要求。<br>3. 註冊成功後自動登入。 |
| **A-2** | 作為使用者，我必須能登入既有帳號。 | 1. 支援 Email/Password 登入。<br>2. 登入失敗需有明確錯誤訊息。<br>3. 支援「記住我」功能 (Session 持久化)。 |
| **A-3** | 作為使用者，我必須能登出帳號。 | 1. 登出後清除 Session。<br>2. 導向至首頁或登入頁。 |
| **A-4** | 作為使用者，我必須能管理個人資料。 | 1. 可設定暱稱、大頭貼 (Avatar)。<br>2. 可更新身高、體重等基礎生理數據。 |

**技術實作 (Technical Implementation):**
- 使用 **Supabase Auth** 服務。
- 實作 `AuthProvider` Context 管理全域登入狀態。
- 保護路由 (Protected Routes)：Dashboard, History, Profile 頁面需登入才能訪問。

---

### 模組 B：進階互動與回饋 (Advanced Interaction & Feedback)

**目標**: 增強訓練過程中的互動性，並收集使用者回饋以優化推薦。

**功能需求 (Functional Requirements):**

| ID | User Story | 驗收標準 (Acceptance Criteria) |
| :--- | :--- | :--- |
| **B-1** | 作為使用者，我必須能在訓練後評分。 | 1. 訓練完成頁面顯示 1-5 星評分機制。<br>2. 可選擇「太簡單」、「剛好」、「太難」的主觀感受 (RPE)。 |
| **B-2** | 作為使用者，我必須能收藏喜歡的動作。 | 1. 動作卡片與播放器介面新增「愛心」按鈕。<br>2. 收藏的動作應在個人頁面可見。 |
| **B-3** | 作為使用者，我必須能調整訓練中的動作。 | 1. 播放器提供「替換動作」功能 (若該動作無法執行)。<br>2. 替換邏輯需符合相同肌群/類別規則。 |

**UI/UX 變更:**
- 訓練完成頁面 (CompletedScreen) 新增評分表單。
- 播放器 (PlayerScreen) 新增互動按鈕列。

---

### 模組 C：資料持久化與歷史紀錄 (Data Persistence & History)

**目標**: 完整記錄使用者的訓練歷程，確保數據不流失。

**資料庫架構變更 (Database Schema Changes):**

1.  **`profiles` 表 (新增)**
    - `id`: uuid (FK to auth.users)
    - `display_name`: text
    - `avatar_url`: text
    - `height`: numeric
    - `weight`: numeric
    - `created_at`: timestamp

2.  **`workout_logs` 表 (新增)**
    - `id`: uuid
    - `user_id`: uuid (FK to profiles.id)
    - `workout_date`: timestamp
    - `duration_seconds`: integer
    - `calories_burned`: integer (估算值)
    - `difficulty_rating`: integer (1-5)
    - `feeling`: text (e.g., 'hard', 'good', 'easy')
    - `exercises_completed`: jsonb (紀錄實際完成的動作列表)

3.  **`user_favorites` 表 (新增)**
    - `user_id`: uuid
    - `exercise_id`: uuid (FK to exercises.id)
    - `created_at`: timestamp

**功能需求:**
- 每次訓練完成後，自動將數據寫入 `workout_logs`。
- 使用者偏好設定 (Preferences) 改為儲存在資料庫或 LocalStorage (與帳號綁定)。

---

### 模組 D：數據儀表板 (Data Dashboard)

**目標**: 視覺化呈現使用者的訓練成果，提供成就感與持續動力。

**功能需求 (Functional Requirements):**

| ID | User Story | 驗收標準 (Acceptance Criteria) |
| :--- | :--- | :--- |
| **D-1** | 作為使用者，我必須能查看每週訓練概況。 | 1. 顯示本週訓練次數、總時長。<br>2. 顯示本週消耗卡路里估算。 |
| **D-2** | 作為使用者，我必須能查看訓練歷史列表。 | 1. 依時間倒序排列的訓練紀錄卡片。<br>2. 點擊可查看該次訓練詳細內容。 |
| **D-3** | 作為使用者，我必須能看到進度圖表。 | 1. 使用圖表 (Chart) 顯示近 30 天的訓練時長趨勢。<br>2. 顯示肌群訓練分佈 (圓餅圖或雷達圖)。 |

**技術實作:**
- 使用 **Recharts** 或類似輕量級圖表庫。
- 新增 `/dashboard` 頁面作為登入後首頁。

---

## 3. 程式碼優化與清理 (Code Optimization & Cleanup)

**目標**: 提升專案可維護性，移除 MVP 階段的臨時檔案。

**執行項目:**
1.  **移除 Mock Data**: 移除所有硬編碼的測試資料，全面改接 Supabase API。
2.  **統一型別定義**: 將分散在各檔案的 TypeScript Interface 整合至 `src/types/` 目錄。
3.  **元件重構**:
    - 提取共用的 UI 元件 (如 Card, Modal, Input) 至 `src/components/ui/`。
    - 優化 `PlayerScreen` 的狀態管理邏輯 (考慮使用 useReducer)。
4.  **檔案清理**:
    - 刪除未使用的圖片資源。
    - 移除 `.specify` 目錄下過時的暫存文件 (保留核心文檔)。
5.  **效能優化**:
    - 實作 React.memo 與 useMemo 減少不必要的渲染。
    - 引入 Code Splitting (React.lazy) 優化路由載入。

---

## 4. 開發原則 (Development Principles)

遵循 `constitution.md` 之規範：
1.  **品質優先**: 所有新功能必須包含對應的單元測試與整合測試。
2.  **繁中文件**: 程式碼註解與 Commit Message 必須使用繁體中文。
3.  **模組化**: 保持功能模組的獨立性，避免過度耦合。
4.  **使用者體驗**: 確保所有新介面符合現有設計系統 (Tailwind CSS + Mantine/Custom Theme)。
