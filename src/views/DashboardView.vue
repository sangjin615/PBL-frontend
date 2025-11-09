<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 사용자 프로필 섹션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-6">
        <div class="flex items-center space-x-4">
          <!-- 프로필 사진 -->
          <div
            class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>

          <!-- 사용자 정보 -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ userInfo.name }}
            </h1>
            <p class="text-gray-600">{{ userInfo.handle }}</p>
            <p class="text-sm text-gray-500">
              구독자 {{ userInfo.subscribers }}
            </p>
          </div>

          <!-- 채널 관리 버튼 -->
          <button
            @click="goToChannelManagement"
            class="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <span>채널 관리</span>
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
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="bg-white border-b">
      <div class="px-8">
        <div class="flex items-center justify-between">
          <div class="flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="handleTabChange(tab.id)"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                "
              >
                {{ getTabCount(tab.id) }}
              </span>
            </button>
          </div>

          <div class="flex items-center space-x-4"></div>
        </div>
      </div>
    </div>

    <!-- 검색 및 정렬 옵션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- 검색바 -->
          <div class="flex-1 max-w-md">
            <form @submit.prevent="executeSearch" class="relative">
              <input
                v-model="localSearchQuery"
                type="text"
                placeholder="내 작업물 검색..."
                @keyup.enter="executeSearch"
                class="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div class="flex items-center space-x-4 ml-4">
            <span class="text-sm text-gray-600">정렬:</span>
            <select
              :value="sortBy"
              @change="handleSortChange"
              class="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recommended">추천순</option>
              <option value="recent">최신순</option>
              <option value="title">제목순</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 강의 카드 그리드 -->
    <div class="px-8 py-8">
      <!-- 로딩 상태 (데이터가 전혀 없을 때만 표시) -->
      <LoadingSpinner
        v-if="isLoading && paginatedItems.length === 0"
        size="lg"
        message="강의 데이터를 불러오는 중..."
      />

      <!-- 에러 상태 (경고 형태로 변경, 데이터는 계속 표시) -->
      <WarningMessage
        v-if="error && !isLoading"
        title="API 연결 문제"
        :message="error"
        :show-retry="true"
        @retry="() => loadPage(currentPage)"
      />

      <!-- 강의 카드 그리드 (항상 표시) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in paginatedItems"
          :key="`${item.type}-${item.id}`"
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow group"
        >
          <!-- 강의 썸네일 -->
          <div
            class="h-48 rounded-t-lg flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden"
            :style="{ backgroundColor: item.thumbnailColor }"
          >
            <img
              v-if="item.thumbnailImageUrl"
              :src="getImageUrl(item.thumbnailImageUrl)"
              :alt="item.title"
              class="w-full h-full object-cover absolute inset-0"
            />
            <span v-else class="relative z-10">X</span>
            <!-- 타입 배지 -->
            <div
              class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
              :class="
                item.type === 'curriculum'
                  ? 'bg-blue-100 text-blue-800'
                  : item.format === '문제'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
              "
            >
              {{
                item.type === "curriculum"
                  ? "커리큘럼"
                  : item.format || "강의물"
              }}
            </div>
          </div>

          <!-- 강의 정보 -->
          <div class="p-4">
            <h3
              class="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
            >
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-500 mb-2">
              만든 날짜: {{ item.createdDate }}
            </p>

            <!-- 커리큘럼 정보 -->
            <div v-if="item.type === 'curriculum'" class="space-y-2">
              <div class="space-y-1">
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-1"
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
                  {{ item.courseCount || 0 }}개 강의
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ item.duration }}
                </div>
              </div>
              <!-- 태그 -->
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 강의물 정보 -->
            <div v-else class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {{ item.duration }}
              </div>
              <!-- 태그 -->
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 공개/비공개 상태 -->
            <div
              class="flex items-center text-sm mt-2"
              :class="
                item.privacy === '공개' ? 'text-green-600' : 'text-gray-500'
              "
            >
              <!-- 비공개 아이콘 (잠금) -->
              <svg
                v-if="item.privacy === '비공개'"
                class="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <!-- 공개 아이콘 (열린 자물쇠) -->
              <svg
                v-else
                class="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                ></path>
              </svg>
              {{ item.privacy }}
            </div>

            <!-- 액션 버튼: 자세히보기 / 수정하기 -->
            <div class="mt-4 flex items-center gap-2">
              <Button size="sm" @click.stop="viewItem(item)">자세히보기</Button>
              <Button size="sm" variant="secondary" @click.stop="editItem(item)"
                >수정하기</Button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div
        v-if="allSortedItems.length === 0 && !isLoading"
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
        <h3 class="text-lg font-semibold mb-2 text-gray-900">
          아직 강의가 없습니다
        </h3>
        <p class="text-sm text-gray-500 mb-4">새로운 강의를 만들어보세요!</p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 첫 강의 만들기
        </button>
      </div>

      <!-- 페이지네이션 -->
      <div
        v-if="allSortedItems.length > 0"
        class="flex justify-center items-center py-8"
      >
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ pageRangeStart }}-{{ pageRangeEnd }} / {{ totalItemsCount }}개
          </span>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { lectureApiService } from "@/services/lectureApi";
