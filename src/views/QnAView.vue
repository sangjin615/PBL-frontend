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
            @click="setActiveTab(tab.id)"
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
              v-model="searchKeyword"
              type="text"
              placeholder="Search"
              @input="handleSearch"
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

      <!-- 로딩 스피너 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 에러 메시지 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
        <button @click="fetchQuestions" class="mt-2 text-red-600 hover:text-red-800 underline">
          다시 시도
        </button>
      </div>

      <!-- 질문 목록 테이블 -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  question.status === 'UNRESOLVED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                ]">
                  {{ question.status === 'UNRESOLVED' ? '미해결' : '해결' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ question.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ getCategoryLabel(question.category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ question.course || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="question.language" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ question.language }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-900">{{ question.authorName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-900">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  {{ question.commentCount }}
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
                {{ formatDate(question.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 데이터 없음 -->
        <div v-if="!loading && questions.length === 0" class="text-center py-12 text-gray-500">
          질문이 없습니다. 첫 번째 질문을 작성해보세요!
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="!loading && totalPages > 0" class="flex items-center justify-between mt-6">
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 0"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-2 text-sm rounded',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ page + 1 }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
        <div class="text-sm text-gray-500">
          총 {{ totalElements }}개 질문
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import qnaApiService from '@/services/qnaApi'
import type { QuestionListResponse, QuestionStatus, QuestionCategory } from '@/types/qna'

const router = useRouter()
const ui = useUiStore()

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
  { id: 'unresolved', name: '미해결' },
  { id: 'resolved', name: '해결' },
])

const activeTab = ref('all')

// 상태 관리
const questions = ref<QuestionListResponse[]>([])
const loading = ref(false)
const error = ref('')
const searchKeyword = ref('')

// 페이지네이션 설정
const currentPage = ref(0) // 0-based
const totalPages = ref(0)
const totalElements = ref(0)
const pageSize = 20

// 보이는 페이지 번호 계산 (최대 5개)
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(0, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible)

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible)
  }

  for (let i = start; i < end; i++) {
    pages.push(i)
  }

  return pages
})

// 질문 목록 조회
async function fetchQuestions() {
  loading.value = true
  error.value = ''

  try {
    const filterStatus: QuestionStatus | undefined =
      activeTab.value === 'unresolved' ? 'UNRESOLVED' :
      activeTab.value === 'resolved' ? 'RESOLVED' :
      undefined

    // 헤더 서치바 검색어와 로컬 검색어 중 하나라도 있으면 사용
    const keyword = ui.searchQuery?.trim() || searchKeyword.value?.trim() || undefined;

    const response = await qnaApiService.searchQuestions({
      keyword: keyword,
      status: filterStatus,
      page: currentPage.value,
      size: pageSize,
      sort: 'createdAt,DESC'
    })

    questions.value = response.content
    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
  } catch (err: any) {
    error.value = err.message || '질문 목록을 불러오는데 실패했습니다.'
    console.error('질문 목록 조회 실패:', err)
  } finally {
    loading.value = false
  }
}

// 탭 변경
function setActiveTab(tabId: string) {
  activeTab.value = tabId
  currentPage.value = 0 // 페이지 초기화
  fetchQuestions()
}

// 검색 처리 (디바운스 적용)
let searchTimeout: number | null = null
function handleSearch() {
  // 헤더 서치바 검색어와 동기화
  if (searchKeyword.value) {
    ui.setSearchQuery(searchKeyword.value);
  }
  
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = window.setTimeout(() => {
    currentPage.value = 0 // 페이지 초기화
    fetchQuestions()
  }, 300) // 300ms 디바운스
}

// 헤더 서치바 검색어 변경 감지
watch(() => ui.searchQuery, (newQuery) => {
  // 헤더에서 검색하면 로컬 검색어와 동기화하고 검색 수행
  if (newQuery !== searchKeyword.value) {
    searchKeyword.value = newQuery || '';
    currentPage.value = 0;
    fetchQuestions();
  }
});

// 페이지 변경 함수
function changePage(page: number) {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchQuestions()
  }
}

// 카테고리 한글 라벨
function getCategoryLabel(category: QuestionCategory): string {
  const labels: Record<QuestionCategory, string> = {
    'QUESTION': '질문',
    'TIP': '팁',
    'BUG_REPORT': '버그 리포트',
    'FEATURE_REQUEST': '기능 요청',
    'GENERAL': '일반'
  }
  return labels[category] || category
}

// 날짜 포맷팅
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 컴포넌트 마운트 시 질문 목록 조회
onMounted(() => {
  fetchQuestions()
})
</script>
