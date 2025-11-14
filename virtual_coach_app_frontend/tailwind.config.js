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
