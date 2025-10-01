/**
 * Lectures Pinia Store
 * 강의 데이터 상태 관리 및 API 호출 로직
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Lecture,
  CreateLectureRequest,
  LectureSearchParams,
  LectureStats,
  LectureType,
  DashboardItem,
} from "@/types/lecture";
import { lectureApiService } from "@/services/lectureApi";

export const useLecturesStore = defineStore("lectures", () => {
  // === 상태 ===
  const lectures = ref<Lecture[]>([]);
  const currentLecture = ref<Lecture | null>(null);
  const stats = ref<LectureStats | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // === Computed ===

  /**
   * 마크다운 강의만 필터링
   */
  const markdownLectures = computed(() =>
    lectures.value.filter((lecture) => lecture.type === "MARKDOWN")
  );

  /**
   * 문제 강의만 필터링
   */
  const problemLectures = computed(() =>
    lectures.value.filter((lecture) => lecture.type === "PROBLEM")
  );

  /**
   * 카테고리별 강의 그룹화
   */
  const lecturesByCategory = computed(() => {
    const grouped: Record<string, Lecture[]> = {};
    lectures.value.forEach((lecture) => {
      const category = lecture.category || "기타";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(lecture);
    });
    return grouped;
  });

  /**
   * DashboardView에서 사용할 형태로 변환된 아이템들
   */
  const dashboardItems = computed((): DashboardItem[] => {
    return lectures.value.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      createdDate: formatDateFromArray(lecture.createdAt),
      privacy: "공개", // API에 privacy 필드가 없으므로 기본값
      thumbnailColor: getThumbnailColor(lecture.type, lecture.category),
      type: "lecture", // DashboardView 호환성을 위해
      duration: getDurationFromType(lecture.type),
      tags: generateTags(lecture),
      format: lecture.type === "PROBLEM" ? "문제" : "마크다운",
      lectureType: lecture.type,
      category: lecture.category,
      difficulty: lecture.difficulty,
      testCaseCount: lecture.testCaseCount,
    }));
  });

  /**
   * 최근 생성된 강의들 (최신 10개)
   */
  const recentLectures = computed(() =>
    [...lectures.value]
      .sort((a, b) => {
        // 배열 형태 날짜를 Date 객체로 변환하여 비교
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
   * 모든 강의 조회
   */
  async function fetchAllLectures(): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await lectureApiService.getAllLectures();
      lectures.value = data;
      return data;
    }, "강의 목록을 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 강의 상세 조회
   */
  async function fetchLecture(id: number): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await lectureApiService.getLecture(id);
      currentLecture.value = data;

      // 전체 목록에도 업데이트
      const index = lectures.value.findIndex((lecture) => lecture.id === id);
      if (index !== -1) {
        lectures.value[index] = data;
      }

      return data;
    }, "강의 정보를 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 강의 생성
   */
  async function createLecture(
    lectureData: CreateLectureRequest
  ): Promise<Lecture | null> {
    const result = await withErrorHandling(async () => {
      const newLecture = await lectureApiService.createLecture(lectureData);
      lectures.value.unshift(newLecture); // 맨 앞에 추가
      return newLecture;
    }, "강의 생성에 실패했습니다.");
    return result;
  }

  /**
   * 강의 수정
   */
  async function updateLecture(
    id: number,
    lectureData: CreateLectureRequest
  ): Promise<Lecture | null> {
    const result = await withErrorHandling(async () => {
      const updatedLecture = await lectureApiService.updateLecture(
        id,
        lectureData
      );

      // 목록에서 업데이트
      const index = lectures.value.findIndex((lecture) => lecture.id === id);
      if (index !== -1) {
        lectures.value[index] = updatedLecture;
      }

      // 현재 강의도 업데이트
      if (currentLecture.value?.id === id) {
        currentLecture.value = updatedLecture;
      }

      return updatedLecture;
    }, "강의 수정에 실패했습니다.");
    return result;
  }

  /**
   * 강의 삭제
   */
  async function deleteLecture(id: number): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      await lectureApiService.deleteLecture(id);

      // 목록에서 제거
      lectures.value = lectures.value.filter((lecture) => lecture.id !== id);

      // 현재 강의가 삭제된 강의라면 초기화
      if (currentLecture.value?.id === id) {
        currentLecture.value = null;
      }

      return true;
    }, "강의 삭제에 실패했습니다.");
    return result !== null;
  }

  /**
   * 강의 검색
   */
  async function searchLectures(params: LectureSearchParams): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const response = await lectureApiService.searchLectures(params);
      lectures.value = response.lectures;
      return response;
    }, "강의 검색에 실패했습니다.");
    return result !== null;
  }

  /**
   * 통계 조회
   */
  async function fetchStats(): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await lectureApiService.getLectureStats();
      stats.value = data;
      return data;
    }, "통계 정보를 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 최근 강의 조회
   */
  async function fetchRecentLectures(): Promise<boolean> {
    const result = await withErrorHandling(async () => {
      const data = await lectureApiService.getRecentLectures();
      lectures.value = data;
      return data;
    }, "최근 강의를 불러오는데 실패했습니다.");
    return result !== null;
  }

  /**
   * 에러 초기화
   */
  function clearError(): void {
    error.value = null;
  }

  /**
   * 현재 강의 초기화
   */
  function clearCurrentLecture(): void {
    currentLecture.value = null;
  }

  // === 유틸리티 함수 ===

  /**
   * 백엔드 배열 형태 날짜를 문자열로 변환
   * [2025, 9, 29, 7, 39, 46, 757741000] -> "2025.9.29"
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
   * 강의 타입과 카테고리에 따른 썸네일 색상 생성
   */
  function getThumbnailColor(type: LectureType, category?: string): string {
    if (type === "PROBLEM") {
      return "#E3F2FD"; // 파란색 계열
    }

    // 카테고리별 색상 매핑
    const categoryColors: Record<string, string> = {
      알고리즘: "#FFE4E1",
      웹: "#E8F5E8",
      데이터베이스: "#FFF8DC",
      인공지능: "#E0FFFF",
      "게임 개발": "#F0E68C",
      "개발·프로그래밍": "#DDA0DD",
    };

    return categoryColors[category || ""] || "#F5F5F5";
  }

  /**
   * 강의 타입에 따른 예상 소요시간 생성
   */
  function getDurationFromType(type: LectureType): string {
    return type === "PROBLEM" ? "30분" : "45분";
  }

  /**
   * 강의 정보로부터 태그 생성
   */
  function generateTags(lecture: Lecture): string[] {
    const tags: string[] = [];

    if (lecture.category) {
      tags.push(`#${lecture.category}`);
    }

    if (lecture.difficulty) {
      tags.push(`#${lecture.difficulty}`);
    }

    if (lecture.type === "PROBLEM" && lecture.testCaseCount > 0) {
      tags.push(`#테스트케이스${lecture.testCaseCount}개`);
    }

    return tags;
  }

  return {
    // State
    lectures,
    currentLecture,
    stats,
    loading,
    error,

    // Computed
    markdownLectures,
    problemLectures,
    lecturesByCategory,
    dashboardItems,
    recentLectures,

    // Actions
    fetchAllLectures,
    fetchLecture,
    createLecture,
    updateLecture,
    deleteLecture,
    searchLectures,
    fetchStats,
    fetchRecentLectures,
    clearError,
    clearCurrentLecture,
  };
});
