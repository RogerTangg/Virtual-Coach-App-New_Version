# Virtual Coach App - 資料庫設定指南

## 📋 快速開始

### 步驟 1: 建立 Supabase 專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊 **"New Project"**
3. 填寫專案資訊：
   - **Name**: virtual-coach-app
   - **Database Password**: 設定一個強密碼（請記住！）
   - **Region**: 選擇最接近你的區域（建議：Southeast Asia (Singapore)）
4. 點擊 **"Create new project"**
5. 等待約 2 分鐘讓專案初始化完成

### 步驟 2: 執行資料庫設定腳本

1. 在 Supabase Dashboard 中，點擊左側選單的 **"SQL Editor"**
2. 點擊 **"New query"**
3. 複製 `setup.sql` 檔案的全部內容
4. 貼上到 SQL Editor 中
5. 點擊 **"Run"** 執行腳本
6. 確認執行成功（應該看到綠色的成功訊息）

### 步驟 3: 獲取 API 金鑰

1. 點擊左側選單的 **"Settings"** (齒輪圖示)
2. 點擊 **"API"**
3. 你會看到：
   - **Project URL** (類似 `https://xxxxx.supabase.co`)
   - **anon/public key** (很長的字串)

### 步驟 4: 設定環境變數

1. 在 `virtual_coach_app_frontend` 目錄下建立 `.env` 檔案
2. 複製 `.env.example` 的內容到 `.env`
3. 填入你的實際值：

```env
VITE_SUPABASE_URL=https://你的專案ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_key
```

### 步驟 5: 啟動應用程式

```bash
cd virtual_coach_app_frontend
npm run dev
```

## 📊 資料庫結構

### exercises 資料表

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| id | BIGSERIAL | 主鍵（自動遞增）|
| name | VARCHAR(100) | 運動名稱 |
| description | TEXT | 詳細說明 |
| target_muscle | VARCHAR(50) | 目標肌群 |
| difficulty_level | VARCHAR(20) | 難度等級 |
| equipment_needed | VARCHAR(100) | 所需裝備 |
| video_url | VARCHAR(500) | 教學影片網址 |
| thumbnail_url | VARCHAR(500) | 縮圖網址 |
| duration_seconds | INTEGER | 建議執行時間（秒）|
| calories_per_minute | DECIMAL(5,2) | 每分鐘燃燒卡路里 |
| is_active | BOOLEAN | 是否啟用 |
| priority_weight | INTEGER | 優先權重 |
| created_at | TIMESTAMP | 建立時間 |
| updated_at | TIMESTAMP | 更新時間 |

### 目標肌群 (target_muscle) 選項

- `legs` - 腿部
- `chest` - 胸部
- `core` - 核心
- `back` - 背部
- `shoulders` - 肩膀
- `arms` - 手臂

### 難度等級 (difficulty_level) 選項

- `beginner` - 初學者
- `intermediate` - 中階
- `advanced` - 進階

## 🔒 安全性設定

資料表已啟用 **Row Level Security (RLS)**：

- ✅ 公開讀取權限：所有人都可以讀取 `is_active = true` 的運動資料
- ✅ 認證用戶權限：登入用戶可以讀取所有運動資料
- ❌ 寫入權限：目前未開放（未來可為管理員開放）

## 📈 初始資料統計

執行 `setup.sql` 後，資料庫包含：

- **腿部運動**: 4 個（3個初學者、1個中階）
- **胸部運動**: 4 個（3個初學者、1個中階）
- **核心運動**: 4 個（2個初學者、2個中階）
- **背部運動**: 3 個（2個初學者、1個中階）
- **肩膀運動**: 4 個（2個初學者、2個中階）
- **手臂運動**: 3 個（3個初學者）
- **全身運動**: 3 個（1個初學者、1個中階、1個進階）

**總計**: 25 個運動項目

## 🔧 常見問題

### Q: 無法連接到資料庫？

1. 確認 `.env` 檔案存在於正確位置
2. 確認 URL 和金鑰正確無誤
3. 確認 Supabase 專案狀態為 "Active"
4. 重新啟動開發伺服器

### Q: 看到 "Could not find the table 'public.exercises'" 錯誤？

這表示 `setup.sql` 尚未執行。請按照步驟 2 執行資料庫設定腳本。

### Q: 需要新增更多運動資料？

方式 1: 透過 Supabase Dashboard
1. 點擊 "Table Editor"
2. 選擇 "exercises" 資料表
3. 點擊 "Insert" > "Insert row"
4. 填寫資料並儲存

方式 2: 透過 SQL
```sql
INSERT INTO public.exercises 
(name, description, target_muscle, difficulty_level, priority_weight)
VALUES 
('運動名稱', '說明', 'legs', 'beginner', 8);
```

## 📞 需要協助？

如有問題，請檢查：
1. [Supabase 官方文件](https://supabase.com/docs)
2. [專案 README](../README.md)
3. [GitHub Issues](你的專案連結/issues)
