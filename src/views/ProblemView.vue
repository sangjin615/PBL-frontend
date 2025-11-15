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
          <!-- 신고 버튼 -->
          <ReportButton
            report-type="problem"
            :target-id="problem.id"
            :target-title="problem.title"
            @reported="handleReported"
          />

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
      <!-- 왼쪽 패널 - 교과서 영역 -->
      <div class="w-1/2 bg-white border-r overflow-y-auto">
        <div class="p-6">
          <!-- 문제 제목 -->
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ problem.title }}</h2>
          
          <!-- 문제 제약조건 -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600">시간제한</span>
                <p class="font-semibold">{{ problem.timeLimit }}</p>
              </div>
              <div>
                <span class="text-gray-600">메모리 제한</span>
                <p class="font-semibold">{{ problem.memoryLimit }}</p>
              </div>
              <div>
                <span class="text-gray-600">정답 비율</span>
                <p class="font-semibold">{{ problem.successRate }}</p>
              </div>
            </div>
          </div>

          <!-- 문제 설명 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">문제</h3>
            <p class="text-gray-700 leading-relaxed">{{ problem.description }}</p>
          </div>

          <!-- 입력 설명 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">입력</h3>
            <p class="text-gray-700 leading-relaxed">{{ problem.inputDescription }}</p>
          </div>

          <!-- 출력 설명 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">출력</h3>
            <p class="text-gray-700 leading-relaxed">{{ problem.outputDescription }}</p>
          </div>

          <!-- 예시 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">예시</h3>
            <div class="space-y-4">
              <div v-for="(testCase, index) in problem.testCases" :key="index" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-700">예시 {{ index + 1 }}</h4>
                  <button
                    :aria-label="`예시 ${index + 1} 실행`
                    "
                    class="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="runTestCase(index)"
                    :disabled="isRunning"
                    title="이 예시로 실행"
                  >
                    <svg v-if="!isRunning" class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.5 5.5v9l8-4.5-8-4.5z"></path>
                    </svg>
                    <div v-else class="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h5 class="font-medium text-gray-700 mb-2">입력</h5>
                    <pre class="text-sm bg-white p-2 rounded border">{{ testCase.input }}</pre>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-700 mb-2">출력</h5>
                    <pre class="text-sm bg-white p-2 rounded border">{{ testCase.output }}</pre>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 사용자 임의 입력 실행 영역 -->
            <div class="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 mb-2">사용자 입력으로 실행</h4>
              <textarea
                v-model="customInput"
                class="w-full h-24 text-sm bg-white p-2 rounded border focus:outline-none focus:ring"
                placeholder="표준 입력(stdin)에 들어갈 값을 입력하세요. 여러 줄 입력 가능"
              ></textarea>
              <div class="mt-3 flex justify-end">
                <button
                  @click="runCustomInput"
                  :disabled="isRunning"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isRunning ? '실행 중...' : '입력으로 실행' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽 패널 - 코드 에디터 영역 -->
      <div class="w-1/2 bg-gray-50 flex flex-col">
        <!-- 파일명과 언어 선택 -->
        <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h3 class="font-semibold">코드 에디터</h3>
            <select
              v-model="selectedLanguage"
              @change="changeLanguage(selectedLanguage)"
              class="px-3 py-1 border rounded text-sm"
            >
              <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
          </div>
            <div class="flex space-x-2">
              <Button 
                @click="submitCode"
                :loading="isRunning"
                loading-text="채점 중..."
                variant="success"
              >
                제출하기
              </Button>
            </div>
        </div>

        <!-- 코드 에디터 -->
        <div class="flex-1 p-4">
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

        <!-- 실행 결과 터미널 -->
        <div class="bg-white border-t">
          <div class="px-4 py-3 border-b">
            <h3 class="font-medium">실행결과</h3>
          </div>
          <div class="h-48 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
            <div v-if="isRunning" class="flex items-center space-x-2">
              <div class="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
              <span>실행 중...</span>
            </div>
            <div v-else-if="executionResult" class="whitespace-pre-wrap">
              {{ executionResult.stdout || executionResult.message || '실행 결과가 없습니다.' }}
            </div>
            <div v-else class="text-gray-500">실행 결과가 여기에 표시됩니다.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼들 -->
    <div class="bg-white border-t px-6 py-4">
      <div class="flex items-center justify-start">
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            질문하기
          </button>
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            초기화
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import { Button, LoadingSpinner, ErrorMessage, ReportButton } from '@/components/common'
import { languageApiService } from '../services/languageApi'
import { submissionAPI, type SubmissionResult } from '../services/submissionAPI'
import { gradingAPI, type GradingRequest } from '../services/gradingAPI'
import type { MonacoEditorConfig } from '../services/extendedClient'

