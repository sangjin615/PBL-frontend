/**
 * QnA 관련 타입 정의
 */

export interface QnAQuestion {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  course: string;
  language: string;
  status: 'unresolved' | 'resolved';
  comments: number;
  likes: number;
  createdAt: string;
  commentsList?: QnAComment[];
}

export interface QnAComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  isReply?: boolean;
  parentId?: number;
}
