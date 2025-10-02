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

          <!-- 테스트 케이스 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">테스트 케이스</h3>
            <div class="space-y-4">
              <div v-for="(testCase, index) in problem.testCases" :key="index" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-medium text-gray-700">테스트케이스 {{ index + 1 }}</h4>
                  <button
                    :aria-label="`테스트케이스 ${index + 1} 실행`
                    "
                    class="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="runTestCase(index)"
                    :disabled="isRunning"
                    title="이 테스트케이스로 실행"
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
                  :disabled="isRunning || !code.trim()"
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
              class="px-3 py-1 border rounded text-sm"
            >
              <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
          </div>
            <div class="flex space-x-2">
              <button 
                @click="runCode"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                코드실행
              </button>
              <button 
                @click="submitCode"
                :disabled="isRunning"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isRunning ? '채점 중...' : '제출하기' }}
              </button>
            </div>
        </div>

        <!-- 코드 에디터 -->
        <div class="flex-1 p-4">
          <MonacoEditor
            v-model="code"
            :language="getMonacoLanguage(selectedLanguage)"
            theme="vs-dark"
            :options="editorOptions"
            class="w-full h-full border rounded-lg"
          />
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
            <div v-else-if="executionResult" class="whitespace-pre-wrap">{{ executionResult }}</div>
            <div v-else class="text-gray-500">실행 결과가 여기에 표시됩니다.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼들 -->
    <div class="bg-white border-t px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            질문하기
          </button>
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            초기화
          </button>
        </div>
        <button 
          @click="submitCode"
          :disabled="isRunning"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isRunning ? '채점 중...' : '제출하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import { languageApiService } from '../services/languageApi'

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
const code = ref('')
const executionResult = ref('')
const isRunning = ref(false)
const supportedLanguages = ref<Array<{id: number, name: string, version?: string, file_extension?: string}>>([]) // API에서 가져올 언어 목록
const customInput = ref('')

// 다음 강의 정보
const nextLesson = ref<{id: number, title: string, format: string} | null>(null)

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
  readOnly: false,
  cursorStyle: 'line'
};

// 언어별 코드 템플릿
const codeTemplates: Record<number, string> = {
  71: '# A + B 문제\n# 두 정수를 입력받아 더한 값을 출력\n\na, b = map(int, input().split())\nprint(a + b)',
  63: '// A + B 문제\n// JavaScript는 백엔드에서 지원하지 않을 수 있습니다\nconsole.log("JavaScript는 현재 지원되지 않습니다.");',
  62: '// A + B 문제\n// 두 정수를 입력받아 더한 값을 출력\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}',
  54: '// A + B 문제\n// 두 정수를 입력받아 더한 값을 출력\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}'
};

// 언어 변경 시 코드 템플릿 설정
const setCodeTemplate = (): void => {
  if (!code.value.trim()) {
    code.value = codeTemplates[selectedLanguage.value] || codeTemplates[71];
  }
};

// 코드 실행 (테스트용)
const runCode = async (): Promise<void> => {
  if (!code.value.trim()) {
    executionResult.value = '실행할 코드가 없습니다.';
    return;
  }

  isRunning.value = true;
  executionResult.value = '';

  try {
    const response = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code.value,
        language_id: selectedLanguage.value,
        stdin: '1 2\n5 7'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.status?.id === 3) {
      executionResult.value = result.stdout || '코드가 성공적으로 실행되었습니다.';
    } else if (result.status?.id === 6) {
      executionResult.value = `컴파일 오류:\n${result.compile_output || '컴파일 중 오류가 발생했습니다.'}`;
    } else if (result.status?.id === 7) {
      executionResult.value = `런타임 오류:\n${result.stderr || '실행 중 오류가 발생했습니다.'}`;
    } else {
      const statusMessage = result.status?.description || '알 수 없는 상태';
      executionResult.value = `실행 결과 (${statusMessage}):\n${result.stdout || result.stderr || result.message || '결과가 없습니다.'}`;
    }
    
  } catch (error: any) {
    executionResult.value = `실행 오류: ${error.message}`;
  } finally {
    isRunning.value = false;
  }
};

