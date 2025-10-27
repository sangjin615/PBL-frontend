<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">질문 작성</h1>
            <p class="text-sm text-gray-600">
              {{ curriculumId ? '커리큘럼 문의를 작성해보세요' : '자유롭게 질문을 작성해보세요' }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="saveDraft"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            임시저장
          </button>
          <button 
            @click="publishQuestion"
            :disabled="submitting || !isFormValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '등록 중...' : '질문 등록' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- 제목 입력 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            제목 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="질문의 제목을 입력하세요"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-300': titleError }"
          />
          <p v-if="titleError" class="text-red-500 text-sm mt-1">{{ titleError }}</p>
          <div class="text-right text-sm text-gray-500 mt-1">
            {{ form.title.length }}/100
          </div>
        </div>

        <!-- 카테고리 선택 (커리큘럼 문의가 아닐 때만 표시) -->
        <div v-if="!curriculumId" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            카테고리 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.category"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-300': categoryError }"
          >
            <option value="">카테고리를 선택하세요</option>
            <option value="general">일반</option>
            <option value="technical">기술</option>
            <option value="curriculum">커리큘럼</option>
            <option value="lecture">강의</option>
            <option value="other">기타</option>
          </select>
          <p v-if="categoryError" class="text-red-500 text-sm mt-1">{{ categoryError }}</p>
        </div>

        <!-- 내용 입력 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            내용 <span class="text-red-500">*</span>
          </label>
          <FormTextarea
            v-model="form.content"
            placeholder="질문의 내용을 자세히 작성해주세요..."
            :rows="12"
            :max-length="2000"
            :show-count="true"
          />
          <p v-if="contentError" class="text-red-500 text-sm mt-1">{{ contentError }}</p>
        </div>

        <!-- 이미지 첨부 (커리큘럼 문의가 아닐 때만 표시) -->
        <div v-if="!curriculumId" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            이미지 첨부 (선택사항)
          </label>
          <ImageUpload
            v-model:files="form.images"
            :max-files="3"
            :max-file-size="5"
          />
        </div>

        <!-- 공개 설정 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            공개 설정
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.isPublic"
                type="radio"
                :value="true"
                class="mr-2"
              />
              <span>공개 (모든 사용자가 볼 수 있음)</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.isPublic"
                type="radio"
                :value="false"
                class="mr-2"
              />
              <span>비공개 (관리자만 볼 수 있음)</span>
            </label>
          </div>
        </div>

        <!-- 작성 가이드 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-800 mb-2">작성 가이드</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• 구체적이고 명확한 질문을 작성해주세요</li>
            <li>• 관련 코드나 스크린샷이 있다면 함께 첨부해주세요</li>
            <li>• 욕설이나 비방성 내용은 금지됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FormTextarea, ImageUpload } from '@/components/common';

const router = useRouter();
const route = useRoute();

// curriculumId가 있으면 관련 정보 표시
const curriculumId = computed(() => route.query.curriculumId as string | undefined);

// 폼 데이터
const form = reactive({
  title: '',
  content: '',
  category: '',
  images: [] as File[],
  isPublic: true
});

// 페이지 로드 시 curriculumId가 있으면 카테고리를 curriculum으로 설정
onMounted(() => {
  if (curriculumId.value) {
    form.category = 'curriculum';
  }
});

// 상태 관리
const submitting = ref(false);

// 에러 메시지
const titleError = ref('');
const categoryError = ref('');
const contentError = ref('');

// 폼 유효성 검사
const isFormValid = computed(() => {
  return form.title.trim().length > 0 && 
         (curriculumId.value || form.category.length > 0) && 
         form.content.trim().length > 0 &&
         form.title.length <= 100 &&
         form.content.length <= 2000;
});

// 폼 유효성 검사
function validateForm() {
  titleError.value = '';
  categoryError.value = '';
  contentError.value = '';

  if (!form.title.trim()) {
    titleError.value = '제목을 입력해주세요.';
    return false;
  }
  if (form.title.length > 100) {
    titleError.value = '제목은 100자 이하로 입력해주세요.';
    return false;
  }
  // 커리큘럼 문의가 아닐 때만 카테고리 검사
  if (!curriculumId.value && !form.category) {
    categoryError.value = '카테고리를 선택해주세요.';
    return false;
  }
  if (!form.content.trim()) {
    contentError.value = '내용을 입력해주세요.';
    return false;
  }
  if (form.content.length > 2000) {
    contentError.value = '내용은 2000자 이하로 입력해주세요.';
    return false;
  }

  return true;
}

// 질문 등록
async function publishQuestion() {
  if (!validateForm()) return;

  try {
    submitting.value = true;
    
    // TODO: 실제 API 호출
    console.log('질문 등록:', {
      ...form,
      imageCount: form.images.length
    });
    
    // 임시로 성공 처리
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('질문이 성공적으로 등록되었습니다!');
    router.push('/qna');
    
  } catch (error) {
    console.error('질문 등록 실패:', error);
    alert('질문 등록 중 오류가 발생했습니다.');
  } finally {
    submitting.value = false;
  }
}

// 임시저장
function saveDraft() {
  // TODO: 임시저장 API 호출
  console.log('임시저장:', {
    ...form,
    imageCount: form.images.length
  });
  alert('임시저장되었습니다.');
}

// 뒤로가기
function goBack() {
  router.back();
}
</script>