const route = useRoute()
const router = useRouter()

// 문제 데이터
const problem = ref({
  id: 3,
  title: 'A + B',
  timeLimit: '1초',
  memoryLimit: '256MB',
  successRate: '75.2%',
  description: '두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.',
  inputDescription: '첫째 줄에 A와 B가 공백으로 구분되어 주어진다. (0 ≤ A, B ≤ 10)',
  outputDescription: '첫째 줄에 A+B를 출력한다.',
  testCases: [
    {
      input: '1 2',
      output: '3'
    },
    {
      input: '5 7',
      output: '12'
    }
  ]
})

// 코드 에디터 관련
const selectedLanguage = ref(71) // Python 3의 ID를 기본값으로
const executionResult = ref<SubmissionResult | null>(null)
const isRunning = ref(false)
const supportedLanguages = ref<Array<{id: number, name: string, version?: string, file_extension?: string}>>([]) // API에서 가져올 언어 목록
const customInput = ref('')
const monacoEditorRef = ref<any>(null)
const isEditorReady = ref(false) // 에디터 준비 상태

// Monaco Editor 통합 설정
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(71, '')
)

// 다음 강의 정보
const nextLesson = ref<{id: number, title: string, format: string} | null>(null)

// 언어 변경 핸들러 - 에디터 설정 재생성
const changeLanguage = (newLanguageId: number) => {
  selectedLanguage.value = newLanguageId;
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  editorConfig.value = languageApiService.createEditorConfig(newLanguageId, currentCode);
  console.log('언어 변경:', newLanguageId, '에디터 재생성됨');
};

// 신고 완료 핸들러
function handleReported() {
  window.alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
}

// 특정 테스트케이스 입력으로 실행
const runTestCase = async (index: number): Promise<void> => {
  const tc = problem.value.testCases[index]
  if (!tc) return

  // Monaco Editor에서 현재 코드 가져오기
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';

  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    }
    return
  }

  isRunning.value = true
  executionResult.value = null

  try {
    const result = await submissionAPI.executeWithTestCase(
      currentCode,
      selectedLanguage.value,
      tc.input
    )

    executionResult.value = result
  } catch (error: any) {
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    }
  } finally {
    isRunning.value = false
  }
}

// 사용자 임의 입력으로 실행
const runCustomInput = async (): Promise<void> => {
  // Monaco Editor에서 현재 코드 가져오기
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';

  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    }
    return
  }

  isRunning.value = true
  executionResult.value = null

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: customInput.value || ''
    })

    executionResult.value = result
  } catch (error: any) {
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    }
  } finally {
    isRunning.value = false
  }
}