// 특정 테스트케이스 입력으로 실행
const runTestCase = async (index: number): Promise<void> => {
  const tc = problem.value.testCases[index]
  if (!tc) return

  if (!code.value.trim()) {
    executionResult.value = '실행할 코드가 없습니다.'
    return
  }

  isRunning.value = true
  executionResult.value = ''

  try {
    const response = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code.value,
        language_id: selectedLanguage.value,
        stdin: tc.input
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result.status?.id === 3) {
      executionResult.value = result.stdout || '코드가 성공적으로 실행되었습니다.'
    } else if (result.status?.id === 6) {
      executionResult.value = `컴파일 오류:\n${result.compile_output || '컴파일 중 오류가 발생했습니다.'}`
    } else if (result.status?.id === 7) {
      executionResult.value = `런타임 오류:\n${result.stderr || '실행 중 오류가 발생했습니다.'}`
    } else {
      const statusMessage = result.status?.description || '알 수 없는 상태'
      executionResult.value = `실행 결과 (${statusMessage}):\n${result.stdout || result.stderr || result.message || '결과가 없습니다.'}`
    }
  } catch (error: any) {
    executionResult.value = `실행 오류: ${error.message}`
  } finally {
    isRunning.value = false
  }
}

// 사용자 임의 입력으로 실행
const runCustomInput = async (): Promise<void> => {
  if (!code.value.trim()) {
    executionResult.value = '실행할 코드가 없습니다.'
    return
  }

  isRunning.value = true
  executionResult.value = ''

  try {
    const response = await fetch('http://localhost:2358/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code.value,
        language_id: selectedLanguage.value,
        stdin: customInput.value || ''
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result.status?.id === 3) {
      executionResult.value = result.stdout || '코드가 성공적으로 실행되었습니다.'
    } else if (result.status?.id === 6) {
      executionResult.value = `컴파일 오류:\n${result.compile_output || '컴파일 중 오류가 발생했습니다.'}`
    } else if (result.status?.id === 7) {
      executionResult.value = `런타임 오류:\n${result.stderr || '실행 중 오류가 발생했습니다.'}`
    } else {
      const statusMessage = result.status?.description || '알 수 없는 상태'
      executionResult.value = `실행 결과 (${statusMessage}):\n${result.stdout || result.stderr || result.message || '결과가 없습니다.'}`
    }
  } catch (error: any) {
    executionResult.value = `실행 오류: ${error.message}`
  } finally {
    isRunning.value = false
  }
}

// 코드 제출 (채점)
const submitCode = async (): Promise<void> => {
  if (!code.value.trim()) {
    alert('제출할 코드가 없습니다.');
    return;
  }

  isRunning.value = true;
  executionResult.value = '채점을 제출하고 있습니다...';

  try {
    const response = await fetch(`http://localhost:2358/grading/${problem.value.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: code.value,
        language_id: selectedLanguage.value
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.token) {
      router.push({
        name: 'problem-result',
        params: { problemId: problem.value.id.toString() },
        query: { token: result.token }
      });
    } else {
      throw new Error('채점 토큰을 받지 못했습니다.');
    }
    
  } catch (error: any) {
    executionResult.value = `채점 제출 오류: ${error.message}`;
    isRunning.value = false;
  }
};


// 네비게이션 함수들
const goBack = (): void => {
  router.back();
};

const goToNextLesson = (): void => {
  if (!nextLesson.value) return;
  
  const routeName = nextLesson.value.format === '문제' ? 'problem' : 'learning';
  const params = nextLesson.value.format === '문제' 
    ? { problemId: nextLesson.value.id }
    : { lessonId: nextLesson.value.id };
  
  router.push({ name: routeName, params });
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

// Judge0 언어 ID를 Monaco Editor 언어로 변환하는 함수
const getMonacoLanguage = (languageId: number): string => {
  return languageApiService.getMonacoLanguage(languageId);
};

// 컴포넌트 초기화
onMounted(async () => {
  setCodeTemplate();
  await fetchSupportedLanguages();
  
  const currentProblemId = parseInt(route.params.problemId as string);
  nextLesson.value = {
    id: 4,
    title: 'A - B 문제',
    format: '문제'
  };
});
</script>
