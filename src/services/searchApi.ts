/**
 * 통합 검색 API 서비스 레이어
 * 커리큘럼과 강의를 동시에 검색하는 API 클라이언트
 */

import type { CurriculumResponse } from "@/types/curriculum";
import type { Lecture } from "@/types/lecture";
import { apiConfig } from "@/config/api";
import { request } from "./utils";
import type { PaginationMeta } from "./lectureApi";

/**
 * 통합 검색 API의 페이징 메타데이터 (명세서 기준)
 */
export interface UnifiedSearchPaginationMeta {
  currentPage?: number;
  totalElements?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  // 또는 기존 PaginationMeta 형식
  current_page?: number;
  next_page?: number | null;
  prev_page?: number | null;
  total_pages?: number;
  total_count?: number;
  per_page?: number;
}

/**
 * 통합 검색 요청 파라미터
 */
export interface UnifiedSearchParams {
  title?: string;
  category?: string;
  difficulty?: string;
  type?: "MARKDOWN" | "PROBLEM";
  isPublic?: boolean | null;
  page?: number;
  size?: number;
}

/**
 * 통합 검색 응답 타입
 */
export interface UnifiedSearchResponse {
  curriculums: {
    curriculums: CurriculumResponse[];
    meta: UnifiedSearchPaginationMeta | PaginationMeta;
  };
  lectures: {
    lectures: Lecture[];
    meta: UnifiedSearchPaginationMeta | PaginationMeta;
  };
}

class SearchApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }

  /**
   * 통합 검색 (커리큘럼 + 강의)
   * GET /api/search
   *
   * 공개된 커리큘럼과 강의를 동시에 검색합니다.
   */
  async unifiedSearch(
    params: UnifiedSearchParams = {}
  ): Promise<UnifiedSearchResponse> {
    const searchParams = new URLSearchParams();

    // Query Parameters 추가
    if (params.title) {
      searchParams.append("title", params.title);
    }
    if (params.category) {
      searchParams.append("category", params.category);
    }
    if (params.difficulty) {
      searchParams.append("difficulty", params.difficulty);
    }
    if (params.type) {
      searchParams.append("type", params.type);
    }
    if (params.isPublic !== undefined && params.isPublic !== null) {
      searchParams.append("isPublic", String(params.isPublic));
    }
    if (params.page !== undefined) {
      searchParams.append("page", String(params.page));
    }
    if (params.size !== undefined) {
      searchParams.append("size", String(params.size));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/search?${queryString}`
      : "/api/search";

    return request<UnifiedSearchResponse>(endpoint, {}, this.baseURL);
  }
}

export const searchApiService = new SearchApiService();
export default searchApiService;
