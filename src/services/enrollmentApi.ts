/**
 * Enrollment API 서비스
 * 수강 신청 및 진도 관리 API 호출
 */

import { apiConfig } from '@/config/api';
import type {
  EnrollRequest,
  EnrollmentResponse,
  EnrollmentDetailResponse,
  LectureProgressResponse,
  EnrollmentCountResponse,
  CompletedCountResponse,
  EnrollmentStatus
} from '@/types/enrollment';

/**
 * Enrollment API 서비스 클래스
 */
class EnrollmentApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.backend.baseUrl;
  }

  /**
   * API 요청 헬퍼 함수
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // 인증 헤더 추가 (config 기반)
    if (apiConfig.auth.enabled) {
      // TODO: 실제 로그인한 사용자 ID 가져오기
      headers[apiConfig.auth.headerName] = String(apiConfig.auth.defaultUserId);
    } else {
      // 개발 모드: 기본 사용자 ID 사용
      headers[apiConfig.auth.headerName] = String(apiConfig.auth.defaultUserId);
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log(`[EnrollmentAPI] ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[EnrollmentAPI] 요청 실패 [${endpoint}]:`, error);
      throw error;
    }
  }

  // === 수강 신청/취소 ===

  /**
   * 커리큘럼 수강 신청
   * POST /api/enrollments
   */
  async enrollCurriculum(curriculumId: number): Promise<EnrollmentResponse> {
    return this.request<EnrollmentResponse>('/api/enrollments', {
      method: 'POST',
      body: JSON.stringify({ curriculumId }),
    });
  }

  /**
   * 수강 취소
   * DELETE /api/enrollments/{enrollmentId}
   */
  async cancelEnrollment(enrollmentId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
  }

  // === 조회 기능 ===

  /**
   * 사용자별 수강 목록 조회
   * GET /api/enrollments/user/{userId}
   */
  async getUserEnrollments(userId: number): Promise<EnrollmentResponse[]> {
    return this.request<EnrollmentResponse[]>(`/api/enrollments/user/${userId}`);
  }

  /**
   * 사용자별 수강 목록 조회 (상태별 필터링)
   * GET /api/enrollments/user/{userId}/status?status={status}
   */
  async getUserEnrollmentsByStatus(
    userId: number,
    status?: EnrollmentStatus
  ): Promise<EnrollmentResponse[]> {
    const statusParam = status ? `?status=${status}` : '';
    return this.request<EnrollmentResponse[]>(
      `/api/enrollments/user/${userId}/status${statusParam}`
    );
  }

  /**
   * 수강 상세 정보 조회 (강의별 진도 포함)
   * GET /api/enrollments/{enrollmentId}
   */
  async getEnrollmentDetail(enrollmentId: number): Promise<EnrollmentDetailResponse> {
    return this.request<EnrollmentDetailResponse>(`/api/enrollments/${enrollmentId}`);
  }

  /**
   * 사용자별 특정 강의 완료 상태 조회
   * GET /api/enrollments/user/{userId}/lecture/{lectureId}/completed
   */
  async isLectureCompletedByUser(
    userId: number,
    lectureId: number
  ): Promise<{ userId: number; lectureId: number; isCompleted: boolean }> {
    return this.request<{ userId: number; lectureId: number; isCompleted: boolean }>(
      `/api/enrollments/user/${userId}/lecture/${lectureId}/completed`
    );
  }

  /**
   * 사용자별 특정 강의 진도 상세 조회
   * GET /api/enrollments/user/{userId}/lecture/{lectureId}/progress
   */
  async getUserLectureProgress(
    userId: number,
    lectureId: number
  ): Promise<{
    userId: number;
    lectureId: number;
    progressList: LectureProgressResponse[];
  }> {
    return this.request<{
      userId: number;
      lectureId: number;
      progressList: LectureProgressResponse[];
    }>(`/api/enrollments/user/${userId}/lecture/${lectureId}/progress`);
  }

  // === 진도 관리 ===

  /**
   * 강의 읽기 완료 처리 (마크다운 강의)
   * PUT /api/enrollments/{enrollmentId}/lectures/{lectureId}/read
   */
  async markLectureAsRead(
    enrollmentId: number,
    lectureId: number
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/enrollments/${enrollmentId}/lectures/${lectureId}/read`,
      {
        method: 'PUT',
      }
    );
  }

  /**
   * 문제 강의 정답 제출 처리
   * PUT /api/enrollments/{enrollmentId}/lectures/{lectureId}/solve
   */
  async markLectureAsSolved(
    enrollmentId: number,
    lectureId: number
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/enrollments/${enrollmentId}/lectures/${lectureId}/solve`,
      {
        method: 'PUT',
      }
    );
  }

  // === 통계 기능 ===

  /**
   * 커리큘럼별 수강자 수 조회
   * GET /api/enrollments/curriculum/{curriculumId}/count
   */
  async getCurriculumEnrollmentCount(curriculumId: number): Promise<EnrollmentCountResponse> {
    return this.request<EnrollmentCountResponse>(
      `/api/enrollments/curriculum/${curriculumId}/count`
    );
  }

  /**
   * 커리큘럼별 완료자 수 조회
   * GET /api/enrollments/curriculum/{curriculumId}/completed-count
   */
  async getCurriculumCompletedCount(curriculumId: number): Promise<CompletedCountResponse> {
    return this.request<CompletedCountResponse>(
      `/api/enrollments/curriculum/${curriculumId}/completed-count`
    );
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const enrollmentApiService = new EnrollmentApiService();
export default enrollmentApiService;
