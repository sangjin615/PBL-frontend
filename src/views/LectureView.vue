<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">
              {{ loading ? '강의 정보 로딩 중...' : lessonData.title }}
            </h1>
            <p class="text-sm text-gray-600">{{ lessonData.instructor }} • {{ lessonData.duration }}</p>
            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600">
            진행률: {{ progress }}%
          </div>
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: progress + '%' }"
            ></div>
          </div>
          
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
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex h-screen select-none">
      <!-- 왼쪽: 타입별 분기 영역 -->
      <div class="border-r overflow-y-auto bg-white" :style="{ width: leftPaneWidth + '%' }">
        <div class="p-6">
          <!-- 로딩/에러 상태 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="text-gray-600">강의 내용을 불러오는 중...</div>
          </div>
          <div v-else-if="error" class="flex justify-center items-center py-12">
            <div class="text-red-600">{{ error }}</div>
          </div>
          
          <!-- MARKDOWN 타입: 마크다운 뷰어 -->
          <div v-else-if="lectureType === 'MARKDOWN'" class="markdown-content">
            <MdPreview 
              :modelValue="markdownContent"
              language="ko-KR"
              :theme="'light'"
              :editorId="'learning-markdown-preview'"
            />
          </div>
          
          <!-- PROBLEM 타입: 문제 설명 -->
          <div v-else-if="lectureType === 'PROBLEM'" class="problem-content">
            <!-- 문제 제목 -->
            <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ problemData.title }}</h2>
            
            <!-- 문제 제약조건 -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">시간제한</span>
                  <p class="font-semibold">{{ problemData.timeLimit }}</p>
                </div>
                <div>
                  <span class="text-gray-600">메모리 제한</span>
                  <p class="font-semibold">{{ problemData.memoryLimit }}</p>
                </div>
                <div>
                  <span class="text-gray-600">정답 비율</span>
                  <p class="font-semibold">{{ problemData.successRate }}</p>
                </div>
              </div>
            </div>
            
            <!-- 문제 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">문제</h3>
              <p class="text-gray-700 leading-relaxed">{{ problemData.description }}</p>
            </div>

            <!-- 입력 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">입력</h3>
              <p class="text-gray-700 leading-relaxed">{{ problemData.inputDescription }}</p>
            </div>

            <!-- 출력 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">출력</h3>
              <p class="text-gray-700 leading-relaxed">{{ problemData.outputDescription }}</p>
            </div>
            
            <!-- 테스트케이스 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">테스트 케이스</h3>
              <div v-if="problemData.testCases.length === 0" class="text-gray-500">
                테스트 케이스가 없습니다.
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="(tc, idx) in problemData.testCases" 
                  :key="idx" 
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="font-medium text-gray-700">테스트케이스 {{ idx + 1 }}</h4>
                    <button
                      :aria-label="`테스트케이스 ${idx + 1} 실행`"
                      class="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="runTestCase(tc)"
                      :disabled="isRunning"
                      title="이 테스트케이스로 실행"
                    >
                      <svg v-if="!isRunning" class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.5 5.5v9l8-4.5-8-4.5z"></path>
                      </svg>
                      <div v-else class="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-gray-700 mb-2">입력</h5>
                      <pre class="text-sm bg-white p-2 rounded border">{{ tc.input }}</pre>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-700 mb-2">출력</h5>
                      <pre class="text-sm bg-white p-2 rounded border">{{ tc.output }}</pre>
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
      </div>

      <!-- 세로 분리선 -->
      <div class="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize" @mousedown="startDragLeftRight"></div>

      <!-- 오른쪽: 코드 에디터 영역 -->
      <div class="bg-gray-50 flex flex-col" :style="{ width: (100 - leftPaneWidth) + '%' }">
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
            <button 
              v-if="lectureType === 'PROBLEM'"
              @click="submitCode"
              :disabled="isRunning"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isRunning ? '채점 중...' : '제출하기' }}
            </button>
          </div>
        </div>

        <!-- 코드 에디터 / 실행 결과 - 수직 분할 컨테이너 -->
        <div class="flex-1 p-4 flex flex-col">
          <div class="border rounded-lg overflow-hidden" :style="{ height: editorAreaHeight + '%' }">
            <MonacoEditor
              v-if="isEditorReady"
              ref="monacoEditorRef"
              :key="editorConfig.languageId"
              :config="editorConfig"
              class="w-full h-full"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-gray-500">에디터 준비 중...</div>
            </div>
          </div>
          <!-- 가로 분리선 -->
          <div class="h-1 bg-gray-300 hover:bg-gray-400 cursor-row-resize" @mousedown="startDragEditorTerminal"></div>
          <div class="border bg-gray-50 flex-1 flex flex-col" :style="{ height: (100 - editorAreaHeight) + '%' }">
            <div class="px-4 py-2 border-b">
              <h4 class="font-semibold text-sm">실행 결과</h4>
            </div>
            <div class="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
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
    </div>

    <!-- 하단 버튼들 (주석 처리) -->
    <!-- 
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
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MonacoEditor from '../components/editor/MonacoEditor.vue';
import { languageApiService } from '../services/languageApi';
import { submissionAPI, type SubmissionResult } from '../services/submissionAPI';
import type { MonacoEditorConfig } from '../services/extendedClient';
import { lectureApiService } from '../services/lectureApi';
import type { Lecture } from '../types/lecture';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import '../styles/md-editor-korean.css';
import { gradingAPI, type GradingRequest } from '../services/gradingAPI';

