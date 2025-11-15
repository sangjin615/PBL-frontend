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
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명</label>
              <textarea
                v-model="problemData.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="API 연결없음 (선택사항)"
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
                <option v-for="category in LECTURE_CATEGORIES" :key="category" :value="category">
                  {{ category }}
                </option>
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
                <option v-for="level in PROBLEM_DIFFICULTY_LEVELS" :key="level" :value="level">
                  {{ level }}
                </option>
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

            <!-- 썸네일 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지</label>

              <!-- 썸네일 미리보기 -->
              <div v-if="thumbnailPreview" class="mb-3 relative inline-block">
                <img :src="thumbnailPreview" alt="썸네일 미리보기" class="w-48 h-32 object-cover rounded-lg border border-gray-300" />
                <button
                  @click="removeThumbnail"
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>

              <!-- 업로드 영역 -->
              <div
                v-show="!thumbnailPreview"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleThumbnailDrop"
                @click="thumbnailInput?.click()"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400',
                  isUploadingThumbnail ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">
                  {{ isUploadingThumbnail ? '업로드 중...' : '이미지를 드래그하거나 클릭하여 업로드' }}
                </p>
                <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF (최대 5MB)</p>
                <input
                  ref="thumbnailInput"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  @change="handleThumbnailSelect"
                  :disabled="isUploadingThumbnail"
                />
              </div>
            </div>

            <!-- 예상 소요시간 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">예상 소요시간 (분)</label>
              <input
                v-model.number="problemData.durationMinutes"
                type="number"
                min="1"
                step="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="예: 15"
              />
              <p class="mt-1 text-sm text-gray-500">문제를 푸는데 걸리는 예상 시간 (분 단위)</p>
            </div>

            <!-- 공개 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="flex items-center">
                <button
                  @click="problemData.isPublic = !problemData.isPublic"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                    problemData.isPublic ? 'bg-green-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      problemData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <span class="ml-3 text-sm text-gray-600">
                  {{ problemData.isPublic ? '공개 (모든 사용자가 볼 수 있음)' : '비공개 (링크를 아는 사용자만 볼 수 있음)' }}
                </span>
              </div>
            </div>

            <!-- 태그 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">태그</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, index) in problemData.tags"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {{ tag }}
                  <button
                    @click="removeTag(index)"
                    class="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              </div>
              <div class="flex space-x-2">
                <input
                  v-model="newTag"
                  type="text"
                  placeholder="태그 입력"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  @keyup.enter="addTag"
                />
                <button
                  @click="addTag"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  추가
                </button>
              </div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { MdEditor, type Themes, type ToolbarNames } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'
import { lectureApiService } from '@/services/lectureApi'
import { languageApiService } from '@/services/languageApi'
import { s3ApiService, S3ApiService } from '@/services/s3Api'
import { LectureType } from '@/types/lecture'
import type { Language } from '@/types/language'
import { LECTURE_CATEGORIES, PROBLEM_DIFFICULTY_LEVELS } from '@/constants'

const router = useRouter()
const route = useRoute()

// 미저장 변경사항 추적
const hasUnsavedChanges = ref(false)
const initialDataSnapshot = ref<string>('')

// 편집 모드 확인
const isEditMode = computed(() => !!route.query.edit)
const editLectureId = computed(() => route.query.edit ? Number(route.query.edit) : null)

// 원본 공개 상태 저장 (수정 시 변경사항 감지용)
const originalIsPublic = ref<boolean>(true)

// 탭 관리
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'content', label: '문제 내용' },
  { id: 'testcases', label: '테스트 케이스' }
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
  tags: [] as string[],
  language: null as number | null,
  thumbnailUrl: null as string | null,
  durationMinutes: 15
})

// 썸네일 관련
const thumbnailPreview = ref<string | null>(null)
const isUploadingThumbnail = ref(false)
const isDragging = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// 에디터 설정
const editorTheme = ref<Themes>('light')
const newTag = ref('')

// 툴바 설정
const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', 'strikeThrough',
  'quote', 'unorderedList', 'orderedList', 'task',
  'codeRow', 'code', 'link', 'table'
]

