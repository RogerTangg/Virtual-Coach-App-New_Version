import React, { useState, useEffect, useRef } from 'react';
import { PlanItem } from '../../types/app';
import { Play, Pause, SkipForward, X, Volume2, VolumeX, Info, ChevronRight, FastForward, AlertTriangle } from 'lucide-react';
import { useWakeLock } from '../../hooks/useWakeLock';
import { playShortBeep, playLongBeep } from '../../utils/audio';

/**
 * 自訂退出確認對話框
 */
const ExitConfirmModal: React.FC<{
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-8 max-w-md mx-4 border border-white/10 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/30">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">確定要退出嗎？</h3>
          <p className="text-gray-400 leading-relaxed">
            訓練進度將不會被儲存<br />
            確定要放棄當前訓練嗎？
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition border border-white/10"
          >
            繼續訓練
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/30"
          >
            確定退出
          </button>
        </div>
      </div>
    </div>
  );
};

interface PlayerScreenProps {
  plan: PlanItem[];
  onComplete: () => void;
  onExit: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ plan, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(plan[0].duration);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 啟用螢幕喚醒鎖定
  useWakeLock();

  const currentItem = plan[currentIndex];
  const nextItem = plan[currentIndex + 1];
  const timerRef = useRef<number | null>(null);

  // 語音合成 (TTS)
  const speak = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  // 初始化目前動作
  useEffect(() => {
    setTimeLeft(currentItem.duration);
    if (currentItem.type === 'exercise') {
      speak(`準備，${currentItem.title}`);
    } else {
      speak('休息一下');
    }
  }, [currentIndex, currentItem]);

  // 計時器與音效邏輯
  useEffect(() => {
    if (isPaused) return;

    if (timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      if (soundEnabled && timeLeft <= 3) {
        playShortBeep();
      }
    } else {
      if (soundEnabled) playLongBeep();
      if (currentIndex < plan.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isPaused, currentIndex, plan.length, onComplete, soundEnabled]);

  const togglePause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPaused(!isPaused);
  };

  const skipItem = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < plan.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const skipToEnd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onComplete();
  };

