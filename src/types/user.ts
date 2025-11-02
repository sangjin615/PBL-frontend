/**
 * 사용자 관련 타입 정의
 */

export interface User {
  id: number;
  username: string;
  loginId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpRequest {
  username: string;
  loginId: string;
  password: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    loginId: string;
    createdAt: number[] | string;
    updatedAt: number[] | string;
    role?: 'user' | 'admin'; // 사용자 역할 (백엔드에서 반환)
  };
}

export interface SignUpResponse {
  id: number;
  username: string;
  loginId: string;
  createdAt: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  message: string;
}

export interface UserInfoResponse {
  id: number;
  username: string;
  loginId: string;
  createdAt: string;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdateUsernameResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    loginId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

