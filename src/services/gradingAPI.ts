/**
 * Grading API 서비스
 * 백엔드 grading API와 통신하는 채점 관련 클라이언트
 */

import { apiConfig } from '../config/api';

export interface GradingRequest {
  source_code: string;
  language_id: number;
  problem_id?: number;
  constraints_id?: number;
}


export interface ProgressResponse {
  total_test_case?: number;
  done_test_case?: number;
  current_test_case?: number;
  progress_percentage?: number;
  estimated_remaining_time?: number;
}

export interface GradingResponse {
  id?: number;
  token?: string;
  source_code?: string;
  language_id?: number;
  constraints?: any;
  err_inputOutput?: {
    stdin?: string;
    expectedOutput?: string;
    stdout?: string;
    stderr?: string;
    compileOutput?: string;
    message?: string;
  };
  message?: string;
  status?: {
    id: number;
    description: string;
  };
  created_at?: string;
  finished_at?: string;
  updated_at?: string;
  time?: number;
  wall_time?: number;
  memory?: number;
  exit_code?: number;
  exit_signal?: number;
  problem_id?: number;
  progress?: ProgressResponse;
}

export class GradingAPI {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = apiConfig.judge0.baseUrl; // Judge0 API 사용
    this.timeout = apiConfig.judge0.timeout;
    console.log('GradingAPI 초기화:', {
      baseUrl: this.baseUrl,
      timeout: this.timeout
    });
  }

  /**
   * 코드를 채점을 위해 제출합니다.
   * @param request 채점 요청 데이터
   * @returns Promise<GradingResponse> 채점 결과 (토큰 포함)
   */
  async submitForGrading(request: GradingRequest): Promise<GradingResponse> {
    try {
      console.log('=== GradingAPI.submitForGrading 시작 ===');
      console.log('요청 URL:', `${this.baseUrl}/grading/${request.problem_id}`);
      console.log('요청 데이터:', {
        source_code: request.source_code,
        language_id: request.language_id
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/grading/${request.problem_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_code: request.source_code,
          language_id: request.language_id
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP 오류 응답:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('응답 데이터:', result);
      
      if (!result.token) {
        throw new Error('채점 토큰을 받지 못했습니다.');
      }

      console.log('채점 제출 성공, 토큰:', result.token);
      return result;
    } catch (error: any) {
      console.error('채점 제출 오류:', error);
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw new Error(`채점 제출 실패: ${error.message}`);
    }
  }

  /**
   * 채점 결과를 조회합니다.
   * @param token 채점 토큰
   * @param progress 프로그레스 정보 포함 여부 (기본값: true)
   * @returns Promise<GradingResponse> 채점 결과
   */
  async getGradingResult(token: string, progress: boolean = true): Promise<GradingResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // 백엔드 API 엔드포인트 사용
      const url = `${this.baseUrl}/grading/${token}?progress=${progress}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('채점 결과 조회 오류:', error);
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw new Error(`채점 결과 조회 실패: ${error.message}`);
    }
  }


  /**
   * 채점이 완료될 때까지 폴링합니다.
   * @param token 채점 토큰
   * @param interval 폴링 간격 (밀리초, 기본값: 1000ms)
   * @param maxAttempts 최대 시도 횟수 (기본값: 30)
   * @returns Promise<GradingResponse> 완료된 채점 결과
   */
  async pollGradingResult(
    token: string, 
    interval: number = 1000, 
    maxAttempts: number = 30
  ): Promise<GradingResponse> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const result = await this.getGradingResult(token, false);
        
        // 채점이 완료되었는지 확인 (status가 3이면 완료)
        if (result.status && result.status.id === 3) {
          return result;
        }
        
        // 아직 진행 중이면 잠시 대기
        await new Promise(resolve => setTimeout(resolve, interval));
        attempts++;
        
      } catch (error) {
        console.error(`채점 폴링 시도 ${attempts + 1} 실패:`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error('채점 폴링 시간 초과');
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    throw new Error('채점 폴링 시간 초과');
  }
}

// 싱글톤 인스턴스 생성
export const gradingAPI = new GradingAPI();
