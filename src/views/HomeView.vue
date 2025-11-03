<template>
  <section class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- 로딩 상태 -->
      <div
        v-if="
          (loading || lectureLoading || curriculumLoading) &&
          lectures.length === 0 &&
          curriculums.length === 0 &&
          courses.length === 0
        "
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
        <!-- 검색 모드: 기존 통합 검색 결과 -->
        <template v-if="isSearchMode">
          <!-- 검색 결과 헤더 -->
          <div class="mb-4">
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

        <!-- 추천 모드: 강의 섹션 + 커리큘럼 섹션 -->
        <template v-else>
          <!-- 카테고리 탭 -->
          <div class="flex items-center justify-between mb-6">
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

          <!-- 커리큘럼 추천 섹션 (강의 섹션을 중간에 삽입) -->
          <div v-if="curriculums.length > 0 || filteredCurriculums.length > 0">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold">추천 커리큘럼</h2>
              <span v-if="activeTab !== '전체'" class="text-sm text-gray-600">
                {{ filteredCurriculums.length }}개
              </span>
            </div>

            <!-- 통합 그리드: 커리큘럼 + 강의 섹션 -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <!-- 커리큘럼 아이템들을 순회하면서 강의 섹션을 중간에 삽입 -->
              <template
                v-for="(curriculum, index) in sortedCurriculums"
                :key="`curriculum-${curriculum.id}`"
              >
                <!-- 커리큘럼 카드 -->
                <CourseCard :course="curriculum" />

                <!-- 강의 섹션 삽입 (그리드 3~6번째 행 사이, xl 기준 12~24번째 아이템 뒤) -->
                <!-- 커리큘럼이 충분할 때만 그리드 내부에 삽입 -->
                <!-- 로딩 중이거나 강의가 있을 때 표시 -->
                <div
                  v-if="
                    (lectureLoading || filteredLectures.length > 0) &&
                    canInsertLectureInGrid &&
                    lectureInsertRow >= 3 &&
                    lectureInsertRow <= 6 &&
                    index + 1 === lectureInsertIndex
                  "
                  class="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 my-6"
                >
                  <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold">추천 강의</h2>
                    <div class="flex items-center gap-2">
                      <span
                        v-if="activeTab !== '전체'"
                        class="text-sm text-gray-600"
                      >
                        {{ filteredLectures.length }}개
                      </span>
                      <span v-if="lectureLoading" class="text-sm text-gray-600">
                        로딩 중...
                      </span>
                      <div
                        v-if="lectureLoading"
                        class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                      ></div>
                    </div>
                  </div>

                  <!-- 로딩 중 스켈레톤 -->
                  <div
                    v-if="lectureLoading && filteredLectures.length === 0"
                    class="relative w-full"
                  >
                    <div class="flex gap-4 overflow-hidden">
                      <div
                        v-for="i in 4"
                        :key="`skeleton-lecture-${i}`"
                        class="flex-shrink-0 w-64"
                      >
                        <div
                          class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                        >
                          <div class="aspect-video bg-gray-200"></div>
                          <div class="p-4 space-y-3">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 수평 스크롤 컨테이너 -->
                  <div v-else class="relative w-full">
                    <!-- 좌우 스크롤 버튼 -->
                    <button
                      v-if="filteredLectures.length > 4"
                      @click="scrollLecturesLeft"
                      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                      :disabled="lectureScrollIndex === 0"
                      :class="
                        lectureScrollIndex === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      "
                    >
                      <svg
                        class="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 19l-7-7 7-7"
                        ></path>
                      </svg>
                    </button>

                    <button
                      v-if="lectures.length > 4"
                      @click="scrollLecturesRight"
                      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                      :disabled="
                        lectureScrollIndex >= maxLectureScrollIndex &&
                        !lectureHasMore
                      "
                      :class="
                        lectureScrollIndex >= maxLectureScrollIndex &&
                        !lectureHasMore
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      "
                    >
                      <svg
                        class="w-6 h-6 text-gray-700"
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

                    <!-- 스크롤 가능한 강의 목록 -->
                    <div
                      ref="lectureScrollContainer"
                      class="overflow-x-auto scrollbar-hide pb-4"
                      style="scroll-behavior: smooth"
                      @scroll="onLectureScroll"
                    >
                      <div class="flex gap-4" style="min-width: max-content">
                        <div
                          v-for="lecture in sortedLectures"
                          :key="`lecture-${lecture.id}`"
                          class="flex-shrink-0 w-64"
                        >
                          <!-- 강의 카드 (세로형) -->
                          <div
                            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                            @click.stop="goToLecture(lecture)"
                          >
                            <!-- 썸네일 영역 -->
                            <div
                              class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                            >
                              <div class="text-white text-center p-4">
                                <div
                                  class="text-sm font-semibold mb-2 line-clamp-2"
                                >
                                  {{ lecture.title }}
                                </div>
                                <div class="text-xs opacity-80">
                                  {{ lecture.category }}
                                </div>
                              </div>
                            </div>

                            <!-- 정보 영역 -->
                            <div class="p-4">
                              <div
                                class="flex items-center justify-between mb-2"
                              >
                                <span
                                  class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                                >
                                  강의
                                </span>
                                <span class="text-xs text-gray-500">{{
                                  lecture.difficulty
                                }}</span>
                              </div>
                              <h3
                                class="text-sm font-semibold line-clamp-2 mb-1"
                              >
                                {{ lecture.title }}
                              </h3>
                              <p class="text-xs text-gray-600">
                                {{ lecture.instructor }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <!-- 로딩 표시 (마지막 강의 근처) -->
                        <div
                          v-if="lectureLoading && lectureHasMore"
                          class="flex-shrink-0 w-64 flex items-center justify-center"
                        >
                          <div class="flex flex-col items-center gap-2">
                            <div
                              class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                            ></div>
                            <span class="text-xs text-gray-600"
                              >로딩 중...</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- 강의 섹션 (커리큘럼이 적을 때 그리드 아래에 표시) -->
            <!-- 로딩 중이거나 강의가 있을 때 표시 -->
            <div
              v-if="
                (lectureLoading || filteredLectures.length > 0) &&
                !canInsertLectureInGrid &&
                (curriculums.length > 0 || filteredCurriculums.length > 0)
              "
              class="mt-8 mb-8"
            >
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">추천 강의</h2>
                <div class="flex items-center gap-2">
                  <span v-if="lectureLoading" class="text-sm text-gray-600">
                    로딩 중...
                  </span>
                  <div
                    v-if="lectureLoading"
                    class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                  ></div>
                </div>
              </div>

              <!-- 로딩 중 스켈레톤 -->
              <div
                v-if="lectureLoading && filteredLectures.length === 0"
                class="relative w-full"
              >
                <div class="flex gap-4 overflow-hidden">
                  <div
                    v-for="i in 4"
                    :key="`skeleton-lecture-standalone-${i}`"
                    class="flex-shrink-0 w-64"
                  >
                    <div
                      class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                    >
                      <div class="aspect-video bg-gray-200"></div>
                      <div class="p-4 space-y-3">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 수평 스크롤 컨테이너 -->
              <div v-else class="relative w-full">
                <!-- 좌우 스크롤 버튼 -->
                <button
                  v-if="lectures.length > 4"
                  @click="scrollLecturesLeft"
                  class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                  :disabled="lectureScrollIndex === 0"
                  :class="
                    lectureScrollIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  "
                >
                  <svg
                    class="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>

                <button
                  v-if="filteredLectures.length > 4"
                  @click="scrollLecturesRight"
                  class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                  :disabled="
                    lectureScrollIndex >= maxLectureScrollIndex &&
                    !lectureHasMore
                  "
                  :class="
                    lectureScrollIndex >= maxLectureScrollIndex &&
                    !lectureHasMore
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  "
                >
                  <svg
                    class="w-6 h-6 text-gray-700"
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

                <!-- 스크롤 가능한 강의 목록 -->
                <div
                  ref="lectureScrollContainer"
                  class="overflow-x-auto scrollbar-hide pb-4"
                  style="scroll-behavior: smooth"
                  @scroll="onLectureScroll"
                >
                  <div class="flex gap-4" style="min-width: max-content">
                    <div
                      v-for="lecture in filteredLectures"
                      :key="`lecture-${lecture.id}`"
                      class="flex-shrink-0 w-64"
                    >
                      <!-- 강의 카드 (세로형) -->
                      <div
                        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        @click.stop="goToLecture(lecture)"
                      >
                        <!-- 썸네일 영역 -->
                        <div
                          class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                        >
                          <div class="text-white text-center p-4">
                            <div
                              class="text-sm font-semibold mb-2 line-clamp-2"
                            >
                              {{ lecture.title }}
                            </div>
                            <div class="text-xs opacity-80">
                              {{ lecture.category }}
                            </div>
                          </div>
                        </div>

                        <!-- 정보 영역 -->
                        <div class="p-4">
                          <div class="flex items-center justify-between mb-2">
                            <span
                              class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                            >
                              강의
                            </span>
                            <span class="text-xs text-gray-500">{{
                              lecture.difficulty
                            }}</span>
                          </div>
                          <h3 class="text-sm font-semibold line-clamp-2 mb-1">
                            {{ lecture.title }}
                          </h3>
                          <p class="text-xs text-gray-600">
                            {{ lecture.instructor }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- 로딩 표시 (마지막 강의 근처) -->
                    <div
                      v-if="lectureLoading && lectureHasMore"
                      class="flex-shrink-0 w-64 flex items-center justify-center"
                    >
                      <div class="flex flex-col items-center gap-2">
                        <div
                          class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                        ></div>
                        <span class="text-xs text-gray-600">로딩 중...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 커리큘럼 로딩 중 스켈레톤 (2줄) -->
            <div
              v-if="curriculumLoading && curriculums.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            >
              <!-- 스켈레톤 카드 8개 (2줄: xl 기준 4개씩) -->
              <div
                v-for="i in 8"
                :key="`skeleton-${i}`"
                class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <!-- 썸네일 스켈레톤 -->
                <div class="aspect-video bg-gray-200"></div>
                <!-- 정보 영역 스켈레톤 -->
                <div class="p-4 space-y-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <!-- 하단 스크롤 로딩 표시 -->
            <div
              v-if="curriculumLoading && curriculums.length > 0"
              class="flex justify-center items-center py-8 mt-4"
            >
              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                ></div>
                <span class="text-sm text-gray-600"
                  >커리큘럼을 불러오는 중...</span
                >
              </div>
            </div>

            <!-- 스크롤 감지를 위한 sentinel 요소 (로딩 표시 아래에 위치) -->
            <div ref="curriculumSentinel" class="h-4"></div>
          </div>

          <!-- 강의만 있는 경우 (커리큘럼이 없을 때) -->
          <!-- 로딩 중이거나 강의가 있을 때 표시 -->
          <div
            v-else-if="lectureLoading || filteredLectures.length > 0"
            class="mb-12"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold">추천 강의</h2>
              <div class="flex items-center gap-2">
                <span v-if="activeTab !== '전체'" class="text-sm text-gray-600">
                  {{ filteredLectures.length }}개
                </span>
                <span v-if="lectureLoading" class="text-sm text-gray-600">
                  로딩 중...
                </span>
                <div
                  v-if="lectureLoading"
                  class="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                ></div>
              </div>
            </div>

            <!-- 로딩 중 스켈레톤 -->
            <div
              v-if="lectureLoading && filteredLectures.length === 0"
              class="relative w-full"
            >
              <div class="flex gap-4 overflow-hidden">
                <div
                  v-for="i in 4"
                  :key="`skeleton-lecture-only-${i}`"
                  class="flex-shrink-0 w-64"
                >
                  <div
                    class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div class="aspect-video bg-gray-200"></div>
                    <div class="p-4 space-y-3">
                      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 수평 스크롤 컨테이너 -->
            <div v-else class="relative w-full">
              <!-- 좌우 스크롤 버튼 -->
              <button
                v-if="lectures.length > 4"
                @click="scrollLecturesLeft"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                :disabled="lectureScrollIndex === 0"
                :class="
                  lectureScrollIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                "
              >
                <svg
                  class="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>

              <button
                v-if="lectures.length > 4"
                @click="scrollLecturesRight"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
                :disabled="
                  lectureScrollIndex >= maxLectureScrollIndex && !lectureHasMore
                "
                :class="
                  lectureScrollIndex >= maxLectureScrollIndex && !lectureHasMore
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                "
              >
                <svg
                  class="w-6 h-6 text-gray-700"
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

              <!-- 스크롤 가능한 강의 목록 -->
              <div
                ref="lectureScrollContainerStandalone"
                class="overflow-x-auto scrollbar-hide pb-4"
                style="scroll-behavior: smooth"
                @scroll="onLectureScroll"
              >
                <div class="flex gap-4" style="min-width: max-content">
                  <div
                    v-for="lecture in lectures"
                    :key="`lecture-${lecture.id}`"
                    class="flex-shrink-0 w-64"
                  >
                    <!-- 강의 카드 (세로형) -->
                    <div
                      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      @click.stop="goToLecture(lecture)"
                    >
                      <!-- 썸네일 영역 -->
                      <div
                        class="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      >
                        <div class="text-white text-center p-4">
                          <div class="text-sm font-semibold mb-2 line-clamp-2">
                            {{ lecture.title }}
                          </div>
                          <div class="text-xs opacity-80">
                            {{ lecture.category }}
                          </div>
                        </div>
                      </div>

                      <!-- 정보 영역 -->
                      <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                          <span
                            class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                          >
                            강의
                          </span>
                          <span class="text-xs text-gray-500">{{
                            lecture.difficulty
                          }}</span>
                        </div>
                        <h3 class="text-sm font-semibold line-clamp-2 mb-1">
                          {{ lecture.title }}
                        </h3>
                        <p class="text-xs text-gray-600">
                          {{ lecture.instructor }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 로딩 표시 (마지막 강의 근처) -->
                  <div
                    v-if="lectureLoading && lectureHasMore"
                    class="flex-shrink-0 w-64 flex items-center justify-center"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <div
                        class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                      ></div>
                      <span class="text-xs text-gray-600">로딩 중...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 결과 없음 메시지 (커리큘럼과 강의 둘 다 없을 때만 표시) -->
          <div
            v-if="
              filteredLectures.length === 0 &&
              filteredCurriculums.length === 0 &&
              !lectureLoading &&
              !curriculumLoading &&
              !isSearchMode
            "
            class="flex flex-col items-center justify-center py-16"
          >
            <div class="text-gray-500 text-lg mb-2">
              <span v-if="activeTab !== '전체'">
                추천되는 {{ activeTab }} 커리큘럼/강의를 찾을 수 없습니다.
              </span>
              <span v-else>추천 콘텐츠가 없습니다.</span>
            </div>
            <div v-if="activeTab !== '전체'" class="text-sm text-gray-400">
              다른 카테고리를 선택해보세요.
            </div>
          </div>
        </template>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import CourseCard from "../components/course/CourseCard.vue";
import type { Course } from "../types/course";
import { useSearchStore } from "../stores/search";
import { useUiStore } from "../stores/ui";
import { curriculumApiService } from "../services/curriculumApi";
import { searchApiService } from "../services/searchApi";
import { recommendationApiService } from "../services/recommendationApi";
import { lectureApiService } from "../services/lectureApi";
import { getCurrentUserId } from "../config/api";
import type { Lecture } from "../types/lecture";

const router = useRouter();
const searchStore = useSearchStore();
const ui = useUiStore();

const categories = searchStore.allCategories;
const activeTab = ref<string>("전체");
const sortBy = ref<"popular" | "latest" | "rating" | "reviews">("popular");

// 검색 모드용 (통합 검색 결과)
const courses = ref<Course[]>([]);

// 추천 모드용 (강의와 커리큘럼 분리)
const lectures = ref<Course[]>([]);
const curriculums = ref<Course[]>([]);

// 강의 스크롤 관련 (두 개의 스크롤 컨테이너 지원)
const lectureScrollContainer = ref<HTMLElement | null>(null); // 중간 삽입 버전
const lectureScrollContainerStandalone = ref<HTMLElement | null>(null); // 독립 버전
const lectureScrollIndex = ref<number>(0);
const lecturesPerView = ref<number>(4); // 한 번에 보이는 강의 개수

const maxLectureScrollIndex = computed(() => {
  const lecturesToUse = filteredLectures.value;
  return Math.max(
    0,
    Math.ceil(lecturesToUse.length / lecturesPerView.value) - 1
  );
});

const loading = ref<boolean>(false);
const lectureLoading = ref<boolean>(false);
const curriculumLoading = ref<boolean>(false);
const error = ref<string | null>(null);

// 페이징 상태
const currentPage = ref<number>(0);
const curriculumPage = ref<number>(0);
const lecturePage = ref<number>(0);
const hasMore = ref<boolean>(true);
const curriculumHasMore = ref<boolean>(true);
const lectureHasMore = ref<boolean>(true);
const pageSize = 12;

// 검색 모드 여부
const isSearchMode = computed(() => !!ui.searchQuery?.trim());

// 강의 섹션 삽입 위치 (그리드 행 기준 3~6 사이 랜덤)
const lectureInsertRow = ref<number>(3);

// 화면 크기에 따른 열 수 감지
const windowWidth = ref<number>(
  typeof window !== "undefined" ? window.innerWidth : 1920
);

// 그리드의 열 수 계산 (반응형)
// xl (1280px 이상): 4열, lg (1024px 이상): 3열, sm (640px 이상): 2열, 기본: 1열
const gridColumns = computed(() => {
  if (windowWidth.value >= 1280) return 4; // xl:grid-cols-4
  if (windowWidth.value >= 1024) return 3; // lg:grid-cols-3
  if (windowWidth.value >= 640) return 2; // sm:grid-cols-2
  return 1; // 기본: grid-cols-1
});

// 강의 섹션이 삽입될 커리큘럼 인덱스 계산
// 행 번호(3~6) * 열 수 = 해당 행의 마지막 아이템 뒤 인덱스
// 예: xl 기준(4열)
//   - 행 3 * 4 = 12 (12번째 아이템 뒤, index 11 다음)
//   - 행 4 * 4 = 16 (16번째 아이템 뒤, index 15 다음)
//   - 행 5 * 4 = 20 (20번째 아이템 뒤, index 19 다음)
//   - 행 6 * 4 = 24 (24번째 아이템 뒤, index 23 다음)
const lectureInsertIndex = computed(() => {
  return lectureInsertRow.value * gridColumns.value;
});

// 강의 섹션이 그리드 내부에 삽입될 수 있는지 확인
// 커리큘럼 개수가 lectureInsertIndex보다 많거나 같으면 그리드 내부에 삽입
const canInsertLectureInGrid = computed(() => {
  // 필터링이 적용되지 않았을 때는 원본 개수, 필터링 적용 시에는 필터링된 개수 사용
  const curriculumsToCheck =
    activeTab.value === "전체"
      ? curriculums.value.length
      : filteredCurriculums.value.length;
  return curriculumsToCheck >= lectureInsertIndex.value;
});

// Intersection Observer를 위한 sentinel 요소
const sentinel = ref<HTMLElement | null>(null);
const curriculumSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
let curriculumObserver: IntersectionObserver | null = null;

// 강의 스크롤 함수 (두 컨테이너 모두 지원)
function getLectureScrollContainer(): HTMLElement | null {
  // 중간 삽입 버전이 있으면 우선 사용, 없으면 독립 버전 사용
  let container =
    lectureScrollContainer.value || lectureScrollContainerStandalone.value;

  // DOM 요소인지 확인
  if (container && container instanceof HTMLElement) {
    return container;
  }

  // ref가 아직 할당되지 않았을 수 있으므로 직접 DOM에서 찾기 시도
  // 클래스 기반으로 찾기 (ref는 DOM에 직접 노출되지 않음)
  const containersByClass = document.querySelectorAll(
    ".overflow-x-auto.scrollbar-hide"
  );

  // 먼저 "추천 강의" 제목을 가진 섹션 내부의 컨테이너 찾기
  for (let i = 0; i < containersByClass.length; i++) {
    const el = containersByClass[i] as HTMLElement;
    // 부모 요소에서 "추천 강의" 텍스트를 포함하는지 확인
    const parentSection = el.closest('div[class*="col-span"]');
    if (parentSection) {
      const sectionText = parentSection.textContent || "";
      if (sectionText.includes("추천 강의") || sectionText.includes("강의")) {
        return el;
      }
    }
  }

  // 위에서 찾지 못한 경우 첫 번째 스크롤 컨테이너 반환
  if (containersByClass.length > 0) {
    return containersByClass[0] as HTMLElement;
  }

  console.warn("[홈 화면] 스크롤 컨테이너를 찾을 수 없음:", {
    lectureScrollContainer: lectureScrollContainer.value,
    lectureScrollContainerStandalone: lectureScrollContainerStandalone.value,
    containersFound: containersByClass.length,
  });

  return null;
}

async function scrollLecturesLeft() {
  if (lectureScrollIndex.value > 0) {
    lectureScrollIndex.value--;
    // DOM이 업데이트되도록 기다림
    await nextTick();
    const container = getLectureScrollContainer();
    if (container) {
      const cardWidth = 256 + 16; // 카드 너비 + gap
      const scrollLeft =
        lectureScrollIndex.value * cardWidth * lecturesPerView.value;

      // scrollTo가 있으면 사용, 없으면 scrollLeft 직접 설정
      if (typeof container.scrollTo === "function") {
        try {
          container.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        } catch (e) {
          console.warn("[홈 화면] scrollTo 실패, scrollLeft 사용:", e);
          container.scrollLeft = scrollLeft;
        }
      } else {
        // scrollTo가 없으면 scrollLeft 직접 설정
        container.scrollLeft = scrollLeft;
      }
    } else {
      console.warn("[홈 화면] 스크롤 컨테이너를 찾을 수 없음");
    }
  }
}

async function scrollLecturesRight() {
  if (lectureScrollIndex.value < maxLectureScrollIndex.value) {
    lectureScrollIndex.value++;
    // DOM이 업데이트되도록 기다림
    await nextTick();
    const container = getLectureScrollContainer();
    if (container) {
      const cardWidth = 256 + 16; // 카드 너비 + gap
      const scrollLeft =
        lectureScrollIndex.value * cardWidth * lecturesPerView.value;

      // scrollTo가 있으면 사용, 없으면 scrollLeft 직접 설정
      if (typeof container.scrollTo === "function") {
        try {
          container.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        } catch (e) {
          console.warn("[홈 화면] scrollTo 실패, scrollLeft 사용:", e);
          container.scrollLeft = scrollLeft;
        }
      } else {
        // scrollTo가 없으면 scrollLeft 직접 설정
        container.scrollLeft = scrollLeft;
      }
    } else {
      console.warn("[홈 화면] 스크롤 컨테이너를 찾을 수 없음");
    }
  }
}

function onLectureScroll(event: Event) {
  const target = event.target as HTMLElement;
  const cardWidth = 256 + 16;
  const scrollLeft = target.scrollLeft;
  lectureScrollIndex.value = Math.round(
    scrollLeft / (cardWidth * lecturesPerView.value)
  );

  // 마지막 강의에 도달했는지 확인 (스크롤이 끝에 거의 도달했을 때)
  const scrollWidth = target.scrollWidth;
  const clientWidth = target.clientWidth;
  const scrollThreshold = 100; // 끝에서 100px 전에 미리 로드

  if (
    scrollLeft + clientWidth >= scrollWidth - scrollThreshold &&
    lectureHasMore.value &&
    !lectureLoading.value
  ) {
    console.log("[홈 화면] 강의 섹션 마지막 도달, 다음 페이지 로드");
    loadLectures();
  }
}

// Observer 설정 함수
function setupObserver() {
  // 기존 observer 제거
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // 검색 모드일 때만 observer 설정
  if (sentinel.value && isSearchMode.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore.value &&
          !loading.value &&
          isSearchMode.value
        ) {
          searchUnified();
        }
      },
      {
        rootMargin: "100px",
      }
    );
    observer.observe(sentinel.value);
  }
}

