<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 브레드크럼 -->
    <div class="px-6 py-4">
      <nav class="text-sm text-gray-600">
        <span>전체</span>
        <span class="mx-2">></span>
        <span>{{ curriculum?.category || '프로그램/모바일 앱 개발' }}</span>
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
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
            <h1 class="text-2xl font-bold mb-4" style="color: rgb(var(--figma-color-2))">
              {{ curriculum.title }}
            </h1>
            
            <p class="text-gray-600 mb-4 leading-relaxed">
              {{ curriculum.description }}
            </p>

            <!-- 간단 소개 (요약) -->
            <p v-if="curriculum.summary" class="text-sm text-gray-500 mb-4 italic">
              {{ curriculum.summary }}
            </p>

            <div class="flex items-center space-x-4">
              <!-- 평균 별점 표시 (averageRating 사용) -->
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.floor(curriculum.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ (curriculum.averageRating || 0).toFixed(1) }}점
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
              <span v-else-if="curriculum.instructor" class="text-sm" style="color: rgb(var(--figma-color-5))">{{ curriculum.instructor }}</span>
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
          <div class="bg-figma-1 rounded-lg border mb-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex border-b" style="border-color: rgb(var(--figma-color-4))">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'"
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
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">강의 소개</h3>
                
                <!-- 강의 소개 썸네일 -->
                <div 
                  class="h-48 rounded-lg mb-6 flex items-center justify-center text-4xl font-bold text-gray-400"
                  style="background-color: rgb(var(--figma-color-4))"
                >
                  ✕
                </div>

                <!-- 이런 걸 배울 수 있어요 -->
                <div class="mb-8">
                  <h4 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">이런 걸 배울 수 있어요</h4>
                  <ul class="space-y-2">
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">빅데이터를 이용해서 특정 데이터를 추출하는 방법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">파이썬 기본 문법과 활용법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">그래프 활용법</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 커리큘럼 탭 -->
              <div v-else-if="activeTab === 'curriculum'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼</h3>
                
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
                        <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                          {{ chapter.isExpanded ? '∨' : '∧' }} {{ chapter.title }}
                        </span>
                        <span class="text-sm" style="color: rgb(var(--figma-color-5))">{{ chapter.lectures.length }}개 레슨</span>
                      </div>
                    </button>
                    
                    <div v-if="chapter.isExpanded" class="px-4 pb-4 border-t" style="border-color: rgb(var(--figma-color-4))">
                      <div class="pt-4 space-y-3">
                        <div
                          v-for="lecture in chapter.lectures"
                          :key="lecture.id"
                          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          @click="goToLecture(lecture.lectureId)"
                        >
                          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white" style="background-color: rgb(var(--figma-color-6))">
                            {{ lecture.orderIndex }}
                          </div>
                          <div class="flex-1">
                            <span class="text-sm" style="color: rgb(var(--figma-color-2))">{{ lecture.lectureTitle }}</span>
                            <span v-if="lecture.isRequired" class="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded">필수</span>
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
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">질문&답변</h3>
                <p class="text-gray-600">질문이 아직 없습니다.</p>
              </div>

              <!-- 나의 학습 탭 -->
              <div v-else-if="activeTab === 'learning'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">나의 학습</h3>
                <p class="text-gray-600">학습 기록이 없습니다.</p>
              </div>
            </div>
          </div>

          <!-- 수강평 섹션 -->
          <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold" style="color: rgb(var(--figma-color-2))">수강평</h3>
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.floor(curriculum?.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">
                  {{ (curriculum?.averageRating || 0).toFixed(1) }}
                </span>
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">API 연결 없음(리뷰 개수)</span>
              </div>
            </div>

            <!-- 리뷰 그리드 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="review in hardcodedData.reviews" 
                :key="review.id"
                class="p-4 border rounded-lg" 
                style="border-color: rgb(var(--figma-color-4))"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ review.name }}</span>
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">5.0</span>
                </div>
                <p class="text-sm text-gray-600">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 수강신청 카드 -->
          <div class="bg-figma-1 rounded-lg border p-6 sticky top-6" style="border-color: rgb(var(--figma-color-4))">
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
                  {{ isCanceling ? '취소 중...' : '수강취소' }}
                </button>
              </template>
            </div>
            
            <div v-if="curriculum" class="mt-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">지식공유자</span>
                <div class="flex items-center space-x-2">
                  <button 
                    v-if="curriculum.authorId"
                    @click.stop="goToCreatorProfile(curriculum.authorId)"
                    class="text-sm font-medium hover:text-blue-600 hover:underline transition-colors"
                    style="color: rgb(var(--figma-color-2))"
                  >
                    {{ curriculum.instructor }}
                  </button>
                  <span v-else class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.instructor }}</span>
                  <button
                    @click="toggleSubscribe"
                    class="px-3 py-1 text-xs rounded-full transition-colors"
                    :class="isSubscribed 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'"
                  >
                    {{ isSubscribed ? '구독중' : '구독하기' }}
                  </button>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">카테고리</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">강의 시간</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.durationMinutes ? `${curriculum.durationMinutes}분` : '미정' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">난이도</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.difficulty || '미정' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">수강생 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
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
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { curriculumApiService } from '@/services/curriculumApi';
import { enrollmentApiService } from '@/services/enrollmentApi';
import { Button, LoadingSpinner, ErrorMessage } from '@/components/common';
import type { CurriculumDetailResponse, CurriculumLectureResponse } from '@/types/curriculum';
import { CHAPTER_TITLES } from '@/constants';
import { getCurrentUserId } from '@/config/api';
import { S3ApiService } from '@/services/s3Api';

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

