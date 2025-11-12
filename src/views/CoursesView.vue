<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div
      class="bg-figma-1 border-b"
      style="border-color: rgb(var(--figma-color-4))"
    >
      <div class="px-6 py-6">
        <div class="flex items-start justify-between">
          <div>
            <h1
              class="text-2xl font-bold"
              style="color: rgb(var(--figma-color-2))"
            >
              수강 목록
            </h1>
            <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">
              내가 수강 중인 강의들을 확인하세요
            </p>
          </div>
          <div>
            <button
              class="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              @click="goMySubmissions"
            >
              내 제출 보기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="px-6 py-8">
      <!-- 필터 및 정렬 -->
      <div
        class="bg-figma-1 rounded-lg border p-6 mb-8"
        style="border-color: rgb(var(--figma-color-4))"
      >
        <div class="flex flex-col gap-4">
          <!-- 탭 네비게이션 -->
          <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
              :class="
                activeTab === tab.id
                  ? 'bg-white text-figma-2 shadow-sm'
                  : 'text-figma-5 hover:text-figma-2'
              "
            >
              {{ getTabLabel(tab) }}
            </button>
          </div>

          <!-- 검색 및 정렬 -->
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <!-- 검색바 -->
            <div class="flex-1 max-w-md">
              <form @submit.prevent="executeSearch" class="relative">
                <input
                  v-model="localSearchQuery"
                  type="text"
                  placeholder="수강 목록 검색..."
                  @keyup.enter="executeSearch"
                  class="w-full px-4 py-2 pl-10 pr-20 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style="
                    border-color: rgb(var(--figma-color-4));
                    color: rgb(var(--figma-color-2));
                  "
                />
                <svg
                  class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <div
                  class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1"
                >
                  <button
                    v-if="localSearchQuery"
                    @click="clearSearch"
                    class="text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                  <button
                    @click="executeSearch"
                    type="submit"
                    class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    검색
                  </button>
                </div>
              </form>
            </div>

            <!-- 정렬 옵션 -->
            <div class="flex items-center space-x-4">
              <select
                v-model="sortBy"
                class="px-3 py-2 border rounded-lg text-sm"
                style="
                  border-color: rgb(var(--figma-color-4));
                  color: rgb(var(--figma-color-2));
                "
              >
                <option value="recent">최근 수강순</option>
                <option value="progress">진행률순</option>
                <option value="title">제목순</option>
                <option value="recommended">추천순</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 강의 목록 -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="course in paginatedCourses"
          :key="course.id"
          class="bg-figma-1 rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          style="border-color: rgb(var(--figma-color-4))"
          @click="goToCourse(course.id)"
        >
          <!-- 썸네일 -->
          <div
            class="aspect-video bg-gray-200 flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="course.thumbnailImageUrl"
              :src="getImageUrl(course.thumbnailImageUrl)"
              :alt="course.title"
              class="w-full h-full object-cover"
              @error="handleThumbnailError"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-300 rounded flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          <!-- 강의 정보 -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span
                class="text-xs px-2 py-1 rounded-full"
                style="
                  background-color: rgb(var(--figma-color-7));
                  color: rgb(var(--figma-color-6));
                "
              >
                {{ course.category }}
              </span>
              <span class="text-xs" style="color: rgb(var(--figma-color-5))">{{
                course.type === "curriculum" ? "커리큘럼" : "강의물"
              }}</span>
            </div>

            <h3
              class="font-semibold text-sm mb-2 line-clamp-2"
              style="color: rgb(var(--figma-color-2))"
            >
              {{ course.title }}
            </h3>

            <p class="text-xs mb-3" style="color: rgb(var(--figma-color-5))">
              {{ course.instructor }}
            </p>

            <!-- 추천수 표시 -->
            <div class="flex items-center gap-1 mb-3 text-xs" style="color: rgb(var(--figma-color-5))">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-500">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.21l8.2-1.192z"/>
              </svg>
              <span v-if="course.rating >= 0">{{ course.rating.toFixed(1) }}</span>
              <span v-else class="text-gray-400">-</span>
              <span v-if="course.studentCount !== undefined && course.studentCount >= 0" class="text-gray-500">
                ({{ course.studentCount }})
              </span>
            </div>

            <!-- 진행률 바 -->
            <div class="mb-3">
              <div class="flex items-center justify-between text-xs mb-1">
                <span style="color: rgb(var(--figma-color-5))">진행률</span>
                <span style="color: rgb(var(--figma-color-2))"
                  >{{ course.progress }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{
                    backgroundColor: 'rgb(var(--figma-color-6))',
                    width: course.progress + '%',
                  }"
                ></div>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <button
              class="w-full py-2 text-xs font-medium rounded-lg text-white hover:opacity-90 transition-colors"
              style="background-color: rgb(var(--figma-color-6))"
              @click.stop="goToCourse(course.id)"
            >
              이어서 학습하기
            </button>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div
        v-if="paginatedCourses.length > 0"
        class="flex justify-center items-center py-8"
      >
        <div class="flex items-center space-x-4">
          <span class="text-sm" style="color: rgb(var(--figma-color-5))">
            {{ pageRangeStart }}-{{ pageRangeEnd }} / {{ totalItemsCount }}개
          </span>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="p-2 rounded-md border text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style="border-color: rgb(var(--figma-color-4))"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="px-3 py-1 text-sm rounded-md border"
                :class="
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                "
                style="border-color: rgb(var(--figma-color-4))"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-md border text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style="border-color: rgb(var(--figma-color-4))"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div
        v-if="paginatedCourses.length === 0 && !isLoading"
        class="text-center py-12"
      >
        <div
          class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
        </div>
        <h3
          class="text-lg font-semibold mb-2"
          style="color: rgb(var(--figma-color-2))"
        >
          수강 중인 강의가 없습니다
        </h3>
        <p class="text-sm" style="color: rgb(var(--figma-color-5))">
          새로운 강의를 수강해보세요!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { enrollmentApiService } from "@/services/enrollmentApi";
import { curriculumApiService } from "@/services/curriculumApi";
import { useUiStore } from "@/stores/ui";
import { S3ApiService } from "@/services/s3Api";
import type { EnrollmentResponse } from "@/types/enrollment";
import { EnrollmentStatus } from "@/types/enrollment";
import { getCurrentUserId } from "@/config/api";

const router = useRouter();
const ui = useUiStore();

// 탭 상태
const activeTab = ref("all");
const sortBy = ref("recent");

// 탭 옵션
const tabs = ref([
  { id: "all", name: "전체" },
  { id: "in_progress", name: "진행 중" },
  { id: "completed", name: "완료" },
]);

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = ref(12); // 페이지당 아이템 수

// 수강 중인 강의 데이터
const enrolledCourses = ref<any[]>([]);
const isLoading = ref(false);

// 로컬 검색어 상태
const localSearchQuery = ref("");

// 완료한 강의
const completedCourses = computed(() =>
  enrolledCourses.value.filter(
    (course) => course.status === EnrollmentStatus.COMPLETED
  )
);

// 진행 중인 강의
const inProgressCourses = computed(() =>
  enrolledCourses.value.filter(
    (course) =>
      course.status === EnrollmentStatus.IN_PROGRESS ||
      course.status === EnrollmentStatus.ENROLLED
  )
);

// 탭별 개수 계산 함수
function getTabCount(tabId: string): number {
  switch (tabId) {
    case "all":
      return enrolledCourses.value.length;
    case "in_progress":
      return inProgressCourses.value.length;
    case "completed":
      return completedCourses.value.length;
    default:
      return 0;
  }
}

// 탭 라벨 생성 (선택된 탭에만 개수 표시)
function getTabLabel(tab: { id: string; name: string }): string {
  if (activeTab.value === tab.id) {
    const count = getTabCount(tab.id);
    return `${tab.name} (${count})`;
  }
  return tab.name;
}

// 필터링된 강의 목록 (검색 및 탭 필터링)
const filteredCourses = computed(() => {
  let filtered = enrolledCourses.value;

  // 검색어 필터링
  const searchQuery = ui.searchQuery?.trim().toLowerCase();
  if (searchQuery) {
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery) ||
        course.instructor.toLowerCase().includes(searchQuery) ||
        course.category.toLowerCase().includes(searchQuery)
    );
  }

  // 탭별 필터링
  if (activeTab.value === "in_progress") {
    filtered = filtered.filter(
      (course) =>
        course.status === EnrollmentStatus.IN_PROGRESS ||
        course.status === EnrollmentStatus.ENROLLED
    );
  } else if (activeTab.value === "completed") {
    filtered = filtered.filter(
      (course) => course.status === EnrollmentStatus.COMPLETED
    );
  }

  // 정렬
  switch (sortBy.value) {
    case "recent":
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
      );
      break;
    case "progress":
      filtered = [...filtered].sort((a, b) => b.progress - a.progress);
      break;
    case "title":
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "recommended":
      filtered = [...filtered].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
      break;
  }

  return filtered;
});

