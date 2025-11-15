import { get, post, put, del } from './utils';
import type {
  CreateReportRequest,
  ProcessReportRequest,
  ReportResponse,
  ReportListParams,
  ReportListResponse,
  ReportStatsResponse
} from '../types/report';

/**
 * 신고 API 서비스
 * 백엔드 API: http://localhost:2358/api/reports
 */
class ReportApiService {
  private readonly BASE_PATH = '/api/reports';

  /**
   * 신고 접수
   * POST /api/reports
   */
  async submitReport(request: CreateReportRequest): Promise<ReportResponse> {
    try {
      return await post<ReportResponse>(this.BASE_PATH, request);
    } catch (error: any) {
      // 중복 신고 에러 처리
      if (error.message?.includes('이미 신고한')) {
        throw new Error('이미 신고한 콘텐츠입니다.');
      }
      throw error;
    }
  }

  /**
   * 신고 목록 조회 (관리자용)
   * GET /api/reports?status=PENDING&targetType=QUESTION&page=0&size=20
   */
  async getReports(params?: ReportListParams): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.targetType) {
      queryParams.append('targetType', params.targetType);
    }
    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }
    if (params?.size !== undefined) {
      queryParams.append('size', String(params.size));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;

    return await get<ReportListResponse>(endpoint);
  }

  /**
   * 신고 상세 조회 (관리자용)
   * GET /api/reports/{id}
   */
  async getReportDetail(id: number): Promise<ReportResponse> {
    return await get<ReportResponse>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * 신고 처리 (관리자용)
   * PUT /api/reports/{id}/process
   */
  async processReport(id: number, request: ProcessReportRequest): Promise<ReportResponse> {
    return await put<ReportResponse>(`${this.BASE_PATH}/${id}/process`, request);
  }

  /**
   * 신고 통계 조회 (관리자용)
   * GET /api/reports/stats
   */
  async getReportStats(): Promise<ReportStatsResponse> {
    return await get<ReportStatsResponse>(`${this.BASE_PATH}/stats`);
  }

  /**
   * 내 신고 목록 조회
   * GET /api/reports/my
   */
  async getMyReports(): Promise<ReportResponse[]> {
    return await get<ReportResponse[]>(`${this.BASE_PATH}/my`);
  }

  /**
   * 신고 취소
   * DELETE /api/reports/{id}
   *
   * 제약 조건:
   * - 본인이 작성한 신고만 취소 가능
   * - PENDING 상태의 신고만 취소 가능
   */
  async cancelReport(id: number): Promise<void> {
    try {
      await del<void>(`${this.BASE_PATH}/${id}`);
    } catch (error: any) {
      // 에러 메시지 처리
      if (error.message?.includes('본인이 작성한')) {
        throw new Error('본인이 작성한 신고만 취소할 수 있습니다.');
      }
      if (error.message?.includes('처리 중인')) {
        throw new Error('처리 중인 신고는 취소할 수 없습니다.');
      }
      throw error;
    }
  }

  /**
   * 특정 대상의 신고 개수 조회 (헬퍼 메서드)
   * 백엔드에 직접적인 API는 없지만, 목록 조회로 구현 가능
   */
  async countReports(targetType: string, targetId: number): Promise<number> {
    try {
      // 전체 목록을 가져와서 필터링 (실제로는 백엔드에 count API가 있으면 더 좋음)
      const response = await this.getReports({
        targetType: targetType as any,
        size: 1000  // 충분히 큰 숫자
      });

      // 동일한 targetId를 가진 신고만 카운트
      return response.content.filter(report => report.targetId === targetId).length;
    } catch (error) {
      console.error('신고 개수 조회 실패:', error);
      return 0;
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const reportApiService = new ReportApiService();
