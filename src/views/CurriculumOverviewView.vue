<template>
  <div class="min-h-screen bg-figma-7">
    <!-- 브레드크럼 -->
    <div class="px-6 py-4">
      <nav class="text-sm text-gray-600">
        <span>전체</span>
        <span class="mx-2">></span>
        <span>{{ curriculum?.category || '프로그램/모바일 앱 개발' }}</span>
      </nav>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-gray-600">데이터를 불러오는 중...</div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex justify-center items-center py-12">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div v-else class="px-6 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 왼쪽: 메인 컨텐츠 -->
        <div class="lg:col-span-2">
          <!-- 강의 제목 및 기본 정보 -->
          <div v-if="curriculum" class="bg-figma-1 rounded-lg border p-6 mb-6" style="border-color: rgb(var(--figma-color-4))">
            <h1 class="text-2xl font-bold mb-4" style="color: rgb(var(--figma-color-2))">
              {{ curriculum.title }}
            </h1>
            
            <p class="text-gray-600 mb-4 leading-relaxed">
              {{ curriculum.description }}
            </p>
            
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div v-if="curriculum.rating && curriculum.rating > 0" class="flex text-yellow-400">
                  <svg v-for="i in Math.floor(curriculum.rating)" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <div v-else class="flex text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                  {{ curriculum.rating && curriculum.rating > 0 ? curriculum.rating + '점' : 'API 연결안됨' }}
                </span>
              </div>
              <span v-if="curriculum.instructor" class="text-sm" style="color: rgb(var(--figma-color-5))">{{ curriculum.instructor }}</span>
            </div>
          </div>

          <!-- 강의 썸네일 -->
          <div 
            class="h-64 rounded-lg mb-6 flex items-center justify-center text-6xl font-bold text-gray-400"
            style="background-color: rgb(var(--figma-color-4))"
          >
            ✕
          </div>

          <!-- 탭 네비게이션 -->
          <div class="bg-figma-1 rounded-lg border mb-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex border-b" style="border-color: rgb(var(--figma-color-4))">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-medium transition-colors relative"
                :class="activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'"
              >
                {{ tab.name }}
                <div 
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                ></div>
              </button>
            </div>
            
            <!-- 탭 컨텐츠 -->
            <div class="p-6">
              <!-- 강의 소개 탭 -->
              <div v-if="activeTab === 'intro'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">강의 소개</h3>
                
                <!-- 강의 소개 썸네일 -->
                <div 
                  class="h-48 rounded-lg mb-6 flex items-center justify-center text-4xl font-bold text-gray-400"
                  style="background-color: rgb(var(--figma-color-4))"
                >
                  ✕
                </div>

                <!-- 이런 걸 배울 수 있어요 -->
                <div class="mb-8">
                  <h4 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">이런 걸 배울 수 있어요</h4>
                  <ul class="space-y-2">
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">빅데이터를 이용해서 특정 데이터를 추출하는 방법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">파이썬 기본 문법과 활용법</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: rgb(var(--figma-color-6))" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">그래프 활용법</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 커리큘럼 탭 -->
              <div v-else-if="activeTab === 'curriculum'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">커리큘럼</h3>
                
                <div v-if="lectures.length > 0" class="space-y-4">
                  <!-- API에서 받은 강의 목록을 챕터로 그룹화 -->
                  <div 
                    v-for="(chapter, chapterIndex) in groupedLectures" 
                    :key="chapterIndex"
                    class="border rounded-lg" 
                    style="border-color: rgb(var(--figma-color-4))"
                  >
                    <button 
                      @click="toggleChapter(chapterIndex)"
                      class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center space-x-3">
                        <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">
                          {{ chapter.isExpanded ? '∨' : '∧' }} {{ chapter.title }}
                        </span>
                        <span class="text-sm" style="color: rgb(var(--figma-color-5))">{{ chapter.lectures.length }}개 레슨</span>
                      </div>
                    </button>
                    
                    <div v-if="chapter.isExpanded" class="px-4 pb-4 border-t" style="border-color: rgb(var(--figma-color-4))">
                      <div class="pt-4 space-y-3">
                        <div 
                          v-for="(lecture, lectureIndex) in chapter.lectures" 
                          :key="lecture.lectureId"
                          class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          @click="goToLecture(lecture.lectureId)"
                        >
                          <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white" style="background-color: rgb(var(--figma-color-6))">
                            {{ lecture.orderIndex }}
                          </div>
                          <div class="flex-1">
                            <span class="text-sm" style="color: rgb(var(--figma-color-2))">{{ lecture.lectureTitle }}</span>
                            <span v-if="lecture.isRequired" class="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded">필수</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">커리큘럼 정보를 불러오는 중...</p>
                </div>
              </div>

              <!-- 질문&답변 탭 -->
              <div v-else-if="activeTab === 'qa'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">질문&답변</h3>
                <p class="text-gray-600">질문이 아직 없습니다.</p>
              </div>

              <!-- 나의 학습 탭 -->
              <div v-else-if="activeTab === 'learning'">
                <h3 class="text-lg font-semibold mb-4" style="color: rgb(var(--figma-color-2))">나의 학습</h3>
                <p class="text-gray-600">학습 기록이 없습니다.</p>
              </div>
            </div>
          </div>

          <!-- 수강평 섹션 -->
          <div class="bg-figma-1 rounded-lg border p-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold" style="color: rgb(var(--figma-color-2))">수강평</h3>
              <div class="flex items-center space-x-2">
                <div class="flex text-yellow-400">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span class="text-2xl font-bold" style="color: rgb(var(--figma-color-2))">4.9</span>
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">999+개의 수강평</span>
              </div>
            </div>

            <!-- 리뷰 그리드 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="review in hardcodedData.reviews" 
                :key="review.id"
                class="p-4 border rounded-lg" 
                style="border-color: rgb(var(--figma-color-4))"
              >
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ review.name }}</span>
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">5.0</span>
                </div>
                <p class="text-sm text-gray-600">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 사이드바 -->
        <div class="space-y-6">
          <!-- 수강신청 카드 -->
          <div class="bg-figma-1 rounded-lg border p-6 sticky top-6" style="border-color: rgb(var(--figma-color-4))">
            <div class="space-y-4">
              <button 
                @click="enrollCurriculum"
                :disabled="isEnrolling"
                class="w-full px-4 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50" 
                style="background-color: rgb(var(--figma-color-6))"
              >
                {{ isEnrolling ? '처리 중...' : '수강신청하기' }}
              </button>
              
              <button 
                class="w-full px-4 py-3 border rounded-lg font-medium hover:bg-gray-50 transition-colors" 
                style="border-color: rgb(var(--figma-color-4)); color: rgb(var(--figma-color-2))"
              >
                장바구니 담기
              </button>
            </div>
            
            <div v-if="curriculum" class="mt-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">지식공유자</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.instructor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">카테고리</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ curriculum.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">강의 시간</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ hardcodedData.totalDuration }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">난이도</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ hardcodedData.difficulty }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm" style="color: rgb(var(--figma-color-5))">수강생 수</span>
                <span class="text-sm font-medium" style="color: rgb(var(--figma-color-2))">{{ enrollmentCount }}명</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { curriculumApiService } from '@/services/curriculumApi';
