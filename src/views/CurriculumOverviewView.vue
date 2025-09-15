<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 브레드크럼 -->
    <div class="px-6 py-4">
      <nav class="text-sm text-gray-600">
        <span>전체</span>
        <span class="mx-2">></span>
        <span>프로그램/모바일 앱 개발</span>
      </nav>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="px-6 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 왼쪽: 메인 컨텐츠 -->
        <div class="lg:col-span-2">
          <!-- 강의 제목 및 기본 정보 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
            <h1 class="text-2xl font-bold mb-4" style="color: rgb(var(--figma-color-2))">
              {{ curriculum.title }}
            </h1>
            
            <p class="text-gray-600 mb-4 leading-relaxed">
              {{ curriculum.description }}
            </p>
            
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in Math.floor(curriculum.rating)" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.rating }}점</span>
              </div>
              <span class="text-sm" style="color: rgb(var(--figma-color-5))">{{ curriculum.instructor }}</span>
            </div>
          </div>

          <!-- 강의 썸네일 -->
          <div 
            class="h-64 rounded-lg mb-6 flex items-center justify-center text-6xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
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
              <!-- 강의 소개 탭 -->
              <div v-if="activeTab === 'intro'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">강의 소개</h3>
                
                <!-- 강의 소개 썸네일 -->
                <div 
                  class="h-48 rounded-lg mb-6 flex items-center justify-center text-4xl font-bold text-gray-400"
                  style="background-color: rgb(var(--figma-color-4))"
                >
                  ✕
                </div>

                <!-- 이런 걸 배울 수 있어요 -->
                <div class="mb-8">
                  <h4 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">이런 걸 배울 수 있어요</h4>
                  <ul class="space-y-2">
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">빅데이터를 이용해서 특정 데이터를 추출하는 방법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">파이썬 기본 문법과 활용법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">그래프 활용법</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 커리큘럼 탭 -->
              <div v-else-if="activeTab === 'curriculum'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼</h3>
                
                <div v-if="curriculum" class="space-y-4">
                  <div 
                    v-for="chapter in curriculum.chapters" 
                    :key="chapter.id"
                    class="border rounded-lg" 
                    style="border-color: rgb(var(--figma-color-4))"
                  >
                    <button 
                      @click="toggleChapter(chapter.id)"
                      class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center space-x-3">
                        <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                          {{ chapter.isExpanded ? '∨' : '∧' }} {{ chapter.title }}
                        </span>
                        <span class="text-sm" style="color: rgb(var(--figma-color-5))">{{ chapter.lessons.length }}개 레슨</span>
                      </div>
                    </button>
                    
                    <div v-if="chapter.isExpanded" class="px-4 pb-4 border-t" style="border-color: rgb(var(--figma-color-4))">
                      <div class="pt-4 space-y-3">
                        <div 
                          v-for="lesson in chapter.lessons" 
                          :key="lesson.id"
                          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white" style="background-color: rgb(var(--figma-color-6))">
                            {{ lesson.id }}
                          </div>
                          <div class="flex-1">
                            <span class="text-sm" style="color: rgb(var(--figma-color-2))">{{ lesson.title }}</span>
                            <span v-if="lesson.duration" class="text-xs ml-2" style="color: rgb(var(--figma-color-5))">{{ lesson.duration }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">커리큘럼 정보를 불러오는 중...</p>
                </div>
              </div>

              <!-- 질문&답변 탭 -->
              <div v-else-if="activeTab === 'qa'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">질문&답변</h3>
                <p class="text-gray-600">질문이 아직 없습니다.</p>
              </div>

              <!-- 나의 학습 탭 -->
              <div v-else-if="activeTab === 'learning'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">나의 학습</h3>
                <p class="text-gray-600">학습 기록이 없습니다.</p>
              </div>
            </div>
          </div>

          <!-- 수강평 섹션 -->
          <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold" style="color: rgb(var(--figma-color-2))">수강평</h3>
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">4.9</span>
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">999+개의 수강평</span>
              </div>
            </div>

            <!-- 리뷰 그리드 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="review in reviews" 
                :key="review.id"
                class="p-4 border rounded-lg" 
                style="border-color: rgb(var(--figma-color-4))"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ review.name }}</span>
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">5.0</span>
                </div>
                <p class="text-sm text-gray-600">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 수강신청 카드 -->
          <div class="bg-figma-1 rounded-lg border p-6 sticky top-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="space-y-4">
              <button 
                @click="toggleEnrollment"
                class="w-full px-4 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors" 
                :style="isEnrolled ? 'background-color: rgb(var(--figma-color-17))' : 'background-color: rgb(var(--figma-color-6))'"
              >
                {{ isEnrolled ? '수강 취소하기' : '수강신청하기' }}
              </button>
              
              <!-- 학습하기 버튼 (수강 신청 후에만 표시) -->
              <button 
                v-if="isEnrolled"
                @click="goToLearning"
                class="w-full px-4 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors" 
                style="background-color: rgb(var(--figma-color-6))"
              >
                학습하기
              </button>
              
              <button 
                v-if="!isEnrolled"
                class="w-full px-4 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors" 
                style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))"
              >
                장바구니 담기
              </button>
            </div>
            
            <div v-if="curriculum" class="mt-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">지식공유자</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.instructor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">카테고리</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">강의 시간</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { courses } from '../mock/courses';

