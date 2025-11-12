/**
 * API 설정 파일
 * 환경변수와 기본값을 관리합니다.
 */

const PROTOCOL = "http://";
//export const URL_PREFIX = '158.180.73.5';
//export const URL_PREFIX = '114.201.56.70';
export const URL_PREFIX = "114.201.56.70";
export const URL_PORT = 2358;
export const MINIO_PORT = 9000;

// API URL 생성 (하드코딩된 상수 사용)
export const getApiBaseUrl = (): string => {
  return `${PROTOCOL}${URL_PREFIX}:${URL_PORT}`;
};

// MinIO URL 생성 (하드코딩된 상수 사용)
const getMinioBaseUrl = (): string => {
  return `${PROTOCOL}${URL_PREFIX}:${MINIO_PORT}`;
};

// Judge0 API 설정
export const judge0Config = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    submissions: "/submissions",
    grading: "/grading",
    languages: "/languages",
    statuses: "/statuses",
  },
  timeout: 30000, // 30초
  retryAttempts: 3,
};

// 백엔드 API 설정 (추후 확장 가능)
export const backendConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    auth: "/api/auth",
    lectures: "/api/lectures",
    curriculums: "/api/curriculums",
    s3: "/api/s3",
  },
};

// 인증 설정
export const authConfig = {
  enabled: true, // 개발 중에는 false로 설정 (백엔드에서 인증 무시)
  headerName: "X-User-Id",
  defaultUserId: 1, // 개발용 기본 사용자 ID
};

// 전역 사용자 ID 캐시 (로그인/로그아웃 시 업데이트)
let cachedUserId: number | null = null;
let lastStorageCheck: number = 0;
const STORAGE_CHECK_INTERVAL = 100; // 100ms마다 localStorage 체크

// 동적 사용자 ID 가져오기 함수
export function getCurrentUserId(): number | null {
  // 항상 localStorage에서 최신 값을 읽음 (캐시는 최적화용)
  const now = Date.now();
  const shouldUseCache =
    cachedUserId !== null &&
    now - lastStorageCheck < STORAGE_CHECK_INTERVAL &&
    !localStorage.getItem("loggedOut"); // 로그아웃 상태면 캐시 무시

  if (shouldUseCache) {
    return cachedUserId;
  }

  lastStorageCheck = now;

  // 로그아웃 상태 확인 (authConfig.enabled와 무관하게)
  if (localStorage.getItem("loggedOut") === "true") {
    cachedUserId = null;
    return null;
  }

  // 실제 사용자 정보가 있으면 해당 ID 사용
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const userId = user.id || null;
      cachedUserId = userId;
      return userId;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      cachedUserId = null;
      return null;
    }
  }

  // 개발 환경에서는 기본 사용자 ID 사용 (로그아웃 상태가 아닐 때만)
  if (authConfig.enabled === false) {
    cachedUserId = authConfig.defaultUserId;
    return authConfig.defaultUserId;
  }

  cachedUserId = null;
  return null;
}

// 사용자 ID 캐시 무효화 (로그인/로그아웃 시 호출)
export function invalidateUserIdCache(): void {
  cachedUserId = null;
  lastStorageCheck = 0;
}

// 전체 API 설정
export const apiConfig = {
  judge0: judge0Config,
  backend: backendConfig,
  auth: authConfig,
  minio: {
    baseUrl: getMinioBaseUrl(),
    bucketName: "pbl-images",
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default apiConfig;
