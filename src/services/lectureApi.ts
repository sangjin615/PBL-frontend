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

class LectureApiService {
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

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
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
   * 모든 강의 조회
   * GET /api/lectures
   */
  async getAllLectures(): Promise<Lecture[]> {
    return this.request<Lecture[]>("/lectures");
  }

  /**
   * 강의 상세 조회
   * GET /api/lectures/{id}
   */
  async getLecture(id: number): Promise<Lecture> {
    return this.request<Lecture>(`/lectures/${id}`);
  }

  /**
   * 강의 생성
   * POST /api/lectures
   */
  async createLecture(lectureData: CreateLectureRequest): Promise<Lecture> {
    return this.request<Lecture>("/lectures", {
      method: "POST",
      body: JSON.stringify(lectureData),
    });
  }

  /**
   * 강의 수정
   * PUT /api/lectures/{id}
   */
  async updateLecture(
    id: number,
    lectureData: CreateLectureRequest
  ): Promise<Lecture> {
    return this.request<Lecture>(`/lectures/${id}`, {
      method: "PUT",
      body: JSON.stringify(lectureData),
    });
  }

  /**
   * 강의 삭제
   * DELETE /api/lectures/{id}
   */
  async deleteLecture(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/lectures/${id}`, {
      method: "DELETE",
    });
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
      ? `/lectures/search?${queryString}`
      : "/lectures/search";

    try {
      return this.request<LectureSearchResponse>(endpoint);
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
    return this.request<Lecture[]>(`/lectures/type/${type}`);
  }

  /**
   * 최근 강의 조회
   * GET /api/lectures/recent
   */
  async getRecentLectures(): Promise<Lecture[]> {
    return this.request<Lecture[]>("/lectures/recent");
  }

  // === 테스트케이스 관리 API ===

  /**
   * 테스트케이스 추가
   * POST /api/lectures/{id}/testcases
   */
  async addTestCase(lectureId: number, testCase: TestCase): Promise<Lecture> {
    return this.request<Lecture>(`/lectures/${lectureId}/testcases`, {
      method: "POST",
      body: JSON.stringify({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
      }),
    });
  }

  /**
   * 모든 테스트케이스 삭제
   * DELETE /api/lectures/{id}/testcases
   */
  async clearTestCases(lectureId: number): Promise<Lecture> {
    return this.request<Lecture>(`/lectures/${lectureId}/testcases`, {
      method: "DELETE",
    });
  }

  // === 통계 API ===

  /**
   * 강의 통계 조회
   * GET /api/lectures/stats
   */
  async getLectureStats(): Promise<LectureStats> {
    return this.request<LectureStats>("/lectures/stats");
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
}

// 싱글톤 인스턴스 생성 및 내보내기
export const lectureApiService = new LectureApiService();
export default lectureApiService;
