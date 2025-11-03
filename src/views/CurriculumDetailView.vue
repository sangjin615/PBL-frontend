<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div
      class="bg-figma-1 border-b"
      style="border-color: rgb(var(--figma-color-4))"
    >
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 뒤로가기 버튼 -->
            <button
              @click="$router.back()"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            <div v-if="curriculum">
              <h1
                class="text-2xl font-bold"
                style="color: rgb(var(--figma-color-2))"
              >
                {{ curriculum.title }}
              </h1>
              <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">
                <button
                  v-if="curriculum.authorId"
                  @click.stop="goToCreatorProfile(curriculum.authorId)"
                  class="hover:text-blue-600 hover:underline transition-colors"
                >
                  {{ curriculum.instructor }}
                </button>
                <span v-else>{{ curriculum.instructor }}</span>
                • {{ curriculum.category }}
              </p>
            </div>
          </div>

          <!-- 액션 버튼들 -->
          <div class="flex items-center space-x-3">
            <!-- 진행률 바 -->
            <div
              v-if="isEnrolled"
              class="flex items-center space-x-3 px-4 py-2"
            >
              <div class="w-32">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span style="color: rgb(var(--figma-color-5))">진행률</span>
                  <span
                    class="font-medium"
                    style="color: rgb(var(--figma-color-2))"
                    >{{ progressPercentage }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{
                      backgroundColor: 'rgb(var(--figma-color-6))',
                      width: progressPercentage + '%',
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <button
              @click="goToInquiry"
              class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              style="
                border-color: rgb(var(--figma-color-4));
                color: rgb(var(--figma-color-2));
              "
              type="button"
            >
              문의하기
            </button>
            <button
              @click="goToReview"
              class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              style="
                border-color: rgb(var(--figma-color-4));
                color: rgb(var(--figma-color-2));
              "
              type="button"
            >
              리뷰 작성
            </button>
            <button
              @click="shareCurriculum"
              class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              style="
                border-color: rgb(var(--figma-color-4));
                color: rgb(var(--figma-color-2));
              "
              type="button"
            >
              공유하기
            </button>
            <button
              v-if="isEnrolled"
              @click="cancelEnrollment"
              :disabled="isCanceling"
              class="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style="border-color: rgb(239 68 68); color: rgb(239 68 68)"
              type="button"
            >
              {{ isCanceling ? "취소 중..." : "수강취소" }}
            </button>
            <ReportButton
              v-if="curriculum"
              report-type="curriculum"
              :target-id="curriculum.id"
              :target-title="curriculum.title"
              @reported="handleReported"
            />
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

          <!-- 커리큘럼 설명 -->
          <div
            v-if="curriculum"
            class="bg-figma-1 rounded-lg border p-6 mb-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <h2
              class="text-lg font-semibold mb-4"
              style="color: rgb(var(--figma-color-2))"
            >
              커리큘럼 소개
            </h2>
            <p class="text-gray-600 leading-relaxed">
              {{ curriculum.description }}
            </p>
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
              <!-- 강의 탭 -->
              <div v-if="activeTab === 'lectures'">
                <h3
                  class="text-lg font-semibold mb-4"
                  style="color: rgb(var(--figma-color-2))"
                >
                  이어서 학습하기
                </h3>

                <div v-if="lectures.length > 0" class="space-y-4">
                  <div
                    v-for="(lecture, index) in lectures"
                    :key="lecture.id"
                    class="flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer bg-white border-gray-200 hover:bg-gray-50"
                    style="border-color: rgb(var(--figma-color-4))"
                    @click="goToLecture(lecture.lectureId)"
                  >
                    <div class="flex items-center space-x-4">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style="background-color: rgb(var(--figma-color-6))"
                      >
                        {{ index + 1 }}
                      </div>
                      <div>
                        <h4
                          class="font-medium"
                          style="color: rgb(var(--figma-color-2))"
                        >
                          {{ lecture.lectureTitle }}
                        </h4>
                        <p
                          class="text-sm"
                          style="color: rgb(var(--figma-color-5))"
                        >
                          형태: {{ lecture.lectureType }} •
                          {{ formatDate(lecture.createdAt) }}
                        </p>
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
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-4">
                    <h3
                      class="text-lg font-semibold"
                      style="color: rgb(var(--figma-color-2))"
                    >
                      리뷰
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
                        class="text-sm font-medium"
                        style="color: rgb(var(--figma-color-2))"
                      >
                        {{ (averageRating || 0).toFixed(1) }}점 ({{
                          reviewCount
                        }}개)
                      </span>
                    </div>
                  </div>
                  <Button
                    v-if="getCurrentUserId()"
                    @click="goToReview"
                    class="text-sm"
                  >
                    리뷰 작성
                  </Button>
                </div>

                <!-- 리뷰 로딩 -->
                <div v-if="reviewsLoading" class="flex justify-center py-8">
                  <LoadingSpinner size="md" message="리뷰를 불러오는 중..." />
                </div>

                <!-- 리뷰 에러 -->
                <div v-else-if="reviewsError" class="text-red-600 text-sm py-4">
                  {{ reviewsError }}
                </div>

                <!-- 리뷰 목록 -->
                <div v-else-if="reviews.length > 0" class="space-y-4">
                  <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="border rounded-lg p-4"
                    style="border-color: rgb(var(--figma-color-4))"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center space-x-3">
                        <span class="text-sm font-medium">{{
                          getReviewAuthorName(review)
                        }}</span>
                        <div class="flex text-yellow-400">
                          <svg
                            v-for="i in 5"
                            :key="i"
                            class="w-4 h-4"
                            :class="
                              i <= (review.rating || 0)
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
                      </div>
                      <span class="text-xs text-gray-500">{{
                        formatReviewDate(review.createdAt)
                      }}</span>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                      {{ review.content }}
                    </p>

                    <!-- 답변 개수 및 펼치기 -->
                    <button
                      @click="toggleReview(review.id)"
                      class="text-xs text-blue-600 hover:underline mb-2"
                    >
                      답변 {{ reviewRepliesMap.get(review.id)?.length || 0 }}개
                      {{ expandedReviews.has(review.id) ? "접기" : "보기" }}
                    </button>

                    <!-- 답변 목록 -->
                    <div
                      v-if="expandedReviews.has(review.id)"
                      class="mt-3 pt-3 border-t"
                      style="border-color: rgb(var(--figma-color-4))"
                    >
                      <div
                        v-if="loadingReviewReplies.get(review.id)"
                        class="py-4 text-center text-sm text-gray-500"
                      >
                        답변을 불러오는 중...
                      </div>
                      <div v-else class="space-y-3">
                        <div
                          v-for="reply in reviewRepliesMap.get(review.id) || []"
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
                          <p class="text-sm text-gray-700 whitespace-pre-wrap">
                            {{ reply.content }}
                          </p>
                        </div>
                        <div
                          v-if="
                            !reviewRepliesMap.get(review.id) ||
                            reviewRepliesMap.get(review.id)?.length === 0
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
                          :value="reviewReplyContentMap.get(review.id) || ''"
                          @input="updateReviewReplyContent(review.id, $event)"
                          rows="3"
                          class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                          style="border-color: rgb(var(--figma-color-4))"
                          placeholder="답변을 입력하세요..."
                        ></textarea>
                        <div class="flex justify-end">
                          <Button
                            @click="submitReviewReply(review.id)"
                            :disabled="
                              !reviewReplyContentMap.get(review.id)?.trim() ||
                              isSubmittingReviewReply.get(review.id)
                            "
                            class="text-sm"
                          >
                            {{
                              isSubmittingReviewReply.get(review.id)
                                ? "작성 중..."
                                : "답변 작성"
                            }}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">리뷰가 아직 없습니다.</p>
                </div>
              </div>

              <!-- 문의 탭 -->
              <div v-else-if="activeTab === 'inquiries'">
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
                    <label class="block text-sm font-medium mb-2"
                      >질문 내용</label
                    >
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
                    <label for="inquiryPublic" class="text-sm"
                      >공개로 작성하기</label
                    >
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

                <!-- 내 문의 목록 -->
                <div
                  v-if="getCurrentUserId() && myInquiries.length > 0"
                  class="mb-6"
                >
                  <h4 class="text-md font-semibold mb-3">내 질문</h4>
                  <div class="space-y-4">
                    <div
                      v-for="inquiry in myInquiries"
                      :key="inquiry.id"
                      class="rounded-lg border"
                      style="
                        border-color: rgb(var(--figma-color-4));
                        background-color: rgb(var(--figma-color-1));
                      "
                    >
                      <button
                        @click="toggleMyInquiry(inquiry.id)"
                        class="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-sm font-medium">{{
                                getReviewAuthorName(inquiry)
                              }}</span>
                              <span class="text-xs text-gray-500">
                                {{ formatReviewDate(inquiry.createdAt) }}
                                <span
                                  v-if="!inquiry.isPublic"
                                  class="ml-2 text-gray-400"
                                  >(비공개)</span
                                >
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

                      <!-- 답변 목록 -->
                      <div
                        v-if="expandedMyInquiries.has(inquiry.id)"
                        class="border-t px-4 py-3"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        <div
                          v-if="loadingReplies.get(inquiry.id)"
                          class="py-4 text-center text-sm text-gray-500"
                        >
                          답변을 불러오는 중...
                        </div>
                        <div v-else class="space-y-3">
                          <div
                            v-for="reply in inquiryRepliesMap.get(inquiry.id) ||
                            []"
                            :key="reply.id"
                            class="pl-4 py-2 border-l-2"
                            style="border-color: rgb(var(--figma-color-4))"
                          >
                            <div class="flex items-center justify-between mb-1">
                              <span class="text-xs font-medium text-gray-600">{{
                                getReviewAuthorName(reply)
                              }}</span>
                              <span class="text-xs text-gray-400">{{
                                formatReviewDate(reply.createdAt)
                              }}</span>
                            </div>
                            <p
                              class="text-sm text-gray-700 whitespace-pre-wrap"
                            >
                              {{ reply.content }}
                            </p>
                          </div>
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
                              class="text-sm"
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

                  <!-- 구분선 -->
                  <div
                    v-if="inquiries.length > 0 || inquiryTotalPages > 0"
                    class="border-t-2 border-solid my-6"
                    style="border-color: rgb(var(--figma-color-4))"
                  ></div>
                </div>

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
                  <h4 class="text-md font-semibold mb-3">모든 질문</h4>
                  <div class="space-y-4">
                    <div
                      v-for="inquiry in inquiries"
                      :key="inquiry.id"
                      class="rounded-lg border"
                      style="
                        border-color: rgb(var(--figma-color-4));
                        background-color: rgb(var(--figma-color-1));
                      "
                    >
                      <button
                        @click="togglePublicInquiry(inquiry.id)"
                        class="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-sm font-medium">{{
                                getReviewAuthorName(inquiry)
                              }}</span>
                              <span class="text-xs text-gray-500">
                                {{ formatReviewDate(inquiry.createdAt) }}
                                <span
                                  v-if="!inquiry.isPublic"
                                  class="ml-2 text-gray-400"
                                  >(비공개)</span
                                >
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

                      <!-- 답변 목록 -->
                      <div
                        v-if="expandedPublicInquiries.has(inquiry.id)"
                        class="border-t px-4 py-3"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        <div
                          v-if="loadingReplies.get(inquiry.id)"
                          class="py-4 text-center text-sm text-gray-500"
                        >
                          답변을 불러오는 중...
                        </div>
                        <div v-else class="space-y-3">
                          <div
                            v-for="reply in inquiryRepliesMap.get(inquiry.id) ||
                            []"
                            :key="reply.id"
                            class="pl-4 py-2 border-l-2"
                            style="border-color: rgb(var(--figma-color-4))"
                          >
                            <div class="flex items-center justify-between mb-1">
                              <span class="text-xs font-medium text-gray-600">{{
                                getReviewAuthorName(reply)
                              }}</span>
                              <span class="text-xs text-gray-400">{{
                                formatReviewDate(reply.createdAt)
                              }}</span>
                            </div>
                            <p
                              class="text-sm text-gray-700 whitespace-pre-wrap"
                            >
                              {{ reply.content }}
                            </p>
                          </div>
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
                              class="text-sm"
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
                      <button
                        @click="goToInquiryPage(inquiryPage - 1)"
                        :disabled="inquiryPage === 0 || inquiriesLoading"
                        class="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        style="border-color: rgb(var(--figma-color-4))"
                      >
                        이전
                      </button>
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
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 커리큘럼 정보 카드 -->
          <div
            v-if="curriculum"
            class="bg-figma-1 rounded-lg border p-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <h3
              class="font-semibold mb-4"
              style="color: rgb(var(--figma-color-2))"
            >
              커리큘럼 정보
            </h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >강의자</span
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
                  >총 강의 수</span
                >
                <span
                  class="text-sm font-medium"
                  style="color: rgb(var(--figma-color-2))"
                  >{{ curriculum.totalLectureCount }}개</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))"
                  >총 소요 시간</span
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

          <!-- 태그 -->
          <div
            v-if="curriculum && curriculum.tags?.length > 0"
            class="bg-figma-1 rounded-lg border p-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <h3
              class="font-semibold mb-4"
              style="color: rgb(var(--figma-color-2))"
            >
              태그
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in curriculum.tags"
                :key="tag"
                class="px-3 py-1 text-xs rounded-full font-medium"
                style="
                  background-color: rgb(var(--figma-color-7));
                  color: rgb(var(--figma-color-6));
                "
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 학습 목표 -->
          <div
            v-if="curriculum"
            class="bg-figma-1 rounded-lg border p-6"
            style="border-color: rgb(var(--figma-color-4))"
          >
            <h3
              class="font-semibold mb-4"
              style="color: rgb(var(--figma-color-2))"
            >
              학습 목표
            </h3>
            <ul v-if="learningObjectivesList.length > 0" class="space-y-2">
              <li
                v-for="(goal, index) in learningObjectivesList"
                :key="index"
                class="flex items-start space-x-2"
              >
                <svg
                  class="w-4 h-4 mt-0.5 flex-shrink-0"
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
                <span
                  class="text-sm"
                  style="color: rgb(var(--figma-color-2))"
                  >{{ goal }}</span
                >
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500 italic">
              학습 목표가 설정되지 않았습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { curriculumApiService } from "@/services/curriculumApi";
