<template>
  <aside
    class="bg-white border-r border-gray-200 transition-all duration-200 fixed left-0 z-30 flex flex-col"
    :class="[
      isOpen ? 'w-64' : 'w-16',
      'top-0 h-screen'
    ]"
  >
    <div class="flex-1">
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
          class="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
          :class="isRouteActive(item.to) ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
        >
          <span class="w-5 h-5 inline-flex items-center justify-center shrink-0">
            <component :is="item.icon" class="w-5 h-5" />
          </span>
          <span v-if="isOpen">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- 마이페이지 및 로그아웃 버튼 (최하단) - 로그인된 사용자만 표시 -->
    <div v-if="isAuthenticated" class="border-t border-gray-100 p-2 space-y-1">
      <!-- 마이페이지 버튼 -->
      <RouterLink
        to="/mypage"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
        :class="isRouteActive('/mypage') ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
      >
        <span class="w-5 h-5 inline-flex items-center justify-center shrink-0">
          <component :is="IconUser" class="w-5 h-5" />
        </span>
        <span v-if="isOpen">마이페이지</span>
      </RouterLink>
      
      <!-- 로그아웃 버튼 -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700"
      >
        <span class="w-5 h-5 inline-flex items-center justify-center shrink-0">
          <component :is="IconLogout" class="w-5 h-5" />
        </span>
        <span v-if="isOpen">로그아웃</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useUiStore } from '../../stores/ui';
import { useAuth } from '../../composables/useAuth';

const ui = useUiStore();
const route = useRoute();
const { logout, isAuthenticated, isAdmin, currentUser } = useAuth();

const isOpen = computed(() => ui.isSidebarOpen);
const toggleSidebar = () => ui.toggleSidebar();

function isRouteActive(path: string): boolean {
  return route.path === path;
}

function handleLogout() {
  if (confirm('정말 로그아웃하시겠습니까?')) {
    logout();
  }
}

// 통일된 스타일의 아이콘 (Heroicons outline 기반 경로)
const IconHome = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 9.75L12 3l9 6.75V20a1.5 1.5 0 01-1.5 1.5H15a1.5 1.5 0 01-1.5-1.5v-3.75H10.5V20A1.5 1.5 0 019 21.5H4.5A1.5 1.5 0 013 20V9.75z'/></svg>" };
const IconBookmark = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.25 4.5A2.25 2.25 0 017.5 2.25h9a2.25 2.25 0 012.25 2.25V21l-6.75-3-6.75 3V4.5z'/></svg>" };
const IconApps = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4.5 4.5h6v6h-6v-6zm9 0h6v6h-6v-6zm-9 9h6v6h-6v-6zm9 0h6v6h-6v-6z'/></svg>" };
const IconChat = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M7.5 8.25h9m-9 3.75h6M3 12a9 9 0 1116.03 5.196L21 21 15.196 19.03A9 9 0 013 12z'/></svg>" };
const IconMenu = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16'/></svg>" };
const IconUser = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/></svg>" };
const IconLogout = { template: "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/></svg>" };

const items = computed(() => {
  const baseItems = [
    { key: 'home', label: '홈', to: '/', icon: IconHome },
    { key: 'courses', label: '수강 목록', to: '/courses', icon: IconBookmark },
    { key: 'dashboard', label: '내 대시보드', to: '/dashboard', icon: IconApps },
    { key: 'qna', label: '질문&답변', to: '/qna', icon: IconChat },
    { key: 'subs', label: '구독', to: '/subscriptions', icon: IconMenu },
  ];

  // 관리자만 신고 처리 메뉴 표시
  if (isAdmin.value) {
    baseItems.push({
      key: 'admin-reports',
      label: '신고 처리',
      to: '/admin/reports',
      icon: IconMenu
    });
  }

  return baseItems;
});
</script>
