import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { courses } from '../mock/courses';
import type { Course } from '../types/course';

const RECENT_KEY = 'recent_queries_v1';

export type Suggestion = { type: 'title' | 'instructor' | 'tag'; value: string };

export const useSearchStore = defineStore('search', () => {
  const recentQueries = ref<string[]>(loadRecents());

  function loadRecents(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }
  function persist() {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentQueries.value.slice(0, 10)));
    } catch {}
  }

  function addRecent(query: string) {
    const q = query.trim();
    if (!q) return;
    const without = recentQueries.value.filter((x) => x.toLowerCase() !== q.toLowerCase());
    recentQueries.value = [q, ...without].slice(0, 10);
    persist();
  }
  function clearRecents() {
    recentQueries.value = [];
    persist();
  }

  function getSuggestions(query: string): Suggestion[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const set = new Set<string>();
    const out: Suggestion[] = [];
    for (const c of courses) {
      if (c.title.toLowerCase().includes(q) && !set.has(c.title)) {
        set.add(c.title);
        out.push({ type: 'title', value: c.title });
      }
      if (c.instructor.toLowerCase().includes(q) && !set.has(c.instructor)) {
        set.add(c.instructor);
        out.push({ type: 'instructor', value: c.instructor });
      }
      for (const t of c.tags ?? []) {
        if (t.toLowerCase().includes(q) && !set.has(t)) {
          set.add(t);
          out.push({ type: 'tag', value: t });
        }
      }
      if (out.length >= 8) break;
    }
    return out.slice(0, 8);
  }

  function searchCourses(query: string): Course[] {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true;
      if (c.instructor.toLowerCase().includes(q)) return true;
      if ((c.tags ?? []).some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  const allCategories = computed(() => [
    '전체',
    '개발·프로그래밍',
    '게임 개발',
    '웹',
    '인공지능',
    '하드웨어',
    '알고리즘',
    '대학(원) 교육',
  ]);

  return { recentQueries, addRecent, clearRecents, getSuggestions, searchCourses, allCategories };
});
