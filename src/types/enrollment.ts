/**
 * Enrollment 타입 정의
 * 수강 신청 관련 타입들
 */

/**
 * 수강 상태
 */
export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',           // 수강 신청
  IN_PROGRESS = 'IN_PROGRESS',     // 진행 중
  COMPLETED = 'COMPLETED'          // 완료
}

/**
 * 강의 진도 상태
 */
export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',     // 시작 안 함
  IN_PROGRESS = 'IN_PROGRESS',     // 진행 중
  COMPLETED = 'COMPLETED'          // 완료
}

/**
 * 수강 신청 요청
 */
export interface EnrollRequest {
  curriculumId: number;
}

/**
 * 수강 응답 (목록용)
 */
export interface EnrollmentResponse {
  id: number;
  userId: number;
  username: string;
  curriculumId: number;
  curriculumTitle: string;
  curriculumDescription: string;
  status: EnrollmentStatus;
  progressPercentage: number;
  enrolledAt: string | number[];
  completedAt?: string | number[] | null;
  totalLectures?: number;
  completedLectures?: number;
}

/**
 * 강의 진도 응답
 */
export interface LectureProgressResponse {
  id: number;
  lectureId: number;
  lectureTitle: string;
  lectureType: string; // 'MARKDOWN' | 'PROBLEM'
  category: string;
  difficulty: string;
  status: ProgressStatus;
  startedAt?: string | number[] | null;
  completedAt?: string | number[] | null;
  order: number; // orderIndex
  isRequired: boolean;
}

/**
 * 수강 상세 응답 (강의별 진도 포함)
 */
export interface EnrollmentDetailResponse {
  id: number;
  userId: number;
  username: string;
  curriculumId: number;
  curriculumTitle: string;
  curriculumDescription: string;
  status: EnrollmentStatus;
  progressPercentage: number;
  enrolledAt: string | number[];
  completedAt?: string | number[] | null;
  lectures: LectureProgressResponse[];
}

/**
 * 수강자 수 응답
 */
export interface EnrollmentCountResponse {
  curriculumId: number;
  enrollmentCount: number;
}

/**
 * 완료자 수 응답
 */
export interface CompletedCountResponse {
  curriculumId: number;
  completedCount: number;
}
