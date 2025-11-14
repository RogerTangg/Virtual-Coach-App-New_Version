# Virtual Coach App 🏋️

個人化健身教練應用程式 - 根據您的目標、偏好和時間，自動生成客製化訓練課表。

## ✨ 功能特色

- 🎯 **個人化課表生成**: 根據訓練目標、肌群偏好、難度和時間自動生成
- 📺 **全螢幕訓練播放器**: 內建影片教學、倒數計時器和播放控制
- 📋 **詳細課表檢視**: 展開查看運動說明、器材需求和訓練參數
- ⌨️ **鍵盤快捷鍵**: 空白鍵暫停/播放、方向鍵切換運動
- 📱 **響應式設計**: 支援桌面和行動裝置

## 🚀 快速開始

### 環境需求

- **Node.js**: v18.0.0 或更高版本
- **npm**: v9.0.0 或更高版本
- **Supabase 帳號**: [免費註冊](https://supabase.com)

### 安裝步驟

1. **複製專案**

```bash
git clone <repository-url>
cd virtual-coach-app/virtual_coach_app_frontend
```

2. **安裝依賴**

```bash
npm install
```

3. **設定環境變數**

複製 `.env.example` 並重新命名為 `.env`：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入您的 Supabase 資訊：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

您可以在 [Supabase Dashboard](https://app.supabase.com) → Settings → API 找到這些資訊。

4. **設定資料庫**

參考 `database/README.md` 完成資料庫設定：

- 在 Supabase SQL Editor 執行 `database/setup.sql`
- 驗證資料表和範例資料是否成功載入

5. **啟動開發伺服器**

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動。

## 📦 可用指令

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 執行測試
npm test

# 程式碼檢查
npm run lint

# 格式化程式碼（如果已設定）
npm run format
```

## 🏗️ 技術堆疊

### 前端框架
- **React 19.2.0** - UI 框架
- **TypeScript 5.8.3** - 類型安全
- **Vite 7.2.2** - 快速建置工具

### UI 與樣式
- **Tailwind CSS 3.4.20** - Utility-first CSS 框架
- **PostCSS** - CSS 處理工具

### 後端服務
- **Supabase** - PostgreSQL 資料庫（BaaS）
- **@supabase/supabase-js 2.48.0** - JavaScript 客戶端

### 測試工具
- **Vitest 3.0.0** - 快速單元測試框架
- **React Testing Library 16.1.0** - React 元件測試
- **MSW 2.8.0** - API Mocking
- **jsdom** - DOM 環境模擬

## 📂 專案結構

```
virtual_coach_app_frontend/
├── src/
│   ├── components/         # React 元件
│   │   ├── common/         # 共用元件 (Button, Loading, Toast)
│   │   ├── preferences/    # 偏好設定元件
│   │   ├── workout/        # 課表相關元件
│   │   └── player/         # 訓練播放器元件
│   ├── contexts/           # React Context (WorkoutContext)
│   ├── hooks/              # 自訂 Hooks (useExercises, usePlayer)
│   ├── services/           # API 服務 (Supabase, workoutGenerator)
│   ├── types/              # TypeScript 型別定義
│   ├── utils/              # 工具函式
│   ├── App.tsx             # 主應用元件
│   └── main.tsx            # 應用入口
├── tests/                  # 測試檔案
│   ├── integration/        # 整合測試
│   └── unit/               # 單元測試
├── docs/                   # 文件
│   ├── architecture.md     # 架構文件
│   └── cms-guide.md        # CMS 管理員手冊
├── database/               # 資料庫腳本
│   ├── setup.sql           # 資料庫初始化腳本
│   └── README.md           # 資料庫設定說明
└── public/                 # 靜態資源
```

詳細架構說明請參考 [架構文件](./docs/architecture.md)。

## 🎮 使用方式

### 1. 設定偏好

首次進入應用程式，填寫您的訓練偏好：

- **訓練目標**: 增肌、減脂、維持健康
- **目標肌群**: 選擇 1-3 個想訓練的肌群
- **難度等級**: 初階、中階、進階
- **訓練時長**: 10-60 分鐘

### 2. 生成課表

點擊「生成課表」按鈕，系統將根據您的偏好自動生成客製化訓練計畫。

### 3. 查看詳情

點擊任一運動卡片可展開查看：
- 完整運動說明
- 所需器材
- 訓練參數（組數、次數、休息時間）
- 教學影片連結

### 4. 開始訓練

點擊「開始訓練」進入全螢幕播放模式：

- **播放控制**: 播放/暫停、上一個/下一個運動
- **鍵盤快捷鍵**:
  - `Space`: 暫停/播放
  - `→`: 下一個運動
  - `←`: 上一個運動
  - `Esc`: 退出訓練
- **自動播放**: 倒數結束自動切換下一個運動

### 5. 完成訓練

完成所有運動後，查看訓練統計：
- 完成運動數量
- 總訓練時長
- 選擇「再練一次」或「返回首頁」

## 🧪 測試

### 執行所有測試

```bash
npm test
```

### 測試覆蓋率

```bash
npm test -- --coverage
```

### 測試結構

- **單元測試**: Hooks、Services、Utilities
- **整合測試**: 元件互動、使用者流程
- **目標覆蓋率**: > 60% (關鍵路徑 > 80%)

當前狀態: ✅ 57 tests passed | 7 skipped

## 🔧 開發指南

### 程式碼風格

- 遵循 ESLint 規則配置
- 使用 TypeScript 嚴格模式
- 元件使用函式式元件 + Hooks
- 樣式優先使用 Tailwind CSS utilities

### 新增運動資料

管理員可透過 Supabase Dashboard 新增運動：

1. 登入 [Supabase Dashboard](https://app.supabase.com)
2. 選擇專案並進入 Table Editor
3. 開啟 `exercises` 資料表
4. 點擊「Insert row」新增運動

詳細步驟請參考 [CMS 管理員手冊](./docs/cms-guide.md)。

### Git 工作流程

```bash
# 建立功能分支
git checkout -b feature/your-feature-name

# 提交變更
git add .
git commit -m "feat: add your feature description"

# 推送到遠端
git push origin feature/your-feature-name

# 建立 Pull Request
```

### Commit Message 規範

遵循 Conventional Commits:

- `feat:` 新功能
- `fix:` 錯誤修復
- `docs:` 文件更新
- `style:` 程式碼格式調整
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 建置或工具變更

## 📊 效能指標

### 目標

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Bundle Size (gzipped)**: < 250KB

### 測試效能

使用 Lighthouse 進行效能測試：

```bash
npm run build
npm run preview
# 在 Chrome DevTools 執行 Lighthouse
```

## 🚀 部署

### Render 部署（推薦）

1. 在 [Render](https://render.com) 建立新的 Static Site
2. 連接您的 Git 儲存庫
3. 設定建置指令：`npm run build`
4. 設定發布目錄：`dist`
5. 新增環境變數（VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY）
6. 點擊部署

### 其他平台

也支援部署到：
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: 設定 GitHub Actions workflow

## 🐛 常見問題

### 資料庫連線失敗

**問題**: `Could not find the table 'public.exercises'`

**解決方案**: 
1. 確認已執行 `database/setup.sql`
2. 檢查 Supabase Dashboard → Table Editor 是否有 `exercises` 資料表
3. 驗證 `.env` 中的 Supabase URL 和 Key 是否正確

### 開發伺服器無法啟動

**問題**: Port 5173 already in use

**解決方案**:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# 或修改 vite.config.js 使用其他 port
```

### 測試失敗

**問題**: Tests timeout or fail

**解決方案**:
1. 清除快取：`npm run test -- --clearCache`
2. 重新安裝依賴：`rm -rf node_modules && npm install`
3. 檢查 Node.js 版本：`node -v` (需要 >= 18.0.0)

## 📚 相關文件

- [架構文件](./docs/architecture.md) - 技術架構和設計決策
- [CMS 管理員手冊](./docs/cms-guide.md) - 運動資料管理指南
- [資料庫設定](./database/README.md) - 資料庫初始化說明
- [專案需求文件](../PRD.md) - 產品需求規格
- [技術規格文件](../TECH.md) - 技術實作細節

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款。

## 👥 聯絡方式

如有問題或建議，請：

- 開啟 GitHub Issue
- 或聯絡專案維護者

## 🎯 路線圖

### 短期（3-6 個月）
- [ ] 用戶認證與個人化歷史記錄
- [ ] 課表收藏和分享功能
- [ ] 更多訓練目標選項
- [ ] 進階篩選器（排除特定器材）

### 中期（6-12 個月）
- [ ] 行動應用程式 (React Native)
- [ ] 社群功能（評論、評分）
- [ ] AI 推薦演算法優化
- [ ] 多語言支援

### 長期（1 年以上）
- [ ] 教練付費服務
- [ ] 營養計畫整合
- [ ] 健身追蹤與數據分析
- [ ] VR/AR 訓練體驗

---

**建立於** 2025 | **技術堆疊** React + TypeScript + Vite + Supabase

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
