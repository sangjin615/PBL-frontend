<template>
  <section class="px-6 py-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4 overflow-x-auto">
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-3 py-2 text-sm rounded-md border"
            :class="activeTab === cat ? 'bg-gray-100 border-gray-300' : 'border-transparent hover:bg-gray-50'"
            @click="setTab(cat)"
          >
            {{ cat }}
          </button>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <select v-model="sortBy" class="h-9 rounded-md border px-2">
            <option value="popular">인기순</option>
            <option value="latest">최신순</option>
            <option value="rating">평점순</option>
            <option value="reviews">리뷰순</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CourseCard v-for="c in visibleCourses" :key="c.id" :course="c" />
      </div>

      <div v-if="remainingCount > 0" class="flex justify-center mt-8">
        <button class="px-4 py-2 rounded-md border hover:bg-gray-50" @click="loadMore">더보기 ({{ remainingCount }})</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CourseCard from '../components/course/CourseCard.vue';
import { courses } from '../mock/courses';
import type { Course } from '../types/course';
import { useSearchStore } from '../stores/search';
import { useUiStore } from '../stores/ui';

const searchStore = useSearchStore();
const ui = useUiStore();

const categories = searchStore.allCategories;
const activeTab = ref<string>('전체');
const sortBy = ref<'popular'|'latest'|'rating'|'reviews'>('popular');
const maxVisible = ref<number>(12);

function setTab(cat: string) {
  activeTab.value = cat;
}

const filteredByTab = computed<Course[]>(() => {
  const list = courses.slice();
  if (activeTab.value !== '전체') {
    return list.filter((c) => c.category === activeTab.value);
  }
  return list;
});

const filteredBySearch = computed<Course[]>(() => {
  return searchStore.searchCourses(ui.searchQuery).filter((c) => filteredByTab.value.includes(c));
});

const sortedCourses = computed<Course[]>(() => {
  const list = filteredBySearch.value.slice();
  switch (sortBy.value) {
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    case 'latest':
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      list.sort((a, b) => (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating));
  }
  return list;
});

const visibleCourses = computed<Course[]>(() => sortedCourses.value.slice(0, maxVisible.value));
const remainingCount = computed(() => Math.max(sortedCourses.value.length - maxVisible.value, 0));
function loadMore() {
  maxVisible.value += 12;
}
</script>
