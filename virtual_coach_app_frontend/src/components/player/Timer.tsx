interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  formattedTime: string;
  progressPercent: number;
}

/**
 * 倒數計時器元件
 * 顯示剩餘時間和進度條
 */
export function Timer({ remainingSeconds, totalSeconds, formattedTime, progressPercent }: TimerProps) {
  return (
    <div className="w-full">
      {/* 倒數計時 */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-400 mb-2">剩餘時間</p>
        <p className="text-5xl font-bold text-white tabular-nums">
          {formattedTime}
        </p>
      </div>

      {/* 進度條 */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{totalSeconds - remainingSeconds}秒</span>
          <span>{totalSeconds}秒</span>
        </div>
        <div 
          className="w-full h-2 bg-gray-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="訓練進度"
        >
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-center text-xs text-gray-400 mt-2">
          {progressPercent}% 完成
        </div>
      </div>
    </div>
  );
}
