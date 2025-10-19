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
            <h1 class="text-lg font-semibold">마크다운 강의 생성</h1>
            <p class="text-sm text-gray-600">마크다운으로 강의 내용을 작성하세요</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Button 
            @click="previewCourse"
            variant="ghost"
          >
            미리보기
          </Button>
          <Button 
            @click="saveDraft"
            variant="secondary"
          >
            임시저장
          </Button>
          <Button 
            @click="publishCourse"
            :loading="isPublishing"
            loading-text="발행 중..."
          >
            {{ isEditMode ? '수정 완료' : '강의 발행' }}
          </Button>
          <Button 
            v-if="isEditMode"
            @click="deleteCourse"
            variant="danger"
          >
            삭제하기
          </Button>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">강의 설명</label>
              <textarea
                v-model="courseData.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="강의에 대한 간단한 설명을 입력하세요 (선택사항)"
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

            <!-- 공개 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="flex items-center">
                <button
                  @click="courseData.isPublic = !courseData.isPublic"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    courseData.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      courseData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <span class="ml-3 text-sm text-gray-600">
                  {{ courseData.isPublic ? '공개 (모든 사용자가 볼 수 있음)' : '비공개 (링크를 아는 사용자만 볼 수 있음)' }}
                </span>
              </div>
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
                    @click="removeTag(index)"
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
              <label class="block text-sm font-medium text-gray-700 mb-2">강의 언어</label>

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

        <!-- 마크다운 에디터 탭 -->
        <div v-if="activeTab === 'content'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">강의 내용</h2>

          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <MdEditor
              v-model="courseData.content"
              :theme="editorTheme"
              :toolbars="toolbars"
              :height="600"
              placeholder="마크다운으로 강의 내용을 작성하세요..."
              @on-upload-img="onUploadImg"
            />
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
import { Button, FormInput, FormTextarea, FormSelect, ErrorMessage, SuccessMessage, ConfirmDialog } from '@/components/common'
import { LECTURE_CATEGORIES, DIFFICULTY_LEVELS, MESSAGES } from '@/constants'
import { validateTitle, validateDescription, handleApiError } from '@/utils'
import { LectureType } from '@/types/lecture'
import type { Language } from '@/types/language'

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
  { id: 'content', label: '강의 내용' }
]

const activeTab = ref('basic')

// 강의 데이터
const courseData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  content: `# 강의 제목

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
이 강의에서는...`,
  isPublic: true,
  tags: [] as string[],
  language: null as number | null,
  thumbnailUrl: null as string | null
})

// 썸네일 관련
const thumbnailPreview = ref<string | null>(null)
const isUploadingThumbnail = ref(false)
const isDragging = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// 사용 가능한 언어
const availableLanguages = ref<Language[]>([])
const isLoadingLanguages = ref(false)

// 에디터 설정
const editorTheme = ref<Themes>('light')
const newTag = ref('')
const isPublishing = ref(false)

// 툴바 설정
const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', 'strikeThrough', 'sub', 'sup',
  'quote', 'unorderedList', 'orderedList', 'task', 'codeRow', 'code',
  'link', 'image', 'table', 'mermaid', 'katex', 'revoke', 'next',
  'save', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview'
]

