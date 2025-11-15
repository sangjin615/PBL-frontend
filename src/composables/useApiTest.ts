/**
 * API 연결 테스트를 위한 컴포저블
 */

import { ref } from "vue";
import { lectureApiService } from "@/services/lectureApi";
import type { Lecture, LectureType } from "@/types/lecture";

export function useApiTest() {
  const testResults = ref<string[]>([]);
  const isLoading = ref(false);

  /**
   * API 연결 상태 테스트
   */
  async function testApiConnection(): Promise<boolean> {
    isLoading.value = true;
    testResults.value = [];

    try {
      // 1. 모든 강의 조회 테스트
      testResults.value.push("📡 API 연결 테스트 시작...");

      const lectures = await lectureApiService.getAllLectures();
      testResults.value.push(
        `✅ 강의 목록 조회 성공: ${lectures.length}개 강의`
      );

      // 2. 통계 조회 테스트
      const stats = await lectureApiService.getLectureStats();
      testResults.value.push(`✅ 통계 조회 성공: ${JSON.stringify(stats)}`);

      // 3. 기본 API 테스트 완료 (검색 API는 향후 구현 예정)
      testResults.value.push("📋 기본 API 연결 확인 완료");

      testResults.value.push("🎉 모든 API 테스트 통과!");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      testResults.value.push(`❌ API 테스트 실패: ${errorMessage}`);

      // 백엔드 서버가 실행되지 않은 경우의 안내
      if (errorMessage.includes("fetch")) {
        testResults.value.push(
          "💡 Spring Boot 서버가 실행되고 있는지 확인해주세요."
        );
        testResults.value.push("💡 서버 주소: http://localhost:2358/api");
      }

      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * 샘플 데이터 생성 테스트
   */
  async function createSampleLecture(): Promise<Lecture | null> {
    try {
      testResults.value.push("📝 샘플 강의 생성 중...");

      const sampleLecture = await lectureApiService.createLecture({
        title: `테스트 강의 ${new Date().getTime()}`,
        description: "API 연결 테스트를 위한 샘플 강의입니다.",
        type: "MARKDOWN" as LectureType,
        category: "테스트",
        difficulty: "초급",
      });

      testResults.value.push(`✅ 샘플 강의 생성 성공: ID ${sampleLecture.id}`);
      return sampleLecture;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      testResults.value.push(`❌ 샘플 강의 생성 실패: ${errorMessage}`);
      return null;
    }
  }

  /**
   * 테스트 결과 초기화
   */
  function clearTestResults(): void {
    testResults.value = [];
  }

  return {
    testResults,
    isLoading,
    testApiConnection,
    createSampleLecture,
    clearTestResults,
  };
}