import { enrollmentApiService } from '@/services/enrollmentApi';
import type { CurriculumDetailResponse, CurriculumLectureResponse } from '@/types/curriculum';

const router = useRouter();
const route = useRoute();

// 상태 관리
const curriculum = ref<any>(null);
const lectures = ref<CurriculumLectureResponse[]>([]);
const enrollmentCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const isEnrolling = ref(false);

// 탭 상태
const activeTab = ref('intro');

// 챕터 상태
const expandedChapters = ref<Set<number>>(new Set([0])); // 첫 번째 챕터는 기본적으로 열림

// 탭 옵션
const tabs = ref([
  { id: 'intro', name: '강의 소개' },
  { id: 'curriculum', name: '커리큘럼' },
  { id: 'qa', name: '질문&답변' },
  { id: 'learning', name: '나의 학습' }
]);

// 하드코딩된 데이터 (백엔드 미구현 항목)
const hardcodedData = {
  rating: -99,
  totalDuration: 'API 연결없음(기본값 = "24시간")',
  difficulty: 'API 연결없음(기본값 = "초급")',
  reviews: [
    {
      id: -99,
      name: 'API 연결없음(기본값 = "김준성")',
      content: 'API 연결없음(기본값 = "예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ")'
    },
    {
      id: -99,
      name: 'API 연결없음(기본값 = "김준성")',
      content: 'API 연결없음(기본값 = "예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ")'
    },
    {
      id: -99,
      name: 'API 연결없음(기본값 = "김준성")',
      content: 'API 연결없음(기본값 = "예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ")'
    },
    {
      id: -99,
      name: 'API 연결없음(기본값 = "김준성")',
      content: 'API 연결없음(기본값 = "예전에 배운 강의는 정말 유익했어요... 님 교수님의 좋아요... ㅠㅠㅠ")'
    }
  ]
};

