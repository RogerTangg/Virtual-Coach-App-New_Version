import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LogIn, UserPlus } from 'lucide-react';

/**
 * LoginScreen 組件 (Login Screen Component)
 * 
 * 使用者登入介面，支援 Email/Password 登入
 * 
 * @param {Object} props - 組件 Props
 * @param {Function} props.onSwitchToRegister - 切換至註冊頁面的回調
 * @param {Function} props.onGuestMode - 以訪客模式繼續的回調
 */
export const LoginScreen: React.FC<{
    onSwitchToRegister: () => void;
    onGuestMode: () => void;
    onLoginSuccess: () => void;
}> = ({ onSwitchToRegister, onGuestMode, onLoginSuccess }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || '登入失敗，請檢查帳號密碼');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="text-brand-dark" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark">歡迎回來</h2>
                    <p className="text-brand-gray">登入以查看訓練歷史與數據</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-1">
                            Email 地址
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-light focus:border-brand-light outline-none transition"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-1">
                            密碼
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-light focus:border-brand-light outline-none transition"
                            placeholder="至少 6 個字元"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? '登入中...' : '登入'}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative bg-white px-4 text-sm text-brand-gray">或</div>
                </div>

                {/* Guest Mode */}
                <button
                    onClick={onGuestMode}
                    className="w-full px-4 py-3 text-brand-dark hover:bg-gray-50 border border-gray-300 rounded-lg transition font-medium"
                >
                    訪客模式 (無需登入)
                </button>

                {/* Switch to Register */}
                <div className="text-center text-sm text-brand-gray">
                    還沒有帳號？{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-brand-dark font-medium hover:underline"
                    >
                        立即註冊
                    </button>
                </div>
            </div>
        </div>
    );
};
