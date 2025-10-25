/**
 * useAuth Composable
 * 사용자 인증 및 정보 관리
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authConfig } from "@/config/api";
import type { LoginResponse } from "@/types/user";

// 사용자 정보 타입
export interface User {
  id: number;
  username: string;
  loginId: string;
  subscribers?: string;
  role?: 'user' | 'admin'; // 사용자 역할 추가
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

    // 개발 환경: 기본 사용자 정보 사용 (로그아웃 상태가 아닐 때만)
    if (authConfig.enabled === false && !localStorage.getItem("loggedOut")) {
      return {
        id: authConfig.defaultUserId,
        username: "김준성",
        loginId: "junseong.kim",
        subscribers: "8.71천명",
        role: "user" as const, // 기본 사용자 역할
      };
    }

    return null;
  });

  /**
   * 사용자 로그인
   * @param loginResponse 서버 로그인 응답 또는 로그인 아이디 (개발용)
   * @param password 비밀번호 (개발용 - 사용 안 함)
   */
  async function login(loginResponse: LoginResponse | string, password?: string): Promise<boolean> {
    try {
      console.log("=== 로그인 함수 호출 ===");
      console.log("authConfig.enabled:", authConfig.enabled);
      console.log("loginResponse 타입:", typeof loginResponse);
      console.log("loginResponse 값:", loginResponse);

      let user: User;

      // authConfig.enabled가 true면 실제 서버 응답 사용
      if (authConfig.enabled && typeof loginResponse === 'object') {
        // 서버 응답이 {success, message, user} 구조인 경우
        const userData = loginResponse.user || loginResponse;

        user = {
          id: userData.id,
          username: userData.username,
          loginId: userData.loginId,
          subscribers: "0명", // 기본값
        };
        console.log("✅ 프로덕션 모드: 실제 사용자 정보 사용", user);
      }
      // authConfig.enabled가 false면 개발용 하드코딩
      else {
        const loginId = typeof loginResponse === 'string'
          ? loginResponse
          : loginResponse.user?.loginId;

        user = {
          id: authConfig.defaultUserId,
          username: loginId === 'admin' ? "관리자" : "김준성",
          loginId: loginId,
          subscribers: loginId === 'admin' ? "관리자" : "8.71천명",
          role: loginId === 'admin' ? 'admin' : 'user',
        };
        console.log("⚠️ 개발 모드: 하드코딩된 사용자 정보 사용", user);
      }

      currentUserState.value = user;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("💾 localStorage에 저장:", localStorage.getItem("user"));

      // 로그아웃 상태 플래그 제거
      localStorage.removeItem("loggedOut");

      console.log("✅ 로그인 성공:", user);
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
    // 로그아웃 상태 플래그 설정 (개발 환경에서 새로고침 시 로그인 상태 유지 방지)
    localStorage.setItem("loggedOut", "true");

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
    return currentUser.value?.id || null;
  });

  /**
   * 관리자 권한 확인
   */
  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin';
  });

  /**
   * 사용자 정보 수동 설정 (테스트용)
   */
  function setUser(user: User): void {
    currentUserState.value = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * 관리자 계정으로 전환 (테스트용)
   */
  function switchToAdmin(): void {
    const adminUser: User = {
      id: 999,
      username: "관리자",
      loginId: "admin",
      subscribers: "관리자",
      role: "admin"
    };
    setUser(adminUser);
  }

  /**
   * 일반 사용자 계정으로 전환 (테스트용)
   */
  function switchToUser(): void {
    const normalUser: User = {
      id: 1,
      username: "김준성",
      loginId: "junseong.kim",
      subscribers: "8.71천명",
      role: "user"
    };
    setUser(normalUser);
  }

  return {
    currentUser,
    isAuthenticated,
    userId,
    isAdmin,
    login,
    logout,
    setUser,
    switchToAdmin,
    switchToUser,
  };
}
