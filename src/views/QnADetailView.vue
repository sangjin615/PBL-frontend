<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">질문&답변</h1>
      <p class="text-gray-600">| 자유롭게 물어보고 답변해봐요.</p>
    </div>

    <!-- 로딩 스피너 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 에러 메시지 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
      <button @click="fetchQuestion" class="mt-2 text-red-600 hover:text-red-800 underline">
        다시 시도
      </button>
    </div>

    <!-- 질문 게시글 -->
    <div v-else-if="question" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <!-- 질문 작성자 정보 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ question.authorName }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(question.createdAt) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <!-- 해결/미해결 상태 배지 (질문 작성자만 클릭 가능) -->
          <button
            v-if="isQuestionAuthor"
            @click="toggleQuestionResolve"
            :disabled="resolving"
            :class="[
              'px-3 py-1 text-sm font-semibold rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              question.status === 'RESOLVED'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            ]"
          >
            {{ resolving ? '처리 중...' : (question.status === 'RESOLVED' ? '해결' : '미해결') }}
          </button>
          <span
            v-else
            :class="[
              'px-3 py-1 text-sm font-semibold rounded-full',
              question.status === 'RESOLVED'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            ]"
          >
            {{ question.status === 'RESOLVED' ? '해결' : '미해결' }}
          </span>
          
          <!-- 메뉴 아이콘 -->
          <div class="relative">
            <button
              @click.stop="showMenu = !showMenu"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
            
            <!-- 드롭다운 메뉴 -->
            <div
              v-if="showMenu"
              @click.stop
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
            >
              <div class="py-1">
                <!-- 삭제 옵션 (질문 작성자만) -->
                <button
                  v-if="isQuestionAuthor"
                  @click="handleDeleteQuestion"
                  :disabled="deleting"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>{{ deleting ? '삭제 중...' : '게시글 삭제' }}</span>
                  </div>
                </button>
                
                <!-- 신고 옵션 -->
                <button
                  @click="handleReportQuestion"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>신고</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 질문 제목 -->
      <h2 class="text-xl font-bold text-gray-900 mb-3">{{ question.title }}</h2>

      <!-- 질문 메타 정보 -->
      <div class="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <span class="px-2 py-1 bg-gray-100 rounded">{{ getCategoryLabel(question.category) }}</span>
        <span v-if="question.course">강의: {{ question.course }}</span>
        <span v-if="question.language">언어: {{ question.language }}</span>
      </div>

      <!-- 질문 내용 -->
      <div class="text-gray-700 mb-4 whitespace-pre-wrap">{{ question.content }}</div>

      <!-- 질문 반응 및 시간 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="toggleQuestionLike"
            :disabled="liking"
            class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">{{ question.likes }}</span>
          </button>
          <div class="flex items-center space-x-1 text-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span class="text-sm">{{ question.answers.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 답변 영역 -->
    <div v-if="question" class="space-y-4 mb-6">
      <h3 class="text-lg font-bold text-gray-900">답변 ({{ question.answers.length }})</h3>

      <!-- 답변 목록 -->
      <div
        v-for="answer in question.answers"
        :key="answer.id"
        :class="[
          'rounded-lg shadow-sm border p-4 transition-colors',
          answer.isAccepted
            ? 'bg-green-50 border-green-300 border-2'
            : 'bg-white border-gray-200'
        ]"
      >
        <!-- 채택 배지 -->
        <div v-if="answer.isAccepted" class="inline-flex items-center px-3 py-1 mb-3 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
          ✓ 채택된 답변
        </div>

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ answer.authorName }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(answer.createdAt) }}</p>
            </div>
          </div>
        <div class="flex items-center space-x-2">
          <!-- 채택 버튼 (질문 작성자만, 아직 채택된 답변이 없을 때) -->
          <button
            v-if="isQuestionAuthor && !answer.isAccepted && !hasAcceptedAnswer"
              @click="acceptAnswer(answer.id)"
              :disabled="accepting"
              class="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              채택하기
            </button>
          <!-- 채택 취소 버튼 (질문 작성자만, 채택된 답변에만 표시) -->
          <button
            v-if="isQuestionAuthor && answer.isAccepted"
              @click="unacceptAnswer(answer.id)"
              :disabled="accepting"
              class="px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              채택 취소
            </button>
            <ReportButton
              report-type="comment"
              :target-id="answer.id"
              @reported="handleReported"
            />
          </div>
        </div>

        <p class="text-gray-700 mb-3 whitespace-pre-wrap">{{ answer.content }}</p>

        <div class="flex items-center justify-between">
          <button
            @click="toggleAnswerLike(answer.id)"
            class="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
            <span class="text-sm">{{ answer.likes }}</span>
          </button>
        </div>
      </div>

      <!-- 답변이 없을 때 -->
      <div v-if="question.answers.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
      </div>
    </div>

    <!-- 답변 작성 영역 -->
    <div v-if="question" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">답변 작성</h3>

      <textarea
        v-model="newAnswerContent"
        placeholder="답변을 입력하세요..."
        rows="6"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      ></textarea>

      <div class="flex items-center justify-between">
        <button
          @click="goBackToList"
          class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          <span>목록으로</span>
        </button>

        <button
          @click="submitAnswer"
          :disabled="submitting || !newAnswerContent.trim()"
          class="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
          <span>{{ submitting ? '등록 중...' : '답변 등록' }}</span>
        </button>
      </div>
    </div>

    <!-- 신고 모달 -->
    <ReportModal
      v-if="question"
      :is-open="showReportModal"
      report-type="post"
      :target-id="question.id"
      :target-title="question.title"
      @close="showReportModal = false"
      @success="handleReported"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ReportModal from '@/components/modal/ReportModal.vue'
