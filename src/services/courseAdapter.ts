/**
 * Course 어댑터
 * 백엔드 CurriculumResponse를 프론트엔드 Course 타입으로 변환
 */

import type { Course } from '@/types/course';
import type { CurriculumResponse } from '@/types/curriculum';

/**
 * CurriculumResponse를 Course로 변환
 */
export function curriculumToCourse(curriculum: CurriculumResponse): Course {
  // createdAt 변환 (ISO string 또는 number array)
  let createdAtString: string;
  if (Array.isArray(curriculum.createdAt)) {
    // Java LocalDateTime을 JSON으로 받으면 [year, month, day, hour, minute, second] 형식
    const [year, month, day] = curriculum.createdAt;
    createdAtString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  } else {
    createdAtString = curriculum.createdAt;
  }

  return {
    id: String(curriculum.id),
    title: curriculum.title,
    instructor: curriculum.author?.username || '알 수 없음',
    category: extractCategory(curriculum.title, curriculum.description),
    rating: curriculum.averageRating || 0, // 백엔드에서 받은 평균 별점 사용
    reviewsCount: 0, // 리뷰 API 없음 (추후 구현 시 변경)
    price: 0,
    badges: extractBadges(curriculum),
    problemsCount: curriculum.totalLectureCount || 0,
    languages: extractLanguages(curriculum.title, curriculum.description),
    tags: [], // TODO: 백엔드에서 tags 필드 추가 필요
    difficulty: curriculum.difficulty ? convertDifficulty(curriculum.difficulty) : extractDifficulty(curriculum.title, curriculum.description),
    description: curriculum.description,
    createdAt: createdAtString,
    type: 'curriculum',
  };
}

/**
 * 커리큘럼 제목/설명에서 카테고리 추출
 */
function extractCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('알고리즘') || text.includes('algorithm')) return '알고리즘';
  if (text.includes('웹') || text.includes('html') || text.includes('css')) return '웹';
  if (text.includes('게임') || text.includes('unity') || text.includes('game')) return '게임 개발';
  if (text.includes('데이터베이스') || text.includes('sql') || text.includes('database')) return '데이터베이스';
  if (text.includes('인공지능') || text.includes('ai') || text.includes('머신러닝') || text.includes('딥러닝')) return '인공지능';
  if (text.includes('파이썬') || text.includes('python') || text.includes('자료구조')) return '개발·프로그래밍';
  if (text.includes('하드웨어') || text.includes('hardware')) return '하드웨어';

  return '개발·프로그래밍';
}

/**
 * 커리큘럼 정보에서 뱃지 추출
 */
function extractBadges(curriculum: CurriculumResponse): string[] {
  const badges: string[] = [];

  // 생성일이 최근 30일 이내면 '신규'
  let createdDate: Date;
  if (Array.isArray(curriculum.createdAt)) {
    const [year, month, day] = curriculum.createdAt;
    createdDate = new Date(year, month - 1, day);
  } else {
    createdDate = new Date(curriculum.createdAt);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  if (createdDate > thirtyDaysAgo) {
    badges.push('신규');
  }

  // 강의 수가 20개 이상이면 '인기'
  if (curriculum.totalLectureCount && curriculum.totalLectureCount >= 20) {
    badges.push('인기');
  }

  return badges;
}

/**
 * 커리큘럼 제목/설명에서 언어 추출
 */
function extractLanguages(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const languages: string[] = [];

  if (text.includes('python') || text.includes('파이썬')) languages.push('Python');
  if (text.includes('java')) languages.push('Java');
  if (text.includes('javascript') || text.includes('js')) languages.push('JavaScript');
  if (text.includes('c#')) languages.push('C#');
  if (text.includes('c++')) languages.push('C++');
  if (text.includes('html')) languages.push('HTML');
  if (text.includes('css')) languages.push('CSS');
  if (text.includes('sql')) languages.push('SQL');

  return languages.length > 0 ? languages : ['Python']; // 기본값
}

/**
 * 커리큘럼 제목/설명에서 태그 추출
 */
function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags: string[] = [];

  // 알고리즘 관련
  if (text.includes('정렬')) tags.push('정렬');
  if (text.includes('그래프')) tags.push('그래프');
  if (text.includes('동적계획법')) tags.push('동적계획법');

  // 웹 관련
  if (text.includes('레이아웃')) tags.push('레이아웃');
  if (text.includes('반응형')) tags.push('반응형');

  // 자료구조 관련
  if (text.includes('리스트')) tags.push('리스트');
  if (text.includes('딕셔너리')) tags.push('딕셔너리');
  if (text.includes('세트')) tags.push('세트');

  // 게임 개발 관련
  if (text.includes('unity')) tags.push('Unity');
  if (text.includes('씬')) tags.push('씬');
  if (text.includes('프리팹')) tags.push('프리팹');

  // 데이터베이스 관련
  if (text.includes('join')) tags.push('JOIN');
  if (text.includes('인덱스')) tags.push('인덱스');

  // AI 관련
  if (text.includes('머신러닝')) tags.push('머신러닝');
  if (text.includes('딥러닝')) tags.push('딥러닝');

  return tags.length > 0 ? tags : ['기초'];
}

/**
 * 백엔드 난이도 문자열을 프론트엔드 형식으로 변환
 */
function convertDifficulty(difficulty: string): '입문' | '초급' | '중급' | '고급' {
  const normalized = difficulty.toLowerCase();

  if (normalized.includes('기초') || normalized.includes('입문') || normalized.includes('beginner')) return '입문';
  if (normalized.includes('초급') || normalized.includes('basic')) return '초급';
  if (normalized.includes('중급') || normalized.includes('intermediate')) return '중급';
  if (normalized.includes('고급') || normalized.includes('advanced')) return '고급';

  return '초급'; // 기본값
}

/**
 * 커리큘럼 제목/설명에서 난이도 추출
 */
function extractDifficulty(title: string, description: string): '입문' | '초급' | '중급' | '고급' {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('입문') || text.includes('기초')) return '입문';
  if (text.includes('초급')) return '초급';
  if (text.includes('중급')) return '중급';
  if (text.includes('고급') || text.includes('심화')) return '고급';

  // 기본값: 제목에 '개요', 'intro' 등이 있으면 입문
  if (text.includes('개요') || text.includes('intro') || text.includes('기본')) return '입문';

  return '초급'; // 기본값
}

/**
 * 여러 CurriculumResponse를 Course 배열로 변환
 */
export function curriculumsToCourses(curriculums: CurriculumResponse[]): Course[] {
  return curriculums.map(curriculumToCourse);
}
