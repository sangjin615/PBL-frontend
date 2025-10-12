/**
 * S3 이미지 업로드 API 서비스
 * 백엔드 S3 모듈과 통신하는 API 클라이언트
 */

import { apiConfig } from '../config/api';

export interface S3UploadResponse {
  id: number;
  originalFilename: string;
  storedFilename: string;
  imageUrl: string;
  contentType: string;
  fileSize: number;
  width: number;
  height: number;
  uploadedAt: string;
}

export interface S3StatsResponse {
  totalImages: number;
  totalFileSize: number;
  averageFileSize: number;
  imagesByUser: number;
}

class S3ApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = apiConfig.backend.baseUrl;
  }

  /**
   * HTTP 요청을 위한 공통 fetch 래퍼
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'X-User-Id': String(apiConfig.auth.defaultUserId),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 204 No Content인 경우 빈 객체 반환
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`S3 API 요청 실패 [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * 이미지 업로드
   * POST /api/s3/upload
   */
  async uploadImage(file: File, folder?: string): Promise<S3UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const url = `${this.baseURL}/api/s3/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-User-Id': String(apiConfig.auth.defaultUserId),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * 이미지 삭제
   * DELETE /api/s3/{imageId}
   */
  async deleteImage(imageId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/s3/${imageId}`, {
      method: 'DELETE',
    });
  }

  /**
   * 이미지 통계 조회
   * GET /api/s3/stats
   */
  async getStats(userId?: number): Promise<S3StatsResponse> {
    const endpoint = userId 
      ? `/api/s3/stats?userId=${userId}`
      : '/api/s3/stats';
    
    return this.request<S3StatsResponse>(endpoint);
  }

  /**
   * 버킷 정책 설정 (관리자)
   * POST /api/s3/admin/set-public-policy
   */
  async setPublicPolicy(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/s3/admin/set-public-policy', {
      method: 'POST',
    });
  }

  /**
   * 이미지 URL 생성 헬퍼
   * 업로드된 이미지의 직접 접근 URL을 생성합니다.
   */
  static getImageUrl(storedFilename: string): string {
    return `http://localhost:9000/pbl-images/${storedFilename}`;
  }

  /**
   * 이미지 파일 유효성 검사
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // 파일 크기 검사 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { isValid: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' };
    }

    // 파일 형식 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: '지원되지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP, BMP만 지원)' };
    }

    return { isValid: true };
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const s3ApiService = new S3ApiService();
export default s3ApiService;
