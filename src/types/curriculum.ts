/**
 * 커리큘럼 타입 정의 - Spring Boot API 응답에 맞춘 TypeScript 인터페이스
 */

import type { Lecture } from './lecture';

/**
 * 작성자 정보
 */
export interface AuthorInfo {
  id: number;
  username: string;
  loginId: string;
}

/**
 * 커리큘럼-강의 연결 정보 (백엔드 실제 응답 구조)
 */
export interface CurriculumLecture {
  id: number;
  lectureId: number;
  lectureTitle: string;
  lectureDescription: string;
  lectureType: string;
  lectureCategory: string;
  lectureDifficulty: string;
  orderIndex: number;
  isRequired: boolean;
  createdAt: number[] | string;
  originalAuthor?: string;
  sourceInfo?: string;
}

/**
 * 커리큘럼 (간단한 응답)
 */
export interface CurriculumResponse {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  totalLectureCount: number;
  requiredLectureCount: number;
  optionalLectureCount: number;
  createdAt: number[] | string;
  updatedAt: number[] | string;
  author?: AuthorInfo;
}

/**
 * 커리큘럼 상세 정보
 */
export interface CurriculumDetailResponse {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  lectures: CurriculumLecture[];
  totalLectureCount: number;
  requiredLectureCount: number;
  optionalLectureCount: number;
  createdAt: number[] | string;
  updatedAt: number[] | string;
  author?: AuthorInfo;
}

/**
 * 커리큘럼 생성 요청
 */
export interface CreateCurriculumRequest {
  title: string;
  description: string;
  isPublic: boolean;
}

/**
 * 커리큘럼 수정 요청
 */
export interface UpdateCurriculumRequest {
  title: string;
  description: string;
  isPublic: boolean;
}

/**
 * 커리큘럼에 강의 추가 요청
 */
export interface AddLectureRequest {
  lectureId: number;
  isRequired: boolean;
  originalAuthor?: string;
  sourceInfo?: string;
}

/**
 * 강의 순서 변경 요청
 */
export interface ReorderLecturesRequest {
  lectureIds: number[];
}

/**
 * 커리큘럼 강의 응답 (다른 컴포넌트에서 사용하는 타입 alias)
 */
export type CurriculumLectureResponse = CurriculumLecture;
