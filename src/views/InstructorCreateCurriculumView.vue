<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 헤더 (고정) -->
    <div class="flex-shrink-0 bg-white border-b px-6 py-4 z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">{{ isEditMode ? '커리큘럼 수정' : '커리큘럼 만들기' }}</h1>
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
    <div class="flex flex-1 overflow-hidden">
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

            <!-- 썸네일 -->
            <div class="mb-6">
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
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="flex items-center">
                <button
                  @click="curriculum.isPublic = !curriculum.isPublic"
                  type="button"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    curriculum.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      curriculum.isPublic ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  />
                </button>
                <span class="ml-3 text-sm text-gray-600">
                  {{ curriculum.isPublic ? '공개 (모든 사용자가 볼 수 있음)' : '비공개 (링크를 아는 사용자만 볼 수 있음)' }}
                </span>
              </div>
            </div>
          </div>


          <!-- 커리큘럼 구성 -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-900 mb-3">커리큘럼 구성</h3>
            <p class="text-sm text-gray-600 mb-4">오른쪽에서 강의를 드래그하여 추가하세요.</p>

            <!-- 커리큘럼 강의물 목록 -->
            <div
              class="space-y-2 max-h-96 overflow-y-auto"
              @dragover="onDragOverCurriculum"
              @dragleave="onDragLeaveCurriculum"
              @drop="onDropToCurriculum"
              :class="isDraggingOverCurriculum ? 'ring-2 ring-blue-400 ring-offset-2 rounded-lg' : ''"
            >
              <div
                v-for="(lesson, index) in curriculum.lessons"
                :key="lesson.id"
                draggable="true"
                @dragstart="onDragStartCurriculumItem(index)"
                @dragover="onDragOverCurriculumItem($event, index)"
                @dragleave="onDragLeaveCurriculumItem"
                @drop="onDropCurriculumItem($event, index)"
                @dragend="onDragEndCurriculumItem"
                class="bg-white rounded-lg border p-3 hover:shadow-sm transition-all cursor-move"
                :class="[
                  draggedIndex === index ? 'opacity-50' : '',
                  dragOverIndex === index ? 'border-blue-400 border-2' : ''
                ]"
              >
                <div class="flex items-center space-x-3">
                  <!-- 드래그 핸들 -->
                  <div class="flex-shrink-0 text-gray-400 cursor-move">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                    </svg>
                  </div>

                  <!-- 순서 번호 -->
                  <div class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {{ index + 1 }}
                  </div>

                  <!-- 강의물 정보 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                      <span
                        :class="[
                          'px-2 py-0.5 text-xs rounded-full',
                          lesson.type === 'markdown' ? 'bg-blue-100 text-blue-800' :
                          lesson.type === 'problem' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        ]"
                      >
                        {{ lesson.type === 'markdown' ? '강의' : lesson.type === 'problem' ? '문제' : '비디오' }}
                      </span>
                    </div>
                    <h4 class="font-medium text-gray-900 text-sm truncate mb-1">{{ lesson.title }}</h4>
                    <!-- 태그 표시 -->
                    <div v-if="lesson.tags && lesson.tags.length > 0" class="flex flex-wrap gap-1">
                      <span
                        v-for="(tag, tagIdx) in lesson.tags.slice(0, 3)"
                        :key="tagIdx"
                        class="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                      >
                        {{ tag }}
                      </span>
                      <span
                        v-if="lesson.tags.length > 3"
                        class="px-1.5 py-0.5 text-xs text-gray-500"
                      >
                        +{{ lesson.tags.length - 3 }}
                      </span>
                    </div>
                  </div>

                  <!-- 액션 버튼들 -->
                  <div class="flex items-center space-x-1">
                    <button
                      @click="moveUp(index)"
                      :disabled="index === 0"
                      class="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                    </button>
                    <button
                      @click="moveDown(index)"
                      :disabled="index === curriculum.lessons.length - 1"
                      class="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <button
                      @click="removeFromCurriculum(index)"
                      class="p-1 text-gray-400 hover:text-red-600"
                      title="삭제"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 빈 상태 -->
              <div
                v-if="curriculum.lessons.length === 0"
                class="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border-2 border-dashed min-h-32 flex flex-col items-center justify-center transition-colors"
                :class="isDraggingOverCurriculum ? 'border-blue-400 bg-blue-50' : ''"
              >
                <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <p>{{ isDraggingOverCurriculum ? '여기에 드롭하세요' : '강의물을 드래그하여 추가하세요' }}</p>
              </div>
            </div>
          </div>
          <!-- 커리큘럼 통계 -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
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

      <!-- 오른쪽 패널 - 강의 목록 -->
      <div class="w-2/3 bg-gray-50 flex flex-col">
        <!-- 상단 탭 -->
        <div class="bg-white border-b px-6 py-3">
          <div class="flex items-center justify-between">
            <div class="flex space-x-6">
              <button
                @click="activeTab = 'all'"
                :class="[
                  'px-4 py-2 font-medium border-b-2 transition-colors',
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                모든 강의
              </button>
              <button
                @click="activeTab = 'my'"
                :class="[
                  'px-4 py-2 font-medium border-b-2 transition-colors',
                  activeTab === 'my'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                내가 만든 강의
              </button>
            </div>
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
        <div class="flex-1 overflow-y-auto p-6">
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="material in filteredMaterials"
              :key="material.id"
              draggable="true"
              @dragstart="onDragStartMaterial(material)"
              @dragend="onDragEndMaterial"
              class="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-move"
              :class="[
                material.id === recentlyAddedId ? 'highlight-flash' : '',
                draggedMaterial?.id === material.id ? 'opacity-50' : ''
              ]"
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
                  <div class="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <span>{{ material.duration }}</span>
                    <span>{{ material.difficulty }}</span>
                  </div>
                  <!-- 태그 표시 -->
                  <div v-if="material.tags && material.tags.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="(tag, idx) in material.tags"
                      :key="idx"
                      class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {{ tag }}
                    </span>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import curriculumApiService from '@/services/curriculumApi'