const route = useRoute();
const router = useRouter();

// 반응형 데이터
const progress = ref(25);
const isRunning = ref(false);
const executionResult = ref<SubmissionResult | null>(null);
const monacoEditorRef = ref<any>(null);
const selectedLanguage = ref(71); // Python 3의 ID를 기본값으로
const supportedLanguages = ref<Array<{id: number, name: string, version?: string, file_extension?: string}>>([]); // API에서 가져올 언어 목록

// API 연결 상태
const loading = ref(true);
const error = ref<string | null>(null);

// 강의 타입별 상태
const lectureType = ref<'MARKDOWN' | 'PROBLEM'>('MARKDOWN');
const markdownContent = ref('');
const problemData = ref({
  title: '',
  timeLimit: '1초',
  memoryLimit: '256MB',
  successRate: '75.2%',
  description: '',
  inputDescription: '',
  outputDescription: '',
  testCases: [] as Array<{input: string, output: string}>
});

// 사용자 임의 입력 실행 기능
const customInput = ref('');

// Monaco Editor 통합 설정
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(71, '')
)

// 에디터 준비 상태
const isEditorReady = ref(false);

// 다음 강의 정보
const nextLesson = ref<{id: number, title: string, format: string} | null>(null);

// 강의 데이터
const lessonData = ref({
  title: 'Introduction To Algorithms - 1강: 정렬 알고리즘',
  instructor: '김유희',
  duration: '45분',
  chapters: [
    {
      id: 1,
      title: '버블 정렬',
      sections: [
        {
          id: 1,
          title: '버블 정렬이란?',
          content: '버블 정렬은 인접한 두 원소를 비교하여 정렬하는 간단한 정렬 알고리즘입니다. 가장 큰 원소가 맨 뒤로 "버블"처럼 올라가는 모습에서 이름이 유래되었습니다.',
          codeExample: {
            language: 'Python',
            code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# 예제
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)
print(sorted_numbers)`
          },
          explanation: '이 코드는 배열의 각 원소를 인접한 원소와 비교하여 더 큰 원소를 뒤로 이동시킵니다. 외부 루프는 전체 배열을 한 번씩 순회하고, 내부 루프는 정렬되지 않은 부분만 순회합니다.'
        },
        {
          id: 2,
          title: '시간 복잡도',
          content: '버블 정렬의 시간 복잡도는 O(n²)입니다. 최악의 경우 모든 원소를 비교해야 하므로 비효율적입니다.',
          codeExample: {
            language: 'Python',
            code: `# 시간 복잡도 분석
# 외부 루프: n번 실행
# 내부 루프: n-1, n-2, ..., 1번 실행
# 총 비교 횟수: n(n-1)/2 ≈ n²/2
# 따라서 시간 복잡도: O(n²)`
          },
          explanation: '버블 정렬은 간단하지만 효율적이지 않습니다. 대용량 데이터에는 적합하지 않습니다.'
        }
      ]
    },
    {
      id: 2,
      title: '선택 정렬',
      sections: [
        {
          id: 1,
          title: '선택 정렬이란?',
          content: '선택 정렬은 배열에서 가장 작은 원소를 찾아 맨 앞으로 이동시키는 정렬 알고리즘입니다.',
          codeExample: {
            language: 'Python',
            code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
          },
          explanation: '선택 정렬은 각 단계에서 최솟값을 찾아 정렬된 위치에 배치합니다.'
        }
      ]
    }
  ]
});

