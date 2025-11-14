/**
 * 錯誤處理工具函式
 * 用於統一處理和記錄應用程式中的錯誤
 */

export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * 將未知錯誤轉換為 AppError 格式
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
    };
  }

  return {
    message: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    details: error,
  };
}

/**
 * 記錄錯誤到控制台 (開發環境) 或錯誤追蹤服務 (生產環境)
 */
export function logError(error: AppError): void {
  if (import.meta.env.MODE === 'development') {
    console.error('[AppError]', error);
  } else {
    // 生產環境可整合 Sentry 等錯誤追蹤服務
    console.error('[AppError]', error.message);
  }
}

/**
 * 處理錯誤：記錄並返回用戶友好的錯誤訊息
 */
export function handleError(error: unknown): string {
  const normalizedError = normalizeError(error);
  logError(normalizedError);

  // 根據錯誤代碼返回對應的用戶友好訊息
  switch (normalizedError.code) {
    case 'SUPABASE_ERROR':
      return '資料庫連線錯誤，請稍後再試';
    case 'NETWORK_ERROR':
      return '網路連線失敗，請檢查您的網路設定';
    case 'VALIDATION_ERROR':
      return '輸入資料驗證失敗，請檢查您的輸入';
    default:
      return normalizedError.message || '發生未知錯誤，請稍後再試';
  }
}
