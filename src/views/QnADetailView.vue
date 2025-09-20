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
            <p class="font-medium text-gray-900">김준성 사용자</p>
          </div>
        </div>
        <button class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
          </svg>
          <span class="text-sm">신고하기</span>
        </button>
      </div>

      <!-- 질문 제목 -->
      <h2 class="text-xl font-bold text-gray-900 mb-3">오류좀 고쳐주세요</h2>
      
      <!-- 질문 내용 -->
      <p class="text-gray-700 mb-4">이 문제 못풀면 저 잠 못자요 제발요</p>

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
      <!-- 첫 번째 댓글 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">임상진 사용자</p>
            </div>
          </div>
          <button class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
            </svg>
            <span class="text-sm">신고하기</span>
          </button>
        </div>
        
        <p class="text-gray-700 mb-3">아 그거 그렇게 하는거 아님</p>
        
        <div class="flex items-center justify-between">
          <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">2</span>
          </button>
          <span class="text-sm text-gray-500">12분 전</span>
        </div>
      </div>

      <!-- 두 번째 댓글 (답글) -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 ml-8">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">김준성 사용자</p>
            </div>
          </div>
          <button class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
            </svg>
            <span class="text-sm">신고하기</span>
          </button>
        </div>
        
        <p class="text-gray-700 mb-3">그래서 어떻게 하는 건데요;;</p>
        
        <div class="flex items-center justify-between">
          <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">0</span>
          </button>
          <span class="text-sm text-gray-500">10분 전</span>
        </div>
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
import { useRouter } from 'vue-router'

const router = useRouter()

function goBackToList() {
  router.push('/qna')
}
</script>
