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
            <h1 class="text-lg font-semibold">문제 생성</h1>
            <p class="text-sm text-gray-600">프로그래밍 문제를 생성하세요</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="previewProblem"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            미리보기
          </button>
          <button 
            @click="saveDraft"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            임시저장
          </button>
          <button 
            @click="publishProblem"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {{ isEditMode ? '수정 완료' : '문제 발행' }}
          </button>
          <button 
            v-if="isEditMode"
            @click="deleteProblem"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex">
      <!-- 사이드바 -->
      <div class="w-64 bg-white border-r border-gray-200 p-4">
        <nav class="space-y-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg transition-colors',
              activeTab === tab.id 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- 콘텐츠 영역 -->
      <div class="flex-1 p-6">
        <!-- 기본 정보 탭 -->
        <div v-if="activeTab === 'basic'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">기본 정보</h2>
          
          <div class="space-y-6">
            <!-- 문제 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 제목 *</label>
              <input 
                v-model="problemData.title"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="문제 제목을 입력하세요"
              />
            </div>

            <!-- 문제 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
              <textarea 
                v-model="problemData.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="문제에 대한 간단한 설명을 입력하세요"
              ></textarea>
            </div>

            <!-- 카테고리 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <select 
                v-model="problemData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="알고리즘">알고리즘</option>
                <option value="자료구조">자료구조</option>
                <option value="수학">수학</option>
                <option value="구현">구현</option>
                <option value="그래프">그래프</option>
                <option value="동적계획법">동적계획법</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <!-- 난이도 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">난이도 *</label>
              <select 
                v-model="problemData.difficulty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">난이도를 선택하세요</option>
                <option value="브론즈">브론즈</option>
                <option value="실버">실버</option>
                <option value="골드">골드</option>
                <option value="플래티넘">플래티넘</option>
                <option value="다이아몬드">다이아몬드</option>
              </select>
            </div>

            <!-- 시간 제한 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">시간 제한 (초) *</label>
              <input 
                v-model.number="problemData.timeLimit"
                type="number" 
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <!-- 메모리 제한 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">메모리 제한 (MB) *</label>
              <input 
                v-model.number="problemData.memoryLimit"
                type="number" 
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="256"
              />
            </div>
          </div>
        </div>

        <!-- 문제 내용 탭 -->
        <div v-if="activeTab === 'content'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">문제 내용</h2>
          
          <div class="space-y-6">
            <!-- 문제 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.problemDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="300"
                  placeholder="문제를 자세히 설명해주세요..."
                />
              </div>
            </div>

            <!-- 입력 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">입력 설명</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.inputDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="200"
                  placeholder="입력 형식을 설명해주세요..."
                />
              </div>
            </div>

            <!-- 출력 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">출력 설명</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.outputDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="200"
                  placeholder="출력 형식을 설명해주세요..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 테스트 케이스 탭 -->
        <div v-if="activeTab === 'testcases'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">테스트 케이스</h2>
          
          <div class="space-y-4">
            <div 
              v-for="(testCase, index) in problemData.testCases" 
              :key="index"
              class="border border-gray-300 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-medium">테스트 케이스 {{ index + 1 }}</h3>
                <button 
                  @click="removeTestCase(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">입력</label>
                  <textarea 
                    v-model="testCase.input"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="테스트 입력 데이터"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">출력</label>
                  <textarea 
                    v-model="testCase.output"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="예상 출력 데이터"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <button 
              @click="addTestCase"
              class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              + 테스트 케이스 추가
            </button>
          </div>
        </div>

        <!-- 설정 탭 -->
        <div v-if="activeTab === 'settings'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">문제 설정</h2>
          
          <div class="space-y-6">
            <!-- 공개 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="problemData.isPublic" 
                    type="radio" 
                    :value="true" 
                    class="mr-2"
                  />
                  공개 (모든 사용자가 볼 수 있음)
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="problemData.isPublic" 
                    type="radio" 
                    :value="false" 
                    class="mr-2"
                  />
                  비공개 (링크를 아는 사용자만 볼 수 있음)
                </label>
              </div>
            </div>

            <!-- 지원 언어 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">지원 언어 *</label>
              <select 
                v-model="problemData.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option :value="null">언어를 선택하세요</option>
                <option 
                  v-for="language in availableLanguages" 
                  :key="language.id"
                  :value="language.id"
                >
                  {{ language.name }}
                </option>
              </select>
            </div>

            <!-- 에디터 테마 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">에디터 테마</label>
              <select 
                v-model="editorTheme"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="light">라이트</option>
                <option value="dark">다크</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MdEditor, type Themes, type ToolbarNames } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'