import { curriculumApiService } from "@/services/curriculumApi";
import { useAuth } from "@/composables/useAuth";
import { useUiStore } from "@/stores/ui";
import { LoadingSpinner, WarningMessage, Button } from "@/components/common";
import { getThumbnailColor } from "@/utils";
import { MESSAGES } from "@/constants";
import type { DashboardItem } from "@/types/lecture";
import { LectureType } from "@/types/lecture";
import type { Lecture } from "@/types/lecture";
import type { CurriculumResponse } from "@/types/curriculum";
import { S3ApiService } from "@/services/s3Api";

const router = useRouter();
const ui = useUiStore();
const { currentUser } = useAuth();

// 사용자 정보 (동적)
const userInfo = computed(() => ({
  name: currentUser.value?.username || "사용자",
  handle: `@${currentUser.value?.loginId || "user"}`,
  subscribers: currentUser.value?.subscribers || "0명",
}));

// 탭 데이터
const tabs = ref([
  { id: "all", name: "전체" },
  { id: "curriculum", name: "커리큘럼" },
  { id: "materials", name: "강의물" },
]);

const activeTab = ref("all");
const sortBy = ref("recommended");
const showCreateMenu = ref(false);

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = ref(20); // 페이지당 아이템 수 고정

// 발행된 강의 데이터 (localStorage에서 불러옴 - 기존 로직 유지)
const publishedCourses = ref<DashboardItem[]>([]);

