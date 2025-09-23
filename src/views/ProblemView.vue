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
        <div class="flex items-center space-x-2">
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
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-700 mb-2">입력{{ index + 1 }}</h4>
                    <pre class="text-sm bg-white p-2 rounded border">{{ testCase.input }}</pre>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-700 mb-2">출력{{ index + 1 }}</h4>
                    <pre class="text-sm bg-white p-2 rounded border">{{ testCase.output }}</pre>
                  </div>
                </div>
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
            <span class="font-medium">{{ selectedLanguage }}</span>
            <select v-model="selectedLanguage" class="text-sm border rounded px-2 py-1">
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <button 
            @click="runCode"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            코드실행
          </button>
        </div>

        <!-- 코드 에디터 -->
        <div class="flex-1 p-4">
          <MonacoEditor
            v-model="code"
            :language="selectedLanguage"
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
          <div class="h-48">
            <Terminal
              :output="executionResult"
              :is-running="isRunning"
              :language="selectedLanguage"
              ref="terminalRef"
            />
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
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          제출하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import Terminal from '../components/terminal/Terminal.vue'

const route = useRoute()
const router = useRouter()

// 문제 데이터
const problem = ref({
  id: 1,
  title: '9999번문제 - A + B',
  timeLimit: '1초',
  memoryLimit: '256MB',
  successRate: '34.348%',
  description: '두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.',
  inputDescription: '입력은 여러 개의 테스트 케이스로 이루어져 있다. 각 테스트 케이스는 한 줄로 이루어져 있으며, 각 줄에 A와 B가 주어진다. (0<A, B<10)',
  outputDescription: '각 테스트 케이스마다 A+B를 출력한다.',
  testCases: [
    {
      input: '1 1\n2 3\n3 4\n9 8\n5 2',
      output: '2\n5\n7\n17\n7'
    }
  ]
})

// 코드 에디터 관련
const selectedLanguage = ref('python')
const code = ref('')
const executionResult = ref('')
const isRunning = ref(false)
const terminalRef = ref()

// Monaco Editor 옵션
const editorOptions = ref({
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
  cursorStyle: 'line',
  automaticLayout: true,
})

// 언어별 코드 템플릿
const codeTemplates = {
  python: '# Python 코드를 작성하세요\na, b = map(int, input().split())\nprint(a + b)',
  javascript: '// JavaScript 코드를 작성하세요\nconst readline = require("readline");\n// 코드 작성',
  java: '// Java 코드를 작성하세요\nimport java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        // 코드 작성\n    }\n}',
  cpp: '// C++ 코드를 작성하세요\n#include <iostream>\nusing namespace std;\nint main() {\n    // 코드 작성\n    return 0;\n}'
}

// 언어 변경 시 코드 템플릿 설정
function setCodeTemplate() {
  if (!code.value.trim()) {
    code.value = codeTemplates[selectedLanguage.value as keyof typeof codeTemplates]
  }
}

// 코드 실행
async function runCode() {
  if (!code.value.trim()) {
    if (terminalRef.value) {
      terminalRef.value.showError('실행할 코드가 없습니다.');
    }
    return;
  }

  isRunning.value = true;
  executionResult.value = '';

  try {
    // 실제 환경에서는 백엔드 API를 호출해야 함
    // 여기서는 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 문제에 맞는 실행 결과 시뮬레이션
    if (selectedLanguage.value === 'python') {
      if (code.value.includes('a + b') || code.value.includes('a+b')) {
        executionResult.value = '2\n5\n7\n17\n7';
      } else {
        executionResult.value = '실행 결과가 여기에 표시됩니다.\n코드 실행 기능은 백엔드와 연동이 필요합니다.';
      }
    } else if (selectedLanguage.value === 'javascript') {
      executionResult.value = '2\n5\n7\n17\n7';
    } else if (selectedLanguage.value === 'java') {
      executionResult.value = '2\n5\n7\n17\n7';
    } else if (selectedLanguage.value === 'cpp') {
      executionResult.value = '2\n5\n7\n17\n7';
    } else {
      executionResult.value = '실행 결과가 여기에 표시됩니다.\n코드 실행 기능은 백엔드와 연동이 필요합니다.';
    }
  } catch (error) {
    executionResult.value = `실행 오류: ${error}`;
  } finally {
    isRunning.value = false;
  }
}

// 코드 제출
function submitCode() {
  // 실제로는 백엔드 API를 호출해서 채점 결과를 받아와야 함
  // 현재는 더미 데이터로 채점 결과 페이지로 이동
  const problemId = route.params.problemId
  router.push({ name: 'problem-result', params: { problemId } })
}

// 뒤로가기
function goBack() {
  router.back()
}

// 컴포넌트 마운트 시 코드 템플릿 설정
onMounted(() => {
  setCodeTemplate()
})
</script>
