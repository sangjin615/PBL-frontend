<template>
  <section class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- 로딩 상태 -->
      <div
        v-if="loading && courses.length === 0"
        class="flex justify-center items-center py-12"
      >
        <div class="text-gray-600">데이터를 불러오는 중...</div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="flex justify-center items-center py-12">
        <div class="text-red-600">{{ error }}</div>
      </div>

      <!-- 정상 상태 -->
      <template v-else>
        <!-- 검색 결과 헤더 -->
        <div v-if="isSearchMode" class="mb-4">
          <h2 class="text-lg font-semibold">
            "{{ ui.searchQuery }}" 검색 결과
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            커리큘럼과 강의를 통합 검색한 결과입니다.
          </p>
        </div>

        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4 overflow-x-auto">
            <button
              v-for="cat in categories"
              :key="cat"
              class="px-3 py-2 text-sm rounded-md border"
              :class="
                activeTab === cat
                  ? 'bg-gray-100 border-gray-300'
                  : 'border-transparent hover:bg-gray-50'
              "
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

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <CourseCard v-for="c in visibleCourses" :key="c.id" :course="c" />
        </div>

        <!-- 로딩 중 -->
        <div
          v-if="loading && courses.length > 0"
          class="flex justify-center mt-8"
        >
          <div class="text-gray-600">로딩 중...</div>
        </div>

        <!-- 스크롤 감지를 위한 sentinel 요소 -->
        <div ref="sentinel" class="h-4"></div>

        <!-- 결과 없음 메시지 -->
        <div
          v-if="visibleCourses.length === 0"
          class="flex justify-center items-center py-12"
        >
          <div class="text-gray-500">검색 결과가 없습니다.</div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import CourseCard from "../components/course/CourseCard.vue";
import type { Course } from "../types/course";
import { useSearchStore } from "../stores/search";
import { useUiStore } from "../stores/ui";
import { curriculumApiService } from "../services/curriculumApi";
import { searchApiService } from "../services/searchApi";
import { recommendationApiService } from "../services/recommendationApi";
import { getCurrentUserId } from "../config/api";
import type { Lecture } from "../types/lecture";

const searchStore = useSearchStore();
const ui = useUiStore();

const categories = searchStore.allCategories;
const activeTab = ref<string>("전체");
const sortBy = ref<"popular" | "latest" | "rating" | "reviews">("popular");

// API 연동 상태 관리
const courses = ref<Course[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// 페이징 상태
const currentPage = ref<number>(0);
const hasMore = ref<boolean>(true);
const pageSize = 12;

// 검색 모드 여부
const isSearchMode = computed(() => !!ui.searchQuery?.trim());

// 추천 모드 여부 (첫 페이지에서 추천 API가 성공했는지 추적)
const isRecommendationMode = ref<boolean>(false);
const recommendationType = ref<"unified" | "curriculum" | null>(null);

// Intersection Observer를 위한 sentinel 요소
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Observer 설정 함수
function setupObserver() {
  // 기존 observer 제거
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // 검색 모드가 아닐 때만 observer 설정
  if (sentinel.value && !isSearchMode.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore.value &&
          !loading.value &&
          !isSearchMode.value
        ) {
          loadCourses();
        }
      },
      {
        rootMargin: "100px", // 화면 하단 100px 전에 미리 로드
      }
    );
    observer.observe(sentinel.value);
  }
}

// 검색어 변경 감지
watch(
  () => ui.searchQuery,
  async (newQuery, oldQuery) => {
    // 검색어가 변경되면 데이터 초기화 및 재로드
    if (newQuery !== oldQuery) {
      courses.value = [];
      currentPage.value = 0;
      hasMore.value = true;
      // 검색 모드에서는 추천 모드 비활성화
      isRecommendationMode.value = false;
      recommendationType.value = null;

      // Observer 재설정
      setupObserver();

      await loadCourses();
    }
  }
);

// 검색 모드 변경 감지
watch(isSearchMode, () => {
  setupObserver();
});