// API 데이터
const lectures = ref<Lecture[]>([]);
const curricula = ref<CurriculumResponse[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// 페이징 메타 정보
const lectureMeta = ref({
  current_page: 1,
  total_pages: 0,
  total_count: 0,
  per_page: 10,
  next_page: null as number | null,
  prev_page: null as number | null,
});

const curriculumMeta = ref({
  current_page: 1,
  total_pages: 0,
  total_count: 0,
  per_page: 10,
  next_page: null as number | null,
  prev_page: null as number | null,
});

// 로컬 임시 강의 병합 로직 제거 (반복/중복 노출 방지)
function loadPublishedCourses() {
  publishedCourses.value = [];
}

// API에서 데이터 로딩 (특정 페이지, 탭에 따라)
async function loadPage(page: number) {
  if (!currentUser.value?.id) return;

  isLoading.value = true;
  error.value = null;

  try {
    // 페이지는 0부터 시작 (백엔드)
    const backendPage = page - 1;

    // 탭에 따라 필요한 데이터만 가져오기
    if (activeTab.value === "curriculum") {
      // 커리큘럼 탭: 커리큘럼만 가져오기 (20개씩)
      const curriculumResponse = await curriculumApiService.getUserCurriculums(
        currentUser.value.id,
        backendPage,
        20
      );
      curricula.value = curriculumResponse.curriculums;
      curriculumMeta.value = curriculumResponse.meta;

      console.log("커리큘럼 데이터 로딩 완료:", {
        page: page,
        curricula: curriculumResponse.curriculums.length,
        meta: curriculumResponse.meta,
      });
    } else if (activeTab.value === "materials") {
      // 강의물 탭: 강의만 가져오기 (20개씩)
      const lectureResponse = await lectureApiService.getUserLectures(
        currentUser.value.id,
        backendPage,
        20
      );
      lectures.value = lectureResponse.lectures;
      lectureMeta.value = lectureResponse.meta;

      console.log("강의 데이터 로딩 완료:", {
        page: page,
        lectures: lectureResponse.lectures.length,
        meta: lectureResponse.meta,
      });
    } else {
      // 전체 탭: 강의와 커리큘럼 둘 다 가져오기
      const [lectureResponse, curriculumResponse] = await Promise.all([
        lectureApiService.getUserLectures(
          currentUser.value.id,
          backendPage,
          20
        ),
        curriculumApiService.getUserCurriculums(
          currentUser.value.id,
          backendPage,
          20
        ),
      ]);

      lectures.value = lectureResponse.lectures;
      curricula.value = curriculumResponse.curriculums;
      lectureMeta.value = lectureResponse.meta;
      curriculumMeta.value = curriculumResponse.meta;

      console.log("전체 데이터 로딩 완료:", {
        page: page,
        lectures: lectureResponse.lectures.length,
        curricula: curriculumResponse.curriculums.length,
        lectureMeta: lectureResponse.meta,
        curriculumMeta: curriculumResponse.meta,
      });
    }
  } catch (err) {
    console.error("API 데이터 로딩 실패:", err);
    error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
  } finally {
    isLoading.value = false;
  }
}

// 배열 형태의 날짜를 Date 객체로 변환하는 함수
function parseArrayDate(dateArray: number[] | string): string {
  if (typeof dateArray === "string") {
    return new Date(dateArray).toLocaleDateString("ko-KR");
  }

  if (Array.isArray(dateArray) && dateArray.length >= 3) {
    // [year, month, day, hour, minute, second, nanoseconds] 형태
    const [year, month, day] = dateArray;
    // JavaScript Date의 month는 0부터 시작하므로 -1 필요 없음 (서버에서 1~12로 전송)
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("ko-KR");
  }

  return "날짜 없음";
}

// API에서 가져온 강의 데이터와 기존 데이터 통합
const filteredItems = computed(() => {
  // API에서 가져온 강의들을 DashboardItem 형태로 변환
  const apiLectures: DashboardItem[] = lectures.value.map((lecture) => ({
    id: lecture.id,
    title: lecture.title,
    createdDate: parseArrayDate(lecture.createdAt),
    privacy: lecture.isPublic ? "공개" : "비공개",
    thumbnailColor: getThumbnailColor(lecture.type),
    thumbnailImageUrl: lecture.thumbnailImageUrl,
    type: "lecture" as const,
    duration: lecture.durationMinutes ? `${lecture.durationMinutes}분` : "미정",
    tags: [lecture.category, lecture.type],
    format: lecture.type,
    lectureType: lecture.type,
    category: lecture.category,
    difficulty: lecture.difficulty,
    testCaseCount: lecture.testCaseCount,
    status: lecture.isPublic ? "발행됨" : "초안",
  }));

  // API에서 가져온 커리큘럼들을 DashboardItem 형태로 변환
  const apiCurriculums: DashboardItem[] = curricula.value.map((curriculum) => ({
    id: curriculum.id,
    title: curriculum.title,
    createdDate: parseArrayDate(curriculum.createdAt),
    privacy: curriculum.isPublic ? "공개" : "비공개",
    thumbnailColor: getThumbnailColor("curriculum"),
    thumbnailImageUrl: curriculum.thumbnailImageUrl,
    type: "curriculum" as const,
    duration: curriculum.durationMinutes
      ? `${curriculum.durationMinutes}분`
      : "미정",
    tags:
      curriculum.tags && curriculum.tags.length > 0
        ? curriculum.tags
        : ["커리큘럼"],
    courseCount: curriculum.totalLectureCount,
    status: curriculum.isPublic ? "발행됨" : "초안",
  }));
  const localCourses = publishedCourses.value; // localStorage의 강의들

  switch (activeTab.value) {
    case "curriculum":
      return apiCurriculums; // API에서 가져온 커리큘럼
    case "materials":
      // 백엔드 데이터만 사용
      return apiLectures;
    case "all":
    default:
      // 모든 데이터 합치기
      // 백엔드 데이터만 사용
      const allItems = [...apiCurriculums, ...apiLectures];
      return allItems;
  }
});

// 정렬된 아이템들 (전체)
const allSortedItems = computed(() => {
  let items = [...filteredItems.value];

  // 검색어 필터링
  const searchQuery = ui.searchQuery?.trim().toLowerCase();
  if (searchQuery) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.category?.toLowerCase().includes(searchQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
    );
  }

  switch (sortBy.value) {
    case "recent":
      return items.sort((a, b) => {
        // 날짜 문자열을 Date 객체로 변환하여 비교
        const parseDate = (dateStr: string) => {
          // "2025.9.29" 형태를 Date로 변환
          const parts = dateStr.split(".");
          if (parts.length === 3) {
            return new Date(
              parseInt(parts[0]),
              parseInt(parts[1]) - 1,
              parseInt(parts[2])
            );
          }
          return new Date(dateStr);
        };

        const dateA = parseDate(a.createdDate);
        const dateB = parseDate(b.createdDate);
        return dateB.getTime() - dateA.getTime();
      });
    case "title":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "recommended":
    default:
      return items; // 기본 순서 유지
  }
});

