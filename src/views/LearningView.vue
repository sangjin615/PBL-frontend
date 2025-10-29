<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 -->
    <div class="bg-figma-1 border-b px-6 py-4" style="border-color: rgb(var(--figma-color-4))">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div class="flex items-center space-x-4">
            <div>
              <h1 class="text-xl font-bold" style="color: rgb(var(--figma-color-2))">
                {{ lessonData.title }}
              </h1>
              <p class="text-sm text-gray-600">{{ lessonData.instructor }} • {{ lessonData.duration }}</p>
            </div>
            <!-- 신고 버튼 -->
            <ReportButton
              report-type="lecture"
              :target-id="lessonData.id || 1"
              :target-title="lessonData.title"
              @reported="handleReported"
            />
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
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex h-screen select-none">
      <!-- 왼쪽: 교과서 영역 -->
      <div class="border-r overflow-y-auto" :style="{ width: leftPaneWidth + '%', borderColor: `rgb(var(--figma-color-4))` }">
        <div class="p-6">
          <!-- 챕터 네비게이션 -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">
              {{ currentChapter.title }}
            </h2>
            <div class="flex space-x-2">
              <button 
                v-for="chapter in lessonData.chapters" 
                :key="chapter.id"
                @click="currentChapter = chapter"
                class="px-3 py-1 text-sm rounded-lg transition-colors"
                :class="currentChapter.id === chapter.id 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ chapter.title }}
              </button>
            </div>
          </div>

          <!-- 교과서 내용 -->
          <div class="space-y-6">
            <div 
              v-for="section in currentChapter.sections" 
              :key="section.id"
              class="bg-figma-1 rounded-lg border p-6" 
              style="border-color: rgb(var(--figma-color-4))"
            >
              <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">
                {{ section.title }}
              </h3>
              
              <div class="prose max-w-none">
                <p class="text-gray-700 mb-4 leading-relaxed">{{ section.content }}</p>
                
                <!-- 코드 예제 -->
                <div v-if="section.codeExample" class="bg-gray-900 rounded-lg p-4 mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-400">{{ section.codeExample.language }}</span>
                    <button 
                      @click="copyCode(section.codeExample.code)"
                      class="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                  <pre class="text-green-400 text-sm overflow-x-auto"><code>{{ section.codeExample.code }}</code></pre>
                </div>

                <!-- 설명 -->
                <div v-if="section.explanation" class="bg-blue-50 rounded-lg p-4">
                  <h4 class="font-semibold text-blue-900 mb-2">💡 설명</h4>
                  <p class="text-blue-800 text-sm">{{ section.explanation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 세로 분리선 -->
      <div class="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize" @mousedown="startDragLeftRight"></div>

      <!-- 오른쪽: 코드 에디터 영역 -->
      <div class="flex flex-col" :style="{ width: (100 - leftPaneWidth) + '%' }">
        <!-- 코드 에디터 헤더 -->
        <div class="bg-figma-1 border-b px-4 py-3 flex items-center justify-between" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-center space-x-4">
            <h3 class="font-semibold" style="color: rgb(var(--figma-color-2))">코드 에디터</h3>
            <select
              v-model="selectedLanguage"
              @change="changeLanguage(selectedLanguage)"
              class="px-3 py-1 border rounded text-sm"
              style="border-color: rgb(var(--figma-color-4))"
            >
              <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="runCode"
              :disabled="isRunning"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="isRunning" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ isRunning ? '실행 중...' : '실행' }}</span>
            </button>
            <button
              @click="openEditorPopout"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title="새 창으로 에디터 열기"
            >
              팝아웃
            </button>
          </div>
        </div>

        <!-- 코드 에디터 / 실행 결과 - 수직 분할 컨테이너 -->
        <div class="flex-1 p-4 flex flex-col">
          <div class="border rounded-lg overflow-hidden" style="border-color: rgb(var(--figma-color-4));" :style="{ height: editorAreaHeight + '%' }">
            <MonacoEditor
              ref="monacoEditorRef"
              :key="editorConfig.languageId"
              :config="editorConfig"
              class="w-full h-full"
            />
          </div>
          <!-- 가로 분리선 -->
          <div class="h-1 bg-gray-300 hover:bg-gray-400 cursor-row-resize" @mousedown="startDragEditorTerminal"></div>
          <div class="border bg-gray-50 flex-1 flex flex-col" style="border-color: rgb(var(--figma-color-4));" :style="{ height: (100 - editorAreaHeight) + '%' }">
            <div class="px-4 py-2 border-b" style="border-color: rgb(var(--figma-color-4))">
              <h4 class="font-semibold text-sm" style="color: rgb(var(--figma-color-2))">실행 결과</h4>
            </div>
            <div class="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
            <div v-if="isRunning" class="flex items-center space-x-2">
              <div class="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
              <span>실행 중...</span>
            </div>
            <div v-else-if="executionResult" class="whitespace-pre-wrap">
              {{ executionResult.message || executionResult.stdout || '실행 결과가 없습니다.' }}
            </div>
            <div v-else class="text-gray-500">실행 결과가 여기에 표시됩니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MonacoEditor from '../components/editor/MonacoEditor.vue';
import { Button, LoadingSpinner, ErrorMessage, ReportButton } from '@/components/common';
import { languageApiService } from '../services/languageApi';
import { submissionAPI, type SubmissionResult } from '../services/submissionAPI';
import type { MonacoEditorConfig } from '../services/extendedClient';

const route = useRoute();
const router = useRouter();

// 반응형 데이터
const progress = ref(25);
const isRunning = ref(false);
const executionResult = ref<SubmissionResult | null>(null);
const monacoEditorRef = ref<any>(null);
const selectedLanguage = ref(71); // Python 3의 ID를 기본값으로
const supportedLanguages = ref<Array<{id: number, name: string, version?: string, file_extension?: string}>>([]); // API에서 가져올 언어 목록
const currentChapter = ref<{id: number, title: string, sections: Array<{id: number, title: string, content: string, codeExample?: {language: string, code: string}, explanation?: string}>}>({} as any);

// 강의 데이터 (하드코딩) - 실제 사용되는 데이터
const lessonData = ref({
  id: 1,
  title: '알고리즘이란?',
  instructor: '김유희',
  duration: '30분'
});

// Monaco Editor 통합 설정
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(71, '')
)

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

// 메서드
function goBack() {
  router.back();
}

// 다음 강의로 이동
function goToNextLesson() {
  if (nextLesson.value) {
    router.push({ name: 'lecture', params: { lectureId: nextLesson.value.id } });
  }
}

// 신고 완료 처리
function handleReported() {
  console.log('강의 신고가 접수되었습니다.');
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

// 신고 완료 핸들러
function handleReported() {
  window.alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
}

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
  currentChapter.value = lessonData.value.chapters[0];
  
  // API에서 지원하는 언어 목록 가져오기
  await fetchSupportedLanguages();
  
  // 다음 강의 정보 설정 (실제로는 API에서 가져와야 함)
  const currentLectureId = parseInt(route.params.lectureId as string);
  nextLesson.value = {
    id: currentLectureId + 1,
    title: 'Introduction To Algorithms - 2강: 선택 정렬',
    format: '마크다운'
  };
  
  // 기본 코드는 Monaco Editor에서 언어별로 자동 설정됨
});
</script>