// 커리큘럼 Observer 설정
function setupCurriculumObserver() {
  // 기존 observer 제거
  if (curriculumObserver) {
    curriculumObserver.disconnect();
    curriculumObserver = null;
  }

  // 검색 모드가 아니고, sentinel 요소가 존재할 때 observer 설정
  // curriculumHasMore는 observer 콜백 내에서 체크하므로 여기서는 체크하지 않음
  if (curriculumSentinel.value && !isSearchMode.value) {
    console.log("[홈 화면] 커리큘럼 Observer 설정:", {
      hasSentinel: !!curriculumSentinel.value,
      isSearchMode: isSearchMode.value,
      hasMore: curriculumHasMore.value,
      isLoading: curriculumLoading.value,
      sentinelElement: curriculumSentinel.value,
    });

    curriculumObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log("[홈 화면] 커리큘럼 Sentinel 감지:", {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          hasMore: curriculumHasMore.value,
          isLoading: curriculumLoading.value,
          isSearchMode: isSearchMode.value,
        });

        if (
          entry.isIntersecting &&
          curriculumHasMore.value &&
          !curriculumLoading.value &&
          !isSearchMode.value
        ) {
          console.log("[홈 화면] 커리큘럼 다음 페이지 로드 시작");
          loadCurriculums();
        }
      },
      {
        rootMargin: "200px", // 더 일찍 감지하도록 여유 공간 증가
        threshold: 0.1, // 10%만 보여도 감지
      }
    );
    curriculumObserver.observe(curriculumSentinel.value);
  } else {
    console.log("[홈 화면] 커리큘럼 Observer 설정 건너뜀:", {
      hasSentinel: !!curriculumSentinel.value,
      isSearchMode: isSearchMode.value,
      hasMore: curriculumHasMore.value,
      isLoading: curriculumLoading.value,
    });
  }
}