// 컴포넌트 마운트 시 데이터 로드 및 observer 설정
onMounted(async () => {
  await loadCourses();
  setupObserver();
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
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return date;
}

// 강의를 Course 타입으로 변환
function lectureToCourse(lecture: Lecture): Course {
  return {
    id: `lecture-${lecture.id}`,
    title: lecture.title,
    instructor: lecture.author?.username || "알 수 없음",
    category: lecture.category || "미분류",
    rating: 0, // 강의에는 평점이 없을 수 있음
    studentCount: 0,
    reviewsCount: 0,
    price: 0,
    tags: [],
    languages: [],
    difficulty: lecture.difficulty,
    description: lecture.description,
    createdAt: formatDate(lecture.createdAt),
    type: "lecture" as const,
    lectureId: lecture.id, // 원본 강의 ID 저장
    problemsCount: lecture.type === "PROBLEM" ? 1 : 0,
    thumbnail: undefined,
    totalLectureCount: 1,
  };
}

// 커리큘럼을 Course 타입으로 변환
function curriculumToCourse(curriculum: any): Course {
  return {
    id: String(curriculum.id),
    title: curriculum.title,
    instructor: curriculum.author?.username || "알 수 없음",
    category: curriculum.category || "미분류",
    rating: curriculum.averageRating || 0,
    studentCount: curriculum.studentCount || 0,
    reviewsCount: curriculum.reviewsCount || 0,
    price: 0,
    tags: curriculum.tags || [],
    languages: curriculum.languages || [],
    difficulty: curriculum.difficulty,
    description: curriculum.description,
    createdAt: formatDate(curriculum.createdAt),
    type: "curriculum" as const,
    problemsCount: curriculum.totalLectureCount || 0,
    thumbnail: curriculum.thumbnailImageUrl,
    totalLectureCount: curriculum.totalLectureCount,
    thumbnailImageUrl: curriculum.thumbnailImageUrl,
  };
}

// 통합 검색 API 호출
async function searchUnified() {
  if (loading.value) return;

  try {
    loading.value = true;
    error.value = null;

    const searchQuery = ui.searchQuery?.trim() || "";
    if (!searchQuery) {
      // 검색어가 없으면 일반 목록 로드
      await loadCourses();
      return;
    }

    console.log("[홈 화면] 통합 검색 시작:", searchQuery);

    const response = await searchApiService.unifiedSearch({
      title: searchQuery,
      isPublic: true, // 공개된 콘텐츠만 검색
      page: currentPage.value,
      size: pageSize,
    });

    // API 응답 디버깅
    console.log("[홈 화면] 통합 검색 API 응답:", {
      curriculumsCount: response.curriculums?.curriculums?.length || 0,
      lecturesCount: response.lectures?.lectures?.length || 0,
      curriculums: response.curriculums?.curriculums,
      lectures: response.lectures?.lectures,
      fullResponse: response,
    });

    // 커리큘럼과 강의를 모두 Course 타입으로 변환
    const curriculumCourses = (response.curriculums?.curriculums || []).map(
      curriculumToCourse
    );
    const lectureCourses = (response.lectures?.lectures || []).map(
      lectureToCourse
    );

    console.log("[홈 화면] 검색 결과 변환 완료:", {
      curriculumCoursesCount: curriculumCourses.length,
      lectureCoursesCount: lectureCourses.length,
      curriculumCourses: curriculumCourses.map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
      })),
      lectureCourses: lectureCourses.map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
      })),
    });

    // 검색 모드에서는 기존 데이터 대신 새로운 검색 결과로 교체 (첫 페이지일 때)
    if (currentPage.value === 0) {
      courses.value = [...curriculumCourses, ...lectureCourses];
    } else {
      // 다음 페이지는 추가
      courses.value = [
        ...courses.value,
        ...curriculumCourses,
        ...lectureCourses,
      ];
    }

    // 다음 페이지가 있는지 확인 (커리큘럼 또는 강의 중 하나라도 다음 페이지가 있으면 true)
    // API 명세서에 따르면 meta.hasNext 또는 meta.next_page를 사용
    const curriculumMeta = response.curriculums?.meta;
    const lectureMeta = response.lectures?.meta;

    const curriculumHasNext = curriculumMeta
      ? "hasNext" in curriculumMeta
        ? curriculumMeta.hasNext === true
        : "next_page" in curriculumMeta &&
          curriculumMeta.next_page !== null &&
          curriculumMeta.next_page !== undefined
      : false;
    const lectureHasNext = lectureMeta
      ? "hasNext" in lectureMeta
        ? lectureMeta.hasNext === true
        : "next_page" in lectureMeta &&
          lectureMeta.next_page !== null &&
          lectureMeta.next_page !== undefined
      : false;

    hasMore.value = curriculumHasNext || lectureHasNext;

    currentPage.value++;

    console.log("[홈 화면] 통합 검색 완료:", {
      curriculums: curriculumCourses.length,
      lectures: lectureCourses.length,
      total: courses.value.length,
    });
  } catch (err: any) {
    console.error("[홈 화면] 통합 검색 실패:", err);
    error.value = "검색 중 오류가 발생했습니다.";
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
}

