import type { QnAQuestion } from '../types/qna';

export const qnaQuestions: QnAQuestion[] = [
  {
    id: 1,
    title: '오류좀 고쳐주세요',
    content: '이 문제 못풀면 저 잠 못자요 제발요',
    author: '김준성',
    category: '오류',
    course: 'Flutter 앱 개발',
    language: 'Dart',
    status: 'unresolved',
    comments: 2,
    likes: 0,
    createdAt: '16분 전',
    commentsList: [
      {
        id: 1,
        author: '임상진',
        content: '아 그거 그렇게 하는거 아님',
        createdAt: '12분 전',
        likes: 2
      },
      {
        id: 2,
        author: '김준성',
        content: '그래서 어떻게 하는 건데요;;',
        createdAt: '10분 전',
        likes: 0,
        isReply: true,
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    title: 'React에서 상태 관리가 어려워요',
    content: 'useState와 useEffect를 사용할 때 언제 리렌더링이 발생하는지 모르겠어요. 도움 부탁드려요!',
    author: '박민수',
    category: '질문',
    course: 'React 기초',
    language: 'JavaScript',
    status: 'resolved',
    comments: 3,
    likes: 5,
    createdAt: '2시간 전',
    commentsList: [
      {
        id: 3,
        author: '이지은',
        content: 'useState는 상태가 변경될 때마다 리렌더링이 발생합니다. useEffect는 의존성 배열에 따라 실행됩니다.',
        createdAt: '1시간 전',
        likes: 3
      },
      {
        id: 4,
        author: '최현우',
        content: '좋은 설명이네요! 추가로 useMemo와 useCallback도 알아보시면 좋을 것 같아요.',
        createdAt: '30분 전',
        likes: 1
      }
    ]
  },
  {
    id: 3,
    title: 'Python 알고리즘 문제 해결법',
    content: '백준 1463번 문제를 풀고 있는데 시간 초과가 계속 발생해요. 최적화 방법을 알려주세요.',
    author: '정수진',
    category: '알고리즘',
    course: 'Python 기초',
    language: 'Python',
    status: 'unresolved',
    comments: 1,
    likes: 2,
    createdAt: '3시간 전',
    commentsList: [
      {
        id: 5,
        author: '강태호',
        content: 'DP를 사용해서 풀어보세요. 메모이제이션을 활용하면 시간을 단축할 수 있습니다.',
        createdAt: '2시간 전',
        likes: 4
      }
    ]
  },
  {
    id: 4,
    title: 'Vue.js 컴포넌트 통신 방법',
    content: '부모-자식 컴포넌트 간에 데이터를 주고받는 방법이 궁금해요. props와 emit 말고 다른 방법도 있나요?',
    author: '송지현',
    category: '질문',
    course: 'Vue.js 입문',
    language: 'JavaScript',
    status: 'resolved',
    comments: 4,
    likes: 7,
    createdAt: '5시간 전',
    commentsList: [
      {
        id: 6,
        author: '김동현',
        content: 'provide/inject 패턴이나 Vuex를 사용할 수도 있어요. 상황에 따라 다르게 사용하시면 됩니다.',
        createdAt: '4시간 전',
        likes: 5
      },
      {
        id: 7,
        author: '박서연',
        content: '이벤트 버스도 고려해볼 수 있어요. 하지만 최근에는 Vuex나 Pinia를 더 많이 사용합니다.',
        createdAt: '3시간 전',
        likes: 2
      }
    ]
  },
  {
    id: 5,
    title: 'CSS Grid 레이아웃 질문',
    content: 'Grid로 반응형 레이아웃을 만들고 싶은데, 모바일에서는 어떻게 조정해야 할까요?',
    author: '윤서준',
    category: '스타일링',
    course: 'CSS 마스터',
    language: 'CSS',
    status: 'unresolved',
    comments: 0,
    likes: 1,
    createdAt: '1일 전',
    commentsList: []
  },
  {
    id: 6,
    title: 'Node.js 서버 배포 관련',
    content: 'Express 서버를 AWS에 배포하려고 하는데, 환경 변수 설정이 어려워요. 도움 부탁드려요!',
    author: '한미래',
    category: '배포',
    course: 'Node.js 백엔드',
    language: 'JavaScript',
    status: 'resolved',
    comments: 2,
    likes: 3,
    createdAt: '2일 전',
    commentsList: [
      {
        id: 8,
        author: '조성민',
        content: 'AWS Systems Manager Parameter Store나 AWS Secrets Manager를 사용하시면 됩니다.',
        createdAt: '1일 전',
        likes: 2
      }
    ]
  },
  {
    id: 7,
    title: 'TypeScript 타입 에러 해결',
    content: 'Generic 타입을 사용할 때 타입 추론이 제대로 안 되는 문제가 있어요. 어떻게 해결해야 할까요?',
    author: '오지훈',
    category: '타입스크립트',
    course: 'TypeScript 심화',
    language: 'TypeScript',
    status: 'unresolved',
    comments: 1,
    likes: 0,
    createdAt: '3일 전',
    commentsList: [
      {
        id: 9,
        author: '신예린',
        content: '타입 단언이나 제약 조건을 사용해보세요. 코드를 보여주시면 더 구체적으로 도와드릴 수 있어요.',
        createdAt: '2일 전',
        likes: 1
      }
    ]
  },
  {
    id: 8,
    title: 'Git 브랜치 전략 질문',
    content: '팀 프로젝트에서 Git Flow와 GitHub Flow 중 어떤 것을 사용하는 게 좋을까요?',
    author: '배준호',
    category: 'Git',
    course: 'Git & GitHub',
    language: 'Git',
    status: 'resolved',
    comments: 3,
    likes: 4,
    createdAt: '4일 전',
    commentsList: [
      {
        id: 10,
        author: '김나영',
        content: '팀 규모와 프로젝트 특성에 따라 다릅니다. 작은 팀이라면 GitHub Flow가 더 간단해요.',
        createdAt: '3일 전',
        likes: 3
      },
      {
        id: 11,
        author: '이준석',
        content: '저희 팀은 Git Flow를 사용하고 있는데, 릴리즈 관리가 체계적이어서 만족해요.',
        createdAt: '2일 전',
        likes: 2
      }
    ]
  }
];