// 강의를 챕터별로 그룹화 (5개씩)
const groupedLectures = computed(() => {
  const groups = [];
  const lecturesPerChapter = 5;
  
  for (let i = 0; i < lectures.value.length; i += lecturesPerChapter) {
    const chapterLectures = lectures.value.slice(i, i + lecturesPerChapter);
    groups.push({
      title: `챕터 ${Math.floor(i / lecturesPerChapter) + 1}. ${getChapterTitle(Math.floor(i / lecturesPerChapter))}`,
      lectures: chapterLectures,
      isExpanded: expandedChapters.value.has(Math.floor(i / lecturesPerChapter))
    });
  }
  
  return groups;
});

// 챕터 제목 생성
function getChapterTitle(chapterIndex: number): string {
  const titles = ['기초 개념', '핵심 이론', '실전 적용', '고급 기법', '프로젝트'];
  return titles[chapterIndex] || `추가 학습 ${chapterIndex + 1}`;
}

// 챕터 토글
function toggleChapter(chapterIndex: number) {
  if (expandedChapters.value.has(chapterIndex)) {
    expandedChapters.value.delete(chapterIndex);
  } else {
    expandedChapters.value.add(chapterIndex);
  }
}

// 커리큘럼 상세 정보 로드
async function loadCurriculumDetail() {
  try {
    loading.value = true;
    error.value = null;

    const curriculumId = Number(route.params.id);
    const data: CurriculumDetailResponse = await curriculumApiService.getCurriculumById(curriculumId);

    curriculum.value = {
      id: data.id,
      title: data.title,
      description: data.description,
      instructor: data.author?.username || '알 수 없음',
      category: extractCategory(data.title),
      rating: hardcodedData.rating
    };

    lectures.value = (data.lectures || []).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // 수강자 수 조회
    try {
      const countData = await enrollmentApiService.getCurriculumEnrollmentCount(curriculumId);
      enrollmentCount.value = countData.enrollmentCount;
    } catch (err) {
      console.warn('수강자 수 조회 실패:', err);
      enrollmentCount.value = 0;
    }

  } catch (err) {
    console.error('커리큘럼 로드 실패:', err);
    error.value = '커리큘럼 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 카테고리 추출
function extractCategory(title: string): string {
  const text = title.toLowerCase();
  if (text.includes('algorithm')) return '알고리즘';
  if (text.includes('web') || text.includes('html')) return '웹';
  if (text.includes('python')) return 'Python';
  if (text.includes('unity') || text.includes('game')) return '게임 개발';
  if (text.includes('sql') || text.includes('database')) return '데이터베이스';
  if (text.includes('ai') || text.includes('인공지능')) return '인공지능';
  return '개발·프로그래밍';
}

// 수강 신청
async function enrollCurriculum() {
  if (!curriculum.value) return;

  try {
    isEnrolling.value = true;
    await enrollmentApiService.enrollCurriculum(curriculum.value.id);
    alert('수강 신청이 완료되었습니다!');
    router.push({ name: 'curriculum-detail', params: { id: curriculum.value.id } });
  } catch (err: any) {
    console.error('수강 신청 실패:', err);
    alert(err.message || '수강 신청에 실패했습니다.');
  } finally {
    isEnrolling.value = false;
  }
}

// 강의로 이동
function goToLecture(lectureId: number) {
  router.push({ name: 'lecture', params: { lectureId } });
}

onMounted(() => {
  loadCurriculumDetail();
});
</script>