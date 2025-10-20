/**
 * 신고 관련 타입 정의
 */

export type ReportType = 'curriculum' | 'lecture' | 'problem' | 'post' | 'comment';

export interface ReportRequest {
  type: ReportType;
  targetId: number;
  content: string;
}

export interface ReportResponse {
  id: number;
  reporterId: number;
  type: ReportType;
  targetId: number;
  content: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ReportListResponse {
  reports: ReportResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}
