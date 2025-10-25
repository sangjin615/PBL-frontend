<template>
  <div class="flex items-center space-x-1">
    <button
      v-for="star in 5"
      :key="star"
      @click="handleStarClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
      class="transition-colors duration-150 focus:outline-none"
      :class="star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'"
    >
      <svg
        class="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>
    
    <!-- 별점 텍스트 표시 -->
    <span v-if="showText" class="ml-2 text-sm font-medium text-gray-600">
      {{ ratingText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  rating: number;
  readonly?: boolean;
  showText?: boolean;
}

interface Emits {
  (e: 'update:rating', rating: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  rating: 0,
  readonly: false,
  showText: false
});

const emit = defineEmits<Emits>();

const hoverRating = ref(0);

const ratingText = computed(() => {
  const texts = ['', '매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];
  return texts[props.rating] || '';
});

function handleStarClick(star: number) {
  if (props.readonly) return;
  emit('update:rating', star);
}

function handleMouseEnter(star: number) {
  if (props.readonly) return;
  hoverRating.value = star;
}

function handleMouseLeave() {
  if (props.readonly) return;
  hoverRating.value = 0;
}
</script>
