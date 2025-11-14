interface CompletionScreenProps {
  workoutTitle: string;
  totalExercises: number;
  totalDurationMinutes: number;
  onRestart: () => void;
  onExit: () => void;
}

/**
 * 訓練完成畫面元件
 * 顯示完成訊息和統計資訊
 */
export function CompletionScreen({
  totalExercises,
  totalDurationMinutes,
  onRestart,
  onExit,
}: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* 成功圖示 */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 完成訊息 */}
        <h1 className="text-3xl font-bold text-white mb-2">訓練完成!</h1>
        <p className="text-gray-400 mb-8">恭喜你完成了今天的訓練</p>

        {/* 統計資訊 */}
        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">完成運動</p>
              <p className="text-2xl font-bold text-white">{totalExercises}</p>
              <p className="text-gray-400 text-xs">個項目</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">訓練時長</p>
              <p className="text-2xl font-bold text-white">{totalDurationMinutes}</p>
              <p className="text-gray-400 text-xs">分鐘</p>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            再練一次
          </button>
          <button
            onClick={onExit}
            className="w-full py-3 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
