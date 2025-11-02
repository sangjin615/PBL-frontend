/**
 * 리뷰 API 서비스
 */
import { apiConfig } from '@/config/api';
import { request } from './utils';
import type {
  CreateReviewRequest,
  ReviewResponse,
  ReviewListResponse,
  UpdateReviewRequest,
  AverageRatingResponse
} from '@/types/review';

class ReviewApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }

  /**
   * 커리큘럼 리뷰 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews?page=0&size=10
   */
  async getCurriculumReviews(
    curriculumId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return request<ReviewListResponse>(
      `/api/curriculums/${curriculumId}/reviews?${params}`,
      {},
      this.baseURL
    );
  }

  /**
   * 커리큘럼 평균 평점 조회
   * GET /api/curriculums/{curriculumId}/reviews/average-rating
   */
  async getAverageRating(
    curriculumId: number
  ): Promise<AverageRatingResponse> {
    return request<AverageRatingResponse>(
      `/api/curriculums/${curriculumId}/reviews/average-rating`,
      {},
      this.baseURL
    );
  }

  /**
   * 리뷰 작성
   * POST /api/curriculums/{curriculumId}/reviews
   */
  async createReview(
    curriculumId: number,
    reviewRequest: CreateReviewRequest
  ): Promise<ReviewResponse> {
    return request<ReviewResponse>(
      `/api/curriculums/${curriculumId}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(reviewRequest)
      },
      this.baseURL
    );
  }

  /**
   * 리뷰 수정
   */
  async updateReview(
    curriculumId: number,
    reviewId: number,
    updateRequest: UpdateReviewRequest
  ): Promise<ReviewResponse> {
    return request<ReviewResponse>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateRequest)
      },
      this.baseURL
    );
  }

  /**
   * 리뷰 삭제
   */
  async deleteReview(curriculumId: number, reviewId: number): Promise<void> {
    await request<void>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}`,
      {
        method: 'DELETE'
      },
      this.baseURL
    );
  }

  /**
   * 내가 작성한 리뷰 조회
   */
  async getMyReview(curriculumId: number): Promise<ReviewResponse | null> {
    try {
      return await request<ReviewResponse>(
        `/api/curriculums/${curriculumId}/reviews/my`,
        {},
        this.baseURL
      );
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null; // 리뷰가 없는 경우
      }
      throw error;
    }
  }
}

export const reviewApiService = new ReviewApiService();
