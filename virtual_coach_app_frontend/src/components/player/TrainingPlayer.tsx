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
    const goalName = workoutPlan.preferences.trainingGoal === 'weight_loss' ? '減脂' : 
                     workoutPlan.preferences.trainingGoal === 'muscle_gain' ? '增肌' : 
                     workoutPlan.preferences.trainingGoal === 'endurance' ? '耐力' : 
                     workoutPlan.preferences.trainingGoal;
    return (
      <CompletionScreen
        workoutTitle={`${goalName} 訓練`}
        totalExercises={player.totalExercises}
        totalDurationMinutes={workoutPlan.estimatedDurationMinutes}
        onRestart={player.reset}
        onExit={onExit}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 30%, #A5D6A7 60%, #81C784 100%)',
      color: '#1B5E20',
      padding: 0,
      position: 'relative',
      overflowX: 'hidden', // Only hide horizontal overflow
      overflowY: 'auto', // Allow vertical scrolling
    }}>
      {/* 頂部運動資訊覆蓋層 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px', // Reduced padding
        background: 'linear-gradient(to bottom, rgba(129, 199, 132, 0.8), transparent)',
        zIndex: 10,
        pointerEvents: 'none', // Allow clicks to pass through
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1B5E20' }}>
            運動 {player.currentExerciseIndex + 1} / {player.totalExercises}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E7D32' }}>
            {workoutPlan.preferences.trainingGoal === 'weight_loss' ? '減脂' : 
             workoutPlan.preferences.trainingGoal === 'muscle_gain' ? '增肌' : 
             workoutPlan.preferences.trainingGoal === 'endurance' ? '耐力' : 
             workoutPlan.preferences.trainingGoal}
          </div>
        </div>
      </div>

      {/* 全螢幕內容區 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        paddingTop: '120px', // Fixed top padding for header
        paddingBottom: '32px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
      className="training-player-content">
        {/* 影片播放器 */}
        <VideoPlayer
          exercise={player.currentExercise.exercise}
          isPlaying={player.isPlaying}
        />

        {/* 運動資訊 (半透明綠色覆蓋) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px', // Reduced from 32px on mobile
          boxShadow: '0 8px 32px rgba(27, 94, 32, 0.2)',
          border: '2px solid #81C784',
          maxWidth: '800px',
          width: '100%',
          marginTop: '24px'
        }}
        className="training-player-info">
          <h2 style={{ 
            fontSize: '28px', // Scaled down from 32px
            fontWeight: 700, 
            marginBottom: '20px', 
            color: '#1B5E20' 
          }}>
            {player.currentExercise.exercise.name}
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '32px', // Reduced from 40px
            justifyContent: 'center', 
            marginBottom: '16px',
            flexWrap: 'wrap', // Allow wrapping on small screens
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#757575', fontWeight: 600, textTransform: 'uppercase' }}>組數</span>
              <p style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#66BB6A' }}>{player.currentExercise.sets}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#757575', fontWeight: 600, textTransform: 'uppercase' }}>次數</span>
              <p style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#66BB6A' }}>{player.currentExercise.reps}</p>
            </div>
            {player.currentExercise.restSeconds > 0 && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#757575', fontWeight: 600, textTransform: 'uppercase' }}>休息</span>
                <p style={{ fontSize: '28px', fontWeight: 700, marginTop: '8px', color: '#66BB6A' }}>{player.currentExercise.restSeconds}s</p>
              </div>
            )}
          </div>
          {player.currentExercise.exercise.description && (
            <p style={{ marginTop: '20px', color: '#616161', fontSize: '14px', lineHeight: 1.6, textAlign: 'center' }}>
              {player.currentExercise.exercise.description}
            </p>
          )}
        </div>

        {/* 計時器 (透明背景) */}
        <div style={{ marginTop: '40px' }} className="training-player-timer">
          <Timer
            remainingSeconds={player.remainingSeconds}
            totalSeconds={player.totalSeconds}
            formattedTime={player.formattedTime}
            progressPercent={player.progressPercent}
          />
        </div>

        {/* 控制按鈕 (固定底部) */}
        <div>
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
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(27, 94, 32, 0.75)', // Matcha green overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            margin: '0 16px',
            boxShadow: '0 20px 60px rgba(27, 94, 32, 0.3)',
            border: '2px solid #81C784'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#1B5E20'
            }}>
              確定要退出訓練嗎?
            </h3>
            <p style={{
              color: '#2E7D32',
              marginBottom: '24px',
              fontSize: '15px',
              lineHeight: 1.6
            }}>
              你的訓練進度將不會被保存
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleExitCancel}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #81C784',
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F8E9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                取消
              </button>
              <button
                onClick={handleExitConfirm}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: '#C62828',
                  border: '2px solid #B71C1C',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B71C1C';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C62828';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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
