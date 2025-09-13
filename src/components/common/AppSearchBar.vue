<template>
  <div class="relative" @keydown.escape="close">
    <form class="relative" @submit.prevent="onSubmit">
      <input
        type="search"
        class="w-full h-10 rounded-md border border-gray-300 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="검색..."
        v-model="query"
        @focus="open"
      />
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
      </span>
      <button v-if="query" type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" @click="clear" aria-label="clear">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </form>

    <div v-if="openDropdown" class="absolute z-40 mt-1 w-full rounded-md border bg-white shadow">
      <template v-if="query.trim()">
        <div v-if="suggestions.length === 0" class="px-3 py-2 text-sm text-muted">결과 없음</div>
        <button
          v-for="s in suggestions"
          :key="s.type + s.value"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          @mousedown.prevent="applySuggestion(s.value)"
        >
          <span class="text-gray-400">{{ s.type }}</span>
          <span>{{ s.value }}</span>
        </button>
      </template>
      <template v-else>
        <div class="px-3 py-2 text-xs text-muted">최근 검색</div>
        <div v-if="recent.length === 0" class="px-3 pb-2 text-sm text-muted">기록 없음</div>
        <div v-else class="pb-2">
          <button
            v-for="r in recent"
            :key="r"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            @mousedown.prevent="applySuggestion(r)"
          >{{ r }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useSearchStore } from '../../stores/search';

const emit = defineEmits<{ (e: 'submit', query: string): void; (e: 'update:modelValue', value: string): void }>();
const props = defineProps<{ modelValue?: string }>();
const search = useSearchStore();

const query = ref(props.modelValue ?? '');
watch(query, (v) => emit('update:modelValue', v));

const openDropdown = ref(false);
function open() { openDropdown.value = true; }
function close() { openDropdown.value = false; }

const suggestions = computed(() => search.getSuggestions(query.value));
const recent = computed(() => search.recentQueries);

function applySuggestion(v: string) {
  query.value = v;
  onSubmit();
}
function clear() {
  query.value = '';
}
function onSubmit() {
  const q = query.value.trim();
  if (q) search.addRecent(q);
  emit('submit', query.value);
  close();
}
</script>
