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

          <div class="flex items-center space-x-4">
          </div>
        </div>
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-4">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">정렬:</span>
          <select
            :value="sortBy"
            @change="handleSortChange"
            class="text-sm border-0 bg-transparent text-gray-700 focus:ring-0"
          >
            <option value="recommended">추천순</option>
            <option value="recent">최신순</option>
            <option value="title">제목순</option>
          </select>
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
        @retry="loadApiData"
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
            class="h-48 rounded-t-lg flex items-center justify-center text-4xl font-bold text-white relative"
            :style="{ backgroundColor: item.thumbnailColor }"
          >
            X
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
            <div class="flex items-center text-sm mt-2"
              :class="item.privacy === '공개' ? 'text-green-600' : 'text-gray-500'">
              <!-- 비공개 아이콘 (잠금) -->
              <svg v-if="item.privacy === '비공개'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <!-- 공개 아이콘 (열린 자물쇠) -->
              <svg v-else class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                ></path>
              </svg>
              {{ item.privacy }}
            </div>

            <!-- 액션 버튼: 자세히보기 / 수정하기 -->
            <div class="mt-4 flex items-center gap-2">
              <Button size="sm" @click.stop="viewItem(item)">자세히보기</Button>
              <Button size="sm" variant="secondary" @click.stop="editItem(item)">수정하기</Button>
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
      <div v-if="allSortedItems.length > 0" class="flex justify-center items-center py-8">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, allSortedItems.length) }} / {{ allSortedItems.length }}개
          </span>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { lectureApiService } from "@/services/lectureApi";
import { curriculumApiService } from "@/services/curriculumApi";
import { useAuth } from "@/composables/useAuth";
import { LoadingSpinner, WarningMessage, Button } from "@/components/common";
import { getThumbnailColor } from "@/utils";
import { MESSAGES } from "@/constants";
import type { DashboardItem } from "@/types/lecture";
import { LectureType } from "@/types/lecture";
import type { Lecture } from "@/types/lecture";
import type { CurriculumResponse } from "@/types/curriculum";

const router = useRouter();
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
const itemsPerPage = ref(8); // 페이지당 아이템 수

// 발행된 강의 데이터 (localStorage에서 불러옴 - 기존 로직 유지)
const publishedCourses = ref<DashboardItem[]>([]);