// 추천 아이템을 Course 타입으로 변환
function recommendationToCourse(item: any): Course {
  if (item.type === "CURRICULUM") {
    // 커리큘럼 추천 아이템을 Course로 변환
    return {
      id: String(item.id),
      title: item.title,
      instructor: item.authorName || "알 수 없음",
      category: item.category || "미분류",
      rating: item.averageRating || 0,
      studentCount: item.studentCount || 0,
      reviewsCount: 0,
      price: 0,
      tags: item.tags || [],
      languages: [],
      difficulty: item.difficulty,
      description: item.description,
      createdAt: new Date().toISOString().split("T")[0],
      type: "curriculum" as const,
      totalLectureCount: 0,
      thumbnailImageUrl: item.thumbnailImageUrl,
    };
  } else {
    // 강의 추천 아이템을 Course로 변환
    return {
      id: `lecture-${item.id}`,
      title: item.title,
      instructor: item.authorName || "알 수 없음",
      category: item.category || "미분류",
      rating: 0,
      studentCount: 0,
      reviewsCount: 0,
      price: 0,
      tags: [],
      languages: [],
      difficulty: item.difficulty,
      description: item.description,
      createdAt: new Date().toISOString().split("T")[0],
      type: "lecture" as const,
      lectureId: item.id,
      problemsCount: item.lectureType === "PROBLEM" ? 1 : 0,
      totalLectureCount: 1,
    };
  }
}

