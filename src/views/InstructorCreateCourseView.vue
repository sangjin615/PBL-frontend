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
            <h1 class="text-lg font-semibold">강의 생성</h1>
            <p class="text-sm text-gray-600">새로운 강의를 만들어보세요</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="previewCourse"
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
            @click="publishCourse"
            :disabled="isPublishing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isPublishing ? '발행 중...' : '강의 발행' }}
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
                ? 'bg-blue-100 text-blue-700' 
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
            <!-- 강의 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">강의 제목 *</label>
              <input 
                v-model="courseData.title"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="강의 제목을 입력하세요"
              />
            </div>

            <!-- 강의 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">강의 설명 *</label>
              <textarea 
                v-model="courseData.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="강의에 대한 간단한 설명을 입력하세요"
              ></textarea>
            </div>

            <!-- 카테고리 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <select 
                v-model="courseData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="알고리즘">알고리즘</option>
                <option value="웹개발">웹개발</option>
                <option value="모바일">모바일</option>
                <option value="데이터사이언스">데이터사이언스</option>
                <option value="AI/ML">AI/ML</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <!-- 난이도 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">난이도 *</label>
              <select 
                v-model="courseData.difficulty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">난이도를 선택하세요</option>
                <option value="입문">입문</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
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
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
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
          </div>
        </div>

        <!-- 강의 유형 선택 전 - 강의 내용 탭 -->
        <div v-if="activeTab === 'content'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">강의 내용</h2>
          <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">강의 유형을 선택해주세요</h3>
            <p class="text-gray-600 mb-6">강의 내용을 작성하려면 먼저 강의 유형을 선택해야 합니다.</p>
            <button
              @click="showCourseTypeModal"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              강의 유형 선택하기
            </button>
          </div>
        </div>

        <!-- 마크다운 강의 - 강의 내용 탭 -->
        <div v-if="activeTab === 'markdown-content'" class="max-w-6xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">강의 내용</h2>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                마크다운 강의
              </span>
              <button
                @click="changeCourseType"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                강의 유형 변경
              </button>
            </div>
          </div>
          <MarkdownEditor v-model="markdownContent" />
        </div>

        <!-- 문제 강의 - 문제 내용 탭 -->
        <div v-if="activeTab === 'problem-description'" class="max-w-6xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">문제 내용</h2>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                코딩 문제
              </span>
              <button
                @click="changeCourseType"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                강의 유형 변경
              </button>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.problemDescription"
                  :theme="'light'"
                  :toolbars="['bold', 'underline', 'italic', 'quote', 'unorderedList', 'orderedList', 'codeRow', 'code', 'link', 'table', 'revoke', 'next', 'preview']"
                  :height="500"
                  placeholder="문제를 자세히 설명해주세요..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 문제 강의 - 제약 조건 탭 -->
        <div v-if="activeTab === 'problem-constraints'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">제약 조건</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">시간 제한 (초) *</label>
                <input
                  v-model.number="problemData.timeLimit"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1"
                />
                <p class="text-xs text-gray-500 mt-1">프로그램 실행 제한 시간</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">메모리 제한 (MB) *</label>
                <input
                  v-model.number="problemData.memoryLimit"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="256"
                />
                <p class="text-xs text-gray-500 mt-1">프로그램 메모리 사용 제한</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 문제 강의 - 입출력 설명 탭 -->
        <div v-if="activeTab === 'problem-io'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">입출력 설명</h2>
          <div class="space-y-6">
            <!-- 입력 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">입력 설명</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.inputDescription"
                  :theme="'light'"
                  :toolbars="['bold', 'underline', 'italic', 'quote', 'unorderedList', 'orderedList', 'codeRow', 'code', 'revoke', 'next', 'preview']"
                  :height="250"
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
                  :theme="'light'"
                  :toolbars="['bold', 'underline', 'italic', 'quote', 'unorderedList', 'orderedList', 'codeRow', 'code', 'revoke', 'next', 'preview']"
                  :height="250"
                  placeholder="출력 형식을 설명해주세요..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 문제 강의 - 테스트 케이스 탭 -->
        <div v-if="activeTab === 'problem-testcases'" class="max-w-6xl">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">테스트 케이스</h2>
            <button
              @click="addTestCase"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + 테스트 케이스 추가
            </button>
          </div>

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
                  class="text-red-600 hover:text-red-800 text-sm"
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
                    placeholder="입력 데이터"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">출력</label>
                  <textarea
                    v-model="testCase.output"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="예상 출력"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 비디오 강의 - 비디오 업로드 탭 -->
        <div v-if="activeTab === 'video-content'" class="max-w-6xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold">비디오 업로드</h2>
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                비디오 강의
              </span>
              <button
                @click="changeCourseType"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                강의 유형 변경
              </button>
            </div>
          </div>
          <div class="text-center py-12">
            <p class="text-gray-600">비디오 강의는 준비 중입니다.</p>
          </div>
        </div>

        <!-- 설정 탭 -->
        <div v-if="activeTab === 'settings'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">강의 설정</h2>
          
          <div class="space-y-6">
            <!-- 공개 설정 -->
            <div>
              <label class="flex items-center justify-between">
                <div>
                  <span class="block text-sm font-medium text-gray-700 mb-1">공개 설정</span>
                  <span class="text-xs text-gray-500">
                    {{ courseData.isPublic ? '모든 사용자가 볼 수 있습니다' : '링크를 아는 사용자만 볼 수 있습니다' }}
                  </span>
                </div>
                <button
                  type="button"
                  @click="courseData.isPublic = !courseData.isPublic"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    courseData.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      courseData.isPublic ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </label>
            </div>

            <!-- 태그 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">태그</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span 
                  v-for="(tag, index) in courseData.tags" 
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                  <button 
                    @click="removeTag(tag)"
                    class="ml-2 text-blue-600 hover:text-blue-800"
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
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
            </div>

            <!-- 언어 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ selectedCourseType === 'problem' ? '지원 언어' : '강의 언어' }}
                <span v-if="selectedCourseType === 'problem'" class="text-xs text-gray-500 ml-2">
                  (학습자가 코드를 제출할 때 사용할 언어)
                </span>
              </label>

              <div v-if="isLoadingLanguages" class="text-sm text-gray-500 py-4">
                언어 목록을 불러오는 중...
              </div>

              <select
                v-else
                v-model="courseData.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
        </div>
      </div>
    </div>

    <!-- 강의 유형 선택 모달 -->
    <CourseTypeModal
      :is-open="showModal"
      @close="closeModal"
      @select="handleCourseTypeSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { MdEditor, type ToolbarNames } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'
