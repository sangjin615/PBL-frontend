/**
 * 추천 API 서비스
 * 사용자 맞춤 추천 및 통합 추천 기능 제공
 */

import { request } from './utils';
import type { CurriculumResponse } from '@/types/curriculum';
import type { Lecture } from '@/types/lecture';
import type { PaginationMeta } from './lectureApi';
import { getApiBaseUrl } from '@/config/api';

// 통합 추천 응답 타입
export interface UnifiedRecommendationItem {
  type: 'CURRICULUM' | 'LECTURE';
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  recommendationScore: number;
  recommendationReason: string;
  // 커리큘럼 전용 필드
  tags?: string[];
  averageRating?: number;
  studentCount?: number;
  authorName?: string;
  thumbnailImageUrl?: string;
  // 강의 전용 필드
  lectureType?: 'MARKDOWN' | 'PROBLEM';
}

// 추천 API 페이징 메타데이터 (API 명세서 기준)
export interface RecommendationPaginationMeta {
  currentPage: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UnifiedRecommendationResponse {
  recommendations: UnifiedRecommendationItem[];
  meta: RecommendationPaginationMeta;
}

// 개인화된 커리큘럼 추천 응답 타입
export interface CurriculumRecommendationResponse {
  curriculums: CurriculumResponse[];
  meta: RecommendationPaginationMeta;
}

class RecommendationApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = getApiBaseUrl();
  }

  /**
   * 통합 추천 (커리큘럼 + 강의 혼합)
   * GET /api/recommendations/unified?page=0&size=10
   */
  async getUnifiedRecommendations(
    page: number = 0,
    size: number = 10
  ): Promise<UnifiedRecommendationResponse> {
    return request<UnifiedRecommendationResponse>(
      `/api/recommendations/unified?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 개인화된 커리큘럼 추천
   * GET /api/recommendations/curriculums?page=0&size=10
   */
  async getCurriculumRecommendations(
    page: number = 0,
    size: number = 10
  ): Promise<CurriculumRecommendationResponse> {
    return request<CurriculumRecommendationResponse>(
      `/api/recommendations/curriculums?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 유사 문제 강의 추천
   * GET /api/recommendations/similar-lectures?lectureId={lectureId}&page=0&size=5
   */
  async getSimilarLectures(
    lectureId: number,
    page: number = 0,
    size: number = 5
  ): Promise<{ lectures: Lecture[]; meta: PaginationMeta }> {
    return request<{ lectures: Lecture[]; meta: PaginationMeta }>(
      `/api/recommendations/similar-lectures?lectureId=${lectureId}&page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }
}

export const recommendationApiService = new RecommendationApiService();