// API 데이터
const lectures = ref<Lecture[]>([]);
const curricula = ref<CurriculumResponse[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// localStorage에서 발행된 강의 불러오기 (기존 로직 유지)
function loadPublishedCourses() {
  const storedCourses = JSON.parse(
    localStorage.getItem("instructorCourses") || "[]"
  );
  if (storedCourses.length > 0) {
    publishedCourses.value = storedCourses.map((course: any) => ({
      id: course.id,
      title: course.title,
      createdDate: new Date(course.createdAt).toLocaleDateString("ko-KR"),
      privacy: "공개",
      thumbnailColor: course.format === "문제" ? "#E3F2FD" : "#E8F5E8",
      type: "lecture" as const,
      duration: "미정",
      tags: [course.category, course.format],
      format: course.format,
      status: course.status,
    }));
  }
}


// API에서 데이터 로딩
async function loadApiData() {
  if (!currentUser.value?.id) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // 사용자별 강의와 커리큘럼 조회
    const [userLectures, userCurricula] = await Promise.all([
      lectureApiService.getUserLectures(currentUser.value.id),
      curriculumApiService.getUserCurriculums(currentUser.value.id)
    ]);
    
    lectures.value = userLectures;
    curricula.value = userCurricula;
    
    console.log('API 데이터 로딩 완료:', { lectures: userLectures.length, curricula: userCurricula.length });
  } catch (err) {
    console.error('API 데이터 로딩 실패:', err);
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 배열 형태의 날짜를 Date 객체로 변환하는 함수
function parseArrayDate(dateArray: number[] | string): string {
  if (typeof dateArray === 'string') {
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
  const apiLectures: DashboardItem[] = lectures.value.map(lecture => ({
    id: lecture.id,
    title: lecture.title,
    createdDate: parseArrayDate(lecture.createdAt),
    privacy: lecture.isPublic ? "공개" : "비공개",
    thumbnailColor: getThumbnailColor(lecture.type),
    type: "lecture" as const,
    duration: "미정",
    tags: [lecture.category, lecture.type],
    format: lecture.type,
    lectureType: lecture.type,
    category: lecture.category,
    difficulty: lecture.difficulty,
    testCaseCount: lecture.testCaseCount,
    status: lecture.isPublic ? "발행됨" : "초안"
  }));

  // API에서 가져온 커리큘럼들을 DashboardItem 형태로 변환
  const apiCurriculums: DashboardItem[] = curricula.value.map(curriculum => ({
    id: curriculum.id,
    title: curriculum.title,
    createdDate: parseArrayDate(curriculum.createdAt),
    privacy: curriculum.isPublic ? "공개" : "비공개",
    thumbnailColor: curriculum.thumbnailImageUrl || getThumbnailColor('curriculum'),
    type: "curriculum" as const,
    duration: curriculum.durationMinutes ? `${curriculum.durationMinutes}분` : "미정",
    tags: curriculum.tags && curriculum.tags.length > 0 ? curriculum.tags : ["커리큘럼"],
    courseCount: curriculum.totalLectureCount,
    status: curriculum.isPublic ? "발행됨" : "초안"
  }));
  const localCourses = publishedCourses.value; // localStorage의 강의들

  switch (activeTab.value) {
    case "curriculum":
      return apiCurriculums; // API에서 가져온 커리큘럼
    case "materials":
      // API 강의 + localStorage 강의 합치기 (중복 제거)
      const combinedMaterials = [...apiLectures];
      localCourses.forEach((localCourse: DashboardItem) => {
        // API에 없는 localStorage 강의만 추가
        if (
          !apiLectures.find(
            (apiLecture: DashboardItem) => apiLecture.id === localCourse.id
          )
        ) {
          combinedMaterials.push(localCourse);
        }
      });
      return combinedMaterials;
    case "all":
    default:
      // 모든 데이터 합치기
      const allItems = [...apiCurriculums, ...apiLectures];
      localCourses.forEach((localCourse: DashboardItem) => {
        if (
          !apiLectures.find(
            (apiLecture: DashboardItem) => apiLecture.id === localCourse.id
          )
        ) {
          allItems.push(localCourse);
        }
      });
      return allItems;
  }
});

// 정렬된 아이템들 (전체)
const allSortedItems = computed(() => {
  const items = [...filteredItems.value];

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

// 현재 표시할 아이템들 (페이지네이션용)
const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return allSortedItems.value.slice(startIndex, endIndex);
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(allSortedItems.value.length / itemsPerPage.value);
});

// 표시할 페이지 번호들 (최대 5개)
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 탭별 개수 계산
function getTabCount(tabId: string) {
  switch (tabId) {
    case "curriculum":
      return curricula.value.length;
    case "materials":
      return lectures.value.length + publishedCourses.value.length;
    case "all":
    default:
      return curricula.value.length + lectures.value.length + publishedCourses.value.length;
  }
}

// 탭 변경 시 페이지 초기화
function handleTabChange(tabId: string) {
  activeTab.value = tabId;
  currentPage.value = 1; // 첫 페이지로 이동
}

// 정렬 변경 시 페이지 초기화
function handleSortChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  sortBy.value = target.value;
  currentPage.value = 1; // 첫 페이지로 이동
}

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
    router.push({ name: "instructor-create-curriculum", query: { edit: item.id, mode: "edit" } });
  } else {
    if (item.format === "문제" || item.lectureType === LectureType.PROBLEM) {
      router.push({ name: "instructor-create-problem", query: { edit: item.id, mode: "edit" } });
    } else {
      router.push({ name: "instructor-create-markdown", query: { edit: item.id, mode: "edit" } });
    }
  }
}

// 새로고침 함수
async function refreshLectures() {
  await Promise.all([
    loadApiData(),
    loadPublishedCourses()
  ]);
  currentPage.value = 1; // 첫 페이지로 이동
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
  // localStorage에서 발행된 강의 먼저 로드 (즉시 표시)
  loadPublishedCourses();

  // API에서 강의 및 커리큘럼 데이터 가져오기
  await loadApiData();
});
</script>