// 태그 관리
function addTag() {
  if (newTag.value.trim() && !courseData.tags.includes(newTag.value.trim())) {
    courseData.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(index: number) {
  courseData.tags.splice(index, 1)
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

// 이미지 업로드
async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  try {
    console.log('이미지 업로드 시작:', files)

    // 모든 파일을 병렬로 업로드
    const uploadPromises = files.map(async (file) => {
      // 파일 유효성 검사
      const validation = S3ApiService.validateImageFile(file)
      if (!validation.isValid) {
        console.error('이미지 유효성 검사 실패:', validation.error)
        alert(validation.error)
        return null
      }

      try {
        // S3에 이미지 업로드
        const response = await s3ApiService.uploadImage(file, 'lectures')
        console.log('이미지 업로드 성공:', response)
        return response.imageUrl
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        alert(`이미지 업로드 실패: ${file.name}`)
        return null
      }
    })

    // 모든 업로드 완료 대기
    const uploadedUrls = await Promise.all(uploadPromises)

    // null이 아닌 URL만 필터링
    const validUrls = uploadedUrls.filter((url): url is string => url !== null)

    // 마크다운 에디터에 URL 전달
    callback(validUrls)

    console.log('모든 이미지 업로드 완료:', validUrls)
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
    callback([])
  }
}

// 강의 데이터 로드
async function loadLectureData() {
  if (!editLectureId.value) return

  try {
    const lecture = await lectureApiService.getLecture(editLectureId.value)
    console.log('강의 데이터 로드:', lecture)

    // 기본 정보
    courseData.title = lecture.title || ''
    courseData.category = lecture.category || ''
    courseData.difficulty = lecture.difficulty || ''
    courseData.isPublic = lecture.isPublic ?? true

    // 원본 공개 상태 저장 (변경사항 감지용)
    originalIsPublic.value = lecture.isPublic ?? true

    // 마크다운 콘텐츠 (백엔드 description 필드에서 가져옴)
    courseData.content = lecture.description || ''

    // 강의 설명 필드는 비워둠 (API 연결 없음)
    courseData.description = ''

    console.log('강의 데이터 로드 완료')
  } catch (error) {
    console.error('강의 데이터 로드 실패:', error)
    alert('강의 데이터를 불러오는데 실패했습니다.')
  }
}

// 언어 목록 로드 및 초기화
onMounted(async () => {
  // 언어 목록 로드
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

  // 편집 모드인 경우 강의 데이터 로드
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
  [courseData, editorTheme, newTag],
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

function previewCourse() {
  // 미리보기 기능 구현 - 학습자 화면으로 이동
  console.log('마크다운 강의 미리보기:', courseData)
  
  // 임시 강의 ID 생성 (실제로는 백엔드에서 생성)
  const tempLessonId = Date.now()
  
  // 강의 데이터를 localStorage에 임시 저장 (미리보기용)
  const previewData = {
    id: tempLessonId,
    title: courseData.title || '미리보기 강의',
    content: courseData.content || '# 강의 내용\n\n강의 내용을 작성해주세요.',
    format: '마크다운',
    isPreview: true
  }
  
  localStorage.setItem('previewLesson', JSON.stringify(previewData))
  
  // 학습자 화면으로 이동
  router.push({ 
    name: 'lecture', 
    params: { lectureId: tempLessonId },
    query: { preview: 'true' }
  })
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
  console.log('발행 시도 - courseData:', courseData)

  if (!courseData.title || !courseData.title.trim()) {
    alert('강의 제목을 입력해주세요.')
    activeTab.value = 'basic'
    return
  }

  if (!courseData.content || !courseData.content.trim()) {
    alert('강의 내용을 입력해주세요.')
    activeTab.value = 'content'
    return
  }

  isPublishing.value = true
  try {
    // 백엔드 DTO에 맞춰서 필드 매핑
    const lectureData = {
      title: courseData.title,
      description: courseData.description || '',  // 강의 설명 (짧은 요약)
      content: courseData.content,  // 강의 전체 내용 (마크다운)
      type: LectureType.MARKDOWN,
      category: courseData.category || '기타',
      difficulty: courseData.difficulty || '입문',
      isPublic: courseData.isPublic,
      tags: courseData.tags || [],
      thumbnailImageUrl: courseData.thumbnailUrl || '',
      durationMinutes: 30  // TODO: 마크다운 강의 기본 소요시간 (추후 사용자 입력으로 변경 가능)
    }

    if (isEditMode.value && editLectureId.value) {
      await lectureApiService.updateLecture(editLectureId.value, lectureData)

      // 현재 isPublic 상태에 따라 공개/비공개 API 호출 (임시 조치 - 백엔드 수정 필요)
      try {
        if (lectureData.isPublic) {
          await lectureApiService.publishLecture(editLectureId.value)
          console.log('강의 공개 전환 완료')
        } else {
          await lectureApiService.unpublishLecture(editLectureId.value)
          console.log('강의 비공개 전환 완료')
        }
      } catch (error) {
        console.error('공개/비공개 전환 실패:', error)
      }

      alert('강의가 수정되었습니다!')
    } else {
      const createdLecture = await lectureApiService.createLecture(lectureData)
      console.log('강의 생성 완료:', createdLecture)

      // isPublic이 true인 경우 공개 전환 API 호출 (임시 조치 - 백엔드 수정 필요)
      if (lectureData.isPublic) {
        try {
          await lectureApiService.publishLecture(createdLecture.id)
          console.log('강의 공개 전환 완료')
        } catch (error) {
          console.error('공개 전환 실패:', error)
        }
      }

      alert('강의가 발행되었습니다.')
    }

    // 발행 성공 시 변경사항 플래그 초기화
    hasUnsavedChanges.value = false

    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('강의 발행 실패:', error)
    alert('강의 발행 중 오류가 발생했습니다.')
  } finally {
    isPublishing.value = false
  }
}

// 강의 삭제하기 (편집 모드에서만)
async function deleteCourse() {
  if (!confirm('정말로 이 강의를 삭제하시겠습니까?\n삭제된 강의는 복구할 수 없습니다.')) {
    return
  }

  if (!editLectureId.value) {
    alert('삭제할 강의를 찾을 수 없습니다.')
    return
  }

  try {
    await lectureApiService.deleteLecture(editLectureId.value)
    alert('강의가 삭제되었습니다.')

    // 삭제 성공 시 변경사항 플래그 초기화 (경고 없이 페이지 이동)
    hasUnsavedChanges.value = false

    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('강의 삭제 실패:', error)
    alert('강의 삭제 중 오류가 발생했습니다.')
  }
}
</script>
