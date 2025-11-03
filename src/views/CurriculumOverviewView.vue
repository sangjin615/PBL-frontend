<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 브레드크럼 -->
    <div class="px-6 py-4">
      <nav class="text-sm text-gray-600">
        <span>전체</span>
        <span class="mx-2">></span>
        <span>{{ curriculum?.category || "프로그램/모바일 앱 개발" }}</span>
      </nav>
    </div>

    <!-- 로딩 상태 -->
    <LoadingSpinner
      v-if="loading"
      size="lg"
      message="데이터를 불러오는 중..."
    />

    <!-- 에러 상태 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      :show-retry="true"
      @retry="loadCurriculumDetail"
    />

    <!-- 메인 컨텐츠 -->
    <div v-else class="px-6 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 왼쪽: 메인 컨텐츠 -->
        <div class="lg:col-span-2">
          <!-- 강의 제목 및 기본 정보 -->
          <div
            v-if="curriculum"
            class="bg-figma-1 rounded-lg border p-6 mb-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <h1
              class="text-2xl font-bold mb-4"
              style="color: rgb(var(--figma-color-2))"
            >
              {{ curriculum.title }}
            </h1>

            <!-- 간단 소개 (요약) -->
            <p
              v-if="curriculum.summary"
              class="text-sm text-gray-500 mb-4 italic"
            >
              {{ curriculum.summary }}
            </p>

            <div class="flex items-center space-x-4">
              <!-- 평균 별점 표시 (API에서 가져온 averageRating 사용) -->
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="
                      i <= Math.floor(averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    ></path>
                  </svg>
                </div>
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                >
                  {{ (averageRating || 0).toFixed(1) }}점
                </span>
              </div>
              <button
                v-if="curriculum.instructor && curriculum.authorId"
                @click.stop="goToCreatorProfile(curriculum.authorId)"
                class="text-sm hover:text-blue-600 hover:underline transition-colors"
                style="color: rgb(var(--figma-color-5))"
              >
                {{ curriculum.instructor }}
              </button>
              <span
                v-else-if="curriculum.instructor"
                class="text-sm"
                style="color: rgb(var(--figma-color-5))"
                >{{ curriculum.instructor }}</span
              >
            </div>
          </div>

          <!-- 강의 썸네일 -->
          <div
            v-if="curriculum?.thumbnailImageUrl"
            class="h-64 rounded-lg mb-6 overflow-hidden"
          >
            <img
              :src="getImageUrl(curriculum.thumbnailImageUrl)"
              :alt="curriculum.title"
              class="w-full h-full object-cover"
              @error="handleThumbnailError"
            />
          </div>
          <div
            v-else
            class="h-64 rounded-lg mb-6 flex items-center justify-center text-6xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
          </div>

          <!-- 탭 네비게이션 -->
          <div
            class="bg-figma-1 rounded-lg border mb-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <div
              class="flex border-b"
              style="border-color: rgb(var(--figma-color-4))"
            >
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                "
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
              <!-- 강의 소개 탭 -->
              <div v-if="activeTab === 'intro'">
                <h3
                  class="text-lg font-semibold mb-4"
                  style="color: rgb(var(--figma-color-2))"
                >
                  강의 소개
                </h3>

                <!-- 커리큘럼 설명 -->
                <div
                  v-if="curriculum?.description && parsedDescription.length > 0"
                  class="mb-6"
                >
                  <div class="text-gray-600 leading-relaxed space-y-4">
                    <template
                      v-for="(part, index) in parsedDescription"
                      :key="index"
                    >
                      <!-- 텍스트 부분 -->
                      <p v-if="part.type === 'text'">{{ part.content }}</p>
                      <!-- 이미지 부분 -->
                      <div v-else-if="part.type === 'image'" class="my-4">
                        <img
                          :src="getImageUrl(part.content)"
                          :alt="'설명 이미지 ' + (index + 1)"
                          class="w-full rounded-lg object-cover max-h-96"
                          @error="handleDescriptionImageError"
                        />
                      </div>
                    </template>
                  </div>
                </div>

                <!-- 이런 걸 배울 수 있어요 -->
                <div class="mb-8">
                  <h4
                    class="text-lg font-semibold mb-4"
                    style="color: rgb(var(--figma-color-2))"
                  >
                    이런 걸 배울 수 있어요
                  </h4>
                  <ul
                    v-if="learningObjectivesList.length > 0"
                    class="space-y-2"
                  >
                    <li
                      v-for="(objective, index) in learningObjectivesList"
                      :key="index"
                      class="flex items-start space-x-2"
                    >
                      <svg
                        class="w-5 h-5 mt-0.5 flex-shrink-0"
                        style="color: rgb(var(--figma-color-6))"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span class="text-gray-700">{{ objective }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-gray-400 italic">
                    아직 학습 목표가 작성되지 않았습니다
                  </p>
                </div>
              </div>

              <!-- 커리큘럼 탭 -->
              <div v-else-if="activeTab === 'curriculum'">
                <h3
                  class="text-lg font-semibold mb-4"
                  style="color: rgb(var(--figma-color-2))"
                >
                  커리큘럼
                </h3>

                <div v-if="lectures.length > 0" class="space-y-4">
                  <!-- API에서 받은 강의 목록을 챕터로 그룹화 -->
                  <div
                    v-for="(chapter, chapterIndex) in groupedLectures"
                    :key="chapterIndex"
                    class="border rounded-lg"
                    style="border-color: rgb(var(--figma-color-4))"
                  >
                    <button
                      @click="toggleChapter(chapterIndex)"
                      class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center space-x-3">
                        <span
                          class="text-sm font-medium"
                          style="color: rgb(var(--figma-color-2))"
                        >
                          {{ chapter.isExpanded ? "∨" : "∧" }}
                          {{ chapter.title }}
                        </span>
                        <span
                          class="text-sm"
                          style="color: rgb(var(--figma-color-5))"
                          >{{ chapter.lectures.length }}개 레슨</span
                        >
                      </div>
                    </button>

                    <div
                      v-if="chapter.isExpanded"
                      class="px-4 pb-4 border-t"
                      style="border-color: rgb(var(--figma-color-4))"
                    >
                      <div class="pt-4 space-y-3">
                        <div
                          v-for="lecture in chapter.lectures"
                          :key="lecture.id"
                          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          @click="goToLecture(lecture.lectureId)"
                        >
                          <div
                            class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                            style="background-color: rgb(var(--figma-color-6))"
                          >
                            {{ lecture.orderIndex }}
                          </div>
                          <div class="flex-1">
                            <span
                              class="text-sm"
                              style="color: rgb(var(--figma-color-2))"
                              >{{ lecture.lectureTitle }}</span
                            >
                            <span
                              v-if="lecture.isRequired"
                              class="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded"
                              >필수</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">커리큘럼 정보를 불러오는 중...</p>
                </div>
              </div>

              <!-- 질문&답변 탭 -->
              <div v-else-if="activeTab === 'qa'">
                <div class="flex items-center justify-between mb-4">
                  <h3
                    class="text-lg font-semibold"
                    style="color: rgb(var(--figma-color-2))"
                  >
                    질문&답변
                  </h3>
                  <Button
                    v-if="getCurrentUserId()"
                    @click="showInquiryForm = !showInquiryForm"
                    class="text-sm"
                  >
                    {{ showInquiryForm ? "취소" : "질문 작성" }}
                  </Button>
                </div>

                <!-- 문의 작성 폼 -->
                <div
                  v-if="showInquiryForm"
                  class="mb-6 p-4 rounded-lg border"
                  style="
                    border-color: rgb(var(--figma-color-4));
                    background-color: rgb(var(--figma-color-1));
                  "
                >
                  <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">
                      질문 내용
                    </label>
                    <textarea
                      v-model="inquiryContent"
                      rows="4"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style="border-color: rgb(var(--figma-color-4))"
                      placeholder="질문 내용을 입력해주세요."
                    ></textarea>
                  </div>
                  <div class="mb-4 flex items-center">
                    <input
                      v-model="inquiryIsPublic"
                      type="checkbox"
                      id="inquiryPublic"
                      class="mr-2"
                    />
                    <label for="inquiryPublic" class="text-sm">
                      공개로 작성하기
                    </label>
                  </div>
                  <div class="flex justify-end space-x-2">
                    <Button
                      @click="showInquiryForm = false"
                      variant="outline"
                      class="text-sm"
                    >
                      취소
                    </Button>
                    <Button
                      @click="submitInquiry"
                      :disabled="!inquiryContent.trim() || isSubmittingInquiry"
                      class="text-sm"
                    >
                      {{ isSubmittingInquiry ? "작성 중..." : "작성하기" }}
                    </Button>
                  </div>
                </div>

                <!-- 내 문의 목록 (로그인한 경우만) -->
                <div
                  v-if="getCurrentUserId() && myInquiries.length > 0"
                  class="mb-6"
                >
                  <h4 class="text-md font-semibold mb-3">내 질문</h4>
                  <div class="space-y-4">
                    <!-- 질문 항목 (트리 형태) -->
                    <div
                      v-for="inquiry in myInquiries"
                      :key="inquiry.id"
                      class="rounded-lg border"
                      style="
                        border-color: rgb(var(--figma-color-4));
                        background-color: rgb(var(--figma-color-1));
                      "
                    >
                      <!-- 질문 헤더 (클릭 가능) -->
                      <button
                        @click="toggleMyInquiry(inquiry.id)"
                        class="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-sm font-medium">
                                {{ getReviewAuthorName(inquiry) }}
                              </span>
                              <span class="text-xs text-gray-500">
                                {{ formatReviewDate(inquiry.createdAt) }}
                                <span
                                  v-if="!inquiry.isPublic"
                                  class="ml-2 text-gray-400"
                                >
                                  (비공개)
                                </span>
                              </span>
                            </div>
                            <p class="text-sm text-gray-700 line-clamp-2">
                              {{ inquiry.content }}
                            </p>
                            <div class="mt-2 text-xs text-blue-600">
                              답변
                              {{
                                inquiryRepliesMap.get(inquiry.id)?.length || 0
                              }}개
                              {{
                                expandedMyInquiries.has(inquiry.id)
                                  ? "접기"
                                  : "보기"
                              }}
                            </div>
                          </div>
                          <svg
                            class="w-5 h-5 text-gray-400 ml-4 transition-transform"
                            :class="{
                              'rotate-180': expandedMyInquiries.has(inquiry.id),
                            }"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      <!-- 답변 목록 (접었다 펼치기) -->
                      <div
                        v-if="expandedMyInquiries.has(inquiry.id)"
                        class="border-t px-4 py-3"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        <!-- 답변 로딩 중 -->
                        <div
                          v-if="loadingReplies.get(inquiry.id)"
                          class="py-4 text-center text-sm text-gray-500"
                        >
                          답변을 불러오는 중...
                        </div>

                        <!-- 답변 목록 -->
                        <div v-else class="space-y-3">
                          <div
                            v-for="reply in inquiryRepliesMap.get(inquiry.id) ||
                            []"
                            :key="reply.id"
                            class="pl-4 py-2 border-l-2"
                            style="border-color: rgb(var(--figma-color-4))"
                          >
                            <div class="flex items-center justify-between mb-1">
                              <span class="text-xs font-medium text-gray-600">
                                {{ getReviewAuthorName(reply) }}
                              </span>
                              <span class="text-xs text-gray-400">
                                {{ formatReviewDate(reply.createdAt) }}
                              </span>
                            </div>
                            <p
                              class="text-sm text-gray-700 whitespace-pre-wrap"
                            >
                              {{ reply.content }}
                            </p>
                          </div>

                          <!-- 답변 없음 -->
                          <div
                            v-if="
                              !inquiryRepliesMap.get(inquiry.id) ||
                              inquiryRepliesMap.get(inquiry.id)?.length === 0
                            "
                            class="text-sm text-gray-400 text-center py-2"
                          >
                            아직 답변이 없습니다.
                          </div>
                        </div>

                        <!-- 답변 작성 폼 -->
                        <div
                          v-if="getCurrentUserId()"
                          class="mt-4 pt-3 border-t"
                          style="border-color: rgb(var(--figma-color-4))"
                        >
                          <textarea
                            :value="replyContentMap.get(inquiry.id) || ''"
                            @input="updateReplyContent(inquiry.id, $event)"
                            rows="3"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            style="border-color: rgb(var(--figma-color-4))"
                            placeholder="답변을 입력하세요..."
                          ></textarea>
                          <div class="flex justify-end">
                            <Button
                              @click="submitReply(inquiry.id)"
                              :disabled="
                                !replyContentMap.get(inquiry.id)?.trim() ||
                                isSubmittingReply.get(inquiry.id)
                              "
                              size="sm"
                            >
                              {{
                                isSubmittingReply.get(inquiry.id)
                                  ? "작성 중..."
                                  : "답변 작성"
                              }}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 내 질문과 공개 문의 목록 사이 구분선 -->
                <div
                  v-if="
                    getCurrentUserId() &&
                    myInquiries.length > 0 &&
                    inquiries.length > 0
                  "
                  class="my-6 border-t-2 border-solid"
                  style="border-color: rgb(var(--figma-color-4))"
                ></div>

                <!-- 공개 문의 목록 -->
                <div
                  v-if="inquiriesLoading && inquiryPage === 0"
                  class="flex justify-center py-8"
                >
                  <LoadingSpinner size="md" message="질문을 불러오는 중..." />
                </div>
                <div
                  v-else-if="inquiriesError"
                  class="text-red-600 text-sm py-4"
                >
                  {{ inquiriesError }}
                </div>
                <div v-else-if="inquiries.length > 0 || inquiryTotalPages > 0">
                  <!-- "모든 질문" 제목 -->
                  <h4 class="text-md font-semibold mb-3">모든 질문</h4>
                  <div class="space-y-4">
                    <!-- 질문 항목 (트리 형태) -->
                    <div
                      v-for="inquiry in inquiries"
                      :key="inquiry.id"
                      class="rounded-lg border"
                      style="
                        border-color: rgb(var(--figma-color-4));
                        background-color: rgb(var(--figma-color-1));
                      "
                    >
                      <!-- 질문 헤더 (클릭 가능) -->
                      <button
                        @click="togglePublicInquiry(inquiry.id)"
                        class="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-sm font-medium">
                                {{ getReviewAuthorName(inquiry) }}
                              </span>
                              <span class="text-xs text-gray-500">
                                {{ formatReviewDate(inquiry.createdAt) }}
                              </span>
                            </div>
                            <p class="text-sm text-gray-700 line-clamp-2">
                              {{ inquiry.content }}
                            </p>
                            <div class="mt-2 text-xs text-blue-600">
                              답변
                              {{
                                inquiryRepliesMap.get(inquiry.id)?.length || 0
                              }}개
                              {{
                                expandedPublicInquiries.has(inquiry.id)
                                  ? "접기"
                                  : "보기"
                              }}
                            </div>
                          </div>
                          <svg
                            class="w-5 h-5 text-gray-400 ml-4 transition-transform"
                            :class="{
                              'rotate-180': expandedPublicInquiries.has(
                                inquiry.id
                              ),
                            }"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>

                      <!-- 답변 목록 (접었다 펼치기) -->
                      <div
                        v-if="expandedPublicInquiries.has(inquiry.id)"
                        class="border-t px-4 py-3"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        <!-- 답변 로딩 중 -->
                        <div
                          v-if="loadingReplies.get(inquiry.id)"
                          class="py-4 text-center text-sm text-gray-500"
                        >
                          답변을 불러오는 중...
                        </div>

                        <!-- 답변 목록 -->
                        <div v-else class="space-y-3">
                          <div
                            v-for="reply in inquiryRepliesMap.get(inquiry.id) ||
                            []"
                            :key="reply.id"
                            class="pl-4 py-2 border-l-2"
                            style="border-color: rgb(var(--figma-color-4))"
                          >
                            <div class="flex items-center justify-between mb-1">
                              <span class="text-xs font-medium text-gray-600">
                                {{ getReviewAuthorName(reply) }}
                              </span>
                              <span class="text-xs text-gray-400">
                                {{ formatReviewDate(reply.createdAt) }}
                              </span>
                            </div>
                            <p
                              class="text-sm text-gray-700 whitespace-pre-wrap"
                            >
                              {{ reply.content }}
                            </p>
                          </div>

                          <!-- 답변 없음 -->
                          <div
                            v-if="
                              !inquiryRepliesMap.get(inquiry.id) ||
                              inquiryRepliesMap.get(inquiry.id)?.length === 0
                            "
                            class="text-sm text-gray-400 text-center py-2"
                          >
                            아직 답변이 없습니다.
                          </div>
                        </div>

                        <!-- 답변 작성 폼 -->
                        <div
                          v-if="getCurrentUserId()"
                          class="mt-4 pt-3 border-t"
                          style="border-color: rgb(var(--figma-color-4))"
                        >
                          <textarea
                            :value="replyContentMap.get(inquiry.id) || ''"
                            @input="updateReplyContent(inquiry.id, $event)"
                            rows="3"
                            class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            style="border-color: rgb(var(--figma-color-4))"
                            placeholder="답변을 입력하세요..."
                          ></textarea>
                          <div class="flex justify-end">
                            <Button
                              @click="submitReply(inquiry.id)"
                              :disabled="
                                !replyContentMap.get(inquiry.id)?.trim() ||
                                isSubmittingReply.get(inquiry.id)
                              "
                              size="sm"
                            >
                              {{
                                isSubmittingReply.get(inquiry.id)
                                  ? "작성 중..."
                                  : "답변 작성"
                              }}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 페이지네이션 -->
                  <div
                    v-if="inquiryTotalPages > 0"
                    class="flex justify-center items-center py-6 mt-4"
                  >
                    <div class="flex items-center space-x-2">
                      <!-- 이전 페이지 버튼 -->
                      <button
                        @click="goToInquiryPage(inquiryPage - 1)"
                        :disabled="inquiryPage === 0 || inquiriesLoading"
                        class="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        이전
                      </button>

                      <!-- 페이지 번호 버튼들 -->
                      <div class="flex items-center space-x-1">
                        <button
                          v-for="page in visibleInquiryPages"
                          :key="page"
                          @click="goToInquiryPage(page)"
                          :disabled="inquiriesLoading"
                          class="px-3 py-2 text-sm rounded-md border transition-colors"
                          :class="
                            page === inquiryPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                          "
                          style="border-color: rgb(var(--figma-color-4))"
                        >
                          {{ page + 1 }}
                        </button>
                      </div>

                      <!-- 다음 페이지 버튼 -->
                      <button
                        @click="goToInquiryPage(inquiryPage + 1)"
                        :disabled="
                          inquiryPage >= inquiryTotalPages - 1 ||
                          inquiriesLoading
                        "
                        class="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">아직 작성된 질문이 없습니다.</p>
                </div>
              </div>

              <!-- 나의 학습 탭 -->
              <div v-else-if="activeTab === 'learning'">
                <h3
                  class="text-lg font-semibold mb-4"
                  style="color: rgb(var(--figma-color-2))"
                >
                  나의 학습
                </h3>
                <p class="text-gray-600">학습 기록이 없습니다.</p>
              </div>
            </div>
          </div>

          <!-- 수강평 섹션 -->
          <div
            class="bg-figma-1 rounded-lg border p-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <div class="flex items-center justify-between mb-6">
              <h3
                class="text-lg font-semibold"
                style="color: rgb(var(--figma-color-2))"
              >
                수강평
              </h3>
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    class="w-5 h-5"
                    :class="
                      i <= Math.floor(averageRating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    ></path>
                  </svg>
                </div>
                <span
                  class="text-2xl font-bold"
                  style="color: rgb(var(--figma-color-2))"
                >
                  {{ (averageRating || 0).toFixed(1) }}
                </span>
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >({{ reviewCount }}개)</span
                >
              </div>
            </div>

            <!-- 리뷰 로딩 상태 -->
            <div v-if="reviewsLoading" class="flex justify-center py-8">
              <div class="text-gray-600">리뷰를 불러오는 중...</div>
            </div>

            <!-- 리뷰 에러 상태 -->
            <div v-else-if="reviewsError" class="text-red-600 text-sm py-4">
              {{ reviewsError }}
            </div>

            <!-- 리뷰 그리드 -->
            <div
              v-else-if="reviews.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                v-for="review in reviews"
                :key="review.id"
                class="p-4 border rounded-lg"
                style="border-color: rgb(var(--figma-color-4))"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <span
                    class="text-sm font-medium"
                    style="color: rgb(var(--figma-color-2))"
                    >{{ getReviewAuthorName(review) }}</span
                  >
                  <div class="flex text-yellow-400">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="
                        i <= Math.floor(review.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      "
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      ></path>
                    </svg>
                  </div>
                  <span
                    class="text-sm font-medium"
                    style="color: rgb(var(--figma-color-2))"
                    >{{ (review.rating || 0).toFixed(1) }}</span
                  >
                </div>
                <p class="text-sm text-gray-600">{{ review.content }}</p>
                <p class="text-xs text-gray-400 mt-2">
                  {{ formatReviewDate(review.createdAt) }}
                </p>
              </div>
            </div>

            <!-- 리뷰 없음 -->
            <div v-else class="text-center py-8">
              <p class="text-gray-500">아직 작성된 수강평이 없습니다.</p>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 수강신청 카드 -->
          <div
            class="bg-figma-1 rounded-lg border p-6 sticky top-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <div class="space-y-4">
              <!-- 수강 중이 아닐 때: 수강신청 버튼 -->
              <template v-if="!isEnrolled">
                <Button
                  @click="enrollCurriculum"
                  :loading="isEnrolling"
                  loading-text="처리 중..."
                  full-width
                  size="lg"
                >
                  수강신청하기
                </Button>
              </template>

              <!-- 수강 중일 때: 수강하기 + 수강취소 버튼 -->
              <template v-else>
                <Button
                  @click="continueLearning"
                  full-width
                  size="lg"
                  variant="primary"
                >
                  수강하기
                </Button>

                <button
                  @click="cancelEnrollment"
                  :disabled="isCanceling"
                  class="w-full px-6 py-3 text-base font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {{ isCanceling ? "취소 중..." : "수강취소" }}
                </button>
              </template>
            </div>

            <div v-if="curriculum" class="mt-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >지식공유자</span
                >
                <div class="flex items-center space-x-2">
                  <button
                    v-if="curriculum.authorId"
                    @click.stop="goToCreatorProfile(curriculum.authorId)"
                    class="text-sm font-medium hover:text-blue-600 hover:underline transition-colors"
                    style="color: rgb(var(--figma-color-2))"
                  >
                    {{ curriculum.instructor }}
                  </button>
                  <span
                    v-else
                    class="text-sm font-medium"
                    style="color: rgb(var(--figma-color-2))"
                    >{{ curriculum.instructor }}</span
                  >
                  <button
                    @click="toggleSubscribe"
                    class="px-3 py-1 text-xs rounded-full transition-colors"
                    :class="
                      isSubscribed
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    "
                  >
                    {{ isSubscribed ? "구독중" : "구독하기" }}
                  </button>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >카테고리</span
                >
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                  >{{ curriculum.category }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >강의 시간</span
                >
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                >
                  {{
                    curriculum.durationMinutes
                      ? `${curriculum.durationMinutes}분`
                      : "미정"
                  }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >난이도</span
                >
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                >
                  {{ curriculum.difficulty || "미정" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >수강생 수</span
                >
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                >
                  {{ curriculum.studentCount || enrollmentCount }}명
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { curriculumApiService } from "@/services/curriculumApi";
import { enrollmentApiService } from "@/services/enrollmentApi";
import { reviewApiService } from "@/services/reviewApi";
import { Button, LoadingSpinner, ErrorMessage } from "@/components/common";
import type {
  CurriculumDetailResponse,
  CurriculumLectureResponse,
} from "@/types/curriculum";
import type { ReviewResponse, ReplyResponse } from "@/types/review";
import { CHAPTER_TITLES } from "@/constants";
import { getCurrentUserId } from "@/config/api";
import { S3ApiService } from "@/services/s3Api";

const router = useRouter();
const route = useRoute();

// 상태 관리
const curriculum = ref<any>(null);
const lectures = ref<CurriculumLectureResponse[]>([]);
const enrollmentCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const isEnrolling = ref(false);
const isCanceling = ref(false);
const isEnrolled = ref(false);
const enrollmentId = ref<number | null>(null);
const isSubscribed = ref(false);

// 리뷰 상태 관리
const reviews = ref<ReviewResponse[]>([]);
const averageRating = ref(0);
const reviewCount = ref(0);
const reviewsLoading = ref(false);
const reviewsError = ref<string | null>(null);

// 문의(질문&답변) 상태 관리
const inquiries = ref<ReviewResponse[]>([]); // 공개 문의 목록
const myInquiries = ref<ReviewResponse[]>([]); // 내 문의 목록
const inquiriesLoading = ref(false);
const inquiriesError = ref<string | null>(null);
const inquiryPage = ref(0);
const inquiryHasMore = ref(true);
const inquiryTotalPages = ref(0);
const inquiryTotalElements = ref(0);
const inquiryPageSize = 10;

// 문의 작성 폼 상태
const showInquiryForm = ref(false);
const inquiryContent = ref("");
const inquiryIsPublic = ref(true);
const isSubmittingInquiry = ref(false);

// 답변 관련 상태
const expandedMyInquiries = ref<Set<number>>(new Set()); // 펼쳐진 내 질문 ID 목록
const expandedPublicInquiries = ref<Set<number>>(new Set()); // 펼쳐진 공개 질문 ID 목록
const replyContentMap = ref<Map<number, string>>(new Map()); // 질문 ID -> 답변 내용
const isSubmittingReply = ref<Map<number, boolean>>(new Map()); // 질문 ID -> 제출 중 여부
const inquiryRepliesMap = ref<Map<number, any[]>>(new Map()); // 질문 ID -> 답변 목록 (ReplyResponse[])
const loadingReplies = ref<Map<number, boolean>>(new Map()); // 질문 ID -> 답변 로딩 중 여부

// 탭 상태
const activeTab = ref("intro");

// 챕터 상태
const expandedChapters = ref<Set<number>>(new Set([0])); // 첫 번째 챕터는 기본적으로 열림

// 탭 옵션
const tabs = ref([
  { id: "intro", name: "강의 소개" },
  { id: "curriculum", name: "커리큘럼" },
  { id: "qa", name: "질문&답변" },
  { id: "learning", name: "나의 학습" },
]);

// 리뷰 데이터 로드
async function loadReviews() {
  if (!curriculum.value?.id) return;

  try {
    reviewsLoading.value = true;
    reviewsError.value = null;

    const curriculumId = curriculum.value.id;

    // 평균 평점 조회
    try {
      const ratingData = await reviewApiService.getAverageRating(curriculumId);
      averageRating.value = ratingData.averageRating || 0;
      reviewCount.value = ratingData.reviewCount || 0;
    } catch (err) {
      console.warn("평균 평점 조회 실패:", err);
      // 평균 평점 조회 실패해도 계속 진행
    }

    // 리뷰 목록 조회 (리뷰만, isReview: true)
    try {
      const reviewsResponse = await reviewApiService.getCurriculumReviews(
        curriculumId,
        0,
        10
      );
      console.log("[리뷰 목록] API 응답:", reviewsResponse);

      // 리뷰만 필터링 (isReview: true인 것만)
      const filteredReviews = (reviewsResponse.content || []).filter(
        (review) => review.isReview === true && review.rating !== null
      );

      // 디버깅: 각 리뷰의 authorUsername 확인
      filteredReviews.forEach((review, index) => {
        console.log(`[리뷰 ${index + 1}] 원본 데이터:`, {
          id: review.id,
          authorId: review.authorId,
          authorUsername: review.authorUsername,
          authorUsernameType: typeof review.authorUsername,
        });
      });

      // 백엔드에서 이미 올바른 authorUsername을 반환하므로 그대로 사용
      // 특별한 처리 없이 authorUsername을 직접 사용
      reviews.value = filteredReviews;
    } catch (err) {
      console.error("리뷰 목록 조회 실패:", err);
      reviewsError.value = "리뷰를 불러오는 중 오류가 발생했습니다.";
      reviews.value = [];
    }
  } catch (err) {
    console.error("리뷰 로드 실패:", err);
    reviewsError.value = "리뷰를 불러오는 중 오류가 발생했습니다.";
  } finally {
    reviewsLoading.value = false;
  }
}

// 학습 목표 리스트 파싱
const learningObjectivesList = computed(() => {
  if (!curriculum.value?.learningObjectives) {
    return [];
  }
  return curriculum.value.learningObjectives
    .split("\n")
    .map((obj: string) => obj.trim())
    .filter((obj: string) => obj.length > 0);
});

// description 파싱 - [!url] 패턴 추출
const parsedDescription = computed(() => {
  if (
    !curriculum.value?.description ||
    curriculum.value.description.trim() === ""
  ) {
    return [];
  }

  const description = curriculum.value.description;
  const parts: Array<{ type: "text" | "image"; content: string }> = [];

  // [!url] 패턴 찾기 (정규식: \[!([^\]]+)\])
  const imagePattern = /\[!([^\]]+)\]/g;
  let lastIndex = 0;

  // matchAll을 사용하여 모든 매칭 찾기 (전역 플래그 때문에 exec 대신)
  const matches: RegExpMatchArray[] = Array.from(
    description.matchAll(imagePattern)
  );

  matches.forEach((match: RegExpMatchArray) => {
    // 이미지 패턴 이전의 텍스트 추가
    if (match.index !== undefined && match.index > lastIndex) {
      const textContent = description.substring(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: "text", content: textContent });
      }
    }

    // 이미지 URL 추가
    const imageUrl = match[1]?.trim();
    if (imageUrl) {
      parts.push({ type: "image", content: imageUrl });
    }

    if (match.index !== undefined) {
      lastIndex = match.index + match[0].length;
    }
  });

  // 마지막 이미지 패턴 이후의 텍스트 추가
  if (lastIndex < description.length) {
    const textContent = description.substring(lastIndex).trim();
    if (textContent) {
      parts.push({ type: "text", content: textContent });
    }
  }

  // 만약 이미지 패턴이 하나도 없으면 전체를 텍스트로 반환
  if (parts.length === 0 && description.trim()) {
    parts.push({ type: "text", content: description.trim() });
  }

  return parts;
});

// 강의를 챕터별로 그룹화 (5개씩)
const groupedLectures = computed(() => {
  const groups = [];
  const lecturesPerChapter = 5;

  for (let i = 0; i < lectures.value.length; i += lecturesPerChapter) {
    const chapterLectures = lectures.value.slice(i, i + lecturesPerChapter);
    groups.push({
      title: `챕터 ${Math.floor(i / lecturesPerChapter) + 1}. ${getChapterTitle(Math.floor(i / lecturesPerChapter))}`,
      lectures: chapterLectures,
      isExpanded: expandedChapters.value.has(
        Math.floor(i / lecturesPerChapter)
      ),
    });
  }

  return groups;
});

// 챕터 제목 생성
function getChapterTitle(chapterIndex: number): string {
  return CHAPTER_TITLES[chapterIndex] || `추가 학습 ${chapterIndex + 1}`;
}

// 챕터 토글
function toggleChapter(chapterIndex: number) {
  if (expandedChapters.value.has(chapterIndex)) {
    expandedChapters.value.delete(chapterIndex);
  } else {
    expandedChapters.value.add(chapterIndex);
  }
}

// 커리큘럼 상세 정보 로드
async function loadCurriculumDetail() {
  try {
    loading.value = true;
    error.value = null;

    // route.params.id를 안전하게 숫자로 변환
    const curriculumIdParam = route.params.id;
    let curriculumId: number;

    if (typeof curriculumIdParam === "string") {
      // 문자열에서 숫자만 추출
      const numericMatch = curriculumIdParam.match(/(\d+)/);
      if (numericMatch) {
        curriculumId = parseInt(numericMatch[1], 10);
      } else {
        throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
      }
    } else if (typeof curriculumIdParam === "number") {
      curriculumId = curriculumIdParam;
    } else {
      throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
    }

    if (isNaN(curriculumId) || curriculumId <= 0) {
      throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
    }

    const data: CurriculumDetailResponse =
      await curriculumApiService.getCurriculumById(curriculumId);

    curriculum.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      instructor: data.author?.username || "알 수 없음",
      authorId: data.author?.id, // 작성자 ID 추가
      category: data.category || "미분류",
      // API에서 가져온 필드들
      difficulty: data.difficulty,
      summary: data.summary,
      learningObjectives: data.learningObjectives,
      averageRating: data.averageRating,
      studentCount: data.studentCount,
      tags: data.tags || [],
      thumbnailImageUrl: data.thumbnailImageUrl,
      durationMinutes: data.durationMinutes,
    };

    lectures.value = (data.lectures || []).sort(
      (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
    );

    // 수강자 수 조회
    try {
      const countData =
        await enrollmentApiService.getCurriculumEnrollmentCount(curriculumId);
      enrollmentCount.value = countData.enrollmentCount;
    } catch (err) {
      console.warn("수강자 수 조회 실패:", err);
      enrollmentCount.value = 0;
    }

    // 리뷰 데이터 로드
    await loadReviews();

    // 질문&답변 탭이 활성화된 경우 문의 데이터도 로드
    if (activeTab.value === "qa") {
      await loadInquiries();
      await loadMyInquiries();
    }
  } catch (err) {
    console.error("커리큘럼 로드 실패:", err);
    error.value = "커리큘럼 정보를 불러오는 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
}

// 수강 상태 확인
async function checkEnrollmentStatus() {
  if (!curriculum.value) {
    console.log("[수강 상태 확인] curriculum이 없습니다.");
    return;
  }

  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log("[수강 상태 확인] 사용자 ID를 찾을 수 없습니다.");
      isEnrolled.value = false;
      enrollmentId.value = null;
      return;
    }

    console.log(
      "[수강 상태 확인] userId:",
      userId,
      "curriculumId:",
      curriculum.value.id
    );

    // 사용자의 전체 수강 목록 조회
    const enrollments = await enrollmentApiService.getUserEnrollments(userId);
    console.log("[수강 상태 확인] 수강 목록:", enrollments);

    // 현재 커리큘럼이 수강 목록에 있는지 확인 (ENROLLED 상태 체크)
    const enrollment = enrollments.find(
      (e) => e.curriculumId === curriculum.value.id && e.status === "ENROLLED"
    );
    console.log("[수강 상태 확인] 현재 커리큘럼 수강 정보:", enrollment);

    if (enrollment) {
      isEnrolled.value = true;
      enrollmentId.value = enrollment.id;
      console.log("[수강 상태 확인] ✅ 수강 중 - enrollmentId:", enrollment.id);
    } else {
      isEnrolled.value = false;
      enrollmentId.value = null;
      console.log("[수강 상태 확인] ❌ 미수강");
    }
  } catch (err) {
    console.error("수강 상태 확인 실패:", err);
    isEnrolled.value = false;
    enrollmentId.value = null;
  }
}

// 수강 신청
async function enrollCurriculum() {
  if (!curriculum.value) return;

  try {
    isEnrolling.value = true;
    const response = await enrollmentApiService.enrollCurriculum(
      curriculum.value.id
    );
    alert("수강 신청이 완료되었습니다!");

    // 수강 상태 업데이트
    isEnrolled.value = true;
    enrollmentId.value = response.id;

    // 학습 페이지로 이동
    router.push({
      name: "curriculum-detail",
      params: { id: curriculum.value.id },
    });
  } catch (err: any) {
    console.error("수강 신청 실패:", err);
    alert(err.message || "수강 신청에 실패했습니다.");
  } finally {
    isEnrolling.value = false;
  }
}

// 이어 수강하기
function continueLearning() {
  if (!curriculum.value) return;
  router.push({
    name: "curriculum-detail",
    params: { id: curriculum.value.id },
  });
}

// 수강 취소
async function cancelEnrollment() {
  if (!enrollmentId.value || !curriculum.value) return;

  const confirmed = confirm("정말로 수강을 취소하시겠습니까?");
  if (!confirmed) return;

  try {
    isCanceling.value = true;
    await enrollmentApiService.cancelEnrollment(enrollmentId.value);
    alert("수강이 취소되었습니다.");

    // 수강 상태 업데이트
    isEnrolled.value = false;
    enrollmentId.value = null;
  } catch (err: any) {
    console.error("수강 취소 실패:", err);
    alert(err.message || "수강 취소에 실패했습니다.");
  } finally {
    isCanceling.value = false;
  }
}

// 강의로 이동
function goToLecture(lectureId: number) {
  const curriculumId = route.params.id;
  router.push({
    name: "lecture",
    params: { lectureId },
    query: { curriculumId },
  });
}

function goToCreatorProfile(authorId: number) {
  router.push({
    name: "creator-profile",
    params: { id: authorId },
  });
}

// 구독 상태 확인
function checkSubscriptionStatus() {
  try {
    const subscriptions = JSON.parse(
      localStorage.getItem("subscriptions") || "[]"
    );
    isSubscribed.value = subscriptions.some(
      (sub: any) => sub.name === curriculum.value?.instructor
    );
  } catch {
    isSubscribed.value = false;
  }
}

// 구독 토글
function toggleSubscribe() {
  if (!curriculum.value?.instructor) return;

  try {
    const subscriptions = JSON.parse(
      localStorage.getItem("subscriptions") || "[]"
    );

    if (isSubscribed.value) {
      if (
        confirm(`"${curriculum.value.instructor}"의 구독을 해지하시겠습니까?`)
      ) {
        const updatedSubs = subscriptions.filter(
          (sub: any) => sub.name !== curriculum.value.instructor
        );
        localStorage.setItem("subscriptions", JSON.stringify(updatedSubs));
        isSubscribed.value = false;
        alert(`${curriculum.value.instructor}의 구독이 해지되었습니다.`);
      }
    } else {
      const newSubscription = {
        id: Date.now(),
        name: curriculum.value.instructor,
        handle: `@${curriculum.value.instructor.toLowerCase().replace(/\s+/g, "")}`,
        avatarColor: "#4F46E5",
        subscribers: Math.floor(Math.random() * 100000) + 10000,
        description: `${curriculum.value.instructor}의 강의를 구독합니다.`,
        subscribedAt: new Date().toISOString(),
      };

      subscriptions.push(newSubscription);
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
      isSubscribed.value = true;
      alert(`${curriculum.value.instructor}을(를) 구독했습니다!`);
    }
  } catch (err) {
    console.error("구독 상태 변경 실패:", err);
  }
}

// 이미지 URL 생성 헬퍼
function getImageUrl(path: string | null | undefined): string {
  return S3ApiService.getImageUrl(path);
}

// 썸네일 이미지 로드 에러 핸들링
function handleThumbnailError(event: Event) {
  console.warn("썸네일 이미지 로드 실패:", curriculum.value?.thumbnailImageUrl);
  // 이미지 로드 실패 시 thumbnailImageUrl을 null로 설정하여 플레이스홀더 표시
  if (curriculum.value) {
    curriculum.value.thumbnailImageUrl = null;
  }
}

// description 내 이미지 로드 에러 핸들링
function handleDescriptionImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.warn("설명 이미지 로드 실패:", img.src);
  // 이미지 로드 실패 시 이미지 숨김
  img.style.display = "none";
}

// 리뷰 날짜 포맷팅
// 백엔드 LocalDateTime 배열 형태와 ISO 문자열을 모두 처리합니다.
function formatReviewDate(date: number[] | string | null | undefined): string {
  if (!date) return "-";

  let d: Date;

  if (Array.isArray(date)) {
    // 백엔드 LocalDateTime 배열 형태: [year, month, day, hour, minute, second, nanoseconds]
    const [year, month, day] = date;
    // JavaScript Date의 month는 0부터 시작하므로 -1 필요
    d = new Date(year, month - 1, day);
  } else if (typeof date === "string") {
    d = new Date(date);
  } else {
    return "-";
  }

  // Invalid Date 체크
  if (isNaN(d.getTime())) {
    return "-";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// 리뷰 작성자 이름 가져오기 (백엔드에서 authorUsername 반환)
// ReviewResponse와 ReplyResponse 모두 처리
function getReviewAuthorName(
  review: ReviewResponse | ReplyResponse | any
): string {
  // 백엔드에서 올바른 authorUsername을 반환하므로 그대로 사용
  return review?.authorUsername || "익명";
}

// 답변 내용 업데이트 헬퍼
function updateReplyContent(inquiryId: number, event: Event) {
  const target = event.target as HTMLTextAreaElement;
  replyContentMap.value.set(inquiryId, target.value);
}

// 내 질문 접었다 펼치기
function toggleMyInquiry(inquiryId: number) {
  if (expandedMyInquiries.value.has(inquiryId)) {
    expandedMyInquiries.value.delete(inquiryId);
  } else {
    expandedMyInquiries.value.add(inquiryId);
    // 펼칠 때 답변 목록 로드
    loadRepliesForInquiry(inquiryId);
  }
}

// 공개 질문 접었다 펼치기
function togglePublicInquiry(inquiryId: number) {
  if (expandedPublicInquiries.value.has(inquiryId)) {
    expandedPublicInquiries.value.delete(inquiryId);
  } else {
    expandedPublicInquiries.value.add(inquiryId);
    // 펼칠 때 답변 목록 로드
    loadRepliesForInquiry(inquiryId);
  }
}

// 질문의 답변 목록 로드
async function loadRepliesForInquiry(
  inquiryId: number,
  forceReload: boolean = false
) {
  if (!curriculum.value?.id) return;

  // 이미 로드된 경우 스킵 (forceReload가 true면 강제 재로드)
  if (!forceReload && inquiryRepliesMap.value.has(inquiryId)) return;

  try {
    loadingReplies.value.set(inquiryId, true);
    const curriculumId = curriculum.value.id;
    const replies = await reviewApiService.getReplies(curriculumId, inquiryId);

    // 명세서에 따르면 replies는 ReplyResponse[]이므로 그대로 사용
    inquiryRepliesMap.value.set(inquiryId, replies || []);
  } catch (err: any) {
    console.error(`답변 목록 로드 실패 (질문 ID: ${inquiryId}):`, err);
    inquiryRepliesMap.value.set(inquiryId, []);
  } finally {
    loadingReplies.value.set(inquiryId, false);
  }
}

// 답변 작성
async function submitReply(inquiryId: number) {
  if (!curriculum.value?.id || !replyContentMap.value.get(inquiryId)?.trim()) {
    return;
  }

  try {
    isSubmittingReply.value.set(inquiryId, true);

    const curriculumId = curriculum.value.id;
    const replyContent = replyContentMap.value.get(inquiryId)?.trim() || "";

    // 명세서에 따르면 content만 필요
    const replyRequest = {
      content: replyContent,
    };

    await reviewApiService.createReply(curriculumId, inquiryId, replyRequest);

    // 성공 후 입력 필드 초기화 및 답변 목록 새로고침
    replyContentMap.value.set(inquiryId, "");
    // 답변 목록 강제 새로고침 (forceReload=true)
    await loadRepliesForInquiry(inquiryId, true);

    alert("답변이 작성되었습니다.");
  } catch (err: any) {
    console.error("답변 작성 실패:", err);
    alert("답변 작성 중 오류가 발생했습니다.");
  } finally {
    isSubmittingReply.value.set(inquiryId, false);
  }
}

// 문의 목록 로드 (공개)
async function loadInquiries(reset: boolean = false) {
  if (!curriculum.value?.id) return;

  try {
    inquiriesLoading.value = true;
    inquiriesError.value = null;

    if (reset) {
      inquiryPage.value = 0;
      inquiries.value = [];
      inquiryHasMore.value = true;
    }

    const curriculumId = curriculum.value.id;
    const response = await reviewApiService.getInquiries(
      curriculumId,
      inquiryPage.value,
      inquiryPageSize
    );

    if (response && response.content && Array.isArray(response.content)) {
      // 문의만 필터링 (isReview: false)
      const filteredInquiries = response.content.filter(
        (item) => item.isReview === false
      );

      if (reset) {
        inquiries.value = filteredInquiries;
      } else {
        inquiries.value = [...inquiries.value, ...filteredInquiries];
      }

      // 각 문의의 답변 개수를 미리 조회
      const curriculumId = curriculum.value.id;
      const replyCountPromises = filteredInquiries.map(async (inquiry) => {
        try {
          const replies = await reviewApiService.getReplies(
            curriculumId,
            inquiry.id
          );
          inquiryRepliesMap.value.set(inquiry.id, replies || []);
        } catch (err) {
          // 답변 조회 실패 시 빈 배열로 설정
          inquiryRepliesMap.value.set(inquiry.id, []);
        }
      });

      // 병렬로 답변 개수 조회 (실패해도 계속 진행)
      await Promise.allSettled(replyCountPromises);

      // 페이지네이션 정보 업데이트
      // totalElements로 totalPages 계산 (API 응답의 totalPages 우선 사용)
      const totalElements = response.totalElements || filteredInquiries.length;
      inquiryTotalElements.value = totalElements;

      if (
        response.totalPages !== undefined &&
        response.totalPages !== null &&
        response.totalPages > 0
      ) {
        inquiryTotalPages.value = response.totalPages;
      } else {
        // totalPages가 없으면 totalElements로 계산
        // 질문이 있으면 최소 1페이지 (10개 미만이어도 페이지네이션 표시)
        if (totalElements > 0) {
          // 실제 페이지 수 계산 (올림)
          // 10개 미만이어도 1페이지로 표시하되, 10개 이상이면 실제 페이지 수 계산
          inquiryTotalPages.value = Math.max(
            1,
            Math.ceil(totalElements / inquiryPageSize)
          );
        } else {
          inquiryTotalPages.value = 0;
        }
      }

      // 다음 페이지가 있는지 확인
      inquiryHasMore.value =
        inquiryPage.value < inquiryTotalPages.value - 1 &&
        filteredInquiries.length >= inquiryPageSize;
    } else {
      inquiryHasMore.value = false;
      inquiryTotalPages.value = 0;
      inquiryTotalElements.value = 0;
    }
  } catch (err: any) {
    console.error("문의 목록 로드 실패:", err);
    inquiriesError.value = "질문을 불러오는 중 오류가 발생했습니다.";
    inquiryHasMore.value = false;
    inquiryTotalPages.value = 0;
    inquiryTotalElements.value = 0;
  } finally {
    inquiriesLoading.value = false;
  }
}

// 더 많은 문의 로드 (더 이상 사용하지 않음, 페이지네이션으로 대체)
async function loadMoreInquiries() {
  if (!inquiryHasMore.value || inquiriesLoading.value) return;
  inquiryPage.value++;
  await loadInquiries(false);
}

// 페이지네이션: 특정 페이지로 이동
async function goToInquiryPage(page: number) {
  if (page < 0 || page >= inquiryTotalPages.value || inquiriesLoading.value)
    return;
  inquiryPage.value = page;
  await loadInquiries(true); // reset=true로 해당 페이지 데이터만 로드
}

// 표시할 페이지 번호 계산 (최대 5개)
const visibleInquiryPages = computed(() => {
  const pages: number[] = [];
  const total = inquiryTotalPages.value;
  const current = inquiryPage.value;

  if (total === 0) return pages;

  const maxVisible = 5;
  let start = Math.max(0, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible);

  // 끝에서 시작이 조정되지 않도록
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  return pages;
});

// 내 문의 목록 로드
async function loadMyInquiries() {
  if (!curriculum.value?.id || !getCurrentUserId()) return;

  try {
    const curriculumId = curriculum.value.id;
    const response = await reviewApiService.getMyInquiries(curriculumId);

    if (response && Array.isArray(response)) {
      // 문의만 필터링 (isReview: false)
      const filteredMyInquiries = response.filter(
        (item) => item.isReview === false
      );
      myInquiries.value = filteredMyInquiries;

      // 각 문의의 답변 개수를 미리 조회
      const replyCountPromises = filteredMyInquiries.map(async (inquiry) => {
        try {
          const replies = await reviewApiService.getReplies(
            curriculumId,
            inquiry.id
          );
          inquiryRepliesMap.value.set(inquiry.id, replies || []);
        } catch (err) {
          // 답변 조회 실패 시 빈 배열로 설정
          inquiryRepliesMap.value.set(inquiry.id, []);
        }
      });

      // 병렬로 답변 개수 조회 (실패해도 계속 진행)
      await Promise.allSettled(replyCountPromises);
    } else {
      myInquiries.value = [];
    }
  } catch (err: any) {
    console.error("내 문의 목록 로드 실패:", err);
    // 내 문의 로드 실패는 조용히 처리 (404일 수 있음)
    myInquiries.value = [];
  }
}

// 문의 작성
async function submitInquiry() {
  if (!curriculum.value?.id || !inquiryContent.value.trim()) return;

  try {
    isSubmittingInquiry.value = true;

    const curriculumId = curriculum.value.id;
    const inquiryRequest = {
      isReview: false,
      rating: null,
      content: inquiryContent.value.trim(),
      isPublic: inquiryIsPublic.value,
    };

    await reviewApiService.createInquiry(curriculumId, inquiryRequest);

    // 성공 후 폼 초기화 및 목록 새로고침
    inquiryContent.value = "";
    inquiryIsPublic.value = true;
    showInquiryForm.value = false;

    // 문의 목록 새로고침
    await Promise.all([loadInquiries(true), loadMyInquiries()]);

    alert("질문이 작성되었습니다.");
  } catch (err: any) {
    console.error("문의 작성 실패:", err);
    alert("질문 작성 중 오류가 발생했습니다.");
  } finally {
    isSubmittingInquiry.value = false;
  }
}

// 탭 변경 감지하여 문의 데이터 로드
watch(activeTab, async (newTab: string) => {
  if (newTab === "qa" && curriculum.value?.id) {
    await loadInquiries(true);
    await loadMyInquiries();
  }
});

onMounted(async () => {
  await loadCurriculumDetail();
  await checkEnrollmentStatus();
  // 커리큘럼 로드 후 구독 상태 확인
  setTimeout(() => {
    checkSubscriptionStatus();
  }, 100);
});
</script>
