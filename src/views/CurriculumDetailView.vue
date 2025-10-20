<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div class="bg-figma-1 border-b" style="border-color: rgb(var(--figma-color-4))">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 뒤로가기 버튼 -->
            <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div v-if="curriculum">
              <h1 class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">{{ curriculum.title }}</h1>
              <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">{{ curriculum.instructor }} • {{ curriculum.category }}</p>
            </div>
          </div>

          <!-- 액션 버튼들 -->
          <div class="flex items-center space-x-3">
            <button class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors" style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))">
              공유하기
            </button>
            <button class="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style="background-color: rgb(var(--figma-color-6))">
              채널 관리
            </button>
            <button 
              v-if="curriculum"
              @click="() => alert('커리큘럼 신고: ' + curriculum.title)"
              class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
            >
              🚨 신고
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-gray-600">데이터를 불러오는 중...</div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex justify-center items-center py-12">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div v-else class="px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 왼쪽: 커리큘럼 정보 -->
        <div class="lg:col-span-2">
          <!-- 커리큘럼 썸네일 -->
          <div 
            class="h-64 rounded-lg mb-6 flex items-center justify-center text-6xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
          </div>

          <!-- 커리큘럼 설명 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
            <h2 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼 소개</h2>
            <p class="text-gray-600 leading-relaxed">{{ curriculum.description }}</p>
          </div>

          <!-- 탭 네비게이션 -->
          <div class="bg-figma-1 rounded-lg border mb-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex border-b" style="border-color: rgb(var(--figma-color-4))">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'"
              >
                {{ tab.name }}
                <div 
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                ></div>
              </button>
            </div>
            
            <!-- 탭 컨텐츠 -->
            <div class="p-6">
              <!-- 강의 탭 -->
              <div v-if="activeTab === 'lectures'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">이어서 학습하기</h3>
                
                <div v-if="lectures.length > 0" class="space-y-4">
                  <div
                    v-for="(lecture, index) in lectures"
                    :key="lecture.id"
                    class="flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer bg-white border-gray-200 hover:bg-gray-50"
                    style="border-color: rgb(var(--figma-color-4))"
                    @click="goToLecture(lecture.lectureId)"
                  >
                    <div class="flex items-center space-x-4">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style="background-color: rgb(var(--figma-color-6))">
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h4 class="font-medium" style="color: rgb(var(--figma-color-2))">{{ lecture.lectureTitle }}</h4>
                        <p class="text-sm" style="color: rgb(var(--figma-color-5))">형태: {{ lecture.lectureType }} • {{ formatDate(lecture.createdAt) }}</p>
                      </div>
                    </div>

                    <button
                      class="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
                      style="background-color: rgb(var(--figma-color-6))"
                      @click.stop="goToLecture(lecture.lectureId)"
                    >
                      학습하기
                    </button>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">커리큘럼 정보를 불러오는 중...</p>
                </div>
              </div>
              
              <!-- 리뷰 탭 -->
              <div v-else-if="activeTab === 'reviews'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">리뷰</h3>
                <p class="text-gray-600">리뷰가 아직 없습니다.</p>
              </div>
              
              <!-- 문의 탭 -->
              <div v-else-if="activeTab === 'inquiries'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">문의</h3>
                <p class="text-gray-600">문의가 아직 없습니다.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 커리큘럼 정보 카드 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼 정보</h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">강의자</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.instructor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">카테고리</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">총 강의 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.totalLectureCount }}개</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">총 소요 시간</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.durationMinutes ? `${curriculum.durationMinutes}분` : '미정' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">난이도</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.difficulty || '미정' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">수강생 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.studentCount || enrollmentCount }}명
                </span>
              </div>
            </div>
          </div>

          <!-- 태그 -->
          <div v-if="curriculum && curriculum.tags?.length > 0" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">태그</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in curriculum.tags"
                :key="tag"
                class="px-3 py-1 text-xs rounded-full font-medium"
                style="background-color: rgb(var(--figma-color-7)); color: rgb(var(--figma-color-6))"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 학습 목표 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <h3 class="font-semibold mb-4" style="color: rgb(var(--figma-color-2))">학습 목표</h3>
            <ul class="space-y-2">
              <li v-for="goal in hardcodedData.learningGoals" :key="goal" class="flex items-start space-x-2">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" style="color: rgb(var(--figma-color-2))">{{ goal }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { curriculumApiService } from '@/services/curriculumApi';
import { enrollmentApiService } from '@/services/enrollmentApi';
import { ReportButton } from '@/components/common';
import type { CurriculumDetailResponse, CurriculumLectureResponse } from '@/types/curriculum';

const route = useRoute();
const router = useRouter();

// 상태 관리
const curriculum = ref<any>(null);
const lectures = ref<CurriculumLectureResponse[]>([]);
const enrollmentCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);

// 탭 상태
const activeTab = ref('lectures');

// 탭 옵션
const tabs = ref([
  { id: 'lectures', name: '강의' },
  { id: 'reviews', name: '리뷰' },
  { id: 'inquiries', name: '문의' }
]);

// TODO: 백엔드 API 미구현 항목 (백엔드_API_추가_개발_요청.md 참고)
// - learningGoals: CurriculumResponse에 learningGoals 필드 추가 필요
//   → @ElementCollection으로 List<String> learningGoals 추가 후 hardcodedData.learningGoals 제거
const hardcodedData = {
  learningGoals: [
    'API 연결없음(기본값 = "알고리즘의 기본 개념과 복잡도 분석")'
  ]
};

// 커리큘럼 상세 정보 로드
async function loadCurriculumDetail() {
  try {
    loading.value = true;
    error.value = null;

    const curriculumId = Number(route.params.id);
    const data: CurriculumDetailResponse = await curriculumApiService.getCurriculumById(curriculumId);

    // 커리큘럼 정보 설정 (백엔드 API 응답을 직접 사용)
    curriculum.value = {
      ...data,
      instructor: data.author?.username || '알 수 없음',
      category: data.category || '미분류',
      tags: data.tags || []
    };

    // 강의 목록 정렬 (orderIndex 순)
    lectures.value = (data.lectures || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // 수강자 수 조회
    try {
      const countData = await enrollmentApiService.getCurriculumEnrollmentCount(curriculumId);
      enrollmentCount.value = countData.enrollmentCount;
    } catch (err) {
      console.warn('수강자 수 조회 실패:', err);
      enrollmentCount.value = 0;
    }

  } catch (err) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '커리큘럼 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 날짜 포맷팅
function formatDate(dateValue: string | number[]): string {
  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue;
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  } else {
    const date = new Date(dateValue);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }
}

// 강의로 이동
function goToLecture(lectureId: number) {
  const curriculumId = route.params.id;
  router.push({
    name: 'lecture',
    params: { lectureId },
    query: { curriculumId }
  });
}

// 신고 완료 처리
function handleReported() {
  console.log('커리큘럼 신고가 접수되었습니다.');
}

onMounted(() => {
  loadCurriculumDetail();
});
</script>