// 태그 관리
function addTag() {
  if (newTag.value.trim() && !problemData.tags.includes(newTag.value.trim())) {
    problemData.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(index: number) {
  problemData.tags.splice(index, 1)
}

// 썸네일 업로드
async function uploadThumbnail(file: File) {
  // 파일 유효성 검사
  const validation = S3ApiService.validateImageFile(file)
  if (!validation.isValid) {
    alert(validation.error)
    return
  }

  isUploadingThumbnail.value = true
  try {
    // S3에 업로드
    const response = await s3ApiService.uploadImage(file, 'thumbnails')
    problemData.thumbnailUrl = response.imageUrl  // 경로만 저장 (예: "thumbnails/filename.png")
    thumbnailPreview.value = S3ApiService.getImageUrl(response.imageUrl)  // 미리보기용 전체 URL
    console.log('썸네일 업로드 완료:', response.imageUrl)
  } catch (error) {
    console.error('썸네일 업로드 실패:', error)
    alert('썸네일 업로드 중 오류가 발생했습니다.')
  } finally {
    isUploadingThumbnail.value = false
    isDragging.value = false
  }
}

// 파일 선택
function handleThumbnailSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    uploadThumbnail(file)
  }
}

// 드래그 앤 드롭
function handleThumbnailDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    uploadThumbnail(file)
  }
}

// 썸네일 제거
function removeThumbnail() {
  thumbnailPreview.value = null
  problemData.thumbnailUrl = null
}

// 테스트 케이스 관리
function addTestCase() {
  problemData.testCases.push({ input: '', output: '' })
}

function removeTestCase(index: number) {
  problemData.testCases.splice(index, 1)
}

// 문제 데이터 로드
async function loadLectureData() {
  if (!editLectureId.value) return

  try {
    const lecture = await lectureApiService.getLecture(editLectureId.value)
    console.log('문제 데이터 로드:', lecture)

    // 기본 정보
    problemData.title = lecture.title || ''
    problemData.description = '' // API 연결 없음
    problemData.category = lecture.category || ''
    problemData.difficulty = lecture.difficulty || ''
    problemData.timeLimit = lecture.constraints?.cpu_time_limit || 1
    problemData.memoryLimit = lecture.constraints?.memory_limit ? Math.round(lecture.constraints.memory_limit / 1000) : 256
    problemData.isPublic = lecture.isPublic ?? true
    problemData.tags = lecture.tags || []
    problemData.language = lecture.languageId || null
    problemData.thumbnailUrl = lecture.thumbnailImageUrl || null
    problemData.durationMinutes = lecture.durationMinutes || 15

    // 원본 공개 상태 저장 (변경사항 감지용)
    originalIsPublic.value = lecture.isPublic ?? true

    // 문제 내용 - 백엔드 필드에서 로드 (백엔드는 snake_case 사용)
    problemData.description = lecture.description || ''  // 간략 설명
    problemData.problemDescription = lecture.content || ''  // 문제 전체 설명
    problemData.inputDescription = lecture.input_content || ''  // 입력 형식
    problemData.outputDescription = lecture.output_content || ''  // 출력 형식

    // 테스트 케이스
    if (lecture.testCases && lecture.testCases.length > 0) {
      problemData.testCases = lecture.testCases.map((tc: any) => ({
        input: tc.input || '',
        output: tc.expectedOutput || tc.output || ''
      }))
    }

    // 썸네일 미리보기
    if (lecture.thumbnailImageUrl) {
      thumbnailPreview.value = S3ApiService.getImageUrl(lecture.thumbnailImageUrl)
    }

    console.log('문제 데이터 로드 완료')
  } catch (error) {
    console.error('문제 데이터 로드 실패:', error)
    alert('문제 데이터를 불러오는데 실패했습니다.')
  }
}

