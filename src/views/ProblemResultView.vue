<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">{{ lectureTitle || '강의 정보 로딩 중...' }}</h1>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 다음 강의 버튼 -->
          <Button 
            v-if="nextLesson"
            @click="goToNextLesson"
            variant="success"
          >
            <template #icon>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </template>
            다음 강의
          </Button>
          <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex h-[calc(100vh-80px)]">
      <!-- 왼쪽: 소스코드 에디터 + AI 강의 추천 -->
      <div class="w-1/2 bg-white border-r flex flex-col">
        <!-- 상단: 소스코드 에디터 -->
        <div class="flex-1 flex flex-col">
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button
                  @click="activeCodeTab = 'current'"
                  class="px-3 py-1 text-sm rounded-md"
                  :class="activeCodeTab === 'current' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
                >
                  제출한 소스코드
                </button>
                <button
                  @click="activeCodeTab = 'history'; loadSubmissionHistory()"
                  class="px-3 py-1 text-sm rounded-md"
                  :class="activeCodeTab === 'history' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
                >
                  내 제출
                </button>
              </div>
              <div v-if="activeCodeTab === 'history'" class="flex items-center gap-2">
                <select 
                  v-model="selectedHistoryId" 
                  @change="loadSelectedHistory" 
                  class="px-2 py-1 border rounded-md text-sm"
                  :disabled="isLoadingSubmissions"
                >
                  <option v-if="isLoadingSubmissions" value="">로딩 중...</option>
                  <option v-else-if="mySubmissions.length === 0" value="">제출 기록이 없습니다 ({{ mySubmissions.length }}개)</option>
                  <option v-else v-for="(s, idx) in mySubmissions" :key="s.token" :value="s.token">
                    {{ idx + 1 }}차 · {{ s.created_at ? new Date(s.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : '알 수 없음' }} · {{ s.status?.description || 'Unknown' }}
                  </option>
                </select>

              </div>
            </div>
            <div class="h-[calc(50vh-120px)] p-4">
              <MonacoEditor
                v-if="isEditorReady"
                ref="monacoEditorRef"
                :key="editorConfig.languageId"
                :config="editorConfig"
                class="w-full h-full border rounded-lg"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="text-gray-500">에디터 준비 중...</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 하단: AI 강의 추천 -->
        <div class="flex-shrink-0">
          <AiLectureRecommendation :lecture-id="parseInt(route.params.problemId as string)" />
        </div>
      </div>

      <!-- 오른쪽: 채점 결과 -->
      <div class="w-1/2 overflow-y-auto">
        <div class="p-6">
        <!-- 채점 진행상황 -->
        <div v-if="isGrading" class="text-center mb-8">
          <div class="bg-blue-50 rounded-lg p-6">
            <div class="flex items-center justify-center mb-4">
              <div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mr-3"></div>
              <h2 class="text-xl font-bold text-blue-600">채점 중...</h2>
            </div>
            <p class="text-gray-600 mb-4">{{ currentStatus }}</p>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mt-2">
              <span>{{ progressPercentage.toFixed(2) }}% 완료</span>
              <span>{{ doneTestCase }}/{{ totalTestCase }} 예시</span>
            </div>
          </div>
        </div>

        <!-- 채점 결과 -->
        <div v-else class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">채점 결과: {{ successRate }}% 완료!!</h2>

        </div>


        <!-- 통계 정보 -->
        <div v-if="!isGrading" class="bg-gray-50 rounded-lg p-4 mb-8">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-600">{{ doneTestCase }}</p>
              <p class="text-sm text-gray-600">성공</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-red-600">{{ totalTestCase- doneTestCase}}</p>
              <p class="text-sm text-gray-600">실패</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-600">{{ totalTestCase }}</p>
              <p class="text-sm text-gray-600">전체</p>
            </div>
          </div>
        </div>

        <!-- 예시 결과 상세 -->
        <div v-if="!isGrading && testResults.length > 0" class="bg-white rounded-lg border p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">예시 결과</h3>
          <div class="space-y-3">
            <div 
              v-for="(result, index) in testResults" 
              :key="index"
              class="p-3 rounded-lg"
              :class="result.isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
            >
              <div class="flex items-center space-x-3 mb-2">
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  :class="result.isSuccess ? 'bg-green-500' : 'bg-red-500'"
                >
                  {{ result.isSuccess ? '✓' : '✗' }}
                </div>
                <span class="font-medium">{{ result.input }}</span>
              </div>
              <div class="text-sm text-gray-700 bg-white p-3 rounded border">
                <pre class="whitespace-pre-wrap font-mono">{{ result.output }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div v-if="!isGrading" class="flex justify-center space-x-4">
          <Button
            @click="tryAgain"
            variant="primary"
            size="lg"
          >
            돌아가기
          </Button>
          <Button
            @click="goPrevious"
            variant="ghost"
            size="lg"
            :disabled="!preLectureId"
            :class="{ 'opacity-50 cursor-not-allowed': !preLectureId }"
          >
            ← 이전 강의
          </Button>
          <Button
            @click="goNext"
            variant="ghost"
            size="lg"
            :disabled="!nextLectureId"
            :class="{ 'opacity-50 cursor-not-allowed': !nextLectureId }"
          >
            다음 강의 →
          </Button>
          <Button
            @click="toggleExplanation"
            variant="ghost"
            size="lg"
          >
            {{ showExplanation ? '해설 닫기' : '해설보기' }}
          </Button>
        </div>

        <!-- AI 해설 패널 -->
        <div v-if="!isGrading && showExplanation" class="mt-6">
          <div class="bg-white rounded-lg border p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">AI 해설</h3>
              <button @click="toggleExplanation" class="text-sm text-gray-500 hover:text-gray-700">닫기</button>
            </div>
            <div class="text-sm text-gray-600 mb-3">제출한 코드 분석과 테스트 결과를 기반으로 오답 원인을 설명합니다.</div>

            <!-- 에러 메시지 표시 -->
            <div v-if="explanationError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start space-x-2 text-red-600">
                <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-sm">{{ explanationError }}</div>
              </div>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <!-- 로딩 중일 때도 해설 내용이 있으면 표시 -->
              <div v-if="explanation" class="space-y-4">

                <!-- 마크다운 뷰어 (비교용) -->
                <div class="prose prose-sm max-w-none">
                  <MdPreview
                    :modelValue="explanation"
                    :theme="'light'"
                    :showCodeRowNumber="true"
                  />
                </div>
              </div>

              <!-- 로딩 중이면서 해설이 없을 때만 로딩 표시 -->
              <div v-else-if="isLoadingExplanation" class="flex items-center space-x-2 text-purple-600 py-4">
                <div class="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span>해설을 생성하고 있습니다...</span>
              </div>

              <!-- 해설이 없고 로딩도 아닐 때 -->
              <div v-else class="text-gray-500 py-4">해설이 없습니다. 해설보기를 눌러 생성하세요.</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import { Button, LoadingSpinner, ErrorMessage } from '@/components/common'
import { languageApiService } from '../services/languageApi'
import { gradingAPI, type GradingResponse } from '../services/gradingAPI'
import type { MonacoEditorConfig } from '../services/extendedClient'
import { aiAssistantAPI } from '../services/aiAssistantAPI'
import curriculumApiService from '@/services/curriculumApi'
import type { CurriculumNavigationResponse } from '@/types/curriculum'
import { MdPreview } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'
import AiLectureRecommendation from '@/components/course/AiLectureRecommendation.vue'
import { enrollmentApiService } from '@/services/enrollmentApi'
import { getCurrentUserId } from '@/config/api'
import { lectureApiService } from '@/services/lectureApi'
import {URL_PREFIX,URL_PORT} from '../config/api'

const route = useRoute()
const router = useRouter()

// 소스코드 및 언어 정보
const languageId = ref(71) // 기본값 Python
const token = ref('')
const curriculumId = ref<string | null>(null) // 커리큘럼 ID
const preLectureId = ref<number | null>(null) // 이전 강의 ID
const nextLectureId = ref<number | null>(null) // 다음 강의 ID
const monacoEditorRef = ref<any>(null)

// Monaco Editor 통합 설정
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(71, '')
)

// 진행상황 및 상태
const isGrading = ref(true)
const progressPercentage = ref(0)
const currentStatus = ref('채점 결과를 불러오는 중...')
const eventSource = ref<EventSource | null>(null)
const isConnected = ref(false) // 연결 상태 추적
const totalTestCase = ref(0) // 기본값 설정
const doneTestCase = ref(0)
const isEditorReady = ref(false) // 에디터 준비 상태

// 테스트 결과 데이터
const testResults = ref<Array<{input: string, output: string, isSuccess: boolean}>>([])

// AI 해설 상태
const showExplanation = ref(false)
const isLoadingExplanation = ref(false)
const explanation = ref<string>('') // 문자열로 변경 (실시간 누적)
const explanationStreamController = ref<AbortController | null>(null)
const explanationError = ref<string>('')

// 버퍼링을 위한 추가 상태
const explanationBuffer = ref<string>('') // 버퍼 추가
const isUpdatingExplanation = ref(false) // 업데이트 플래그

// 코드 탭/내 제출 히스토리
const activeCodeTab = ref<'current' | 'history'>('current')
const mySubmissions = ref<GradingResponse[]>([])
const selectedHistoryId = ref('')
const isLoadingSubmissions = ref(false)

// 다음 강의 정보
const nextLesson = ref<{id: number, title: string, format: string} | null>(null)

// 강의 정보
const lectureTitle = ref<string>('')
const lectureDescription = ref<string>('')

// 성공률 계산
const successRate = computed(() => {
  if (totalTestCase.value === 0) return 0;
  return Math.round((doneTestCase.value / totalTestCase.value) * 100);
})

// 주기적 업데이트 함수
const flushExplanationBuffer = (): void => {
  if (explanationBuffer.value.length > 0) {
    // Vue 반응성을 위해 완전히 새로운 문자열로 교체
    explanation.value = explanation.value + explanationBuffer.value
    explanationBuffer.value = ''
    console.log('[ProblemResult] 버퍼 플러시 완료, 현재 길이:', explanation.value.length)
  }
  if (isLoadingExplanation.value) {
    requestAnimationFrame(flushExplanationBuffer)
  }
}

// 네비게이션 정보 가져오기
async function fetchNavigationInfo(curriculumId: number, lectureId: number) {
  try {
    const nav = await curriculumApiService.getNavigationInfo(curriculumId, lectureId);
    preLectureId.value = nav.preLectureId;
    nextLectureId.value = nav.nextLectureId;
    console.log('네비게이션 정보:', nav);
  } catch (error) {
    console.error('네비게이션 정보 조회 실패:', error);
  }
}

// 네비게이션 함수들
const tryAgain = (): void => {
  // 현재 토큰을 쿼리 파라미터로 전달하여 LectureView로 돌아가기
  const currentToken = token.value;
  const lectureId = route.params.problemId;  // problemId가 실제로는 lectureId

  router.push({
    name: 'lecture',  // 'lecture' 라우트 사용
    params: { lectureId },
    query: currentToken ? { token: currentToken } : {}
  });
};

// 이전 강의로 이동
const goPrevious = (): void => {
  if (preLectureId.value && curriculumId.value) {
    router.push({
      name: 'lecture',
      params: { lectureId: preLectureId.value },
      query: { curriculumId: curriculumId.value }
    });
  }
};

// 다음 강의로 이동
const goNext = (): void => {
  if (nextLectureId.value && curriculumId.value) {
    router.push({
      name: 'lecture',
      params: { lectureId: nextLectureId.value },
      query: { curriculumId: curriculumId.value }
    });
  } else if (curriculumId.value) {
    // 마지막 강의인 경우 커리큘럼 상세 페이지로
    router.push({
      name: 'curriculum-detail',
      params: { id: curriculumId.value }
    });
  }
};

const goToNextLesson = (): void => {
  if (!nextLesson.value) return;
  router.push({ name: 'lecture', params: { lectureId: nextLesson.value.id } });
};

const goBack = (): void => {
  router.back();
};

// AI 해설 토글 및 API 호출
const toggleExplanation = (): void => {
  showExplanation.value = !showExplanation.value;

  // 해설을 닫는 경우
  if (!showExplanation.value) {
    // 진행 중인 스트리밍이 있으면 중단
    if (explanationStreamController.value) {
      explanationStreamController.value.abort();
      explanationStreamController.value = null;
    }
    // 버퍼와 로딩 상태 정리
    isLoadingExplanation.value = false;
    explanationBuffer.value = '';
    return;
  }

  // 이미 해설이 로드되어 있으면 다시 요청하지 않음
  if (explanation.value.length > 0) {
    return;
  }

  // 필요한 데이터 확인
  if (!token.value) {
    explanationError.value = '제출 토큰이 없습니다. 다시 시도해주세요.';
    return;
  }

  const problemId = parseInt(route.params.problemId as string);
  if (!problemId) {
    explanationError.value = '문제 ID를 찾을 수 없습니다.';
    return;
  }

  // AI 해설 요청
  explanationError.value = '';
  explanation.value = ''; // 기존 해설 초기화
  explanationBuffer.value = ''; // 버퍼 초기화
  isLoadingExplanation.value = true; // 이것을 먼저 설정!

  // 주기적 업데이트 시작
  flushExplanationBuffer();

  // fetchEventSource를 사용한 SSE 스트리밍 (POST 지원, 버퍼링 방식)
  const controller = aiAssistantAPI.fetchExplanationWithPost(
    {
      grading_token: token.value,
      problem_id: problemId
    },
    // onChunk: 메시지 수신 시마다 버퍼에 누적
    (chunk: string) => {
      console.log('[ProblemResult] 청크 받음:', chunk, '청크 길이:', chunk.length, '버퍼 길이:', explanationBuffer.value.length);
      // 각 청크를 버퍼에 누적 (Vue 반응성을 위해 새로운 문자열로 할당)
      explanationBuffer.value = explanationBuffer.value + chunk;
      console.log('[ProblemResult] 버퍼 누적 후 길이:', explanationBuffer.value.length);
    },
    // onComplete: 스트리밍 완료 시
    () => {
      isLoadingExplanation.value = false;
      // 남은 버퍼 flush
      if (explanationBuffer.value.length > 0) {
        explanation.value = explanation.value + explanationBuffer.value;
        explanationBuffer.value = '';
      }
      console.log('[ProblemResult] AI 해설 로드 완료:', explanation.value.length, '글자');

      // 해설이 비어있는 경우 안내 메시지
      if (!explanation.value.trim()) {
        explanation.value = 'AI 해설을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }
    },
    // onError: 에러 발생 시
    (error: Error) => {
      console.error('[ProblemResult] AI 해설 로드 실패:', error);
      isLoadingExplanation.value = false;
      explanationError.value = error.message || 'AI 해설을 불러오는 중 오류가 발생했습니다.';
      explanation.value = explanationError.value;
      explanationBuffer.value = ''; // 에러 시 버퍼 정리
    }
  );

  explanationStreamController.value = controller;
};

// 히스토리 코드 불러오기 - 에디터 설정 재생성
const loadSelectedHistory = (): void => {
  if (!selectedHistoryId.value) return;
  const item = mySubmissions.value.find(s => s.token === selectedHistoryId.value);
  if (!item) return;

  // 에디터 설정 재생성 (언어 + 소스코드)
  if (item.language_id && item.source_code) {
    const langId = item.language_id;
    const sourceCode = item.source_code;
    languageId.value = langId;

    // 에디터 강제 재렌더링을 위해 일시적으로 숨김
    isEditorReady.value = false;

    // 다음 틱에 에디터 설정 변경 및 재표시
    setTimeout(() => {
      editorConfig.value = languageApiService.createEditorConfig(langId, sourceCode);
      console.log('히스토리 로드:', langId, sourceCode.length, '글자');
      isEditorReady.value = true;
    }, 10);
  }
};

// 제출 히스토리 로드 (gradingAPI 사용)
const loadSubmissionHistory = async (): Promise<void> => {
  try {
    isLoadingSubmissions.value = true;
    console.log('채점 제출 히스토리 로드 시작');
    
    // 현재 문제 ID 가져오기
    const currentProblemId = parseInt(route.params.problemId as string);
    console.log('현재 문제 ID:', currentProblemId);
    
    const response = await gradingAPI.getGradingList(0, 20, currentProblemId);
    console.log('채점 제출 히스토리 응답:', response);
    console.log('응답의 grade 필드:', response.grade);
    console.log('응답의 grade 타입:', typeof response.grade);
    console.log('응답의 grade 길이:', response.grade?.length);
    
    mySubmissions.value = response.grade || [];
    console.log('mySubmissions.value 설정 후:', mySubmissions.value);
    console.log('mySubmissions.value.length:', mySubmissions.value.length);
    
    if (mySubmissions.value.length > 0) {
      selectedHistoryId.value = mySubmissions.value[0].token || '';
      console.log('첫 번째 제출 선택됨:', selectedHistoryId.value);
    }
    
    console.log('채점 제출 히스토리 로드 완료:', mySubmissions.value.length, '개');
  } catch (error) {
    console.error('채점 제출 히스토리 로드 오류:', error);
    mySubmissions.value = [];
  } finally {
    isLoadingSubmissions.value = false;
  }
};


// 채점 결과 조회 (일반 조회 → 프로그레스로 전환)
const startGradingProgress = async (token: string): Promise<void> => {
  try {
    console.log('채점 진행상황 시작:', token);
    
    // 제출 상태 확인
    const result = await gradingAPI.getGradingResult(token, false);
    
    // 채점이 완료되었는지 확인
    if (result.status && result.status.id >= 3) {
      // 완료된 경우 결과 표시
      await displayFinalResult(result);
      isGrading.value = false;
    } else {
      // 아직 진행 중인 경우 프로그레스로 전환
      currentStatus.value = '채점이 진행 중입니다. 프로그레스를 확인합니다...';
      await startProgressMonitoring(token);
    }
    
  } catch (error) {
    console.error('채점 결과 조회 오류:', error);
    isGrading.value = false;
    currentStatus.value = '채점 결과를 불러오는 중 오류가 발생했습니다.';
  }
};

// 프로그레스 모니터링 시작 (SSE 연결)
const startProgressMonitoring = async (token: string): Promise<void> => {
  try {
    console.log('SSE 연결 시작:', token);
    
    // SSE 연결 시작
    isConnected.value = true;
    eventSource.value = new EventSource(`http://${URL_PREFIX}:${URL_PORT}/grading/${token}/progress`);
    setupSSEHandlers();
    
  } catch (error) {
    console.error('프로그레스 모니터링 오류:', error);
    isGrading.value = false;
    currentStatus.value = '채점 진행상황을 확인할 수 없습니다.';
  }
};

// SSE 이벤트 핸들러 설정
const setupSSEHandlers = (): void => {
  if (!eventSource.value) return;
  
  eventSource.value.onopen = () => {
    console.log('SSE 연결 열림');
    currentStatus.value = '채점 진행상황을 받고 있습니다...';
  };
  
  eventSource.value.addEventListener('progress', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('진행상황 데이터 수신:', data);
      
      if (data.current_status === 'COMPLETED' || data.status?.id >= 3) {
        console.log('채점 완료, 최종 결과 표시');
        displayFinalResult(data).catch(err => console.error('최종 결과 표시 오류:', err));
        closeSSEConnection();
        isGrading.value = false;
      } else {
        updateProgressDisplay(data).catch(err => console.error('진행상황 업데이트 오류:', err));
      }
    } catch (error) {
      console.error('SSE 데이터 파싱 오류:', error);
    }
  });

  // error 이벤트 핸들러 추가
  eventSource.value.addEventListener('error', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Error 이벤트 수신:', data);
      
      // error 이벤트로 받은 데이터를 최종 결과로 처리
      displayFinalResult(data).catch(err => console.error('최종 결과 표시 오류:', err));
      closeSSEConnection();
      isGrading.value = false;
    } catch (error) {
      console.error('Error 이벤트 데이터 파싱 오류:', error);
      // 파싱 실패 시 단순 문자열로 처리
      currentStatus.value = `오류: ${event.data}`;
      isGrading.value = false;
      closeSSEConnection();
    }
  });

  eventSource.value.onerror = () => {
    console.error('SSE 연결 오류');
    closeSSEConnection();
    currentStatus.value = '채점 진행상황을 가져올 수 없습니다.';
    isGrading.value = false;
  };
};

