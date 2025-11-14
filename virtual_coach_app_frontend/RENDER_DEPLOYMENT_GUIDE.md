# 🚀 部署到 Render 步驟指南

## 前置準備 ✅

### 1. 確認程式碼已 commit 到 GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin 002-ui-redesign
```

### 2. 準備 Supabase 環境變數
- `VITE_SUPABASE_URL`: https://qdpurcqksmmymuvbjnvo.supabase.co
- `VITE_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

---

## 📋 Render 部署步驟

### Step 1: 登入 Render
1. 前往 [https://render.com](https://render.com)
2. 使用 GitHub 帳號登入

### Step 2: 建立新的 Web Service
1. 點擊右上角 **"New +"** → 選擇 **"Web Service"**
2. 連接你的 GitHub Repository: `RogerTangg/Virtual-Coach-App-New_Version`
3. 選擇 branch: `002-ui-redesign`

### Step 3: 配置 Web Service

**Basic Settings:**
- **Name**: `virtual-coach-app` (可自訂)
- **Region**: `Singapore` (選擇離台灣最近的)
- **Branch**: `002-ui-redesign`
- **Root Directory**: `virtual_coach_app_frontend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  npm run preview -- --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- 選擇 **Free** (免費方案)

### Step 4: 設定環境變數
在 "Environment" 區域新增以下變數：

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20.11.0` |
| `VITE_SUPABASE_URL` | `https://qdpurcqksmmymuvbjnvo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> ⚠️ **重要**: 請從你的 `.env` 檔案複製完整的 `VITE_SUPABASE_ANON_KEY`

### Step 5: 部署
1. 點擊 **"Create Web Service"**
2. Render 會自動開始 build 和 deploy
3. 等待 5-10 分鐘完成部署

---

## 🔍 驗證部署

### 部署完成後檢查項目：

1. **訪問 URL**
   - Render 會提供一個 URL，例如：`https://virtual-coach-app.onrender.com`
   - 開啟瀏覽器測試所有功能

2. **測試功能清單**
   - ✅ 偏好設定表單正常運作
   - ✅ 生成訓練計畫
   - ✅ 運動卡片展開/收合
   - ✅ 開始訓練
   - ✅ 計時器倒數
   - ✅ 影片播放（如果有）
   - ✅ 暫停/繼續/下一個控制
   - ✅ 退出訓練對話框
   - ✅ 完成畫面

3. **檢查 Supabase 連接**
   - 開啟瀏覽器開發者工具 (F12)
   - 查看 Console 是否有錯誤
   - 確認 Network tab 中 Supabase API 請求成功

---

## 🛠️ 故障排除

### 問題 1: Build 失敗
**解決方法**:
```bash
# 本地測試 build
npm run build

# 如果成功，檢查 Render logs
# 確認 Root Directory 設定為 virtual_coach_app_frontend
```

### 問題 2: 白屏或 404
**原因**: Vite SPA routing 問題
**解決方法**: 
- 檢查 Render 的 "Redirects/Rewrites" 設定
- 應該不需要額外設定，因為我們使用 `npm run preview`

### 問題 3: 環境變數未生效
**檢查**:
1. 確認變數名稱有 `VITE_` 前綴
2. 在 Render Dashboard 重新輸入環境變數
3. 點擊 "Manual Deploy" → "Clear build cache & deploy"

### 問題 4: Supabase 連接失敗
**檢查**:
1. Supabase URL 和 Key 是否正確
2. Supabase 專案是否啟用 (paused 的話需要 resume)
3. 檢查瀏覽器 Console 錯誤訊息

---

## 🔄 自動部署

設定完成後，每次 push 到 `002-ui-redesign` branch，Render 會自動重新部署。

**關閉自動部署**:
1. 前往 Render Dashboard
2. 選擇你的 Service
3. Settings → Build & Deploy → 關閉 "Auto-Deploy"

---

## 📊 監控與 Logs

### 查看部署狀態
- Dashboard → 你的 Service → Events tab

### 查看運行 Logs
- Dashboard → 你的 Service → Logs tab
- 即時監控應用程式輸出

### 查看部署歷史
- Dashboard → 你的 Service → Deploys tab

---

## 💰 Free Tier 限制

Render Free Plan 限制：
- ⏸️ **15 分鐘無活動後自動休眠**
- 🐌 **首次喚醒需要 30-60 秒**
- 💾 **750 小時/月免費運行時間**
- 📦 **無持久化儲存 (使用 Supabase 儲存資料)**

---

## 🎉 完成！

你的 Virtual Coach App 現在已經上線了！

**分享你的應用**:
- Production URL: `https://你的應用名稱.onrender.com`
- GitHub Repo: `https://github.com/RogerTangg/Virtual-Coach-App-New_Version`

---

## 📞 需要幫助？

- [Render 官方文檔](https://render.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Supabase 文檔](https://supabase.com/docs)
