import { apiConfig, getCurrentUserId } from '../config/api';
import type {
  ReportRequest,
  ReportResponse,
  ReportListResponse
} from '../types/report';

class ReportApiService {
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
   * 신고 접수
   */
  async submitReport(request: ReportRequest): Promise<ReportResponse> {
    // 개발/테스트용 모킹 (백엔드가 준비되면 제거)
    if (import.meta.env.DEV) {
      console.log('신고 접수 (모킹):', request);
      
      // 1초 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 모킹 응답 반환
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        reporterId: 1,
        type: request.type,
        targetId: request.targetId,
        content: request.content,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    // 실제 API 호출 (백엔드 준비 후)
    return this.request<ReportResponse>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * 신고 목록 조회 (관리자용)
   */
  async getReports(page: number = 1, pageSize: number = 20): Promise<ReportListResponse> {
    return this.request<ReportListResponse>(
      `/api/reports?page=${page}&pageSize=${pageSize}`
    );
  }

  /**
   * 신고 상세 조회 (관리자용)
   */
  async getReportById(id: number): Promise<ReportResponse> {
    return this.request<ReportResponse>(`/api/reports/${id}`);
  }

  /**
   * 신고 상태 업데이트 (관리자용)
   */
  async updateReportStatus(
    id: number, 
    status: 'pending' | 'processing' | 'resolved' | 'rejected'
  ): Promise<ReportResponse> {
    return this.request<ReportResponse>(`/api/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

// 싱글톤 인스턴스 생성
export const reportApiService = new ReportApiService();
