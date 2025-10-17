import { apiConfig, getCurrentUserId } from '../config/api';
import type {
  User,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  CheckAvailabilityResponse,
  UserInfoResponse
} from '../types/user';

class UserApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiConfig.backend.baseUrl;
  }

  /**
   * 공통 요청 메서드
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const currentUserId = getCurrentUserId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // 사용자 ID가 있을 때만 헤더에 추가
    if (currentUserId !== null) {
      headers['X-User-Id'] = String(currentUserId);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API 요청 실패: ${error}`);
    }

    return response.json();
  }

  /**
   * 회원가입
   */
  async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    return this.request<SignUpResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * 로그인
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * 로그인 ID 중복 검사
   */
  async checkLoginId(loginId: string): Promise<CheckAvailabilityResponse> {
    return this.request<CheckAvailabilityResponse>(
      `/api/auth/check/loginId?loginId=${encodeURIComponent(loginId)}`
    );
  }

  /**
   * 사용자명 중복 검사
   */
  async checkUsername(username: string): Promise<CheckAvailabilityResponse> {
    return this.request<CheckAvailabilityResponse>(
      `/api/auth/check/username?username=${encodeURIComponent(username)}`
    );
  }

  /**
   * 사용자 정보 조회 (ID)
   */
  async getUserById(id: number): Promise<UserInfoResponse> {
    return this.request<UserInfoResponse>(`/api/auth/user/${id}`);
  }

  /**
   * 사용자 정보 조회 (로그인 ID)
   */
  async getUserByLoginId(loginId: string): Promise<UserInfoResponse> {
    return this.request<UserInfoResponse>(`/api/auth/user/loginId/${loginId}`);
  }
}

// 싱글톤 인스턴스 생성
export const userApiService = new UserApiService();

