<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div class="bg-figma-1 border-b" style="border-color: rgb(var(--figma-color-4))">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 뒤로가기 버튼 -->
            <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div v-if="curriculum">
              <h1 class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ curriculum.title }}</h1>
              <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">{{ curriculum.instructor }} • {{ curriculum.category }}</p>
            </div>
          </div>
          
          <!-- 액션 버튼들 -->
          <div class="flex items-center space-x-3">
            <button class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))">
              공유하기
            </button>
            <button class="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style="background-color: rgb(var(--figma-color-6))">
              채널 관리
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 왼쪽: 커리큘럼 정보 -->
        <div class="lg:col-span-2">
          <!-- 커리큘럼 썸네일 -->
          <div 
            class="h-64 rounded-lg mb-6 flex items-center justify-center text-6xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
          </div>

          <!-- 커리큘럼 설명 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
            <h2 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼 소개</h2>
            <p class="text-gray-600 leading-relaxed">{{ curriculum.description }}</p>
          </div>

          <!-- 탭 네비게이션 -->
          <div class="bg-figma-1 rounded-lg border mb-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex border-b" style="border-color: rgb(var(--figma-color-4))">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'"
              >
                {{ tab.name }}
                <div 
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                ></div>
              </button>
            </div>
            
            <!-- 탭 컨텐츠 -->
            <div class="p-6">
              <!-- 강의 탭 -->
              <div v-if="activeTab === 'lectures'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">이어서 학습하기</h3>
                
                <div v-if="curriculum" class="space-y-4">
                  <div 
                    v-for="(course, index) in curriculum.courses" 
                    :key="course.id"
                    class="flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer"
                    :class="course.isActive 
                      ? 'bg-gray-100 border-gray-300' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'"
                    style="border-color: rgb(var(--figma-color-4))"
                    @click="goToCourse(course.id)"
                  >
                    <div class="flex items-center space-x-4">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style="background-color: rgb(var(--figma-color-6))">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h4 class="font-medium" style="color: rgb(var(--figma-color-2))">{{ course.title }}</h4>
                        <p class="text-sm" style="color: rgb(var(--figma-color-5))">형태: {{ course.format }} • {{ course.date }}</p>
                      </div>
                    </div>
                    
                    <button 
                      class="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                      style="background-color: rgb(var(--figma-color-6))"
                      @click.stop="goToCourse(course.id)"
                    >
                      학습하기
                    </button>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">커리큘럼 정보를 불러오는 중...</p>
                </div>
              </div>
              
              <!-- 리뷰 탭 -->
              <div v-else-if="activeTab === 'reviews'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">리뷰</h3>
                <p class="text-gray-600">리뷰가 아직 없습니다.</p>
              </div>
              
              <!-- 문의 탭 -->
              <div v-else-if="activeTab === 'inquiries'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">문의</h3>
                <p class="text-gray-600">문의가 아직 없습니다.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 커리큘럼 정보 카드 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼 정보</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">강의자</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.instructor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">카테고리</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">총 강의 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.courses.length }}개</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">총 소요 시간</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.totalDuration }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">난이도</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.difficulty }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">수강생 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.students.toLocaleString() }}명</span>
              </div>
            </div>
          </div>

          <!-- 태그 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">태그</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in curriculum.tags" 
                :key="tag"
                class="px-3 py-1 text-xs rounded-full font-medium"
                style="background-color: rgb(var(--figma-color-7)); color: rgb(var(--figma-color-6))"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 학습 목표 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">학습 목표</h3>
            <ul class="space-y-2">
              <li v-for="goal in curriculum.learningGoals" :key="goal" class="flex items-start space-x-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" style="color: rgb(var(--figma-color-2))">{{ goal }}</span>
              </li>
            </ul>
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

// 탭 상태
const activeTab = ref('lectures');

// 탭 옵션
const tabs = ref([
  { id: 'lectures', name: '강의' },
  { id: 'reviews', name: '리뷰' },
  { id: 'inquiries', name: '문의' }
]);

// 현재 커리큘럼 데이터
const currentCurriculum = ref(null);

