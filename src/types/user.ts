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
  id: number;
  username: string;
  loginId: string;
  createdAt: string;
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

