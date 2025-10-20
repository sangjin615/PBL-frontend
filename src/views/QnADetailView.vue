<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">질문&답변</h1>
      <p class="text-gray-600">| 자유롭게 물어보고 답변해봐요.</p>
    </div>

    <!-- 질문 게시글 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <!-- 질문 작성자 정보 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ currentQuestion?.author || '로딩 중...' }}</p>
          </div>
        </div>
        <button 
          v-if="currentQuestion"
          @click="() => alert('게시글 신고: ' + currentQuestion.title)"
          class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
        >
          🚨 신고
        </button>
      </div>

      <!-- 질문 제목 -->
      <h2 class="text-xl font-bold text-gray-900 mb-3">{{ currentQuestion?.title || '로딩 중...' }}</h2>
      
      <!-- 질문 내용 -->
      <p class="text-gray-700 mb-4">{{ currentQuestion?.content || '로딩 중...' }}</p>

      <!-- 질문 반응 및 시간 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">0</span>
          </button>
          <button class="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span class="text-sm">2</span>
          </button>
        </div>
        <span class="text-sm text-gray-500">16분 전</span>
      </div>
    </div>

    <!-- 댓글/답변 영역 -->
    <div class="space-y-4 mb-6">
      <!-- 댓글 목록 -->
      <div 
        v-for="comment in currentQuestion?.commentsList || []" 
        :key="comment.id"
        :class="[
          'bg-white rounded-lg shadow-sm border border-gray-200 p-4'
        ]"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ comment.author }}</p>
            </div>
          </div>
          <button 
            @click="() => alert('댓글 신고: ' + comment.content)"
            class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
          >
            🚨 신고
          </button>
        </div>
        
        <p class="text-gray-700 mb-3">{{ comment.content }}</p>
        
        <div class="flex items-center justify-between">
          <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">{{ comment.likes }}</span>
          </button>
          <span class="text-sm text-gray-500">{{ comment.createdAt }}</span>
        </div>
      </div>
      
      <!-- 댓글이 없을 때 -->
      <div v-if="!currentQuestion?.commentsList?.length" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
      </div>
    </div>

    <!-- 댓글 입력 및 액션 영역 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center space-x-4 mb-4">
        <input 
          type="text" 
          placeholder="댓글을 입력하세요" 
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          <span>글쓰기</span>
        </button>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="goBackToList"
          class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          <span>목록으로</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { qnaQuestions } from '../mock/qna'
import type { QnAQuestion } from '../types/qna'

const router = useRouter()
const route = useRoute()

// 현재 질문 데이터
const currentQuestion = ref<QnAQuestion | null>(null)

// 질문 ID 가져오기
const questionId = computed(() => Number(route.params.id))

// 질문 데이터 로드
onMounted(() => {
  const question = qnaQuestions.find(q => q.id === questionId.value)
  if (question) {
    currentQuestion.value = question
  } else {
    // 질문을 찾을 수 없으면 목록으로 이동
    router.push('/qna')
  }
})

function goBackToList() {
  router.push('/qna')
}

// 신고 완료 처리
function handleReported() {
  console.log('게시글/댓글 신고가 접수되었습니다.');
}
</script>