// 커리큘럼 데이터 매핑 (개요 페이지와 동일)
const curriculumData = {
  'course_1': {
    id: 1,
    title: 'Introduction To Algorithms',
    instructor: '김유희',
    category: '알고리즘',
    description: '알고리즘 기초 개념을 예제로 익히고 실습 문제로 다집니다. 정렬, 그래프, 동적계획법 등 핵심 알고리즘을 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '32시간',
    difficulty: '초급',
    students: 12450,
    tags: ['#알고리즘', '#정렬', '#그래프', '#동적계획법', '#Python', '#Java'],
    learningGoals: [
      '알고리즘의 기본 개념과 복잡도 분석',
      '정렬 알고리즘의 원리와 구현',
      '그래프 알고리즘과 최단경로 문제',
      '동적계획법을 활용한 문제 해결',
      '실제 코딩테스트 문제 풀이 능력 향상'
    ],
    courses: [
      {
        id: 1,
        title: '알고리즘이란?',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: '시간복잡도와 공간복잡도',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: 'Big O 표기법',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: '버블 정렬과 선택 정렬',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: '삽입 정렬과 병합 정렬',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: '퀵 정렬과 힙 정렬',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 7,
        title: '그래프의 표현과 탐색',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 8,
        title: 'DFS와 BFS',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  },
  'course_2': {
    id: 2,
    title: '웹 기초: HTML/CSS',
    instructor: '이서준',
    category: '웹',
    description: 'HTML과 CSS로 반응형 레이아웃을 구현합니다. 웹 개발의 기초부터 실전 프로젝트까지 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '24시간',
    difficulty: '입문',
    students: 5670,
    tags: ['#HTML', '#CSS', '#웹개발', '#반응형', '#레이아웃'],
    learningGoals: [
      'HTML5의 기본 구조와 시맨틱 태그',
      'CSS3의 고급 기능과 애니메이션',
      '반응형 웹 디자인과 미디어 쿼리',
      'Flexbox와 Grid 레이아웃',
      '실제 웹사이트 제작 프로젝트'
    ],
    courses: [
      {
        id: 1,
        title: 'HTML 기본 구조',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: '시맨틱 태그',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: '폼과 입력 요소',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: 'CSS 선택자와 속성',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: '박스 모델과 포지셔닝',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: 'Flexbox 레이아웃',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  },
  'course_3': {
    id: 3,
    title: 'Python 자료구조',
    instructor: '박가은',
    category: '개발·프로그래밍',
    description: '파이썬 핵심 자료구조와 알고리즘 기본. 파이썬의 내장 자료구조부터 고급 자료구조까지 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '28시간',
    difficulty: '초급',
    students: 8930,
    tags: ['#Python', '#자료구조', '#알고리즘', '#리스트', '#딕셔너리'],
    learningGoals: [
      '파이썬의 기본 자료구조 이해',
      '리스트, 딕셔너리, 세트의 활용',
      '스택과 큐 구현',
      '트리와 그래프 자료구조',
      '실전 문제 해결 능력 향상'
    ],
    courses: [
      {
        id: 1,
        title: '리스트와 튜플',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: '딕셔너리와 세트',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: '문자열 처리',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: '스택 구현',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: '큐 구현',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: '연결 리스트',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  },
  'course_4': {
    id: 4,
    title: '게임 개발 입문 with Unity',
    instructor: '최민수',
    category: '게임 개발',
    description: 'Unity로 간단한 게임을 만들며 핵심 개념을 배웁니다. 게임 개발의 기초부터 실제 게임 제작까지 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '36시간',
    difficulty: '입문',
    students: 3450,
    tags: ['#Unity', '#게임개발', '#C#', '#씬', '#프리팹'],
    learningGoals: [
      'Unity 엔진의 기본 사용법',
      'C# 스크립팅 기초',
      '게임 오브젝트와 컴포넌트',
      '씬 관리와 프리팹 활용',
      '실제 게임 프로젝트 완성'
    ],
    courses: [
      {
        id: 1,
        title: 'Unity 인터페이스',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: '씬과 게임 오브젝트',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: 'Transform과 컴포넌트',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: 'C# 기본 문법',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: 'MonoBehaviour 클래스',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: '플레이어 컨트롤',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  },
  'course_5': {
    id: 5,
    title: 'SQL로 하는 데이터 질의',
    instructor: '정은지',
    category: '데이터베이스',
    description: '실무 예제로 익히는 SQL 쿼리 작성. 데이터베이스의 기초부터 고급 쿼리까지 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '20시간',
    difficulty: '초급',
    students: 6780,
    tags: ['#SQL', '#데이터베이스', '#JOIN', '#인덱스', '#쿼리'],
    learningGoals: [
      'SQL 기본 문법과 데이터 타입',
      'SELECT, INSERT, UPDATE, DELETE',
      'JOIN과 서브쿼리 활용',
      '인덱스와 성능 최적화',
      '실무 데이터 분석 쿼리 작성'
    ],
    courses: [
      {
        id: 1,
        title: '데이터베이스 개념',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: 'SELECT 문 기초',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: 'WHERE 절과 조건문',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: 'JOIN과 관계형 데이터',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: '서브쿼리와 CTE',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: '집계 함수와 GROUP BY',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  },
  'course_6': {
    id: 6,
    title: '인공지능 개요',
    instructor: '오지후',
    category: '인공지능',
    description: 'AI 기본 개념과 사례 소개. 머신러닝과 딥러닝의 기초부터 실제 응용까지 체계적으로 학습할 수 있는 강의입니다.',
    totalDuration: '16시간',
    difficulty: '입문',
    students: 2340,
    tags: ['#AI', '#머신러닝', '#딥러닝', '#Python', '#데이터사이언스'],
    learningGoals: [
      '인공지능의 기본 개념과 역사',
      '머신러닝 알고리즘 이해',
      '딥러닝과 신경망 기초',
      '실제 AI 프로젝트 경험',
      'AI 윤리와 미래 전망'
    ],
    courses: [
      {
        id: 1,
        title: 'AI의 정의와 역사',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 2,
        title: '머신러닝 개요',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 3,
        title: '데이터 전처리',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 4,
        title: '지도학습과 비지도학습',
        format: '마크다운',
        date: '2025.12.16',
        isActive: true
      },
      {
        id: 5,
        title: '회귀와 분류',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      },
      {
        id: 6,
        title: '신경망 기초',
        format: '마크다운',
        date: '2025.12.16',
        isActive: false
      }
    ]
  }
};

// 현재 커리큘럼 정보
const curriculum = computed(() => {
  if (!currentCurriculum.value) return null;
  return currentCurriculum.value;
});

// 강의로 이동
function goToCourse(courseId: number) {
  // 학습 페이지로 이동
  console.log('학습 페이지로 이동:', courseId);
  router.push({ name: 'learning', params: { lessonId: courseId } });
}

onMounted(() => {
  // URL 파라미터에서 커리큘럼 ID 가져오기
  const curriculumId = route.params.id as string;
  console.log('커리큘럼 ID:', curriculumId);
  
  // 커리큘럼 데이터 설정
  if (curriculumData[curriculumId]) {
    currentCurriculum.value = curriculumData[curriculumId];
  }
});
</script>