import { lectureApiService } from '@/services/lectureApi'
import { LectureType } from '@/types/lecture'

const router = useRouter()
const route = useRoute()

// 편집 모드 확인
const isEditMode = computed(() => route.query.mode === 'edit')

// 탭 관리
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'content', label: '문제 내용' },
  { id: 'testcases', label: '테스트 케이스' },
  { id: 'settings', label: '설정' }
]

const activeTab = ref('basic')

// 문제 데이터
const problemData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  timeLimit: 1,
  memoryLimit: 256,
  problemDescription: `## 문제

두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)

## 출력

첫째 줄에 A+B를 출력한다.

## 예제 입력 1
\`\`\`
1 1
\`\`\`

## 예제 출력 1
\`\`\`
2
\`\`\``,
  inputDescription: '첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)',
  outputDescription: '첫째 줄에 A+B를 출력한다.',
  testCases: [
    {
      input: '1 1',
      output: '2'
    },
    {
      input: '2 3',
      output: '5'
    }
  ],
  isPublic: true,
  language: null as number | null
})

// 에디터 설정
const editorTheme = ref<Themes>('light')

// 백엔드에서 제공된 언어 데이터
const availableLanguages = [
  { id: 45, name: "Assembly (NASM 2.14.02)" },
  { id: 46, name: "Bash (5.0.0)" },
  { id: 47, name: "Basic (FBC 1.07.1)" },
  { id: 75, name: "C (Clang 7.0.1)" },
  { id: 48, name: "C (GCC 7.4.0)" },
  { id: 49, name: "C (GCC 8.3.0)" },
  { id: 50, name: "C (GCC 9.2.0)" },
  { id: 51, name: "C# (Mono 6.6.0.161)" },
  { id: 76, name: "C++ (Clang 7.0.1)" },
  { id: 52, name: "C++ (GCC 7.4.0)" },
  { id: 53, name: "C++ (GCC 8.3.0)" },
  { id: 54, name: "C++ (GCC 9.2.0)" },
  { id: 77, name: "COBOL (GnuCOBOL 2.2)" },
  { id: 86, name: "Clojure (1.10.1)" },
  { id: 55, name: "Common Lisp (SBCL 2.0.0)" },
  { id: 56, name: "D (DMD 2.089.1)" },
  { id: 57, name: "Elixir (1.9.4)" },
  { id: 58, name: "Erlang (OTP 22.2)" },
  { id: 44, name: "Executable" },
  { id: 87, name: "F# (.NET Core SDK 3.1.202)" },
  { id: 59, name: "Fortran (GFortran 9.2.0)" },
  { id: 60, name: "Go (1.13.5)" },
  { id: 88, name: "Groovy (3.0.3)" },
  { id: 61, name: "Haskell (GHC 8.8.1)" },
  { id: 62, name: "Java (OpenJDK 13.0.1)" },
  { id: 63, name: "JavaScript (Node.js 12.14.0)" },
  { id: 78, name: "Kotlin (1.3.70)" },
  { id: 64, name: "Lua (5.3.5)" },
  { id: 89, name: "Multi-file program" },
  { id: 65, name: "OCaml (4.09.0)" },
  { id: 79, name: "Objective-C (Clang 7.0.1)" },
  { id: 66, name: "Octave (5.1.0)" },
  { id: 68, name: "PHP (7.4.1)" },
  { id: 67, name: "Pascal (FPC 3.0.4)" },
  { id: 85, name: "Perl (5.28.1)" },
  { id: 43, name: "Plain Text" },
  { id: 69, name: "Prolog (GNU Prolog 1.4.5)" },
  { id: 70, name: "Python (2.7.17)" },
  { id: 71, name: "Python (3.8.1)" },
  { id: 80, name: "R (4.0.0)" },
  { id: 72, name: "Ruby (2.7.0)" },
  { id: 73, name: "Rust (1.40.0)" },
  { id: 82, name: "SQL (SQLite 3.27.2)" },
  { id: 81, name: "Scala (2.13.2)" },
  { id: 83, name: "Swift (5.2.3)" },
  { id: 74, name: "TypeScript (3.7.4)" },
  { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)" }
]

