/**
 * 강의 타입 정의 - Spring Boot API 응답에 맞춘 TypeScript 인터페이스
 */

export enum LectureType {
  MARKDOWN = "MARKDOWN",
  PROBLEM = "PROBLEM",
}

export interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  orderIndex?: number;
}

export interface AuthorInfo {
  id: number;
  username: string;
  loginId: string;
}

// 백엔드 Constraints 응답 구조
export interface ConstraintsResponse {
  cpu_time_limit?: number;  // BigDecimal (초 단위)
  memory_limit?: number;     // Integer (KB 단위)
  wall_time_limit?: number;
  stack_limit?: number;
  number_of_runs?: number;
  max_processes_and_or_threads?: number;
  enable_per_process_and_thread_time_limit?: boolean;
  enable_per_process_and_thread_memory_limit?: boolean;
  max_file_size?: number;
}

export interface Lecture {
  id: number;
  title: string;
  description: string;  // 강의 간략 설명 (요약)
  content?: string;     // 강의 본문 내용 (MARKDOWN: 전체 내용, PROBLEM: 문제 전체 설명)
  input_content?: string;  // 문제 입력 형식 설명 (PROBLEM 타입만 사용) - 백엔드는 snake_case
  output_content?: string; // 문제 출력 형식 설명 (PROBLEM 타입만 사용) - 백엔드는 snake_case
  type: LectureType;
  category: string;
  difficulty: string;
  constraints?: ConstraintsResponse;  // 중첩된 constraints 객체
  isPublic: boolean;
  testCaseCount: number;
  testCases?: TestCase[];
  createdAt: string;
  updatedAt: string;
  author: AuthorInfo;
  tags?: string[];
  thumbnailImageUrl?: string;  // 백엔드: thumbnailImageUrl
  durationMinutes: number;  // 강의 소요 시간 (분)
  languageId?: number | null;  // 백엔드: languageId
}

export interface CreateLectureRequest {
  title: string;
  description: string;      // 강의 간략 설명
  content?: string;          // 강의 본문 내용
  input_content?: string;    // 문제 입력 형식 (PROBLEM 타입만) - 백엔드는 snake_case
  output_content?: string;   // 문제 출력 형식 (PROBLEM 타입만) - 백엔드는 snake_case
  type: LectureType;
  category: string;
  difficulty: string;
  constraints?: ConstraintsResponse;  // 중첩된 constraints 객체
  testCases?: TestCase[];
  isPublic?: boolean;
  tags?: string[];
  thumbnailImageUrl?: string;
  durationMinutes?: number;
  language?: number | null;
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
  thumbnailImageUrl?: string; // 썸네일 이미지 URL
  type: "lecture" | "curriculum"; // 기존 코드와의 호환성을 위해
  duration?: string;
  tags: string[];
  format?: string;
  lectureType?: LectureType; // API의 실제 타입
  category?: string;
  difficulty?: string;
  testCaseCount?: number;
  courseCount?: number; // 커리큘럼용 강의 개수
  status?: string; // 발행 상태
  rating?: number; // 평균 평점
  studentCount?: number; // 수강자 수
}
