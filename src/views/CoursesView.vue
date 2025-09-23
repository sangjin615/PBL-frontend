<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div class="bg-figma-1 border-b" style="border-color: rgb(var(--figma-color-4))">
      <div class="px-6 py-6">
        <div>
          <h1 class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">수강 목록</h1>
          <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">내가 수강 중인 강의들을 확인하세요</p>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="px-6 py-8">
      <!-- 통계 섹션 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" style="color: rgb(var(--figma-color-5))">전체 강의</p>
              <p class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ enrolledCourses.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--figma-color-7))">
              <svg class="w-6 h-6" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" style="color: rgb(var(--figma-color-5))">완료한 강의</p>
              <p class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ completedCourses.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--figma-color-7))">
              <svg class="w-6 h-6" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" style="color: rgb(var(--figma-color-5))">진행 중</p>
              <p class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ inProgressCourses.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--figma-color-7))">
              <svg class="w-6 h-6" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" style="color: rgb(var(--figma-color-5))">평균 진행률</p>
              <p class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ averageProgress }}%</p>
            </div>
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: rgb(var(--figma-color-7))">
              <svg class="w-6 h-6" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 필터 및 정렬 -->
      <div class="bg-figma-1 rounded-lg border p-6 mb-8" style="border-color: rgb(var(--figma-color-4))">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 탭 네비게이션 -->
          <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
              :class="activeTab === tab.id
                ? 'bg-white text-figma-2 shadow-sm'
                : 'text-figma-5 hover:text-figma-2'"
            >
              {{ tab.name }}
            </button>
          </div>

          <!-- 정렬 옵션 -->
          <div class="flex items-center space-x-4">
            <select
              v-model="sortBy"
              class="px-3 py-2 border rounded-lg text-sm"
              style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))"
            >
              <option value="recent">최근 수강순</option>
              <option value="progress">진행률순</option>
              <option value="title">제목순</option>
              <option value="recommended">추천순</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 강의 목록 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="bg-figma-1 rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          style="border-color: rgb(var(--figma-color-4))"
          @click="goToCourse(course.id)"
        >
          <!-- 썸네일 -->
          <div class="aspect-video bg-gray-200 flex items-center justify-center">
            <div class="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>

          <!-- 강의 정보 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs px-2 py-1 rounded-full" style="background-color: rgb(var(--figma-color-7)); color: rgb(var(--figma-color-6))">
                {{ course.category }}
              </span>
              <span class="text-xs" style="color: rgb(var(--figma-color-5))">{{ course.type === 'curriculum' ? '커리큘럼' : '강의물' }}</span>
            </div>

            <h3 class="font-semibold text-sm mb-2 line-clamp-2" style="color: rgb(var(--figma-color-2))">
              {{ course.title }}
            </h3>

            <p class="text-xs mb-3" style="color: rgb(var(--figma-color-5))">{{ course.instructor }}</p>

            <!-- 진행률 바 -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-xs mb-1">
                <span style="color: rgb(var(--figma-color-5))">진행률</span>
                <span style="color: rgb(var(--figma-color-2))">{{ course.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  style="background-color: rgb(var(--figma-color-6)); width: {{ course.progress }}%"
                ></div>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <button
              class="w-full py-2 text-xs font-medium rounded-lg text-white hover:opacity-90 transition-colors"
              style="background-color: rgb(var(--figma-color-6))"
              @click.stop="goToCourse(course.id)"
            >
              이어서 학습하기
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-if="filteredCourses.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2" style="color: rgb(var(--figma-color-2))">수강 중인 강의가 없습니다</h3>
        <p class="text-sm" style="color: rgb(var(--figma-color-5))">새로운 강의를 수강해보세요!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 탭 상태
const activeTab = ref('all');
const sortBy = ref('recent');

// 탭 옵션
const tabs = ref([
  { id: 'all', name: '전체' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'course', name: '강의물' }
]);

// 수강 중인 강의 데이터
const enrolledCourses = ref([
  {
    id: 'course_1',
    title: 'Introduction To Algorithms',
    instructor: '김유희',
    category: '알고리즘',
    type: 'curriculum',
    progress: 75,
    rating: 5.0,
    enrolledAt: '2025-01-15'
  },
  {
    id: 'course_2',
    title: '웹 기초: HTML/CSS',
    instructor: '이서준',
    category: '웹',
    type: 'curriculum',
    progress: 45,
    rating: 4.7,
    enrolledAt: '2025-01-10'
  },
  {
    id: 'course_3',
    title: 'Python 자료구조',
    instructor: '박가은',
    category: '개발·프로그래밍',
    type: 'curriculum',
    progress: 90,
    rating: 4.9,
    enrolledAt: '2025-01-05'
  },
  {
    id: 'course_4',
    title: '게임 개발 입문 with Unity',
    instructor: '최민수',
    category: '게임 개발',
    type: 'curriculum',
    progress: 30,
    rating: 4.6,
    enrolledAt: '2025-01-20'
  },
  {
    id: 'course_5',
    title: 'SQL로 하는 데이터 질의',
    instructor: '정은지',
    category: '데이터베이스',
    type: 'curriculum',
    progress: 100,
    rating: 4.8,
    enrolledAt: '2025-01-01'
  },
  {
    id: 'course_6',
    title: '인공지능 개요',
    instructor: '오지후',
    category: '인공지능',
    type: 'curriculum',
    progress: 60,
    rating: 4.5,
    enrolledAt: '2025-01-12'
  },
  {
    id: 'course_7',
    title: 'React 기초 강의',
    instructor: '김민수',
    category: '웹',
    type: 'course',
    progress: 85,
    rating: 4.8,
    enrolledAt: '2025-01-08'
  },
  {
    id: 'course_8',
    title: 'Node.js 서버 개발',
    instructor: '이지은',
    category: '개발·프로그래밍',
    type: 'course',
    progress: 40,
    rating: 4.7,
    enrolledAt: '2025-01-18'
  }
]);

// 완료한 강의
const completedCourses = computed(() => 
  enrolledCourses.value.filter(course => course.progress === 100)
);

// 진행 중인 강의
const inProgressCourses = computed(() => 
  enrolledCourses.value.filter(course => course.progress > 0 && course.progress < 100)
);

// 평균 진행률
const averageProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0;
  const total = enrolledCourses.value.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(total / enrolledCourses.value.length);
});

// 필터링된 강의 목록
const filteredCourses = computed(() => {
  let filtered = enrolledCourses.value;

  // 탭별 필터링
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(course => course.type === activeTab.value);
  }

  // 정렬
  switch (sortBy.value) {
    case 'recent':
      filtered = [...filtered].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());
      break;
    case 'progress':
      filtered = [...filtered].sort((a, b) => b.progress - a.progress);
      break;
    case 'title':
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'recommended':
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      break;
  }

  return filtered;
});

// 강의로 이동 (이미 수강신청된 상태이므로 바로 학습 페이지로)
function goToCourse(courseId: string) {
  const course = enrolledCourses.value.find(c => c.id === courseId);
  if (course?.type === 'curriculum') {
    // 커리큘럼인 경우 커리큘럼 상세 페이지로 이동
    router.push({ name: 'curriculum-detail', params: { id: courseId } });
  } else {
    // 개별 강의인 경우 학습 페이지로 이동
    router.push({ name: 'learning', params: { lessonId: courseId } });
  }
}
</script>