import { enrollmentApiService } from "@/services/enrollmentApi";
import {
  ReportButton,
  Button,
  LoadingSpinner,
  ErrorMessage,
} from "@/components/common";
import { reviewApiService } from "@/services/reviewApi";
import { useAuth } from "@/composables/useAuth";
import type {
  CurriculumDetailResponse,
  CurriculumLectureResponse,
} from "@/types/curriculum";
import type { ReviewResponse, ReplyResponse } from "@/types/review";
import { getCurrentUserId } from "@/config/api";
import { S3ApiService } from "@/services/s3Api";

const route = useRoute();
const router = useRouter();
const { isAdmin, currentUser } = useAuth();

// 상태 관리
const curriculum = ref<any>(null);
const lectures = ref<CurriculumLectureResponse[]>([]);
const enrollmentCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const isSubscribed = ref(false);
const isEnrolled = ref(false);
const enrollmentId = ref<number | null>(null);
const isCanceling = ref(false);
const progressPercentage = ref(0); // 진행률 (0-100)

// 탭 상태
const activeTab = ref("lectures");

// 탭 옵션
const tabs = ref([
  { id: "lectures", name: "강의" },
  { id: "reviews", name: "리뷰" },
  { id: "inquiries", name: "문의" },
]);

// 리뷰 상태 관리
const reviews = ref<ReviewResponse[]>([]);
const averageRating = ref(0);
const reviewCount = ref(0);
const reviewsLoading = ref(false);
const reviewsError = ref<string | null>(null);