import CourseTypeModal from '../components/modal/CourseTypeModal.vue'
import MarkdownEditor from '../components/editor/MarkdownEditor.vue'
import ProblemEditor from '../components/editor/ProblemEditor.vue'
import { lectureApiService } from '@/services/lectureApi'
import { languageApiService } from '@/services/languageApi'
import { s3ApiService, S3ApiService } from '@/services/s3Api'
import { LectureType } from '@/types/lecture'
import type { Language } from '@/types/language'

const router = useRouter()

// 미저장 변경사항 추적
const hasUnsavedChanges = ref(false)
const initialDataSnapshot = ref<string>('')

// 모달 관리
const showModal = ref(false)

// 탭 관리 - 강의 유형에 따라 동적으로 변경
const tabs = computed(() => {
  const basicTab = { id: 'basic', label: '기본 정보' }
  const settingsTab = { id: 'settings', label: '설정' }

  if (!selectedCourseType.value) {
    return [basicTab, { id: 'content', label: '강의 내용' }, settingsTab]
  }

  if (selectedCourseType.value === 'markdown') {
    return [
      basicTab,
      { id: 'markdown-content', label: '강의 내용' },
      settingsTab
    ]
  }

  if (selectedCourseType.value === 'problem') {
    return [
      basicTab,
      { id: 'problem-description', label: '문제 내용' },
      { id: 'problem-constraints', label: '제약 조건' },
      { id: 'problem-io', label: '입출력 설명' },
      { id: 'problem-testcases', label: '테스트 케이스' },
      settingsTab
    ]
  }

  if (selectedCourseType.value === 'video') {
    return [
      basicTab,
      { id: 'video-content', label: '비디오 업로드' },
      settingsTab
    ]
  }

  return [basicTab, { id: 'content', label: '강의 내용' }, settingsTab]
})