import qnaApiService from '@/services/qnaApi'
import type { QuestionDetailResponse, QuestionCategory } from '@/types/qna'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()

// 현재 질문 데이터
const question = ref<QuestionDetailResponse | null>(null)
const loading = ref(false)
const error = ref('')

// 답변 작성 상태
const newAnswerContent = ref('')
const submitting = ref(false)

// 좋아요/채택/해결 상태
const liking = ref(false)
const accepting = ref(false)
const resolving = ref(false)

// 메뉴 및 삭제/신고 상태
const showMenu = ref(false)
const deleting = ref(false)
const showReportModal = ref(false)

// 질문 ID 가져오기
const questionId = computed(() => Number(route.params.id))

// 채택된 답변이 있는지 확인
const hasAcceptedAnswer = computed(() => {
  return question.value?.answers.some(answer => answer.isAccepted) || false
})

// 현재 로그인 사용자가 질문 작성자인지 여부
const isQuestionAuthor = computed(() => {
  if (!currentUser.value || !question.value) return false
  // 서버에서 authorName(문자열)만 내려오므로 username 비교
  return currentUser.value.username === question.value.authorName
})

// 질문 데이터 로드
async function fetchQuestion() {
  loading.value = true
  error.value = ''

  try {
    question.value = await qnaApiService.getQuestion(questionId.value)
  } catch (err: any) {
    error.value = err.message || '질문을 불러오는데 실패했습니다.'
    console.error('질문 조회 실패:', err)
  } finally {
    loading.value = false
  }
}

// 답변 작성
async function submitAnswer() {
  if (!newAnswerContent.value.trim()) {
    window.alert('답변 내용을 입력해주세요.')
    return
  }

  submitting.value = true

  try {
    await qnaApiService.createAnswer(questionId.value, {
      content: newAnswerContent.value
    })

    // 답변 작성 후 질문 재조회
    await fetchQuestion()

    // 입력 필드 초기화
    newAnswerContent.value = ''

    window.alert('답변이 성공적으로 등록되었습니다!')
  } catch (err: any) {
    error.value = err.message || '답변 등록에 실패했습니다.'
    window.alert(error.value)
    console.error('답변 등록 실패:', err)
  } finally {
    submitting.value = false
  }
}

// 질문 좋아요 토글
async function toggleQuestionLike() {
  if (!question.value) return

  liking.value = true

  try {
    // 낙관적 업데이트
    const originalLikes = question.value.likes
    question.value.likes++

    await qnaApiService.likeQuestion(questionId.value)
  } catch (err: any) {
    // 실패 시 롤백
    if (question.value) {
      question.value.likes--
    }
    console.error('좋아요 처리 실패:', err)
    window.alert('좋아요 처리 중 오류가 발생했습니다.')
  } finally {
    liking.value = false
  }
}

// 답변 좋아요 토글
async function toggleAnswerLike(answerId: number) {
  if (!question.value) return

  const answer = question.value.answers.find(a => a.id === answerId)
  if (!answer) return

  try {
    // 낙관적 업데이트
    answer.likes++

    await qnaApiService.likeAnswer(answerId)
  } catch (err: any) {
    // 실패 시 롤백
    answer.likes--
    console.error('좋아요 처리 실패:', err)
    window.alert('좋아요 처리 중 오류가 발생했습니다.')
  }
}

