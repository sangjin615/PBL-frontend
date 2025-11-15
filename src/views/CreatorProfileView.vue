<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 크리에이터 프로필 헤더 -->
    <div class="bg-white border-b">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 뒤로가기 버튼 -->
            <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- 프로필 사진 -->
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
              :style="{ backgroundColor: creator?.avatarColor || '#6B7280' }"
            >
              {{ creator?.name?.charAt(0) || '?' }}
            </div>

            <!-- 크리에이터 정보 -->
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900">
                {{ creator?.name || '로딩 중...' }}
              </h1>
              <p class="text-gray-600">{{ creator?.handle || '' }}</p>
              <p class="text-sm text-gray-500">
                구독자 {{ formatSubs(creator?.subscribers || 0) }}
              </p>
            </div>
          </div>

          <!-- 구독 버튼 -->
          <div class="flex items-center space-x-3">
            <button
              v-if="creator"
              @click="toggleSubscribe"
              class="px-6 py-2 rounded-lg font-medium transition-colors"
              :class="isSubscribed 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'"
            >
              {{ isSubscribed ? '구독 해지' : '구독하기' }}
            </button>
          </div>
        </div>

        <!-- 크리에이터 소개 -->
        <div v-if="creator?.description" class="mt-4">
          <p class="text-gray-700">{{ creator.description }}</p>
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
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
              <span 
                class="px-2 py-1 text-xs rounded-full"
                :class="
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                "
              >
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 정렬 옵션 -->
            <select
              v-model="sortBy"
              class="text-sm border-0 bg-transparent text-gray-700 focus:ring-0"
            >
              <option value="recent">최신순</option>
              <option value="title">제목순</option>
              <option value="popular">인기순</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-gray-600">데이터를 불러오는 중...</div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex justify-center items-center py-12">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div v-else class="px-8 py-8">
      <!-- 강의 탭 -->
      <div v-if="activeTab === 'lectures'">
        <div v-if="lectures.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="lecture in sortedLectures"
            :key="lecture.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            @click="goToLecture(lecture.id)"
          >
            <!-- 강의 썸네일 -->
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>

            <!-- 강의 정보 -->
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ lecture.title }}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ lecture.description }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{{ lecture.category }}</span>
                <span>{{ formatDate(lecture.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <p>아직 등록된 강의가 없습니다.</p>
        </div>
      </div>

      <!-- 커리큘럼 탭 -->
      <div v-else-if="activeTab === 'curriculums'">
        <div v-if="curriculums.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="curriculum in sortedCurriculums"
            :key="curriculum.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            @click="goToCurriculum(curriculum.id)"
          >
            <!-- 커리큘럼 썸네일 -->
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>

            <!-- 커리큘럼 정보 -->
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ curriculum.title }}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ curriculum.description }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>{{ curriculum.totalLectureCount }}개 강의</span>
                <span>{{ formatDate(curriculum.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <p>아직 등록된 커리큘럼이 없습니다.</p>
        </div>
      </div>

      <!-- 통계 탭 -->
      <div v-else-if="activeTab === 'stats'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- 총 강의 수 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">총 강의</p>
                <p class="text-2xl font-semibold text-gray-900">{{ lectures.length }}</p>
              </div>
            </div>
          </div>

          <!-- 총 커리큘럼 수 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">총 커리큘럼</p>
                <p class="text-2xl font-semibold text-gray-900">{{ curriculums.length }}</p>
              </div>
            </div>
          </div>

          <!-- 구독자 수 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">구독자</p>
                <p class="text-2xl font-semibold text-gray-900">{{ formatSubs(creator?.subscribers || 0) }}</p>
              </div>
            </div>
          </div>

          <!-- 총 조회수 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="p-2 bg-orange-100 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">총 조회수</p>
                <p class="text-2xl font-semibold text-gray-900">{{ formatViews(totalViews) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 최근 활동 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div class="flex-1">
                <p class="text-sm text-gray-900">{{ activity.description }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 상태 관리
const creator = ref<any>(null);
const lectures = ref<any[]>([]);
const curriculums = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const activeTab = ref('lectures');
const sortBy = ref('recent');
const isSubscribed = ref(false);

// 탭 설정
const tabs = [
  { id: 'lectures', name: '강의' },
  { id: 'curriculums', name: '커리큘럼' },
  { id: 'stats', name: '통계' }
];

// 정렬된 데이터
const sortedLectures = computed(() => {
  const sorted = [...lectures.value];
  switch (sortBy.value) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'popular':
      return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
});

const sortedCurriculums = computed(() => {
  const sorted = [...curriculums.value];
  switch (sortBy.value) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'popular':
      return sorted.sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
});

// 통계 데이터
const totalViews = computed(() => {
  return lectures.value.reduce((sum, lecture) => sum + (lecture.views || 0), 0);
});

const recentActivities = computed(() => {
  const activities = [];
  
  // 최근 강의
  lectures.value.slice(0, 3).forEach(lecture => {
    activities.push({
      id: `lecture-${lecture.id}`,
      description: `새 강의 "${lecture.title}" 업로드`,
      date: lecture.createdAt
    });
  });
  
  // 최근 커리큘럼
  curriculums.value.slice(0, 2).forEach(curriculum => {
    activities.push({
      id: `curriculum-${curriculum.id}`,
      description: `새 커리큘럼 "${curriculum.title}" 생성`,
      date: curriculum.createdAt
    });
  });
  
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
});

// 탭별 개수
function getTabCount(tabId: string) {
  switch (tabId) {
    case 'lectures':
      return lectures.value.length;
    case 'curriculums':
      return curriculums.value.length;
    case 'stats':
      return '';
    default:
      return 0;
  }
}

// 크리에이터별 데이터 생성 함수
function getCreatorData(creatorId: number) {
  const creatorProfiles: Record<number, any> = {
    101: {
      creator: {
        id: 101,
        name: '코드팩토리',
        handle: '@codefactory',
        avatarColor: '#4F46E5',
        subscribers: 124000,
        description: '실무 중심의 프로그래밍 강좌를 제공합니다. 초보자부터 고급자까지 모두를 위한 콘텐츠를 만들고 있습니다.'
      },
      lectures: [
        { id: 1, title: 'Vue.js 완벽 가이드', description: 'Vue.js의 모든 기능을 배우는 완벽한 강의입니다.', category: '프론트엔드', createdAt: '2024-01-15', views: 15000 },
        { id: 2, title: 'React 기초부터 실전까지', description: 'React를 처음 배우는 분들을 위한 기초 강의입니다.', category: '프론트엔드', createdAt: '2024-01-10', views: 12000 },
        { id: 3, title: 'Node.js 백엔드 개발', description: 'Node.js를 사용한 백엔드 개발 강의입니다.', category: '백엔드', createdAt: '2024-01-05', views: 8000 }
      ],
      curriculums: [
        { id: 1, title: '풀스택 웹 개발 마스터', description: '프론트엔드부터 백엔드까지 모든 것을 배우는 완전한 커리큘럼입니다.', totalLectureCount: 25, createdAt: '2024-01-20', studentCount: 500 },
        { id: 2, title: 'JavaScript 기초 완성', description: 'JavaScript의 기초를 탄탄히 다지는 커리큘럼입니다.', totalLectureCount: 15, createdAt: '2024-01-12', studentCount: 300 }
      ]
    },
    102: {
      creator: {
        id: 102,
        name: '데이터스미스',
        handle: '@datasmith',
        avatarColor: '#059669',
        subscribers: 88000,
        description: '데이터 분석과 머신러닝 입문부터 고급까지. 실무에서 바로 써먹을 수 있는 데이터 사이언스 강의를 제공합니다.'
      },
      lectures: [
        { id: 1, title: 'Python 데이터 분석 기초', description: 'Pandas와 NumPy를 활용한 데이터 분석 입문', category: '데이터사이언스', createdAt: '2024-01-18', views: 22000 },
        { id: 2, title: '머신러닝 실전 프로젝트', description: 'Scikit-learn으로 만드는 머신러닝 모델', category: '머신러닝', createdAt: '2024-01-12', views: 18000 },
        { id: 3, title: '딥러닝과 TensorFlow', description: 'TensorFlow를 사용한 딥러닝 모델 구축', category: '딥러닝', createdAt: '2024-01-08', views: 15000 },
        { id: 4, title: '데이터 시각화 마스터', description: 'Matplotlib과 Seaborn으로 만드는 인포그래픽', category: '데이터시각화', createdAt: '2024-01-03', views: 12000 }
      ],
      curriculums: [
        { id: 1, title: '데이터 사이언스 완전정복', description: '데이터 분석부터 머신러닝까지 한 번에', totalLectureCount: 30, createdAt: '2024-01-20', studentCount: 800 },
        { id: 2, title: 'Python 데이터 분석 입문', description: 'Python으로 시작하는 데이터 분석', totalLectureCount: 20, createdAt: '2024-01-15', studentCount: 600 }
      ]
    },
    103: {
      creator: {
        id: 103,
        name: '프론트엔드캠프',
        handle: '@fecamp',
        avatarColor: '#F59E0B',
        subscribers: 56000,
        description: '모던 프론트엔드 개발 실전 프로젝트. 최신 기술 스택으로 현업 수준의 웹 애플리케이션을 만드는 방법을 알려드립니다.'
      },
      lectures: [
        { id: 1, title: 'Next.js 14 완전정복', description: 'App Router와 Server Components 마스터', category: '프론트엔드', createdAt: '2024-01-16', views: 18000 },
        { id: 2, title: 'TypeScript 실전 활용', description: '타입 안전한 코드 작성하기', category: '프론트엔드', createdAt: '2024-01-11', views: 16000 },
        { id: 3, title: 'Tailwind CSS 마스터', description: '유틸리티 퍼스트 CSS 프레임워크', category: 'CSS', createdAt: '2024-01-07', views: 14000 }
      ],
      curriculums: [
        { id: 1, title: '모던 프론트엔드 개발자', description: 'React, Next.js, TypeScript로 만드는 현대적 웹앱', totalLectureCount: 35, createdAt: '2024-01-22', studentCount: 450 },
        { id: 2, title: '반응형 웹 디자인', description: '모든 기기에서 완벽한 웹사이트 만들기', totalLectureCount: 18, createdAt: '2024-01-18', studentCount: 320 }
      ]
    },
    104: {
      creator: {
        id: 104,
        name: '알고리즘랩',
        handle: '@algolab',
        avatarColor: '#DC2626',
        subscribers: 42000,
        description: '자료구조/알고리즘 문제풀이와 해설. 코딩 테스트와 기술 면접을 위한 체계적인 알고리즘 학습을 제공합니다.'
      },
      lectures: [
        { id: 1, title: '그래프 알고리즘 완전정복', description: 'DFS, BFS, 최단경로 알고리즘 마스터', category: '알고리즘', createdAt: '2024-01-14', views: 25000 },
        { id: 2, title: '동적 프로그래밍 심화', description: 'DP 문제 해결 패턴과 최적화 기법', category: '알고리즘', createdAt: '2024-01-09', views: 20000 },
        { id: 3, title: '자료구조 구현하기', description: '배열, 리스트, 트리, 해시테이블 직접 구현', category: '자료구조', createdAt: '2024-01-04', views: 18000 }
      ],
      curriculums: [
        { id: 1, title: '코딩 테스트 완전정복', description: '대기업 코딩 테스트 합격을 위한 완벽 가이드', totalLectureCount: 40, createdAt: '2024-01-21', studentCount: 1200 },
        { id: 2, title: '알고리즘 기초부터 고급까지', description: '체계적인 알고리즘 학습 로드맵', totalLectureCount: 25, createdAt: '2024-01-17', studentCount: 800 }
      ]
    },
    105: {
      creator: {
        id: 105,
        name: '백엔드스쿨',
        handle: '@backschool',
        avatarColor: '#2563EB',
        subscribers: 76000,
        description: '스프링/자바/DB 성능 최적화 강좌. 확장 가능하고 안정적인 백엔드 시스템을 구축하는 방법을 알려드립니다.'
      },
      lectures: [
        { id: 1, title: 'Spring Boot 3.0 마스터', description: '최신 Spring Boot로 REST API 구축하기', category: '백엔드', createdAt: '2024-01-17', views: 20000 },
        { id: 2, title: 'JPA와 하이버네이트 심화', description: 'ORM의 모든 것을 배우는 고급 과정', category: '백엔드', createdAt: '2024-01-13', views: 17000 },
        { id: 3, title: 'Redis 캐싱 전략', description: '고성능 캐싱 시스템 구축하기', category: '인프라', createdAt: '2024-01-09', views: 15000 },
        { id: 4, title: 'Docker와 Kubernetes', description: '컨테이너 기반 배포와 오케스트레이션', category: 'DevOps', createdAt: '2024-01-05', views: 13000 }
      ],
      curriculums: [
        { id: 1, title: 'Java 백엔드 개발자', description: 'Spring, JPA, MySQL로 만드는 완전한 백엔드', totalLectureCount: 45, createdAt: '2024-01-23', studentCount: 900 },
        { id: 2, title: '마이크로서비스 아키텍처', description: '확장 가능한 분산 시스템 설계', totalLectureCount: 28, createdAt: '2024-01-19', studentCount: 650 }
      ]
    },
    106: {
      creator: {
        id: 106,
        name: '클라우드연구소',
        handle: '@cloudlab',
        avatarColor: '#0EA5E9',
        subscribers: 91000,
        description: 'AWS, 쿠버네티스, DevOps 자동화. 클라우드 네이티브 애플리케이션 개발과 운영의 모든 것을 다룹니다.'
      },
      lectures: [
        { id: 1, title: 'AWS 클라우드 아키텍처', description: '확장 가능한 클라우드 시스템 설계', category: '클라우드', createdAt: '2024-01-19', views: 28000 },
        { id: 2, title: 'Kubernetes 완전정복', description: '컨테이너 오케스트레이션 마스터', category: 'DevOps', createdAt: '2024-01-15', views: 24000 },
        { id: 3, title: 'Terraform 인프라 코드화', description: 'IaC로 인프라 관리 자동화', category: 'DevOps', createdAt: '2024-01-11', views: 20000 }
      ],
      curriculums: [
        { id: 1, title: '클라우드 엔지니어', description: 'AWS, Docker, K8s로 만드는 클라우드 시스템', totalLectureCount: 50, createdAt: '2024-01-24', studentCount: 1100 },
        { id: 2, title: 'DevOps 실전 프로젝트', description: 'CI/CD 파이프라인 구축과 모니터링', totalLectureCount: 32, createdAt: '2024-01-20', studentCount: 750 }
      ]
    },
    107: {
      creator: {
        id: 107,
        name: 'iOS 마이스터',
        handle: '@iosmeister',
        avatarColor: '#9333EA',
        subscribers: 37000,
        description: 'SwiftUI, Combine 실전 앱 빌드. iOS 개발의 최신 트렌드와 실무 노하우를 전수합니다.'
      },
      lectures: [
        { id: 1, title: 'SwiftUI 완전정복', description: '선언적 UI 프레임워크 마스터', category: 'iOS', createdAt: '2024-01-16', views: 19000 },
        { id: 2, title: 'Combine 비동기 프로그래밍', description: '반응형 프로그래밍 패러다임', category: 'iOS', createdAt: '2024-01-12', views: 16000 },
        { id: 3, title: 'Core Data와 CloudKit', description: '데이터 동기화와 클라우드 저장소', category: 'iOS', createdAt: '2024-01-08', views: 14000 }
      ],
      curriculums: [
        { id: 1, title: 'iOS 앱 개발 마스터', description: 'SwiftUI로 만드는 현대적 iOS 앱', totalLectureCount: 38, createdAt: '2024-01-22', studentCount: 520 },
        { id: 2, title: 'iOS 앱스토어 출시', description: '앱 개발부터 배포까지 완전 가이드', totalLectureCount: 22, createdAt: '2024-01-18', studentCount: 380 }
      ]
    },
    108: {
      creator: {
        id: 108,
        name: '안드로이드노트',
        handle: '@andnote',
        avatarColor: '#10B981',
        subscribers: 64000,
        description: 'Kotlin/Compose로 만드는 안드로이드. 모던 안드로이드 개발의 모든 것을 배울 수 있습니다.'
      },
      lectures: [
        { id: 1, title: 'Jetpack Compose 마스터', description: '선언적 UI로 안드로이드 앱 만들기', category: '안드로이드', createdAt: '2024-01-17', views: 21000 },
        { id: 2, title: 'Kotlin 고급 기능', description: '코루틴과 고차함수 활용', category: '안드로이드', createdAt: '2024-01-13', views: 18000 },
        { id: 3, title: 'MVVM 아키텍처 패턴', description: '깔끔한 코드 구조 만들기', category: '아키텍처', createdAt: '2024-01-09', views: 15000 }
      ],
      curriculums: [
        { id: 1, title: '안드로이드 개발자', description: 'Kotlin과 Compose로 만드는 모던 앱', totalLectureCount: 42, createdAt: '2024-01-23', studentCount: 850 },
        { id: 2, title: '안드로이드 앱 출시', description: '개발부터 플레이스토어 등록까지', totalLectureCount: 26, createdAt: '2024-01-19', studentCount: 620 }
      ]
    },
    109: {
      creator: {
        id: 109,
        name: '보안연구회',
        handle: '@secstudy',
        avatarColor: '#1F2937',
        subscribers: 28000,
        description: '웹해킹/디지털포렌식/보안개발. 사이버 보안 전문가가 되기 위한 체계적인 학습을 제공합니다.'
      },
      lectures: [
        { id: 1, title: '웹 애플리케이션 보안', description: 'OWASP Top 10 취약점 분석과 대응', category: '보안', createdAt: '2024-01-15', views: 16000 },
        { id: 2, title: '침투 테스트 실전', description: '실제 환경에서의 보안 테스트', category: '보안', createdAt: '2024-01-11', views: 14000 },
        { id: 3, title: '암호화와 해시', description: '데이터 보호를 위한 암호화 기술', category: '보안', createdAt: '2024-01-07', views: 12000 }
      ],
      curriculums: [
        { id: 1, title: '사이버 보안 전문가', description: '웹보안부터 포렌식까지 완전정복', totalLectureCount: 35, createdAt: '2024-01-21', studentCount: 420 },
        { id: 2, title: '침투 테스트 마스터', description: '실전 해킹 기법과 방어 전략', totalLectureCount: 28, createdAt: '2024-01-17', studentCount: 350 }
      ]
    },
    110: {
      creator: {
        id: 110,
        name: '게임엔진랩',
        handle: '@gamelab',
        avatarColor: '#EF4444',
        subscribers: 52000,
        description: 'Unity/Unreal 엔진으로 만드는 게임. 게임 개발의 모든 과정을 단계별로 학습할 수 있습니다.'
      },
      lectures: [
        { id: 1, title: 'Unity 3D 게임 개발', description: 'C#으로 만드는 3D 게임', category: '게임개발', createdAt: '2024-01-18', views: 23000 },
        { id: 2, title: 'Unreal Engine 5 마스터', description: '블루프린트와 C++ 게임 개발', category: '게임개발', createdAt: '2024-01-14', views: 20000 },
        { id: 3, title: '게임 물리와 애니메이션', description: '리얼리스틱한 게임 효과 만들기', category: '게임개발', createdAt: '2024-01-10', views: 17000 }
      ],
      curriculums: [
        { id: 1, title: '게임 개발자 완전정복', description: 'Unity와 Unreal로 만드는 완전한 게임', totalLectureCount: 48, createdAt: '2024-01-24', studentCount: 780 },
        { id: 2, title: '모바일 게임 개발', description: '스마트폰용 게임 만들기', totalLectureCount: 30, createdAt: '2024-01-20', studentCount: 560 }
      ]
    }
  };

  // 기본 데이터 (크리에이터가 없을 경우)
  const defaultData = {
    creator: {
      id: creatorId,
      name: '알 수 없는 크리에이터',
      handle: '@unknown',
      avatarColor: '#6B7280',
      subscribers: 0,
      description: '크리에이터 정보를 찾을 수 없습니다.'
    },
    lectures: [],
    curriculums: []
  };

  return creatorProfiles[creatorId] || defaultData;
}

// 데이터 로드
async function loadCreatorData() {
  try {
    loading.value = true;
    error.value = null;

    const creatorId = Number(route.params.id);
    
    // 크리에이터별 데이터 생성
    const creatorData = getCreatorData(creatorId);
    creator.value = creatorData.creator;
    lectures.value = creatorData.lectures;
    curriculums.value = creatorData.curriculums;

    // 구독 상태 확인
    checkSubscriptionStatus();

  } catch (err) {
    console.error('크리에이터 데이터 로드 실패:', err);
    error.value = '크리에이터 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 구독 상태 확인
function checkSubscriptionStatus() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    isSubscribed.value = subscriptions.some((sub: any) => sub.id === creator.value?.id);
  } catch {
    isSubscribed.value = false;
  }
}

// 구독 토글
function toggleSubscribe() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    
    if (isSubscribed.value) {
      // 구독 해지 확인 다이얼로그
      if (confirm(`"${creator.value?.name}"의 구독을 해지하시겠습니까?\n\n구독을 해지하면 해당 크리에이터의 새로운 콘텐츠 알림을 받을 수 없습니다.`)) {
        const updatedSubs = subscriptions.filter((sub: any) => sub.id !== creator.value?.id);
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
        isSubscribed.value = false;
        
        // 성공 메시지
        alert(`${creator.value?.name}의 구독이 해지되었습니다.`);
      }
    } else {
      // 구독 추가
      subscriptions.push({
        ...creator.value,
        subscribedAt: new Date().toISOString()
      });
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      isSubscribed.value = true;
      
      // 성공 메시지
      alert(`${creator.value?.name}을(를) 구독했습니다!`);
    }
  } catch (err) {
    console.error('구독 상태 변경 실패:', err);
  }
}

// 네비게이션
function goBack() {
  router.back();
}

function goToLecture(lectureId: number) {
  router.push({
    name: 'lecture',
    params: { lectureId }
  });
}

function goToCurriculum(curriculumId: number) {
  router.push({
    name: 'curriculum-detail',
    params: { id: curriculumId }
  });
}

// 유틸리티 함수
function formatSubs(n: number) {
  if (n >= 10000) return `${Math.round(n / 100) / 100}만명`;
  if (n >= 1000) return `${Math.round(n / 10) / 100}천명`;
  return `${n}명`;
}

function formatViews(n: number) {
  if (n >= 10000) return `${Math.round(n / 100) / 100}만`;
  if (n >= 1000) return `${Math.round(n / 10) / 100}천`;
  return `${n}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

onMounted(() => {
  loadCreatorData();
});
</script>
