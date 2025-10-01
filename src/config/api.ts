/**
 * API 설정 파일
 * 환경변수를 통한 API URL 관리
 */

export const API_CONFIG = {
  // Spring Boot API 서버 URL
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:2358/api",

  // Judge0 API URL (기존)
  JUDGE0_URL: import.meta.env.VITE_JUDGE0_URL || "http://localhost:2358",

  // 기본 헤더
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // 타임아웃 설정 (밀리초)
  TIMEOUT: 10000,
} as const;
