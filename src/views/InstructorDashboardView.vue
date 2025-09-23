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
            <h1 class="text-lg font-semibold">강의자 대시보드</h1>
            <p class="text-sm text-gray-600">강의 관리 및 통계</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="createCourse"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 새 강의 만들기
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="p-6">
      <!-- 통계 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">총 강의 수</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCourses }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">총 수강생</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">평균 평점</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.averageRating }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">완료한 강의</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.completedCourses }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 강의 목록 -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">내 강의</h2>
            <div class="flex space-x-2">
              <select class="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>전체</option>
                <option>발행됨</option>
                <option>임시저장</option>
                <option>비공개</option>
              </select>
              <input 
                type="text" 
                placeholder="강의 검색..."
                class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강의</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수강생</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ course.title }}</div>
                      <div class="text-sm text-gray-500">{{ course.category }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      course.status === 'published' ? 'bg-green-100 text-green-800' :
                      course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ getStatusText(course.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ course.students }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <span class="mr-1">{{ course.rating }}</span>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editCourse(course.id)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      편집
                    </button>
                    <button 
                      @click="viewAnalytics(course.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      분석
                    </button>
                    <button 
                      @click="deleteCourse(course.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 통계 데이터
const stats = reactive({
  totalCourses: 12,
  totalStudents: 1247,
  averageRating: 4.8,
  completedCourses: 8
})

// 강의 목록 데이터
const courses = ref([
  {
    id: 1,
    title: 'Introduction To Algorithms',
    category: '알고리즘',
    status: 'published',
    students: 324,
    rating: 4.9
  },
  {
    id: 2,
    title: 'Flutter 3.0 앱 개발',
    category: '모바일',
    status: 'published',
    students: 156,
    rating: 4.7
  },
  {
    id: 3,
    title: 'React 기초부터 실전까지',
    category: '웹개발',
    status: 'draft',
    students: 0,
    rating: 0
  },
  {
    id: 4,
    title: 'Python 데이터 분석',
    category: '데이터사이언스',
    status: 'published',
    students: 89,
    rating: 4.6
  }
])

// 유틸리티 함수들

function getStatusText(status: string): string {
  switch (status) {
    case 'published': return '발행됨'
    case 'draft': return '임시저장'
    case 'private': return '비공개'
    default: return '알 수 없음'
  }
}

// 액션 함수들
function goBack() {
  router.back()
}

function createCourse() {
  router.push({ name: 'instructor-create-course' })
}

function editCourse(courseId: number) {
  // 강의 편집 페이지로 이동 (구현 예정)
  alert(`강의 ${courseId} 편집 기능은 구현 예정입니다.`)
}

function viewAnalytics(courseId: number) {
  // 강의 분석 페이지로 이동 (구현 예정)
  alert(`강의 ${courseId} 분석 기능은 구현 예정입니다.`)
}

function deleteCourse(courseId: number) {
  if (confirm('정말로 이 강의를 삭제하시겠습니까?')) {
    // 강의 삭제 로직
    const index = courses.value.findIndex(c => c.id === courseId)
    if (index > -1) {
      courses.value.splice(index, 1)
      stats.totalCourses--
    }
  }
}
</script>
