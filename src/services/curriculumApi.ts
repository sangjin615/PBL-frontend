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
import { apiConfig } from "@/config/api";
import { request } from "./utils";

class CurriculumApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }


  // === 기본 CRUD API ===

  /**
   * 모든 커리큘럼 조회
   * GET /api/curriculums
   */
  async getAllCurriculums(): Promise<CurriculumResponse[]> {
    return request<CurriculumResponse[]>("/api/curriculums", {}, this.baseURL);
  }

  /**
   * 공개 커리큘럼 조회
   * GET /api/curriculums/public
   */
  async getPublicCurriculums(): Promise<CurriculumResponse[]> {
    return request<CurriculumResponse[]>("/api/curriculums/public", {}, this.baseURL);
  }

  /**
   * 공개 커리큘럼 조회 (페이징)
   * GET /api/curriculums/public?page=0&size=10
   */
  async getPublicCurriculumsPaginated(
    page: number = 0,
    size: number = 10
  ): Promise<{ curriculums: CurriculumResponse[]; meta: PaginationMeta }> {
    return request<{ curriculums: CurriculumResponse[]; meta: PaginationMeta }>(
      `/api/curriculums/public?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 커리큘럼 상세 조회
   * GET /api/curriculums/{id}
   */
  async getCurriculumById(id: number): Promise<CurriculumDetailResponse> {
    return request<CurriculumDetailResponse>(`/api/curriculums/${id}`, {}, this.baseURL);
  }

  /**
   * 커리큘럼 생성
   * POST /api/curriculums
   */
  async createCurriculum(
    data: CreateCurriculumRequest
  ): Promise<CurriculumResponse> {
    return request<CurriculumResponse>("/api/curriculums", {
      method: "POST",
      body: JSON.stringify(data),
    }, this.baseURL);
  }

  /**
   * 커리큘럼 수정
   * PUT /api/curriculums/{id}
   */
  async updateCurriculum(
    id: number,
    data: UpdateCurriculumRequest
  ): Promise<CurriculumResponse> {
    return request<CurriculumResponse>(`/api/curriculums/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, this.baseURL);
  }

  /**
   * 커리큘럼 삭제
   * DELETE /api/curriculums/{id}
   */
  async deleteCurriculum(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/curriculums/${id}`, {
      method: "DELETE",
    }, this.baseURL);
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
    return request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures`,
      {
        method: "POST",
        body: JSON.stringify(lectureData),
      },
      this.baseURL
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
    return request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures/${lectureId}`,
      {
        method: "DELETE",
      },
      this.baseURL
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
    return request<{ message: string }>(
      `/api/curriculums/${curriculumId}/lectures/reorder`,
      {
        method: "PUT",
        body: JSON.stringify({ lectureOrders }),
      },
      this.baseURL
    );
  }

  // === 공개/비공개 설정 API ===

  /**
   * 커리큘럼 공개
   * PUT /api/curriculums/{id}/publish
   */
  async publishCurriculum(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/curriculums/${id}/publish`, {
      method: "PUT",
    }, this.baseURL);
  }

  /**
   * 커리큘럼 비공개
   * PUT /api/curriculums/{id}/unpublish
   */
  async unpublishCurriculum(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/curriculums/${id}/unpublish`, {
      method: "PUT",
    }, this.baseURL);
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

    return request<CurriculumResponse[]>(endpoint, {}, this.baseURL);
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

    return request<CurriculumResponse[]>(endpoint, {}, this.baseURL);
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
    return request<PaginatedCurriculumResponse>(
      `/api/curriculums/user/${userId}?page=${page}&size=${size}`,
      {},
      this.baseURL
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
    return request<PaginatedCurriculumResponse>(
      `/api/curriculums/user/${userId}/public?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  // === 공개 강의 조회 (커리큘럼 생성 시 사용) ===

  /**
   * 공개 강의 조회
   * GET /api/curriculums/lectures/public
   */
  async getPublicLecturesForCurriculum(): Promise<Lecture[]> {
    return request<Lecture[]>("/api/curriculums/lectures/public", {}, this.baseURL);
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

    return request<Lecture[]>(endpoint, {}, this.baseURL);
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
    return request<CurriculumNavigationResponse>(
      `/api/curriculums/${curriculumId}/lectures/${lectureId}/navigation`,
      {},
      this.baseURL
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
