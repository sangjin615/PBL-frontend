/**
 * 리뷰 API 서비스
 */
import { apiConfig } from "@/config/api";
import { request } from "./utils";
import type {
  CreateReviewRequest,
  ReviewResponse,
  ReviewListResponse,
  UpdateReviewRequest,
  AverageRatingResponse,
  CreateReplyRequest,
  ReplyResponse,
} from "@/types/review";

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
      size: size.toString(),
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
  async getAverageRating(curriculumId: number): Promise<AverageRatingResponse> {
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
        method: "POST",
        body: JSON.stringify(reviewRequest),
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
        method: "PUT",
        body: JSON.stringify(updateRequest),
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
        method: "DELETE",
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
      if (error.message?.includes("404")) {
        return null; // 리뷰가 없는 경우
      }
      throw error;
    }
  }

  /**
   * 커리큘럼 문의 작성
   * POST /api/curriculums/{curriculumId}/reviews/inquiries
   */
  async createInquiry(
    curriculumId: number,
    inquiryRequest: CreateReviewRequest
  ): Promise<ReviewResponse> {
    return request<ReviewResponse>(
      `/api/curriculums/${curriculumId}/reviews/inquiries`,
      {
        method: "POST",
        body: JSON.stringify(inquiryRequest),
      },
      this.baseURL
    );
  }

  /**
   * 커리큘럼 공개 문의 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews/inquiries?page=0&size=10
   */
  async getInquiries(
    curriculumId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return request<ReviewListResponse>(
      `/api/curriculums/${curriculumId}/reviews/inquiries?${params}`,
      {},
      this.baseURL
    );
  }

  /**
   * 내 문의 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews/my/inquiries
   */
  async getMyInquiries(curriculumId: number): Promise<ReviewResponse[]> {
    return request<ReviewResponse[]>(
      `/api/curriculums/${curriculumId}/reviews/my/inquiries`,
      {},
      this.baseURL
    );
  }

  /**
   * 문의에 답변 작성
   * POST /api/curriculums/{curriculumId}/reviews/inquiries/{inquiryId}/replies
   */
  async createReply(
    curriculumId: number,
    inquiryId: number,
    replyRequest: CreateReplyRequest
  ): Promise<ReplyResponse> {
    return request<ReplyResponse>(
      `/api/curriculums/${curriculumId}/reviews/inquiries/${inquiryId}/replies`,
      {
        method: "POST",
        body: JSON.stringify(replyRequest),
      },
      this.baseURL
    );
  }

  /**
   * 문의의 답변 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews/inquiries/{inquiryId}/replies
   */
  async getReplies(
    curriculumId: number,
    inquiryId: number
  ): Promise<ReplyResponse[]> {
    return request<ReplyResponse[]>(
      `/api/curriculums/${curriculumId}/reviews/inquiries/${inquiryId}/replies`,
      {},
      this.baseURL
    );
  }
}

export const reviewApiService = new ReviewApiService();
