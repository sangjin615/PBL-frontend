/**
 * useAuth Composable
 * 사용자 인증 및 정보 관리
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authConfig } from "@/config/api";

// 사용자 정보 타입
export interface User {
  id: number;
  username: string;
  loginId: string;
  subscribers?: string;
}

// 전역 상태로 사용자 정보 관리 (여러 컴포넌트에서 공유)
const currentUserState = ref<User | null>(null);

export function useAuth() {
  const router = useRouter();

  /**
   * 현재 로그인된 사용자 정보
   * 개발 단계에서는 기본 사용자 정보 반환
   */
  const currentUser = computed<User | null>(() => {
    // 이미 상태에 사용자가 있으면 반환
    if (currentUserState.value) {
      return currentUserState.value;
    }

    // 개발 환경: 기본 사용자 정보 사용
    if (authConfig.enabled === false) {
      return {
        id: authConfig.defaultUserId,
        username: "김준성",
        loginId: "junseong.kim",
        subscribers: "8.71천명",
      };
    }

    // 프로덕션: 실제 인증 토큰에서 사용자 정보 가져오기
    // TODO: 실제 JWT 토큰 파싱 또는 세션 스토리지에서 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        return null;
      }
    }

    return null;
  });

  /**
   * 사용자 로그인
   * @param loginId 로그인 아이디
   * @param password 비밀번호
   */
  async function login(loginId: string, password: string): Promise<boolean> {
    try {
      // TODO: 실제 로그인 API 호출
      // const response = await authApi.login(loginId, password);

      // 임시: 개발용 로그인 처리
      const user: User = {
        id: authConfig.defaultUserId,
        username: "김준성",
        loginId: loginId,
        subscribers: "8.71천명",
      };

      currentUserState.value = user;
      localStorage.setItem("user", JSON.stringify(user));

      console.log("로그인 성공:", user);
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  }

  /**
   * 사용자 로그아웃
   */
  function logout(): void {
    // 상태 초기화
    currentUserState.value = null;
    localStorage.removeItem("user");

    // 로그인 페이지로 리다이렉트
    // TODO: 실제 로그인 페이지 경로로 변경
    router.push({ name: "login" }).catch(() => {
      // 로그인 페이지가 없는 경우 홈으로
      router.push("/");
    });

    console.log("로그아웃 완료");
  }

  /**
   * 사용자 로그인 여부 확인
   */
  const isAuthenticated = computed(() => {
    return currentUser.value !== null;
  });

  /**
   * 현재 사용자 ID 가져오기
   */
  const userId = computed(() => {
    return currentUser.value?.id || authConfig.defaultUserId;
  });

  /**
   * 사용자 정보 수동 설정 (테스트용)
   */
  function setUser(user: User): void {
    currentUserState.value = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  return {
    currentUser,
    isAuthenticated,
    userId,
    login,
    logout,
    setUser,
  };
}