// 툴바 설정
const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', 'strikeThrough',
  'quote', 'unorderedList', 'orderedList', 'task',
  'codeRow', 'code', 'link', 'table'
]

// 테스트 케이스 관리
function addTestCase() {
  problemData.testCases.push({ input: '', output: '' })
}

function removeTestCase(index: number) {
  problemData.testCases.splice(index, 1)
}

// 액션 함수들
function goBack() {
  router.back()
}

function previewProblem() {
  // 미리보기 기능 구현 - 학습자 화면으로 이동
  console.log('문제 강의 미리보기:', problemData)
  
  // 임시 문제 ID 생성 (실제로는 백엔드에서 생성)
  const tempProblemId = Date.now()
  
  // 문제 데이터를 localStorage에 임시 저장 (미리보기용)
  const previewData = {
    id: tempProblemId,
    title: problemData.title || '미리보기 문제',
    description: problemData.problemDescription || '문제 설명을 작성해주세요.',
    inputDescription: problemData.inputDescription || '입력 설명을 작성해주세요.',
    outputDescription: problemData.outputDescription || '출력 설명을 작성해주세요.',
    testCases: problemData.testCases || [],
    language: problemData.language || 71, // Python 3.8.1 기본값
    format: '문제',
    isPreview: true
  }
  
  localStorage.setItem('previewProblem', JSON.stringify(previewData))
  
  // 학습자 화면으로 이동
  router.push({ 
    name: 'problem', 
    params: { problemId: tempProblemId },
    query: { preview: 'true' }
  })
}

function saveDraft() {
  // 임시저장 기능 구현
  console.log('임시저장:', problemData)
  alert('임시저장되었습니다.')
}

async function publishProblem() {
  if (!problemData.title.trim()) {
    alert('문제 제목을 입력해주세요.')
    return
  }

  if (!problemData.problemDescription.trim()) {
    alert('문제 설명을 입력해주세요.')
    return
  }

  try {
    const lectureData = {
      title: problemData.title,
      description: problemData.problemDescription,
      type: LectureType.PROBLEM,
      category: problemData.category || '알고리즘',
      difficulty: problemData.difficulty || '쉬움',
      timeLimit: problemData.timeLimit || 1,
      memoryLimit: problemData.memoryLimit || 128,
      testCases: problemData.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.output
      })),
      isPublic: problemData.isPublic
    }

    if (isEditMode.value) {
      const lectureId = Number(route.query.edit)
      await lectureApiService.updateLecture(lectureId, lectureData)
      alert('문제가 수정되었습니다!')
    } else {
      const createdLecture = await lectureApiService.createLecture(lectureData)
      console.log('문제 생성 완료:', createdLecture)
      alert('문제가 발행되었습니다.')
    }

    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('문제 발행 실패:', error)
    alert('문제 발행 중 오류가 발생했습니다.')
  }
}

// 문제 삭제하기 (편집 모드에서만)
async function deleteProblem() {
  if (!confirm('정말로 이 문제를 삭제하시겠습니까?\n삭제된 문제는 복구할 수 없습니다.')) {
    return
  }

  try {
    const lectureId = Number(route.query.edit)
    await lectureApiService.deleteLecture(lectureId)
    alert('문제가 삭제되었습니다.')
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('문제 삭제 실패:', error)
    alert('문제 삭제 중 오류가 발생했습니다.')
  }
}
</script>
