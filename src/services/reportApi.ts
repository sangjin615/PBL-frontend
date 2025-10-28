import { apiConfig } from '../config/api';
import { request } from './utils';
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
   * 신고 접수
   */
  async submitReport(reportRequest: ReportRequest): Promise<ReportResponse> {
    // 개발/테스트용 모킹 (백엔드가 준비되면 제거)
    if (import.meta.env.DEV) {
      console.log('신고 접수 (모킹):', reportRequest);

      // 1초 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 모킹 응답 반환
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        reporterId: 1,
        type: reportRequest.type,
        targetId: reportRequest.targetId,
        content: reportRequest.content,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // 실제 API 호출 (백엔드 준비 후)
    return request<ReportResponse>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(reportRequest),
    }, this.baseUrl);
  }

  /**
   * 신고 목록 조회 (관리자용)
   */
  async getReports(page: number = 1, pageSize: number = 20): Promise<ReportListResponse> {
    // 개발/테스트용 모킹 (백엔드가 준비되면 제거)
    if (import.meta.env.DEV) {
      const totalCount = 8;
      const base = (page - 1) * pageSize;
      const reports = Array.from({ length: Math.min(pageSize, totalCount - base) }, (_, idx) => {
        const id = base + idx + 1;
        const types: Array<ReportRequest['type']> = ['curriculum', 'lecture', 'problem', 'post', 'comment'];
        const type = types[id % types.length];
        return {
          id,
          reporterId: 1,
          type,
          targetId: 1000 + id,
          content: `테스트 신고 내용 #${id} - 부적절한 콘텐츠 신고입니다.`,
          status: 'pending' as const,
          createdAt: new Date(Date.now() - id * 3600_000).toISOString(),
          updatedAt: new Date(Date.now() - id * 1800_000).toISOString(),
        };
      });
      await new Promise(r => setTimeout(r, 400));
      return { reports, totalCount, page, pageSize };
    }

    return request<ReportListResponse>(
      `/api/reports?page=${page}&pageSize=${pageSize}`,
      {},
      this.baseUrl
    );
  }

  /**
   * 신고 상세 조회 (관리자용)
   */
  async getReportById(id: number): Promise<ReportResponse> {
    return request<ReportResponse>(`/api/reports/${id}`, {}, this.baseUrl);
  }

  /**
   * 신고 상태 업데이트 (관리자용)
   */
  async updateReportStatus(
    id: number,
    status: 'pending' | 'processing' | 'resolved' | 'rejected'
  ): Promise<ReportResponse> {
    return request<ReportResponse>(`/api/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }, this.baseUrl);
  }
}

// 싱글톤 인스턴스 생성
export const reportApiService = new ReportApiService();
