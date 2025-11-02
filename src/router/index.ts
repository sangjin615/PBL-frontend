import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes: RouteRecordRaw[] = [
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('../views/AdminReportsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/qna',
    name: 'qna',
    component: () => import('../views/QnAView.vue'),
  },
  {
    path: '/qna/:id',
    name: 'qna-detail',
    component: () => import('../views/QnADetailView.vue'),
  },
  {
    path: '/qna/write',
    name: 'qna-write',
    component: () => import('../views/QnAWriteView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('../views/SubscriptionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/creator/:id',
    name: 'creator-profile',
    component: () => import('../views/CreatorProfileView.vue'),
  },
  {
    path: '/my-submissions',
    name: 'my-submissions',
    component: () => import('../views/MySubmissionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/course/:id',
    name: 'course-overview',
    component: () => import('../views/CourseOverviewView.vue'),
  },
  {
    path: '/curriculum/:id',
    name: 'curriculum-overview',
    component: () => import('../views/CurriculumOverviewView.vue'),
  },
  {
    path: '/curriculum/:id/learn',
    name: 'curriculum-detail',
    component: () => import('../views/CurriculumDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/curriculum/:id/review',
    name: 'curriculum-review',
    component: () => import('../views/CurriculumReviewView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/learn/:lectureId',
    name: 'lecture',
    component: () => import('../views/LectureView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/problem-result/:problemId',
    name: 'problem-result',
    component: () => import('../views/ProblemResultView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/editor/popout/:lectureId',
    name: 'editor-popout',
    component: () => import('../views/EditorPopoutView.vue'),
  },
  {
    path: '/instructor/create-markdown',
    name: 'instructor-create-markdown',
    component: () => import('../views/InstructorCreateMarkdownView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-problem',
    name: 'instructor-create-problem',
    component: () => import('../views/InstructorCreateProblemView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-video',
    name: 'instructor-create-video',
    component: () => import('../views/InstructorCreateVideoView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-curriculum',
    name: 'instructor-create-curriculum',
    component: () => import('../views/InstructorCreateCurriculumView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/assistant/ai',
    name: 'ai-assistant',
    component: () => import('../views/AiAssistantView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('../views/MyPageView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Monaco Editor를 사용하는 페이지 목록
const monacoEditorPages = ['lecture', 'problem-result', 'editor-popout', 'instructor-create-problem', 'instructor-create-markdown', 'instructor-create-video', 'ai-assistant'];

// 라우터 가드: 인증이 필요한 페이지 접근 시 로그인 페이지로 리다이렉트
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // Monaco Editor를 사용하는 페이지 간 이동 시 정리 시간 제공
  const fromMonacoPage = monacoEditorPages.includes(from.name as string);
  const toMonacoPage = monacoEditorPages.includes(to.name as string);
  
  // Monaco Editor 페이지로 이동할 때는 완전한 페이지 새로고침 필요
  // 이렇게 하면 Monaco VSCode API 모듈이 완전히 재초기화됨
  if (toMonacoPage) {
    // Monaco Editor 페이지로 이동하는 경우 (어떤 페이지에서든)
    if (fromMonacoPage) {
      // Monaco Editor 페이지 간 이동은 완전한 페이지 새로고침 사용
      console.log('🔄 Monaco Editor 페이지 간 이동: 완전한 페이지 새로고침');
      window.location.href = to.fullPath;
      return; // next() 호출 안 함
    } else {
      // 다른 페이지에서 Monaco Editor 페이지로 이동할 때도 완전한 새로고침
      // 이미 활성화된 Monaco Editor가 있는 경우
      if (window.__monacoEditorActive) {
        console.log('🔄 Monaco Editor가 이미 활성화되어 있음: 완전한 페이지 새로고침');
        window.location.href = to.fullPath;
        return;
      }
      
      // 이전 인스턴스 정리 시도
      if (window.__monacoEditorCleanup) {
        console.log('🔧 라우터 가드: 이전 Monaco Editor 인스턴스 정리 중...');
        try {
          await window.__monacoEditorCleanup();
        } catch (e) {
          console.warn('⚠️ 라우터 가드에서 정리 중 오류:', e);
        }
      }
      
      // 추가 안전 지연
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } else if (fromMonacoPage) {
    // Monaco Editor 페이지에서 다른 페이지로 나갈 때
    if (window.__monacoEditorActive && window.__monacoEditorCleanup) {
      console.log('🔧 라우터 가드: Monaco Editor 페이지를 떠나며 정리 중...');
      try {
        await window.__monacoEditorCleanup();
      } catch (e) {
        console.warn('⚠️ 라우터 가드에서 정리 중 오류:', e);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 인증이 필요한 페이지인지 확인
  if (to.meta.requiresAuth) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트 (원래 접근하려던 페이지 정보 포함)
    if (!isAuthenticated.value) {
      console.log('인증이 필요한 페이지에 접근하려고 합니다. 로그인 페이지로 리다이렉트합니다.');
      next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      });
      return;
    }
  }

  // 관리자 권한이 필요한 페이지인지 확인
  if (to.meta.requiresAdmin) {
    // 관리자가 아닌 경우 홈 페이지로 리다이렉트
    if (!isAdmin.value) {
      console.log('관리자 권한이 필요한 페이지에 접근하려고 합니다. 홈 페이지로 리다이렉트합니다.');
      next({ name: 'home' });
      return;
    }
  }
  
  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근할 때 대시보드로 리다이렉트
  if ((to.name === 'login' || to.name === 'signup') && isAuthenticated.value) {
    console.log('이미 로그인된 사용자가 로그인/회원가입 페이지에 접근했습니다. 대시보드로 리다이렉트합니다.');
    next({ name: 'dashboard' });
    return;
  }
  
  next();
});

export default router;
