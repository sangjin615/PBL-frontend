<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 사용자 프로필 섹션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-6">
        <div class="flex items-center space-x-4">
          <!-- 프로필 사진 -->
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          
          <!-- 사용자 정보 -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ userInfo.name }}</h1>
            <p class="text-gray-600">{{ userInfo.handle }}</p>
            <p class="text-sm text-gray-500">구독자 {{ userInfo.subscribers }}</p>
          </div>
          
          <!-- 채널 관리 버튼 -->
          <button class="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
            <span>채널 관리</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="bg-white border-b">
      <div class="px-8">
        <div class="flex items-center justify-between">
          <div class="flex space-x-8">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- 검색 아이콘 -->
            <button class="p-2 text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            <!-- 만들기 버튼 -->
            <button class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              + 만들기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">정렬:</span>
            <select v-model="sortBy" class="text-sm border-0 bg-transparent text-gray-700 focus:ring-0">
              <option value="recommended">추천순</option>
              <option value="recent">최신순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 강의 카드 그리드 -->
    <div class="px-8 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="item in filteredItems" 
          :key="item.id" 
          @click="handleItemClick(item)"
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
        >
          <!-- 강의 썸네일 -->
          <div 
            class="h-48 rounded-t-lg flex items-center justify-center text-4xl font-bold text-white relative"
            :style="{ backgroundColor: item.thumbnailColor }"
          >
            X
            <!-- 타입 배지 -->
            <div 
              class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
              :class="item.type === 'curriculum' 
                ? 'bg-blue-100 text-blue-800' 
                : (item as any).format === '문제'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'"
            >
              {{ item.type === 'curriculum' ? '커리큘럼' : (item as any).format || '강의물' }}
            </div>
          </div>
          
          <!-- 강의 정보 -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-2">만든 날짜: {{ item.createdDate }}</p>
            
            <!-- 커리큘럼 정보 -->
            <div v-if="item.type === 'curriculum'" class="space-y-2">
              <div class="space-y-1">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  {{ (item as any).courseCount || 0 }}개 강의
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ item.duration }}
                </div>
              </div>
              <!-- 태그 -->
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <!-- 강의물 정보 -->
            <div v-else class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ item.duration }}
              </div>
              <!-- 태그 -->
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <!-- 비공개 상태 -->
            <div class="flex items-center text-sm text-gray-500 mt-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
              </svg>
              {{ item.privacy }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 더보기 버튼 -->
      <div class="flex justify-center mt-8">
        <button class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          더보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 사용자 정보
const userInfo = ref({
  name: '김준성',
  handle: '@대학원에 갈거에요',
  subscribers: '8.71천명'
});

// 탭 데이터
const tabs = ref([
  { id: 'all', name: '전체' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'materials', name: '강의물' }
]);

const activeTab = ref('all');
const sortBy = ref('recommended');

// 커리큘럼 데이터 (여러 강의의 집합체)
const curricula = ref([
  {
    id: 1,
    title: '[2025] 웹 개발 완전정복',
    createdDate: '2025.09.01',
    privacy: '비공개',
    thumbnailColor: '#FFE4E1',
    type: 'curriculum',
    courseCount: 12,
    duration: '48시간',
    tags: ['#웹개발', '#풀스택', '#프론트엔드', '#백엔드']
  },
  {
    id: 2,
    title: '[2025] 데이터 사이언스 마스터',
    createdDate: '2025.08.28',
    privacy: '비공개',
    thumbnailColor: '#FFE4B5',
    type: 'curriculum',
    courseCount: 8,
    duration: '32시간',
    tags: ['#데이터사이언스', '#파이썬', '#머신러닝', '#분석']
  },
  {
    id: 3,
    title: '[2025] 모바일 앱 개발 전문가',
    createdDate: '2025.08.25',
    privacy: '비공개',
    thumbnailColor: '#F0FFF0',
    type: 'curriculum',
    courseCount: 15,
    duration: '60시간',
    tags: ['#모바일', '#ReactNative', '#Flutter', '#앱개발']
  },
  {
    id: 4,
    title: '[2025] AI/ML 기초부터 실전까지',
    createdDate: '2025.08.20',
    privacy: '비공개',
    thumbnailColor: '#E0FFFF',
    type: 'curriculum',
    courseCount: 10,
    duration: '40시간',
    tags: ['#AI', '#머신러닝', '#딥러닝', '#파이썬']
  }
]);

// 강의물 데이터 (개별 강의)
const materials = ref([
  {
    id: 5,
    title: '[2025] HTML5 기초 강의',
    createdDate: '2025.08.15',
    privacy: '비공개',
    thumbnailColor: '#F5F5F5',
    type: 'material',
    duration: '3시간 30분',
    tags: ['#HTML5', '#웹개발', '#기초'],
    format: '마크다운'
  },
  {
    id: 6,
    title: '[2025] CSS Flexbox 완벽 가이드',
    createdDate: '2025.08.10',
    privacy: '비공개',
    thumbnailColor: '#F5F5F5',
    type: 'material',
    duration: '2시간 45분',
    tags: ['#CSS', '#Flexbox', '#레이아웃'],
    format: '마크다운'
  },
  {
    id: 7,
    title: '[2025] JavaScript ES6+ 문법',
    createdDate: '2025.08.05',
    privacy: '비공개',
    thumbnailColor: '#F5F5F5',
    type: 'material',
    duration: '4시간 15분',
    tags: ['#JavaScript', '#ES6', '#프로그래밍'],
    format: '마크다운'
  },
  {
    id: 8,
    title: '[2025] React Hooks 심화',
    createdDate: '2025.08.01',
    privacy: '비공개',
    thumbnailColor: '#F5F5F5',
    type: 'material',
    duration: '3시간 20분',
    tags: ['#React', '#Hooks', '#프론트엔드'],
    format: '마크다운'
  }
]);

// 발행된 강의 데이터 (localStorage에서 불러옴)
const publishedCourses = ref([]);

// localStorage에서 발행된 강의 불러오기
function loadPublishedCourses() {
  const storedCourses = JSON.parse(localStorage.getItem('instructorCourses') || '[]');
  if (storedCourses.length > 0) {
    // 발행된 강의를 강의물 형태로 변환
    publishedCourses.value = storedCourses.map((course: any) => ({
      id: course.id,
      title: course.title,
      createdDate: new Date(course.createdAt).toLocaleDateString('ko-KR'),
      privacy: '공개',
      thumbnailColor: course.format === '문제' ? '#E3F2FD' : '#E8F5E8',
      type: 'material',
      duration: '미정',
      tags: [course.category, course.format],
      format: course.format,
      status: course.status
    }));
  }
}

// 필터링된 데이터
const filteredItems = computed(() => {
  const allItems = [...curricula.value, ...materials.value, ...publishedCourses.value];
  
  switch (activeTab.value) {
    case 'curriculum':
      return curricula.value;
    case 'materials':
      return [...materials.value, ...publishedCourses.value];
    case 'all':
    default:
      return allItems;
  }
});

// 아이템 클릭 핸들러
function handleItemClick(item: any) {
  if (item.type === 'curriculum') {
    // 커리큘럼 클릭 시 커리큘럼 개요 페이지로 이동 (강의자 모드)
    router.push({ 
      name: 'curriculum-overview', 
      params: { id: `course_${item.id}` },
      query: { mode: 'instructor' } // 강의자 모드 표시
    });
  } else {
    // 강의물 클릭 시 강의 수정 페이지로 이동
    if (item.format === '문제') {
      router.push({ 
        name: 'instructor-create-problem',
        query: { edit: item.id, mode: 'edit' }
      });
    } else {
      router.push({ 
        name: 'instructor-create-markdown',
        query: { edit: item.id, mode: 'edit' }
      });
    }
  }
}

// 컴포넌트 마운트 시 발행된 강의 로드
onMounted(() => {
  loadPublishedCourses();
});
</script>
