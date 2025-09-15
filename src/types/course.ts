export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  thumbnail?: string;
  rating: number; // 0..5
  reviewsCount: number;
  price: number; // 0 for free
  badges?: string[];
  problemsCount?: number;
  languages?: string[];
  tags?: string[];
  difficulty?: '입문' | '초급' | '중급' | '고급';
  description?: string;
  createdAt: string; // ISO date
  type?: 'course' | 'curriculum'; // 강의 또는 커리큘럼
}
