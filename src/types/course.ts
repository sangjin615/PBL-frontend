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
  type?: 'course' | 'curriculum';   // 'curriculum' 고정
  totalLectureCount?: number;       // CurriculumResponse.totalLectureCount
  thumbnailImageUrl?: string;       // CurriculumResponse.thumbnailImageUrl
}
