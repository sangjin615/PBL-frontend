import { apiConfig, getCurrentUserId } from '../config/api';
import { request } from './utils';
import type {
  User,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  CheckAvailabilityResponse,
  UserInfoResponse,
  UpdateUsernameRequest,
  UpdateUsernameResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UploadProfileImageResponse,
  GetProfileImageResponse,
  DeleteProfileImageResponse
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

  /**
   * 닉네임 변경
   * PUT /api/auth/user/profile/username
   */
  async updateUsername(usernameRequest: UpdateUsernameRequest): Promise<UpdateUsernameResponse> {
    return request<UpdateUsernameResponse>(
      '/api/auth/user/profile/username',
      {
        method: 'PUT',
        body: JSON.stringify(usernameRequest),
      },
      this.baseUrl
    );
  }

  /**
   * 비밀번호 변경
   * PUT /api/auth/user/profile/password
   */
  async updatePassword(passwordRequest: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
    return request<UpdatePasswordResponse>(
      '/api/auth/user/profile/password',
      {
        method: 'PUT',
        body: JSON.stringify(passwordRequest),
      },
      this.baseUrl
    );
  }

  /**
   * 프로필 이미지 업로드/수정
   * PUT /api/auth/user/profile/image
   * multipart/form-data 형식으로 파일 업로드
   */
  async uploadProfileImage(file: File): Promise<UploadProfileImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    const url = `${this.baseUrl}/api/auth/user/profile/image`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'X-User-Id': String(userId),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      const error = new Error(errorMessage) as Error & { status: number };
      error.status = response.status;
      throw error;
    }

    return await response.json();
  }

  /**
   * 프로필 이미지 조회
   * GET /api/auth/user/{userId}/profile/image
   */
  async getProfileImage(userId: number): Promise<GetProfileImageResponse> {
    return request<GetProfileImageResponse>(
      `/api/auth/user/${userId}/profile/image`,
      {},
      this.baseUrl
    );
  }

  /**
   * 프로필 이미지 삭제
   * DELETE /api/auth/user/profile/image
   */
  async deleteProfileImage(): Promise<DeleteProfileImageResponse> {
    return request<DeleteProfileImageResponse>(
      '/api/auth/user/profile/image',
      {
        method: 'DELETE',
      },
      this.baseUrl
    );
  }
}

// 싱글톤 인스턴스 생성
export const userApiService = new UserApiService();

