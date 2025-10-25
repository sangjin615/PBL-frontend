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
  },
  {
    id: 9,
    title: 'Docker 컨테이너 최적화 방법',
    content: 'Docker 이미지 크기를 줄이고 성능을 향상시키는 방법이 궁금해요. 베스트 프랙티스를 알려주세요.',
    author: '임도현',
    category: 'DevOps',
    course: 'Docker 마스터',
    language: 'Docker',
    status: 'unresolved',
    comments: 2,
    likes: 6,
    createdAt: '5일 전',
    commentsList: [
      {
        id: 12,
        author: '서민지',
        content: '멀티스테이지 빌드를 사용하고, 불필요한 패키지를 제거하세요. Alpine 이미지도 고려해보세요.',
        createdAt: '4일 전',
        likes: 4
      }
    ]
  },
  {
    id: 10,
    title: 'React Native 네비게이션 문제',
    content: 'React Navigation에서 스택 네비게이션이 제대로 작동하지 않아요. 화면 전환이 안 됩니다.',
    author: '강민호',
    category: '모바일',
    course: 'React Native',
    language: 'JavaScript',
    status: 'resolved',
    comments: 3,
    likes: 2,
    createdAt: '6일 전',
    commentsList: [
      {
        id: 13,
        author: '황지원',
        content: 'NavigationContainer로 앱을 감싸고, 스크린 컴포넌트를 올바르게 등록했는지 확인해보세요.',
        createdAt: '5일 전',
        likes: 3
      }
    ]
  },
  {
    id: 11,
    title: 'MongoDB 쿼리 최적화',
    content: 'MongoDB에서 복잡한 쿼리가 느려요. 인덱스를 어떻게 설정해야 할까요?',
    author: '신동욱',
    category: '데이터베이스',
    course: 'MongoDB 기초',
    language: 'MongoDB',
    status: 'unresolved',
    comments: 1,
    likes: 3,
    createdAt: '1주 전',
    commentsList: [
      {
        id: 14,
        author: '최유진',
        content: '자주 사용하는 필드에 인덱스를 생성하고, explain()으로 쿼리 실행 계획을 확인해보세요.',
        createdAt: '6일 전',
        likes: 2
      }
    ]
  },
  {
    id: 12,
    title: 'Vue 3 Composition API 사용법',
    content: 'Vue 3의 Composition API를 사용할 때 setup 함수에서 반환하는 값들이 제대로 반응하지 않아요.',
    author: '박지영',
    category: '프론트엔드',
    course: 'Vue 3 마스터',
    language: 'JavaScript',
    status: 'resolved',
    comments: 4,
    likes: 8,
    createdAt: '1주 전',
    commentsList: [
      {
        id: 15,
        author: '김태현',
        content: 'ref()나 reactive()를 사용해서 반응형 데이터를 만들어야 합니다. 일반 객체는 반응하지 않아요.',
        createdAt: '6일 전',
        likes: 5
      }
    ]
  },
  {
    id: 13,
    title: 'Spring Security 설정 오류',
    content: 'Spring Security에서 CORS 설정이 제대로 안 되어서 프론트엔드에서 API 호출이 안 돼요.',
    author: '이수진',
    category: '백엔드',
    course: 'Spring Boot',
    language: 'Java',
    status: 'unresolved',
    comments: 0,
    likes: 1,
    createdAt: '1주 전',
    commentsList: []
  },
  {
    id: 14,
    title: 'AWS Lambda 함수 배포',
    content: 'AWS Lambda에 Node.js 함수를 배포했는데 환경 변수가 제대로 설정되지 않았어요.',
    author: '정민수',
    category: '클라우드',
    course: 'AWS Lambda',
    language: 'JavaScript',
    status: 'resolved',
    comments: 2,
    likes: 4,
    createdAt: '2주 전',
    commentsList: [
      {
        id: 16,
        author: '한지민',
        content: 'Lambda 콘솔에서 환경 변수를 설정하거나, Serverless Framework를 사용해보세요.',
        createdAt: '1주 전',
        likes: 3
      }
    ]
  },
  {
    id: 15,
    title: 'GraphQL 스키마 설계',
    content: 'GraphQL 스키마를 설계할 때 어떤 원칙을 따라야 할까요? REST API와 다른 점이 궁금해요.',
    author: '송현우',
    category: 'API',
    course: 'GraphQL 기초',
    language: 'GraphQL',
    status: 'unresolved',
    comments: 3,
    likes: 7,
    createdAt: '2주 전',
    commentsList: [
      {
        id: 17,
        author: '김서연',
        content: '스키마 우선 설계를 하고, 클라이언트가 필요한 데이터만 요청할 수 있도록 설계하세요.',
        createdAt: '1주 전',
        likes: 4
      }
    ]
  },
  {
    id: 16,
    title: 'Redis 캐싱 전략',
    content: 'Redis를 사용해서 데이터베이스 캐싱을 구현하고 싶은데, 어떤 패턴을 사용해야 할까요?',
    author: '조민호',
    category: '캐싱',
    course: 'Redis 마스터',
    language: 'Redis',
    status: 'resolved',
    comments: 2,
    likes: 5,
    createdAt: '2주 전',
    commentsList: [
      {
        id: 18,
        author: '박준영',
        content: 'Cache-Aside 패턴이나 Write-Through 패턴을 사용하세요. 상황에 따라 다릅니다.',
        createdAt: '1주 전',
        likes: 3
      }
    ]
  },
  {
    id: 17,
    title: 'Kubernetes Pod 스케줄링',
    content: 'Kubernetes에서 Pod가 특정 노드에만 배포되도록 하고 싶어요. 어떻게 설정해야 할까요?',
    author: '윤서현',
    category: 'DevOps',
    course: 'Kubernetes',
    language: 'YAML',
    status: 'unresolved',
    comments: 1,
    likes: 2,
    createdAt: '3주 전',
    commentsList: [
      {
        id: 19,
        author: '강동훈',
        content: 'nodeSelector나 nodeAffinity를 사용해서 노드 선택 조건을 설정할 수 있어요.',
        createdAt: '2주 전',
        likes: 2
      }
    ]
  },
  {
    id: 18,
    title: 'WebSocket 실시간 통신',
    content: 'WebSocket을 사용해서 실시간 채팅을 구현하고 있는데, 연결이 자주 끊어져요.',
    author: '임지수',
    category: '네트워킹',
    course: 'WebSocket 기초',
    language: 'JavaScript',
    status: 'resolved',
    comments: 3,
    likes: 6,
    createdAt: '3주 전',
    commentsList: [
      {
        id: 20,
        author: '신예준',
        content: '하트비트나 재연결 로직을 구현하고, 네트워크 상태를 모니터링해보세요.',
        createdAt: '2주 전',
        likes: 4
      }
    ]
  },
  {
    id: 19,
    title: 'Elasticsearch 검색 최적화',
    content: 'Elasticsearch에서 복잡한 검색 쿼리가 느려요. 성능을 향상시키는 방법이 있을까요?',
    author: '최민지',
    category: '검색엔진',
    course: 'Elasticsearch',
    language: 'Elasticsearch',
    status: 'unresolved',
    comments: 2,
    likes: 3,
    createdAt: '3주 전',
    commentsList: [
      {
        id: 21,
        author: '김도현',
        content: '인덱스 매핑을 최적화하고, 불필요한 필드는 제외하세요. 쿼리 캐싱도 고려해보세요.',
        createdAt: '2주 전',
        likes: 2
      }
    ]
  },
  {
    id: 20,
    title: 'Jest 테스트 코드 작성',
    content: 'Jest를 사용해서 React 컴포넌트 테스트를 작성하고 있는데, 비동기 함수 테스트가 어려워요.',
    author: '박서준',
    category: '테스팅',
    course: 'Jest 마스터',
    language: 'JavaScript',
    status: 'resolved',
    comments: 4,
    likes: 9,
    createdAt: '4주 전',
    commentsList: [
      {
        id: 22,
        author: '이하늘',
        content: 'async/await나 Promise를 사용하고, waitFor나 findBy 쿼리를 활용해보세요.',
        createdAt: '3주 전',
        likes: 6
      }
    ]
  }
];
