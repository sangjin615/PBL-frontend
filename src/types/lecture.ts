/**
 * 강의 타입 정의 - Spring Boot API 응답에 맞춘 TypeScript 인터페이스
 */

export enum LectureType {
  MARKDOWN = "MARKDOWN",
  PROBLEM = "PROBLEM",
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  orderIndex?: number;
}

export interface Lecture {
  id: number;
  title: string;
  description: string;
  type: LectureType;
  category: string;
  difficulty: string;
  timeLimit?: number;
  memoryLimit?: number;
  testCaseCount: number;
  testCases?: TestCase[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateLectureRequest {
  title: string;
  description: string;
  type: LectureType;
  category: string;
  difficulty: string;
  timeLimit?: number;
  memoryLimit?: number;
  testCases?: TestCase[];
}

export interface LectureSearchParams {
  title?: string;
  category?: string;
  difficulty?: string;
  type?: LectureType;
  page?: number;
  size?: number;
}

export interface LectureSearchResponse {
  lectures: Lecture[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LectureStats {
  byType: Array<[string, number]>;
  byCategory: Array<[string, number]>;
}

// DashboardView에서 사용할 통합 아이템 타입
export interface DashboardItem {
  id: number | string;
  title: string;
  createdDate: string;
  privacy: string;
  thumbnailColor: string;
  type: "lecture" | "curriculum"; // 기존 코드와의 호환성을 위해
  duration?: string;
  tags: string[];
  format?: string;
  lectureType?: LectureType; // API의 실제 타입
  category?: string;
  difficulty?: string;
  testCaseCount?: number;
}