  const handleExitClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex) / plan.length) * 100;

  return (
    <>
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
        onConfirm={confirmExit}
      />
      <div className="fixed inset-0 z-50 flex flex-col bg-[#0f1205] text-white overflow-hidden select-none font-sans">
        {/* 背景裝飾光暈 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-dark/40 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-mid/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* 頂部進度條 (極細發光風格) */}
        <div className="absolute top-0 left-0 w-full h-1 z-50 bg-gray-800">
          <div
            className="h-full bg-brand-light shadow-[0_0_10px_#D4EB85] transition-all duration-500 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header 區塊 */}
        <div className="flex-shrink-0 px-6 py-4 flex justify-between items-center relative z-40">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-light/70 uppercase tracking-widest font-bold">Workout Progress</span>
            <span className="text-sm font-medium text-white/90 tracking-wide">
              {currentIndex + 1} <span className="text-gray-500">/</span> {plan.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 backdrop-blur-md"
            >
              {soundEnabled ? <Volume2 size={20} className="text-brand-light" /> : <VolumeX size={20} className="text-gray-400" />}
            </button>
            <button
              onClick={handleExitClick}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-white/5 backdrop-blur-md group"
            >
              <X size={20} className="text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* 主要內容區 - 響應式佈局 */}
        <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">

          {/* 左側：視覺與資訊區 - 增加寬度和高度佔比 */}
          <div className="w-full lg:w-3/4 h-[62vh] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-black/40 backdrop-blur-sm">

            {/* 影片播放器 - 最大化顯示，移除內邊距 */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden group bg-black/20">
              {currentItem.type === 'exercise' && currentItem.exercise ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={currentItem.exercise.video_url}
                    alt={currentItem.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-light/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full border-4 border-brand-light/30 flex items-center justify-center relative z-10 bg-black/50 backdrop-blur-md">
                      <span className="text-brand-light text-4xl lg:text-5xl font-bold tracking-widest">REST</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm tracking-widest uppercase">Take a breath</p>
                </div>
              )}

              {/* 暫停遮罩 */}
              {isPaused && (
                <div
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                  onClick={togglePause}
                >
                  <Pause size={64} className="text-brand-light mb-4 drop-shadow-[0_0_15px_rgba(212,235,133,0.6)]" />
                  <span className="text-2xl font-bold text-white tracking-widest uppercase">Paused</span>
                  <span className="text-sm text-gray-400 mt-2">Tap to resume</span>
                </div>
              )}
            </div>

            {/* 動作詳細說明 (左下) - 緊湊模式 */}
            {currentItem.type === 'exercise' && currentItem.exercise && (
              <div className="flex-shrink-0 bg-[#111]/90 border-t border-white/5 p-3 lg:p-6 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex gap-4 items-start">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0 text-brand-light border border-brand-light/20 mt-1">
                    <Info size={18} className="lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-brand-light font-bold text-[10px] lg:text-xs uppercase tracking-widest mb-1 opacity-90">
                      Instructions
                    </h3>
                    <p className="text-gray-300 text-sm lg:text-lg leading-relaxed font-medium line-clamp-2 lg:line-clamp-none">
                      {currentItem.exercise.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右側：計時與控制區 - 調整寬度佔比 */}
          <div className="w-full lg:w-1/4 flex-1 lg:flex-auto flex flex-col justify-between p-4 lg:p-8 bg-gradient-to-b from-brand-dark/95 to-black/95 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/5 relative">

            {/* 標題區 */}
            <div className="mt-1 lg:mt-8 text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-1 drop-shadow-lg truncate px-2">
                {currentItem.title}
              </h2>
              {currentItem.type === 'exercise' && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-brand-light/10 border border-brand-light/20 text-brand-light text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                  Exercise
                </span>
              )}
            </div>

            {/* 巨大計時器 - 行動版縮小字體以適應空間 */}
            <div
              className="flex flex-col items-center lg:items-start justify-center py-2 lg:py-6 cursor-pointer select-none"
              onClick={togglePause}
            >
              <div className={`
              font-mono font-bold leading-none tracking-tighter transition-all duration-200 tabular-nums
              text-[5rem] sm:text-[7rem] lg:text-[8rem] xl:text-[9rem]
              ${timeLeft <= 3 ? 'text-red-400 drop-shadow-[0_0_25px_rgba(248,113,113,0.6)]' : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]'}
            `}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-500 text-[10px] lg:text-xs uppercase tracking-[0.2em] font-semibold mt-1">Time Remaining</p>
            </div>

            {/* 底部控制區 */}
            <div className="space-y-4 lg:space-y-8 mb-1 lg:mb-6">
              {/* Next Up 卡片 */}
              {nextItem && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Up Next</span>
                    <span className="text-white font-bold text-sm truncate max-w-[150px]">{nextItem.title}</span>
                  </div>
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-brand-light/20 flex items-center justify-center text-brand-light">
                    <ChevronRight size={16} className="lg:w-[18px] lg:h-[18px]" />
                  </div>
                </div>
              )}

              {/* 控制按鈕群 */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={skipToEnd}
                  className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-orange-500/20 text-orange-400 border-2 border-orange-500/30 flex items-center justify-center hover:bg-orange-500/30 hover:border-orange-500/50 active:scale-95 transition-all"
                  title="快速跳過"
                >
                  <FastForward size={18} className="lg:w-5 lg:h-5" />
                </button>

                <button
                  onClick={togglePause}
                  className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-brand-light text-brand-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,235,133,0.4)] hover:shadow-[0_0_40px_rgba(212,235,133,0.6)]"
                  title={isPaused ? "繼續" : "暫停"}
                >
                  {isPaused ? <Play size={28} fill="currentColor" className="ml-1 lg:w-8 lg:h-8" /> : <Pause size={28} fill="currentColor" className="lg:w-8 lg:h-8" />}
                </button>

                <button
                  onClick={skipItem}
                  className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-transparent text-white border-2 border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all"
                  title="跳過此動作"
                >
                  <SkipForward size={18} className="lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};