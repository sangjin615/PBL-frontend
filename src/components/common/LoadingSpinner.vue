<template>
  <div class="flex justify-center items-center py-12">
    <div 
      class="animate-spin rounded-full border-b-2 border-blue-600"
      :class="sizeClasses"
    ></div>
    <span v-if="message" class="ml-3 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  message: ''
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-6 w-6';
    case 'lg':
      return 'h-16 w-16';
    default:
      return 'h-12 w-12';
  }
});
</script>
