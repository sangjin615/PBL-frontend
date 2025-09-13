<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader class="fixed top-0 left-0 right-0 z-20" />

    <AppSidebar />

    <div :class="contentClass">
      <main class="flex-1 pt-16">
        <router-view />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import { useUiStore } from './stores/ui';

const ui = useUiStore();

const contentClass = computed(() =>
  ui.isSidebarOpen
    ? 'transition-all duration-200 ease-in-out pl-64'
    : 'transition-all duration-200 ease-in-out pl-16'
);
</script>

<style scoped>
main {
  min-height: calc(100vh - 64px - 64px);
}
</style>
