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
            <h1 class="text-lg font-semibold">커리큘럼 만들기</h1>
            <p class="text-sm text-gray-600">강의물을 조합하여 교육과정을 구성하세요</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <Button 
            @click="previewCurriculum"
            variant="secondary"
          >
            미리보기
          </Button>
          <Button 
            @click="saveCurriculum"
            variant="success"
            :loading="isSaving"
            loading-text="저장 중..."
          >
            저장하기
          </Button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex h-[calc(100vh-80px)]">
      <!-- 에러/성공 메시지 -->
      <div class="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <ErrorMessage v-if="error" :message="error" />
        <SuccessMessage v-if="success" :message="success" />
      </div>
      <!-- 왼쪽 패널 - 커리큘럼 정보 -->
      <div class="w-1/3 bg-white border-r overflow-y-auto">
        <div class="p-6">
          <!-- 커리큘럼 기본 정보 -->
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">커리큘럼 정보</h2>
            
            <!-- 제목 -->
            <FormInput
              v-model="curriculum.title"
              label="제목"
              placeholder="커리큘럼 제목을 입력하세요"
              :error="titleError"
              required
            />

            <!-- 설명 -->
            <FormTextarea
              v-model="curriculum.description"
              label="설명"
              placeholder="커리큘럼에 대한 설명을 입력하세요"
              :error="descriptionError"
              :rows="4"
            />

            <!-- 카테고리 -->
            <FormSelect
              v-model="curriculum.category"
              label="카테고리"
              placeholder="카테고리를 선택하세요"
              :options="categoryOptions"
            />

            <!-- 난이도 -->
            <FormSelect
              v-model="curriculum.difficulty"
              label="난이도"
              placeholder="난이도를 선택하세요"
              :options="difficultyOptions"
            />

            <!-- 간단 소개 (요약) -->
            <FormTextarea
              v-model="curriculum.summary"
              label="간단 소개"
              placeholder="커리큘럼에 대한 간단한 소개를 입력하세요 (최대 500자)"
              :maxlength="500"
              :rows="3"
            />

            <!-- 태그 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">태그</label>
              <input
                v-model="tagInput"
                @keyup.enter="addTag"
                type="text"
                placeholder="태그를 입력하고 Enter를 누르세요"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="(tag, index) in curriculum.tags"
                  :key="index"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
                >
                  <span>{{ tag }}</span>
                  <button @click="removeTag(index)" class="hover:text-blue-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- 커리큘럼 통계 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-3">커리큘럼 통계</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">총 강의 수</span>
                <span class="font-medium">{{ curriculum.lessons.length }}개</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">예상 소요시간</span>
                <span class="font-medium">{{ totalDuration }}분</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">문제 수</span>
                <span class="font-medium">{{ problemCount }}개</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- 오른쪽 패널 - 강의물 관리 -->
      <div class="w-2/3 bg-gray-50 flex flex-col">
        <!-- 상단 탭 -->
        <div class="bg-white border-b px-6 py-3">
          <div class="flex space-x-6">
            <button
              @click="activeTab = 'available'"
              :class="[
                'px-4 py-2 font-medium border-b-2 transition-colors',
                activeTab === 'available' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              사용 가능한 강의물
            </button>
            <button
              @click="activeTab = 'curriculum'"
              :class="[
                'px-4 py-2 font-medium border-b-2 transition-colors',
                activeTab === 'curriculum' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              커리큘럼 구성 ({{ curriculum.lessons.length }})
            </button>
          </div>
        </div>

        <!-- 사용 가능한 강의물 탭 -->
        <div v-if="activeTab === 'available'" class="flex-1 overflow-y-auto p-6">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">내가 만든 강의물</h3>
              <div class="flex space-x-2">
                <select
                  v-model="filterType"
                  class="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">전체</option>
                  <option value="markdown">강의</option>
                  <option value="problem">문제</option>
                  <option value="video">비디오</option>
                </select>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="강의물 검색..."
                  class="px-3 py-1 border border-gray-300 rounded text-sm w-48"
                />
              </div>
            </div>
          </div>

          <!-- 강의물 목록 -->
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="material in filteredMaterials"
              :key="material.id"
              class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
              :class="material.id === recentlyAddedId ? 'highlight-flash' : ''"
              @click="addToCurriculum(material)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        material.type === 'markdown' ? 'bg-blue-100 text-blue-800' :
                        material.type === 'problem' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      ]"
                    >
                      {{ material.type === 'markdown' ? '강의' : material.type === 'problem' ? '문제' : '비디오' }}
                    </span>
                    <span class="text-sm text-gray-500">{{ material.createdDate }}</span>
                  </div>
                  <h4 class="font-semibold text-gray-900 mb-1">{{ material.title }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ material.description }}</p>
                  <div class="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{{ material.duration }}</span>
                    <span>{{ material.difficulty }}</span>
                  </div>
                </div>
                <button
                  @click.stop="addToCurriculum(material)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredMaterials.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>사용 가능한 강의물이 없습니다.</p>
            <p class="text-sm mt-1">먼저 강의나 문제를 만들어보세요.</p>
          </div>
        </div>

        <!-- 커리큘럼 구성 탭 -->
        <div v-if="activeTab === 'curriculum'" class="flex-1 overflow-y-auto p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-4">커리큘럼 구성</h3>
            <p class="text-sm text-gray-600 mb-4">강의물을 드래그하여 순서를 변경할 수 있습니다.</p>
          </div>

          <!-- 커리큘럼 강의물 목록 -->
          <div class="space-y-3">
            <div
              v-for="(lesson, index) in curriculum.lessons"
              :key="lesson.id"
              class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center space-x-4">
                <!-- 순서 번호 -->
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {{ index + 1 }}
                </div>

                <!-- 강의물 정보 -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <span
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        lesson.type === 'markdown' ? 'bg-blue-100 text-blue-800' :
                        lesson.type === 'problem' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      ]"
                    >
                      {{ lesson.type === 'markdown' ? '강의' : lesson.type === 'problem' ? '문제' : '비디오' }}
                    </span>
                    <span class="text-sm text-gray-500">{{ lesson.duration }}</span>
                  </div>
                  <h4 class="font-semibold text-gray-900">{{ lesson.title }}</h4>
                  <p class="text-sm text-gray-600">{{ lesson.description }}</p>
                </div>

                <!-- 액션 버튼들 -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="moveUp(index)"
                    :disabled="index === 0"
                    class="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </button>
                  <button
                    @click="moveDown(index)"
                    :disabled="index === curriculum.lessons.length - 1"
                    class="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <button
                    @click="removeFromCurriculum(index)"
                    class="p-2 text-gray-400 hover:text-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="curriculum.lessons.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p>커리큘럼에 강의물을 추가해보세요.</p>
            <p class="text-sm mt-1">왼쪽에서 강의물을 선택하여 추가할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import curriculumApiService from '@/services/curriculumApi'
