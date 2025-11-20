import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { UserPlus } from 'lucide-react';

/**
 * RegisterScreen 組件 (Register Screen Component)
 * 
 * 使用者註冊介面，支援 Email/Password 註冊
 * 
 * @param {Object} props - 組件 Props
 * @param {Function} props.onSwitchToLogin - 切換至登入頁面的回調
 */
export const RegisterScreen: React.FC<{
    onSwitchToLogin: () => void;
}> = ({ onSwitchToLogin }) => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) return '密碼至少需要 6 個字元';
        if (!/[A-Za-z]/.test(pwd)) return '密碼需包含至少一個英文字母';
        if (!/[0-9]/.test(pwd)) return '密碼需包含至少一個數字';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 驗證密碼
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('密碼與確認密碼不符');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, displayName || undefined);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || '註冊失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark">註冊成功！</h2>
                    <p className="text-brand-gray">
                        請檢查您的 Email 信箱以驗證帳號。<br />
                        驗證後即可登入使用。
                    </p>
                    <Button onClick={onSwitchToLogin} className="w-full">
                        前往登入
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-brand-dark" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-brand-dark">建立帳號</h2>
                    <p className="text-brand-gray">開始追蹤你的健身進度</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-brand-dark mb-1">
                            顯示名稱 (選填)
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-light focus:border-brand-light outline-none transition"
                            placeholder="例如：阿明"
                        />
                    </div>

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
                            placeholder="至少 6 個字元，包含英文與數字"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-dark mb-1">
                            確認密碼
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-light focus:border-brand-light outline-none transition"
                            placeholder="再次輸入密碼"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? '註冊中...' : '註冊'}
                    </Button>
                </form>

                {/* Password Strength Hint */}
                <div className="text-xs text-brand-gray space-y-1 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">密碼強度要求：</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>至少 6 個字元</li>
                        <li>包含至少一個英文字母</li>
                        <li>包含至少一個數字</li>
                    </ul>
                </div>

                {/* Switch to Login */}
                <div className="text-center text-sm text-brand-gray">
                    已經有帳號了？{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-brand-dark font-medium hover:underline"
                    >
                        立即登入
                    </button>
                </div>
            </div>
        </div>
    );
};
