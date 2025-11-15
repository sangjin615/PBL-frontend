<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold">내 제출</h1>
          <p class="text-sm text-gray-600">최근 제출 기록을 확인하세요</p>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="refresh" variant="ghost" size="sm">새로고침</Button>
        </div>
      </div>
    </div>

    <!-- 필터 바 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex flex-wrap gap-3 items-center">
        <FormInput v-model="filters.problemId" placeholder="문제 번호" class="w-32" />
        <FormSelect v-model="filters.result" :options="resultOptions" class="w-36" />
        <FormSelect v-model="filters.language" :options="languageOptions" class="w-36" />
        <Button @click="applyFilters" variant="primary" size="sm">검색</Button>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
      {{ error }}
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="px-6 py-12 text-center text-gray-500">
      <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
      로딩 중...
    </div>

    <!-- 테이블 -->
    <div v-else class="px-6 py-6">
      <div class="bg-white border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left font-medium text-gray-600 px-4 py-3">제출 시간</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">문제</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">결과</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">메모리</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">시간</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">언어</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filtered" :key="item.token" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-600">{{ item.submittedAt }}</td>
                <td class="px-4 py-3">
                  <router-link :to="{ name: 'lecture', params: { lectureId: item.problemId }, query: { token: item.token } }" class="text-blue-600 hover:underline">
                    {{ item.problemId }}
                  </router-link>
                </td>
                <td class="px-4 py-3">
                  <span :class="resultBadgeClass(item.result)" class="px-2 py-1 rounded text-xs font-medium">{{ resultLabel(item.result) }}</span>
                </td>
                <td class="px-4 py-3">{{ item.memory }}</td>
                <td class="px-4 py-3">{{ item.time }}</td>
                <td class="px-4 py-3">{{ item.language }}</td>
              </tr>
              <tr v-if="filtered.length === 0">
                <td colspan="6" class="px-4 py-12 text-center text-gray-500">제출 기록이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="!loading && totalPages > 1" class="px-6 pb-6 flex justify-center gap-2">
      <Button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" variant="ghost" size="sm">
        이전
      </Button>
      <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
      <Button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages" variant="ghost" size="sm">
        다음
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button, FormInput, FormSelect } from '@/components/common'
import { useAuth } from '@/composables/useAuth'
import { gradingAPI, type GradingResponse } from '@/services/gradingAPI'

const router = useRouter()
const { userId: currentUserId, currentUser } = useAuth()

// 화면 표시용 타입
interface DisplaySubmission {
  id: number
  token: string
  submittedAt: string
  problemId: number
  result: 'AC' | 'WA' | 'RE' | 'CE' | 'TLE' | 'Processing' | 'Unknown'
  memory: string
  time: string
  language: string
  languageId: number
}

const languages = ref([
  { id: 71, name: 'Python (3.8.1)' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  { id: 54, name: 'C++ (GCC 9.2.0)' },
  { id: 48, name: 'C (GCC 7.4.0)' },
]);

const resultOptions = [
  { value: '', label: '모든 결과' },
  { value: 'AC', label: '맞았습니다!!' },
  { value: 'WA', label: '틀렸습니다' },
  { value: 'RE', label: '런타임 에러' },
  { value: 'CE', label: '컴파일 에러' },
  { value: 'TLE', label: '시간 초과' },
  { value: 'Processing', label: '채점 중' }
];

const languageOptions = computed(() => {
  // 실제 제출 내역에서 사용된 언어만 추출 (중복 제거)
  const usedLanguages = [...new Set(submissions.value.map(s => s.language))];

  return [
    { value: '', label: '모든 언어' },
    ...usedLanguages.map(lang => ({ value: lang, label: lang }))
  ];
});

const filters = ref({
  problemId: '',
  result: '',
  language: ''
});

const submissions = ref<DisplaySubmission[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 20;

onMounted(() => {
  load();
});

// 상태 코드를 결과 코드로 변환 (Status.java 기준)
function mapStatusToResult(statusId?: number): DisplaySubmission['result'] {
  switch (statusId) {
    case 3: return 'AC';   // Accepted
    case 4: return 'WA';   // Wrong Answer
    case 5: return 'TLE';  // Time Limit Exceeded
    case 6: return 'TLE';  // Memory Limit Exceeded (시간초과로 표시)
    case 7: return 'CE';   // Compilation Error
    case 8:  // SIGSEGV
    case 9:  // SIGXFSZ
    case 10: // SIGFPE
    case 11: // SIGABRT
    case 12: // NZEC
    case 13: return 'RE';  // Runtime Errors
    case 1:
    case 2: return 'Processing';
    default: return 'Unknown';
  }
}

// language_id를 언어 이름으로 변환
function getLanguageName(languageId?: number): string {
  const lang = languages.value.find(l => l.id === languageId);
  return lang?.name || `Language ${languageId}`;
}

// GradingResponse를 DisplaySubmission으로 변환
function convertToDisplaySubmission(grade: GradingResponse): DisplaySubmission {
  return {
    id: grade.id || 0,
    token: grade.token || '',
    submittedAt: grade.created_at
      ? new Date(grade.created_at).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      : '-',
    problemId: grade.problem_id || 0,
    result: mapStatusToResult(grade.status?.id),
    memory: grade.memory ? `${grade.memory} KB` : '-',
    time: grade.time ? `${Number(grade.time).toFixed(3)} s` : '-',
    language: getLanguageName(grade.language_id),
    languageId: grade.language_id || 0
  };
}

async function load() {
  if (!currentUserId.value) {
    error.value = '로그인이 필요합니다.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // API 호출: 현재 사용자의 채점 목록 가져오기
    // 백엔드는 0-based 페이지를 사용하므로 -1
    const response = await gradingAPI.getGradingList(
      currentPage.value - 1,
      perPage,
      filters.value.problemId ? Number(filters.value.problemId) : undefined,
      false, // base64_encoded
      undefined // fields
    );

    // GradingResponse를 DisplaySubmission으로 변환
    submissions.value = response.grade.map(convertToDisplaySubmission);

    // 페이지네이션 정보 업데이트
    totalPages.value = response.meta.total_pages;

  } catch (err: any) {
    console.error('채점 목록 로드 실패:', err);
    error.value = err.message || '데이터를 불러오는데 실패했습니다.';
    submissions.value = [];
  } finally {
    loading.value = false;
  }
}

function refresh() {
  load();
}

// 클라이언트 사이드 필터링 (result와 language만)
const filtered = computed(() => {
  return submissions.value.filter((s) => {
    return (
      (!filters.value.result || s.result === filters.value.result) &&
      (!filters.value.language || s.language === filters.value.language)
    );
  });
});

function applyFilters() {
  currentPage.value = 1; // 페이지 초기화
  load(); // API 재호출
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    load();
  }
}

function resultLabel(code: DisplaySubmission['result']): string {
  switch (code) {
    case 'AC': return '맞았습니다!!';
    case 'WA': return '틀렸습니다';
    case 'RE': return '런타임 에러';
    case 'CE': return '컴파일 에러';
    case 'TLE': return '시간 초과';
    case 'Processing': return '채점 중';
    default: return code;
  }
}

function resultBadgeClass(code: DisplaySubmission['result']): string {
  switch (code) {
    case 'AC': return 'bg-green-100 text-green-700 border border-green-200';
    case 'WA': return 'bg-red-100 text-red-700 border border-red-200';
    case 'RE': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'CE': return 'bg-purple-100 text-purple-700 border border-purple-200';
    case 'TLE': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'Processing': return 'bg-blue-100 text-blue-700 border border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}
</script>
