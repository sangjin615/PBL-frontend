/**
 * 리뷰 관련 타입 정의
 */

/**
 * 리뷰 작성 요청 (명세서 기준)
 */
export interface CreateReviewRequest {
  isReview: boolean;
  rating: number | null; // 리뷰는 1-5 별점, 문의는 null
  content: string;
  isPublic?: boolean; // 문의 작성 시만 사용 (리뷰는 항상 공개)
}

/**
 * 리뷰 응답 (명세서 기준)
 */
export interface ReviewResponse {
  id: number;
  curriculumId: number;
  curriculumTitle?: string;
  authorId: number;
  authorUsername: string;
  isReview: boolean;
  rating: number | null; // 리뷰는 별점 있음, 문의는 null
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  parentReviewId?: number | null; // 답변인 경우 부모 문의 ID
  replies?: ReviewResponse[]; // 답변 목록 (재귀 구조)
}

/**
 * 리뷰 목록 응답 (명세서 기준 - Spring Page 형식)
 */
export interface ReviewListResponse {
  content: ReviewResponse[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 번호
  size: number; // 페이지 크기
}

/**
 * 평균 평점 응답 (명세서 기준)
 */
export interface AverageRatingResponse {
  curriculumId: number;
  averageRating: number;
  reviewCount: number;
}

/**
 * 리뷰 수정 요청
 */
export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
}

/**
 * 문의 답글 작성 요청 (명세서 기준)
 */
export interface CreateReplyRequest {
  content: string;
}

/**
 * 문의 답글 응답 (명세서 기준)
 */
export interface ReplyResponse {
  id: number;
  inquiryId: number;
  authorId: number;
  authorUsername: string;
  content: string;
  createdAt: string | number[]; // LocalDateTime 배열 또는 ISO 문자열
  updatedAt: string | number[]; // LocalDateTime 배열 또는 ISO 문자열
}