// SSE 연결 정리
const closeSSEConnection = (): void => {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
  isConnected.value = false;
};

// 진행상황 표시 업데이트
const updateProgressDisplay = async (data: any): Promise<void> => {
  const progress = data.progress || {};
  // total_test_case가 없거나 0이면 문제 정보에서 가져오기
  if (!progress.total_test_case || progress.total_test_case === 0) {
    try {
      const problemId = parseInt(route.params.problemId as string);
      if (problemId && totalTestCase.value === 0) {
        const lecture = await lectureApiService.getLecture(problemId);
        if (lecture?.testCaseCount) {
          totalTestCase.value = lecture.testCaseCount;
          console.log('진행 중: 문제 정보에서 테스트케이스 개수 가져옴:', lecture.testCaseCount);
        }
      }
    } catch (error) {
      console.error('진행 중: 문제 정보 조회 실패:', error);
    }
  } else {
    totalTestCase.value = progress.total_test_case;
  }
  // 데이터 업데이트
  doneTestCase.value = progress.done_test_case || 0; // current_test_case 대신 done_test_case 사용
  progressPercentage.value = progress.progress_percentage || 0;

  console.log('Progress 값 업데이트:', {
    total: totalTestCase.value,
    done: doneTestCase.value,
    percentage: progressPercentage.value
  });
  
  // 상태 메시지 설정
  const statusMessages: Record<string, string> = {
    'INITIALIZING': '채점을 준비하고 있습니다...',
    'STARTING': `채점을 시작합니다... (총 ${totalTestCase.value}개 예시)`,
    'RUNNING': `예시 ${progress.current_test_case || 0}/${totalTestCase.value} 처리 중...`,
    'COMPLETED': `채점 완료! 총 ${totalTestCase.value}개 예시 중 ${doneTestCase.value}개 통과`,
    'ERROR': '채점 중 오류가 발생했습니다.'
  };
  
  currentStatus.value = statusMessages[progress.current_status] || progress.message || '채점 중...';
};