const activeTab = ref('basic')

// 선택된 강의 유형
const selectedCourseType = ref<'markdown' | 'problem' | 'video' | null>(null)

// 강의 데이터
const courseData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  isPublic: true,
  tags: [] as string[],
  language: null as number | null,  // 단일 언어 ID
  thumbnailUrl: null as string | null  // 썸네일 URL
})

// 썸네일 관련
const thumbnailPreview = ref<string | null>(null)
const isUploadingThumbnail = ref(false)
const isDragging = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// 마크다운 콘텐츠
const markdownContent = ref(`# 강의 제목

## 목차
1. 첫 번째 주제
2. 두 번째 주제

## 내용
강의 내용을 마크다운 형식으로 작성하세요...

### 코드 예제
\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

### 설명
이 강의에서는...`)

// 문제 데이터
const problemData = reactive({
  timeLimit: 1,
  memoryLimit: 256,
  problemDescription: `# A+B

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
  ]
})

const isPublishing = ref(false)

// 태그 관리
const newTag = ref('')

// 사용 가능한 언어
const availableLanguages = ref<Language[]>([])
const isLoadingLanguages = ref(false)

// 언어 목록 로드
onMounted(async () => {
  isLoadingLanguages.value = true
  try {
    availableLanguages.value = await languageApiService.getLanguages()
  } catch (error) {
    console.error('언어 목록 로드 실패:', error)
    // 기본 언어 목록 사용
    availableLanguages.value = await languageApiService.getPopularLanguages()
  } finally {
    isLoadingLanguages.value = false
  }

  // 초기 데이터 스냅샷 저장 (약간의 지연 후 - 초기 렌더링 완료 대기)
  setTimeout(() => {
    initialDataSnapshot.value = getCurrentDataSnapshot()
  }, 500)
})

// 데이터 변경 감지
watch(
  [courseData, markdownContent, problemData, selectedCourseType],
  () => {
    const currentSnapshot = getCurrentDataSnapshot()
    hasUnsavedChanges.value = currentSnapshot !== initialDataSnapshot.value
  },
  { deep: true }
)

// 현재 데이터 스냅샷 생성
function getCurrentDataSnapshot(): string {
  return JSON.stringify({
    courseData: courseData,
    markdownContent: markdownContent.value,
    problemData: problemData,
    selectedCourseType: selectedCourseType.value
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

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

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

function addTag() {
  if (newTag.value.trim() && !courseData.tags.includes(newTag.value.trim())) {
    courseData.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  courseData.tags = courseData.tags.filter(t => t !== tag)
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
    courseData.thumbnailUrl = response.imageUrl
    thumbnailPreview.value = response.imageUrl
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
  courseData.thumbnailUrl = null
}

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

function previewCourse() {
  // 미리보기 기능 구현
  alert('미리보기 기능은 구현 예정입니다.')
}

function saveDraft() {
  // 임시저장 기능 구현
  console.log('임시저장:', courseData)
  alert('임시저장되었습니다.')

  // 임시저장 후 변경사항 플래그 초기화
  hasUnsavedChanges.value = false
  initialDataSnapshot.value = getCurrentDataSnapshot()
}

async function publishCourse() {
  // 유효성 검사
  if (!courseData.title.trim()) {
    alert('강의 제목을 입력해주세요.')
    activeTab.value = 'basic'
    return
  }

  if (!selectedCourseType.value) {
    alert('강의 유형을 선택해주세요.')
    activeTab.value = 'content'
    return
  }

  // 마크다운 강의 검증
  if (selectedCourseType.value === 'markdown' && !markdownContent.value.trim()) {
    alert('강의 내용을 입력해주세요.')
    activeTab.value = 'content'
    return
  }

  // 문제 강의 검증
  if (selectedCourseType.value === 'problem') {
    if (!problemData.problemDescription.trim()) {
      alert('문제 설명을 입력해주세요.')
      activeTab.value = 'content'
      return
    }
    if (problemData.testCases.length === 0) {
      alert('최소 1개의 테스트 케이스가 필요합니다.')
      activeTab.value = 'content'
      return
    }
  }

  isPublishing.value = true
  try {
    console.log('courseData.isPublic 값:', courseData.isPublic, '타입:', typeof courseData.isPublic)

    let lectureData: any

    // 강의 유형별 데이터 구성
    if (selectedCourseType.value === 'markdown') {
      lectureData = {
        title: courseData.title,
        description: markdownContent.value, // 마크다운 내용 전체를 description으로
        type: LectureType.MARKDOWN,
        category: courseData.category || '기타',
        difficulty: courseData.difficulty || '입문',
        isPublic: courseData.isPublic,
        thumbnailUrl: courseData.thumbnailUrl,
        language: courseData.language
      }
    } else if (selectedCourseType.value === 'problem') {
      lectureData = {
        title: courseData.title,
        description: problemData.problemDescription, // 문제 설명 전체를 description으로
        type: LectureType.PROBLEM,
        category: courseData.category || '기타',
        difficulty: courseData.difficulty || '입문',
        timeLimit: problemData.timeLimit || 1,
        memoryLimit: problemData.memoryLimit || 128,
        testCases: problemData.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.output
        })),
        isPublic: courseData.isPublic,
        thumbnailUrl: courseData.thumbnailUrl,
        language: courseData.language
      }
    }

    console.log('최종 전송 데이터:', JSON.stringify(lectureData, null, 2))
    console.log('lectureData.isPublic:', lectureData.isPublic)

    const createdLecture = await lectureApiService.createLecture(lectureData)
    console.log('강의 생성 완료:', createdLecture)

    // isPublic이 true인 경우 공개 전환 API 호출 (임시 조치 - 백엔드 수정 필요)
    if (lectureData.isPublic) {
      try {
        await lectureApiService.publishLecture(createdLecture.id)
        console.log('강의 공개 전환 완료')
      } catch (error) {
        console.error('공개 전환 실패:', error)
        // 강의는 생성되었으므로 계속 진행
      }
    }

    // 발행 성공 시 변경사항 플래그 초기화
    hasUnsavedChanges.value = false

    alert('강의가 발행되었습니다.')
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('강의 발행 실패:', error)
    alert('강의 발행 중 오류가 발생했습니다.')
  } finally {
    isPublishing.value = false
  }
}

// 모달 관련 함수들
function showCourseTypeModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleCourseTypeSelect(type: 'markdown' | 'problem' | 'video') {
  console.log('선택된 강의 유형:', type)
  selectedCourseType.value = type
  closeModal()

  // 강의 유형에 따라 적절한 탭으로 이동
  if (type === 'markdown') {
    activeTab.value = 'markdown-content'
  } else if (type === 'problem') {
    activeTab.value = 'problem-description'
  } else if (type === 'video') {
    activeTab.value = 'video-content'
  }
}

function changeCourseType() {
  if (confirm('강의 유형을 변경하면 작성 중인 내용이 사라질 수 있습니다. 계속하시겠습니까?')) {
    selectedCourseType.value = null
    showCourseTypeModal()
  }
}

// 테스트 케이스 관리
function addTestCase() {
  problemData.testCases.push({
    input: '',
    output: ''
  })
}

function removeTestCase(index: number) {
  if (problemData.testCases.length > 1) {
    problemData.testCases.splice(index, 1)
  } else {
    alert('최소 1개의 테스트 케이스가 필요합니다.')
  }
}
</script>