const router = useRouter();
const route = useRoute();

// 탭 상태
const activeTab = ref('intro');

// 수강 신청 상태
const isEnrolled = ref(false);

// 탭 옵션
const tabs = ref([
  { id: 'intro', name: '강의 소개' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'qa', name: '질문&답변' },
  { id: 'learning', name: '나의 학습' }
]);

// 현재 커리큘럼 데이터
const currentCurriculum = ref(null);

// 커리큘럼 데이터 매핑
const curriculumData = {
  'course_1': {
    title: 'Introduction To Algorithms',
    instructor: '김유희',
    category: '알고리즘',
    description: '알고리즘 기초 개념을 예제로 익히고 실습 문제로 다집니다. 정렬, 그래프, 동적계획법 등 핵심 알고리즘을 체계적으로 학습할 수 있는 강의입니다.',
    rating: 5.0,
    reviewsCount: 999,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. 알고리즘 기초',
        isExpanded: true,
        lessons: [
          { id: 101, title: '알고리즘이란?', duration: '30분' },
          { id: 102, title: '시간복잡도와 공간복잡도', duration: '45분' },
          { id: 103, title: 'Big O 표기법', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. 정렬 알고리즘',
        isExpanded: false,
        lessons: [
          { id: 201, title: '버블 정렬과 선택 정렬', duration: '40분' },
          { id: 202, title: '삽입 정렬과 병합 정렬', duration: '50분' },
          { id: 203, title: '퀵 정렬과 힙 정렬', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 그래프 알고리즘',
        isExpanded: false,
        lessons: [
          { id: 301, title: '그래프의 표현과 탐색', duration: '60분' },
          { id: 302, title: 'DFS와 BFS', duration: '55분' },
          { id: 303, title: '최단경로 알고리즘', duration: '70분' },
        ],
      },
      {
        id: 4,
        title: '챕터 4. 동적계획법',
        isExpanded: true,
        lessons: [
          { id: 401, title: 'DP의 기본 원리', duration: '80분' },
          { id: 402, title: '메모이제이션과 타뷸레이션', duration: '90분' },
          { id: 403, title: '실전 DP 문제 풀이', duration: '75분' },
        ],
      },
    ]
  },
  'course_2': {
    title: '웹 기초: HTML/CSS',
    instructor: '이서준',
    category: '웹',
    description: 'HTML과 CSS로 반응형 레이아웃을 구현합니다. 웹 개발의 기초부터 실전 프로젝트까지 체계적으로 학습할 수 있는 강의입니다.',
    rating: 4.7,
    reviewsCount: 312,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. HTML 기초',
        isExpanded: true,
        lessons: [
          { id: 101, title: 'HTML 기본 구조', duration: '30분' },
          { id: 102, title: '시맨틱 태그', duration: '45분' },
          { id: 103, title: '폼과 입력 요소', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. CSS 기초',
        isExpanded: false,
        lessons: [
          { id: 201, title: 'CSS 선택자와 속성', duration: '40분' },
          { id: 202, title: '박스 모델과 포지셔닝', duration: '50분' },
          { id: 203, title: '색상과 타이포그래피', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 레이아웃',
        isExpanded: false,
        lessons: [
          { id: 301, title: 'Flexbox 레이아웃', duration: '60분' },
          { id: 302, title: 'Grid 레이아웃', duration: '55분' },
          { id: 303, title: '반응형 디자인', duration: '70분' },
        ],
      },
    ]
  },
  'course_3': {
    title: 'Python 자료구조',
    instructor: '박가은',
    category: '개발·프로그래밍',
    description: '파이썬 핵심 자료구조와 알고리즘 기본. 파이썬의 내장 자료구조부터 고급 자료구조까지 체계적으로 학습할 수 있는 강의입니다.',
    rating: 4.9,
    reviewsCount: 587,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. 기본 자료구조',
        isExpanded: true,
        lessons: [
          { id: 101, title: '리스트와 튜플', duration: '30분' },
          { id: 102, title: '딕셔너리와 세트', duration: '45분' },
          { id: 103, title: '문자열 처리', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. 선형 자료구조',
        isExpanded: false,
        lessons: [
          { id: 201, title: '스택 구현', duration: '40분' },
          { id: 202, title: '큐 구현', duration: '50분' },
          { id: 203, title: '연결 리스트', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 비선형 자료구조',
        isExpanded: false,
        lessons: [
          { id: 301, title: '트리 구조', duration: '60분' },
          { id: 302, title: '그래프 구조', duration: '55분' },
          { id: 303, title: '해시 테이블', duration: '70분' },
        ],
      },
    ]
  },
  'course_4': {
    title: '게임 개발 입문 with Unity',
    instructor: '최민수',
    category: '게임 개발',
    description: 'Unity로 간단한 게임을 만들며 핵심 개념을 배웁니다. 게임 개발의 기초부터 실제 게임 제작까지 체계적으로 학습할 수 있는 강의입니다.',
    rating: 4.6,
    reviewsCount: 201,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. Unity 기초',
        isExpanded: true,
        lessons: [
          { id: 101, title: 'Unity 인터페이스', duration: '30분' },
          { id: 102, title: '씬과 게임 오브젝트', duration: '45분' },
          { id: 103, title: 'Transform과 컴포넌트', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. C# 스크립팅',
        isExpanded: false,
        lessons: [
          { id: 201, title: 'C# 기본 문법', duration: '40분' },
          { id: 202, title: 'MonoBehaviour 클래스', duration: '50분' },
          { id: 203, title: '이벤트와 코루틴', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 게임 제작',
        isExpanded: false,
        lessons: [
          { id: 301, title: '플레이어 컨트롤', duration: '60분' },
          { id: 302, title: '물리 시스템', duration: '55분' },
          { id: 303, title: 'UI 시스템', duration: '70분' },
        ],
      },
    ]
  },
  'course_5': {
    title: 'SQL로 하는 데이터 질의',
    instructor: '정은지',
    category: '데이터베이스',
    description: '실무 예제로 익히는 SQL 쿼리 작성. 데이터베이스의 기초부터 고급 쿼리까지 체계적으로 학습할 수 있는 강의입니다.',
    rating: 4.8,
    reviewsCount: 421,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. SQL 기초',
        isExpanded: true,
        lessons: [
          { id: 101, title: '데이터베이스 개념', duration: '30분' },
          { id: 102, title: 'SELECT 문 기초', duration: '45분' },
          { id: 103, title: 'WHERE 절과 조건문', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. 고급 쿼리',
        isExpanded: false,
        lessons: [
          { id: 201, title: 'JOIN과 관계형 데이터', duration: '40분' },
          { id: 202, title: '서브쿼리와 CTE', duration: '50분' },
          { id: 203, title: '집계 함수와 GROUP BY', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 성능 최적화',
        isExpanded: false,
        lessons: [
          { id: 301, title: '인덱스 설계', duration: '60분' },
          { id: 302, title: '쿼리 성능 분석', duration: '55분' },
          { id: 303, title: '실무 최적화 기법', duration: '70분' },
        ],
      },
    ]
  },
  'course_6': {
    title: '인공지능 개요',
    instructor: '오지후',
    category: '인공지능',
    description: 'AI 기본 개념과 사례 소개. 머신러닝과 딥러닝의 기초부터 실제 응용까지 체계적으로 학습할 수 있는 강의입니다.',
    rating: 4.5,
    reviewsCount: 198,
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
    chapters: [
      {
        id: 1,
        title: '챕터 1. AI 기초',
        isExpanded: true,
        lessons: [
          { id: 101, title: 'AI의 정의와 역사', duration: '30분' },
          { id: 102, title: '머신러닝 개요', duration: '45분' },
          { id: 103, title: '데이터 전처리', duration: '60분' },
        ],
      },
      {
        id: 2,
        title: '챕터 2. 머신러닝',
        isExpanded: false,
        lessons: [
          { id: 201, title: '지도학습과 비지도학습', duration: '40분' },
          { id: 202, title: '회귀와 분류', duration: '50분' },
          { id: 203, title: '모델 평가와 검증', duration: '70분' },
        ],
      },
      {
        id: 3,
        title: '챕터 3. 딥러닝',
        isExpanded: false,
        lessons: [
          { id: 301, title: '신경망 기초', duration: '60분' },
          { id: 302, title: 'CNN과 RNN', duration: '55분' },
          { id: 303, title: '실전 프로젝트', duration: '70분' },
        ],
      },
    ]
  }
};

// 리뷰 데이터
const reviews = ref([
  {
    id: 1,
    name: '김준성',
    content: '예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ'
  },
  {
    id: 2,
    name: '김준성',
    content: '예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ'
  },
  {
    id: 3,
    name: '김준성',
    content: '예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ'
  },
  {
    id: 4,
    name: '김준성',
    content: '예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ'
  }
]);

// 현재 커리큘럼 정보
const curriculum = computed(() => {
  if (!currentCurriculum.value) return null;
  return currentCurriculum.value;
});

// 챕터 토글
function toggleChapter(chapterId: number) {
  if (!currentCurriculum.value) return;
  const chapter = currentCurriculum.value.chapters.find(c => c.id === chapterId);
  if (chapter) {
    chapter.isExpanded = !chapter.isExpanded;
  }
}

// 수강 신청 토글
function toggleEnrollment() {
  isEnrolled.value = !isEnrolled.value;
  console.log('수강 신청 상태 변경:', isEnrolled.value);
}

// 학습하기 페이지로 이동
function goToLearning() {
  const curriculumId = route.params.id;
  console.log('학습하기 버튼 클릭됨, 커리큘럼 ID:', curriculumId);
  console.log('이동할 라우트:', { name: 'curriculum-detail', params: { id: curriculumId } });
  
  // 절대 경로로 시도
  const path = `/curriculum/${curriculumId}/learn`;
  console.log('절대 경로로 이동:', path);
  router.push(path);
}

// 페이지 로드 시 커리큘럼 데이터 설정
onMounted(() => {
  const curriculumId = route.params.id as string;
  if (curriculumData[curriculumId]) {
    currentCurriculum.value = curriculumData[curriculumId];
  }
});
</script>