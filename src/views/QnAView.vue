<template>
  <div class="min-h-screen bg-gray-50 p-8">
      <!-- 헤더 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">질문&답변</h1>
        <p class="text-gray-600">| 자유롭게 물어보고 답변해봐요.</p>
      </div>

      <!-- 필터 탭 -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex space-x-1">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ tab.name }}
            <span v-if="tab.badge" class="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <!-- 검색 및 생성 버튼 -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search" 
              class="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            + 만들기
          </button>
        </div>
      </div>

      <!-- 질문 목록 테이블 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">분류</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
                <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">강의</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">언어</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">글쓴이</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">댓글</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">좋아요</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="question in questions" :key="question.id" class="hover:bg-gray-50 cursor-pointer" @click="goToQuestion(question.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  question.status === 'unresolved' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ question.status === 'unresolved' ? '미해결' : '해결' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ question.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ question.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ question.course }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ question.language }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-900">{{ question.author }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-900">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  {{ question.comments }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-900">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  {{ question.likes }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ question.date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">이전</button>
          <button 
            v-for="page in pages" 
            :key="page"
            :class="[
              'px-3 py-2 text-sm rounded',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ page }}
          </button>
          <button class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">다음</button>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 질문 상세 페이지로 이동
function goToQuestion(questionId: number) {
  router.push({ name: 'qna-detail', params: { id: questionId.toString() } })
}

// 탭 데이터
const tabs = ref([
  { id: 'all', name: '전체' },
  { id: 'questions', name: '질문', badge: '99+' },
  { id: 'answered', name: '답변완료' },
  { id: 'admin', name: 'Admin' }
])

const activeTab = ref('all')

// 질문 데이터
const questions = ref([
  {
    id: 1,
    status: 'unresolved',
    title: '준성이는 대학원에 가고싶다',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 2,
    status: 'resolved',
    title: '엄마 난 커서 교수님이 될래요!',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 3,
    status: 'resolved',
    title: '오류좀 고쳐주세요',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 4,
    status: 'resolved',
    title: '이거 어떻게 해야하나요?',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 5,
    status: 'resolved',
    title: '도와주세요 ㅠㅠ',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 6,
    status: 'resolved',
    title: '이 코드가 왜 안될까요?',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 7,
    status: 'resolved',
    title: 'Spring Boot 설정 관련 질문',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 8,
    status: 'resolved',
    title: '데이터베이스 연결 오류',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 9,
    status: 'resolved',
    title: 'JPA 사용법 문의',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  },
  {
    id: 10,
    status: 'resolved',
    title: 'REST API 설계 질문',
    category: '질문',
    course: '자바스프링',
    language: 'Java',
    author: '김준성 사용자',
    comments: 1,
    likes: 5,
    date: '2달전'
  }
])

// 페이지네이션
const pages = ref([1, 2, 3, 4, 5, '...', 11])
const currentPage = ref(2)
</script>
