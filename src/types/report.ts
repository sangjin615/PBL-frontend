/**
 * 신고 관련 타입 정의
 * 백엔드 API와 1:1 매칭
 */

/**
 * 신고 대상 타입
 */
export type ReportTargetType =
  | 'CURRICULUM'      // 커리큘럼
  | 'LECTURE'         // 강의
  | 'QUESTION'        // 질문
  | 'ANSWER'          // 답변
  | 'COURSE_REVIEW';  // 코스 리뷰

/**
 * 신고 사유
 */
export type ReportReason =
  | 'SPAM'                      // 스팸
  | 'ABUSE'                     // 욕설/혐오 표현
  | 'INAPPROPRIATE_CONTENT'     // 부적절한 콘텐츠
  | 'COPYRIGHT_VIOLATION'       // 저작권 침해
  | 'PERSONAL_INFO_EXPOSURE'    // 개인정보 노출
  | 'MISINFORMATION'            // 허위정보
  | 'OTHER';                    // 기타

/**
 * 신고 상태
 */
export type ReportStatus =
  | 'PENDING'       // 접수됨 (처리 대기)
  | 'PROCESSING'    // 처리 중
  | 'RESOLVED'      // 처리 완료
  | 'REJECTED';     // 반려됨

/**
 * 신고 처리 방법
 */
export type ProcessAction =
  | 'DELETE_CONTENT'    // 콘텐츠 삭제
  | 'MODIFY_REQUEST'    // 수정 요청
  | 'WARNING'           // 경고
  | 'MUTE_USER'         // 사용자 일시 정지
  | 'DELETE_ACCOUNT'    // 계정 탈퇴
  | 'NO_ACTION'         // 조치 없음 (혐의 없음)
  | 'OTHER';            // 기타

/**
 * 신고 작성 요청
 */
export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  content?: string;  // 선택 사항
}

/**
 * 신고 처리 요청 (관리자)
 */
export interface ProcessReportRequest {
  status: 'PROCESSING' | 'RESOLVED' | 'REJECTED';
  processAction?: ProcessAction;
  processNote?: string;
}

/**
 * 신고 응답
 */
export interface ReportResponse {
  id: number;
  reporterId: number;
  reporterUsername: string;
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  content?: string;
  status: ReportStatus;
  processorId?: number;
  processorUsername?: string;
  processAction?: ProcessAction;
  processNote?: string;
  createdAt: string;
  processedAt?: string;
}

/**
 * 신고 목록 조회 파라미터
 */
export interface ReportListParams {
  status?: ReportStatus;
  targetType?: ReportTargetType;
  page?: number;      // 0부터 시작
  size?: number;      // 기본값: 20
}

/**
 * 페이징된 신고 목록 응답
 */
export interface ReportListResponse {
  content: ReportResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
}

/**
 * 신고 통계 응답
 */
export interface ReportStatsResponse {
  totalReports: number;
  pendingCount: number;
  processingCount: number;
  resolvedCount: number;
  rejectedCount: number;
  byTargetType: Record<string, number>;
  byReason: Record<string, number>;
  byProcessAction: Record<string, number>;
}

/**
 * 프론트엔드 UI용 타입 (기존 호환성 유지)
 */
export type ReportType = 'curriculum' | 'lecture' | 'problem' | 'post' | 'comment';

/**
 * 프론트엔드 reportType을 백엔드 targetType으로 변환
 */
export function mapReportTypeToTargetType(reportType: ReportType): ReportTargetType {
  const map: Record<ReportType, ReportTargetType> = {
    curriculum: 'CURRICULUM',
    lecture: 'LECTURE',
    problem: 'QUESTION',
    post: 'COURSE_REVIEW',
    comment: 'ANSWER'
  };
  return map[reportType];
}

/**
 * 신고 사유 한글 라벨
 */
export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: '스팸',
  ABUSE: '욕설/혐오 표현',
  INAPPROPRIATE_CONTENT: '부적절한 콘텐츠',
  COPYRIGHT_VIOLATION: '저작권 침해',
  PERSONAL_INFO_EXPOSURE: '개인정보 노출',
  MISINFORMATION: '허위정보',
  OTHER: '기타'
};

/**
 * 신고 상태 한글 라벨
 */
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: '처리 대기',
  PROCESSING: '처리 중',
  RESOLVED: '처리 완료',
  REJECTED: '반려됨'
};

/**
 * 신고 대상 타입 한글 라벨
 */
export const REPORT_TARGET_TYPE_LABELS: Record<ReportTargetType, string> = {
  CURRICULUM: '커리큘럼',
  LECTURE: '강의',
  QUESTION: '질문',
  ANSWER: '답변',
  COURSE_REVIEW: '코스 리뷰'
};