// enrollmentId 찾기 함수
async function findEnrollmentId(curriculumIdNum: number): Promise<number | null> {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('[진행률 업데이트] 사용자 ID를 찾을 수 없습니다.');
      return null;
    }

    const enrollments = await enrollmentApiService.getUserEnrollments(userId);
    const enrollment = enrollments.find(e => 
      e.curriculumId === curriculumIdNum && e.status === 'ENROLLED'
    );

    if (enrollment) {
      console.log('[진행률 업데이트] enrollmentId 찾음:', enrollment.id);
      return enrollment.id;
    } else {
      console.log('[진행률 업데이트] enrollment를 찾을 수 없습니다.');
      return null;
    }
  } catch (err) {
    console.error('[진행률 업데이트] enrollmentId 찾기 실패:', err);
    return null;
  }
}

// 강의 완료 처리 (문제 강의)
async function markLectureComplete(lectureId: number, curriculumIdNum: number | null) {
  if (!curriculumIdNum) {
    console.log('[진행률 업데이트] curriculumId가 없어 진행률을 업데이트할 수 없습니다.');
    return;
  }

  try {
    const enrollmentId = await findEnrollmentId(curriculumIdNum);
    if (!enrollmentId) {
      console.log('[진행률 업데이트] enrollmentId를 찾을 수 없어 진행률을 업데이트할 수 없습니다.');
      return;
    }

    await enrollmentApiService.markLectureAsSolved(enrollmentId, lectureId);
    console.log('[진행률 업데이트] ✅ 강의 완료 처리 성공:', lectureId);
  } catch (err) {
    console.error('[진행률 업데이트] 강의 완료 처리 실패:', err);
  }
}

