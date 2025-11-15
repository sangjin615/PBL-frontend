import type { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: 'api_none',
    title: 'API 연결없음(기본값 = "Introduction To Algorithms")',
    instructor: 'API 연결없음(기본값 = "김유희")',
    category: 'API 연결없음(기본값 = "알고리즘")',
    rating: -99,
    reviewsCount: -99,
    price: 0,
    badges: ['API 연결없음'],
    problemsCount: -99,
    languages: ['API 연결없음'],
    tags: ['API 연결없음'],
    difficulty: 'API 연결없음(기본값 = "초급")',
    description: 'API 연결없음(기본값 = "알고리즘 기초")',
    createdAt: '2025-09-01',
    type: 'curriculum',
  }
];