import lectureApiService from '@/services/lectureApi'
import { Button, FormInput, FormTextarea, FormSelect, ErrorMessage, SuccessMessage } from '@/components/common'
import { LECTURE_CATEGORIES, DIFFICULTY_LEVELS, MESSAGES } from '@/constants'
import { validateTitle, validateDescription, handleApiError } from '@/utils'
import { getCurrentUserId } from '@/config/api'
import { s3ApiService, S3ApiService } from '@/services/s3Api'
import type { Lecture } from '@/types/lecture'

const router = useRouter()
const route = useRoute()

// 수정 모드 확인
const isEditMode = ref(false)
const editCurriculumId = ref<number | null>(null)

// 상태 관리
const isSaving = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// 유효성 검사
const titleError = computed(() => validateTitle(curriculum.value.title) || undefined)
const descriptionError = computed(() => validateDescription(curriculum.value.description) || undefined)

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
  thumbnailImageUrl: '',
  durationMinutes: 0,
  isPublic: true,
  lessons: [] as any[]
})

// UI 상태
const activeTab = ref<'all' | 'my'>('all')
const tagInput = ref('')
const searchQuery = ref('')
const filterType = ref('')

// 썸네일 관련
const thumbnailPreview = ref<string | null>(null)
const isUploadingThumbnail = ref(false)
const isDragging = ref(false)
const thumbnailInput = ref<HTMLInputElement | null>(null)

// 강의 목록
const allLectures = ref<any[]>([])  // 모든 공개 강의
const myLectures = ref<any[]>([])   // 내가 만든 강의
// 최근 추가된 아이템 하이라이트용
const recentlyAddedId = ref<number | string | null>(null)

// 드래그 앤 드롭 상태
const draggedMaterial = ref<any>(null)  // 오른쪽에서 드래그 중인 강의
const draggedIndex = ref<number | null>(null)  // 커리큘럼 내 드래그 중인 항목 인덱스
const isDraggingOverCurriculum = ref(false)  // 커리큘럼 영역에 드래그 오버
const dragOverIndex = ref<number | null>(null)  // 드래그 오버된 위치

