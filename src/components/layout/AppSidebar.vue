<template>
  <aside
    class="bg-white border-r border-gray-200 transition-all duration-200 fixed left-0 z-30"
    :class="[
      isOpen ? 'w-64' : 'w-16',
      'top-0 h-screen'
    ]"
  >
    <div>
      <div class="p-4 flex items-center gap-2 border-b border-gray-100">
        <button class="p-2 rounded hover:bg-gray-100" @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <span v-if="isOpen" class="font-semibold">메뉴</span>
      </div>

      <nav class="py-2">
        <RouterLink
          v-for="item in items"
          :key="item.key"
          :to="item.to"
          class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          :class="isRouteActive(item.to) ? 'bg-gray-100 text-foreground' : 'text-gray-700'"
        >
          <span class="w-5 h-5 inline-flex items-center justify-center">
            <component :is="item.icon" class="w-5 h-5" />
          </span>
          <span v-if="isOpen">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
const route = useRoute();

const isOpen = computed(() => ui.isSidebarOpen);
const toggleSidebar = () => ui.toggleSidebar();

function isRouteActive(path: string): boolean {
  return route.path === path;
}

const items = [
  { key: 'home', label: '홈', to: '/', icon: { template: '<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M3 12l9-7 9 7v7a2 2 0 01-2 2h-4a2 2 0 01-2-2V9\'/></svg>' } },
  { key: 'courses', label: '수강 목록', to: '/courses', icon: { template: '<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M5 5v14l7-3 7 3V5a2 2 0 00-2-2H7a2 2 0 00-2 2z\'/></svg>' } },
  { key: 'dashboard', label: '내 대시보드', to: '/dashboard', icon: { template: '<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z\'/></svg>' } },
  { key: 'qa', label: '질문&답변', to: '/qa', icon: { template: '<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M17 8h2a2 2 0 012 2v7l-4-2H7a2 2 0 01-2-2V6a2 2 0 012-2h6\'/></svg>' } },
  { key: 'subs', label: '구독', to: '/subscriptions', icon: { template: '<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M4 6h16M4 12h16M4 18h16\'/></svg>' } },
];
</script>
