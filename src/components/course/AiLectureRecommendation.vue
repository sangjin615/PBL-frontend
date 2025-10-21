<template>
  <div class="bg-white border-t border-gray-200 p-4">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">AI 맞춤형 강의 추천</h3>
      <div class="flex items-center space-x-2">
        <button 
          @click="scrollLeft" 
          class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          :disabled="currentIndex === 0"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button 
          @click="scrollRight" 
          class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          :disabled="currentIndex >= maxIndex"
        >
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 강의 추천 카드들 -->
    <div class="relative overflow-hidden">
      <div 
        ref="carouselContainer"
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * cardWidth}px)` }"
      >
        <div 
          v-for="(lecture, index) in recommendedLectures" 
          :key="lecture.id"
          class="flex-shrink-0 mr-4"
          :style="{ width: `${cardWidth}px` }"
        >
          <div 
            class="h-32 rounded-lg cursor-pointer transition-transform hover:scale-105"
            :class="getCardStyle(lecture)"
            @click="goToLecture(lecture)"
          >
            <div class="h-full flex flex-col justify-center items-center text-white p-4">
              <!-- 카드 내용 -->
              <div class="text-center">
                <div class="text-lg font-bold">{{ lecture.title }}</div>
              </div>
            </div>
          </div>
          
          <!-- 카드 하단 설명 -->
          <div class="mt-2 text-center">
            <div class="text-xs text-gray-500">{{ lecture.category }} · {{ lecture.difficulty }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 프로그레스 바 -->
    <div class="mt-4 flex items-center justify-center">
      <div class="flex items-center space-x-2">
        <button 
          @click="scrollLeft" 
          class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          :disabled="currentIndex === 0"
        >
          <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div class="flex space-x-1">
          <div 
            v-for="(_, index) in totalPages" 
            :key="index"
            class="w-2 h-2 rounded-full transition-colors"
            :class="index === currentPage ? 'bg-gray-600' : 'bg-gray-300'"
          ></div>
        </div>
        
        <button 
          @click="scrollRight" 
          class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
          :disabled="currentIndex >= maxIndex"
        >
          <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Lecture } from '@/types/lecture'
import { lectureApiService } from '@/services/lectureApi'

const router = useRouter()

// 반응형 데이터
const recommendedLectures = ref<Lecture[]>([])
const currentIndex = ref(0)
const cardWidth = ref(200) // 카드 너비
const carouselContainer = ref<HTMLElement | null>(null)

// 계산된 속성
const maxIndex = computed(() => Math.max(0, recommendedLectures.value.length - 1))
const totalPages = computed(() => Math.ceil(recommendedLectures.value.length / 3)) // 한 페이지에 3개씩 표시
const currentPage = computed(() => Math.floor(currentIndex.value / 3))

// 카드 스타일 생성 (이미지와 유사한 그라데이션)
const getCardStyle = (lecture: Lecture) => {
  const styles = [
    'bg-gradient-to-br from-purple-500 to-pink-500', // 좋아요 표시한 음악 자동 재생목록 스타일
    'bg-gradient-to-br from-green-600 to-green-800', // Archive 스타일
    'bg-gradient-to-r from-blue-500 to-blue-300', // Disco Mix 스타일
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-teal-500 to-blue-500'
  ]
  
  // 강의 ID를 기반으로 일관된 스타일 할당
  return styles[lecture.id % styles.length]
}

// 스크롤 함수들
const scrollLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const scrollRight = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

// 강의로 이동
const goToLecture = (lecture: Lecture) => {
  router.push({
    name: 'lecture',
    params: { lectureId: lecture.id }
  })
}

// AI 추천 강의 로드
const loadRecommendedLectures = async () => {
  try {
    // 현재는 최근 강의들을 가져오지만, 실제로는 AI 추천 API를 호출해야 함
    const lectures = await lectureApiService.getRecentLectures()
    
    // 최대 6개까지만 표시
    recommendedLectures.value = lectures.slice(0, 6)
    
    // 강의가 없으면 더미 데이터 추가
    if (recommendedLectures.value.length === 0) {
      recommendedLectures.value = [
        {
          id: 1,
          title: '피보나치 함수',
          description: 'N번째 피보나치 수를 구하는 함수 구현',
          category: '알고리즘',
          difficulty: '실버',
          durationMinutes: 30,
          type: 'PROBLEM' as any,
          content: '',
          isPublic: true,
          testCaseCount: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: { id: 1, username: 'admin', loginId: 'admin' }
        },
        {
          id: 2,
          title: '어린 왕자',
          description: '어린 왕자의 은하수 여행 경로 최적화',
          category: '알고리즘',
          difficulty: '실버',
          durationMinutes: 45,
          type: 'PROBLEM' as any,
          content: '',
          isPublic: true,
          testCaseCount: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: { id: 1, username: 'admin', loginId: 'admin' }
        },
        {
          id: 3,
          title: 'ACM Craft',
          description: '건물 건설 순서와 시간 최적화',
          category: '알고리즘',
          difficulty: '골드',
          durationMinutes: 60,
          type: 'PROBLEM' as any,
          content: '',
          isPublic: true,
          testCaseCount: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: { id: 1, username: 'admin', loginId: 'admin' }
        }
      ]
    }
  } catch (error) {
    console.error('추천 강의 로드 실패:', error)
    // 에러 시 더미 데이터 사용
    recommendedLectures.value = [
      {
        id: 1,
        title: '피보나치 함수',
        description: 'N번째 피보나치 수를 구하는 함수 구현',
        category: '알고리즘',
        difficulty: '실버',
        durationMinutes: 30,
        type: 'PROBLEM' as any,
        content: '',
        isPublic: true,
        testCaseCount: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: { id: 1, username: 'admin', loginId: 'admin' }
      }
    ]
  }
}

// 키보드 이벤트 처리
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    scrollLeft()
  } else if (event.key === 'ArrowRight') {
    scrollRight()
  }
}

// 컴포넌트 마운트
onMounted(() => {
  loadRecommendedLectures()
  window.addEventListener('keydown', handleKeydown)
})

// 컴포넌트 언마운트
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 여기에 작성 */
</style>