// 계산된 속성들
const filteredMaterials = computed(() => {
  // 탭에 따라 적절한 목록 선택
  let filtered = activeTab.value === 'all' ? allLectures.value : myLectures.value

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
    curriculum.value.thumbnailImageUrl = response.imageUrl
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
  curriculum.value.thumbnailImageUrl = ''
}

const addToCurriculum = (material: any) => {
  // 이미 추가된 강의물인지 확인
  if (curriculum.value.lessons.some(lesson => lesson.id === material.id)) {
    alert('이미 커리큘럼에 추가된 강의물입니다.')
    return
  }

  curriculum.value.lessons.push({ ...material })

  // 강의의 태그를 커리큘럼 태그에 자동 추가 (중복 제거)
  console.log('추가된 강의:', material)
  console.log('강의 태그:', material.tags)
  console.log('현재 커리큘럼 태그:', curriculum.value.tags)

  // 태그 추가 로직
  const tagsToAdd: string[] = []

  // 1. 강의에 태그가 있으면 추가
  if (material.tags && material.tags.length > 0) {
    tagsToAdd.push(...material.tags)
  } else {
    // 2. 태그가 없으면 카테고리를 태그로 추가
    if (material.category && material.category !== '미분류') {
      tagsToAdd.push(material.category)
    }
  }

  // 중복 제거하며 커리큘럼 태그에 추가
  tagsToAdd.forEach((tag: string) => {
    if (!curriculum.value.tags.includes(tag)) {
      curriculum.value.tags.push(tag)
      console.log('태그 추가됨:', tag)
    }
  })

  console.log('업데이트된 커리큘럼 태그:', curriculum.value.tags)

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

// === 드래그 앤 드롭 핸들러 ===

// 오른쪽 강의 카드 드래그 시작
const onDragStartMaterial = (material: any) => {
  draggedMaterial.value = material
}

// 오른쪽 강의 카드 드래그 종료
const onDragEndMaterial = () => {
  draggedMaterial.value = null
}

// 커리큘럼 영역에 드래그 오버
const onDragOverCurriculum = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOverCurriculum.value = true
}

// 커리큘럼 영역에서 드래그 나감
const onDragLeaveCurriculum = () => {
  isDraggingOverCurriculum.value = false
}

// 커리큘럼 영역에 드롭 (오른쪽에서 추가)
const onDropToCurriculum = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOverCurriculum.value = false

  if (draggedMaterial.value) {
    addToCurriculum(draggedMaterial.value)
    draggedMaterial.value = null
  }
}

// 커리큘럼 내 아이템 드래그 시작
const onDragStartCurriculumItem = (index: number) => {
  draggedIndex.value = index
}

// 커리큘럼 내 아이템 드래그 오버
const onDragOverCurriculumItem = (event: DragEvent, index: number) => {
  event.preventDefault()

  // 자기 자신이 아닌 경우에만
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dragOverIndex.value = index
  }
}

// 커리큘럼 내 아이템 드래그 나감
const onDragLeaveCurriculumItem = () => {
  dragOverIndex.value = null
}

// 커리큘럼 내 아이템 드롭 (순서 변경)
const onDropCurriculumItem = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  dragOverIndex.value = null

  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const lessons = curriculum.value.lessons
    const draggedItem = lessons[draggedIndex.value]

    // 배열에서 제거
    lessons.splice(draggedIndex.value, 1)

    // 새 위치에 삽입
    const newIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex
    lessons.splice(newIndex, 0, draggedItem)

    curriculum.value.lessons = lessons
  }

  draggedIndex.value = null
}

// 커리큘럼 내 아이템 드래그 종료
const onDragEndCurriculumItem = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}

// 모든 공개 강의 로드
const loadAllLectures = async () => {
  try {
    const lectures = await curriculumApiService.getPublicLecturesForCurriculum()
    console.log('로드된 강의 목록:', lectures)
    allLectures.value = lectures.map((lecture: Lecture) => ({
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      type: lecture.type.toLowerCase(),
      category: lecture.category || '미분류',
      difficulty: lecture.difficulty || '중급',
      duration: lecture.type === 'PROBLEM' ? '15분' : '30분',
      createdDate: formatDate(lecture.createdAt),
      testCaseCount: lecture.testCaseCount,
      tags: lecture.tags || []
    }))
    console.log('변환된 강의 목록:', allLectures.value)
  } catch (error) {
    console.error('모든 강의 목록 로드 실패:', error)
    alert('강의 목록을 불러오는데 실패했습니다.')
  }
}