// 리뷰 답글 관련 상태
const expandedReviews = ref<Set<number>>(new Set());
const reviewReplyContentMap = ref<Map<number, string>>(new Map());
const isSubmittingReviewReply = ref<Map<number, boolean>>(new Map());
const reviewRepliesMap = ref<Map<number, ReplyResponse[]>>(new Map());
const loadingReviewReplies = ref<Map<number, boolean>>(new Map());

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
const expandedMyInquiries = ref<Set<number>>(new Set());
const expandedPublicInquiries = ref<Set<number>>(new Set());
const replyContentMap = ref<Map<number, string>>(new Map());
const isSubmittingReply = ref<Map<number, boolean>>(new Map());
const inquiryRepliesMap = ref<Map<number, ReplyResponse[]>>(new Map());
const loadingReplies = ref<Map<number, boolean>>(new Map());

// 학습 목표를 리스트로 파싱 (줄바꿈 또는 특정 구분자로 분리)
const learningObjectivesList = computed(() => {
  if (!curriculum.value?.learningObjectives) {
    return [];
  }
  // 줄바꿈(\n) 또는 줄바꿈 조합으로 분리하고, 빈 문자열 제거
  return curriculum.value.learningObjectives
    .split(/\r?\n/)
    .map((goal: string) => goal.trim())
    .filter((goal: string) => goal.length > 0);
});

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
      progressPercentage.value = enrollment.progressPercentage || 0;
      console.log(
        "[수강 상태 확인] ✅ 수강 중 - enrollmentId:",
        enrollment.id,
        "진행률:",
        progressPercentage.value + "%"
      );
    } else {
      isEnrolled.value = false;
      enrollmentId.value = null;
      progressPercentage.value = 0;
      console.log("[수강 상태 확인] ❌ 미수강");
    }
  } catch (err) {
    console.error("수강 상태 확인 실패:", err);
    isEnrolled.value = false;
    enrollmentId.value = null;
    progressPercentage.value = 0;
  }
}

