/**
 * Curriculums Pinia Store
 * 커리큘럼 데이터 상태 관리 및 API 호출 로직
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  CurriculumResponse,
  CurriculumDetailResponse,
} from "@/types/curriculum";
import type { DashboardItem } from "@/types/lecture";
import { curriculumApiService } from "@/services/curriculumApi";
import { authConfig } from "@/config/api";

export const useCurriculumsStore = defineStore("curriculums", () => {
  // === 상태 ===
  const curriculums = ref<CurriculumResponse[]>([]);
  const currentCurriculum = ref<CurriculumDetailResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // === Computed ===

  /**
   * 공개 커리큘럼만 필터링
   */
  const publicCurriculums = computed(() =>
    curriculums.value.filter((curriculum) => curriculum.isPublic)
  );

  /**
   * 비공개 커리큘럼만 필터링
   */
  const privateCurriculums = computed(() =>
    curriculums.value.filter((curriculum) => !curriculum.isPublic)
  );

  /**
   * DashboardView에서 사용할 형태로 변환된 아이템들
   */
  const dashboardItems = computed((): DashboardItem[] => {
    return curriculums.value.map((curriculum) => ({
      id: curriculum.id,
      title: curriculum.title,
      createdDate: formatDateFromArray(curriculum.createdAt),
      privacy: curriculum.isPublic ? "공개" : "비공개",
      thumbnailColor: getThumbnailColor(curriculum.id),
      type: "curriculum",
      courseCount: curriculum.totalLectureCount,
      duration: getDurationFromCount(curriculum.totalLectureCount),
      tags: generateTags(curriculum),
    }));
  });

  /**
   * 최근 생성된 커리큘럼들 (최신 10개)
   */
  const recentCurriculums = computed(() =>
    [...curriculums.value]
      .sort((a, b) => {
        const dateA = Array.isArray(a.createdAt)
          ? new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2])
          : new Date(a.createdAt);
        const dateB = Array.isArray(b.createdAt)
          ? new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2])
          : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10)
  );

  // === Actions ===

  /**
   * 에러 처리를 위한 공통 래퍼
   */
  async function withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> {
    loading.value = true;
    error.value = null;

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      error.value = message;
      console.error(errorMessage, err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 모든 커리큘럼 조회
   */
  async function fetchAllCurriculums(): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await curriculumApiService.getAllCurriculums();
      curriculums.value = data;
      return data;
    }, "커리큘럼 목록을 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 사용자별 커리큘럼 조회
   */
  async function fetchUserCurriculums(userId?: number): Promise<boolean> {
    const targetUserId = userId || authConfig.defaultUserId;
    const result = await withErrorHandling(async () => {
      const data = await curriculumApiService.getUserCurriculums(targetUserId);
      curriculums.value = data;
      return data;
    }, "커리큘럼 목록을 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 공개 커리큘럼 조회
   */
  async function fetchPublicCurriculums(): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await curriculumApiService.getPublicCurriculums();
      curriculums.value = data;
      return data;
    }, "공개 커리큘럼 목록을 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 커리큘럼 상세 조회
   */
  async function fetchCurriculum(id: number): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await curriculumApiService.getCurriculumById(id);
      currentCurriculum.value = data;

      // 전체 목록에도 업데이트 (간단한 정보만)
      const index = curriculums.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        curriculums.value[index] = {
          id: data.id,
          title: data.title,
          description: data.description,
          isPublic: data.isPublic,
          totalLectureCount: data.totalLectureCount,
          requiredLectureCount: data.requiredLectureCount,
          optionalLectureCount: data.optionalLectureCount,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          author: data.author,
        };
      }

      return data;
    }, "커리큘럼 정보를 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 커리큘럼 검색
   */
  async function searchCurriculums(title: string): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await curriculumApiService.searchCurriculums(title);
      curriculums.value = data;
      return data;
    }, "커리큘럼 검색에 실패했습니다.");
    return result !== null;
  }

  /**
   * 에러 초기화
   */
  function clearError(): void {
    error.value = null;
  }

  /**
   * 현재 커리큘럼 초기화
   */
  function clearCurrentCurriculum(): void {
    currentCurriculum.value = null;
  }

  // === 유틸리티 함수 ===

  /**
   * 백엔드 배열 형태 날짜를 문자열로 변환
   * [2025, 9, 29] -> "2025.9.29"
   */
  function formatDateFromArray(dateArray: number[] | string): string {
    if (typeof dateArray === "string") {
      return new Date(dateArray).toLocaleDateString("ko-KR");
    }

    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return `${year}.${month}.${day}`;
    }

    return new Date().toLocaleDateString("ko-KR");
  }

  /**
   * 커리큘럼 ID에 따른 썸네일 색상 생성
   */
  function getThumbnailColor(id: number): string {
    const colors = [
      "#FFE4E1", // 연한 핑크
      "#FFE4B5", // 연한 오렌지
      "#E8F5E8", // 연한 녹색
      "#E3F2FD", // 연한 파랑
      "#F3E5F5", // 연한 보라
      "#FFF8DC", // 연한 노랑
      "#E0FFFF", // 연한 청록
      "#F0E68C", // 카키
    ];
    return colors[id % colors.length];
  }

  /**
   * 강의 수에 따른 예상 소요시간 생성
   */
  function getDurationFromCount(lectureCount: number): string {
    const estimatedHours = lectureCount * 4; // 강의당 평균 4시간 가정
    return `${estimatedHours}시간`;
  }

  /**
   * 커리큘럼 정보로부터 태그 생성
   */
  function generateTags(curriculum: CurriculumResponse): string[] {
    const tags: string[] = [];

    // 총 강의 수 태그
    if (curriculum.totalLectureCount > 0) {
      tags.push(`#${curriculum.totalLectureCount}개 강의`);
    }

    // 필수/선택 강의 정보
    if (curriculum.requiredLectureCount > 0) {
      tags.push(`#필수${curriculum.requiredLectureCount}`);
    }
    if (curriculum.optionalLectureCount > 0) {
      tags.push(`#선택${curriculum.optionalLectureCount}`);
    }

    // 작성자 태그 (있는 경우)
    if (curriculum.author?.username) {
      tags.push(`#${curriculum.author.username}`);
    }

    return tags;
  }

  return {
    // State
    curriculums,
    currentCurriculum,
    loading,
    error,

    // Computed
    publicCurriculums,
    privateCurriculums,
    dashboardItems,
    recentCurriculums,

    // Actions
    fetchAllCurriculums,
    fetchUserCurriculums,
    fetchPublicCurriculums,
    fetchCurriculum,
    searchCurriculums,
    clearError,
    clearCurrentCurriculum,
  };
});
