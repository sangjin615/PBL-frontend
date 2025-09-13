<template>
  <header class="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
    <div class="flex items-center gap-3">
      <button class="p-2 rounded hover:bg-gray-100" @click="toggleSidebar" aria-label="Toggle sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <h1 class="font-semibold">App Header</h1>
    </div>

    <div class="w-full max-w-xl mx-6">
      <AppSearchBar v-model="search" @submit="onSearchSubmit" />
    </div>

    <div class="flex items-center gap-3">
      <button
        class="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-white hover:opacity-90 transition-colors"
        @click="onCreateClick"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"/></svg>
        <span>만들기</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '../../stores/ui';
import AppSearchBar from '../common/AppSearchBar.vue';

const ui = useUiStore();
const search = computed({
  get: () => ui.searchQuery,
  set: (v: string) => ui.setSearchQuery(v),
});

function toggleSidebar() {
  ui.toggleSidebar();
}

function onSearchSubmit(q: string) {
  console.log('search submit:', q);
}

function onCreateClick() {
  // TODO: route to create page or open modal
  console.log('create click');
}
</script>
