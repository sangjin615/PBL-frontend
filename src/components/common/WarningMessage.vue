<template>
  <div 
    v-if="message"
    class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4"
  >
    <div class="flex items-center">
      <svg
        class="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        ></path>
      </svg>
      <div class="flex-1">
        <h3 v-if="title" class="text-yellow-800 font-medium text-sm">{{ title }}</h3>
        <p class="text-yellow-700 text-sm">{{ message }}</p>
      </div>
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="ml-auto px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
      >
        재시도
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