// 내가 만든 강의 로드
const loadMyLectures = async () => {
  try {
    const currentUserId = getCurrentUserId()
    if (currentUserId === null) {
      console.warn('사용자 ID를 찾을 수 없습니다.')
      return
    }

    const lectures = await lectureApiService.getUserLectures(currentUserId)
    myLectures.value = lectures.map((lecture: Lecture) => ({
      id: lecture.id,
      title: lecture.title,
      description: lecture.description,
      type: lecture.type.toLowerCase(),
      category: lecture.category || '미분류',
      difficulty: lecture.difficulty || '중급',
      duration: lecture.type === 'PROBLEM' ? '15분' : '30분',
      createdDate: formatDate(lecture.createdAt),
      testCaseCount: lecture.testCaseCount,
      tags: lecture.tags || []
    }))
  } catch (error) {
    console.error('내 강의 목록 로드 실패:', error)
    alert('내 강의 목록을 불러오는데 실패했습니다.')
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

// 기존 커리큘럼 데이터 로드 (수정 모드)
const loadExistingCurriculum = async (curriculumId: number) => {
  isLoading.value = true
  try {
    const data = await curriculumApiService.getCurriculumById(curriculumId)

    // 기본 정보 설정
    curriculum.value.title = data.title || ''
    curriculum.value.description = data.description || ''
    curriculum.value.category = data.lectures?.[0]?.lectureCategory?.toLowerCase() || ''
    curriculum.value.difficulty = data.difficulty?.toLowerCase() || ''
    curriculum.value.summary = data.summary || ''
    curriculum.value.tags = data.tags || []
    curriculum.value.thumbnailImageUrl = data.thumbnailImageUrl || ''
    curriculum.value.durationMinutes = data.durationMinutes || 0
    curriculum.value.isPublic = data.isPublic ?? true

    // 썸네일 미리보기 설정
    if (data.thumbnailImageUrl) {
      thumbnailPreview.value = data.thumbnailImageUrl
    }

    // 강의 목록 변환
    curriculum.value.lessons = data.lectures.map((lecture: any) => ({
      id: lecture.lectureId,  // lectureId를 id로 사용
      title: lecture.lectureTitle,
      description: lecture.lectureDescription,
      type: lecture.lectureType.toLowerCase(), // MARKDOWN -> markdown
      category: lecture.lectureCategory || '미분류',
      difficulty: lecture.lectureDifficulty || '중급',
      duration: lecture.lectureType === 'PROBLEM' ? '15분' : '30분',
      createdDate: formatDate(lecture.createdAt),
      orderIndex: lecture.orderIndex,
      isRequired: lecture.isRequired,
      tags: lecture.lectureTags || []
    }))

    console.log('기존 커리큘럼 로드 완료:', data)
  } catch (error) {
    console.error('커리큘럼 로드 실패:', error)
    alert('커리큘럼을 불러오는데 실패했습니다.')
    router.push({ name: 'dashboard' })
  } finally {
    isLoading.value = false
  }
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
    if (isEditMode.value && editCurriculumId.value) {
      // 수정 모드: 기존 커리큘럼 업데이트
      await curriculumApiService.updateCurriculum(editCurriculumId.value, {
        title: curriculum.value.title,
        description: curriculum.value.description,
        isPublic: curriculum.value.isPublic,
        difficulty: curriculum.value.difficulty,
        summary: curriculum.value.summary,
        tags: curriculum.value.tags,
        thumbnailImageUrl: curriculum.value.thumbnailImageUrl,
        durationMinutes: curriculum.value.durationMinutes
      })

      // 기존 강의 제거 후 다시 추가 (순서 변경을 위해)
      // TODO: 더 효율적인 방법은 reorderLectures API 사용

      success.value = '커리큘럼이 수정되었습니다.'
    } else {
      // 생성 모드: 새 커리큘럼 생성
      const curriculumResponse = await curriculumApiService.createCurriculum({
        title: curriculum.value.title,
        description: curriculum.value.description,
        isPublic: curriculum.value.isPublic,
        difficulty: curriculum.value.difficulty,
        summary: curriculum.value.summary,
        tags: curriculum.value.tags,
        thumbnailImageUrl: curriculum.value.thumbnailImageUrl,
        durationMinutes: curriculum.value.durationMinutes
      })

      // 강의 추가
      for (const lesson of curriculum.value.lessons) {
        await curriculumApiService.addLectureToCurriculum(curriculumResponse.id, {
          lectureId: lesson.id,
          isRequired: false
        })
      }

      success.value = MESSAGES.SUCCESS.CURRICULUM_CREATED
    }

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
onMounted(async () => {
  // URL 쿼리 파라미터 확인
  const editId = route.query.edit
  const mode = route.query.mode

  if (mode === 'edit' && editId) {
    isEditMode.value = true
    editCurriculumId.value = Number(editId)

    // 기존 커리큘럼 데이터 로드
    await loadExistingCurriculum(Number(editId))
  }

  // 강의 목록 로드
  loadAllLectures()
  loadMyLectures()
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