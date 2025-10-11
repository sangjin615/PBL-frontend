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
  user: User | null;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  message: string;
}

export interface UserInfoResponse {
  success: boolean;
  user: User;
}