// 커리큘럼 상세 정보 로드
async function loadCurriculumDetail() {
  try {
    loading.value = true;
    error.value = null;

    const curriculumId = Number(route.params.id);
    const data: CurriculumDetailResponse =
      await curriculumApiService.getCurriculumById(curriculumId);

    // 커리큘럼 정보 설정 (백엔드 API 응답을 직접 사용)
    curriculum.value = {
      ...data,
      instructor: data.author?.username || "알 수 없음",
      authorId: data.author?.id, // 작성자 ID 추가
      category: data.category || "미분류",
      tags: data.tags || [],
    };

    // 강의 목록 정렬 (orderIndex 순)
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
  } catch (err) {
    console.error("커리큘럼 로드 실패:", err);
    error.value = "커리큘럼 정보를 불러오는 중 오류가 발생했습니다.";
  } finally {
    loading.value = false;
  }
}

// 날짜 포맷팅
function formatDate(dateValue: string | number[]): string {
  if (Array.isArray(dateValue)) {
    const [year, month, day] = dateValue;
    return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  } else {
    const date = new Date(dateValue);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }
}

// 강의로 이동
async function goToLecture(lectureId: number) {
  const curriculumId = route.params.id;

  // 전역 Monaco Editor 정리 확인
  if (window.__monacoEditorActive && window.__monacoEditorCleanup) {
    console.log("🔧 이전 Monaco Editor 인스턴스 정리 중...");
    try {
      await window.__monacoEditorCleanup();
      // 정리 후 추가 대기 시간
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (e) {
      console.warn("⚠️ 이전 인스턴스 정리 중 오류:", e);
    }
  }

  // Monaco Editor를 사용하는 페이지로 이동할 때는 완전한 페이지 새로고침 사용
  // 이렇게 하면 Monaco Editor 모듈이 완전히 초기화됨
  const url = `/learn/${lectureId}${curriculumId ? `?curriculumId=${curriculumId}` : ""}`;
  window.location.href = url;
}

function goToCreatorProfile(authorId: number) {
  router.push({
    name: "creator-profile",
    params: { id: authorId },
  });
}

// 문의하기 페이지로 이동
function goToInquiry() {
  const curriculumId = route.params.id;
  router.push({
    name: "qna-write",
    query: { curriculumId },
  });
}

// 리뷰 작성 페이지로 이동
function goToReview() {
  const curriculumId = route.params.id;
  router.push({
    name: "curriculum-review",
    params: { id: curriculumId },
  });
}

// 커리큘럼 공유하기
async function shareCurriculum() {
  try {
    const curriculumId = route.params.id;
    const shareUrl = `${window.location.origin}/curriculum/${curriculumId}/learn`;

    // Web Share API 지원 여부 확인
    if (navigator.share) {
      await navigator.share({
        title: curriculum.value?.title || "커리큘럼",
        text: curriculum.value?.description || "이 커리큘럼을 확인해보세요!",
        url: shareUrl,
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      await navigator.clipboard.writeText(shareUrl);
      alert("링크가 클립보드에 복사되었습니다!");
    }
  } catch (error) {
    console.error("공유 실패:", error);

    // 클립보드 복사도 실패한 경우 수동 복사 안내
    const curriculumId = route.params.id;
    const shareUrl = `${window.location.origin}/curriculum/${curriculumId}/learn`;

    // 임시 텍스트 영역을 생성하여 복사
    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    alert(`링크가 클립보드에 복사되었습니다!\n\n${shareUrl}`);
  }
}

// 구독 상태 확인
function checkSubscriptionStatus() {
  try {
    const subscriptions = JSON.parse(
      localStorage.getItem("subscriptions") || "[]"
    );
    // 강의자 이름으로 구독 상태 확인 (실제로는 강의자 ID를 사용해야 함)
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
      // 구독 해지 확인 다이얼로그
      if (
        confirm(
          `"${curriculum.value.instructor}"의 구독을 해지하시겠습니까?\n\n구독을 해지하면 해당 크리에이터의 새로운 콘텐츠 알림을 받을 수 없습니다.`
        )
      ) {
        const updatedSubs = subscriptions.filter(
          (sub: any) => sub.name !== curriculum.value.instructor
        );
        localStorage.setItem("subscriptions", JSON.stringify(updatedSubs));
        isSubscribed.value = false;
        alert(`${curriculum.value.instructor}의 구독이 해지되었습니다.`);
      }
    } else {
      // 구독 추가
      const newSubscription = {
        id: Date.now(), // 임시 ID
        name: curriculum.value.instructor,
        handle: `@${curriculum.value.instructor.toLowerCase().replace(/\s+/g, "")}`,
        avatarColor: "#4F46E5", // 기본 색상
        subscribers: Math.floor(Math.random() * 100000) + 10000, // 임시 구독자 수
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

    // 커리큘럼 개요 페이지로 이동
    router.push({
      name: "curriculum-overview",
      params: { id: curriculum.value.id },
    });
  } catch (err: any) {
    console.error("수강 취소 실패:", err);
    alert(err.message || "수강 취소에 실패했습니다.");
  } finally {
    isCanceling.value = false;
  }
}

// 신고 완료 처리
function handleReported() {
  console.log("커리큘럼 신고가 접수되었습니다.");
  // 필요시 추가 로직 (예: 토스트 메시지 표시)
}

// 리뷰 날짜 포맷팅
function formatReviewDate(date: number[] | string | null | undefined): string {
  if (!date) return "-";

  let d: Date;

  if (Array.isArray(date)) {
    const [year, month, day] = date;
    d = new Date(year, month - 1, day);
  } else if (typeof date === "string") {
    d = new Date(date);
  } else {
    return "-";
  }

  if (isNaN(d.getTime())) {
    return "-";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

// 리뷰 작성자 이름 가져오기
function getReviewAuthorName(
  review: ReviewResponse | ReplyResponse | any
): string {
  return review?.authorUsername || "익명";
}

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
    }

    // 리뷰 목록 조회 (리뷰만, isReview: true)
    try {
      const reviewsResponse = await reviewApiService.getCurriculumReviews(
        curriculumId,
        0,
        10
      );

      const filteredReviews = (reviewsResponse.content || []).filter(
        (review) => review.isReview === true && review.rating !== null
      );

      reviews.value = filteredReviews;

      // 각 리뷰의 답글 개수를 미리 조회
      const replyCountPromises = filteredReviews.map(async (review) => {
        try {
          const replies = await reviewApiService.getReviewReplies(
            curriculumId,
            review.id
          );
          reviewRepliesMap.value.set(review.id, replies || []);
        } catch (err) {
          reviewRepliesMap.value.set(review.id, []);
        }
      });

      await Promise.allSettled(replyCountPromises);
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

// 리뷰 접었다 펼치기
function toggleReview(reviewId: number) {
  if (expandedReviews.value.has(reviewId)) {
    expandedReviews.value.delete(reviewId);
  } else {
    expandedReviews.value.add(reviewId);
    loadReviewReplies(reviewId);
  }
}

// 리뷰 답글 목록 로드
async function loadReviewReplies(
  reviewId: number,
  forceReload: boolean = false
) {
  if (!curriculum.value?.id) return;

  if (!forceReload && reviewRepliesMap.value.has(reviewId)) return;

  try {
    loadingReviewReplies.value.set(reviewId, true);
    const curriculumId = curriculum.value.id;
    const replies = await reviewApiService.getReviewReplies(
      curriculumId,
      reviewId
    );
    reviewRepliesMap.value.set(reviewId, replies || []);
  } catch (err: any) {
    console.error(`리뷰 답글 목록 로드 실패 (리뷰 ID: ${reviewId}):`, err);
    reviewRepliesMap.value.set(reviewId, []);
  } finally {
    loadingReviewReplies.value.set(reviewId, false);
  }
}

// 리뷰 답글 내용 업데이트
function updateReviewReplyContent(reviewId: number, event: Event) {
  const target = event.target as HTMLTextAreaElement;
  reviewReplyContentMap.value.set(reviewId, target.value);
}

// 리뷰 답글 작성
async function submitReviewReply(reviewId: number) {
  if (
    !curriculum.value?.id ||
    !reviewReplyContentMap.value.get(reviewId)?.trim()
  ) {
    return;
  }

  try {
    isSubmittingReviewReply.value.set(reviewId, true);

    const curriculumId = curriculum.value.id;
    const replyContent =
      reviewReplyContentMap.value.get(reviewId)?.trim() || "";

    const replyRequest = {
      content: replyContent,
    };

    await reviewApiService.createReviewReply(
      curriculumId,
      reviewId,
      replyRequest
    );

    reviewReplyContentMap.value.set(reviewId, "");
    await loadReviewReplies(reviewId, true);

    alert("답변이 작성되었습니다.");
  } catch (err: any) {
    console.error("리뷰 답글 작성 실패:", err);
    alert("답변 작성 중 오류가 발생했습니다.");
  } finally {
    isSubmittingReviewReply.value.set(reviewId, false);
  }
}

// 답변 내용 업데이트
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
    loadRepliesForInquiry(inquiryId);
  }
}

// 공개 질문 접었다 펼치기
function togglePublicInquiry(inquiryId: number) {
  if (expandedPublicInquiries.value.has(inquiryId)) {
    expandedPublicInquiries.value.delete(inquiryId);
  } else {
    expandedPublicInquiries.value.add(inquiryId);
    loadRepliesForInquiry(inquiryId);
  }
}

// 질문의 답변 목록 로드
async function loadRepliesForInquiry(
  inquiryId: number,
  forceReload: boolean = false
) {
  if (!curriculum.value?.id) return;

  if (!forceReload && inquiryRepliesMap.value.has(inquiryId)) return;

  try {
    loadingReplies.value.set(inquiryId, true);
    const curriculumId = curriculum.value.id;
    const replies = await reviewApiService.getReplies(curriculumId, inquiryId);
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

    const replyRequest = {
      content: replyContent,
    };

    await reviewApiService.createReply(curriculumId, inquiryId, replyRequest);

    replyContentMap.value.set(inquiryId, "");
    await loadRepliesForInquiry(inquiryId, true);

    alert("답변이 작성되었습니다.");
  } catch (err: any) {
    console.error("답변 작성 실패:", err);
    alert("답변 작성 중 오류가 발생했습니다.");
  } finally {
    isSubmittingReply.value.set(inquiryId, false);
  }
}

// 문의 목록 로드
// 백엔드가 X-User-Id 헤더를 확인하여 자동으로 권한별로 필터링:
// - 일반 사용자: 공개 문의만 반환
// - 관리자(userId=1) 또는 커리큘럼 작성자: 공개 및 비공개 문의 모두 반환
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
      // 백엔드가 이미 권한별로 필터링하여 반환하므로, 프론트엔드에서는 그대로 표시
      let filteredInquiries = response.content.filter(
        (item) => item.isReview === false
      );

      if (reset) {
        inquiries.value = filteredInquiries;
      } else {
        inquiries.value = [...inquiries.value, ...filteredInquiries];
      }

      // 각 문의의 답변 개수를 미리 조회
      const replyCountPromises = filteredInquiries.map(async (inquiry) => {
        try {
          const replies = await reviewApiService.getReplies(
            curriculumId,
            inquiry.id
          );
          inquiryRepliesMap.value.set(inquiry.id, replies || []);
        } catch (err) {
          inquiryRepliesMap.value.set(inquiry.id, []);
        }
      });

      await Promise.allSettled(replyCountPromises);

      // 페이지네이션 정보 업데이트
      const totalElements = response.totalElements || filteredInquiries.length;
      inquiryTotalElements.value = totalElements;

      if (
        response.totalPages !== undefined &&
        response.totalPages !== null &&
        response.totalPages > 0
      ) {
        inquiryTotalPages.value = response.totalPages;
      } else {
        if (totalElements > 0) {
          inquiryTotalPages.value = Math.max(
            1,
            Math.ceil(totalElements / inquiryPageSize)
          );
        } else {
          inquiryTotalPages.value = 0;
        }
      }

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

// 페이지네이션: 특정 페이지로 이동
async function goToInquiryPage(page: number) {
  if (page < 0 || page >= inquiryTotalPages.value || inquiriesLoading.value)
    return;
  inquiryPage.value = page;
  await loadInquiries(true);
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
          inquiryRepliesMap.value.set(inquiry.id, []);
        }
      });

      await Promise.allSettled(replyCountPromises);
    } else {
      myInquiries.value = [];
    }
  } catch (err: any) {
    console.error("내 문의 목록 로드 실패:", err);
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

    inquiryContent.value = "";
    inquiryIsPublic.value = true;
    showInquiryForm.value = false;

    await Promise.all([loadInquiries(true), loadMyInquiries()]);

    alert("질문이 작성되었습니다.");
  } catch (err: any) {
    console.error("문의 작성 실패:", err);
    alert("질문 작성 중 오류가 발생했습니다.");
  } finally {
    isSubmittingInquiry.value = false;
  }
}

// 탭 변경 감지하여 리뷰/문의 데이터 로드
watch(activeTab, (newTab: string) => {
  if (newTab === "reviews" && curriculum.value?.id) {
    loadReviews();
  } else if (newTab === "inquiries" && curriculum.value?.id) {
    loadInquiries(true);
    if (getCurrentUserId()) {
      loadMyInquiries();
    }
  }
});

onMounted(async () => {
  await loadCurriculumDetail();
  await checkEnrollmentStatus();
  // 커리큘럼 로드 후 구독 상태 확인
  setTimeout(() => {
    checkSubscriptionStatus();
  }, 100);

  // 초기 탭이 리뷰나 문의인 경우 데이터 로드
  if (activeTab.value === "reviews") {
    await loadReviews();
  } else if (activeTab.value === "inquiries") {
    await loadInquiries(true);
    if (getCurrentUserId()) {
      await loadMyInquiries();
    }
  }
});
</script>