import lectureApiService from '@/services/lectureApi'
import { Button, FormInput, FormTextarea, FormSelect, ErrorMessage, SuccessMessage } from '@/components/common'
import { LECTURE_CATEGORIES, DIFFICULTY_LEVELS, MESSAGES } from '@/constants'
import { validateTitle, validateDescription, handleApiError } from '@/utils'
import type { Lecture } from '@/types/lecture'
import type { CreateCurriculumRequest, AddLectureRequest } from '@/types/curriculum'

const router = useRouter()

// 상태 관리
const isSaving = ref(false)
const error = ref('')
const success = ref('')

// 유효성 검사
const titleError = computed(() => validateTitle(curriculum.value.title))
const descriptionError = computed(() => validateDescription(curriculum.value.description))

// 옵션 데이터
const categoryOptions = computed(() => [
  { value: '', label: '카테고리를 선택하세요' },
  ...LECTURE_CATEGORIES.map(cat => ({ value: cat.toLowerCase(), label: cat }))
])

const difficultyOptions = computed(() => [
  { value: '', label: '난이도를 선택하세요' },
  ...DIFFICULTY_LEVELS.map(level => ({ value: level.toLowerCase(), label: level }))
])

// 커리큘럼 데이터
const curriculum = ref({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  summary: '',
  tags: [] as string[],
  lessons: [] as any[]
})

// UI 상태
const activeTab = ref('available')
const tagInput = ref('')
const searchQuery = ref('')
const filterType = ref('')

// 사용 가능한 강의물 목록 (localStorage에서 가져오기)
const availableMaterials = ref<any[]>([])
// 최근 추가된 아이템 하이라이트용
const recentlyAddedId = ref<number | string | null>(null)

