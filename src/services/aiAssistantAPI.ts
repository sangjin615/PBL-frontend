/**
 * AI 어시스턴트 API 서비스
 * 코딩 테스트 해설을 위한 SSE(Server-Sent Events) 스트리밍 API
 */

import { fetchEventSource } from '@microsoft/fetch-event-source'
import { backendConfig } from '../config/api'

export interface GradingExplanationRequest {
  grading_token: string
  problem_id: number
}

/**
 * POST 방식으로 AI 해설을 SSE 스트리밍으로 요청
 * @microsoft/fetch-event-source 라이브러리 사용
 *
 * @param request - 채점 토큰과 문제 ID
 * @param onChunk - 스트리밍 데이터 수신 시 호출될 콜백 (실시간)
 * @param onComplete - 스트리밍 완료 시 호출될 콜백
 * @param onError - 에러 발생 시 호출될 콜백
 * @returns AbortController - 연결 종료를 위한 컨트롤러
 */
export const fetchAIExplanationWithPost = (
  request: GradingExplanationRequest,
  onChunk: (text: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): AbortController => {
  const controller = new AbortController()
  const url = `${backendConfig.baseUrl}/chat/grading`

  console.log('[AI API] 요청 시작:', request)

  // fetchEventSource를 사용한 POST + SSE 처리 (비동기 실행, Promise 무시)
  void fetchEventSource(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request),
    signal: controller.signal,

    // 연결 성공 시
    async onopen(response) {
      console.log('[AI API] 연결 성공, 상태:', response.status)

      if (response.ok) {
        return // 성공적으로 연결됨
      }

      // 응답이 OK가 아니면 에러 처리
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        // 클라이언트 에러는 재시도하지 않음
        const errorText = await response.text()
        console.error('[AI API] 클라이언트 에러:', response.status, errorText)
        if (onError) {
          onError(new Error(`HTTP ${response.status}: ${errorText}`))
        }
        throw new Error(`HTTP ${response.status}`)
      } else {
        // 서버 에러나 429는 재시도 가능
        console.warn('[AI API] 서버 에러, 재시도 가능:', response.status)
        throw new Error(`HTTP ${response.status}`)
      }
    },

    // 메시지 수신 시 (실시간 호출됨!)
    onmessage(event) {
      console.log('[AI API] 메시지 수신:', event.data)

      // 빈 데이터도 콜백으로 전달 (실시간 반영)
      onChunk(event.data)
    },

    // 연결 종료 시
    onclose() {
      console.log('[AI API] 연결 종료')
      if (onComplete) {
        onComplete()
      }
    },

    // 에러 발생 시
    onerror(err) {
      console.error('[AI API] 에러 발생:', err)

      if (onError) {
        onError(err instanceof Error ? err : new Error('AI 해설을 불러오는 중 오류가 발생했습니다.'))
      }

      // 에러를 throw하면 재연결 시도, throw하지 않으면 연결 종료
      throw err
    }
  }).catch((error) => {
    // fetchEventSource 자체의 에러 처리
    if (error.name !== 'AbortError') {
      console.error('[AI API] fetchEventSource 에러:', error)
      if (onError) {
        onError(error)
      }
    }
  })

  // AbortController를 즉시 반환 (비동기 작업은 백그라운드에서 실행)
  return controller
}

export const aiAssistantAPI = {
  fetchExplanationWithPost: fetchAIExplanationWithPost
}

export default aiAssistantAPI
