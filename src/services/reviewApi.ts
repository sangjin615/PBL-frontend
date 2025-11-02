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
   * 커리큘럼 문의 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews/inquiries?page=0&size=10
   *
   * 권한별 조회 가능 범위:
   * - 일반 사용자: 공개 문의만 조회 가능
   * - 관리자(userId=1) 또는 커리큘럼 작성자: 공개 및 비공개 문의 모두 조회 가능
   * X-User-Id 헤더를 통해 자동으로 권한 확인됨
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
   *
   * 비공개 문의에 답글을 작성하려면 관리자(userId=1) 또는 커리큘럼 작성자여야 함
   * X-User-Id 헤더를 통해 자동으로 권한 확인됨
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
   *
   * 비공개 문의의 답글은 관리자(userId=1) 또는 커리큘럼 작성자만 조회 가능
   * X-User-Id 헤더를 통해 자동으로 권한 확인됨
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

  /**
   * 리뷰 답글 목록 조회
   * GET /api/curriculums/{curriculumId}/reviews/{reviewId}/replies
   */
  async getReviewReplies(
    curriculumId: number,
    reviewId: number
  ): Promise<ReplyResponse[]> {
    return request<ReplyResponse[]>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}/replies`,
      {},
      this.baseURL
    );
  }

  /**
   * 리뷰 답글 작성
   * POST /api/curriculums/{curriculumId}/reviews/{reviewId}/replies
   */
  async createReviewReply(
    curriculumId: number,
    reviewId: number,
    replyRequest: CreateReplyRequest
  ): Promise<ReplyResponse> {
    return request<ReplyResponse>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}/replies`,
      {
        method: "POST",
        body: JSON.stringify(replyRequest),
      },
      this.baseURL
    );
  }

  /**
   * 리뷰 답글 수정
   * PUT /api/curriculums/{curriculumId}/reviews/{reviewId}/replies/{replyId}
   */
  async updateReviewReply(
    curriculumId: number,
    reviewId: number,
    replyId: number,
    replyRequest: CreateReplyRequest
  ): Promise<ReplyResponse> {
    return request<ReplyResponse>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}/replies/${replyId}`,
      {
        method: "PUT",
        body: JSON.stringify(replyRequest),
      },
      this.baseURL
    );
  }

  /**
   * 리뷰 답글 삭제
   * DELETE /api/curriculums/{curriculumId}/reviews/{reviewId}/replies/{replyId}
   */
  async deleteReviewReply(
    curriculumId: number,
    reviewId: number,
    replyId: number
  ): Promise<void> {
    await request<void>(
      `/api/curriculums/${curriculumId}/reviews/${reviewId}/replies/${replyId}`,
      {
        method: "DELETE",
      },
      this.baseURL
    );
  }

  /**
   * 문의 답글 수정
   * PUT /api/curriculums/{curriculumId}/reviews/inquiries/{inquiryId}/replies/{replyId}
   */
  async updateReply(
    curriculumId: number,
    inquiryId: number,
    replyId: number,
    replyRequest: CreateReplyRequest
  ): Promise<ReplyResponse> {
    return request<ReplyResponse>(
      `/api/curriculums/${curriculumId}/reviews/inquiries/${inquiryId}/replies/${replyId}`,
      {
        method: "PUT",
        body: JSON.stringify(replyRequest),
      },
      this.baseURL
    );
  }

  /**
   * 문의 답글 삭제
   * DELETE /api/curriculums/{curriculumId}/reviews/inquiries/{inquiryId}/replies/{replyId}
   */
  async deleteReply(
    curriculumId: number,
    inquiryId: number,
    replyId: number
  ): Promise<void> {
    await request<void>(
      `/api/curriculums/${curriculumId}/reviews/inquiries/${inquiryId}/replies/${replyId}`,
      {
        method: "DELETE",
      },
      this.baseURL
    );
  }
}

export const reviewApiService = new ReviewApiService();