// 로컬 검색어 상태
const localSearchQuery = ref("");

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
  // 검색 시 첫 페이지로 리셋하고 데이터 다시 로드
  currentPage.value = 1;
  loadPage(1);
}

// 검색어 초기화
function clearSearch() {
  localSearchQuery.value = "";
  ui.setSearchQuery("");
  // 검색 초기화 시 첫 페이지로 리셋하고 데이터 다시 로드
  currentPage.value = 1;
  loadPage(1);
}

// UI 스토어의 검색어와 동기화 (외부에서 검색어가 변경된 경우)
watch(
  () => ui.searchQuery,
  (newQuery) => {
    if (newQuery !== localSearchQuery.value) {
      localSearchQuery.value = newQuery || "";
    }
  },
  { immediate: true }
);

// 검색 중인지 확인
const isSearching = computed(() => {
  return !!ui.searchQuery?.trim();
});

// 검색 결과 기반 총 아이템 수
const filteredItemsCount = computed(() => {
  return allSortedItems.value.length;
});

// 현재 표시할 아이템들 (검색 중이면 클라이언트 사이드 페이지네이션, 아니면 백엔드 페이지네이션)
const paginatedItems = computed(() => {
  if (isSearching.value) {
    // 검색 중: 클라이언트 사이드 페이지네이션
    const items = allSortedItems.value;
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.slice(start, end);
  } else {
    // 검색 중 아님: 백엔드에서 받은 데이터 그대로 표시
    return allSortedItems.value;
  }
});

// 총 페이지 수 (검색 중이면 검색 결과 기반, 아니면 백엔드 메타 정보)
const totalPages = computed(() => {
  if (isSearching.value) {
    // 검색 중: 검색 결과 기반
    if (filteredItemsCount.value === 0) return 1;
    return Math.ceil(filteredItemsCount.value / itemsPerPage.value);
  } else {
    // 검색 중 아님: 백엔드 메타 정보 사용
    if (activeTab.value === "curriculum") {
      return curriculumMeta.value.total_pages;
    } else if (activeTab.value === "materials") {
      return lectureMeta.value.total_pages;
    } else {
      return Math.max(
        lectureMeta.value.total_pages,
        curriculumMeta.value.total_pages
      );
    }
  }
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

// 탭별 개수 계산
function getTabCount(tabId: string) {
  switch (tabId) {
    case "curriculum":
      return curriculumMeta.value.total_count;
    case "materials":
      return lectureMeta.value.total_count;
    case "all":
    default:
      return curriculumMeta.value.total_count + lectureMeta.value.total_count;
  }
}

// 페이지 상단 범위/총계 표시 (검색 중이면 검색 결과 기반, 아니면 백엔드 메타 정보)
const totalItemsCount = computed(() => {
  if (isSearching.value) {
    return filteredItemsCount.value;
  } else {
    // 검색 중 아님: 백엔드 메타 정보 사용
    if (activeTab.value === "curriculum")
      return curriculumMeta.value.total_count;
    if (activeTab.value === "materials") return lectureMeta.value.total_count;
    return curriculumMeta.value.total_count + lectureMeta.value.total_count;
  }
});

const pageRangeStart = computed(() => {
  if (totalItemsCount.value === 0) return 0;
  if (isSearching.value) {
    return (currentPage.value - 1) * itemsPerPage.value + 1;
  } else {
    // 검색 중 아님: 백엔드 메타 정보 기반
    const perPage =
      activeTab.value === "curriculum"
        ? curriculumMeta.value.per_page
        : activeTab.value === "materials"
          ? lectureMeta.value.per_page
          : itemsPerPage.value;
    return (currentPage.value - 1) * perPage + 1;
  }
});

const pageRangeEnd = computed(() => {
  if (isSearching.value) {
    return Math.min(
      currentPage.value * itemsPerPage.value,
      filteredItemsCount.value
    );
  } else {
    // 검색 중 아님: 백엔드 메타 정보 기반
    const perPage =
      activeTab.value === "curriculum"
        ? curriculumMeta.value.per_page
        : activeTab.value === "materials"
          ? lectureMeta.value.per_page
          : itemsPerPage.value;
    return Math.min(currentPage.value * perPage, totalItemsCount.value);
  }
});

// 탭 변경 시 페이지 초기화 및 데이터 다시 로드
function handleTabChange(tabId: string) {
  activeTab.value = tabId;
  currentPage.value = 1;
  loadPage(1);
}

// 정렬 변경 시 페이지 초기화 및 데이터 다시 로드
function handleSortChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  sortBy.value = target.value;
  currentPage.value = 1;
  loadPage(1);
}

// 페이지네이션 함수들 (검색 중이면 클라이언트 사이드 페이지네이션, 아니면 백엔드에서 데이터 로드)
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 검색 중이 아닐 때만 백엔드에서 데이터 로드
    const hasSearchQuery = ui.searchQuery?.trim();
    if (!hasSearchQuery) {
      loadPage(page);
    }
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    // 검색 중이 아닐 때만 백엔드에서 데이터 로드
    const hasSearchQuery = ui.searchQuery?.trim();
    if (!hasSearchQuery) {
      loadPage(currentPage.value);
    }
  }
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // 검색 중이 아닐 때만 백엔드에서 데이터 로드
    const hasSearchQuery = ui.searchQuery?.trim();
    if (!hasSearchQuery) {
      loadPage(currentPage.value);
    }
  }
}

