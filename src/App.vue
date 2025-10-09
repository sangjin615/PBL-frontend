<template>
  <div class="min-h-screen bg-background text-foreground">
    <AppHeader v-if="!isBareLayout" class="fixed top-0 left-0 right-0 z-20" />

    <AppSidebar v-if="!isBareLayout" />

    <div :class="containerClass">
      <main :class="mainClass">
        <router-view/>
      </main>
      <AppFooter v-if="!isBareLayout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import { useUiStore } from './stores/ui';

const ui = useUiStore();
const route = useRoute();

const isBareLayout = computed(() => route.name === 'editor-popout');

const containerClass = computed(() => {
  if (isBareLayout.value) return '';
  return ui.isSidebarOpen
    ? 'transition-all duration-200 ease-in-out pl-64'
    : 'transition-all duration-200 ease-in-out pl-16';
});

const mainClass = computed(() => (isBareLayout.value ? 'flex-1 pt-0' : 'flex-1 pt-16'));
</script>

<style scoped>
main {
  min-height: calc(100vh - 64px - 64px);
}
</style>