// 답변 채택
async function acceptAnswer(answerId: number) {
  // 방어적 체크: 질문 작성자가 아니면 차단
  if (!isQuestionAuthor.value) {
    window.alert('질문 작성자만 답변을 채택할 수 있습니다.')
    return
  }
  if (!window.confirm('이 답변을 채택하시겠습니까? 채택 시 질문이 자동으로 해결 상태로 변경됩니다.')) {
    return
  }

  accepting.value = true

  try {
    await qnaApiService.acceptAnswer(answerId)

    // 답변 채택 후 질문 재조회 (백엔드에서 자동으로 해결 상태로 변경)
    await fetchQuestion()

    // 재조회 후 상태 확인하여 사용자에게 알림
    if (question.value) {
      if (question.value.status === 'RESOLVED') {
        window.alert('답변이 채택되었고 질문이 해결 상태로 변경되었습니다!')
      } else {
        window.alert('답변이 채택되었습니다.')
      }
    }
  } catch (err: any) {
    error.value = err.message || '답변 채택에 실패했습니다.'
    window.alert(error.value)
    console.error('답변 채택 실패:', err)
  } finally {
    accepting.value = false
  }
}

// 답변 채택 취소
async function unacceptAnswer(answerId: number) {
  // 방어적 체크: 질문 작성자가 아니면 차단
  if (!isQuestionAuthor.value) {
    window.alert('질문 작성자만 채택을 취소할 수 있습니다.')
    return
  }
  if (!window.confirm('채택을 취소하시겠습니까? 취소 시 질문이 자동으로 미해결 상태로 변경됩니다.')) {
    return
  }

  accepting.value = true

  try {
    await qnaApiService.unacceptAnswer(answerId)

    // 채택 취소 후 질문 재조회 (채택 취소 시 자동으로 미해결 상태로 변경됨)
    await fetchQuestion()

    window.alert('채택이 취소되었고 질문이 미해결 상태로 변경되었습니다.')
  } catch (err: any) {
    error.value = err.message || '채택 취소에 실패했습니다.'
    window.alert(error.value)
    console.error('채택 취소 실패:', err)
  } finally {
    accepting.value = false
  }
}

// 질문 해결/미해결 토글
async function toggleQuestionResolve() {
  if (!isQuestionAuthor.value || !question.value) {
    window.alert('질문 작성자만 해결 상태를 변경할 수 있습니다.')
    return
  }

  resolving.value = true

  try {
    await qnaApiService.resolveQuestion(questionId.value)

    // 해결 상태 변경 후 질문 재조회
    await fetchQuestion()

    // 재조회 후 최신 상태 확인
    if (question.value) {
      const newStatus = question.value.status === 'RESOLVED' ? '해결' : '미해결'
      window.alert(`질문이 ${newStatus} 상태로 변경되었습니다.`)
    }
  } catch (err: any) {
    // 400 에러인 경우 특별 처리 (채택된 답변이 있어 미해결로 변경 불가)
    if (err.status === 400) {
      const errorMessage = err.message || '채택된 답변이 있어 질문을 미해결 상태로 변경할 수 없습니다. 먼저 답변 채택을 취소해주세요.'
      window.alert(errorMessage)
    } else {
      error.value = err.message || '해결 상태 변경에 실패했습니다.'
      window.alert(error.value)
    }
    console.error('해결 상태 변경 실패:', err)
  } finally {
    resolving.value = false
  }
}

// 게시글 삭제
async function handleDeleteQuestion() {
  if (!question.value) return;
  
  const confirmed = window.confirm('정말 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.');
  if (!confirmed) {
    showMenu.value = false;
    return;
  }

  deleting.value = true;
  try {
    await qnaApiService.deleteQuestion(questionId.value);
    window.alert('게시글이 삭제되었습니다.');
    // 목록으로 이동
    router.push({ name: 'qna' });
  } catch (err: any) {
    console.error('게시글 삭제 실패:', err);
    window.alert(err.message || '게시글 삭제에 실패했습니다.');
  } finally {
    deleting.value = false;
    showMenu.value = false;
  }
}

// 신고 모달 열기
function handleReportQuestion() {
  showMenu.value = false;
  showReportModal.value = true;
}

// 신고 완료 핸들러
function handleReported() {
  showReportModal.value = false;
  window.alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
}

// 메뉴 외부 클릭 감지
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (showMenu.value && !target.closest('.relative')) {
    showMenu.value = false;
  }
}

// 목록으로 돌아가기
function goBackToList() {
  router.push('/qna')
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

// 날짜 포맷팅 (배열 형태 지원 + 상대 시간)
function formatDate(dateValue: string | number[]): string {
  let date: Date

  if (Array.isArray(dateValue)) {
    // 백엔드 배열 형태: [year, month, day, hour, minute, second, nano]
    const [year, month, day, hour = 0, minute = 0] = dateValue
    date = new Date(year, month - 1, day, hour, minute)
  } else {
    date = new Date(dateValue)
  }

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

// 컴포넌트 마운트 시 질문 조회
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchQuestion();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
