/**
 * 애플리케이션 전역 상수 정의
 */

// 강의 카테고리
export const LECTURE_CATEGORIES = [
  '프론트엔드',
  '백엔드', 
  '데이터베이스',
  '모바일',
  'AI/ML',
  '기타'
] as const;

// 난이도 레벨
export const DIFFICULTY_LEVELS = [
  '입문',
  '초급', 
  '중급',
  '고급'
] as const;

// 색상 팔레트
export const COLORS = {
  PROBLEM: '#E3F2FD',
  MARKDOWN: '#E8F5E8', 
  CURRICULUM: '#FFF3E0',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6'
} as const;

// UI 설정
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200
} as const;

// API 설정
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// 메시지 템플릿
export const MESSAGES = {
  SUCCESS: {
    LOGIN: '로그인되었습니다.',
    SIGNUP: '회원가입이 완료되었습니다.',
    LECTURE_CREATED: '강의가 생성되었습니다!',
    LECTURE_UPDATED: '강의가 수정되었습니다!',
    CURRICULUM_CREATED: '커리큘럼이 생성되었습니다!',
    IMAGE_UPLOADED: '이미지가 업로드되었습니다.'
  },
  ERROR: {
    LOGIN_FAILED: '로그인에 실패했습니다.',
    SIGNUP_FAILED: '회원가입에 실패했습니다.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    VALIDATION_ERROR: '입력값을 확인해주세요.',
    FILE_TOO_LARGE: '파일 크기가 너무 큽니다.',
    INVALID_FILE_TYPE: '지원되지 않는 파일 형식입니다.'
  },
  CONFIRM: {
    DELETE_LECTURE: '정말로 이 강의를 삭제하시겠습니까?',
    DELETE_CURRICULUM: '정말로 이 커리큘럼을 삭제하시겠습니까?',
    LOGOUT: '정말 로그아웃하시겠습니까?'
  }
} as const;

// 폼 유효성 검사 규칙
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    PATTERN: /^[가-힣a-zA-Z0-9\s]+$/
  },
  LOGIN_ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50
  },
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000
  }
} as const;

// 타입 정의
export type LectureCategory = typeof LECTURE_CATEGORIES[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type ColorKey = keyof typeof COLORS;