// 검색어 변경 감지
watch(
  () => ui.searchQuery,
  async (
    newQuery: string | null | undefined,
    oldQuery: string | null | undefined
  ) => {
    if (newQuery !== oldQuery) {
      courses.value = [];
      lectures.value = [];
      curriculums.value = [];
      currentPage.value = 0;
      curriculumPage.value = 0;
      lecturePage.value = 0;
      hasMore.value = true;
      curriculumHasMore.value = true;
      lectureHasMore.value = true;

      setupObserver();
      setupCurriculumObserver();

      if (newQuery?.trim()) {
        await searchUnified();
      } else {
        await loadRecommendations();
      }
    }
  }
);

// 검색 모드 변경 감지
watch(isSearchMode, () => {
  setupObserver();
  setupCurriculumObserver();
});

// 화면 크기 변경 감지
function handleResize() {
  windowWidth.value = window.innerWidth;
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // 화면 크기 감지 리스너 추가
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
    windowWidth.value = window.innerWidth;
  }

  // 강의 섹션 삽입 행 위치 랜덤 결정 (3~6번째 행 사이)
  // xl:grid-cols-4 기준으로: 행 3 = 12번째 아이템, 행 4 = 16번째, 행 5 = 20번째, 행 6 = 24번째
  lectureInsertRow.value = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, 6 중 하나

  if (isSearchMode.value) {
    await searchUnified();
    await nextTick();
    setupObserver();
  } else {
    await loadRecommendations();
    await nextTick();
    setupCurriculumObserver();
  }
});

