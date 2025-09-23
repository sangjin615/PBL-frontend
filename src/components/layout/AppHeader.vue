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
      <div class="relative">
        <button
          class="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-primary text-white hover:opacity-90 transition-colors"
          @click="toggleCreateMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"/></svg>
          <span>만들기</span>
        </button>
        
        <!-- 드롭다운 메뉴 -->
        <div 
          v-if="showCreateMenu"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <button 
            @click="createCourse"
            class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            강의 만들기
          </button>
          <button 
            @click="createCurriculum"
            class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            커리큘럼 만들기
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUiStore } from '../../stores/ui';
import AppSearchBar from '../common/AppSearchBar.vue';

const router = useRouter();
const ui = useUiStore();
const showCreateMenu = ref(false);

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

function toggleCreateMenu() {
  showCreateMenu.value = !showCreateMenu.value;
}

function createCourse() {
  showCreateMenu.value = false;
  router.push({ name: 'instructor-create-course' });
}

function createCurriculum() {
  showCreateMenu.value = false;
  // 커리큘럼 만들기 페이지는 아직 구현되지 않음
  alert('커리큘럼 만들기 기능은 구현 예정입니다.');
}

// 드롭다운 메뉴 외부 클릭 시 닫기
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showCreateMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
