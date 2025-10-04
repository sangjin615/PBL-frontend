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
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 검색 아이콘 -->
            <button class="p-2 text-gray-400 hover:text-gray-600">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>

            <!-- API 테스트 버튼 -->
            <button
              @click="testApi"
              :disabled="apiTest.isLoading.value"
              class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              {{ apiTest.isLoading.value ? "테스트 중..." : "API 테스트" }}
            </button>

            <!-- 만들기 버튼 -->
            <div class="relative">
              <button
                @click="showCreateMenu = !showCreateMenu"
                class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-1"
              >
                <span>+ 만들기</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- 드롭다운 메뉴 -->
              <div
                v-if="showCreateMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10"
              >
                <div class="py-1">
                  <button
                    @click="goToCreateCurriculum"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <span>커리큘럼 만들기</span>
                  </button>
                  <button
                    @click="goToCreateMarkdown"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>강의 만들기</span>
                  </button>
                  <button
                    @click="goToCreateProblem"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <span>문제 만들기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 정렬 옵션 -->
    <div class="bg-white border-b">
      <div class="px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">정렬:</span>
            <select
              v-model="sortBy"
              class="text-sm border-0 bg-transparent text-gray-700 focus:ring-0"
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
      <div
        v-if="lecturesStore.loading && sortedItems.length === 0"
        class="flex justify-center items-center py-12"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <span class="ml-3 text-gray-600">강의 데이터를 불러오는 중...</span>
      </div>

      <!-- 에러 상태 (경고 형태로 변경, 데이터는 계속 표시) -->
      <div
        v-if="lecturesStore.error && !lecturesStore.loading"
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-yellow-600 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-yellow-800 font-medium text-sm">API 연결 문제</h3>
            <p class="text-yellow-700 text-xs mt-1">
              {{ lecturesStore.error }}
            </p>
          </div>
          <button
            @click="refreshLectures"
            class="ml-auto px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
          >
            재시도
          </button>
        </div>
      </div>

      <!-- 강의 카드 그리드 (항상 표시) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="item in sortedItems"
          :key="`${item.type}-${item.id}`"
          @click="handleItemClick(item)"
          class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
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

            <!-- 비공개 상태 -->
            <div class="flex items-center text-sm text-gray-500 mt-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              {{ item.privacy }}
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div
        v-if="sortedItems.length === 0 && !lecturesStore.loading"
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

      <!-- 더보기 버튼 -->
      <div v-if="sortedItems.length > 0" class="flex justify-center mt-8">
        <button
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          더보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLecturesStore } from "@/stores/lectures";
import { useApiTest } from "@/composables/useApiTest";
import type { DashboardItem } from "@/types/lecture";
import { LectureType } from "@/types/lecture";

const router = useRouter();
const lecturesStore = useLecturesStore();
const apiTest = useApiTest();

// 사용자 정보
const userInfo = ref({
  name: "김준성",
  handle: "@대학원에 갈거에요",
  subscribers: "8.71천명",
});

// 탭 데이터
const tabs = ref([
  { id: "all", name: "전체" },
  { id: "curriculum", name: "커리큘럼" },
  { id: "materials", name: "강의물" },
]);

const activeTab = ref("all");
const sortBy = ref("recommended");
const showCreateMenu = ref(false);

// 하드코딩된 커리큘럼 데이터 (임시 유지 - 향후 커리큘럼 API 연결 시 제거)
const curricula = ref([
  {
    id: 1,
    title: "[2025] 웹 개발 완전정복",
    createdDate: "2025.09.01",
    privacy: "비공개",
    thumbnailColor: "#FFE4E1",
    type: "curriculum" as const,
    courseCount: 12,
    duration: "48시간",
    tags: ["#웹개발", "#풀스택", "#프론트엔드", "#백엔드"],
  },
  {
    id: 2,
    title: "[2025] 데이터 사이언스 마스터",
    createdDate: "2025.08.28",
    privacy: "비공개",
    thumbnailColor: "#FFE4B5",
    type: "curriculum" as const,
    courseCount: 8,
    duration: "32시간",
    tags: ["#데이터사이언스", "#파이썬", "#머신러닝", "#분석"],
  },
]);

// 발행된 강의 데이터 (localStorage에서 불러옴 - 기존 로직 유지)
const publishedCourses = ref<DashboardItem[]>([]);

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

// API에서 가져온 강의 데이터와 기존 데이터 통합
const filteredItems = computed(() => {
  const apiLectures = lecturesStore.dashboardItems; // API에서 가져온 강의들
  const localCourses = publishedCourses.value; // localStorage의 강의들

  switch (activeTab.value) {
    case "curriculum":
      return curricula.value; // 임시로 하드코딩된 커리큘럼 반환
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
      const allItems = [...curricula.value, ...apiLectures];
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

// 정렬된 아이템들
const sortedItems = computed(() => {
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

// 아이템 클릭 핸들러
function handleItemClick(item: DashboardItem) {
  if (item.type === "curriculum") {
    // 커리큘럼 클릭 시 커리큘럼 개요 페이지로 이동
    router.push({
      name: "curriculum-overview",
      params: { id: `course_${item.id}` },
      query: { mode: "instructor" },
    });
  } else {
    // 강의물 클릭 시 강의 수정 페이지로 이동
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
  await lecturesStore.fetchAllLectures();
  loadPublishedCourses(); // localStorage 데이터도 다시 로드
}

// API 테스트 함수
async function testApi() {
  try {
    const success = await apiTest.testApiConnection();

    // 테스트 결과를 콘솔에 출력
    console.log("=== API 테스트 결과 ===");
    apiTest.testResults.value.forEach((result) => console.log(result));

    // 테스트 성공 시 데이터 새로고침
    if (success) {
      await refreshLectures();
      alert("✅ API 연결 성공! 데이터를 새로고침했습니다.");
    } else {
      alert("❌ API 연결 실패. 콘솔을 확인해주세요.");
    }
  } catch (error) {
    console.error("API 테스트 중 오류:", error);
    alert("❌ API 테스트 중 오류가 발생했습니다.");
  }
}

// 만들기 메뉴 네비게이션 함수들
function goToCreateCurriculum() {
  showCreateMenu.value = false;
  router.push({ name: 'instructor-create-curriculum' });
}

function goToCreateMarkdown() {
  showCreateMenu.value = false;
  router.push({ name: 'instructor-create-markdown' });
}

function goToCreateProblem() {
  showCreateMenu.value = false;
  router.push({ name: 'instructor-create-problem' });
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // localStorage에서 발행된 강의 먼저 로드 (즉시 표시)
  loadPublishedCourses();

  // API에서 강의 데이터 가져오기 (백그라운드에서 실행, 실패해도 기존 데이터 유지)
  try {
    await lecturesStore.fetchAllLectures();
  } catch (error) {
    console.warn("API 호출 실패, 기존 데이터로 계속 진행:", error);
    // API 실패 시에도 에러를 초기화하여 기존 데이터를 표시
    lecturesStore.clearError();
  }
});
</script>