// 컴포넌트 언마운트 시 observer 정리
onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
  if (observer) {
    observer.disconnect();
  }
  if (curriculumObserver) {
    curriculumObserver.disconnect();
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
function lectureToCourse(lecture: Lecture | any): Course {
  // 추천 API는 lectureId 필드를 반환하므로, id 대신 lectureId를 우선 사용
  let lectureId: number | null = null;

  // 1순위: lectureId 필드 사용 (추천 API 응답)
  if (lecture.lectureId !== undefined && lecture.lectureId !== null) {
    lectureId = Number(lecture.lectureId);
  }
  // 2순위: id 필드 사용 (일반 API 응답)
  else if (lecture.id !== undefined && lecture.id !== null) {
    lectureId = Number(lecture.id);
  }

  if (!lectureId || isNaN(lectureId)) {
    console.warn("[홈 화면] 강의 ID 없음:", lecture);
    lectureId = null;
  }

  // 작성자 정보 디버깅
  if (!lecture.author?.username && !lecture.authorName) {
    console.warn("[홈 화면] 강의 작성자 정보 없음:", {
      lectureId,
      title: lecture.title,
      author: lecture.author,
      authorName: lecture.authorName,
      fullLecture: lecture,
    });
  }

  // 작성자 정보 추출 (여러 가능한 필드 확인)
  let instructorName = "알 수 없음";
  if (lecture.author?.username) {
    instructorName = lecture.author.username;
  } else if (lecture.authorName) {
    instructorName = lecture.authorName;
  } else if (lecture.author?.name) {
    instructorName = lecture.author.name;
  } else if (typeof lecture.author === "string") {
    instructorName = lecture.author;
  }

  return {
    id: lectureId ? `lecture-${lectureId}` : `lecture-unknown-${Date.now()}`,
    title: lecture.title || "제목 없음",
    instructor: instructorName,
    category: lecture.category || "미분류",
    rating: 0,
    studentCount: 0,
    reviewsCount: 0,
    price: 0,
    tags: lecture.tags || [],
    languages: [],
    difficulty: lecture.difficulty || "기초",
    description: lecture.description || "",
    createdAt: lecture.createdAt
      ? formatDate(lecture.createdAt)
      : new Date().toISOString(),
    type: "lecture" as const,
    lectureId: lectureId || undefined,
    problemsCount: lecture.type === "PROBLEM" ? 1 : 0,
    thumbnail: lecture.thumbnailImageUrl || undefined,
    totalLectureCount: 1,
  };
}

// 커리큘럼을 Course 타입으로 변환
function curriculumToCourse(curriculum: any): Course {
  // 추천 API는 curriculumId 필드를 반환하므로, id 대신 curriculumId를 우선 사용
  let curriculumId: string | null = null;

  // 1순위: curriculumId 필드 사용 (추천 API 응답)
  if (
    curriculum.curriculumId !== undefined &&
    curriculum.curriculumId !== null
  ) {
    curriculumId = String(curriculum.curriculumId);
  }
  // 2순위: id 필드 사용 (일반 API 응답)
  else if (curriculum.id !== undefined && curriculum.id !== null) {
    curriculumId = String(curriculum.id);
  }

  if (!curriculumId) {
    console.warn("[홈 화면] 커리큘럼 ID 없음:", curriculum);
  }

  return {
    id: curriculumId || `curriculum-unknown-${Date.now()}`,
    title: curriculum.title || "제목 없음",
    instructor:
      curriculum.author?.username || curriculum.authorName || "알 수 없음",
    category: curriculum.category || "미분류",
    rating: curriculum.averageRating || 0,
    studentCount: curriculum.studentCount || 0,
    reviewsCount: curriculum.reviewsCount || 0,
    price: 0,
    tags: curriculum.tags || [],
    languages: curriculum.languages || [],
    difficulty: curriculum.difficulty,
    description: curriculum.description || curriculum.summary || "",
    createdAt: curriculum.createdAt
      ? formatDate(curriculum.createdAt)
      : new Date().toISOString(),
    type: "curriculum" as const,
    problemsCount: curriculum.totalLectureCount || 0,
    thumbnail: curriculum.thumbnailImageUrl,
    totalLectureCount: curriculum.totalLectureCount,
    thumbnailImageUrl: curriculum.thumbnailImageUrl,
  };
}

// 강의 페이지로 이동
function goToLecture(lecture: Course) {
  console.log("[홈 화면] 강의 클릭:", lecture);

  // lectureId가 있으면 우선 사용
  let targetLectureId: number | null = null;

  if (lecture.type === "lecture") {
    // 1순위: lectureId 직접 사용
    if (lecture.lectureId !== undefined && lecture.lectureId !== null) {
      targetLectureId = Number(lecture.lectureId);
      if (isNaN(targetLectureId)) {
        targetLectureId = null;
      }
    }

    // 2순위: id에서 파싱
    if (!targetLectureId && lecture.id) {
      // id가 "lecture-19098" 형식인 경우 파싱
      const idMatch = String(lecture.id).match(/^lecture-(\d+)$/);
      if (idMatch && idMatch[1]) {
        targetLectureId = parseInt(idMatch[1], 10);
        if (isNaN(targetLectureId)) {
          targetLectureId = null;
        }
      } else {
        // 숫자만 있는 경우
        const numericId = parseInt(String(lecture.id), 10);
        if (!isNaN(numericId)) {
          targetLectureId = numericId;
        }
      }
    }
  }

  if (targetLectureId && targetLectureId > 0) {
    console.log("[홈 화면] 강의 페이지로 이동:", targetLectureId);
    router.push({
      name: "lecture",
      params: { lectureId: String(targetLectureId) },
    });
  } else {
    console.error("[홈 화면] 강의 정보 불완전 - 페이지 이동 불가:", {
      type: lecture.type,
      lectureId: lecture.lectureId,
      id: lecture.id,
      title: lecture.title,
    });
    alert("강의 정보가 올바르지 않습니다. 다시 시도해주세요.");
  }
}

// 추천 로드 (강의와 커리큘럼 각각)
async function loadRecommendations() {
  const userId = getCurrentUserId();

  if (!userId) {
    // 로그인하지 않은 경우 공개 커리큘럼만 로드
    await loadCurriculums();
    return;
  }

  // 강의와 커리큘럼을 병렬로 로드
  await Promise.all([loadLectures(), loadCurriculums()]);
}

// 강의 추천 로드
async function loadLectures() {
  if (lectureLoading.value || !lectureHasMore.value) return;

  try {
    lectureLoading.value = true;
    error.value = null;

    const userId = getCurrentUserId();
    if (!userId) {
      lectureHasMore.value = false;
      return;
    }

    console.log("[홈 화면] 강의 추천 API 호출:", {
      page: lecturePage.value,
      size: pageSize,
    });

    const response = await recommendationApiService.getLectureRecommendations(
      lecturePage.value,
      pageSize
    );

    console.log("[홈 화면] 강의 추천 API 응답:", response);

    if (response && response.lectures && Array.isArray(response.lectures)) {
      // 첫 번째 강의 응답 구조 확인
      if (response.lectures.length > 0) {
        const firstLecture = response.lectures[0] as any;
        console.log("[홈 화면] 첫 번째 강의 원본 데이터:", firstLecture);
        console.log("[홈 화면] 첫 번째 강의 작성자 정보:", {
          author: firstLecture.author,
          authorType: typeof firstLecture.author,
          authorName: firstLecture.authorName,
          hasAuthorUsername: !!firstLecture.author?.username,
          authorUsername: firstLecture.author?.username,
          allKeys: Object.keys(firstLecture),
        });
      }

      // 먼저 기본 변환 수행
      const newLectures = response.lectures.map(lectureToCourse);

      // 작성자 정보가 없는 강의들에 대해 상세 정보 조회로 보완
      const lecturesNeedingAuthor = newLectures.filter(
        (lecture) => lecture.instructor === "알 수 없음" && lecture.lectureId
      );

      if (lecturesNeedingAuthor.length > 0) {
        console.log(
          `[홈 화면] 작성자 정보 보완 필요: ${lecturesNeedingAuthor.length}개 강의`
        );

        // 병렬로 상세 정보 조회 및 반응성 유지하면서 업데이트
        const authorPromises = lecturesNeedingAuthor.map(async (lecture) => {
          try {
            const lectureDetail = await lectureApiService.getLecture(
              lecture.lectureId!
            );
            // 작성자 정보 업데이트 (Vue 반응성 유지)
            if (lectureDetail.author?.username) {
              // newLectures 배열의 객체를 직접 수정 (Vue 반응성 유지)
              lecture.instructor = lectureDetail.author.username;

              // lectures.value 배열에서도 동일한 객체 찾아서 업데이트
              const targetInLectures = lectures.value.find(
                (l: Course) => l.lectureId === lecture.lectureId
              );
              if (targetInLectures) {
                targetInLectures.instructor = lectureDetail.author.username;
              }

              console.log(
                `[홈 화면] 작성자 정보 보완 완료: ${lecture.title} → ${lectureDetail.author.username}`
              );
            }
          } catch (err) {
            console.warn(
              `[홈 화면] 강의 ${lecture.lectureId} 상세 정보 조회 실패:`,
              err
            );
          }
        });

        // 모든 작성자 정보 조회가 완료될 때까지 대기 (백그라운드에서 진행)
        Promise.all(authorPromises).then(() => {
          console.log("[홈 화면] 모든 작성자 정보 보완 완료");
        });
      }

      if (lecturePage.value === 0) {
        lectures.value = newLectures;
      } else {
        lectures.value = [...lectures.value, ...newLectures];
      }

      if (response.meta && "hasNext" in response.meta) {
        lectureHasMore.value = response.meta.hasNext === true;
      } else {
        lectureHasMore.value = false;
      }

      lecturePage.value++;
      console.log("[홈 화면] 강의 추천 로드 완료:", {
        count: newLectures.length,
        total: lectures.value.length,
        hasMore: lectureHasMore.value,
      });
    } else {
      lectureHasMore.value = false;
      console.warn("[홈 화면] 강의 추천 응답 형식 오류:", response);
    }
  } catch (err: any) {
    console.error("[홈 화면] 강의 추천 로드 실패:", err);
    lectureHasMore.value = false;
  } finally {
    lectureLoading.value = false;
  }
}

// 커리큘럼 추천 로드
async function loadCurriculums() {
  if (curriculumLoading.value || !curriculumHasMore.value) return;

  try {
    curriculumLoading.value = true;
    error.value = null;

    const userId = getCurrentUserId();

    if (userId) {
      // 로그인된 경우 추천 API 시도
      try {
        console.log("[홈 화면] 커리큘럼 추천 API 호출:", {
          page: curriculumPage.value,
          size: pageSize,
        });

        const response =
          await recommendationApiService.getCurriculumRecommendations(
            curriculumPage.value,
            pageSize
          );

        console.log("[홈 화면] 커리큘럼 추천 API 응답:", response);
        console.log("[홈 화면] 커리큘럼 추천 API 응답 meta:", response?.meta);

        if (
          response &&
          response.curriculums &&
          Array.isArray(response.curriculums)
        ) {
          const newCurriculums = response.curriculums.map(curriculumToCourse);

          if (curriculumPage.value === 0) {
            curriculums.value = newCurriculums;
          } else {
            curriculums.value = [...curriculums.value, ...newCurriculums];
          }

          // meta의 hasNext를 확인하되, 응답된 데이터 개수가 pageSize와 같으면 아직 더 있을 수 있음
          if (response.meta) {
            if ("hasNext" in response.meta) {
              curriculumHasMore.value = response.meta.hasNext === true;
            } else if (
              "nextPage" in response.meta ||
              "next_page" in response.meta
            ) {
              const nextPage =
                (response.meta as any).nextPage ??
                (response.meta as any).next_page;
              curriculumHasMore.value =
                nextPage !== null && nextPage !== undefined;
            } else {
              // meta에 명시적인 hasNext가 없으면 응답된 데이터 개수로 판단
              curriculumHasMore.value = newCurriculums.length >= pageSize;
            }
          } else {
            // meta가 없으면 응답된 데이터 개수로 판단
            curriculumHasMore.value = newCurriculums.length >= pageSize;
          }

          console.log("[홈 화면] 커리큘럼 hasMore 설정:", {
            metaHasNext: response.meta?.hasNext,
            receivedCount: newCurriculums.length,
            pageSize,
            curriculumHasMore: curriculumHasMore.value,
          });

          curriculumPage.value++;
          console.log("[홈 화면] 커리큘럼 추천 로드 완료:", {
            count: newCurriculums.length,
            total: curriculums.value.length,
            hasMore: curriculumHasMore.value,
          });
        } else {
          curriculumHasMore.value = false;
          console.warn("[홈 화면] 커리큘럼 추천 응답 형식 오류:", response);
        }
      } catch (recommendError: any) {
        console.warn(
          "[홈 화면] 커리큘럼 추천 실패, 일반 목록 사용:",
          recommendError?.message || recommendError
        );
        // 추천 실패 시 일반 목록으로 fallback
        const response =
          await curriculumApiService.getPublicCurriculumsPaginated(
            curriculumPage.value,
            pageSize
          );

        if (
          response &&
          response.curriculums &&
          Array.isArray(response.curriculums)
        ) {
          const newCurriculums = response.curriculums.map(curriculumToCourse);

          if (curriculumPage.value === 0) {
            curriculums.value = newCurriculums;
          } else {
            curriculums.value = [...curriculums.value, ...newCurriculums];
          }

          const meta = response.meta;
          if (meta) {
            if ("hasNext" in meta) {
              curriculumHasMore.value = meta.hasNext === true;
            } else if ("next_page" in meta) {
              curriculumHasMore.value =
                meta.next_page !== null && meta.next_page !== undefined;
            } else {
              curriculumHasMore.value = false;
            }
          } else {
            curriculumHasMore.value = false;
          }

          curriculumPage.value++;
        } else {
          curriculumHasMore.value = false;
        }
      }
    } else {
      // 로그인하지 않은 경우 공개 커리큘럼만 로드
      const response = await curriculumApiService.getPublicCurriculumsPaginated(
        curriculumPage.value,
        pageSize
      );

      if (
        response &&
        response.curriculums &&
        Array.isArray(response.curriculums)
      ) {
        const newCurriculums = response.curriculums.map(curriculumToCourse);

        if (curriculumPage.value === 0) {
          curriculums.value = newCurriculums;
        } else {
          curriculums.value = [...curriculums.value, ...newCurriculums];
        }

        const meta = response.meta;
        if (meta) {
          if ("hasNext" in meta) {
            curriculumHasMore.value = meta.hasNext === true;
          } else if ("next_page" in meta) {
            curriculumHasMore.value =
              meta.next_page !== null && meta.next_page !== undefined;
          } else {
            curriculumHasMore.value = false;
          }
        } else {
          curriculumHasMore.value = false;
        }

        curriculumPage.value++;
      } else {
        curriculumHasMore.value = false;
      }
    }
  } catch (err: any) {
    console.error("[홈 화면] 커리큘럼 로드 실패:", err);
    error.value = "데이터를 불러오는 중 오류가 발생했습니다.";
    curriculumHasMore.value = false;
  } finally {
    curriculumLoading.value = false;
    // DOM 업데이트 후 observer 재설정
    await nextTick();
    setupCurriculumObserver();
  }
}

// 통합 검색 API 호출
async function searchUnified() {
  if (loading.value) return;

  try {
    loading.value = true;
    error.value = null;

    const searchQuery = ui.searchQuery?.trim() || "";
    if (!searchQuery) {
      await loadRecommendations();
      return;
    }

    const response = await searchApiService.unifiedSearch({
      title: searchQuery,
      isPublic: true,
      page: currentPage.value,
      size: pageSize,
    });

    const curriculumCourses = (response.curriculums?.curriculums || []).map(
      curriculumToCourse
    );
    const lectureCourses = (response.lectures?.lectures || []).map(
      lectureToCourse
    );

    if (currentPage.value === 0) {
      courses.value = [...curriculumCourses, ...lectureCourses];
    } else {
      courses.value = [
        ...courses.value,
        ...curriculumCourses,
        ...lectureCourses,
      ];
    }

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
  } catch (err: any) {
    console.error("[홈 화면] 통합 검색 실패:", err);
    error.value = "검색 중 오류가 발생했습니다.";
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
    return list.filter((c: Course) => c.category === activeTab.value);
  }
  return list;
});

