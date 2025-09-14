<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 탭 네비게이션 -->
    <div class="bg-figma-1 border-b" style="border-color: rgb(var(--figma-color-4))">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-2 px-1 text-sm font-medium transition-colors relative"
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
          
          <!-- 정렬 옵션 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">정렬:</span>
            <select v-model="sortBy" class="text-sm border-0 bg-transparent text-gray-700 focus:ring-0">
              <option value="recommended">추천순</option>
              <option value="recent">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 강의 카드 그리드 -->
    <div class="px-6 py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="course in courses" 
          :key="course.id" 
          class="bg-figma-1 rounded-lg border hover:shadow-md transition-shadow cursor-pointer group"
          style="border-color: rgb(var(--figma-color-4))"
        >
          <!-- 강의 썸네일 -->
          <div 
            class="h-48 rounded-t-lg flex items-center justify-center text-4xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
          </div>
          
          <!-- 강의 정보 -->
          <div class="p-4">
            <!-- 카테고리 -->
            <div class="text-xs font-medium mb-2" style="color: rgb(var(--figma-color-5))">
              {{ course.category }}
            </div>
            
            <!-- 강의 제목 -->
            <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {{ course.title }}
            </h3>
            
            <!-- 강사명 -->
            <p class="text-sm text-gray-600 mb-3">{{ course.instructor }}</p>
            
            <!-- 진행률 -->
            <div class="mb-2">
              <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>진행률</span>
                <span>{{ course.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: course.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 탭 상태
const activeTab = ref('all');
const sortBy = ref('recommended');

// 탭 옵션
const tabs = ref([
  { id: 'all', name: '전체' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'materials', name: '강의물' }
]);

// 강의 데이터 (이미지에 맞게)
const courses = ref([
  {
    id: 1,
    title: '[코드팩토리] [초급] Flutter 3.0 앱 개발 - 10개의 프로젝트로 오늘 초보 탈출!',
    instructor: '이종용',
    category: '앱 개발',
    progress: 30
  },
  {
    id: 2,
    title: '[인프런] React 완벽 가이드 - 실전 프로젝트와 함께하는 웹 개발',
    instructor: '김리액트',
    category: '웹 개발',
    progress: 65
  },
  {
    id: 3,
    title: '[패스트캠퍼스] Python 데이터 사이언스 부트캠프 - 머신러닝부터 딥러닝까지',
    instructor: '박데이터',
    category: '데이터 사이언스',
    progress: 45
  },
  {
    id: 4,
    title: '[노마드코더] JavaScript ES6+ 완벽 마스터 - 모던 웹 개발의 모든 것',
    instructor: '최자바',
    category: '프로그래밍',
    progress: 80
  },
  {
    id: 5,
    title: '[생활코딩] HTML/CSS 기초부터 실전까지 - 웹 표준을 준수하는 코딩',
    instructor: '이웹',
    category: '웹 개발',
    progress: 15
  },
  {
    id: 6,
    title: '[코딩애플] SwiftUI iOS 앱 개발 - 아이폰 앱을 직접 만들어보자',
    instructor: '정스위프트',
    category: '앱 개발',
    progress: 55
  },
  {
    id: 7,
    title: '[프로그래머스] 알고리즘 문제 해결 전략 - 코딩테스트 완벽 대비',
    instructor: '강알고',
    category: '알고리즘',
    progress: 70
  },
  {
    id: 8,
    title: '[한입 크기로 잘라먹는 TypeScript] 타입스크립트 기초부터 실전까지',
    instructor: '윤타입',
    category: '프로그래밍',
    progress: 25
  }
]);
</script>