// Lecture API 응답을 Problem 형식으로 변환하는 어댑터
function adaptLectureToProblem(lecture: Lecture) {
  return {
    title: lecture.title,
    timeLimit: lecture.timeLimit ? `${lecture.timeLimit}초` : '1초',
    memoryLimit: lecture.memoryLimit ? `${lecture.memoryLimit}MB` : '256MB',
    successRate: '75.2%',
    description: lecture.description || '',
    inputDescription: '첫째 줄에 입력이 주어진다.',
    outputDescription: '첫째 줄에 결과를 출력한다.',
    testCases: lecture.testCases?.map(tc => ({
      input: tc.input,
      output: tc.expectedOutput
    })) || []
  };
}

// Lecture API에서 강의 정보 로드
async function loadLectureData() {
  try {
    loading.value = true;
    error.value = null;

    const lectureId = Number(route.params.lectureId);
    if (!lectureId) {
      throw new Error('강의 ID가 없습니다.');
    }

    // Lecture API 호출
    const lecture: Lecture = await lectureApiService.getLecture(lectureId);

    // 강의 타입 설정
    lectureType.value = lecture.type;
    
    if (lecture.type === 'MARKDOWN') {
      // 마크다운 강의
      markdownContent.value = lecture.description || '# 강의 내용이 없습니다.\n\n이 강의에는 아직 내용이 추가되지 않았습니다.';
    } else if (lecture.type === 'PROBLEM') {
      // 문제 강의
      problemData.value = adaptLectureToProblem(lecture);
    }

    // API 데이터를 lessonData에 매핑
    lessonData.value.title = lecture.title;
    lessonData.value.instructor = lecture.author?.username || '알 수 없음';
    
    // 강의 시간과 난이도는 하드코딩 유지
    lessonData.value.duration = '45분';

    console.log('강의 데이터 로드 완료:', lecture);

  } catch (err) {
    console.error('강의 데이터 로드 실패:', err);
    error.value = '강의 정보를 불러오는 중 오류가 발생했습니다.';
    
    // 에러 시 기본값 유지
    lessonData.value.title = 'Introduction To Algorithms - 1강: 정렬 알고리즘';
    lessonData.value.instructor = '김유희';
    lessonData.value.duration = '45분';
  } finally {
    loading.value = false;
  }
}

// 메서드
function goBack() {
  router.back();
}

// 다음 강의로 이동
function goToNextLesson() {
  if (nextLesson.value) {
    // 통합된 라우트로 이동
    router.push({ name: 'lecture', params: { lectureId: nextLesson.value.id } });
  }
}

function copyCode(codeText: string) {
  navigator.clipboard.writeText(codeText);
  // 간단한 알림 (실제로는 토스트 메시지 사용)
  alert('코드가 클립보드에 복사되었습니다!');
}

function openEditorPopout() {
  const lectureId = route.params.lectureId as string;
  const features = [
    'popup=yes',
    'width=1200',
    'height=800',
    'resizable=yes',
    'scrollbars=yes'
  ].join(',');
  const url = router.resolve({ name: 'editor-popout', params: { lectureId } }).href;
  window.open(url, '_blank', features);
}

