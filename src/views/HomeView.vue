<template>
  <section class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- 로딩 상태 -->
      <div v-if="loading && courses.length === 0" class="flex justify-center items-center py-12">
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

        <!-- 로딩 중 -->
        <div v-if="loading && courses.length > 0" class="flex justify-center mt-8">
          <div class="text-gray-600">로딩 중...</div>
        </div>

        <!-- 스크롤 감지를 위한 sentinel 요소 -->
        <div ref="sentinel" class="h-4"></div>

        <!-- 결과 없음 메시지 -->
        <div v-if="visibleCourses.length === 0" class="flex justify-center items-center py-12">
          <div class="text-gray-500">검색 결과가 없습니다.</div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import CourseCard from '../components/course/CourseCard.vue';
import type { Course } from '../types/course';
import { useSearchStore } from '../stores/search';
import { useUiStore } from '../stores/ui';
import { curriculumApiService } from '../services/curriculumApi';
import { getCurrentUserId } from '../config/api';

const searchStore = useSearchStore();
const ui = useUiStore();

const categories = searchStore.allCategories;
const activeTab = ref<string>('전체');
const sortBy = ref<'popular'|'latest'|'rating'|'reviews'>('popular');

// API 연동 상태 관리
const courses = ref<Course[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// 페이징 상태
const currentPage = ref<number>(0);
const hasMore = ref<boolean>(true);
const pageSize = 12;

// Intersection Observer를 위한 sentinel 요소
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// 컴포넌트 마운트 시 데이터 로드 및 observer 설정
onMounted(async () => {
  await loadCourses();

  // Intersection Observer 설정
  if (sentinel.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore.value && !loading.value) {
          loadCourses();
        }
      },
      {
        rootMargin: '100px' // 화면 하단 100px 전에 미리 로드
      }
    );
    observer.observe(sentinel.value);
  }
});

// 컴포넌트 언마운트 시 observer 정리
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// 날짜 변환 헬퍼 함수
function formatDate(date: string | number[]): string {
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return date;
}

// 백엔드에서 커리큘럼 데이터 로드 (페이징) - 사용자 맞춤 추천 우선
async function loadCourses() {
  if (loading.value || !hasMore.value) return;

  try {
    loading.value = true;
    error.value = null;

    let response;
    const userId = getCurrentUserId();
    let useRecommended = false;

    // 로그인된 사용자이고 첫 페이지인 경우 사용자 맞춤 추천 API 사용 시도
    if (userId && currentPage.value === 0) {
      try {
        console.log('[홈 화면] 사용자 맞춤 추천 커리큘럼 로드 시도');
        response = await curriculumApiService.getRecommendedCurriculums(currentPage.value, pageSize);
        if (response && response.curriculums && Array.isArray(response.curriculums)) {
          console.log('[홈 화면] 사용자 맞춤 추천 성공:', response.curriculums.length, '개');
          useRecommended = true;
        } else {
          throw new Error('추천 API 응답 형식이 올바르지 않습니다.');
        }
      } catch (recommendError: any) {
        console.warn('[홈 화면] 사용자 맞춤 추천 실패, 일반 목록 사용:', recommendError?.message || recommendError);
        useRecommended = false;
      }
    }

    // 추천 API를 사용하지 않거나 실패한 경우 일반 목록 사용
    if (!useRecommended) {
      response = await curriculumApiService.getPublicCurriculumsPaginated(currentPage.value, pageSize);
    }

    // 응답이 올바른지 확인
    if (!response || !response.curriculums || !Array.isArray(response.curriculums)) {
      console.error('[홈 화면] 잘못된 응답 형식:', response);
      throw new Error('잘못된 응답 형식입니다.');
    }

    // CurriculumResponse를 Course로 직접 변환
    const newCourses = response.curriculums.map(curriculum => ({
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

    // 기존 데이터에 추가
    courses.value = [...courses.value, ...newCourses];

    // 다음 페이지가 있는지 확인
    hasMore.value = response.meta?.next_page !== null && response.meta?.next_page !== undefined;
    currentPage.value++;
  } catch (err: any) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
    // 에러 발생 시 hasMore를 false로 설정하여 무한 로딩 방지
    hasMore.value = false;
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
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      break;
    case 'latest':
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      list.sort((a, b) => ((b.reviewsCount || 0) * b.rating) - ((a.reviewsCount || 0) * a.rating));
  }
  return list;
});

const visibleCourses = computed<Course[]>(() => sortedCourses.value);
</script>
