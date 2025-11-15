<template>
  <div
    class="group relative rounded-lg border bg-white overflow-hidden hover:shadow transition-shadow cursor-pointer"
    @click="onClick"
  >
    <div class="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
      <img
        v-if="course.thumbnailImageUrl"
        :src="getImageUrl(course.thumbnailImageUrl)"
        :alt="course.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-16 h-16 bg-gray-300 rounded" />
    </div>
    <div class="p-4 space-y-2">
      <div class="flex items-center justify-between">
        <div class="text-xs text-muted">{{ course.category }}</div>
        <!-- 강의/커리큘럼 구분 라벨 -->
        <span 
          v-if="course.type === 'lecture'"
          class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"
        >
          강의
        </span>
        <span 
          v-else-if="course.type === 'curriculum'"
          class="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium"
        >
          커리큘럼
        </span>
      </div>
      <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ course.title }}</h3>
      <div class="flex flex-wrap gap-1">
        <span v-if="!course.tags || course.tags.length === 0" class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">태그 없음</span>
        <span v-else v-for="t in course.tags.slice(0, 3)" :key="t" class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">#{{ t }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-700">{{ course.instructor }}</span>
        <span class="flex items-center gap-1 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-500"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.21l8.2-1.192z"/></svg>
          {{ course.rating.toFixed(1) }}<span class="text-xs text-gray-500">({{ course.studentCount || 0 }})</span>
        </span>
      </div>
    </div>

    <div class="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col gap-3">
      <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ course.title }}</h3>
      <p class="text-sm text-gray-600 line-clamp-3">{{ course.description }}</p>
      <div class="text-sm text-gray-700">난이도: <strong>{{ course.difficulty ?? '정보 없음' }}</strong></div>
      <div class="mt-auto">
        <!-- 북마크 기능 (추후 사용 가능)
        <button type="button" class="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50" @click.stop="toggleBookmark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" :class="bookmarked ? 'text-primary' : 'text-gray-500'"><path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z"/></svg>
          <span>{{ bookmarked ? '북마크 취소' : '북마크' }}</span>
        </button>
        -->
        <button type="button" class="w-full inline-flex items-center justify-center gap-1 text-sm px-4 py-2 rounded-md bg-primary text-white hover:opacity-90" @click="onClick">
          <span>자세히 보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, watchEffect } from 'vue'; // 북마크 기능 사용 시 필요
import type { Course } from '../../types/course';
import { useRouter } from 'vue-router';
import { S3ApiService } from '@/services/s3Api';

const props = defineProps<{ course: Course }>();
const router = useRouter();

// 이미지 URL 생성 헬퍼
const getImageUrl = (path: string | null | undefined) => S3ApiService.getImageUrl(path);

// 북마크 기능 (추후 사용 가능)
// const bookmarked = ref<boolean>(false);
// const key = `bookmark_${props.course.id}`;
//
// watchEffect(() => {
//   try {
//     bookmarked.value = localStorage.getItem(key) === '1';
//   } catch {}
// });
//
// function toggleBookmark() {
//   bookmarked.value = !bookmarked.value;
//   try {
//     if (bookmarked.value) localStorage.setItem(key, '1');
//     else localStorage.removeItem(key);
//   } catch {}
// }

function onClick() {
  // 커리큘럼인지 강의인지 구분하여 라우팅
  if (props.course.type === 'curriculum') {
    // 커리큘럼은 커리큘럼 개요 페이지로
    // id가 문자열인 경우 숫자 부분만 추출
    let curriculumId = props.course.id;
    
    // 문자열이면 숫자 부분만 추출
    if (typeof curriculumId === 'string') {
      // 숫자만 있는 경우
      const numericMatch = curriculumId.match(/^\d+$/);
      if (numericMatch) {
        curriculumId = numericMatch[0];
      } else {
        // "curriculum-123" 같은 형식에서 숫자 추출
        const match = curriculumId.match(/(\d+)$/);
        if (match) {
          curriculumId = match[1];
        } else {
          console.error('[CourseCard] 커리큘럼 ID 파싱 실패:', curriculumId);
          return;
        }
      }
    }
    
    router.push({ name: 'curriculum-overview', params: { id: String(curriculumId) } });
  } else if (props.course.type === 'lecture' && props.course.lectureId) {
    // 강의는 강의 페이지로 직접 이동
    router.push({ 
      name: 'lecture', 
      params: { lectureId: String(props.course.lectureId) } 
    });
  } else if (props.course.type === 'lecture') {
    // lectureId가 없으면 id에서 추출 시도
    let lectureId: string | null = null;
    if (props.course.id) {
      const idStr = String(props.course.id);
      const match = idStr.match(/^lecture-(\d+)$/);
      if (match) {
        lectureId = match[1];
      } else if (/^\d+$/.test(idStr)) {
        lectureId = idStr;
      }
    }
    
    if (lectureId) {
      router.push({ 
        name: 'lecture', 
        params: { lectureId } 
      });
    } else {
      console.error('[CourseCard] 강의 ID 파싱 실패:', props.course);
    }
  } else {
    // 기타 (course 타입 등)는 course-overview로
    router.push({ name: 'course-overview', params: { id: String(props.course.id) } });
  }
}
</script>
