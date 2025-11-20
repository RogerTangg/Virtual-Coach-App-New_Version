# Phase 2 部署指南 (Deployment Guide)

## 前置準備

在部署 Phase 2 功能之前，您需要完成以下步驟：

### 1. Supabase 資料庫 Migration

1. 登入 [Supabase Dashboard](https://app.supabase.com)
2. 選擇您的專案
3. 進入 **SQL Editor**
4. 開啟檔案 `database/migrations/phase2_schema.sql`
5. 複製完整的 SQL 內容
6. 貼上至 SQL Editor 並執行

#### 驗證 Migration 成功

執行以下查詢確認資料表已建立：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'workout_logs', 'user_favorites');
```

應該會看到三個資料表。

---

### 2. 啟用 Supabase Email Authentication

1. 在 Supabase Dashboard，進入 **Authentication → Providers**
2. 確認 **Email** provider 已啟用
3. 設定以下選項：
   - ✅ Enable Email provider
   - ✅ Confirm email (建議開啟，需設定 Email templates)
   - ⚙️ Email templates → 自訂註冊確認信件

#### Email Template 範例

在 **Authentication → Email Templates → Confirm signup** 設定：

```html
<h2>歡迎加入 Virtual Coach！</h2>
<p>請點擊以下連結驗證您的帳號：</p>
<p><a href="{{ .ConfirmationURL }}">驗證帳號</a></p>
```

---

### 3. 更新環境變數

確認 `frontend/.env` 檔案包含正確的 Supabase 憑證：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

### 4. 安裝新依賴

```bash
cd frontend
npm install
```

---

## 本地測試

### 1. 啟動開發伺服器

```bash
npm run dev
```

### 2. 測試流程

1. **訪客模式測試**
   - 訪問 `http://localhost:3000`
   - 點擊「立即開始訓練」
   - 完成一次訓練（無需登入）

2. **註冊流程測試**
   - 點擊「或登入以追蹤進度」
   - 切換至「註冊」頁面
   - 使用真實 Email 註冊
   - 檢查 Email 收件匣，點擊驗證連結

3. **登入流程測試**
   - 使用剛註冊的帳號登入
   - 確認導向至 Dashboard

4. **完整訓練流程測試**
   - 在 Dashboard 點擊「開始新訓練」
   - 完成訓練後，填寫評分表單
   - 確認訓練紀錄出現在 Dashboard

5. **歷史檢視測試**
   - 點擊「查看全部」進入歷史列表
   - 點擊單一訓練紀錄查看詳情

---

## 部署至 Render

### 1. 推送至 GitHub

```bash
git add .
git commit -m "feat(phase2): 完成平台化升級 - 新增認證、儀表板與歷史紀錄"
git push origin 004-Add-Features
```

### 2. Render 自動部署

由於專案已設定 Render 自動部署，推送至 `main` 分支後將自動觸發建置。

#### 合併至 main 分支

```bash
git checkout main
git merge 004-Add-Features
git push origin main
```

### 3. 監控部署狀態

1. 登入 [Render Dashboard](https://dashboard.render.com)
2. 找到您的 Static Site
3. 查看 **Events** 頁籤確認部署狀態

---

## 部署後驗證

### 1. 功能檢查清單

- [ ] 訪客模式正常運作
- [ ] 註冊流程正常
- [ ] Email 驗證信件正常寄送
- [ ] 登入流程正常
- [ ] Dashboard 統計資料正確顯示
- [ ] 訓練紀錄能成功儲存
- [ ] 歷史列表能正確載入
- [ ] 個人資料頁面可編輯

### 2. 效能檢查

使用 Lighthouse 測試：

```bash
npx lighthouse https://your-site.onrender.com --view
```

目標指標：
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s

---

## 常見問題排除

### Q1: 註冊後未收到驗證信

**解決方案**:
1. 檢查 Spam 資料夾
2. 確認 Supabase Email provider 已啟用
3. 檢查 Supabase → Authentication → Logs 是否有錯誤

### Q2: 登入後 Dashboard 無資料

**解決方案**:
1. 開啟瀏覽器 Console 檢查錯誤訊息
2. 確認 Supabase RLS 政策已正確設定
3. 檢查 Network 頁籤，查看 API 請求是否成功

### Q3: 訓練紀錄儲存失敗

**解決方案**:
1. 確認已登入
2. 檢查 `workout_logs` 表的 RLS 政策
3. 確認評分與感受都已選擇

### Q4: 圖表無法顯示

可能需要重新安裝 recharts：

```bash
npm uninstall recharts
npm install recharts
npm run build
```

---

## 回滾指南

若部署後發現重大問題，可回滾至 Phase 1 版本：

```bash
git revert HEAD
git push origin main
```

---

## 下一步

Phase 2 部署完成後，您可以：

1. 邀請測試使用者註冊並提供回饋
2. 監控 Supabase 的使用量與效能
3. 規劃 Phase 3 功能 (如社群功能、教練建議等)

---

**需要協助？** 請檢查專案文檔或聯繫開發團隊。
