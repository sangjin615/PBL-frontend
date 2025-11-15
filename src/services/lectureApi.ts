/**
 * Lecture API 서비스 레이어
 * Spring Boot 백엔드와 통신하는 API 클라이언트
 */

import type {
  Lecture,
  CreateLectureRequest,
  LectureSearchParams,
  LectureSearchResponse,
  LectureStats,
  TestCase,
} from "@/types/lecture";
import { LectureType } from "@/types/lecture";
import { apiConfig } from "@/config/api";
import { request } from "./utils";

class LectureApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }


  // === 기본 CRUD API ===

  /**
   * 모든 강의 조회
   * GET /api/lectures
   */
  async getAllLectures(): Promise<Lecture[]> {
    return request<Lecture[]>("/api/lectures", {}, this.baseURL);
  }

  /**
   * 강의 상세 조회
   * GET /api/lectures/{id}
   */
  async getLecture(id: number): Promise<Lecture> {
    return request<Lecture>(`/api/lectures/${id}`, {}, this.baseURL);
  }

  /**
   * 강의 생성
   * POST /api/lectures
   */
  async createLecture(lectureData: CreateLectureRequest): Promise<Lecture> {
    return request<Lecture>("/api/lectures", {
      method: "POST",
      body: JSON.stringify(lectureData),
    }, this.baseURL);
  }

  /**
   * 강의 수정
   * PUT /api/lectures/{id}
   */
  async updateLecture(
    id: number,
    lectureData: CreateLectureRequest
  ): Promise<Lecture> {
    return request<Lecture>(`/api/lectures/${id}`, {
      method: "PUT",
      body: JSON.stringify(lectureData),
    }, this.baseURL);
  }

  /**
   * 강의 삭제
   * DELETE /api/lectures/{id}
   */
  async deleteLecture(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/lectures/${id}`, {
      method: "DELETE",
    }, this.baseURL);
  }

  // === 검색 및 필터링 API ===

  /**
   * 강의 검색
   * GET /api/lectures/search
   */
  async searchLectures(
    params: LectureSearchParams
  ): Promise<LectureSearchResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/lectures/search?${queryString}`
      : "/api/lectures/search";

    try {
      return request<LectureSearchResponse>(endpoint, {}, this.baseURL);
    } catch (error) {
      // 검색 API가 구현되지 않은 경우 기본 강의 목록 반환
      console.warn("검색 API 실패, 기본 목록으로 대체:", error);
      const allLectures = await this.getAllLectures();
      return {
        lectures: allLectures,
        currentPage: 0,
        totalElements: allLectures.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
    }
  }

  /**
   * 유형별 강의 조회
   * GET /api/lectures/type/{type}
   */
  async getLecturesByType(type: LectureType): Promise<Lecture[]> {
    return request<Lecture[]>(`/api/lectures/type/${type}`, {}, this.baseURL);
  }

  /**
   * 최근 강의 조회
   * GET /api/lectures/recent
   */
  async getRecentLectures(): Promise<Lecture[]> {
    return request<Lecture[]>("/api/lectures/recent", {}, this.baseURL);
  }

  // === 테스트케이스 관리 API ===

  /**
   * 테스트케이스 추가
   * POST /api/lectures/{id}/testcases
   */
  async addTestCase(lectureId: number, testCase: TestCase): Promise<Lecture> {
    return request<Lecture>(`/api/lectures/${lectureId}/testcases`, {
      method: "POST",
      body: JSON.stringify({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      }),
    }, this.baseURL);
  }

  /**
   * 모든 테스트케이스 삭제
   * DELETE /api/lectures/{id}/testcases
   */
  async clearTestCases(lectureId: number): Promise<Lecture> {
    return request<Lecture>(`/api/lectures/${lectureId}/testcases`, {
      method: "DELETE",
    }, this.baseURL);
  }

  // === 통계 API ===

  /**
   * 강의 통계 조회
   * GET /api/lectures/stats
   */
  async getLectureStats(): Promise<LectureStats> {
    return request<LectureStats>("/api/lectures/stats", {}, this.baseURL);
  }

  // === 편의 메서드 ===

  /**
   * 마크다운 강의만 조회
   */
  async getMarkdownLectures(): Promise<Lecture[]> {
    return this.getLecturesByType(LectureType.MARKDOWN);
  }

  /**
   * 문제 강의만 조회
   */
  async getProblemLectures(): Promise<Lecture[]> {
    return this.getLecturesByType(LectureType.PROBLEM);
  }

  /**
   * 카테고리별 강의 조회
   */
  async getLecturesByCategory(category: string): Promise<Lecture[]> {
    return this.searchLectures({ category }).then(
      (response) => response.lectures
    );
  }

  /**
   * 난이도별 강의 조회
   */
  async getLecturesByDifficulty(difficulty: string): Promise<Lecture[]> {
    return this.searchLectures({ difficulty }).then(
      (response) => response.lectures
    );
  }

  // === 공개/비공개 API ===

  /**
   * 강의 공개
   * PUT /api/lectures/{id}/publish
   */
  async publishLecture(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/lectures/${id}/publish`, {
      method: "PUT",
    }, this.baseURL);
  }

  /**
   * 강의 비공개
   * PUT /api/lectures/{id}/unpublish
   */
  async unpublishLecture(id: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/lectures/${id}/unpublish`, {
      method: "PUT",
    }, this.baseURL);
  }

  /**
   * 공개 강의 조회 (페이징)
   * GET /api/lectures/public
   */
  async getPublicLectures(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedLectureResponse> {
    return request<PaginatedLectureResponse>(
      `/api/lectures/public?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 공개 강의 검색
   * GET /api/lectures/public/search
   */
  async searchPublicLectures(params: {
    title?: string;
    category?: string;
    difficulty?: string;
    type?: LectureType;
  }): Promise<Lecture[]> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/lectures/public/search?${queryString}`
      : "/api/lectures/public/search";

    return request<Lecture[]>(endpoint, {}, this.baseURL);
  }

  // === 사용자별 강의 관리 API ===

  /**
   * 사용자별 강의 목록 조회
   * GET /api/lectures/user/{userId}
   */
  async getUserLectures(
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedLectureResponse> {
    return request<PaginatedLectureResponse>(
      `/api/lectures/user/${userId}?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 사용자별 공개 강의 목록 조회
   * GET /api/lectures/user/{userId}/public
   */
  async getUserPublicLectures(
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedLectureResponse> {
    return request<PaginatedLectureResponse>(
      `/api/lectures/user/${userId}/public?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }
}

// === 페이징 응답 타입 정의 ===
export interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface PaginatedLectureResponse {
  lectures: Lecture[];
  meta: PaginationMeta;
}

// 싱글톤 인스턴스 생성 및 내보내기
export const lectureApiService = new LectureApiService();
export default lectureApiService;
