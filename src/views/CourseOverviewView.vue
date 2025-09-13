<template>
  <section class="px-6 py-8">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-semibold mb-2">커리큘럼 개요</h2>
      <p class="text-muted">코스 ID: {{ id }}</p>
      <p class="mt-4">여기에 커리큘럼 설명/목차/문제 목록 등을 표시합니다.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id as string;
</script>
