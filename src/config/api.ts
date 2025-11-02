/**
 * API 설정 파일
 * 환경변수와 기본값을 관리합니다.
 */

const PROTOCOL = "http://";
//export const URL_PREFIX = '158.180.73.5';
//export const URL_PREFIX = '114.201.56.70';
export const URL_PREFIX = "localhost";
export const URL_PORT = 2358;
export const MINIO_PORT = 9000;

// API URL 생성 (하드코딩된 상수 사용)
const getApiBaseUrl = (): string => {
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

// 동적 사용자 ID 가져오기 함수
export function getCurrentUserId(): number | null {
  // 개발 환경에서 로그아웃 상태인지 확인
  if (authConfig.enabled === false && localStorage.getItem("loggedOut")) {
    return null;
  }

  // 실제 사용자 정보가 있으면 해당 ID 사용
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.id || null;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      return null;
    }
  }

  // 개발 환경에서는 기본 사용자 ID 사용
  if (authConfig.enabled === false) {
    return authConfig.defaultUserId;
  }

  return null;
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
