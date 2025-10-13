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

        <!-- 설정 탭 -->
        <div v-if="activeTab === 'settings'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">강의 설정</h2>
          
          <div class="space-y-6">
            <!-- 공개 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="courseData.isPublic" 
                    type="radio" 
                    :value="true" 
                    class="mr-2"
                  />
                  공개 (모든 사용자가 볼 수 있음)
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="courseData.isPublic" 
                    type="radio" 
                    :value="false" 
                    class="mr-2"
                  />
                  비공개 (링크를 아는 사용자만 볼 수 있음)
                </label>
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

            <!-- 에디터 테마 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">에디터 테마</label>
              <select 
                v-model="editorTheme"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
import { Button, FormInput, FormTextarea, FormSelect, ErrorMessage, SuccessMessage, ConfirmDialog } from '@/components/common'
import { LECTURE_CATEGORIES, DIFFICULTY_LEVELS, MESSAGES } from '@/constants'
import { validateTitle, validateDescription, handleApiError } from '@/utils'
import { LectureType } from '@/types/lecture'

const router = useRouter()
const route = useRoute()

// 편집 모드 확인
const isEditMode = computed(() => route.query.mode === 'edit')

// 탭 관리
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'content', label: '강의 내용' },
  { id: 'settings', label: '설정' }
]

const activeTab = ref('content')

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
  tags: [] as string[]
})

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

// 이미지 업로드
function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  // 실제로는 서버에 업로드해야 함
  console.log('이미지 업로드:', files)
  // 임시로 더미 URL 반환
  const urls = files.map(() => 'https://via.placeholder.com/300x200')
  callback(urls)
}

// 액션 함수들
function goBack() {
  router.back()
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
}

async function publishCourse() {
  if (!courseData.title.trim()) {
    alert('강의 제목을 입력해주세요.')
    return
  }

  if (!courseData.content.trim()) {
    alert('강의 내용을 입력해주세요.')
    return
  }

  isPublishing.value = true
  try {
    const lectureData = {
      title: courseData.title,
      description: courseData.description || courseData.content.substring(0, 200),
      type: LectureType.MARKDOWN,
      category: courseData.category || '기타',
      difficulty: courseData.difficulty || '입문'
    }

    if (isEditMode.value) {
      const lectureId = Number(route.query.edit)
      await lectureApiService.updateLecture(lectureId, lectureData)
      alert('강의가 수정되었습니다!')
    } else {
      const createdLecture = await lectureApiService.createLecture(lectureData)
      console.log('강의 생성 완료:', createdLecture)
      alert('강의가 발행되었습니다.')
    }

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

  try {
    const lectureId = Number(route.query.edit)
    await lectureApiService.deleteLecture(lectureId)
    alert('강의가 삭제되었습니다.')
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('강의 삭제 실패:', error)
    alert('강의 삭제 중 오류가 발생했습니다.')
  }
}
</script>
