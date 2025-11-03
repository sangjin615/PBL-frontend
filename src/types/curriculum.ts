/**
 * 커리큘럼 타입 정의 - Spring Boot API 응답에 맞춘 TypeScript 인터페이스
 */

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
  originalAuthor?: string;
  sourceInfo?: string;
  createdAt: string;
}

/**
 * 커리큘럼 (간단한 응답)
 */
export interface CurriculumResponse {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  difficulty?: string;
  summary?: string;
  averageRating?: number;
  studentCount?: number;
  totalLectureCount: number;
  requiredLectureCount: number;
  optionalLectureCount: number;
  tags?: string[];
  thumbnailImageUrl?: string;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
  author: AuthorInfo;
  category?: string;
  languages?: string[];
  reviewsCount?: number;
}

/**
 * 커리큘럼 상세 정보
 */
export interface CurriculumDetailResponse {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  difficulty?: string;
  summary?: string;
  learningObjectives?: string;
  averageRating?: number;
  studentCount?: number;
  lectures: CurriculumLecture[];
  totalLectureCount: number;
  requiredLectureCount: number;
  optionalLectureCount: number;
  tags?: string[];
  thumbnailImageUrl?: string;
  durationMinutes?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  author: AuthorInfo;
}

/**
 * 커리큘럼 생성 요청
 */
export interface CreateCurriculumRequest {
  title: string;
  description: string;
  isPublic: boolean;
  authorId?: number;
  difficulty?: string;
  summary?: string;
  learningObjectives?: string;
  tags?: string[];
  thumbnailImageUrl?: string;
  durationMinutes?: number;
}

/**
 * 커리큘럼 수정 요청
 */
export interface UpdateCurriculumRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
  difficulty?: string;
  summary?: string;
  tags?: string[];
  thumbnailImageUrl?: string;
  durationMinutes?: number;
}

/**
 * 커리큘럼에 강의 추가 요청
 */
export interface AddLectureRequest {
  lectureId: number;
  isRequired?: boolean;
  originalAuthor?: string;
  sourceInfo?: string;
}

/**
 * 강의 순서 변경 요청
 */
export interface ReorderLecturesRequest {
  lectureOrders: Array<{
    lectureId: number;
    order: number;
  }>;
}

/**
 * 커리큘럼 강의 응답 (다른 컴포넌트에서 사용하는 타입 alias)
 */
export type CurriculumLectureResponse = CurriculumLecture;

/**
 * 커리큘럼 네비게이션 응답 (이전/다음 강의)
 * GET /api/curriculums/{curriculumId}/lectures/{lectureId}/navigation
 */
export interface CurriculumNavigationResponse {
  curriculumId: number;
  currentLectureId: number;
  nextLectureId: number | null;  // null: 마지막 강의
  preLectureId: number | null;   // null: 첫 번째 강의
}