// 계산된 속성들
const filteredMaterials = computed(() => {
  let filtered = availableMaterials.value

  // 타입 필터
  if (filterType.value) {
    filtered = filtered.filter(material => material.type === filterType.value)
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(material => 
      material.title.toLowerCase().includes(query) ||
      material.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalDuration = computed(() => {
  return curriculum.value.lessons.reduce((total, lesson) => {
    return total + parseInt(lesson.duration.replace('분', '')) || 0
  }, 0)
})

const problemCount = computed(() => {
  return curriculum.value.lessons.filter(lesson => lesson.type === 'problem').length
})

// (rollback) 드래그/아웃라인/요약 관련 보조 로직 제거

// 메서드들
const goBack = () => {
  router.back()
}

const addTag = () => {
  if (tagInput.value.trim() && !curriculum.value.tags.includes(tagInput.value.trim())) {
    curriculum.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  curriculum.value.tags.splice(index, 1)
}

const addToCurriculum = (material: any) => {
  // 이미 추가된 강의물인지 확인
  if (curriculum.value.lessons.some(lesson => lesson.id === material.id)) {
    alert('이미 커리큘럼에 추가된 강의물입니다.')
    return
  }
  
  curriculum.value.lessons.push({ ...material })
  recentlyAddedId.value = material.id
  // 1.2초 후 하이라이트 해제
  window.setTimeout(() => {
    if (recentlyAddedId.value === material.id) {
      recentlyAddedId.value = null
    }
  }, 1200)
}

const removeFromCurriculum = (index: number) => {
  curriculum.value.lessons.splice(index, 1)
}

const moveUp = (index: number) => {
  if (index > 0) {
    const lessons = curriculum.value.lessons
    const temp = lessons[index]
    lessons[index] = lessons[index - 1]
    lessons[index - 1] = temp
  }
}

const moveDown = (index: number) => {
  const lessons = curriculum.value.lessons
  if (index < lessons.length - 1) {
    const temp = lessons[index]
    lessons[index] = lessons[index + 1]
    lessons[index + 1] = temp
  }
}

const loadAvailableMaterials = async () => {
  try {
    // API로 공개 강의 목록 가져오기
    const lectures = await curriculumApiService.getPublicLecturesForCurriculum()

    // 강의 데이터를 UI에 맞게 변환
    availableMaterials.value = lectures.map((lecture: Lecture) => ({
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      type: lecture.type.toLowerCase(), // MARKDOWN -> markdown, PROBLEM -> problem
      category: lecture.category || '미분류',
      difficulty: lecture.difficulty || '중급',
      duration: lecture.type === 'PROBLEM' ? '15분' : '30분',
      createdDate: formatDate(lecture.createdAt),
      testCaseCount: lecture.testCaseCount
    }))
  } catch (error) {
    console.error('강의 목록 로드 실패:', error)
    alert('강의 목록을 불러오는데 실패했습니다.')
  }
}

// 날짜 포맷 헬퍼 함수
const formatDate = (date: number[] | string): string => {
  if (Array.isArray(date)) {
    // [2025, 1, 15, 14, 30, 0] 형태
    return `${date[0]}-${String(date[1]).padStart(2, '0')}-${String(date[2]).padStart(2, '0')}`
  }
  return new Date(date).toISOString().split('T')[0]
}

const previewCurriculum = () => {
  if (curriculum.value.lessons.length === 0) {
    alert('커리큘럼에 강의물을 추가해주세요.')
    return
  }
  
  // 미리보기 데이터를 localStorage에 저장하고 미리보기 페이지로 이동
  localStorage.setItem('previewCurriculum', JSON.stringify(curriculum.value))
  router.push({ name: 'curriculum-overview', params: { id: 'preview' }, query: { preview: 'true' } })
}

const saveCurriculum = async () => {
  error.value = ''
  success.value = ''
  
  // 유효성 검사
  const titleValidation = validateTitle(curriculum.value.title)
  const descriptionValidation = validateDescription(curriculum.value.description)
  
  if (titleValidation || descriptionValidation) {
    return
  }

  if (curriculum.value.lessons.length === 0) {
    error.value = '커리큘럼에 강의물을 추가해주세요.'
    return
  }

  isSaving.value = true

  try {
    // 1. 커리큘럼 생성
    const curriculumResponse = await curriculumApiService.createCurriculum({
      title: curriculum.value.title,
      description: curriculum.value.description,
      isPublic: true, // 기본값으로 공개
      difficulty: curriculum.value.difficulty,
      summary: curriculum.value.summary
    })

    // 2. 강의 추가
    for (let i = 0; i < curriculum.value.lessons.length; i++) {
      const lesson = curriculum.value.lessons[i]
      await curriculumApiService.addLectureToCurriculum(curriculumResponse.id, {
        lectureId: lesson.id,
        isRequired: false, // 기본값
        order: i + 1
      })
    }

    success.value = MESSAGES.SUCCESS.CURRICULUM_CREATED
    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 1500)
  } catch (err: any) {
    console.error('커리큘럼 저장 실패:', err)
    error.value = handleApiError(err)
  } finally {
    isSaving.value = false
  }
}

// 컴포넌트 초기화
onMounted(() => {
  loadAvailableMaterials()
})
</script>
<style scoped>
@keyframes flash {
  0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); background-color: rgba(59,130,246,0.18); }
  40% { box-shadow: 0 0 0 4px rgba(59,130,246,0.35); background-color: rgba(59,130,246,0.28); }
  60% { box-shadow: 0 0 0 2px rgba(59,130,246,0.25); background-color: rgba(59,130,246,0.18); }
  100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); background-color: rgba(59,130,246,0); }
}

.highlight-flash {
  animation: flash 1.2s ease-out forwards;
}
</style>