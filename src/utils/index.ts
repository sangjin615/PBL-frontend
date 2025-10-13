/**
 * 유틸리티 함수들
 */

import { MESSAGES, VALIDATION_RULES } from '@/constants';

// 상수들을 다시 export
export { MESSAGES, VALIDATION_RULES };

// 날짜 포맷팅
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 유효성 검사 함수들
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return '닉네임을 입력해주세요.';
  }
  
  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return `닉네임은 최소 ${VALIDATION_RULES.USERNAME.MIN_LENGTH}자 이상이어야 합니다.`;
  }
  
  if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    return `닉네임은 최대 ${VALIDATION_RULES.USERNAME.MAX_LENGTH}자까지 가능합니다.`;
  }
  
  if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
    return '닉네임은 한글, 영문, 숫자, 공백만 사용 가능합니다.';
  }
  
  return null;
};

export const validateLoginId = (loginId: string): string | null => {
  if (!loginId.trim()) {
    return '아이디를 입력해주세요.';
  }
  
  if (loginId.length < VALIDATION_RULES.LOGIN_ID.MIN_LENGTH) {
    return `아이디는 최소 ${VALIDATION_RULES.LOGIN_ID.MIN_LENGTH}자 이상이어야 합니다.`;
  }
  
  if (loginId.length > VALIDATION_RULES.LOGIN_ID.MAX_LENGTH) {
    return `아이디는 최대 ${VALIDATION_RULES.LOGIN_ID.MAX_LENGTH}자까지 가능합니다.`;
  }
  
  if (!VALIDATION_RULES.LOGIN_ID.PATTERN.test(loginId)) {
    return '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return '비밀번호를 입력해주세요.';
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `비밀번호는 최소 ${VALIDATION_RULES.PASSWORD.MIN_LENGTH}자 이상이어야 합니다.`;
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `비밀번호는 최대 ${VALIDATION_RULES.PASSWORD.MAX_LENGTH}자까지 가능합니다.`;
  }
  
  return null;
};

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return '제목을 입력해주세요.';
  }
  
  if (title.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
    return `제목은 최소 ${VALIDATION_RULES.TITLE.MIN_LENGTH}자 이상이어야 합니다.`;
  }
  
  if (title.length > VALIDATION_RULES.TITLE.MAX_LENGTH) {
    return `제목은 최대 ${VALIDATION_RULES.TITLE.MAX_LENGTH}자까지 가능합니다.`;
  }
  
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return `설명은 최대 ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH}자까지 가능합니다.`;
  }
  
  return null;
};

// 알림 함수들
export const showSuccess = (message: string): void => {
  alert(message);
};

export const showError = (message: string): void => {
  alert(message);
};

export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const result = confirm(message);
    resolve(result);
  });
};

// API 에러 처리
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
    return '인증이 필요합니다. 다시 로그인해주세요.';
  }
  
  if (error.response?.status === 403) {
    return '권한이 없습니다.';
  }
  
  if (error.response?.status === 404) {
    return '요청한 리소스를 찾을 수 없습니다.';
  }
  
  if (error.response?.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }
  
  return error.message || '알 수 없는 오류가 발생했습니다.';
};

// 로컬 스토리지 헬퍼
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

// 색상 유틸리티
export const getThumbnailColor = (type: string): string => {
  switch (type) {
    case 'PROBLEM':
      return '#E3F2FD';
    case 'MARKDOWN':
      return '#E8F5E8';
    case 'curriculum':
      return '#FFF3E0';
    default:
      return '#F3F4F6';
  }
};

// 텍스트 유틸리티
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