// 백엔드에서 커리큘럼 데이터 로드 (페이징) - 사용자 맞춤 추천 우선
async function loadCourses() {
  if (loading.value || !hasMore.value) return;

  // 검색 모드일 때는 검색 API 호출
  if (isSearchMode.value) {
    await searchUnified();
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    let newCourses: Course[] = [];
    let responseMeta: any = null;
    const userId = getCurrentUserId();

    // 추천 모드이고 로그인된 사용자인 경우 추천 API 계속 사용
    if (isRecommendationMode.value && userId) {
      try {
        if (recommendationType.value === "unified") {
          console.log(
            `[홈 화면] 통합 추천 API 호출 (페이지 ${currentPage.value}, 추천 모드 활성화)`
          );
          const recommendationResponse =
            await recommendationApiService.getUnifiedRecommendations(
              currentPage.value,
              pageSize
            );

          if (
            recommendationResponse &&
            recommendationResponse.recommendations &&
            Array.isArray(recommendationResponse.recommendations)
          ) {
            console.log("[홈 화면] 통합 추천 성공:", {
              count: recommendationResponse.recommendations.length,
              page: currentPage.value,
              hasNext: recommendationResponse.meta?.hasNext,
              totalPages: recommendationResponse.meta?.totalPages,
            });

            // 추천 아이템을 Course로 변환
            newCourses = recommendationResponse.recommendations.map(
              recommendationToCourse
            );
            responseMeta = recommendationResponse.meta;
          } else {
            throw new Error("추천 API 응답 형식이 올바르지 않습니다.");
          }
        } else if (recommendationType.value === "curriculum") {
          console.log(
            `[홈 화면] 커리큘럼 추천 API 호출 (페이지 ${currentPage.value}, 추천 모드 활성화)`
          );
          const curriculumRecommendationResponse =
            await recommendationApiService.getCurriculumRecommendations(
              currentPage.value,
              pageSize
            );

          if (
            curriculumRecommendationResponse &&
            curriculumRecommendationResponse.curriculums &&
            Array.isArray(curriculumRecommendationResponse.curriculums)
          ) {
            console.log("[홈 화면] 커리큘럼 추천 성공:", {
              count: curriculumRecommendationResponse.curriculums.length,
              page: currentPage.value,
              hasNext: curriculumRecommendationResponse.meta?.hasNext,
              totalPages: curriculumRecommendationResponse.meta?.totalPages,
            });

            // CurriculumResponse를 Course로 직접 변환
            newCourses =
              curriculumRecommendationResponse.curriculums.map(
                curriculumToCourse
              );
            responseMeta = curriculumRecommendationResponse.meta;
          } else {
            throw new Error("커리큘럼 추천 API 응답 형식이 올바르지 않습니다.");
          }
        }
      } catch (recommendError: any) {
        console.warn(
          "[홈 화면] 추천 API 실패, 일반 목록으로 전환:",
          recommendError?.message || recommendError
        );
        // 추천 모드 해제하고 일반 목록으로 전환
        isRecommendationMode.value = false;
        recommendationType.value = null;

        const response =
          await curriculumApiService.getPublicCurriculumsPaginated(
            currentPage.value,
            pageSize
          );

        if (
          !response ||
          !response.curriculums ||
          !Array.isArray(response.curriculums)
        ) {
          console.error("[홈 화면] 잘못된 응답 형식:", response);
          throw new Error("잘못된 응답 형식입니다.");
        }

        newCourses = response.curriculums.map(curriculumToCourse);
        responseMeta = response.meta;
      }
    }
    // 첫 페이지이고 로그인된 사용자인 경우 추천 API 시도
    else if (userId && currentPage.value === 0) {
      try {
        console.log("[홈 화면] 통합 추천 API 호출 시도 (첫 페이지)");
        const recommendationResponse =
          await recommendationApiService.getUnifiedRecommendations(
            currentPage.value,
            pageSize
          );

        if (
          recommendationResponse &&
          recommendationResponse.recommendations &&
          Array.isArray(recommendationResponse.recommendations)
        ) {
          console.log(
            "[홈 화면] 통합 추천 성공:",
            recommendationResponse.recommendations.length,
            "개"
          );
          console.log("[홈 화면] 추천 응답:", recommendationResponse);

          // 추천 아이템을 Course로 변환
          newCourses = recommendationResponse.recommendations.map(
            recommendationToCourse
          );
          responseMeta = recommendationResponse.meta;

          // 추천 모드 활성화
          isRecommendationMode.value = true;
          recommendationType.value = "unified";
        } else {
          throw new Error("추천 API 응답 형식이 올바르지 않습니다.");
        }
      } catch (recommendError: any) {
        console.warn(
          "[홈 화면] 통합 추천 실패, 커리큘럼 추천 시도:",
          recommendError?.message || recommendError
        );

        // 통합 추천이 실패하면 커리큘럼 추천 시도
        try {
          const curriculumRecommendationResponse =
            await recommendationApiService.getCurriculumRecommendations(
              currentPage.value,
              pageSize
            );

          if (
            curriculumRecommendationResponse &&
            curriculumRecommendationResponse.curriculums &&
            Array.isArray(curriculumRecommendationResponse.curriculums)
          ) {
            console.log(
              "[홈 화면] 커리큘럼 추천 성공:",
              curriculumRecommendationResponse.curriculums.length,
              "개"
            );

            // CurriculumResponse를 Course로 직접 변환
            newCourses =
              curriculumRecommendationResponse.curriculums.map(
                curriculumToCourse
              );
            responseMeta = curriculumRecommendationResponse.meta;

            // 추천 모드 활성화
            isRecommendationMode.value = true;
            recommendationType.value = "curriculum";
          } else {
            throw new Error("커리큘럼 추천 API 응답 형식이 올바르지 않습니다.");
          }
        } catch (curriculumRecommendError: any) {
          console.warn(
            "[홈 화면] 커리큘럼 추천도 실패, 일반 목록 사용:",
            curriculumRecommendError?.message || curriculumRecommendError
          );
          if (curriculumRecommendError?.response?.status === 400) {
            console.error(
              "[홈 화면] 400 오류 상세:",
              curriculumRecommendError?.response
            );
          }

          // 추천 모드 비활성화
          isRecommendationMode.value = false;
          recommendationType.value = null;

          const response =
            await curriculumApiService.getPublicCurriculumsPaginated(
              currentPage.value,
              pageSize
            );

          if (
            !response ||
            !response.curriculums ||
            !Array.isArray(response.curriculums)
          ) {
            console.error("[홈 화면] 잘못된 응답 형식:", response);
            throw new Error("잘못된 응답 형식입니다.");
          }

          newCourses = response.curriculums.map(curriculumToCourse);
          responseMeta = response.meta;
        }
      }
    }
    // 추천 모드가 아니거나 일반 목록 사용
    else {
      const response = await curriculumApiService.getPublicCurriculumsPaginated(
        currentPage.value,
        pageSize
      );

      if (
        !response ||
        !response.curriculums ||
        !Array.isArray(response.curriculums)
      ) {
        console.error("[홈 화면] 잘못된 응답 형식:", response);
        throw new Error("잘못된 응답 형식입니다.");
      }

      // CurriculumResponse를 Course로 직접 변환
      newCourses = response.curriculums.map(curriculumToCourse);
      responseMeta = response.meta;
    }

    // 기존 데이터에 추가
    courses.value = [...courses.value, ...newCourses];

    // 다음 페이지가 있는지 확인
    if (responseMeta) {
      // 추천 API는 hasNext 사용, 일반 API는 next_page 사용
      if ("hasNext" in responseMeta) {
        hasMore.value = responseMeta.hasNext === true;
        console.log(
          `[홈 화면] 페이지네이션 확인 (추천 모드: ${isRecommendationMode.value}, 타입: ${recommendationType.value}):`,
          {
            hasNext: responseMeta.hasNext,
            currentPage: currentPage.value,
            totalPages:
              "totalPages" in responseMeta ? responseMeta.totalPages : "N/A",
          }
        );
      } else if ("next_page" in responseMeta) {
        hasMore.value =
          responseMeta.next_page !== null &&
          responseMeta.next_page !== undefined;
        console.log(`[홈 화면] 페이지네이션 확인 (일반 모드):`, {
          next_page: responseMeta.next_page,
          currentPage: currentPage.value,
        });
      } else {
        hasMore.value = false;
      }
    } else {
      hasMore.value = false;
    }

    console.log(
      `[홈 화면] 로드 완료: ${newCourses.length}개 추가, 총 ${courses.value.length}개, hasMore: ${hasMore.value}`
    );
    currentPage.value++;
  } catch (err: any) {
    console.error("커리큘럼 로드 실패:", err);
    error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
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
  if (activeTab.value !== "전체") {
    return list.filter((c) => c.category === activeTab.value);
  }
  return list;
});

// 검색 모드일 때는 클라이언트 사이드 필터링 제거 (이미 서버에서 필터링됨)
const filteredBySearch = computed<Course[]>(() => {
  if (isSearchMode.value) {
    // 검색 모드일 때는 서버에서 이미 필터링되었으므로 클라이언트 필터링 불필요
    return filteredByTab.value;
  }
  // 검색 모드가 아닐 때만 클라이언트 사이드 검색 수행
  return searchStore
    .searchCourses(ui.searchQuery, courses.value)
    .filter((c) => filteredByTab.value.includes(c));
});

const sortedCourses = computed<Course[]>(() => {
  const list = filteredBySearch.value.slice();
  switch (sortBy.value) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews":
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      break;
    case "latest":
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      list.sort(
        (a, b) =>
          (b.reviewsCount || 0) * b.rating - (a.reviewsCount || 0) * a.rating
      );
  }
  return list;
});

const visibleCourses = computed<Course[]>(() => sortedCourses.value);
</script>
