/**
 * Submission API 서비스
 * Judge0 API를 통해 코드를 실행하고 결과를 반환합니다.
 */

import { apiConfig } from '../config/api';

export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
}

export interface SubmissionResult {
  token?: string;
  id?: number;
  source_code?: string;
  language_id?: number;
  status?: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: number;
  memory?: number;
  created_at?: string;
  finished_at?: string;
  input_output?: {
    stdout?: string;
    stderr?: string;
    compileOutput?: string;
  };
}

export class SubmissionAPI {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = apiConfig.judge0.baseUrl;
    this.timeout = apiConfig.judge0.timeout;
  }

  /**
   * 코드를 실행하고 결과를 반환합니다.
   * @param request 코드 실행 요청 데이터
   * @returns Promise<SubmissionResult> 실행 결과
   */
  async executeCode(request: SubmissionRequest): Promise<SubmissionResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${apiConfig.judge0.endpoints.submissions}?wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.processExecutionResult(result);
    } catch (error: any) {
      console.error('코드 실행 오류:', error);
      if (error.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다.');
      }
      throw new Error(`코드 실행 실패: ${error.message}`);
    }
  }

  /**
   * 코드 실행 결과를 처리하고 사용자 친화적인 메시지로 변환합니다.
   * @param result Judge0 API 응답 결과
   * @returns 처리된 실행 결과
   */
  private processExecutionResult(result: any): SubmissionResult {
    const processedResult: SubmissionResult = { ...result };

    // input_output에서 실제 출력 결과 추출
    if (result.input_output) {
      processedResult.stdout = result.input_output.stdout;
      processedResult.stderr = result.input_output.stderr;
      processedResult.compile_output = result.input_output.compileOutput;
    }

    // 상태별 메시지 처리
    if (result.status) {
      switch (result.status.id) {
        case 3: // Accepted (정답)
          // stdout이 있으면 그대로 사용, 없으면 기본 메시지
          if (processedResult.stdout) {
            processedResult.message = processedResult.stdout;
          } else {
            processedResult.message = '코드가 성공적으로 실행되었습니다.';
          }
          break;
        case 6: // Compilation Error (컴파일 오류)
          processedResult.message = `컴파일 오류:\n${processedResult.compile_output || '컴파일 중 오류가 발생했습니다.'}`;
          break;
        case 7: // Runtime Error (런타임 오류)
          processedResult.message = `런타임 오류:\n${processedResult.stderr || '실행 중 오류가 발생했습니다.'}`;
          break;
        case 5: // Time Limit Exceeded
          processedResult.message = '시간 초과: 코드 실행 시간이 제한을 초과했습니다.';
          break;
        case 10: // Memory Limit Exceeded
          processedResult.message = '메모리 초과: 코드가 허용된 메모리 제한을 초과했습니다.';
          break;
        case 2: // Processing (아직 처리 중)
          processedResult.message = '코드가 실행 중입니다... 잠시 후 다시 시도해주세요.';
          break;
        default:
          const statusMessage = result.status.description || '알 수 없는 상태';
          processedResult.message = `실행 결과 (${statusMessage}):\n${processedResult.stdout || processedResult.stderr || result.message || '결과가 없습니다.'}`;
      }
    }

    return processedResult;
  }

  /**
   * 특정 테스트케이스로 코드를 실행합니다.
   * @param sourceCode 소스 코드
   * @param languageId 언어 ID
   * @param testInput 테스트 입력
   * @returns Promise<SubmissionResult> 실행 결과
   */
  async executeWithTestCase(
    sourceCode: string, 
    languageId: number, 
    testInput: string
  ): Promise<SubmissionResult> {
    return this.executeCode({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testInput
    });
  }

  /**
   * 여러 테스트케이스로 코드를 실행합니다.
   * @param sourceCode 소스 코드
   * @param languageId 언어 ID
   * @param testInputs 테스트 입력 배열
   * @returns Promise<SubmissionResult[]> 실행 결과 배열
   */
  async executeWithMultipleTestCases(
    sourceCode: string, 
    languageId: number, 
    testInputs: string[]
  ): Promise<SubmissionResult[]> {
    const promises = testInputs.map(input => 
      this.executeWithTestCase(sourceCode, languageId, input)
    );
    
    return Promise.all(promises);
  }
}

// 싱글톤 인스턴스 생성
export const submissionAPI = new SubmissionAPI();