// 최종 결과 표시
const displayFinalResult = async (result: any): Promise<void> => {
  isGrading.value = false;
  progressPercentage.value = 100;
  
  console.log('최종 결과 표시:', result);
  
  // total_test_case가 없거나 0이면 문제 정보에서 가져오기
  if (!result.progress?.total_test_case || result.progress.total_test_case === 0) {
    try {
      const problemId = parseInt(route.params.problemId as string);
      if (problemId) {
        const lecture = await lectureApiService.getLecture(problemId);
        if (lecture?.testCaseCount) {
          totalTestCase.value = lecture.testCaseCount;
          console.log('문제 정보에서 테스트케이스 개수 가져옴:', lecture.testCaseCount);
        }
      }
    } catch (error) {
      console.error('문제 정보 조회 실패:', error);
    }
  } else {
    totalTestCase.value = result.progress.total_test_case;
  }
  
  // 백엔드 DTO 구조에 맞게 결과 처리 (err_inputOutput 필드 사용)
  if (result.status?.id === 3) {
    // Accepted - 성공
    currentStatus.value = '채점 완료! 모든 예시 통과';
    testResults.value = []; // 성공 시에는 상세 결과 표시하지 않음
    doneTestCase.value = result.progress?.done_test_case || totalTestCase.value || 0; // done_test_case 사용, 없으면 totalTestCase 사용
    
    // 정답을 맞췄을 때 진행률 업데이트
    const lectureId = parseInt(route.params.problemId as string);
    const curriculumIdNum = curriculumId.value ? parseInt(curriculumId.value) : null;
    if (lectureId && curriculumIdNum) {
      await markLectureComplete(lectureId, curriculumIdNum);
    }
  } else if (result.status?.id === 4) {
    // Wrong Answer - 오답
    currentStatus.value = '입출력 값이 다릅니다! 코드를 확인해주세요.';
    
    console.log('오답 처리 - result 구조:', result);
    console.log('input_output:', result.input_output);
    console.log('err_inputOutput:', result.err_inputOutput);
    
    // 테스트 결과 상세 표시
    if (result.input_output || result.err_inputOutput) {
      const inputOutput = result.input_output || result.err_inputOutput;
      console.log('inputOutput 구조:', inputOutput);
      
      testResults.value = [{
        input: `입력: ${inputOutput.stdin || inputOutput.input || 'N/A'}`,
        output: `정답 출력: ${inputOutput.expectedOutput || inputOutput.expected_output || 'N/A'}\n실제 출력: ${inputOutput.stdout || inputOutput.actual_output || 'N/A'}`,
        isSuccess: false
      }];
    } else {
      console.log('input_output 정보가 없음, 기본 메시지 표시');
      testResults.value = [{
        input: '오답',
        output: `입력과 출력이 일치하지 않습니다.\n상태: ${result.status?.description || 'Wrong Answer'}`,
        isSuccess: false
      }];
    }
    
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else if (result.status?.id === 7) {
    // Compilation Error - 컴파일 오류
    currentStatus.value = '컴파일 오류가 발생했습니다.';
    
    const inputOutput = result.input_output || result.err_inputOutput;
    if (inputOutput?.compileOutput) {
      testResults.value = [{
        input: '컴파일 오류',
        output: inputOutput.compileOutput,
        isSuccess: false
      }];
    } else {
      testResults.value = [{
        input: '컴파일 오류',
        output: '컴파일 중 오류가 발생했습니다.',
        isSuccess: false
      }];
    }
    
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else if (result.status?.id === 5) {
    // Time Limit Exceeded - 시간 초과
    currentStatus.value = '시간 초과가 발생했습니다.';
    testResults.value = [{
      input: '시간 초과',
      output: '코드 실행 시간이 제한을 초과했습니다.',
      isSuccess: false
    }];
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else if (result.status?.id === 6) {
    // Memory Limit Exceeded - 메모리 초과
    currentStatus.value = '메모리 초과가 발생했습니다.';
    testResults.value = [{
      input: '메모리 초과',
      output: '코드가 사용하는 메모리가 제한을 초과했습니다.',
      isSuccess: false
    }];
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else if (result.status?.id >= 8 && result.status?.id <= 13) {
    // Runtime Error (SIGSEGV, SIGXFSZ, SIGFPE, SIGABRT, NZEC, OTHello
    // R)
    const runtimeErrorMessages: Record<number, string> = {
      8: '메모리 접근 오류 (SIGSEGV)',
      9: '파일 크기 초과 (SIGXFSZ)',
      10: '부동소수점 연산 오류 (SIGFPE)',
      11: '프로그램 강제 종료 (SIGABRT)',
      12: '비정상 종료 코드 (NZEC)',
      13: '기타 런타임 오류'
    };
    
    currentStatus.value = `런타임 오류가 발생했습니다: ${runtimeErrorMessages[result.status.id] || '알 수 없는 오류'}`;
    const inputOutput = result.input_output || result.err_inputOutput;
    testResults.value = [{
      input: '런타임 오류',
      output: inputOutput?.stderr || result.message || '실행 중 오류가 발생했습니다.',
      isSuccess: false
    }];
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else if (result.status?.id >= 14) {
    // Internal Error, Exec Format Error
    const systemErrorMessages: Record<number, string> = {
      14: '시스템 내부 오류',
      15: '실행 파일 형식 오류'
    };
    
    currentStatus.value = `시스템 오류: ${systemErrorMessages[result.status.id] || '알 수 없는 시스템 오류'}`;
    testResults.value = [{
      input: '시스템 오류',
      output: result.message || '시스템 내부 오류가 발생했습니다.',
      isSuccess: false
    }];
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  } else {
    // 기타 상태 (QUEUE, PROCESS 등)
    currentStatus.value = `채점 상태: ${result.status?.description || '알 수 없음'}`;
    testResults.value = [{
      input: '알 수 없는 상태',
      output: result.message || '알 수 없는 상태입니다.',
      isSuccess: false
    }];
    // total_test_case는 이미 위에서 설정됨
    doneTestCase.value = result.progress?.done_test_case || 0; // done_test_case 사용
  }
};

// 강의 정보 로드
const loadLectureInfo = async (): Promise<void> => {
  try {
    const problemId = parseInt(route.params.problemId as string);
    if (!problemId) {
      console.error('강의 ID를 찾을 수 없습니다.');
      return;
    }

    const lecture = await lectureApiService.getLecture(problemId);
    lectureTitle.value = lecture.title || '';
    lectureDescription.value = lecture.description || '';
    
    console.log('강의 정보 로드 완료:', lecture.title);
  } catch (error) {
    console.error('강의 정보 로드 실패:', error);
    lectureTitle.value = '강의 정보를 불러올 수 없습니다.';
    lectureDescription.value = '';
  }
};

// 컴포넌트 마운트 - 데이터 준비 후 에디터 렌더링
onMounted(async () => {
  const tokenParam = route.query.token as string;
  const curriculumIdParam = route.query.curriculumId as string | undefined;

  console.log('ProblemResultView onMounted - 토큰:', tokenParam);
  console.log('ProblemResultView onMounted - 커리큘럼 ID:', curriculumIdParam);

  // curriculumId 저장
  if (curriculumIdParam) {
    curriculumId.value = curriculumIdParam;
  }

  // 강의 정보 로드
  await loadLectureInfo();

  // 네비게이션 정보 가져오기 (커리큘럼 ID가 있을 때만)
  if (curriculumIdParam) {
    const lectureId = Number(route.params.problemId);
    await fetchNavigationInfo(Number(curriculumIdParam), lectureId);
  }

  if (tokenParam) {
    try {
      // 토큰으로 정보 가져오기
      console.log('API 호출 시작 - getGradingResult');
      const result = await gradingAPI.getGradingResult(tokenParam, false);
      console.log('API 응답 받음:', result);

      // 에디터 설정 업데이트 (언어 + 소스코드)
      if (result.language_id && result.source_code) {
        languageId.value = result.language_id;
        editorConfig.value = languageApiService.createEditorConfig(
          result.language_id,
          result.source_code
        );
        console.log('에디터 설정 완료:', result.language_id, result.source_code.length);
      } else if (result.language_id) {
        // 소스코드가 없으면 기본 메시지
        const defaultCode = result.language_id === 71
          ? `# 소스코드를 불러올 수 없습니다`
          : `// 소스코드를 불러올 수 없습니다`;
        languageId.value = result.language_id;
        editorConfig.value = languageApiService.createEditorConfig(result.language_id, defaultCode);
      }

      token.value = tokenParam;

      // 에디터 렌더링 허용
      isEditorReady.value = true;
      console.log('에디터 렌더링 시작');

      // 채점 진행상황 시작
      startGradingProgress(tokenParam);
    } catch (error) {
      console.error('토큰 정보 로드 실패:', error);
      editorConfig.value = languageApiService.createEditorConfig(71, `# 오류: 채점 정보를 불러올 수 없습니다`);
      isEditorReady.value = true; // 에러가 나도 에디터는 표시
    }
  } else {
    // 토큰이 없으면 기본 설정
    console.log('토큰이 없음, 기본 설정 사용');
    languageId.value = 71;
    editorConfig.value = languageApiService.createEditorConfig(71, `# 토큰이 제공되지 않았습니다`);
    isGrading.value = false;
    isEditorReady.value = true;
  }

  // 백그라운드 작업
  loadSubmissionHistory();

  // 다음 강의 정보 설정
  const currentProblemId = parseInt(route.params.problemId as string);
  nextLesson.value = {
    id: currentProblemId + 1,
    title: 'A - B 문제',
    format: '문제'
  };
});

// 컴포넌트 정리
onUnmounted(() => {
  // 채점 SSE 연결 정리
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
  isConnected.value = false;

  // AI 해설 스트리밍 연결 정리
  if (explanationStreamController.value) {
    explanationStreamController.value.abort();
    explanationStreamController.value = null;
  }

  // 버퍼 정리
  explanationBuffer.value = '';
  isUpdatingExplanation.value = false;
});
</script>


