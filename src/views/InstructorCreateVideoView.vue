<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- 아이콘 -->
      <div class="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      </div>
      
      <!-- 제목 -->
      <h1 class="text-2xl font-bold text-gray-900 mb-4">동영상 강의 생성</h1>
      
      <!-- 설명 -->
      <p class="text-gray-600 mb-8">
        동영상 강의 생성 기능은 현재 개발 중입니다.<br>
        빠른 시일 내에 업데이트될 예정입니다.
      </p>
      
      <!-- 버튼들 -->
      <div class="space-y-3">
        <button 
          @click="$router.go(-1)"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          돌아가기
        </button>
        <button 
          @click="$router.push({ name: 'instructor-create-course' })"
          class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          다른 강의 유형 선택
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>