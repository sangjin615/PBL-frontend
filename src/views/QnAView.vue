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
          <button 
            @click="goToWrite"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            글쓰기
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
            <tr v-for="question in currentPageQuestions" :key="question.id" class="hover:bg-gray-50 cursor-pointer" @click="goToQuestion(question.id)">
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
                {{ question.createdAt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center space-x-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button 
            v-for="page in pages" 
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm rounded',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ page }}
          </button>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
        <div class="text-sm text-gray-500">
          총 {{ questions.length }}개 질문 중 {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, questions.length) }}개 표시
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { qnaQuestions } from '../mock/qna'
import type { QnAQuestion } from '../types/qna'

const router = useRouter()

// 질문 상세 페이지로 이동
function goToQuestion(questionId: number) {
  router.push({ name: 'qna-detail', params: { id: questionId.toString() } })
}

// 글쓰기 페이지로 이동
function goToWrite() {
  router.push({ name: 'qna-write' })
}

// 탭 데이터
const tabs = ref([
  { id: 'all', name: '전체' },
  { id: 'questions', name: '질문', badge: '99+' },
  { id: 'answered', name: '답변완료' },
  { id: 'admin', name: 'Admin' }
])

const activeTab = ref('all')

// 질문 데이터 (새로운 더미데이터 사용)
const questions = ref<QnAQuestion[]>(qnaQuestions)

// 페이지네이션 설정
const itemsPerPage = 4 // 페이지당 4개 항목
const totalPages = Math.ceil(questions.value.length / itemsPerPage)
const pages = ref(Array.from({ length: totalPages }, (_, i) => i + 1))
const currentPage = ref(1)

// 현재 페이지의 질문들
const currentPageQuestions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return questions.value.slice(start, end)
})

// 페이지 변경 함수
function changePage(page: number) {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page
  }
}
</script>
