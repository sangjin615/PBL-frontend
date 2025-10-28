import { apiConfig } from '../config/api';
import { request } from './utils';
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
   * 회원가입
   */
  async signUp(signUpRequest: SignUpRequest): Promise<SignUpResponse> {
    return request<SignUpResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(signUpRequest),
    }, this.baseUrl);
  }

  /**
   * 로그인
   */
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginRequest),
    }, this.baseUrl);
  }

  /**
   * 로그인 ID 중복 검사
   */
  async checkLoginId(loginId: string): Promise<CheckAvailabilityResponse> {
    return request<CheckAvailabilityResponse>(
      `/api/auth/check/loginId?loginId=${encodeURIComponent(loginId)}`,
      {},
      this.baseUrl
    );
  }

  /**
   * 사용자명 중복 검사
   */
  async checkUsername(username: string): Promise<CheckAvailabilityResponse> {
    return request<CheckAvailabilityResponse>(
      `/api/auth/check/username?username=${encodeURIComponent(username)}`,
      {},
      this.baseUrl
    );
  }

  /**
   * 사용자 정보 조회 (ID)
   */
  async getUserById(id: number): Promise<UserInfoResponse> {
    return request<UserInfoResponse>(`/api/auth/user/${id}`, {}, this.baseUrl);
  }

  /**
   * 사용자 정보 조회 (로그인 ID)
   */
  async getUserByLoginId(loginId: string): Promise<UserInfoResponse> {
    return request<UserInfoResponse>(`/api/auth/user/loginId/${loginId}`, {}, this.baseUrl);
  }
}

// 싱글톤 인스턴스 생성
export const userApiService = new UserApiService();

