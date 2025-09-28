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
          <h3 class="text-lg font-semibold mb-4">제출한 소스코드</h3>
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
            다시풀기
          </button>
          <button 
            @click="goNext"
            class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            넘어가기
          </button>
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

const route = useRoute()
const router = useRouter()

// 소스코드 및 언어 정보
const sourceCode = ref('')
const languageId = ref(71) // 기본값 Python
const token = ref('')

// 진행상황 및 상태
const isGrading = ref(true)
const progressPercentage = ref(0)
const currentStatus = ref('채점을 시작합니다...')
const eventSource = ref<EventSource | null>(null)
const isConnected = ref(false) // 연결 상태 추적
const totalTestCase = ref(0) // 기본값 설정
const doneTestCase = ref(0)

// 테스트 결과 데이터
const testResults = ref<Array<{input: string, output: string, isSuccess: boolean}>>([])


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

// 언어 ID를 Monaco Editor 언어로 변환
const getMonacoLanguage = (languageId: number): string => {
  const languageMap: Record<number, string> = {
    70: 'python', 71: 'python', 63: 'javascript', 74: 'typescript',
    62: 'java', 48: 'c', 49: 'c', 50: 'c', 75: 'c',
    52: 'cpp', 53: 'cpp', 54: 'cpp', 76: 'cpp', 51: 'csharp',
    60: 'go', 73: 'rust', 72: 'ruby', 68: 'php', 64: 'lua',
    85: 'perl', 46: 'shell', 61: 'haskell', 55: 'lisp', 65: 'ocaml',
    69: 'prolog', 66: 'matlab', 80: 'r', 59: 'fortran', 67: 'pascal',
    56: 'd', 58: 'erlang', 57: 'elixir', 88: 'groovy', 86: 'clojure',
    81: 'scala', 78: 'kotlin', 79: 'objective-c', 83: 'swift', 84: 'vb',
    47: 'basic', 77: 'cobol', 45: 'asm', 82: 'sql', 87: 'fsharp',
    43: 'plaintext', 44: 'plaintext', 89: 'plaintext'
  };
  return languageMap[languageId] || 'plaintext';
};

// SSE 진행상황 연결
const startGradingProgress = async (token: string): Promise<void> => {
  if (isConnected.value || eventSource.value) {
    console.log('이미 SSE 연결이 존재합니다.');
    return;
  }
  
  try {
    // 채점 상태 확인
    const response = await fetch(`http://localhost:2358/grading/${token}`);
    if (response.ok) {
      const result = await response.json();
      
      // 소스코드와 언어 정보 업데이트
      if (result.source_code) {
        sourceCode.value = result.source_code;
      }
      if (result.language_id) {
        languageId.value = result.language_id;
      }
      
      // 이미 완료된 경우
      if (result.status?.id >= 3) {
        displayFinalResult(result);
        isGrading.value = false;
        return;
      }
    }
    
    // SSE 연결 시작
    isConnected.value = true;
    eventSource.value = new EventSource(`http://localhost:2358/grading/${token}/progress`);
    setupSSEHandlers();
  } catch (error) {
    console.error('채점 상태 확인 오류:', error);
    isConnected.value = true;
    eventSource.value = new EventSource(`http://localhost:2358/grading/${token}/progress`);
    setupSSEHandlers();
  }
};

// SSE 이벤트 핸들러 설정
const setupSSEHandlers = (): void => {
  if (!eventSource.value) return;
  
  eventSource.value.onopen = () => {
    currentStatus.value = '채점 진행상황을 받고 있습니다...';
  };
  
  eventSource.value.addEventListener('progress', (event) => {
    try {
      const data = JSON.parse(event.data);
      
      nextTick(() => {
        if (data.current_status === 'COMPLETED' || data.status?.id >= 3) {
          displayFinalResult(data);
          closeSSEConnection();
          isGrading.value = false;
        } else {
          updateProgressDisplay(data);
        }
      });
    } catch (error) {
      console.error('SSE 데이터 파싱 오류:', error);
    }
  });

  // error 이벤트 핸들러 추가
  eventSource.value.addEventListener('error', (event) => {
    try {
      const data = JSON.parse(event.data);
      
      nextTick(() => {
        console.log('Error 이벤트 수신:', data);
        // error 이벤트로 받은 데이터를 최종 결과로 처리
        displayFinalResult(data);
        closeSSEConnection();
        isGrading.value = false;
      });
    } catch (error) {
      console.error('Error 이벤트 데이터 파싱 오류:', error);
      // 파싱 실패 시 단순 문자열로 처리
      nextTick(() => {
        currentStatus.value = `오류: ${event.data}`;
        isGrading.value = false;
        closeSSEConnection();
      });
    }
  });

  eventSource.value.onerror = () => {
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
  totalTestCase.value = result.total_test_case || 0;
  doneTestCase.value = result.done_test_case || 0;
  progressPercentage.value = 100;
  
  // 채점 결과에 따른 메시지 설정
  if (result.status?.id === 3) {
    // Accepted - 모든 테스트케이스 통과
    currentStatus.value = `채점 완료! 총 ${totalTestCase.value}개 테스트케이스 모두 통과`;
    testResults.value = []; // 성공 시에는 상세 결과 표시하지 않음
  } else if (result.status?.id === 4) {
    // Wrong Answer - 일부 실패
    currentStatus.value = `채점 완료! 총 ${totalTestCase.value}개 테스트케이스 중 ${doneTestCase.value}개 통과`;
    testResults.value = []; // 실패 시에도 개별 테스트케이스 표시하지 않음
  } else if (result.status?.id === 6) {
    // Compilation Error
    currentStatus.value = '컴파일 오류가 발생했습니다.';
    testResults.value = [{
      input: '컴파일 오류',
      output: result.compile_output || result.stderr || '컴파일 중 오류가 발생했습니다.',
      isSuccess: false
    }];
  } else if (result.status?.id === 7) {
    // Runtime Error
    currentStatus.value = '런타임 오류가 발생했습니다.';
    testResults.value = [{
      input: '런타임 오류',
      output: result.stderr || '실행 중 오류가 발생했습니다.',
      isSuccess: false
    }];
  } else if (result.status?.id === 5) {
    // Time Limit Exceeded
    currentStatus.value = '시간 초과가 발생했습니다.';
    testResults.value = [{
      input: '시간 초과',
      output: result.stderr || '코드 실행 시간이 제한을 초과했습니다.',
      isSuccess: false
    }];
  } else {
    // 기타 오류 (시스템 오류 포함) - stderr 우선 표시
    currentStatus.value = `채점 완료! 상태: ${result.status?.description || '알 수 없음'}`;
    testResults.value = [{
      input: '오류',
      output: result.stderr || result.message || '알 수 없는 오류가 발생했습니다.',
      isSuccess: false
    }];
  }
};

// 컴포넌트 초기화
onMounted(() => {
  const tokenParam = route.query.token as string;
  
  if (tokenParam) {
    token.value = tokenParam;
    startGradingProgress(tokenParam);
  } else {
    // 토큰이 없으면 기본 테스트용 데이터 설정
    sourceCode.value = `# A + B 문제
a, b = map(int, input().split())
print(a + b)`;
    languageId.value = 71;
    isGrading.value = false;
  }
  
  const currentProblemId = parseInt(route.params.problemId as string);
  nextLesson.value = {
    id: currentProblemId + 1,
    title: 'A - B 문제',
    format: '문제'
  };
});

// 컴포넌트 정리
onUnmounted(closeSSEConnection);
</script>


