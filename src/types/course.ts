export interface Course {
  id: string;                       // CurriculumResponse.id → string 변환
  title: string;                    // CurriculumResponse.title
  instructor: string;               // CurriculumResponse.author.username
  category: string;                 // CurriculumResponse.category || '미분류'
  thumbnail?: string;               // CurriculumResponse.thumbnailImageUrl
  rating: number;                   // CurriculumResponse.averageRating || 0
  studentCount?: number;            // CurriculumResponse.studentCount || 0
  reviewsCount?: number;            // CurriculumResponse.reviewsCount || 0
  price: number;                    // 항상 0 (무료)
  problemsCount?: number;           // CurriculumResponse.totalLectureCount
  languages?: string[];             // CurriculumResponse.languages
  tags?: string[];                  // CurriculumResponse.tags
  difficulty?: string;              // CurriculumResponse.difficulty
  description?: string;             // CurriculumResponse.description
  createdAt: string;                // CurriculumResponse.createdAt (날짜 변환)
  type?: 'course' | 'curriculum' | 'lecture';   // 'curriculum', 'lecture' 구분
  lectureId?: number;               // 강의인 경우 원본 lecture ID (type이 'lecture'일 때 사용)
  totalLectureCount?: number;       // CurriculumResponse.totalLectureCount
  thumbnailImageUrl?: string;       // CurriculumResponse.thumbnailImageUrl
}
