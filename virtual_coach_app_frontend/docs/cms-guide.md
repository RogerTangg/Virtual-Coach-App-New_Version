# Supabase CMS 管理員操作手冊

## 目錄
1. [簡介](#簡介)
2. [登入 Supabase Dashboard](#登入-supabase-dashboard)
3. [管理運動資料](#管理運動資料)
4. [資料驗證](#資料驗證)
5. [常見問題](#常見問題)

---

## 簡介

Virtual Coach App 使用 Supabase 作為後端服務，運動資料儲存在 `exercises` 資料表中。管理員可以透過 Supabase Dashboard 直接管理運動資料，無需編寫程式碼。

### 資料表結構

| 欄位 | 類型 | 說明 | 必填 |
|------|------|------|------|
| `id` | bigint | 自動遞增主鍵 | 是 |
| `name` | text | 運動名稱 | 是 |
| `target_muscle` | text | 目標肌群 (chest/back/legs/shoulders/arms/core) | 是 |
| `difficulty_level` | text | 難度等級 (beginner/intermediate/advanced) | 是 |
| `equipment_needed` | text | 所需器材 (可為 null 表示徒手) | 否 |
| `description` | text | 運動說明 | 否 |
| `video_url` | text | YouTube 影片網址 | 否 |
| `duration_seconds` | integer | 預計執行時間（秒） | 是 |
| `priority_weight` | integer | 優先權重 (1-100，越高越優先) | 是 |
| `is_active` | boolean | 是否啟用 | 是 |
| `created_at` | timestamptz | 建立時間 | 自動 |
| `updated_at` | timestamptz | 更新時間 | 自動 |

---

## 登入 Supabase Dashboard

### 步驟

1. **開啟 Supabase Dashboard**
   - 前往：https://supabase.com/dashboard
   - 使用您的 Supabase 帳號登入

2. **選擇專案**
   - 在專案列表中找到 Virtual Coach App 專案
   - 專案 URL: `https://qdpurcqksmmymuvbjnvo.supabase.co`

3. **進入 Table Editor**
   - 在左側選單點擊 `Table Editor`
   - 在資料表列表中選擇 `exercises`

---

## 管理運動資料

### 新增運動

1. **點擊 "Insert row" 按鈕** (位於右上角)

2. **填寫必填欄位**：
   - `name`: 運動名稱（例如：伏地挺身）
   - `target_muscle`: 目標肌群
     - `chest` - 胸部
     - `back` - 背部
     - `legs` - 腿部
     - `shoulders` - 肩膀
     - `arms` - 手臂
     - `core` - 核心
   - `difficulty_level`: 難度等級
     - `beginner` - 初學者
     - `intermediate` - 中階
     - `advanced` - 進階
   - `duration_seconds`: 預計時間（秒）
     - 建議範圍：30-120 秒
   - `priority_weight`: 優先權重
     - 範圍：1-100
     - 建議：常見運動 80-100，進階運動 50-80
   - `is_active`: 是否啟用
     - 預設：`true`

3. **選填欄位**（建議填寫）：
   - `equipment_needed`: 器材需求（例如：啞鈴、彈力帶）
   - `description`: 運動說明（200 字以內）
   - `video_url`: YouTube 影片網址
     - **重要**：使用嵌入式網址格式
     - 範例：`https://www.youtube.com/embed/VIDEO_ID`
     - 不要使用：`https://www.youtube.com/watch?v=VIDEO_ID`

4. **點擊 "Save" 儲存**

### 範例：新增伏地挺身

```
name: 伏地挺身
target_muscle: chest
difficulty_level: beginner
equipment_needed: null
description: 基礎胸部訓練動作，鍛鍊胸大肌、三角肌前束和肱三頭肌
video_url: https://www.youtube.com/embed/IODxDxX7oi4
duration_seconds: 40
priority_weight: 90
is_active: true
```

---

### 編輯運動

1. **找到要編輯的運動**
   - 使用搜尋功能或捲動找到目標運動

2. **點擊該列進行編輯**
   - 直接點擊儲存格即可編輯

3. **修改欄位**
   - 常見修改：
     - 調整 `duration_seconds` 更準確
     - 更新 `video_url` 為更好的教學影片
     - 修正 `description` 文字
     - 調整 `priority_weight` 優化推薦演算法

4. **按 Enter 或點擊外部儲存**

---

### 刪除/停用運動

**建議使用軟刪除（設定 `is_active = false`），而非直接刪除資料**

#### 軟刪除（推薦）

1. 找到要停用的運動
2. 點擊編輯 `is_active` 欄位
3. 改為 `false`
4. 儲存

**優點**：
- 資料保留，可隨時恢復
- 不影響歷史課表記錄
- 避免資料庫參照完整性問題

#### 硬刪除（不建議）

1. 找到要刪除的運動
2. 點擊該列左側的選擇框
3. 點擊 "Delete" 按鈕
4. 確認刪除

**注意**：硬刪除會永久移除資料，無法復原！

---

## 資料驗證

### 新增運動後的檢查清單

- [ ] 運動名稱清晰易懂
- [ ] `target_muscle` 正確分類
- [ ] `difficulty_level` 符合實際難度
- [ ] `duration_seconds` 合理（通常 30-120 秒）
- [ ] `priority_weight` 已設定（建議 50-100）
- [ ] `video_url` 可正常播放（如有填寫）
- [ ] `is_active` 設為 `true`

### 前端驗證步驟

1. **開啟 Virtual Coach App**
   - 前往：http://localhost:5173 (本地開發)
   - 或前往正式網站

2. **選擇對應的偏好設定**
   - 選擇與新運動相符的目標肌群
   - 選擇對應的難度等級

3. **生成課表**
   - 點擊「生成訓練計畫」
   - 檢查新運動是否出現在課表中

4. **測試播放器**
   - 點擊「開始訓練」
   - 驗證影片可正常播放
   - 驗證倒數計時準確

---

## 常見問題

### Q1: 為什麼新增的運動沒有出現在課表中？

**可能原因**：
1. `is_active` 設為 `false` → 改為 `true`
2. `target_muscle` 與使用者選擇不符 → 檢查肌群分類
3. `difficulty_level` 與使用者選擇不符 → 檢查難度設定
4. `priority_weight` 過低 → 提高權重至 70 以上
5. 快取問題 → 重新整理頁面或清除快取

### Q2: 影片無法播放怎麼辦？

**檢查項目**：
1. 確認使用嵌入式網址格式：`https://www.youtube.com/embed/VIDEO_ID`
2. 確認影片設定為「公開」或「不公開（有連結的人可觀看）」
3. 確認影片未被地區限制
4. 測試影片網址是否可在瀏覽器中直接開啟

### Q3: 如何批次新增運動？

**方法 1：使用 SQL Editor**
```sql
INSERT INTO exercises (name, target_muscle, difficulty_level, duration_seconds, priority_weight, is_active)
VALUES
  ('深蹲', 'legs', 'beginner', 45, 90, true),
  ('弓箭步', 'legs', 'intermediate', 50, 85, true),
  ('硬舉', 'legs', 'advanced', 40, 95, true);
```

**方法 2：使用 CSV 匯入**
1. 準備 CSV 檔案（包含所有必填欄位）
2. 在 Table Editor 點擊 "Import data from CSV"
3. 上傳檔案並對應欄位
4. 確認並匯入

### Q4: 如何恢復已刪除的運動？

**軟刪除恢復**（`is_active = false`）：
1. 找到該運動
2. 將 `is_active` 改回 `true`

**硬刪除恢復**（已從資料表刪除）：
- 無法恢復，需重新新增
- 建議定期備份資料庫

### Q5: 如何調整運動推薦的優先順序？

調整 `priority_weight` 欄位：
- **90-100**：核心運動（深蹲、臥推、硬舉等）
- **70-89**：常見輔助運動（側平舉、彎舉等）
- **50-69**：進階或專項運動
- **30-49**：特殊運動或需特定器材
- **1-29**：很少推薦

### Q6: 如何確保每個肌群有足夠的運動選項？

**建議每個肌群至少有**：
- **初學者**：5-8 個運動
- **中階**：5-8 個運動  
- **進階**：3-5 個運動

使用此查詢檢查：
```sql
SELECT target_muscle, difficulty_level, COUNT(*) as count
FROM exercises
WHERE is_active = true
GROUP BY target_muscle, difficulty_level
ORDER BY target_muscle, difficulty_level;
```

---

## 效能建議

### 達成 5 分鐘內新增 10 筆資料（SC-007）

1. **準備資料模板**
   - 事先規劃好運動清單
   - 準備好影片網址
   - 使用試算表整理欄位

2. **使用鍵盤快捷鍵**
   - Tab: 跳到下一個欄位
   - Enter: 儲存並新增下一筆
   - Ctrl+C/Ctrl+V: 複製貼上相同值

3. **批次操作**
   - 優先使用 SQL INSERT 語法
   - 或使用 CSV 匯入功能

---

## 聯絡支援

如有技術問題或需要協助，請聯繫：
- **開發團隊**: [技術支援信箱]
- **Supabase 文件**: https://supabase.com/docs
