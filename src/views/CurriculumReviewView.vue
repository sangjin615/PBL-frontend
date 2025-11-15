<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 헤더 섹션 -->
    <div class="bg-figma-1 border-b" style="border-color: rgb(var(--figma-color-4))">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- 뒤로가기 버튼 -->
            <button @click="$router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div v-if="curriculum">
              <h1 class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">
                {{ curriculum.title }} 리뷰 작성
              </h1>
              <p class="text-sm mt-1" style="color: rgb(var(--figma-color-5))">
                {{ curriculum.instructor }} • {{ curriculum.category }}
              </p>
            </div>
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
      <div class="max-w-2xl mx-auto">
        <!-- 커리큘럼 정보 카드 -->
        <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
          <div class="flex items-start space-x-4">
            <!-- 썸네일 -->
            <div 
              class="w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400 flex-shrink-0"
              style="background-color: rgb(var(--figma-color-4))"
            >
              ✕
            </div>
            
            <!-- 커리큘럼 정보 -->
            <div class="flex-1">
              <h2 class="text-lg font-semibold mb-2" style="color: rgb(var(--figma-color-2))">
                {{ curriculum.title }}
              </h2>
              <p class="text-sm text-gray-600 mb-2">{{ curriculum.description }}</p>
              <div class="flex items-center space-x-4 text-sm" style="color: rgb(var(--figma-color-5))">
                <span>{{ curriculum.instructor }}</span>
                <span>•</span>
                <span>{{ curriculum.category }}</span>
                <span>•</span>
                <span>{{ curriculum.totalLectureCount }}개 강의</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 리뷰 작성 폼 -->
        <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
          <h3 class="text-lg font-semibold mb-6" style="color: rgb(var(--figma-color-2))">
            리뷰 작성
          </h3>

          <!-- 별점 평가 -->
          <div class="mb-6">
            <label class="block text-sm font-medium mb-3" style="color: rgb(var(--figma-color-2))">
              별점 평가 <span class="text-red-500">*</span>
            </label>
            <StarRating 
              v-model:rating="reviewForm.rating" 
              :show-text="true"
            />
            <p v-if="ratingError" class="text-red-500 text-sm mt-2">{{ ratingError }}</p>
          </div>

          <!-- 텍스트 리뷰 -->
          <div class="mb-6">
            <label class="block text-sm font-medium mb-3" style="color: rgb(var(--figma-color-2))">
              상세 리뷰 (선택사항)
            </label>
            <FormTextarea
              v-model="reviewForm.content"
              placeholder="이 커리큘럼에 대한 상세한 의견을 남겨주세요..."
              :rows="6"
              :max-length="1000"
            />
            <div class="text-right text-sm text-gray-500 mt-1">
              {{ reviewForm.content?.length || 0 }}/1000
            </div>
          </div>

          <!-- 기존 리뷰가 있는 경우 -->
          <div v-if="existingReview" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-yellow-800">기존 리뷰가 있습니다</p>
                <p class="text-sm text-yellow-700 mt-1">
                  이미 작성하신 리뷰를 수정하시겠습니까?
                </p>
              </div>
            </div>
          </div>

          <!-- 버튼들 -->
          <div class="flex justify-end space-x-3">
            <button
              @click="$router.back()"
              class="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))"
            >
              취소
            </button>
            <button
              @click="submitReview"
              :disabled="submitting || reviewForm.rating === 0"
              class="px-6 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: rgb(var(--figma-color-6))"
            >
              {{ submitting ? '제출 중...' : (existingReview ? '리뷰 수정' : '리뷰 작성') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { curriculumApiService } from '@/services/curriculumApi';
import { reviewApiService } from '@/services/reviewApi';
import { StarRating, FormTextarea } from '@/components/common';
import type { CurriculumDetailResponse } from '@/types/curriculum';
import type { CreateReviewRequest, ReviewResponse } from '@/types/review';

const route = useRoute();
const router = useRouter();

// 상태 관리
const curriculum = ref<any>(null);
const existingReview = ref<ReviewResponse | null>(null);
const loading = ref(true);
const submitting = ref(false);
const error = ref<string | null>(null);
const ratingError = ref<string | null>(null);

// 리뷰 폼
const reviewForm = reactive({
  rating: 0,
  content: ''
});

// 커리큘럼 정보 로드
async function loadCurriculumDetail() {
  try {
    loading.value = true;
    error.value = null;

    const curriculumId = Number(route.params.id);
    const data: CurriculumDetailResponse = await curriculumApiService.getCurriculumById(curriculumId);

    curriculum.value = {
      ...data,
      instructor: data.author?.username || '알 수 없음',
      category: data.category || '미분류'
    };

    // 기존 리뷰 확인
    try {
      const myReview = await reviewApiService.getMyReview(curriculumId);
      if (myReview) {
        existingReview.value = myReview;
        reviewForm.rating = myReview.rating;
        reviewForm.content = myReview.content || '';
      }
    } catch (err) {
      console.warn('기존 리뷰 조회 실패:', err);
    }

  } catch (err) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '커리큘럼 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 리뷰 제출
async function submitReview() {
  if (reviewForm.rating === 0) {
    ratingError.value = '별점을 선택해주세요.';
    return;
  }

  try {
    submitting.value = true;
    ratingError.value = null;

    const curriculumId = Number(route.params.id);
    
    if (existingReview.value) {
      // 기존 리뷰 수정
      await reviewApiService.updateReview(curriculumId, existingReview.value.id, {
        rating: reviewForm.rating,
        content: reviewForm.content.trim() || undefined
      });
    } else {
      // 새 리뷰 작성
      const request: CreateReviewRequest = {
        isReview: true,
        rating: reviewForm.rating,
        content: reviewForm.content.trim() || ''
      };
      await reviewApiService.createReview(curriculumId, request);
    }

    // 성공 후 커리큘럼 상세 페이지로 이동
    router.push({
      name: 'curriculum-detail',
      params: { id: curriculumId }
    });

  } catch (err: any) {
    console.error('리뷰 제출 실패:', err);
    error.value = err.response?.data?.message || '리뷰 제출 중 오류가 발생했습니다.';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadCurriculumDetail();
});
</script>
