import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkoutPlan, WorkoutExercise } from '../types/dataModel';

export interface PlayerState {
  // 當前運動
  currentExerciseIndex: number;
  currentExercise: WorkoutExercise;
  
  // 播放狀態
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  
  // 時間追蹤
  remainingSeconds: number;
  totalSeconds: number;
  elapsedSeconds: number;
  formattedTime: string;
  
  // 進度
  progressPercent: number;
  totalExercises: number;
  
  // 控制方法
  play: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
}

/**
 * 訓練播放器 Hook
 * 管理訓練過程的狀態和計時邏輯
 */
export function usePlayer(workoutPlan: WorkoutPlan): PlayerState {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = workoutPlan.exercises[currentExerciseIndex] || workoutPlan.exercises[0];
  const totalExercises = workoutPlan.exercises.length;

  // 計算總時間（所有運動的總秒數）
  const totalSeconds = workoutPlan.exercises.reduce(
    (sum, item) => sum + (item.exercise.duration_seconds || 0),
    0
  );

  // 格式化時間為 MM:SS 或 M:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formattedTime = formatTime(remainingSeconds);

  // 計算進度百分比
  const progressPercent = totalSeconds > 0 
    ? Math.round((elapsedSeconds / totalSeconds) * 100)
    : 0;

  // 初始化當前運動的剩餘時間
  useEffect(() => {
    if (currentExercise) {
      setRemainingSeconds(currentExercise.exercise.duration_seconds || 0);
    }
  }, [currentExerciseIndex, currentExercise]);

  // 計時器邏輯
  useEffect(() => {
    if (isCompleted || !isPlaying || isPaused || totalExercises === 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // 自動切換到下一個運動
          setCurrentExerciseIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= totalExercises) {
              setIsCompleted(true);
              setIsPlaying(false);
              return prevIndex;
            }
            return nextIndex;
          });
          return 0;
        }
        setElapsedSeconds((e) => e + 1);
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, isCompleted, currentExerciseIndex, totalExercises]);

  // 控制方法
  const play = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  const next = useCallback(() => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setElapsedSeconds((prev) => prev + remainingSeconds);
    } else {
      // 已經是最後一個運動，標記為完成
      setIsCompleted(true);
      setIsPlaying(false);
    }
  }, [currentExerciseIndex, totalExercises, remainingSeconds]);

  const previous = useCallback(() => {
    if (currentExerciseIndex > 0) {
      const newIndex = currentExerciseIndex - 1;
      setCurrentExerciseIndex(newIndex);
      // 調整已過時間 - 使用新索引而非舊索引
      const currentExerciseDuration = workoutPlan.exercises[currentExerciseIndex]?.exercise.duration_seconds || 0;
      setElapsedSeconds((prev) => Math.max(0, prev - currentExerciseDuration + remainingSeconds));
    }
  }, [currentExerciseIndex, workoutPlan.exercises, remainingSeconds]);

  const reset = useCallback(() => {
    setCurrentExerciseIndex(0);
    setRemainingSeconds(workoutPlan.exercises[0]?.exercise.duration_seconds || 0);
    setElapsedSeconds(0);
    setIsPlaying(true);
    setIsPaused(false);
    setIsCompleted(false);
  }, [workoutPlan.exercises]);

  // 處理空計畫
  useEffect(() => {
    if (totalExercises === 0) {
      setIsCompleted(true);
      setIsPlaying(false);
    }
  }, [totalExercises]);

  return {
    currentExerciseIndex,
    currentExercise,
    isPlaying,
    isPaused,
    isCompleted,
    remainingSeconds,
    totalSeconds,
    elapsedSeconds,
    formattedTime,
    progressPercent,
    totalExercises,
    play,
    pause,
    resume,
    next,
    previous,
    reset,
  };
}
