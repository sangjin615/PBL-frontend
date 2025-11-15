<template>
  <button
    @click="openReportModal"
    class="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
    :disabled="disabled"
  >
    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
    신고
  </button>

  <!-- 신고 모달 -->
  <ReportModal
    :is-open="isModalOpen"
    :report-type="reportType"
    :target-id="targetId"
    :target-title="targetTitle"
    @close="closeModal"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ReportModal from '../modal/ReportModal.vue';
import type { ReportType } from '../../types/report';

interface Props {
  reportType: ReportType;
  targetId: number;
  targetTitle?: string;
  disabled?: boolean;
}

interface Emits {
  (e: 'reported'): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

const emit = defineEmits<Emits>();

const isModalOpen = ref(false);

const openReportModal = () => {
  if (!props.disabled) {
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSuccess = () => {
  emit('reported');
};
</script>
