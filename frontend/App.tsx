import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AppScreen, UserPreferences, PlanItem } from './types/app';
import { SetupScreen } from './components/setup/SetupScreen';
import { PlanOverviewScreen } from './components/plan/PlanOverviewScreen';
import { PlayerScreen } from './components/player/PlayerScreen';
import { CompletedScreen } from './components/player/CompletedScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { HistoryListScreen } from './components/dashboard/HistoryListScreen';
import { Button } from './components/ui/Button';
import { Dumbbell, User, LogOut } from 'lucide-react';
import { generateWorkoutPlan } from './features/generator/engine';

/**
 * 自訂登入提示 Modal
 */
const LoginPromptModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-brand-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-brand-dark" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-2">需要登入</h3>
          <p className="text-gray-600">
            登入後即可查看個人資料、儲存訓練紀錄並追蹤長期進度
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            稍後再說
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl bg-brand-dark text-white font-bold hover:bg-brand-dark/90 transition shadow-lg"
          >
            立即登入
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Header 組件 (Header Component)
 * 
 * 應用程式頂端導覽列，包含品牌 Logo 與使用者資訊
 */
const Header: React.FC<{
  currentScreen: AppScreen;
  onNavigateToProfile: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToLogin: () => void;
  onSignOut?: () => void;
}> = ({ currentScreen, onNavigateToProfile, onNavigateToDashboard, onNavigateToLogin, onSignOut }) => {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAvatarClick = () => {
    if (user) {
      onNavigateToProfile();
    } else {
      // 顯示自訂登入提示 Modal
      setShowLoginPrompt(true);
    }
  };

  const handleLoginConfirm = () => {
    setShowLoginPrompt(false);
    onNavigateToLogin();
  };

  return (
    <>
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onConfirm={handleLoginConfirm}
      />
      <header className="bg-brand-dark text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToDashboard}>
          <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center text-brand-dark font-bold shadow-inner">
            <Dumbbell size={18} strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Virtual <span className="text-white">Coach</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span className="hidden sm:inline">Phase 2 v2.0</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAvatarClick}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
              title={user ? '個人資料' : '點擊登入'}
            >
              <User size={16} />
            </button>
            {user && onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs"
              >
                <LogOut size={14} className="inline mr-1" />
                登出
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

/**
 * HomeScreen 組件 (Home Screen Component)
 */
const HomeScreen: React.FC<{
  onStart: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}> = ({ onStart, onLogin, isLoggedIn }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-10 animate-fade-in relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-light/20 rounded-full blur-3xl -z-10"></div>

    <div className="space-y-6 max-w-2xl">
      <div className="inline-block px-3 py-1 bg-brand-light/30 text-brand-dark text-sm font-bold rounded-full mb-2 border border-brand-light/50">
        ✨ 24小時待命的私人教練
      </div>
      <h2 className="text-5xl font-extrabold text-brand-dark sm:text-6xl leading-tight">
        專屬你的<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-mid">
          虛擬健身教練
        </span>
      </h2>
      <p className="text-xl text-brand-gray leading-relaxed max-w-lg mx-auto">
        {isLoggedIn ? '歡迎回來！' : '無需登入，無需昂貴費用。'}<br />
        只要告訴我們目標，立即為您生成<span className="font-bold text-brand-dark underline decoration-brand-light decoration-4 underline-offset-2">科學化課表</span>。
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <Button
        onClick={onStart}
        size="lg"
        className="text-xl px-10 py-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
      >
        立即開始訓練
      </Button>

      {!isLoggedIn && (
        <button
          onClick={onLogin}
          className="text-brand-dark hover:underline text-sm"
        >
          或登入以追蹤進度 →
        </button>
      )}
    </div>

    <div className="flex gap-8 text-sm text-brand-gray/60 pt-8">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-brand-light"></span> 免費使用
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-brand-light"></span> 無需器材
      </div>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-brand-light"></span> 客製化
      </div>
    </div>
  </div>
);

/**
 * GeneratingScreen 組件
 */
const GeneratingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-brand-light/30 border-t-brand-dark rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Dumbbell className="text-brand-dark animate-pulse" size={20} />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-xl font-bold text-brand-dark">正在規劃您的課表...</h3>
      <p className="text-brand-gray">AI 正在挑選最適合您的動作組合</p>
    </div>
  </div>
);

/**
 * App 主組件 (Main App Component)
 */
export default function App() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<PlanItem[]>([]);

  // 如果 Auth 還在載入，顯示 loading 畫面
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-light border-t-brand-dark rounded-full animate-spin mx-auto"></div>
          <p className="text-brand-gray">載入中...</p>
        </div>
      </div>
    );
  }

  /**
   * 處理偏好設定完成事件
   */
  const handleSetupComplete = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setCurrentScreen('generating');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const plan = await generateWorkoutPlan(prefs);
      setWorkoutPlan(plan);
      setCurrentScreen('overview');
    } catch (error) {
      console.error("生成失敗", error);
      alert("抱歉，生成課表時發生錯誤，請稍後再試。");
      setCurrentScreen('home');
    }
  };

  /**
   * 處理登出
   */
  const handleSignOut = async () => {
    if (confirm('確定要登出嗎？')) {
      await signOut();
      setCurrentScreen('home');
    }
  };

  // 若在 auth 畫面
  if (currentScreen === 'login' || currentScreen === 'register') {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        {currentScreen === 'login' ? (
          <LoginScreen
            onSwitchToRegister={() => setCurrentScreen('register')}
            onGuestMode={() => setCurrentScreen('home')}
            onLoginSuccess={() => setCurrentScreen('dashboard')}
          />
        ) : (
          <RegisterScreen
            onSwitchToLogin={() => setCurrentScreen('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* 訓練模式時隱藏 Header */}
      {currentScreen !== 'workout' && (
        <Header
          currentScreen={currentScreen}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onNavigateToDashboard={() => user ? setCurrentScreen('dashboard') : setCurrentScreen('home')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onSignOut={user ? handleSignOut : undefined}
        />
      )}

      <main className={`flex-1 w-full ${currentScreen !== 'workout' ? 'container mx-auto max-w-4xl p-4' : ''}`}>

        {currentScreen === 'home' && (
          <HomeScreen
            onStart={() => setCurrentScreen('setup')}
            onLogin={() => setCurrentScreen('login')}
            isLoggedIn={!!user}
          />
        )}

        {currentScreen === 'setup' && (
          <SetupScreen
            onComplete={handleSetupComplete}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'generating' && <GeneratingScreen />}

        {currentScreen === 'overview' && workoutPlan.length > 0 && (
          <PlanOverviewScreen
            plan={workoutPlan}
            preferences={preferences}
            onStart={() => setCurrentScreen('workout')}
            onBack={() => setCurrentScreen('setup')}
          />
        )}

        {currentScreen === 'workout' && workoutPlan.length > 0 && (
          <PlayerScreen
            plan={workoutPlan}
            onComplete={() => setCurrentScreen('completed')}
            onExit={() => {
              if (confirm('確定要結束訓練嗎？')) setCurrentScreen('home');
            }}
          />
        )}

        {currentScreen === 'completed' && preferences && (
          <CompletedScreen
            durationMinutes={preferences.durationMinutes}
            workoutPlan={workoutPlan}
            onHome={() => setCurrentScreen(user ? 'dashboard' : 'home')}
          />
        )}

        {currentScreen === 'dashboard' && user && (
          <DashboardScreen
            onNavigateToHistory={() => setCurrentScreen('history')}
            onNavigateToProfile={() => setCurrentScreen('profile')}
            onStartWorkout={() => setCurrentScreen('setup')}
          />
        )}

        {currentScreen === 'history' && user && (
          <HistoryListScreen
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'profile' && user && (
          <ProfileScreen
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
      </main>

      {currentScreen === 'home' && (
        <footer className="py-6 text-center text-brand-gray/50 text-sm">
          &copy; {new Date().getFullYear()} Virtual Fitness Coach. Built for Trainees.
        </footer>
      )}
    </div>
  );
}