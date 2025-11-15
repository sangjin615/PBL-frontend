/**
 * QnA API 서비스
 * 질문/답변 관련 API 호출을 담당합니다.
 */

import { apiConfig } from '@/config/api';
import { request } from './utils';
import type {
  QuestionListResponse,
  QuestionDetailResponse,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionSearchParams,
  AnswerResponse,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  PageResponse,
  QuestionStatsResponse,
  AnswerStatsResponse,
} from '@/types/qna';

class QnAApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }


  // ===== 질문(Question) API =====

  /**
   * 질문 검색/목록 조회 (페이징)
   */
  async searchQuestions(
    params: QuestionSearchParams = {}
  ): Promise<PageResponse<QuestionListResponse>> {
    const queryParams = new URLSearchParams();

    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.course) queryParams.append('course', params.course);
    if (params.language) queryParams.append('language', params.language);
    if (params.authorId) queryParams.append('authorId', String(params.authorId));
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));
    if (params.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/api/qna/questions${queryString ? `?${queryString}` : ''}`;

    return request<PageResponse<QuestionListResponse>>(endpoint, {}, this.baseURL);
  }

  /**
   * 질문 상세 조회
   */
  async getQuestion(id: number): Promise<QuestionDetailResponse> {
    return request<QuestionDetailResponse>(`/api/qna/questions/${id}`, {}, this.baseURL);
  }

  /**
   * 질문 생성
   */
  async createQuestion(data: CreateQuestionRequest): Promise<QuestionDetailResponse> {
    return request<QuestionDetailResponse>('/api/qna/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }, this.baseURL);
  }

  /**
   * 질문 수정
   */
  async updateQuestion(
    id: number,
    data: UpdateQuestionRequest
  ): Promise<QuestionDetailResponse> {
    return request<QuestionDetailResponse>(`/api/qna/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, this.baseURL);
  }

  /**
   * 질문 삭제
   */
  async deleteQuestion(id: number): Promise<void> {
    return request<void>(`/api/qna/questions/${id}`, {
      method: 'DELETE',
    }, this.baseURL);
  }

  /**
   * 인기 질문 조회
   */
  async getPopularQuestions(
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<QuestionListResponse>> {
    return request<PageResponse<QuestionListResponse>>(
      `/api/qna/questions/popular?page=${page}&size=${size}`,
      {},
      this.baseURL
    );
  }

  /**
   * 질문 좋아요
   */
  async likeQuestion(id: number): Promise<void> {
    return request<void>(`/api/qna/questions/${id}/like`, {
      method: 'POST',
    }, this.baseURL);
  }

  /**
   * 질문 좋아요 취소
   */
  async unlikeQuestion(id: number): Promise<void> {
    return request<void>(`/api/qna/questions/${id}/like`, {
      method: 'DELETE',
    }, this.baseURL);
  }

  /**
   * 질문 해결 처리
   */
  async resolveQuestion(id: number): Promise<QuestionDetailResponse> {
    return request<QuestionDetailResponse>(
      `/api/qna/questions/${id}/resolve`,
      {
        method: 'PUT',
      },
      this.baseURL
    );
  }

  /**
   * 질문 통계 조회
   */
  async getQuestionStats(): Promise<QuestionStatsResponse> {
    return request<QuestionStatsResponse>('/api/qna/questions/stats', {}, this.baseURL);
  }

  // ===== 답변(Answer) API =====

  /**
   * 답변 생성
   */
  async createAnswer(
    questionId: number,
    data: CreateAnswerRequest
  ): Promise<AnswerResponse> {
    return request<AnswerResponse>(
      `/api/qna/answers/questions/${questionId}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      this.baseURL
    );
  }

  /**
   * 답변 상세 조회
   */
  async getAnswer(answerId: number): Promise<AnswerResponse> {
    return request<AnswerResponse>(`/api/qna/answers/${answerId}`, {}, this.baseURL);
  }

  /**
   * 질문별 답변 조회
   */
  async getAnswersByQuestion(questionId: number): Promise<AnswerResponse[]> {
    return request<AnswerResponse[]>(
      `/api/qna/answers/questions/${questionId}`,
      {},
      this.baseURL
    );
  }

  /**
   * 답변 수정
   */
  async updateAnswer(
    answerId: number,
    data: UpdateAnswerRequest
  ): Promise<AnswerResponse> {
    return request<AnswerResponse>(`/api/qna/answers/${answerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, this.baseURL);
  }

  /**
   * 답변 삭제
   */
  async deleteAnswer(answerId: number): Promise<void> {
    return request<void>(`/api/qna/answers/${answerId}`, {
      method: 'DELETE',
    }, this.baseURL);
  }

  /**
   * 답변 좋아요
   */
  async likeAnswer(answerId: number): Promise<void> {
    return request<void>(`/api/qna/answers/${answerId}/like`, {
      method: 'POST',
    }, this.baseURL);
  }

  /**
   * 답변 좋아요 취소
   */
  async unlikeAnswer(answerId: number): Promise<void> {
    return request<void>(`/api/qna/answers/${answerId}/like`, {
      method: 'DELETE',
    }, this.baseURL);
  }

  /**
   * 답변 채택
   */
  async acceptAnswer(answerId: number): Promise<void> {
    return request<void>(`/api/qna/answers/${answerId}/accept`, {
      method: 'POST',
    }, this.baseURL);
  }

  /**
   * 답변 채택 취소
   */
  async unacceptAnswer(answerId: number): Promise<void> {
    return request<void>(`/api/qna/answers/${answerId}/accept`, {
      method: 'DELETE',
    }, this.baseURL);
  }

  /**
   * 답변 통계 조회
   */
  async getAnswerStats(): Promise<AnswerStatsResponse> {
    return request<AnswerStatsResponse>('/api/qna/answers/stats', {}, this.baseURL);
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const qnaApiService = new QnAApiService();
export default qnaApiService;
