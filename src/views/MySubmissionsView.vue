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
          <button @click="refresh" class="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">새로고침</button>
        </div>
      </div>
    </div>

    <!-- 필터 바 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex flex-wrap gap-3 items-center">
        <input v-model="filters.problemId" type="text" placeholder="문제 번호" class="px-3 py-2 border rounded-lg text-sm" />
        <input v-model="filters.userId" type="text" placeholder="아이디" class="px-3 py-2 border rounded-lg text-sm" />
        <select v-model="filters.result" class="px-3 py-2 border rounded-lg text-sm">
          <option value="">모든 결과</option>
          <option value="AC">맞았습니다!!</option>
          <option value="WA">틀렸습니다</option>
          <option value="RE">런타임 에러</option>
          <option value="CE">컴파일 에러</option>
          <option value="TLE">시간 초과</option>
        </select>
        <select v-model="filters.language" class="px-3 py-2 border rounded-lg text-sm">
          <option value="">모든 언어</option>
          <option v-for="lang in languages" :key="lang.id" :value="lang.name">{{ lang.name }}</option>
        </select>
        <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">검색</button>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="px-6 py-6">
      <div class="bg-white border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="text-left font-medium text-gray-600 px-4 py-3">제출 시간</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">아이디</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">문제</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">결과</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">메모리</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">시간</th>
                <th class="text-left font-medium text-gray-600 px-4 py-3">언어</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filtered" :key="item.id" class="border-b hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-600">{{ item.submittedAt }}</td>
                <td class="px-4 py-3 text-blue-600 hover:underline cursor-pointer">{{ item.userId }}</td>
                <td class="px-4 py-3">
                  <router-link :to="{ name: 'problem', params: { problemId: item.problemId } }" class="text-blue-600 hover:underline">
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
                <td colspan="7" class="px-4 py-12 text-center text-gray-500">제출 기록이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type Submission = {
  id: string
  submittedAt: string
  userId: string
  problemId: string
  result: 'AC' | 'WA' | 'RE' | 'CE' | 'TLE'
  memory: string
  time: string
  language: string
}

const languages = ref([
  { id: 71, name: 'Python (3.8.1)' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  { id: 54, name: 'C++ (GCC 9.2.0)' },
  { id: 48, name: 'C (GCC 7.4.0)' },
]);

const filters = ref({
  problemId: '',
  userId: '',
  result: '',
  language: ''
});

const submissions = ref<Submission[]>([]);

onMounted(() => {
  load();
});

function load() {
  const saved = localStorage.getItem('mySubmissions');
  if (saved) {
    submissions.value = JSON.parse(saved);
  } else {
    // 예시 데이터
    submissions.value = [
      { id: 's1', submittedAt: '2025-10-01 14:03', userId: 'tg99536', problemId: '1001', result: 'AC', memory: '17748 KB', time: '208 ms', language: 'Python (3.8.1)' },
      { id: 's2', submittedAt: '2025-10-01 13:42', userId: 'tg99536', problemId: '1000', result: 'WA', memory: '-', time: '152 ms', language: 'Java (OpenJDK 13.0.1)' },
      { id: 's3', submittedAt: '2025-10-01 12:20', userId: 'tg99536', problemId: '2557', result: 'AC', memory: '10240 KB', time: '32 ms', language: 'C++ (GCC 9.2.0)' },
    ];
    localStorage.setItem('mySubmissions', JSON.stringify(submissions.value));
  }
}

function refresh() {
  load();
}

const filtered = computed(() => {
  return submissions.value.filter((s) => {
    return (
      (!filters.value.problemId || s.problemId.includes(filters.value.problemId)) &&
      (!filters.value.userId || s.userId.includes(filters.value.userId)) &&
      (!filters.value.result || s.result === filters.value.result) &&
      (!filters.value.language || s.language === filters.value.language)
    );
  });
});

function applyFilters() {
  // 반응형 computed가 자동 반영하므로 별도 처리 없음
}

function resultLabel(code: Submission['result']): string {
  switch (code) {
    case 'AC': return '맞았습니다!!';
    case 'WA': return '틀렸습니다';
    case 'RE': return '런타임 에러';
    case 'CE': return '컴파일 에러';
    case 'TLE': return '시간 초과';
    default: return code;
  }
}

function resultBadgeClass(code: Submission['result']): string {
  switch (code) {
    case 'AC': return 'bg-green-100 text-green-700 border border-green-200';
    case 'WA': return 'bg-red-100 text-red-700 border border-red-200';
    case 'RE': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'CE': return 'bg-purple-100 text-purple-700 border border-purple-200';
    case 'TLE': return 'bg-orange-100 text-orange-700 border border-orange-200';
    default: return '';
  }
}
</script>


