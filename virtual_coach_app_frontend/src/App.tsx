import { useState } from 'react';
import { WorkoutProvider, useWorkoutContext } from './contexts/WorkoutContext';
import { PreferenceForm } from './components/preferences/PreferenceForm';
import { WorkoutList } from './components/workout/WorkoutList';
import { TrainingPlayer } from './components/player/TrainingPlayer';
import { Loading } from './components/common/Loading';
import { Toast, ToastType } from './components/common/Toast';
import type { UserPreferences } from './types/dataModel';
import './App.css';

/**
 * 主應用組件（內部）
 */
function AppContent() {
  const {
    exercisesLoading,
    exercisesError,
    workoutPlan,
    isGenerating,
    generationError,
    generatePlan,
    clearPlan,
  } = useWorkoutContext();

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isTrainingMode, setIsTrainingMode] = useState(false);

  /**
   * 處理偏好表單提交
   */
  const handlePreferenceSubmit = async (preferences: UserPreferences) => {
    try {
      await generatePlan(preferences);
      setToast({
        type: 'success',
        message: '訓練計畫生成成功！',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: generationError || '生成訓練計畫時發生錯誤',
      });
    }
  };

  /**
   * 處理重新生成
   */
  const handleRegenerate = () => {
    clearPlan();
    setToast({
      type: 'info',
      message: '已清除訓練計畫，請重新設定偏好',
    });
  };

  /**
   * 處理開始訓練
   */
  const handleStartTraining = () => {
    if (!workoutPlan) {
      setToast({
        type: 'error',
        message: '請先生成訓練計畫',
      });
      return;
    }
    setIsTrainingMode(true);
  };

  /**
   * 處理退出訓練
   */
  const handleExitTraining = () => {
    setIsTrainingMode(false);
    setToast({
      type: 'info',
      message: '已退出訓練模式',
    });
  };

  // 載入運動資料中
  if (exercisesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Loading size="lg" message="載入運動資料中..." />
      </div>
    );
  }

  // 載入運動資料失敗
  if (exercisesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900">載入失敗</h2>
            <p className="mt-2 text-gray-600">{exercisesError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* 訓練模式：全屏播放器 */}
      {isTrainingMode && workoutPlan ? (
        <TrainingPlayer
          workoutPlan={workoutPlan}
          onExit={handleExitTraining}
        />
      ) : (
        <>
          {/* 標題 */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Coach App</h1>
            <p className="text-gray-600">您的個人化健身訓練助手</p>
          </header>

          {/* 主要內容 */}
          <main className="max-w-4xl mx-auto">
            {!workoutPlan ? (
              /* 顯示偏好設定表單 */
              <PreferenceForm
                onSubmit={handlePreferenceSubmit}
                isLoading={isGenerating}
              />
            ) : (
              /* 顯示訓練計畫 */
              <WorkoutList
                workoutPlan={workoutPlan}
                onStartTraining={handleStartTraining}
                onRegenerate={handleRegenerate}
              />
            )}

            {/* 生成中的載入狀態 */}
            {isGenerating && (
              <div className="mt-8">
                <Loading size="md" message="正在生成您的專屬訓練計畫..." />
              </div>
            )}
          </main>
        </>
      )}

      {/* Toast 通知 */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

/**
 * 主應用組件（包裝 Provider）
 */
function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}

export default App;