// 코드 제출 (채점)
const submitCode = async (): Promise<void> => {
  // Monaco Editor에서 현재 코드 가져오기
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';

  if (!currentCode.trim()) {
    alert('제출할 코드가 없습니다.');
    return;
  }

  console.log('=== 제출 시작 ===');
  console.log('코드:', currentCode);
  console.log('언어 ID:', selectedLanguage.value);
  console.log('문제 ID:', problem.value.id);

  isRunning.value = true;
  executionResult.value = {
    message: '채점을 제출하고 있습니다...'
  };

  try {
    const gradingRequest: GradingRequest = {
      source_code: currentCode,
      language_id: selectedLanguage.value,
      problem_id: problem.value.id
    };

    console.log('채점 요청:', gradingRequest);
    const result = await gradingAPI.submitForGrading(gradingRequest);
    console.log('채점 응답:', result);
    
    // 제출 성공 메시지 표시
    executionResult.value = {
      message: `제출 완료! 채점 토큰: ${result.token}\n결과 페이지로 이동합니다...`
    };
    
    // 즉시 결과 페이지로 이동 (테스트용)
    const routeParams = {
      name: 'problem-result',
      params: { problemId: problem.value.id.toString() },
      query: { token: result.token }
    };
    console.log('라우팅 시도:', routeParams);
    
    router.push(routeParams).then(() => {
      console.log('라우팅 성공!');
    }).catch((error) => {
      console.error('라우팅 실패:', error);
      executionResult.value = {
        message: `라우팅 오류: ${error.message}`
      };
      isRunning.value = false;
    });
    
  } catch (error: any) {
    console.error('채점 제출 오류:', error);
    executionResult.value = {
      message: `채점 제출 오류: ${error.message}`
    };
    isRunning.value = false;
  }
};


// 네비게이션 함수들
const goBack = (): void => {
  router.back();
};

const goToNextLesson = (): void => {
  if (!nextLesson.value) return;
  router.push({ name: 'lecture', params: { lectureId: nextLesson.value.id } });
};

// 신고 완료 처리
const handleReported = (): void => {
  console.log('문제 신고가 접수되었습니다.');
};

// API에서 지원하는 언어 목록을 가져오는 함수
const fetchSupportedLanguages = async (): Promise<void> => {
  try {
    const languages = await languageApiService.getLanguages();
    supportedLanguages.value = languages;
    console.log('언어 목록 로드 완료:', languages.length, '개 언어');
  } catch (error) {
    console.error('언어 목록 로드 실패:', error);
    // 기본 언어 목록으로 fallback
    supportedLanguages.value = [
      { id: 71, name: 'Python (3.8.1)', version: '3.8.1', file_extension: '.py' },
      { id: 63, name: 'JavaScript (Node.js 12.14.0)', version: '12.14.0', file_extension: '.js' },
      { id: 62, name: 'Java (OpenJDK 13.0.1)', version: '13.0.1', file_extension: '.java' },
      { id: 54, name: 'C++ (GCC 9.2.0)', version: '9.2.0', file_extension: '.cpp' }
    ];
  }
};

// 컴포넌트 마운트 - 데이터 준비 후 에디터 렌더링
onMounted(async () => {
  console.log('ProblemView onMounted 시작');

  // 1. 언어 목록 먼저 가져오기
  await fetchSupportedLanguages();

  // 2. 토큰이 있으면 소스코드와 언어 정보 가져오기
  const tokenParam = route.query.token as string;
  if (tokenParam) {
    try {
      console.log('토큰으로 정보 가져오기:', tokenParam);
      const result = await gradingAPI.getGradingResult(tokenParam, false);

      // 에디터 설정 업데이트 (언어 + 소스코드)
      if (result.language_id && result.source_code) {
        selectedLanguage.value = result.language_id;
        editorConfig.value = languageApiService.createEditorConfig(
          result.language_id,
          result.source_code
        );
        console.log('에디터 설정 완료:', result.language_id, result.source_code.length);
      }
    } catch (error) {
      console.error('토큰으로 정보 가져오기 실패:', error);
    }
  }

  // 3. 에디터 렌더링 허용
  isEditorReady.value = true;
  console.log('에디터 렌더링 시작');

  // 4. 기타 초기화
  const currentProblemId = parseInt(route.params.problemId as string);
  nextLesson.value = {
    id: 4,
    title: 'A - B 문제',
    format: '문제'
  };
});
</script>
