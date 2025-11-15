/**
 * 공용 HTTP 클라이언트 유틸리티
 * 모든 서비스에서 사용하는 공통 HTTP 요청 로직을 제공합니다.
 */

import { apiConfig, getCurrentUserId } from '@/config/api';

export interface RequestOptions extends RequestInit {
  timeout?: number;
  includeAuth?: boolean;
  skipContentType?: boolean;
  errorAsText?: boolean;
}

/**
 * 공용 HTTP 요청 함수
 *
 * @param endpoint - API 엔드포인트 (baseURL 제외)
 * @param options - 요청 옵션
 * @param baseURL - 기본 URL (기본값: backend baseUrl)
 * @returns Promise<T>
 *
 * 특징:
 * - 자동 인증 헤더 추가 (X-User-Id)
 * - 204 No Content 응답 처리
 * - 에러 응답 처리 (JSON 또는 텍스트)
 * - 타임아웃 지원
 */
export async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  baseURL: string = apiConfig.backend.baseUrl
): Promise<T> {
  const {
    timeout,
    includeAuth = true,
    skipContentType = false,
    errorAsText = false,
    ...fetchOptions
  } = options;

  const url = `${baseURL}${endpoint}`;
  const currentUserId = getCurrentUserId();

  // 헤더 구성
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Content-Type 기본값 설정 (skipContentType이 false일 때)
  if (!skipContentType && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // 인증 헤더 추가
  if (includeAuth && currentUserId !== null) {
    headers['X-User-Id'] = String(currentUserId);
  }

  // 타임아웃 처리를 위한 AbortController
  const controller = new AbortController();
  let timeoutId: number | undefined;

  if (timeout) {
    timeoutId = window.setTimeout(() => controller.abort(), timeout);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    // 타임아웃 타이머 정리
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 에러 응답 처리
    if (!response.ok) {
      let errorMessage: string;

      if (errorAsText) {
        // 텍스트로 에러 읽기
        errorMessage = await response.text().catch(() => `HTTP ${response.status}`);
      } else {
        // JSON으로 에러 읽기
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      }

      // status 정보를 포함한 에러 객체 생성
      const error = new Error(errorMessage) as Error & { status: number };
      error.status = response.status;
      throw error;
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return {} as T;
    }

    // 정상 응답 반환
    return response.json();
  } catch (error: any) {
    // 타임아웃 타이머 정리
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 타임아웃 에러 처리
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }

    // 기타 에러 전파
    throw error;
  }
}

/**
 * GET 요청 헬퍼
 */
export async function get<T>(
  endpoint: string,
  options: RequestOptions = {},
  baseURL?: string
): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' }, baseURL);
}

/**
 * POST 요청 헬퍼
 */
export async function post<T>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {},
  baseURL?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    },
    baseURL
  );
}

/**
 * PUT 요청 헬퍼
 */
export async function put<T>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {},
  baseURL?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    },
    baseURL
  );
}

/**
 * DELETE 요청 헬퍼
 */
export async function del<T>(
  endpoint: string,
  options: RequestOptions = {},
  baseURL?: string
): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' }, baseURL);
}

/**
 * PATCH 요청 헬퍼
 */
export async function patch<T>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {},
  baseURL?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    },
    baseURL
  );
}

/**
 * 날짜 포맷팅 유틸리티
 * 백엔드 LocalDateTime 배열 형태와 ISO 문자열을 모두 처리합니다.
 *
 * @param date - 날짜 (배열 형태 [year, month, day, hour, minute, second, nano] 또는 ISO 문자열)
 * @returns 포맷된 날짜 문자열 (YYYY-MM-DD HH:mm)
 *
 * @example
 * formatDateTime([2025, 10, 29, 16, 7, 44, 437862000]) // "2025-10-29 16:07"
 * formatDateTime("2025-10-29T16:07:44") // "2025-10-29 16:07"
 */
export function formatDateTime(date: number[] | string | null | undefined): string {
  if (!date) return '-';

  let d: Date;

  if (Array.isArray(date)) {
    // 백엔드 LocalDateTime 배열 형태: [year, month, day, hour, minute, second, nanoseconds]
    const [year, month, day, hour = 0, minute = 0] = date;
    // JavaScript Date의 month는 0부터 시작하므로 -1 필요
    d = new Date(year, month - 1, day, hour, minute);
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    return '-';
  }

  // Invalid Date 체크
  if (isNaN(d.getTime())) {
    return '-';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}
