interface PlayerControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/**
 * 播放器控制按鈕元件
 * 提供播放/暫停、上一個/下一個、退出等控制
 */
export function PlayerControls({
  isPaused,
  onPlayPause,
  onNext,
  onPrevious,
  onExit,
  canGoPrevious,
  canGoNext,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* 上一個 */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="上一個運動"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 播放/暫停 */}
      <button
        onClick={onPlayPause}
        className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
        aria-label={isPaused ? '繼續' : '暫停'}
      >
        {isPaused ? (
          // 播放圖示
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          // 暫停圖示
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        )}
      </button>

      {/* 下一個/跳過 */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="跳過"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 退出 */}
      <button
        onClick={onExit}
        className="ml-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
        aria-label="退出訓練"
      >
        退出
      </button>
    </div>
  );
}
