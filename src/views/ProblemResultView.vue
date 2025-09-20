<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">개발 - 프로그래밍 / 모바일 앱 개발</h1>
            <p class="text-sm text-gray-600">[코드팩토리] [초급] Flutter 3.0 앱 개발 - 10개의 프로젝트로 오늘 초보 탈출!</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex justify-center items-center min-h-[calc(100vh-80px)] p-8">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <!-- 채점 결과 -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">채점 결과: {{ successRate }}% 성공!!</h2>
          <p class="text-gray-600"># 테스트 케이스</p>
        </div>

        <!-- 테스트 케이스 결과 테이블 -->
        <div class="mb-8">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">입력</th>
                  <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">출력</th>
                  <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">성공여부</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(testCase, index) in testResults" :key="index">
                  <td class="border border-gray-300 px-4 py-3 font-mono text-sm">{{ testCase.input }}</td>
                  <td class="border border-gray-300 px-4 py-3 font-mono text-sm">{{ testCase.output }}</td>
                  <td class="border border-gray-300 px-4 py-3">
                    <span 
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        testCase.isSuccess 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ testCase.isSuccess ? '성공' : '실패' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 통계 정보 -->
        <div class="bg-gray-50 rounded-lg p-4 mb-8">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold text-blue-600">{{ successCount }}</p>
              <p class="text-sm text-gray-600">성공</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-red-600">{{ failureCount }}</p>
              <p class="text-sm text-gray-600">실패</p>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-600">{{ totalTests }}</p>
              <p class="text-sm text-gray-600">전체</p>
            </div>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div class="flex justify-center space-x-4">
          <button 
            @click="tryAgain"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            다시풀기
          </button>
          <button 
            @click="goNext"
            class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            넘어가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 테스트 결과 데이터
const testResults = ref([
  {
    input: '1 1',
    output: '2',
    isSuccess: true
  },
  {
    input: '2 3',
    output: '5',
    isSuccess: true
  },
  {
    input: '3 4',
    output: '7',
    isSuccess: true
  },
  {
    input: '9 8',
    output: '17',
    isSuccess: true
  },
  {
    input: '5 2',
    output: '8', // 잘못된 답 (실제로는 7이어야 함)
    isSuccess: false
  }
])

// 통계 계산
const successCount = computed(() => testResults.value.filter(r => r.isSuccess).length)
const failureCount = computed(() => testResults.value.filter(r => !r.isSuccess).length)
const totalTests = computed(() => testResults.value.length)
const successRate = computed(() => Math.round((successCount.value / totalTests.value) * 100))

// 다시풀기
function tryAgain() {
  // 문제 페이지로 돌아가기
  const problemId = route.params.problemId
  router.push({ name: 'problem', params: { problemId } })
}

// 넘어가기
function goNext() {
  // 다음 강의로 이동 (현재는 커리큘럼 상세 페이지로 이동)
  router.push({ name: 'curriculum-detail', params: { id: 'course_1' } })
}

// 뒤로가기
function goBack() {
  router.back()
}

// 컴포넌트 마운트 시 실제 채점 결과를 받아올 수 있음
onMounted(() => {
  // 실제로는 백엔드에서 채점 결과를 받아와야 함
  console.log('채점 결과 페이지 로드됨')
})
</script>
