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
            <h1 class="text-lg font-semibold">개발 - 프로그래밍 / 모바일 앱 개발</h1>
            <p class="text-sm text-gray-600">[코드팩토리] [초급] Flutter 3.0 앱 개발 - 10개의 프로젝트로 오늘 초보 탈출!</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- 다음 강의 버튼 -->
          <button 
            v-if="nextLesson"
            @click="goToNextLesson"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span>다음 강의</span>
          </button>
          <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex h-[calc(100vh-80px)]">
      <!-- 왼쪽: 소스코드 에디터 -->
      <div class="w-1/2 bg-white border-r">
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
                @click="activeCodeTab = 'history'"
                class="px-3 py-1 text-sm rounded-md"
                :class="activeCodeTab === 'history' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'"
              >
                내 제출
              </button>
            </div>
            <div v-if="activeCodeTab === 'history'" class="flex items-center gap-2">
              <select v-model="selectedHistoryId" @change="loadSelectedHistory" class="px-2 py-1 border rounded-md text-sm">
                <option v-for="(s, idx) in mySubmissions" :key="s.id" :value="s.id">{{ idx + 1 }}차 · {{ s.submittedAt }}</option>
              </select>
            </div>
          </div>
          <div class="h-[calc(100vh-200px)]">
            <MonacoEditor
              v-model="sourceCode"
              :language="getMonacoLanguage(languageId)"
              theme="vs-dark"
              :options="editorOptions"
              class="w-full h-full border rounded-lg"
            />
          </div>
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
              <span>{{ progressPercentage }}% 완료</span>
              <span>{{ doneTestCase }}/{{ totalTestCase }} 테스트케이스</span>
            </div>
          </div>
        </div>

        <!-- 채점 결과 -->
        <div v-else class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">채점 결과: {{ successRate }}% 성공!!</h2>

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

        <!-- 테스트 결과 상세 -->
        <div v-if="!isGrading && testResults.length > 0" class="bg-white rounded-lg border p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">테스트 결과</h3>
          <div class="space-y-3">
            <div 
              v-for="(result, index) in testResults" 
              :key="index"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="result.isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  :class="result.isSuccess ? 'bg-green-500' : 'bg-red-500'"
                >
                  {{ result.isSuccess ? '✓' : '✗' }}
                </div>
                <span class="font-medium">{{ result.input }}</span>
              </div>
              <div class="text-sm text-gray-600 max-w-md">
                <pre class="whitespace-pre-wrap">{{ result.output }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div v-if="!isGrading" class="flex justify-center space-x-4">
          <button 
            @click="tryAgain"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            돌아가기
          </button>
          <button 
            @click="goNext"
            class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            넘어가기
          </button>
          <button 
            @click="toggleExplanation"
            class="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
          >
            {{ showExplanation ? '해설 닫기' : '해설보기' }}
          </button>
        </div>

        <!-- AI 해설 패널 -->
        <div v-if="!isGrading && showExplanation" class="mt-6">
          <div class="bg-white rounded-lg border p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">AI 해설</h3>
              <button @click="toggleExplanation" class="text-sm text-gray-500 hover:text-gray-700">닫기</button>
            </div>
            <div class="text-sm text-gray-600 mb-3">제출한 코드 분석과 테스트 결과를 기반으로 오답 원인을 설명합니다.</div>
            <div class="max-h-64 overflow-y-auto space-y-4">
              <div v-if="isLoadingExplanation" class="flex items-center space-x-2 text-purple-600">
                <div class="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                <span>해설을 생성하고 있습니다...</span>
              </div>
              <div v-else-if="explanation.length > 0" class="prose prose-sm max-w-none">
                <div v-for="(para, idx) in explanation" :key="idx" class="whitespace-pre-wrap">{{ para }}</div>
              </div>
              <div v-else class="text-gray-500">해설이 없습니다. 해설보기를 눌러 생성하세요.</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import { languageApiService } from '../services/languageApi'
import { gradingAPI, type GradingResponse } from '../services/gradingAPI'

const route = useRoute()
const router = useRouter()

// 소스코드 및 언어 정보
const sourceCode = ref('')
const languageId = ref(71) // 기본값 Python
const token = ref('')

// 진행상황 및 상태
const isGrading = ref(true)
const progressPercentage = ref(0)
const currentStatus = ref('채점 결과를 불러오는 중...')
const eventSource = ref<EventSource | null>(null)
const isConnected = ref(false) // 연결 상태 추적
const totalTestCase = ref(0) // 기본값 설정
const doneTestCase = ref(0)

// 테스트 결과 데이터
const testResults = ref<Array<{input: string, output: string, isSuccess: boolean}>>([])

// AI 해설 상태
const showExplanation = ref(false)
const isLoadingExplanation = ref(false)
const explanation = ref<string[]>([])

// 코드 탭/내 제출 히스토리
const activeCodeTab = ref<'current' | 'history'>('current')
const mySubmissions = ref<Array<{id: string, submittedAt: string, language_id?: number, source_code: string}>>([])
const selectedHistoryId = ref('')


// Monaco Editor 옵션
const editorOptions = {
  theme: 'vs-dark',
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  folding: true,
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: true,
  cursorStyle: 'line'
};


// 다음 강의 정보
const nextLesson = ref<{id: number, title: string, format: string} | null>(null)

// 성공률 계산
const successRate = computed(() => {
  if (totalTestCase.value === 0) return 0;
  return Math.round((doneTestCase.value / totalTestCase.value) * 100);
})

// 네비게이션 함수들
const tryAgain = (): void => {
  router.push({ name: 'problem', params: { problemId: route.params.problemId } });
};

const goNext = (): void => {
  router.push({ name: 'curriculum-detail', params: { id: 'course_1' } });
};

const goToNextLesson = (): void => {
  if (!nextLesson.value) return;
  
  const routeName = nextLesson.value.format === '문제' ? 'problem' : 'learning';
  const params = nextLesson.value.format === '문제' 
    ? { problemId: nextLesson.value.id }
    : { lessonId: nextLesson.value.id };
  
  router.push({ name: routeName, params });
};

const goBack = (): void => {
  router.back();
};

// 해설 토글 및 더미 생성 로직 (백엔드 연동 전 임시)
const toggleExplanation = (): void => {
  showExplanation.value = !showExplanation.value;
  if (showExplanation.value && explanation.value.length === 0) {
    isLoadingExplanation.value = true;
    // 임시 지연 후 예시 해설 세팅
    setTimeout(() => {
      explanation.value = [
        '입력 파싱 단계에서 공백 분리 후 형변환이 제대로 수행되는지 확인하세요.',
        '테스트케이스 2에서 예상 출력이 7인데 5가 출력되었습니다. 덧셈 연산 전에 문자열 상태로 더해졌을 가능성이 있습니다.',
        '에지 케이스: 음수, 큰 수 입력 시 오버플로우/형변환 오류가 없는지 점검하세요.',
        '시간 복잡도는 본 문제에서 핵심 이슈가 아니지만, 반복 입력 처리 시 불필요한 I/O 호출을 줄이면 안정성이 높아집니다.'
      ];
      isLoadingExplanation.value = false;
    }, 800);
  }
};

// 히스토리 코드 불러오기
const loadSelectedHistory = (): void => {
  if (!selectedHistoryId.value) return;
  const item = mySubmissions.value.find(s => s.id === selectedHistoryId.value);
  if (!item) return;
  sourceCode.value = item.source_code || '';
  if (item.language_id) languageId.value = item.language_id;
};

// 언어 ID를 Monaco Editor 언어로 변환
const getMonacoLanguage = (languageId: number): string => {
  return languageApiService.getMonacoLanguage(languageId);
};

// 채점 결과 조회 (일반 조회 → 프로그레스로 전환)
const startGradingProgress = async (token: string): Promise<void> => {
  try {
    console.log('=== 채점 진행상황 시작 ===');
    console.log('토큰:', token);
    
    // 1. 먼저 일반 조회 (제출 상태 확인)
    const result = await gradingAPI.getGradingResult(token, false);
    console.log('일반 조회 결과:', result);
    
    // 소스코드와 언어 정보 업데이트
    if (result.source_code) {
      sourceCode.value = result.source_code;
    }
    if (result.language_id) {
      languageId.value = result.language_id;
    }
    
    // 채점이 완료되었는지 확인
    if (result.status && result.status.id >= 3) {
      // 완료된 경우 결과 표시
      console.log('채점 완료됨, 결과 표시');
      displayFinalResult(result);
      isGrading.value = false;
    } else {
      // 아직 진행 중인 경우 프로그레스로 전환
      console.log('채점 진행 중, SSE 연결 시작');
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
    eventSource.value = new EventSource(`http://localhost:2358/grading/${token}/progress`);
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
        displayFinalResult(data);
        closeSSEConnection();
        isGrading.value = false;
      } else {
        updateProgressDisplay(data);
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
      displayFinalResult(data);
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
const updateProgressDisplay = (progress: any): void => {
  // 데이터 업데이트
  totalTestCase.value = progress.total_test_case || 0;
  doneTestCase.value = progress.done_test_case || 0;
  progressPercentage.value = Math.round(progress.progress_percentage || 0);
  
  // 상태 메시지 설정
  const statusMessages: Record<string, string> = {
    'INITIALIZING': '채점을 준비하고 있습니다...',
    'STARTING': `채점을 시작합니다... (총 ${totalTestCase.value}개 테스트케이스)`,
    'RUNNING': `테스트케이스 ${progress.current_test_case || 0}/${totalTestCase.value} 처리 중...`,
    'COMPLETED': `채점 완료! 총 ${totalTestCase.value}개 테스트케이스 중 ${doneTestCase.value}개 통과`,
    'ERROR': '채점 중 오류가 발생했습니다.'
  };
  
  currentStatus.value = statusMessages[progress.current_status] || progress.message || '채점 중...';
};

// 최종 결과 표시
const displayFinalResult = (result: any): void => {
  isGrading.value = false;
  progressPercentage.value = 100;
  
  // 백엔드 DTO 구조에 맞게 결과 처리 (err_inputOutput 필드 사용)
  if (result.status?.id === 3) {
    // Accepted - 성공
    currentStatus.value = '채점 완료! 모든 테스트케이스 통과';
    testResults.value = []; // 성공 시에는 상세 결과 표시하지 않음
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 1;
  } else if (result.status?.id === 4) {
    // Wrong Answer - 실패
    currentStatus.value = '채점 완료! 일부 테스트케이스 실패';
    testResults.value = []; // 실패 시에도 개별 테스트케이스 표시하지 않음
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 0;
  } else if (result.status?.id === 6) {
    // Compilation Error
    currentStatus.value = '컴파일 오류가 발생했습니다.';
    testResults.value = [{
      input: '컴파일 오류',
      output: result.err_inputOutput?.compileOutput || result.err_inputOutput?.stderr || '컴파일 중 오류가 발생했습니다.',
      isSuccess: false
    }];
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 0;
  } else if (result.status?.id === 7) {
    // Runtime Error
    currentStatus.value = '런타임 오류가 발생했습니다.';
    testResults.value = [{
      input: '런타임 오류',
      output: result.err_inputOutput?.stderr || '실행 중 오류가 발생했습니다.',
      isSuccess: false
    }];
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 0;
  } else if (result.status?.id === 5) {
    // Time Limit Exceeded
    currentStatus.value = '시간 초과가 발생했습니다.';
    testResults.value = [{
      input: '시간 초과',
      output: result.err_inputOutput?.stderr || '코드 실행 시간이 제한을 초과했습니다.',
      isSuccess: false
    }];
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 0;
  } else {
    // 기타 오류 (시스템 오류 포함)
    currentStatus.value = `채점 완료! 상태: ${result.status?.description || '알 수 없음'}`;
    testResults.value = [{
      input: '오류',
      output: result.err_inputOutput?.stderr || result.message || '알 수 없는 오류가 발생했습니다.',
      isSuccess: false
    }];
    totalTestCase.value = result.progress?.total_test_case || 1;
    doneTestCase.value = result.progress?.done_test_case || 0;
  }
};

// 컴포넌트 초기화
onMounted(() => {
  console.log('=== ProblemResultView 초기화 ===');
  console.log('현재 라우트:', route);
  console.log('라우트 파라미터:', route.params);
  console.log('라우트 쿼리:', route.query);
  
  const tokenParam = route.query.token as string;
  console.log('토큰 파라미터:', tokenParam);
  
  if (tokenParam) {
    console.log('토큰이 있음, 채점 진행상황 시작');
    token.value = tokenParam;
    startGradingProgress(tokenParam);
  } else {
    console.log('토큰이 없음, 기본 테스트용 데이터 설정');
    // 토큰이 없으면 기본 테스트용 데이터 설정
    sourceCode.value = `# A + B 문제
a, b = map(int, input().split())
print(a + b)`;
    languageId.value = 71;
    isGrading.value = false;
  }
  
  // 과거 제출 로드 (로컬스토리지 모킹)
  try {
    const saved = localStorage.getItem('mySubmissions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 간단 매핑: 코드 필드가 없으면 예시 코드로 채움
      mySubmissions.value = parsed.map((p: any, idx: number) => ({
        id: p.id || `h${idx}`,
        submittedAt: p.submittedAt || '알 수 없음',
        language_id: p.language_id || 71,
        source_code: p.source_code || '# 제출 코드가 없습니다\nprint(1+1)'
      }));
      if (mySubmissions.value.length > 0) {
        selectedHistoryId.value = mySubmissions.value[0].id;
      }
    }
  } catch (e) {
    console.warn('mySubmissions 파싱 실패:', e);
  }

  const currentProblemId = parseInt(route.params.problemId as string);
  nextLesson.value = {
    id: currentProblemId + 1,
    title: 'A - B 문제',
    format: '문제'
  };
});

// 컴포넌트 정리
onUnmounted(() => {
  // SSE 연결 정리
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
  isConnected.value = false;
});
</script>


