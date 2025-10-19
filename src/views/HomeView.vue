<template>
  <section class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-gray-600">데이터를 불러오는 중...</div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="flex justify-center items-center py-12">
        <div class="text-red-600">{{ error }}</div>
      </div>

      <!-- 정상 상태 -->
      <template v-else>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4 overflow-x-auto">
            <button
              v-for="cat in categories"
              :key="cat"
              class="px-3 py-2 text-sm rounded-md border"
              :class="activeTab === cat ? 'bg-gray-100 border-gray-300' : 'border-transparent hover:bg-gray-50'"
              @click="setTab(cat)"
            >
              {{ cat }}
            </button>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <select v-model="sortBy" class="h-9 rounded-md border px-2">
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="rating">평점순</option>
              <option value="reviews">리뷰순</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CourseCard v-for="c in visibleCourses" :key="c.id" :course="c" />
        </div>

        <div v-if="remainingCount > 0" class="flex justify-center mt-8">
          <button class="px-4 py-2 rounded-md border hover:bg-gray-50" @click="loadMore">더보기 ({{ remainingCount }})</button>
        </div>

        <!-- 결과 없음 메시지 -->
        <div v-if="visibleCourses.length === 0" class="flex justify-center items-center py-12">
          <div class="text-gray-500">검색 결과가 없습니다.</div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import CourseCard from '../components/course/CourseCard.vue';
import type { Course } from '../types/course';
import { useSearchStore } from '../stores/search';
import { useUiStore } from '../stores/ui';
import { curriculumApiService } from '../services/curriculumApi';

const searchStore = useSearchStore();
const ui = useUiStore();

const categories = searchStore.allCategories;
const activeTab = ref<string>('전체');
const sortBy = ref<'popular'|'latest'|'rating'|'reviews'>('popular');
const maxVisible = ref<number>(12);

// API 연동 상태 관리
const courses = ref<Course[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadCourses();
});

// 날짜 변환 헬퍼 함수
function formatDate(date: string | number[]): string {
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return date;
}

// 백엔드에서 커리큘럼 데이터 로드
async function loadCourses() {
  try {
    loading.value = true;
    error.value = null;

    const curriculums = await curriculumApiService.getPublicCurriculums();

    // CurriculumResponse를 Course로 직접 변환 (최소한의 변환만)
    courses.value = curriculums.map(curriculum => ({
      id: String(curriculum.id),
      title: curriculum.title,
      instructor: curriculum.author?.username || '알 수 없음',
      category: curriculum.category || '미분류',
      rating: curriculum.averageRating || 0,
      studentCount: curriculum.studentCount || 0,
      reviewsCount: curriculum.reviewsCount || 0,
      price: 0,
      tags: curriculum.tags || [],
      languages: curriculum.languages || [],
      difficulty: curriculum.difficulty,
      description: curriculum.description,
      createdAt: formatDate(curriculum.createdAt),
      type: 'curriculum' as const,
      problemsCount: curriculum.totalLectureCount || 0,
      thumbnail: curriculum.thumbnailImageUrl,
      totalLectureCount: curriculum.totalLectureCount,
      thumbnailImageUrl: curriculum.thumbnailImageUrl
    }));
  } catch (err) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
    courses.value = [];
  } finally {
    loading.value = false;
  }
}

function setTab(cat: string) {
  activeTab.value = cat;
}

const filteredByTab = computed<Course[]>(() => {
  const list = courses.value.slice();
  if (activeTab.value !== '전체') {
    return list.filter((c) => c.category === activeTab.value);
  }
  return list;
});

const filteredBySearch = computed<Course[]>(() => {
  return searchStore.searchCourses(ui.searchQuery, courses.value).filter((c) => filteredByTab.value.includes(c));
});

const sortedCourses = computed<Course[]>(() => {
  const list = filteredBySearch.value.slice();
  switch (sortBy.value) {
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    case 'latest':
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      list.sort((a, b) => (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating));
  }
  return list;
});

const visibleCourses = computed<Course[]>(() => sortedCourses.value.slice(0, maxVisible.value));
const remainingCount = computed(() => Math.max(sortedCourses.value.length - maxVisible.value, 0));
function loadMore() {
  maxVisible.value += 12;
}
</script>