// 추천 모드용: 커리큘럼 필터링
const filteredCurriculums = computed<Course[]>(() => {
  if (activeTab.value !== "전체") {
    return curriculums.value.filter(
      (c: Course) => c.category === activeTab.value
    );
  }
  return curriculums.value;
});

// 추천 모드용: 강의 필터링
const filteredLectures = computed<Course[]>(() => {
  if (activeTab.value !== "전체") {
    return lectures.value.filter((c: Course) => c.category === activeTab.value);
  }
  return lectures.value;
});

// 정렬 함수 (공통)
function sortCourseList(list: Course[]): Course[] {
  const sorted = list.slice();
  switch (sortBy.value) {
    case "rating":
      sorted.sort((a: Course, b: Course) => (b.rating || 0) - (a.rating || 0));
      break;
    case "reviews":
      sorted.sort(
        (a: Course, b: Course) => (b.reviewsCount || 0) - (a.reviewsCount || 0)
      );
      break;
    case "latest":
      sorted.sort(
        (a: Course, b: Course) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
      );
      break;
    default: // popular
      sorted.sort(
        (a: Course, b: Course) =>
          (b.reviewsCount || 0) * (b.rating || 0) - (a.reviewsCount || 0) * (a.rating || 0)
      );
  }
  return sorted;
}

// 추천 모드용: 정렬된 커리큘럼
const sortedCurriculums = computed<Course[]>(() => {
  return sortCourseList(filteredCurriculums.value);
});

// 추천 모드용: 정렬된 강의
const sortedLectures = computed<Course[]>(() => {
  return sortCourseList(filteredLectures.value);
});

const filteredBySearch = computed<Course[]>(() => {
  if (isSearchMode.value) {
    return filteredByTab.value;
  }
  return searchStore
    .searchCourses(ui.searchQuery, courses.value)
    .filter((c: Course) => filteredByTab.value.includes(c));
});

// 검색 모드용: 정렬된 강의/커리큘럼
const sortedCourses = computed<Course[]>(() => {
  return sortCourseList(filteredBySearch.value);
});

const visibleCourses = computed<Course[]>(() => sortedCourses.value);
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
