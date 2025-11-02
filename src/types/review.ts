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
