<template>
  <div
    class="group relative rounded-lg border bg-white overflow-hidden hover:shadow transition-shadow cursor-pointer"
    @click="onClick"
  >
    <div class="aspect-video bg-gray-100 flex items-center justify-center">
      <div class="w-16 h-16 bg-gray-300 rounded" />
    </div>
    <div class="p-4 space-y-2">
      <div class="text-xs text-muted">{{ course.category }}</div>
      <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ course.title }}</h3>
      <div class="flex flex-wrap gap-1">
        <span v-for="t in course.tags?.slice(0, 3)" :key="t" class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">#{{ t }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-700">{{ course.instructor }}</span>
        <span class="flex items-center gap-1 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-500"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.21l8.2-1.192z"/></svg>
          {{ course.rating.toFixed(1) }}<span class="text-xs text-gray-500">({{ course.reviewsCount }})</span>
        </span>
      </div>
    </div>

    <div class="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col gap-3">
      <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ course.title }}</h3>
      <p class="text-sm text-gray-600 line-clamp-3">{{ course.description }}</p>
      <div class="text-sm text-gray-700">난이도: <strong>{{ course.difficulty ?? '정보 없음' }}</strong></div>
      <div class="mt-auto flex items-center justify-between">
        <button type="button" class="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50" @click.stop="toggleBookmark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" :class="bookmarked ? 'text-primary' : 'text-gray-500'"><path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z"/></svg>
          <span>{{ bookmarked ? '북마크 취소' : '북마크' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Course } from '../../types/course';
import { useRouter } from 'vue-router';

const props = defineProps<{ course: Course }>();
const router = useRouter();

const bookmarked = ref<boolean>(false);
const key = `bookmark_${props.course.id}`;

watchEffect(() => {
  try {
    bookmarked.value = localStorage.getItem(key) === '1';
  } catch {}
});

function toggleBookmark() {
  bookmarked.value = !bookmarked.value;
  try {
    if (bookmarked.value) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {}
}

function onClick() {
  router.push({ name: 'course-overview', params: { id: props.course.id } });
}
</script>