// 검색 중인지 확인
const isSearching = computed(() => {
  return !!ui.searchQuery?.trim();
});

// 검색 결과 기반 총 아이템 수
const filteredItemsCount = computed(() => {
  return filteredCourses.value.length;
});

// 페이지네이션된 강의 목록
const paginatedCourses = computed(() => {
  const items = filteredCourses.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return items.slice(start, end);
});

// 총 페이지 수
const totalPages = computed(() => {
  if (filteredItemsCount.value === 0) return 1;
  return Math.ceil(filteredItemsCount.value / itemsPerPage.value);
});

// 표시할 페이지 번호들 (최대 10개)
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  // 현재 페이지를 중심으로 앞뒤로 5개씩 표시
  const start = Math.max(1, current - 5);
  const end = Math.min(total, start + 9);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 페이지 상단 범위/총계 표시
const totalItemsCount = computed(() => {
  return filteredItemsCount.value;
});

const pageRangeStart = computed(() => {
  if (filteredItemsCount.value === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const pageRangeEnd = computed(() => {
  return Math.min(
    currentPage.value * itemsPerPage.value,
    filteredItemsCount.value
  );
});

// 검색 실행 함수
function executeSearch() {
  const searchQuery = localSearchQuery.value.trim();

  // 검색어가 비어있으면 검색 초기화
  if (!searchQuery) {
    clearSearch();
    return;
  }

  // 검색 실행
  ui.setSearchQuery(searchQuery);
  // 검색 시 첫 페이지로 리셋
  currentPage.value = 1;
}

// 검색어 초기화
function clearSearch() {
  localSearchQuery.value = "";
  ui.setSearchQuery("");
  // 검색 초기화 시 첫 페이지로 리셋
  currentPage.value = 1;
}

// UI 스토어의 검색어와 동기화 (외부에서 검색어가 변경된 경우)
watch(
  () => ui.searchQuery,
  (newQuery) => {
    if (newQuery !== localSearchQuery.value) {
      localSearchQuery.value = newQuery || "";
      // 검색어 변경 시 첫 페이지로 리셋
      currentPage.value = 1;
    }
  },
  { immediate: true }
);

// 페이지네이션 함수들
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// 강의로 이동 (이미 수강신청된 상태이므로 바로 학습 페이지로)
function goToCourse(courseId: string) {
  const course = enrolledCourses.value.find((c) => c.id === courseId);
  // 커리큘럼 상세 페이지로 이동 (수강 중인 커리큘럼)
  router.push({
    name: "curriculum-detail",
    params: { id: course.curriculumId },
  });
}

function goMySubmissions() {
  router.push({ name: "my-submissions" });
}

// Enrollment API로 수강 목록 로드
const loadEnrollments = async () => {
  isLoading.value = true;
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.error("사용자 ID를 찾을 수 없습니다. 로그인이 필요합니다.");
      isLoading.value = false;
      return;
    }
    const enrollments = await enrollmentApiService.getUserEnrollments(userId);

    // 각 커리큘럼의 강의자 정보를 가져오기 위해 병렬로 API 호출
    const coursesWithInstructor = await Promise.all(
      enrollments.map(async (enrollment: EnrollmentResponse) => {
        try {
          // 커리큘럼 상세 정보를 가져와서 강의자 이름 추출
          const curriculumDetail = await curriculumApiService.getCurriculumById(
            enrollment.curriculumId
          );
          const instructor = curriculumDetail.author?.username || "알 수 없음";

          return {
            id: String(enrollment.id),
            curriculumId: enrollment.curriculumId,
            title: enrollment.curriculumTitle,
            instructor: instructor,
            category: "커리큘럼",
            type: "curriculum",
            progress: enrollment.progressPercentage || 0,
            status: enrollment.status,
            rating: curriculumDetail.averageRating ?? 0,
            studentCount: curriculumDetail.studentCount ?? 0,
            enrolledAt: formatEnrolledDate(enrollment.enrolledAt),
            thumbnailImageUrl: curriculumDetail.thumbnailImageUrl || null,
          };
        } catch (error) {
          console.error(
            `커리큘럼 ${enrollment.curriculumId} 정보 조회 실패:`,
            error
          );
          // 커리큘럼 정보 조회 실패 시 기본값 사용
          return {
            id: String(enrollment.id),
            curriculumId: enrollment.curriculumId,
            title: enrollment.curriculumTitle,
            instructor: "알 수 없음",
            category: "커리큘럼",
            type: "curriculum",
            progress: enrollment.progressPercentage || 0,
            status: enrollment.status,
            rating: 0,
            studentCount: 0,
            enrolledAt: formatEnrolledDate(enrollment.enrolledAt),
            thumbnailImageUrl: null,
          };
        }
      })
    );

    enrolledCourses.value = coursesWithInstructor;
  } catch (error) {
    console.error("수강 목록 로드 실패:", error);
    alert("수강 목록을 불러오는데 실패했습니다.");
  } finally {
    isLoading.value = false;
  }
};

// 날짜 포맷 헬퍼 함수
const formatEnrolledDate = (date: number[] | string): string => {
  if (Array.isArray(date)) {
    // [2025, 1, 15, 14, 30, 0] 형태
    return `${date[0]}-${String(date[1]).padStart(2, "0")}-${String(date[2]).padStart(2, "0")}`;
  }
  return new Date(date).toISOString().split("T")[0];
};

// 이미지 URL 생성 헬퍼
function getImageUrl(path: string | null | undefined): string {
  return S3ApiService.getImageUrl(path);
}

// 썸네일 이미지 로드 에러 핸들링
function handleThumbnailError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.warn("썸네일 이미지 로드 실패:", img.src);
  // 이미지 로드 실패 시 부모 요소에서 플레이스홀더 표시
  if (img.parentElement) {
    img.style.display = "none";
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  // 페이지 이동 시 검색어 초기화
  localSearchQuery.value = "";
  ui.setSearchQuery("");
  loadEnrollments();
});
</script>
