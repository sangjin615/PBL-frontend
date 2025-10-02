/**
 * API 설정 파일
 * 환경변수와 기본값을 관리합니다.
 */

// 환경변수에서 API URL 가져오기, 없으면 기본값 사용
const getApiBaseUrl = (): string => {
  // Vite 환경변수는 VITE_ 접두사가 필요
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:2358';
};

// Judge0 API 설정
export const judge0Config = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    submissions: '/submissions',
    grading: '/grading',
    languages: '/languages',
    statuses: '/statuses'
  },
  timeout: 30000, // 30초
  retryAttempts: 3
};

// 백엔드 API 설정 (추후 확장 가능)
export const backendConfig = {
  baseUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8080',
  endpoints: {
    lectures: '/api/lectures',
    problems: '/api/problems',
    submissions: '/api/submissions'
  }
};

// 전체 API 설정
export const apiConfig = {
  judge0: judge0Config,
  backend: backendConfig,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

export default apiConfig;