// 초기화
onMounted(async () => {
  // 편집 모드인 경우 문제 데이터 로드
  if (isEditMode.value) {
    await loadLectureData()
  }

  // 초기 데이터 스냅샷 저장 (약간의 지연 후 - 초기 렌더링 완료 대기)
  setTimeout(() => {
    initialDataSnapshot.value = getCurrentDataSnapshot()
  }, 500)

  // 브라우저 새로고침/닫기 경고
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 데이터 변경 감지
watch(
  [problemData, editorTheme],
  () => {
    const currentSnapshot = getCurrentDataSnapshot()
    hasUnsavedChanges.value = currentSnapshot !== initialDataSnapshot.value
  },
  { deep: true }
)

// 현재 데이터 스냅샷 생성
function getCurrentDataSnapshot(): string {
  return JSON.stringify({
    problemData: problemData,
    editorTheme: editorTheme.value
  })
}

// 브라우저 새로고침/닫기 경고
function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (hasUnsavedChanges.value) {
    event.preventDefault()
    event.returnValue = ''
    return ''
  }
}

// Vue Router 네비게이션 가드
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      '저장하지 않은 내용이 있습니다.\n페이지를 나가시겠습니까?'
    )
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// 액션 함수들
function goBack() {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      '저장하지 않은 내용이 있습니다.\n페이지를 나가시겠습니까?'
    )
    if (answer) {
      router.back()
    }
  } else {
    router.back()
  }
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

  // 임시저장 후 변경사항 플래그 초기화
  hasUnsavedChanges.value = false
  initialDataSnapshot.value = getCurrentDataSnapshot()
}

async function publishProblem() {
  console.log('발행 시도 - problemData:', problemData)

  if (!problemData.title || !problemData.title.trim()) {
    alert('문제 제목을 입력해주세요.')
    activeTab.value = 'basic'
    return
  }

  if (!problemData.problemDescription || !problemData.problemDescription.trim()) {
    alert('문제 설명을 입력해주세요.')
    activeTab.value = 'content'
    return
  }

  if (!problemData.testCases || problemData.testCases.length === 0) {
    alert('최소 1개의 테스트 케이스가 필요합니다.')
    activeTab.value = 'testcases'
    return
  }

  try {
    const lectureData = {
      title: problemData.title,
      description: problemData.description || problemData.title, // 간략 설명 (없으면 제목 사용)
      content: problemData.problemDescription, // 문제 전체 설명
      input_content: problemData.inputDescription, // 입력 형식 (백엔드는 snake_case)
      output_content: problemData.outputDescription, // 출력 형식 (백엔드는 snake_case)
      type: LectureType.PROBLEM,
      category: problemData.category || '알고리즘',
      difficulty: problemData.difficulty || '쉬움',
      constraints: {
        cpu_time_limit: problemData.timeLimit || 1,  // 초 단위
        memory_limit: (problemData.memoryLimit || 128) * 1000 // MB를 KB로 변환
      },
      testCases: problemData.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.output
      })),
      isPublic: problemData.isPublic,
      languageId: problemData.language,
      tags: problemData.tags || [],
      thumbnailImageUrl: problemData.thumbnailUrl || '',
      durationMinutes: problemData.durationMinutes || 15
    }

    if (isEditMode.value && editLectureId.value) {
      await lectureApiService.updateLecture(editLectureId.value, lectureData)

      // 현재 isPublic 상태에 따라 공개/비공개 API 호출 (임시 조치 - 백엔드 수정 필요)
      try {
        if (lectureData.isPublic) {
          await lectureApiService.publishLecture(editLectureId.value)
          console.log('문제 공개 전환 완료')
        } else {
          await lectureApiService.unpublishLecture(editLectureId.value)
          console.log('문제 비공개 전환 완료')
        }
      } catch (error) {
        console.error('공개/비공개 전환 실패:', error)
      }

      alert('문제가 수정되었습니다!')
    } else {
      const createdLecture = await lectureApiService.createLecture(lectureData)
      console.log('문제 생성 완료:', createdLecture)

      // isPublic이 true인 경우 공개 전환 API 호출 (임시 조치 - 백엔드 수정 필요)
      if (lectureData.isPublic) {
        try {
          await lectureApiService.publishLecture(createdLecture.id)
          console.log('문제 공개 전환 완료')
        } catch (error) {
          console.error('공개 전환 실패:', error)
        }
      }

      alert('문제가 발행되었습니다.')
    }

    // 발행 성공 시 변경사항 플래그 초기화
    hasUnsavedChanges.value = false

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

  if (!editLectureId.value) {
    alert('삭제할 문제를 찾을 수 없습니다.')
    return
  }

  try {
    await lectureApiService.deleteLecture(editLectureId.value)
    alert('문제가 삭제되었습니다.')

    // 삭제 성공 시 변경사항 플래그 초기화 (경고 없이 페이지 이동)
    hasUnsavedChanges.value = false

    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('문제 삭제 실패:', error)
    alert('문제 삭제 중 오류가 발생했습니다.')
  }
}
</script>