async function runCode() {
  // Monaco Editor에서 현재 코드 가져오기
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: ''
    });

    executionResult.value = result;
    
  } catch (error: any) {
    console.error('코드 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 테스트케이스 실행 함수
async function runTestCase(testCase: {input: string, output: string}) {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: testCase.input
    });

    executionResult.value = result;
    
  } catch (error: any) {
    console.error('테스트케이스 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 사용자 임의 입력으로 실행
async function runCustomInput() {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: customInput.value || ''
    });

    executionResult.value = result;
    
  } catch (error: any) {
    console.error('사용자 입력 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 코드 제출 함수 (PROBLEM 타입용)
async function submitCode() {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    alert('제출할 코드가 없습니다.');
    return;
  }

  console.log('=== 제출 시작 ===');
  console.log('코드:', currentCode);
  console.log('언어 ID:', selectedLanguage.value);
  console.log('문제 ID:', Number(route.params.lectureId));

  isRunning.value = true;
  executionResult.value = {
    message: '채점을 제출하고 있습니다...'
  };

  try {
    const lectureId = Number(route.params.lectureId);
    
    const gradingRequest: GradingRequest = {
      source_code: currentCode,
      language_id: selectedLanguage.value,
      problem_id: lectureId
    };

    console.log('채점 요청:', gradingRequest);
    const result = await gradingAPI.submitForGrading(gradingRequest);
    console.log('채점 응답:', result);
    
    // 제출 성공 메시지 표시
    executionResult.value = {
      message: `제출 완료! 채점 토큰: ${result.token}\n결과 페이지로 이동합니다...`
    };
    
    // 즉시 결과 페이지로 이동
    const routeParams = {
      name: 'problem-result',
      params: { problemId: lectureId.toString() },
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
}

// API에서 지원하는 언어 목록을 가져오는 함수
async function fetchSupportedLanguages() {
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
}

// 언어 변경 핸들러 - 에디터 설정 재생성
const changeLanguage = (newLanguageId: number) => {
  selectedLanguage.value = newLanguageId;
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  editorConfig.value = languageApiService.createEditorConfig(newLanguageId, currentCode);
  console.log('언어 변경:', newLanguageId, '에디터 재생성됨');
};

// -----------------------------
// 레이아웃: 분할바 드래그 (좌/우)
// -----------------------------
const leftPaneWidth = ref(50); // %
let isDraggingLR = false;
const startDragLeftRight = (e: MouseEvent) => {
  isDraggingLR = true;
  window.addEventListener('mousemove', onDragLR);
  window.addEventListener('mouseup', stopDragLR);
};
const onDragLR = (e: MouseEvent) => {
  if (!isDraggingLR) return;
  const totalWidth = window.innerWidth;
  const newLeft = Math.max(20, Math.min(80, (e.clientX / totalWidth) * 100));
  leftPaneWidth.value = Math.round(newLeft);
};
const stopDragLR = () => {
  isDraggingLR = false;
  window.removeEventListener('mousemove', onDragLR);
  window.removeEventListener('mouseup', stopDragLR);
};

// -----------------------------
// 레이아웃: 에디터/터미널 수직 분할
// -----------------------------
const editorAreaHeight = ref(65); // %
let isDraggingET = false;
const startDragEditorTerminal = () => {
  isDraggingET = true;
  window.addEventListener('mousemove', onDragET);
  window.addEventListener('mouseup', stopDragET);
};
const onDragET = (e: MouseEvent) => {
  if (!isDraggingET) return;
  const usableHeight = window.innerHeight - 200; // 상단 헤더/여백 보정
  const rectTop = 150; // 대략적 헤더 높이 보정
  const y = e.clientY - rectTop;
  const next = Math.max(30, Math.min(85, (y / Math.max(usableHeight, 1)) * 100));
  editorAreaHeight.value = Math.round(next);
};
const stopDragET = () => {
  isDraggingET = false;
  window.removeEventListener('mousemove', onDragET);
  window.removeEventListener('mouseup', stopDragET);
};

// 초기화
onMounted(async () => {
  console.log('LectureView onMounted 시작');

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

  // 3. 강의 데이터 로드 (API에서)
  await loadLectureData();
  
  // 4. 에디터 렌더링 허용
  isEditorReady.value = true;
  console.log('에디터 렌더링 시작');

  // 5. 다음 강의 정보 설정 (실제로는 API에서 가져와야 함)
  const currentLectureId = parseInt(route.params.lectureId as string);
  nextLesson.value = {
    id: currentLectureId + 1,
    title: 'Introduction To Algorithms - 2강: 선택 정렬',
    format: '마크다운'
  };
});
</script>

