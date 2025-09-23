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
            @click="showCourseTypeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            강의 유형 선택
          </button>
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
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            강의 발행
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
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">이미지를 드래그하거나 클릭하여 업로드</p>
                <input type="file" class="hidden" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        <!-- 강의 내용 탭 -->
        <div v-if="activeTab === 'content'" class="max-w-4xl">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">지원 언어</label>
              <div class="flex flex-wrap gap-2">
                <label 
                  v-for="language in availableLanguages" 
                  :key="language"
                  class="flex items-center"
                >
                  <input 
                    v-model="courseData.languages"
                    :value="language"
                    type="checkbox" 
                    class="mr-2"
                  />
                  {{ language }}
                </label>
              </div>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import CourseTypeModal from '../components/modal/CourseTypeModal.vue'

const router = useRouter()

// 모달 관리
const showModal = ref(false)

// 탭 관리
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'content', label: '강의 내용' },
  { id: 'settings', label: '설정' }
]

const activeTab = ref('basic')

// 강의 데이터
const courseData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  isPublic: true,
  tags: [] as string[],
  languages: [] as string[]
})

// 태그 관리
const newTag = ref('')

// 사용 가능한 언어
const availableLanguages = ['Python', 'Java', 'JavaScript', 'C++', 'C#', 'Go', 'Rust']

function addTag() {
  if (newTag.value.trim() && !courseData.tags.includes(newTag.value.trim())) {
    courseData.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  courseData.tags = courseData.tags.filter(t => t !== tag)
}

// 액션 함수들
function goBack() {
  router.back()
}

function previewCourse() {
  // 미리보기 기능 구현
  alert('미리보기 기능은 구현 예정입니다.')
}

function saveDraft() {
  // 임시저장 기능 구현
  console.log('임시저장:', courseData)
  alert('임시저장되었습니다.')
}

function publishCourse() {
  // 강의 발행 기능 구현
  console.log('강의 발행:', courseData)
  alert('강의가 발행되었습니다.')
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
  
  // 강의 유형에 따라 다른 페이지로 이동
  switch (type) {
    case 'markdown':
      // 마크다운 에디터 페이지로 이동
      router.push({ name: 'instructor-create-markdown' })
      break
    case 'problem':
      // 문제 생성 페이지로 이동
      router.push({ name: 'instructor-create-problem' })
      break
    case 'video':
      // 동영상 첨부 페이지로 이동
      router.push({ name: 'instructor-create-video' })
      break
  }
}
</script>
