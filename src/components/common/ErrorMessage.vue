<template>
  <div 
    v-if="message"
    class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
  >
    <div class="flex items-center">
      <svg
        class="w-5 h-5 text-red-600 mr-3 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div class="flex-1">
        <h3 v-if="title" class="text-red-800 font-medium text-sm">{{ title }}</h3>
        <p class="text-red-700 text-sm">{{ message }}</p>
      </div>
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="ml-auto px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  title?: string;
  showRetry?: boolean;
}

withDefaults(defineProps<Props>(), {
  showRetry: false
});

defineEmits<{
  retry: [];
}>();
</script>
