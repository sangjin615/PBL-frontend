/**
 * Curriculum API 서비스 레이어
 * Spring Boot 백엔드와 통신하는 API 클라이언트
 */

import type {
  CurriculumResponse,
  CurriculumDetailResponse,
  CreateCurriculumRequest,
  UpdateCurriculumRequest,
  AddLectureRequest,
  ReorderLecturesRequest,
  CurriculumNavigationResponse,
} from "@/types/curriculum";
import type { Lecture, LectureType } from "@/types/lecture";
import type { PaginationMeta } from './lectureApi';
import { apiConfig, getCurrentUserId } from "@/config/api";

class CurriculumApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }

  /**
   * HTTP 요청을 위한 공통 fetch 래퍼
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const currentUserId = getCurrentUserId();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    
    // 사용자 ID가 있을 때만 헤더에 추가
    if (currentUserId !== null) {
      headers["X-User-Id"] = String(currentUserId);
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 204 No Content인 경우 빈 객체 반환
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API 요청 실패 [${endpoint}]:`, error);
      throw error;
    }
  }

  // === 기본 CRUD API ===

  /**
   * 모든 커리큘럼 조회
   * GET /api/curriculums
   */
  async getAllCurriculums(): Promise<CurriculumResponse[]> {
    return this.request<CurriculumResponse[]>("/api/curriculums");
  }

  /**
   * 공개 커리큘럼 조회
   * GET /api/curriculums/public
   */
  async getPublicCurriculums(): Promise<CurriculumResponse[]> {
    return this.request<CurriculumResponse[]>("/api/curriculums/public");
  }

  /**
   * 커리큘럼 상세 조회
   * GET /api/curriculums/{id}
   */
  async getCurriculumById(id: number): Promise<CurriculumDetailResponse> {
    return this.request<CurriculumDetailResponse>(`/api/curriculums/${id}`);
  }

  /**
   * 커리큘럼 생성
   * POST /api/curriculums
   */
  async createCurriculum(
    data: CreateCurriculumRequest
  ): Promise<CurriculumResponse> {
    return this.request<CurriculumResponse>("/api/curriculums", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * 커리큘럼 수정
   * PUT /api/curriculums/{id}
   */
  async updateCurriculum(
    id: number,
    data: UpdateCurriculumRequest
  ): Promise<CurriculumResponse> {
    return this.request<CurriculumResponse>(`/api/curriculums/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * 커리큘럼 삭제
   * DELETE /api/curriculums/{id}
   */
  async deleteCurriculum(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/curriculums/${id}`, {
      method: "DELETE",
    });
  }

  // === 강의 연결 관리 API ===

  /**
   * 커리큘럼에 강의 추가
   * POST /api/curriculums/{id}/lectures
   */
  async addLectureToCurriculum(
    curriculumId: number,
    lectureData: AddLectureRequest
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures`,
      {
        method: "POST",
        body: JSON.stringify(lectureData),
      }
    );
  }

  /**
   * 커리큘럼에서 강의 제거
   * DELETE /api/curriculums/{curriculumId}/lectures/{lectureId}
   */
  async removeLectureFromCurriculum(
    curriculumId: number,
    lectureId: number
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures/${lectureId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * 커리큘럼 내 강의 순서 변경
   * PUT /api/curriculums/{id}/lectures/reorder
   */
  async reorderLectures(
    curriculumId: number,
    lectureOrders: Array<{ lectureId: number; order: number }>
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures/reorder`,
      {
        method: "PUT",
        body: JSON.stringify({ lectureOrders }),
      }
    );
  }

  // === 공개/비공개 설정 API ===

  /**
   * 커리큘럼 공개
   * PUT /api/curriculums/{id}/publish
   */
  async publishCurriculum(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/curriculums/${id}/publish`, {
      method: "PUT",
    });
  }

  /**
   * 커리큘럼 비공개
   * PUT /api/curriculums/{id}/unpublish
   */
  async unpublishCurriculum(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/curriculums/${id}/unpublish`, {
      method: "PUT",
    });
  }

  // === 검색 기능 API ===

  /**
   * 커리큘럼 검색
   * GET /api/curriculums/search?title={title}
   */
  async searchCurriculums(title: string): Promise<CurriculumResponse[]> {
    const searchParams = new URLSearchParams();
    if (title) {
      searchParams.append("title", title);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/curriculums/search?${queryString}`
      : "/api/curriculums/search";

    return this.request<CurriculumResponse[]>(endpoint);
  }

  /**
   * 공개 커리큘럼 검색
   * GET /api/curriculums/public/search?title={title}
   */
  async searchPublicCurriculums(title: string): Promise<CurriculumResponse[]> {
    const searchParams = new URLSearchParams();
    if (title) {
      searchParams.append("title", title);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/curriculums/public/search?${queryString}`
      : "/api/curriculums/public/search";

    return this.request<CurriculumResponse[]>(endpoint);
  }

  // === 사용자별 커리큘럼 관리 API ===

  /**
   * 사용자별 커리큘럼 목록 조회
   * GET /api/curriculums/user/{userId}
   */
  async getUserCurriculums(
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedCurriculumResponse> {
    return this.request<PaginatedCurriculumResponse>(
      `/api/curriculums/user/${userId}?page=${page}&size=${size}`
    );
  }

  /**
   * 사용자별 공개 커리큘럼 목록 조회
   * GET /api/curriculums/user/{userId}/public
   */
  async getUserPublicCurriculums(
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedCurriculumResponse> {
    return this.request<PaginatedCurriculumResponse>(
      `/api/curriculums/user/${userId}/public?page=${page}&size=${size}`
    );
  }

  // === 공개 강의 조회 (커리큘럼 생성 시 사용) ===

  /**
   * 공개 강의 조회
   * GET /api/curriculums/lectures/public
   */
  async getPublicLecturesForCurriculum(): Promise<Lecture[]> {
    return this.request<Lecture[]>("/api/curriculums/lectures/public");
  }

  /**
   * 공개 강의 검색
   * GET /api/curriculums/lectures/public/search
   */
  async searchPublicLecturesForCurriculum(params: {
    title?: string;
    category?: string;
    difficulty?: string;
    type?: string;
  }): Promise<Lecture[]> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/curriculums/lectures/public/search?${queryString}`
      : "/api/curriculums/lectures/public/search";

    return this.request<Lecture[]>(endpoint);
  }

  // === 커리큘럼 네비게이션 API ===

  /**
   * 커리큘럼 네비게이션 정보 조회 (이전/다음 강의)
   * GET /api/curriculums/{curriculumId}/lectures/{lectureId}/navigation
   */
  async getNavigationInfo(
    curriculumId: number,
    lectureId: number
  ): Promise<CurriculumNavigationResponse> {
    return this.request<CurriculumNavigationResponse>(
      `/api/curriculums/${curriculumId}/lectures/${lectureId}/navigation`
    );
  }
}

// === 페이징 응답 타입 정의 ===
export interface PaginatedCurriculumResponse {
  curriculums: CurriculumResponse[];
  meta: PaginationMeta;
}

export const curriculumApiService = new CurriculumApiService();
export default curriculumApiService;
