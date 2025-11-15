/**
 * useAuth Composable
 * 사용자 인증 및 정보 관리
 */

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authConfig, invalidateUserIdCache, getCurrentUserId } from "@/config/api";
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

/**
 * 현재 로그인된 사용자 정보 (전역 computed)
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
      const parsed = JSON.parse(storedUser);
      // localStorage에서 읽었을 때 currentUserState에 동기화
      if (parsed && !currentUserState.value) {
        currentUserState.value = parsed;
      }
      return parsed;
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
 * 사용자 로그인 여부 확인 (전역 computed)
 */
const isAuthenticated = computed(() => {
  return currentUser.value !== null;
});

/**
 * 현재 사용자 ID 가져오기 (전역 computed)
 */
const userId = computed(() => {
  return currentUser.value?.id || null;
});

/**
 * 관리자 권한 확인 (전역 computed)
 */
const isAdmin = computed(() => {
  return currentUser.value?.role === 'admin';
});

export function useAuth() {
  const router = useRouter();

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

      // 로그인 전 이전 사용자 정보 완전히 제거
      currentUserState.value = null;
      localStorage.removeItem("user");
      localStorage.removeItem("loggedOut");
      invalidateUserIdCache();
      console.log("🧹 이전 사용자 정보 완전히 제거됨");

      let user: User;

      // authConfig.enabled가 true면 실제 서버 응답 사용
      if (authConfig.enabled && typeof loginResponse === 'object') {
        // 서버 응답이 {success, message, user} 구조인 경우
        const userData = loginResponse.user || loginResponse;

        // loginId가 'admin'이거나 'admin123'인 경우 자동으로 관리자 권한 부여
        const isAdminAccount = userData.loginId === 'admin' || userData.loginId === 'admin123';

        user = {
          id: userData.id,
          username: userData.username,
          loginId: userData.loginId,
          subscribers: "0명", // 기본값
          role: isAdminAccount ? 'admin' : (userData.role || 'user'), // 백엔드에서 role 정보가 있으면 사용, 없으면 기본 'user'
        };
        console.log("✅ 프로덕션 모드: 실제 사용자 정보 사용", user);
      }
      // authConfig.enabled가 false면 개발용 하드코딩
      else {
        const loginId = typeof loginResponse === 'string'
          ? loginResponse
          : loginResponse.user?.loginId;

        const isAdminAccount = loginId === 'admin' || loginId === 'admin123';

        user = {
          id: authConfig.defaultUserId,
          username: isAdminAccount ? "관리자" : "김준성",
          loginId: loginId,
          subscribers: isAdminAccount ? "관리자" : "8.71천명",
          role: isAdminAccount ? 'admin' : 'user',
        };
        console.log("⚠️ 개발 모드: 하드코딩된 사용자 정보 사용", user);
      }

      // 새 사용자 정보 저장
      currentUserState.value = user;
      localStorage.setItem("user", JSON.stringify(user));
      console.log("💾 새 사용자 정보 localStorage에 저장:", JSON.stringify(user));

      // 사용자 ID 캐시 무효화 (헤더 업데이트 보장)
      invalidateUserIdCache();

      // 캐시 무효화 후 즉시 다시 조회하여 확인
      const verifyUserId = getCurrentUserId();
      console.log("🔍 검증: getCurrentUserId() =", verifyUserId, "기대값:", user.id);

      console.log("✅ 로그인 성공:", user);
      console.log("🔄 사용자 ID 캐시 무효화됨 - 다음 API 요청 시 새 헤더 사용");
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
    console.log("=== 로그아웃 시작 ===");
    
    // 현재 사용자 정보 로그
    const beforeLogout = localStorage.getItem("user");
    console.log("로그아웃 전 사용자 정보:", beforeLogout);

    // 상태 초기화
    currentUserState.value = null;
    
    // 모든 사용자 관련 localStorage 제거
    localStorage.removeItem("user");
    localStorage.setItem("loggedOut", "true");
    
    // 사용자 ID 캐시 무효화 (헤더 업데이트 보장)
    invalidateUserIdCache();
    
    // 캐시 무효화 후 즉시 확인
    const verifyUserId = getCurrentUserId();
    console.log("🔍 검증: getCurrentUserId() =", verifyUserId, "(null이어야 함)");
    
    // 추가 검증: localStorage가 비어있는지 확인
    const afterLogout = localStorage.getItem("user");
    console.log("로그아웃 후 localStorage 'user':", afterLogout, "(null이어야 함)");

    // 로그인 페이지로 리다이렉트
    // TODO: 실제 로그인 페이지 경로로 변경
    router.push({ name: "login" }).catch(() => {
      // 로그인 페이지가 없는 경우 홈으로
      router.push("/");
    });

    console.log("✅ 로그아웃 완료");
    console.log("🔄 사용자 ID 캐시 무효화됨 - 다음 API 요청 시 헤더 제거");
  }

  /**
   * 사용자 정보 수동 설정 (테스트용)
   */
  function setUser(user: User): void {
    currentUserState.value = user;
    localStorage.setItem("user", JSON.stringify(user));
    // 사용자 정보 변경 시 캐시 무효화
    invalidateUserIdCache();
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
