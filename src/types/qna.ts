/**
 * QnA 관련 타입 정의
 */

// ===== Enums =====
export type QuestionStatus = 'UNRESOLVED' | 'RESOLVED';
export type QuestionCategory = 'QUESTION' | 'TIP' | 'BUG_REPORT' | 'FEATURE_REQUEST' | 'GENERAL';

// ===== 질문 관련 타입 =====

/**
 * 질문 목록 응답 (간소화된 정보)
 */
export interface QuestionListResponse {
  id: number;
  title: string;
  status: QuestionStatus;
  category: QuestionCategory;
  course: string;
  language: string;
  authorName: string;
  commentCount: number;
  likes: number;
  createdAt: string;
}

/**
 * 질문 상세 응답 (답변 포함)
 */
export interface QuestionDetailResponse {
  id: number;
  title: string;
  content: string;
  status: QuestionStatus;
  category: QuestionCategory;
  course: string;
  language: string;
  authorName: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  answers: AnswerResponse[];
}

/**
 * 질문 생성 요청
 */
export interface CreateQuestionRequest {
  title: string;
  content: string;
  category: QuestionCategory;
  course?: string;
  language?: string;
}

/**
 * 질문 수정 요청
 */
export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  category?: QuestionCategory;
  course?: string;
  language?: string;
}

/**
 * 질문 검색 파라미터
 */
export interface QuestionSearchParams {
  keyword?: string;
  status?: QuestionStatus;
  category?: QuestionCategory;
  course?: string;
  language?: string;
  authorId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

// ===== 답변 관련 타입 =====

/**
 * 답변 응답 (재귀 구조 - replies 포함)
 */
export interface AnswerResponse {
  id: number;
  content: string;
  authorName: string;
  likes: number;
  isAccepted: boolean;
  parentAnswerId: number | null;
  createdAt: string;
  updatedAt: string;
  replies: AnswerResponse[];
}

/**
 * 답변 생성 요청
 */
export interface CreateAnswerRequest {
  content: string;
  parentAnswerId?: number;
}

/**
 * 답변 수정 요청
 */
export interface UpdateAnswerRequest {
  content: string;
}

// ===== 페이징 응답 =====

/**
 * 페이징 응답 (Spring Data Page 구조)
 */
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ===== 통계 =====

/**
 * 질문 통계 응답
 */
export interface QuestionStatsResponse {
  totalQuestions: number;
  unresolvedQuestions: number;
  resolvedQuestions: number;
  courseStats: [string, number][];
  languageStats: [string, number][];
}

/**
 * 답변 통계 응답
 */
export interface AnswerStatsResponse {
  totalAnswers: number;
  acceptedAnswers: number;
  unacceptedAnswers: number;
  topAnswerers: {
    authorName: string;
    answerCount: number;
    acceptedCount: number;
  }[];
}

// ===== 레거시 타입 (기존 UI 호환용 - 점진적 제거 예정) =====

/**
 * @deprecated 기존 UI 호환용 - QuestionDetailResponse 사용 권장
 */
export interface QnAQuestion {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  course: string;
  language: string;
  status: 'unresolved' | 'resolved';
  comments: number;
  likes: number;
  createdAt: string;
  commentsList?: QnAComment[];
}

/**
 * @deprecated 기존 UI 호환용 - AnswerResponse 사용 권장
 */
export interface QnAComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  isReply?: boolean;
  parentId?: number;
}
