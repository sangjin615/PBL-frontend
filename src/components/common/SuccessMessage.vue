<template>
  <div 
    v-if="message"
    class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
  >
    <div class="flex items-center">
      <svg
        class="w-5 h-5 text-green-600 mr-3 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div class="flex-1">
        <h3 v-if="title" class="text-green-800 font-medium text-sm">{{ title }}</h3>
        <p class="text-green-700 text-sm">{{ message }}</p>
      </div>
      <button
        v-if="showClose"
        @click="$emit('close')"
        class="ml-auto px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  title?: string;
  showClose?: boolean;
}

withDefaults(defineProps<Props>(), {
  showClose: false
});

defineEmits<{
  close: [];
}>();
</script>