// 자세히보기: 학습자 관점으로 이동
function viewItem(item: DashboardItem) {
  if (item.type === "curriculum") {
    // 커리큘럼 상세(수강) 페이지로 이동
    router.push({ name: "curriculum-detail", params: { id: item.id } });
  } else {
    // 강의물 학습 페이지로 이동 (커리큘럼 정보가 있으면 query에 포함 가능)
    router.push({ name: "lecture", params: { lectureId: item.id } });
  }
}

// 수정하기: 기존처럼 작성/수정 화면으로 이동
function editItem(item: DashboardItem) {
  if (item.type === "curriculum") {
    // 커리큘럼 수정 화면으로 이동 (현재 생성 화면을 재사용)
    router.push({
      name: "instructor-create-curriculum",
      query: { edit: item.id, mode: "edit" },
    });
  } else {
    if (item.format === "문제" || item.lectureType === LectureType.PROBLEM) {
      router.push({
        name: "instructor-create-problem",
        query: { edit: item.id, mode: "edit" },
      });
    } else {
      router.push({
        name: "instructor-create-markdown",
        query: { edit: item.id, mode: "edit" },
      });
    }
  }
}

// 새로고침 함수
async function refreshLectures() {
  currentPage.value = 1;
  await Promise.all([loadPage(1), loadPublishedCourses()]);
}

// 이미지 URL 생성 헬퍼
function getImageUrl(path: string | null | undefined): string {
  return S3ApiService.getImageUrl(path);
}

// 채널 관리 함수
function goToChannelManagement() {
  router.push({ name: "mypage", query: { tab: "channel" } });
}

// 만들기 메뉴 네비게이션 함수들
function goToCreateCurriculum() {
  showCreateMenu.value = false;
  router.push({ name: "instructor-create-curriculum" });
}

function goToCreateMarkdown() {
  showCreateMenu.value = false;
  router.push({ name: "instructor-create-markdown" });
}

function goToCreateProblem() {
  showCreateMenu.value = false;
  router.push({ name: "instructor-create-problem" });
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // 페이지 이동 시 검색어 초기화
  localSearchQuery.value = "";
  ui.setSearchQuery("");

  // localStorage에서 발행된 강의 먼저 로드 (즉시 표시)
  loadPublishedCourses();

  // API에서 강의 및 커리큘럼 데이터 가져오기 (1페이지)
  await loadPage(1);
});
</script>
