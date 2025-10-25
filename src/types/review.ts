/**
 * 리뷰 관련 타입 정의
 */

/**
 * 리뷰 작성 요청
 */
export interface CreateReviewRequest {
  curriculumId: number;
  rating: number; // 1-5 별점
  content?: string; // 선택사항 텍스트 리뷰
}

/**
 * 리뷰 응답
 */
export interface ReviewResponse {
  id: number;
  curriculumId: number;
  userId: number;
  username: string;
  rating: number;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 리뷰 목록 응답
 */
export interface ReviewListResponse {
  reviews: ReviewResponse[];
  totalCount: number;
  averageRating: number;
  page: number;
  pageSize: number;
}

/**
 * 리뷰 수정 요청
 */
export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
}
