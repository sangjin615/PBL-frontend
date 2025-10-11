/**
 * API 설정 파일
 * 환경변수와 기본값을 관리합니다.
 */

const PROTOCOL = 'http://';
export const URL_PREFIX = 'localhost';
export const URL_PORT = 2358;

// 환경변수에서 API URL 가져오기, 없으면 기본값 사용
const getApiBaseUrl = (): string => {
  // Vite 환경변수는 VITE_ 접두사가 필요
  return import.meta.env.VITE_API_BASE_URL || `${PROTOCOL}${URL_PREFIX}:${URL_PORT}`;
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
  baseUrl: getApiBaseUrl(),
  endpoints: {
    lectures: '/api/lectures',
    curriculums: '/api/curriculums',
    problems: '/api/problems',
    submissions: '/api/submissions',
    aiGrading: '/chat/grading'
  }
};

// 인증 설정
export const authConfig = {
  enabled: false, // 개발 중에는 false로 설정 (백엔드에서 인증 무시)
  headerName: 'X-User-Id',
  defaultUserId: 1 // 개발용 기본 사용자 ID
};

// 전체 API 설정
export const apiConfig = {
  judge0: judge0Config,
  backend: backendConfig,
  auth: authConfig,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

export default apiConfig;