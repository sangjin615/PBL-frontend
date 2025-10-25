/**
 * 리뷰 API 서비스
 */
import { apiConfig, getCurrentUserId } from '@/config/api';
import type { 
  CreateReviewRequest, 
  ReviewResponse, 
  ReviewListResponse, 
  UpdateReviewRequest 
} from '@/types/review';

class ReviewApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const userId = getCurrentUserId();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(userId && { 'X-User-ID': userId.toString() }),
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 커리큘럼 리뷰 목록 조회
   */
  async getCurriculumReviews(
    curriculumId: number, 
    page: number = 0, 
    pageSize: number = 10
  ): Promise<ReviewListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString()
    });
    
    return this.request<ReviewListResponse>(
      `/api/curriculums/${curriculumId}/reviews?${params}`
    );
  }

  /**
   * 리뷰 작성
   */
  async createReview(request: CreateReviewRequest): Promise<ReviewResponse> {
    return this.request<ReviewResponse>(
      `/api/curriculums/${request.curriculumId}/reviews`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      }
    );
  }

  /**
   * 리뷰 수정
   */
  async updateReview(
    curriculumId: number, 
    reviewId: number, 
    request: UpdateReviewRequest
  ): Promise<ReviewResponse> {
    return this.request<ReviewResponse>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request)
      }
    );
  }

  /**
   * 리뷰 삭제
   */
  async deleteReview(curriculumId: number, reviewId: number): Promise<void> {
    await this.request<void>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}`,
      {
        method: 'DELETE'
      }
    );
  }

  /**
   * 내가 작성한 리뷰 조회
   */
  async getMyReview(curriculumId: number): Promise<ReviewResponse | null> {
    try {
      return await this.request<ReviewResponse>(
        `/api/curriculums/${curriculumId}/reviews/my`
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
