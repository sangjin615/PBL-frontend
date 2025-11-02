<template>
  <div class="bg-white border-t border-gray-200 p-4">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <h3 class="text-lg font-semibold text-gray-900">AI 맞춤형 강의 추천</h3>
        <p class="text-sm text-gray-500">현재 강의와 비슷한 강의를 추천해드립니다</p>
      </div>
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
            <div class="h-full flex flex-col justify-center items-center text-white p-4 overflow-hidden">
              <!-- 카드 내용 -->
              <div class="text-center w-full px-2">
                <div 
                  class="text-base font-bold line-clamp-3 break-words leading-tight"
                  :title="getDisplayTitle(lecture)"
                  style="min-height: 3rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;"
                >
                  {{ getDisplayTitle(lecture) }}
                </div>
              </div>
            </div>
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
import { useRouter, useRoute } from 'vue-router'
import type { Lecture } from '@/types/lecture'
import { lectureApiService } from '@/services/lectureApi'

interface Props {
  lectureId?: number // 선택적 prop: 현재 강의 ID
}

const props = withDefaults(defineProps<Props>(), {
  lectureId: undefined
})

const router = useRouter()
const route = useRoute()

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

// 표시할 제목 가져오기 (실제 강의 제목만 표시)
const getDisplayTitle = (lecture: Lecture): string => {
  const category = lecture.category || ''
  const difficulty = lecture.difficulty || ''
  
  // "알고리즘 다이아몬드" 형식의 패턴들을 모두 정의
  const difficultyLevels = ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '루비', '마스터', '미등급']
  const categories = ['알고리즘', '웹', '데이터베이스', '인공지능', '게임 개발', '개발·프로그래밍']
  
  // 모든 가능한 패턴 조합 생성
  const patterns: string[] = []
  
  // category + difficulty 조합
  if (category && difficulty) {
    patterns.push(`${category} ${difficulty}`)
    patterns.push(`${category}·${difficulty}`)
    patterns.push(`${category} · ${difficulty}`)
    patterns.push(`${category}-${difficulty}`)
    patterns.push(`${category} - ${difficulty}`)
  }
  
  // 알고리즘 + 난이도 조합
  difficultyLevels.forEach(level => {
    patterns.push(`알고리즘 ${level}`)
    patterns.push(`알고리즘·${level}`)
    patterns.push(`알고리즘 · ${level}`)
  })
  
  // 단독 카테고리나 난이도
  if (category) patterns.push(category)
  if (difficulty) patterns.push(difficulty)
  categories.forEach(cat => patterns.push(cat))
  difficultyLevels.forEach(level => patterns.push(level))
  
  // title이 있는 경우
  if (lecture.title && lecture.title.trim() !== '') {
    const title = lecture.title.trim()
    const titleLower = title.toLowerCase()
    
    // 패턴과 정확히 일치하거나 포함되는지 확인
    const isPattern = patterns.some(pattern => {
      const patternLower = pattern.toLowerCase()
      return title === pattern || 
             titleLower === patternLower ||
             title === pattern.replace(/\s+/g, ' ') ||
             (title.length <= 20 && (
               titleLower.includes(patternLower) && 
               (titleLower === patternLower || titleLower.split(' ').length <= 3)
             ))
    })
    
    // 패턴이 아니면 실제 제목으로 사용
    if (!isPattern) {
      return title
    }
  }
  
  // title이 패턴이거나 없으면 description 확인
  if (lecture.description && lecture.description.trim() !== '') {
    const desc = lecture.description.trim()
    const descLower = desc.toLowerCase()
    
    // description도 패턴인지 확인
    const isDescPattern = patterns.some(pattern => {
      const patternLower = pattern.toLowerCase()
      return desc === pattern || 
             descLower === patternLower ||
             (desc.length <= 20 && descLower.includes(patternLower))
    })
    
    // description이 패턴이 아니고 충분히 긴 경우만 사용
    if (!isDescPattern && desc.length > 5) {
      return desc
    }
  }
  
  // 둘 다 패턴이거나 없으면 기본 메시지
  return '제목 없음'
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
    let lectures: Lecture[] = []
    
    // 문제 결과 페이지에서 사용하는 경우: 현재 문제와 비슷한 강의 추천
    if (props.lectureId || route.params.problemId) {
      const currentLectureId = props.lectureId || Number(route.params.problemId)
      
      if (currentLectureId) {
        try {
          // 현재 강의 정보 가져오기
          const currentLecture = await lectureApiService.getLecture(currentLectureId)
          
          // 같은 카테고리와 난이도의 강의 검색 (현재 강의 제외)
          const similarLecturesResponse = await lectureApiService.searchPublicLectures({
            category: currentLecture.category,
            difficulty: currentLecture.difficulty,
            type: currentLecture.type
          })
          
          // 응답이 배열인지 확인하고 배열로 변환
          const similarLectures = Array.isArray(similarLecturesResponse) 
            ? similarLecturesResponse 
            : (similarLecturesResponse?.lectures || [])
          
          // 현재 강의와 다른 강의들만 필터링
          lectures = similarLectures
            .filter(lecture => lecture.id !== currentLectureId)
            .slice(0, 6)
          
          console.log('[강의 추천] 비슷한 강의 찾음:', lectures.length, '개')
          console.log('[강의 추천] 강의 데이터:', lectures.map(l => ({ id: l.id, title: l.title })))
        } catch (error) {
          console.error('[강의 추천] 현재 강의 정보 가져오기 실패:', error)
          // 실패 시 최근 강의 사용
          lectures = await lectureApiService.getRecentLectures()
        }
      }
    }
    
    // 비슷한 강의가 없거나 문제 결과 페이지가 아닌 경우 최근 강의 사용
    if (lectures.length === 0) {
      lectures = await lectureApiService.getRecentLectures()
      console.log('[강의 추천] 최근 강의 사용:', lectures.length, '개')
      console.log('[강의 추천] 최근 강의 데이터:', lectures.map(l => ({ id: l.id, title: l.title })))
    }
    
    // 최대 6개까지만 표시
    recommendedLectures.value = lectures.slice(0, 6)
    
    // API 응답의 title이 패턴인 경우 description으로 대체
    recommendedLectures.value = recommendedLectures.value.map(lecture => {
      const category = lecture.category || ''
      const difficulty = lecture.difficulty || ''
      const title = lecture.title?.trim() || ''
      
      // title이 category + difficulty 패턴인지 확인
      const isPattern = (
        title === `${category} ${difficulty}` ||
        title === `${category}·${difficulty}` ||
        title === `${category} · ${difficulty}` ||
        title === category ||
        title === difficulty ||
        (title.includes('알고리즘') && (title.includes('다이아몬드') || title.includes('브론즈') || title.includes('실버') || title.includes('골드')))
      )
      
      // 패턴이면 description을 title로 사용 (description이 있는 경우)
      if (isPattern && lecture.description && lecture.description.trim() !== '') {
        return {
          ...lecture,
          title: lecture.description.trim()
        }
      }
      
      return lecture
    })
    
    // 데이터 확인 로그 (디버깅용)
    console.log('[강의 추천] 최종 추천 강의:', recommendedLectures.value.map(l => ({ 
      id: l.id, 
      originalTitle: lectures.find(lec => lec.id === l.id)?.title,
      title: l.title,
      category: l.category,
      difficulty: l.difficulty,
      description: l.description,
      displayTitle: getDisplayTitle(l),
      fullData: l
    })))
    
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
