import { useState, useEffect } from 'react';
import type { WorkoutPlan } from '../../types/dataModel';
import { usePlayer } from '../../hooks/usePlayer';
import { VideoPlayer } from './VideoPlayer';
import { Timer } from './Timer';
import { PlayerControls } from './PlayerControls';
import { CompletionScreen } from './CompletionScreen';

interface TrainingPlayerProps {
  workoutPlan: WorkoutPlan;
  onExit: () => void;
}

/**
 * 訓練播放器主元件
 * 整合影片播放、計時器、控制按鈕等功能
 */
export function TrainingPlayer({ workoutPlan, onExit }: TrainingPlayerProps) {
  const player = usePlayer(workoutPlan);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 鍵盤快捷鍵
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          if (player.isPaused) {
            player.resume();
          } else {
            player.pause();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.previous();
          break;
        case 'Escape':
          e.preventDefault();
          setShowExitConfirm(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  // 播放/暫停切換
  const handlePlayPause = () => {
    if (player.isPaused) {
      player.resume();
    } else {
      player.pause();
    }
  };

  // 退出確認
  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleExitConfirm = () => {
    onExit();
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
  };

  // 顯示完成畫面
  if (player.isCompleted) {
    return (
      <CompletionScreen
        workoutTitle={`${workoutPlan.preferences.trainingGoal} 訓練`}
        totalExercises={player.totalExercises}
        totalDurationMinutes={workoutPlan.estimatedDurationMinutes}
        onRestart={player.reset}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* 標題列 */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            運動 {player.currentExerciseIndex + 1} / {player.totalExercises}
          </h1>
          <span className="text-gray-400 text-sm">
            {workoutPlan.preferences.trainingGoal}
          </span>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 影片播放器 */}
        <VideoPlayer
          exercise={player.currentExercise.exercise}
          isPlaying={player.isPlaying}
        />

        {/* 運動資訊 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">
            {player.currentExercise.exercise.name}
          </h2>
          <div className="flex gap-6 text-gray-300">
            <div>
              <span className="text-sm text-gray-400">組數</span>
              <p className="text-xl font-semibold">{player.currentExercise.sets} 組</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">次數</span>
              <p className="text-xl font-semibold">{player.currentExercise.reps} 次</p>
            </div>
            {player.currentExercise.restSeconds > 0 && (
              <div>
                <span className="text-sm text-gray-400">休息</span>
                <p className="text-xl font-semibold">{player.currentExercise.restSeconds} 秒</p>
              </div>
            )}
          </div>
          {player.currentExercise.exercise.description && (
            <p className="mt-4 text-gray-400 text-sm">
              {player.currentExercise.exercise.description}
            </p>
          )}
        </div>

        {/* 計時器 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <Timer
            remainingSeconds={player.remainingSeconds}
            totalSeconds={player.totalSeconds}
            formattedTime={player.formattedTime}
            progressPercent={player.progressPercent}
          />
        </div>

        {/* 控制按鈕 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <PlayerControls
            isPlaying={player.isPlaying}
            isPaused={player.isPaused}
            onPlayPause={handlePlayPause}
            onNext={player.next}
            onPrevious={player.previous}
            onExit={handleExitClick}
            canGoPrevious={player.currentExerciseIndex > 0}
            canGoNext={player.currentExerciseIndex < player.totalExercises - 1 || !player.isCompleted}
          />
        </div>
      </div>

      {/* 退出確認對話框 */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">確定要退出訓練嗎?</h3>
            <p className="text-gray-400 mb-6">你的訓練進度將不會被保存</p>
            <div className="flex gap-3">
              <button
                onClick={handleExitCancel}
                className="flex-1 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
