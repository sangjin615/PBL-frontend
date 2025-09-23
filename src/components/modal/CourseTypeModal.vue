<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4" @click.stop>
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">강의 유형 선택</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 옵션들 -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 페이지 제작 (마크다운) -->
          <div 
            @click="selectType('markdown')"
            class="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
          >
            <div class="text-center">
              <!-- 아이콘 -->
              <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              
              <!-- 제목 -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2">페이지 제작</h3>
              
              <!-- 설명 -->
              <p class="text-sm text-gray-600 leading-relaxed">
                마크다운 기반의 페이지를 생성합니다. 강의 노트를 빠르게 작성하기 적합합니다.
              </p>
            </div>
          </div>

          <!-- 문제 생성 -->
          <div 
            @click="selectType('problem')"
            class="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-green-500 hover:shadow-md transition-all duration-200 group"
          >
            <div class="text-center">
              <!-- 아이콘 -->
              <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              
              <!-- 제목 -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2">문제 생성</h3>
              
              <!-- 설명 -->
              <p class="text-sm text-gray-600 leading-relaxed">
                프로그래밍 문제를 생성합니다. 테스트 케이스와 함께 코딩 문제를 만들 수 있습니다.
              </p>
            </div>
          </div>

          <!-- 동영상 첨부 -->
          <div 
            @click="selectType('video')"
            class="border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-purple-500 hover:shadow-md transition-all duration-200 group"
          >
            <div class="text-center">
              <!-- 아이콘 -->
              <div class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              
              <!-- 제목 -->
              <h3 class="text-lg font-semibold text-gray-900 mb-2">동영상 첨부</h3>
              
              <!-- 설명 -->
              <p class="text-sm text-gray-600 leading-relaxed">
                동영상 파일을 업로드하여 강의를 제작합니다. 시각적 학습에 적합합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'select', type: 'markdown' | 'problem' | 'video'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function closeModal() {
  emit('close')
}

function selectType(type: 'markdown' | 'problem' | 'video') {
  emit('select', type)
  closeModal()
}
</script>