// 탭 상태
const activeTab = ref('intro');

// 챕터 상태
const expandedChapters = ref<Set<number>>(new Set([0])); // 첫 번째 챕터는 기본적으로 열림

// 탭 옵션
const tabs = ref([
  { id: 'intro', name: '강의 소개' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'qa', name: '질문&답변' },
  { id: 'learning', name: '나의 학습' }
]);

// TODO: 백엔드 API 미구현 항목 (백엔드_API_추가_개발_요청.md 참고)
// - Review API 미구현 (GET/POST/PUT/DELETE /api/curriculums/{id}/reviews)
//   → Review 엔티티, 컨트롤러, 서비스 추가 필요
//   → 리뷰 작성, 조회, 수정, 삭제 API 구현 후 hardcodedData.reviews 제거
const hardcodedData = {
  reviews: [
    {
      id: -99,
      name: 'API 연결없음(기본값 = "김준성")',
      content: 'API 연결없음(기본값 = "예전에 배운 강의는 정말 유익했어요... 님 교수님의 강의 좋아요... ㅠㅠㅠ")'
    }
  ]
};

// 강의를 챕터별로 그룹화 (5개씩)
const groupedLectures = computed(() => {
  const groups = [];
  const lecturesPerChapter = 5;
  
  for (let i = 0; i < lectures.value.length; i += lecturesPerChapter) {
    const chapterLectures = lectures.value.slice(i, i + lecturesPerChapter);
    groups.push({
      title: `챕터 ${Math.floor(i / lecturesPerChapter) + 1}. ${getChapterTitle(Math.floor(i / lecturesPerChapter))}`,
      lectures: chapterLectures,
      isExpanded: expandedChapters.value.has(Math.floor(i / lecturesPerChapter))
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
    
    if (typeof curriculumIdParam === 'string') {
      // 문자열에서 숫자만 추출
      const numericMatch = curriculumIdParam.match(/(\d+)/);
      if (numericMatch) {
        curriculumId = parseInt(numericMatch[1], 10);
      } else {
        throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
      }
    } else if (typeof curriculumIdParam === 'number') {
      curriculumId = curriculumIdParam;
    } else {
      throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
    }
    
    if (isNaN(curriculumId) || curriculumId <= 0) {
      throw new Error(`유효하지 않은 커리큘럼 ID: ${curriculumIdParam}`);
    }
    
    const data: CurriculumDetailResponse = await curriculumApiService.getCurriculumById(curriculumId);

    curriculum.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      instructor: data.author?.username || '알 수 없음',
      authorId: data.author?.id, // 작성자 ID 추가
      category: data.category || '미분류',
      // API에서 가져온 필드들
      difficulty: data.difficulty,
      summary: data.summary,
      averageRating: data.averageRating,
      studentCount: data.studentCount,
      tags: data.tags || [],
      thumbnailImageUrl: data.thumbnailImageUrl,
      durationMinutes: data.durationMinutes
    };

    lectures.value = (data.lectures || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // 수강자 수 조회
    try {
      const countData = await enrollmentApiService.getCurriculumEnrollmentCount(curriculumId);
      enrollmentCount.value = countData.enrollmentCount;
    } catch (err) {
      console.warn('수강자 수 조회 실패:', err);
      enrollmentCount.value = 0;
    }

  } catch (err) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '커리큘럼 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 수강 상태 확인
async function checkEnrollmentStatus() {
  if (!curriculum.value) {
    console.log('[수강 상태 확인] curriculum이 없습니다.');
    return;
  }

  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('[수강 상태 확인] 사용자 ID를 찾을 수 없습니다.');
      isEnrolled.value = false;
      enrollmentId.value = null;
      return;
    }

    console.log('[수강 상태 확인] userId:', userId, 'curriculumId:', curriculum.value.id);

    // 사용자의 전체 수강 목록 조회
    const enrollments = await enrollmentApiService.getUserEnrollments(userId);
    console.log('[수강 상태 확인] 수강 목록:', enrollments);

    // 현재 커리큘럼이 수강 목록에 있는지 확인 (ENROLLED 상태 체크)
    const enrollment = enrollments.find(e =>
      e.curriculumId === curriculum.value.id && e.status === 'ENROLLED'
    );
    console.log('[수강 상태 확인] 현재 커리큘럼 수강 정보:', enrollment);

    if (enrollment) {
      isEnrolled.value = true;
      enrollmentId.value = enrollment.id;
      console.log('[수강 상태 확인] ✅ 수강 중 - enrollmentId:', enrollment.id);
    } else {
      isEnrolled.value = false;
      enrollmentId.value = null;
      console.log('[수강 상태 확인] ❌ 미수강');
    }
  } catch (err) {
    console.error('수강 상태 확인 실패:', err);
    isEnrolled.value = false;
    enrollmentId.value = null;
  }
}

// 수강 신청
async function enrollCurriculum() {
  if (!curriculum.value) return;

  try {
    isEnrolling.value = true;
    const response = await enrollmentApiService.enrollCurriculum(curriculum.value.id);
    alert('수강 신청이 완료되었습니다!');

    // 수강 상태 업데이트
    isEnrolled.value = true;
    enrollmentId.value = response.id;

    // 학습 페이지로 이동
    router.push({ name: 'curriculum-detail', params: { id: curriculum.value.id } });
  } catch (err: any) {
    console.error('수강 신청 실패:', err);
    alert(err.message || '수강 신청에 실패했습니다.');
  } finally {
    isEnrolling.value = false;
  }
}

// 이어 수강하기
function continueLearning() {
  if (!curriculum.value) return;
  router.push({ name: 'curriculum-detail', params: { id: curriculum.value.id } });
}

// 수강 취소
async function cancelEnrollment() {
  if (!enrollmentId.value || !curriculum.value) return;

  const confirmed = confirm('정말로 수강을 취소하시겠습니까?');
  if (!confirmed) return;

  try {
    isCanceling.value = true;
    await enrollmentApiService.cancelEnrollment(enrollmentId.value);
    alert('수강이 취소되었습니다.');

    // 수강 상태 업데이트
    isEnrolled.value = false;
    enrollmentId.value = null;
  } catch (err: any) {
    console.error('수강 취소 실패:', err);
    alert(err.message || '수강 취소에 실패했습니다.');
  } finally {
    isCanceling.value = false;
  }
}

// 강의로 이동
function goToLecture(lectureId: number) {
  const curriculumId = route.params.id;
  router.push({
    name: 'lecture',
    params: { lectureId },
    query: { curriculumId }
  });
}

function goToCreatorProfile(authorId: number) {
  router.push({
    name: 'creator-profile',
    params: { id: authorId }
  });
}

// 구독 상태 확인
function checkSubscriptionStatus() {
  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    isSubscribed.value = subscriptions.some((sub: any) => sub.name === curriculum.value?.instructor);
  } catch {
    isSubscribed.value = false;
  }
}

// 구독 토글
function toggleSubscribe() {
  if (!curriculum.value?.instructor) return;

  try {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    
    if (isSubscribed.value) {
      if (confirm(`"${curriculum.value.instructor}"의 구독을 해지하시겠습니까?`)) {
        const updatedSubs = subscriptions.filter((sub: any) => sub.name !== curriculum.value.instructor);
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
        isSubscribed.value = false;
        alert(`${curriculum.value.instructor}의 구독이 해지되었습니다.`);
      }
    } else {
      const newSubscription = {
        id: Date.now(),
        name: curriculum.value.instructor,
        handle: `@${curriculum.value.instructor.toLowerCase().replace(/\s+/g, '')}`,
        avatarColor: '#4F46E5',
        subscribers: Math.floor(Math.random() * 100000) + 10000,
        description: `${curriculum.value.instructor}의 강의를 구독합니다.`,
        subscribedAt: new Date().toISOString()
      };
      
      subscriptions.push(newSubscription);
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
      isSubscribed.value = true;
      alert(`${curriculum.value.instructor}을(를) 구독했습니다!`);
    }
  } catch (err) {
    console.error('구독 상태 변경 실패:', err);
  }
}

// 이미지 URL 생성 헬퍼
function getImageUrl(path: string | null | undefined): string {
  return S3ApiService.getImageUrl(path);
}

// 썸네일 이미지 로드 에러 핸들링
function handleThumbnailError(event: Event) {
  console.warn('썸네일 이미지 로드 실패:', curriculum.value?.thumbnailImageUrl);
  // 이미지 로드 실패 시 thumbnailImageUrl을 null로 설정하여 플레이스홀더 표시
  if (curriculum.value) {
    curriculum.value.thumbnailImageUrl = null;
  }
}

onMounted(async () => {
  await loadCurriculumDetail();
  await checkEnrollmentStatus();
  // 커리큘럼 로드 후 구독 상태 확인
  setTimeout(() => {
    checkSubscriptionStatus();
  }, 100);
});
</script>