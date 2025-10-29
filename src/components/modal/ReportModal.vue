<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" @click.stop>
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">신고하기</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 신고 내용 -->
      <div class="p-6">
        <!-- 성공 메시지 -->
        <div v-if="showSuccessMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-700 font-medium">신고가 정상적으로 접수되었습니다!</p>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-700 font-medium">{{ errorMessage }}</p>
          </div>
        </div>

        <div v-if="!showSuccessMessage">
          <!-- 신고 사유 선택 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              신고 사유 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="selectedReason"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">신고 사유를 선택해주세요</option>
              <option v-for="(label, reason) in REPORT_REASON_LABELS" :key="reason" :value="reason">
                {{ label }}
              </option>
            </select>
          </div>

          <!-- 상세 내용 (선택 사항) -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              상세 내용 (선택 사항)
            </label>
            <textarea
              v-model="reportContent"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="신고 사유를 구체적으로 작성해주세요..."
              maxlength="500"
            ></textarea>
            <div class="text-right text-sm text-gray-500 mt-1">
              {{ reportContent.length }}/500
            </div>
          </div>

          <!-- 신고 대상 정보 -->
          <div class="mb-4 p-3 bg-gray-50 rounded-md">
            <div class="text-sm text-gray-600">
              <span class="font-medium">신고 대상:</span> {{ getReportTargetText() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 영역 -->
      <div v-if="!showSuccessMessage" class="flex justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          :disabled="isSubmitting"
        >
          취소
        </button>
        <button
          @click="submitReport"
          class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedReason || isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            신고 중...
          </span>
          <span v-else>신고하기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { reportApiService } from '../../services/reportApi';
import {
  type ReportType,
  type ReportReason,
  mapReportTypeToTargetType,
  REPORT_REASON_LABELS,
  REPORT_TARGET_TYPE_LABELS
} from '../../types/report';

interface Props {
  isOpen: boolean;
  reportType: ReportType;
  targetId: number;
  targetTitle?: string;
}

interface Emits {
  (e: 'close'): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedReason = ref<ReportReason | ''>('');
const reportContent = ref('');
const isSubmitting = ref(false);
const showSuccessMessage = ref(false);
const errorMessage = ref('');

// 모달이 열릴 때마다 초기화
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    selectedReason.value = '';
    reportContent.value = '';
    showSuccessMessage.value = false;
    errorMessage.value = '';
  }
});

const getReportTargetText = () => {
  const targetType = mapReportTypeToTargetType(props.reportType);
  const typeText = REPORT_TARGET_TYPE_LABELS[targetType];
  return props.targetTitle ? `${typeText}: ${props.targetTitle}` : typeText;
};

const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close');
  }
};

const submitReport = async () => {
  if (!selectedReason.value) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const targetType = mapReportTypeToTargetType(props.reportType);

    await reportApiService.submitReport({
      targetType,
      targetId: props.targetId,
      reason: selectedReason.value as ReportReason,
      content: reportContent.value.trim() || undefined
    });

    // 성공 메시지 표시
    showSuccessMessage.value = true;

    // 1.5초 후 모달 닫기
    setTimeout(() => {
      emit('success');
      emit('close');
    }, 1500);

  } catch (error: any) {
    console.error('신고 접수 실패:', error);

    // 에러 메시지 표시
    if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = '신고 접수에 실패했습니다. 다시 시도해주세요.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>
